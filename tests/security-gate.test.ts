import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { checkReport, checkDirectory } from '../tools/check-codeql-results.mjs'

function report(score?: string, level = 'warning') {
  return {
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'CodeQL', rules: [{ id: 'js/example', properties: score === undefined ? {} : { 'security-severity': score, tags: ['security'] } }] } },
      results: [{ ruleId: 'js/example', ruleIndex: 0, level }],
    }],
  }
}

test('security metadata blocks a high-severity warning; moderate findings remain visible without blocking', () => {
  assert.deepEqual(checkReport(report('7.0')), ['js/example'])
  assert.deepEqual(checkReport(report('9.8', 'note')), ['js/example'])
  assert.deepEqual(checkReport(report('6.9')), [])
  assert.deepEqual(checkReport(report(undefined, 'error')), ['js/example'])
})

test('a completed zero-finding scan passes; empty, incomplete and failed scans do not', () => {
  const clean = report()
  clean.runs[0].results = []
  assert.deepEqual(checkReport(clean), [])
  for (const invalid of [{}, { version: '2.1.0', runs: [] }, { version: '2.1.0', runs: [{}] }]) {
    assert.throws(() => checkReport(invalid))
  }
  assert.throws(() => checkReport({ ...clean, runs: [{ ...clean.runs[0], invocations: [{ executionSuccessful: false }] }] }))
})

test('unknown rules, mismatched identities and malformed security scores fail closed', () => {
  for (const score of ['', 'unknown', '11', '-1']) assert.throws(() => checkReport(report(score)))
  const invalid = report('8.0')
  invalid.runs[0].results[0].ruleIndex = 99
  assert.throws(() => checkReport(invalid))
  invalid.runs[0].results[0].ruleIndex = 0
  invalid.runs[0].results[0].ruleId = 'js/different'
  assert.throws(() => checkReport(invalid))
  assert.throws(() => checkReport({ version: '2.1.0', runs: [{ tool: { driver: { name: 'CodeQL', rules: [{ id: 'js/unscored', properties: { tags: ['security'] } }] } }, results: [{ ruleId: 'js/unscored' }] }] }))
})

test('the command rejects missing/malformed output and does not print finding contents', () => {
  const directory = mkdtempSync(join(tmpdir(), 'community-codeql-'))
  try {
    assert.throws(() => checkDirectory(directory))
    writeFileSync(join(directory, 'scan.sarif'), '{malformed')
    assert.throws(() => checkDirectory(directory))
    const blocked = report('8.0')
    const withPrivateMessage = { ...blocked.runs[0].results[0], message: { text: 'DO-NOT-PRINT-THIS-SNIPPET' } }
    writeFileSync(join(directory, 'scan.sarif'), JSON.stringify({ ...blocked, runs: [{ ...blocked.runs[0], results: [withPrivateMessage] }] }))
    const result = spawnSync(process.execPath, ['tools/check-codeql-results.mjs', directory], { encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /1 blocking findings/)
    assert.doesNotMatch(result.stdout + result.stderr, /DO-NOT-PRINT-THIS-SNIPPET/)
    const clean = report()
    clean.runs[0].results = []
    writeFileSync(join(directory, 'scan.sarif'), JSON.stringify(clean))
    assert.equal(spawnSync(process.execPath, ['tools/check-codeql-results.mjs', directory]).status, 0)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
