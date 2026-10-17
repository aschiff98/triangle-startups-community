import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { pathToFileURL } from 'node:url'

export const allowedPaths = ['lib/coverage/review-packet.ts', 'tools/prepare-job-review.ts', 'tests/job-review-packet.test.ts']
const groups = ['proposedAdditions', 'needsReview', 'excluded']
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const exactKeys = (value, keys) => object(value) && isDeepStrictEqual(Object.keys(value).sort(), [...keys].sort())
const groupFor = disposition => disposition === 'missing_confirmed_open' ? 'proposedAdditions'
  : ['availability_unknown', 'scope_unknown', 'closed'].includes(disposition) ? 'needsReview'
  : ['listed', 'duplicate', 'out_of_scope'].includes(disposition) ? 'excluded' : null

/** Inspect saved data only. Never import or execute the submitted implementation. */
export function checkPacket(reference, packet) {
  const errors = []
  if (!object(reference) || !Array.isArray(reference.findings)) return ['Reference findings are invalid.']
  if (!exactKeys(packet, ['data', ...groups, 'summary'])) return ['Packet must contain only data, the three groups and summary.']
  if (packet.data !== reference.data) errors.push('Preserve the fictional-data label exactly.')
  if (!exactKeys(packet.summary, groups)) errors.push('Summary must contain exactly the three group counts.')
  const expected = new Map(reference.findings.map(item => [item.id, item]))
  if (expected.size !== reference.findings.length || reference.findings.some(item => !groupFor(item.disposition))) return ['Reference findings have duplicate IDs or unknown dispositions.']
  const seen = new Set()
  for (const group of groups) {
    if (!Array.isArray(packet[group])) { errors.push(`${group} must be an array.`); continue }
    const expectedIds = reference.findings.filter(item => groupFor(item.disposition) === group).map(item => item.id)
    if (!isDeepStrictEqual(packet[group].map(item => item?.id), expectedIds)) errors.push(`${group} must preserve the expected finding order.`)
    if (packet.summary?.[group] !== packet[group].length) errors.push(`${group} count does not match its records.`)
    for (const item of packet[group]) {
      if (!object(item) || typeof item.id !== 'string') { errors.push(`${group} contains an invalid finding.`); continue }
      const original = expected.get(item.id)
      if (seen.has(item.id)) errors.push(`Duplicate finding: ${item.id}.`)
      seen.add(item.id)
      if (!original) errors.push(`Unexpected finding: ${item.id}.`)
      else {
        if (groupFor(original.disposition) !== group) errors.push(`Wrong group for ${item.id}.`)
        if (!isDeepStrictEqual(item, original)) errors.push(`Evidence changed for ${item.id}; preserve the complete finding.`)
      }
    }
  }
  for (const id of expected.keys()) if (!seen.has(id)) errors.push(`Missing finding: ${id}.`)
  return errors
}

/** Compare the whole candidate tree, including commits, staged edits and untracked files. */
export function checkScope(cwd, baseline) {
  if (!/^[a-f0-9]{40}$/.test(baseline)) return ['Use the full frozen baseline commit SHA.']
  const git = args => execFileSync('git', ['-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null', ...args], { cwd, encoding: 'utf8' })
  git(['cat-file', '-e', `${baseline}^{commit}`])
  const changed = new Set([
    ...git(['diff', '--no-ext-diff', '--no-textconv', '--no-renames', '--name-only', '-z', baseline, '--']).split('\0'),
    ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
  ].filter(Boolean))
  const errors = [...changed].filter(path => !allowedPaths.includes(path)).map(path => `Outside task scope: ${path}.`)
  for (const path of allowedPaths) {
    try { if (!lstatSync(resolve(cwd, path)).isFile()) errors.push(`Task path must be a regular file: ${path}.`) }
    catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  for (const name of readdirSync(cwd)) {
    if ((name === '.env' || name.startsWith('.env.')) && name !== '.env.example') errors.push(`Remove loadable environment file before a trial: ${name}.`)
  }
  return errors
}

function readJson(path) {
  const stat = lstatSync(path)
  if (!stat.isFile() || stat.size > 1_000_000) throw new Error('Input must be a regular JSON file under 1MB.')
  return JSON.parse(readFileSync(path, 'utf8'))
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [baseline, input, packet, ...extra] = process.argv.slice(2)
    if (!baseline || !input || !packet || extra.length) throw new Error('Usage: node review.mjs FULL_BASELINE_SHA trusted-input.json candidate-packet.json')
    const scopeErrors = checkScope(process.cwd(), baseline)
    const packetErrors = checkPacket(readJson(input), readJson(packet))
    console.log(JSON.stringify({ status: scopeErrors.length || packetErrors.length ? 'failed' : 'scope_and_packet_checks_passed', baseline, scopeErrors, packetErrors,
      submittedCodeExecuted: false, remaining: ['Independent test, typecheck and build results', 'Source review and human merge decision'] }, null, 2))
    if (scopeErrors.length || packetErrors.length) process.exitCode = 1
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
