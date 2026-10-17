import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import input from '../experiments/claude/job-review-packet/input.json'
import { allowedPaths, checkPacket, checkScope } from '../tools/review-claude-trial.mjs'

const packet = () => ({ data: input.data, proposedAdditions: input.findings.filter(f => f.disposition === 'missing_confirmed_open'), needsReview: input.findings.filter(f => ['availability_unknown', 'scope_unknown', 'closed'].includes(f.disposition)), excluded: input.findings.filter(f => ['listed', 'duplicate', 'out_of_scope'].includes(f.disposition)), summary: { proposedAdditions: 2, needsReview: 3, excluded: 3 } })

test('review packet keeps all eight findings, two eligible additions and three manual reviews', () => {
  const before = structuredClone(input)
  assert.deepEqual(checkPacket(input, packet()), [])
  assert.deepEqual(input, before)
  assert.ok(packet().proposedAdditions.some(f => f.record.scope === 'ecosystem'))
})
test('uncertain or closed findings cannot be promoted to additions by changing counts', () => {
  for (const id of ['unknown', 'closed', 'scope-unknown']) {
    const p = structuredClone(packet())
    const index = p.needsReview.findIndex(f => f.id === id)
    assert.ok(index >= 0)
    p.proposedAdditions.push(...p.needsReview.splice(index, 1))
    p.summary.proposedAdditions++; p.summary.needsReview--
    assert.ok(checkPacket(input, p).some(error => error.includes('Wrong group')))
  }
})
test('all evidence, dates, URLs and uncertainty reasons must survive without invented additions', () => {
  for (const mutate of [
    (p: ReturnType<typeof packet>) => { p.proposedAdditions[0].record.fetchedOn = '2026-10-15' },
    (p: ReturnType<typeof packet>) => { p.proposedAdditions[0].sourceUrl = 'https://invented.example.test/job' },
    (p: ReturnType<typeof packet>) => { p.needsReview[0].reason = 'Nothing to check.' },
  ]) {
    const p = structuredClone(packet()); mutate(p)
    assert.ok(checkPacket(input, p).some(error => error.includes('Evidence changed')))
  }
})
test('missing, duplicate, unexpected and miscounted records fail', () => {
  const p = structuredClone(packet()); p.excluded.pop(); p.excluded.push(p.proposedAdditions[0])
  assert.ok(checkPacket(input, p).some(error => error.includes('Duplicate finding')))
  assert.ok(checkPacket(input, p).some(error => error.includes('Missing finding')))
  p.proposedAdditions[0].id = 'invented'
  p.summary.proposedAdditions = 99
  const errors = checkPacket(input, p)
  assert.ok(errors.some(error => error.includes('Unexpected finding')))
  assert.ok(errors.some(error => error.includes('count does not match')))
})
test('malformed packets, extra write instructions and changed fictional labels fail', () => {
  for (const value of [null, [], {}, { ...packet(), sql: 'UPDATE jobs' }]) assert.ok(checkPacket(input, value).length)
  const p = packet(); p.data = 'Live verified coverage'
  assert.ok(checkPacket(input, p).length)
  const reordered = packet(); reordered.excluded.reverse()
  assert.ok(checkPacket(input, reordered).some(error => error.includes('finding order')))
})
function repository(run: (root: string, base: string, git: (args: string[]) => string) => void) {
  const root = mkdtempSync(join(tmpdir(), 'claude-trial-test-'))
  const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  try {
    git(['init', '-q']); git(['config', 'user.name', 'Fictional test']); git(['config', 'user.email', 'fixture@example.test'])
    writeFileSync(join(root, 'README.md'), 'Fictional baseline\n'); writeFileSync(join(root, '.gitignore'), '.env*\n')
    git(['add', 'README.md', '.gitignore']); git(['commit', '-qm', 'baseline'])
    run(root, git(['rev-parse', 'HEAD']), git)
  } finally { rmSync(root, { recursive: true, force: true }) }
}
test('scope catches committed, dirty and untracked changes outside the three allowed paths', () => repository((root, base, git) => {
  mkdirSync(join(root, '.github/workflows'), { recursive: true }); writeFileSync(join(root, '.github/workflows/changed.yml'), 'name: unexpected\n')
  git(['add', '.github/workflows/changed.yml']); git(['commit', '-qm', 'outside scope'])
  writeFileSync(join(root, 'README.md'), 'Changed\n'); writeFileSync(join(root, 'untracked.txt'), 'Unexpected\n')
  const errors = checkScope(root, base)
  for (const path of ['.github/workflows/changed.yml', 'README.md', 'untracked.txt']) assert.ok(errors.some(error => error.includes(path)))
  assert.ok(checkScope(root, 'main').length)
}))
test('scope rejects symlinks and ignored loadable env files while allowing regular task files', () => repository((root, base) => {
  const file = join(root, allowedPaths[0]); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, 'export {}\n')
  assert.deepEqual(checkScope(root, base), [])
  rmSync(file); symlinkSync(join(root, 'README.md'), file)
  assert.ok(checkScope(root, base).some(error => error.includes('regular file')))
  writeFileSync(join(root, '.env.local'), 'FICTIONAL_ONLY=true\n')
  assert.ok(checkScope(root, base).some(error => error.includes('environment file')))
}))
test('CLI inspects saved data and scope without executing submitted code', () => repository((root, base) => {
  const file = join(root, allowedPaths[0]); mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `throw new Error('Submitted code must not run')\n`)
  const temp = mkdtempSync(join(tmpdir(), 'claude-trial-packet-'))
  try {
    const reference = join(temp, 'input.json'), candidate = join(temp, 'packet.json')
    writeFileSync(reference, JSON.stringify(input)); writeFileSync(candidate, JSON.stringify(packet()))
    const result = spawnSync(process.execPath, [resolve('tools/review-claude-trial.mjs'), base, reference, candidate], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.equal(JSON.parse(result.stdout).submittedCodeExecuted, false)
    const bad = spawnSync(process.execPath, [resolve('tools/review-claude-trial.mjs')], { cwd: root, encoding: 'utf8' })
    assert.equal(bad.status, 1); assert.match(bad.stderr, /Usage:/)
  } finally { rmSync(temp, { recursive: true, force: true }) }
}))
