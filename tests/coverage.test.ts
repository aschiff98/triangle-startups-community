import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { test } from 'node:test'
import fixture from '../fixtures/job-coverage.json'
import { compareCoverage, normalizeSourceUrl } from '../lib/coverage/compare'
import type { CoverageInput, CoverageRecord } from '../lib/coverage/types'

const sample = fixture as CoverageInput & { expected: Record<string, string> }
const base = sample.employerRecords[0]
const job = (changes: Partial<CoverageRecord>): CoverageRecord => ({ ...base, ...changes })
const run = (employerRecords: CoverageRecord[], publicRoster: CoverageRecord[] = []) => compareCoverage({ employerRecords, publicRoster })

test('all eight fictional examples and denominators are inspectable', () => {
  const result = compareCoverage(sample)
  assert.deepEqual(Object.fromEntries(result.findings.map(f => [f.id, f.disposition])), sample.expected)
  assert.deepEqual(result.summary, { employerRecords: 8, rosterRecords: 1, uniqueComparableJobs: 7, confirmedOpenEligibleJobs: 3, counts: { listed: 1, missing_confirmed_open: 2, availability_unknown: 1, closed: 1, duplicate: 1, out_of_scope: 1, scope_unknown: 1 } })
  assert.ok(result.findings.every(f => f.reason && f.sourceUrl === f.record.sourceUrl))
})

test('normalizes known tracking, fragments, default ports, query order and trailing slashes', () => {
  assert.equal(normalizeSourceUrl('https://EXAMPLE.test:443/jobs/one/?job=42&utm_source=feed&b=2&a=1#apply'), 'https://example.test/jobs/one?a=1&b=2&job=42')
  const employer = job({ sourceUrl: 'https://example.test/jobs/one/?utm_source=feed#apply' })
  const roster = job({ employer: '  EXAMPLE   ORCHARD ', sourceUrl: 'https://example.test/jobs/one' })
  assert.equal(run([employer], [roster]).findings[0].disposition, 'listed')
})

test('preserves job identifiers, path case, hosts, schemes and meaningful query values', () => {
  for (const url of ['https://example.test/jobs?id=2', 'https://example.test/Jobs?id=1', 'http://example.test/jobs?id=1', 'https://other.test/jobs?id=1']) {
    assert.equal(run([job({ sourceUrl: 'https://example.test/jobs?id=1' })], [job({ sourceUrl: url })]).findings[0].disposition, 'missing_confirmed_open')
  }
})

test('equal titles or URLs at different employers never merge', () => {
  const records = [job({ id: 'one' }), job({ id: 'two', employer: 'Example Other' })]
  assert.deepEqual(run(records, [base]).findings.map(f => f.disposition), ['listed', 'missing_confirmed_open'])
})

test('hash-router job identifiers and unknown fragments remain distinct', () => {
  const one = job({ sourceUrl: 'https://example.test/#/jobs/one' })
  const two = job({ sourceUrl: 'https://example.test/#/jobs/two' })
  assert.equal(run([one], [two]).findings[0].disposition, 'missing_confirmed_open')
  assert.equal(run([one, two]).summary.uniqueComparableJobs, 2)
  assert.notEqual(normalizeSourceUrl(base.sourceUrl + '#role-one'), normalizeSourceUrl(base.sourceUrl + '#role-two'))
})

test('deduplicates within an employer and keeps the original source and three dates', () => {
  const records = [job({ id: 'one', postedOn: null }), job({ id: 'two', sourceUrl: base.sourceUrl + '?utm_source=test' })]
  const result = run(records)
  assert.deepEqual(result.findings.map(f => f.disposition), ['missing_confirmed_open', 'duplicate'])
  assert.deepEqual(result.findings.map(f => f.record), records)
  assert.match(result.findings[1].reason, /one/)
  assert.equal(result.summary.confirmedOpenEligibleJobs, 1)
})

test('conflicting availability in either list stays unresolved, including duplicates', () => {
  const closed = job({ id: 'closed', availability: 'closed' })
  for (const result of [run([base], [closed]), run([closed], [base]), run([base, closed]), run([closed, base])]) {
    assert.equal(result.findings[0].disposition, 'availability_unknown')
    assert.match(result.findings[0].reason, /unresolved/)
    assert.equal(result.summary.confirmedOpenEligibleJobs, 0)
    assert.ok(result.findings.every(f => /unresolved/.test(f.reason)))
  }
})

test('unknown or closed employer availability is not promoted by roster presence', () => {
  assert.equal(run([job({ availability: 'unknown' })], [base]).findings[0].disposition, 'availability_unknown')
  assert.equal(run([job({ availability: 'closed' })], [job({ availability: 'unknown' })]).findings[0].disposition, 'closed')
})

test('unknown or conflicting eligibility remains separate from confirmed missing jobs', () => {
  assert.equal(run([job({ scope: 'unknown' })]).findings[0].disposition, 'scope_unknown')
  assert.equal(run([base], [job({ scope: 'out_of_scope' })]).findings[0].disposition, 'scope_unknown')
  assert.equal(run([job({ scope: 'out_of_scope' })]).findings[0].disposition, 'out_of_scope')
})

test('scope exclusions do not hide contradictory availability reports', () => {
  for (const scope of ['unknown', 'out_of_scope'] as const) {
    const result = run([job({ scope })], [job({ scope, availability: 'closed' })])
    assert.equal(result.findings[0].disposition, scope === 'unknown' ? 'scope_unknown' : 'out_of_scope')
    assert.match(result.findings[0].reason, /availability remains unresolved/)
    assert.equal(result.summary.confirmedOpenEligibleJobs, 0)
  }
})

test('unsafe URLs or blank employers cannot establish matches, duplicates or misses', () => {
  for (const sourceUrl of ['broken', '/jobs/one', 'javascript:alert(1)', 'file:///tmp/jobs', 'https://user:password@example.test/jobs']) {
    assert.equal(normalizeSourceUrl(sourceUrl), null)
    assert.equal(run([job({ sourceUrl })]).findings[0].disposition, 'availability_unknown')
  }
  assert.equal(run([job({ employer: ' ' })]).findings[0].disposition, 'availability_unknown')
})

test('results are deterministic and neither retain mutable input references nor modify frozen input', () => {
  const input = structuredClone(sample)
  input.employerRecords.forEach(Object.freeze); input.publicRoster.forEach(Object.freeze)
  Object.freeze(input.employerRecords); Object.freeze(input.publicRoster); Object.freeze(input)
  assert.deepEqual(compareCoverage(input), compareCoverage(input))
  const finding = compareCoverage(input).findings[0]
  finding.record.title = 'Changed output only'
  assert.notEqual(input.employerRecords[0].title, finding.record.title)
  assert.equal(run([]).summary.confirmedOpenEligibleJobs, 0)
})

test('CLI reproduces fictional receipt and rejects structurally invalid input', () => {
  const output = execFileSync(process.execPath, ['--import', 'tsx', 'tools/compare-coverage.ts', 'fixtures/job-coverage.json'], { encoding: 'utf8' })
  const receipt = JSON.parse(output)
  assert.match(receipt.data, /Fictional/)
  assert.deepEqual(receipt.summary, compareCoverage(sample).summary)
  const invalid = spawnSync(process.execPath, ['--import', 'tsx', 'tools/compare-coverage.ts', 'package.json'], { encoding: 'utf8' })
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /employerRecords/)
})
