import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { importSavedFile, ImportError, parseCsv } from '../lib/coverage/import-export'
import { buildJobReport, renderMarkdown, type JobReport } from '../lib/coverage/job-report'

const fixture = (name: string) => readFileSync(join('fixtures/job-exports', name), 'utf8')
const SECRET = 'PRIVATE-VALUE-do-not-print'
const job = (changes: object = {}) => ({ employer: 'Example River', title: 'Engineer', sourceUrl: 'https://river.example.test/jobs/1', scope: 'startup', availability: 'open', fetchedOn: '2026-10-20', ...changes })
const exportText = (jobs: unknown[]) => JSON.stringify({ schemaVersion: 'atriveo.job-export.v1', jobs })
const rosterText = (rows: object[] = []) => JSON.stringify({ publicRoster: rows })
const rosterRow = (changes: object = {}) => ({ id: 'r1', employer: 'Example River', title: 'Engineer', sourceUrl: 'https://river.example.test/jobs/1', listingUrl: null, scope: 'startup', availability: 'unknown', postedOn: null, firstObservedOn: null, fetchedOn: null, listedOn: null, ...changes })
const report = (jobs: unknown[], roster: object[] = []): JobReport => buildJobReport(
  { file: 'e.json', sha256: 'a', imported: importSavedFile(exportText(jobs), 'e.json', 'export') },
  { file: 'r.json', sha256: 'b', imported: importSavedFile(rosterText(roster), 'r.json', 'roster') },
)
const onlyCategory = (result: JobReport) => {
  const found = Object.entries(result.categories).filter(([, items]) => items.length)
  assert.equal(found.length, 1)
  return found[0][0]
}
const example = () => buildJobReport(
  { file: 'example-export.json', sha256: 'a', imported: importSavedFile(fixture('example-export.json'), 'example-export.json', 'export') },
  { file: 'example-roster.json', sha256: 'b', imported: importSavedFile(fixture('example-roster.json'), 'example-roster.json', 'roster') },
)
const cli = (...args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', 'tools/compare-job-exports.ts', ...args], { encoding: 'utf8' })

test('the fictional example lands in every report section', () => {
  const { summary, categories, rosterOnly, sharedRosterLinks } = example()
  assert.deepEqual(summary.counts, { listed: 1, missing_startup: 1, eligible_support: 1, duplicate: 1, closed: 1, out_of_scope: 1, needs_review: 3 })
  assert.equal(categories.missing_startup[0].title, 'Software Engineer')
  assert.deepEqual(categories.needs_review.map(item => item.row), [4, 8, 9])
  assert.deepEqual(rosterOnly.map(item => item.id), ['roster-four'])
  assert.equal(sharedRosterLinks.length, 1)
})

test('JSON and CSV exports import the same record facts', () => {
  const json = importSavedFile(fixture('example-export.json'), 'x.json', 'export').records.slice(0, 2)
  const csv = importSavedFile(fixture('example-export.csv'), 'x.csv', 'export').records
  assert.deepEqual(csv.map(r => [r.employer, r.title, r.sourceUrl.split('?')[0], r.scope, r.availability, r.postedOn, r.location]), json.map(r => [r.employer, r.title, r.sourceUrl.split('?')[0], r.scope, r.availability, r.postedOn, r.location]))
  assert.match(csv[1].evidence!, /says "open"/)
})

test('parses quoted commas, escaped quotes, line breaks and a byte order mark', () => {
  assert.deepEqual(parseCsv('\uFEFFa,b\r\n"1,2","x""y"\n"line\nbreak",z\n'), [['a', 'b'], ['1,2', 'x"y'], ['line\nbreak', 'z']])
  assert.throws(() => parseCsv('a\n"open'), ImportError)
})

test('missing and invalid dates stay unknown; timestamps keep their calendar date', () => {
  const [record] = importSavedFile(exportText([job({ fetchedOn: undefined, postedOn: 'yesterday', firstObservedOn: '2026-02-30' })]), 'e.json', 'export').records
  assert.equal(record.fetchedOn, null)
  assert.equal(record.postedOn, null)
  assert.equal(record.firstObservedOn, null)
  assert.equal(record.notes.length, 2)
  assert.equal(importSavedFile(exportText([job({ postedOn: '2026-10-07T12:30:00Z' })]), 'e.json', 'export').records[0].postedOn, '2026-10-07')
})

test('an unknown status or scope never becomes a confirmed missing job', () => {
  assert.equal(onlyCategory(report([job({ availability: 'unknown' })])), 'needs_review')
  assert.equal(onlyCategory(report([job({ availability: undefined })])), 'needs_review')
  assert.equal(onlyCategory(report([job({ availability: 'maybe' })])), 'needs_review')
  assert.equal(onlyCategory(report([job({ scope: undefined })])), 'needs_review')
})

test('open with no check date or no title is held for review', () => {
  assert.match(report([job({ fetchedOn: null })]).categories.needs_review[0].reason, /no check date/)
  assert.match(report([job({ title: '' })]).categories.needs_review[0].reason, /no title/)
})

test('conflicting availability across the two lists is held for review', () => {
  assert.equal(onlyCategory(report([job()], [rosterRow({ availability: 'closed' })])), 'needs_review')
})

test('equal titles at different employers remain separate', () => {
  const result = report([job()], [rosterRow({ employer: 'Example Meadow' })])
  assert.equal(result.summary.counts.missing_startup, 1)
  assert.equal(result.summary.rosterOnlyRows, 1)
})

test('tracking parameters match, while meaningful job IDs stay distinct', () => {
  assert.equal(onlyCategory(report([job({ sourceUrl: 'https://river.example.test/jobs/1?utm_source=feed' })], [rosterRow()])), 'listed')
  assert.equal(onlyCategory(report([job({ sourceUrl: 'https://river.example.test/jobs?id=1' })], [rosterRow({ sourceUrl: 'https://river.example.test/jobs?id=2' })])), 'missing_startup')
})

test('a shared link with a different title is review, not listed or duplicate', () => {
  const listed = report([job({ title: 'Designer' })], [rosterRow()])
  assert.equal(onlyCategory(listed), 'needs_review')
  assert.equal(listed.categories.needs_review[0].matcherDecision, 'listed')
  const twoRoles = report([job(), job({ title: 'Designer' })])
  assert.equal(twoRoles.summary.counts.duplicate, 0)
  assert.equal(twoRoles.summary.counts.needs_review, 1)
  assert.equal(report([job(), job()]).summary.counts.duplicate, 1)
})

test('review notes point out roster matches and known employers', () => {
  const unknown = job({ scope: undefined, availability: undefined })
  assert.match(report([unknown], [rosterRow()]).categories.needs_review[0].notes.join(' '), /link is also on the roster/)
  assert.match(report([unknown], [rosterRow({ sourceUrl: 'https://river.example.test/jobs/2' })]).categories.needs_review[0].notes.join(' '), /employer is on the roster/)
})

test('malformed and credentialed links are held for review and withheld', () => {
  for (const sourceUrl of [`not a url ${SECRET}`, `https://user:${SECRET}@river.example.test/jobs/1`, `ftp://river.example.test/${SECRET}`]) {
    const result = report([job({ sourceUrl })])
    assert.equal(onlyCategory(result), 'needs_review')
    assert.equal(result.categories.needs_review[0].sourceUrl, null)
    assert.ok(!JSON.stringify(result).includes(SECRET) && !renderMarkdown(result).includes(SECRET))
  }
})

test('rows with unexpected private fields are skipped and explained without their values', () => {
  const result = report([job({ resumeText: SECRET }), job({ title: 'Kept', sourceUrl: 'https://river.example.test/jobs/9', [`${SECRET}@example.test`]: 'x' }), job({ title: 'Clean', sourceUrl: 'https://river.example.test/jobs/3' })])
  assert.equal(result.summary.exportRows, 3)
  assert.equal(result.summary.skippedExportRows, 2)
  assert.match(result.skipped.export[0].reason, /"resumeText"/)
  assert.match(result.skipped.export[1].reason, /name withheld/)
  assert.ok(!JSON.stringify(result).includes(SECRET) && !renderMarkdown(result).includes(SECRET))
  assert.equal(result.summary.counts.missing_startup, 1)
})

test('CSV private columns and short rows are skipped without values', () => {
  const imported = importSavedFile(`employer,title,sourceUrl,notes\nA,B,https://a.example.test/1,${SECRET}\n`, 'e.csv', 'export')
  assert.equal(imported.records.length, 0)
  assert.ok(!JSON.stringify(imported).includes(SECRET))
  const short = importSavedFile('employer,title,sourceUrl\nA,B\nC,D,https://a.example.test/1\n', 'e.csv', 'export')
  assert.deepEqual(short.skipped.map(item => item.row), [1])
  assert.equal(short.records[0].row, 2)
})

test('file-level problems are explained without echoing input', () => {
  assert.throws(() => importSavedFile(`{"secret": "${SECRET}" oops`, 'e.json', 'export'), (error: Error) => error instanceof ImportError && !error.message.includes(SECRET))
  assert.throws(() => importSavedFile(JSON.stringify({ schemaVersion: 'atriveo.job-export.v1', jobs: [], inbox: SECRET }), 'e.json', 'export'), /"inbox"/)
  assert.throws(() => importSavedFile(JSON.stringify({ schemaVersion: SECRET, jobs: [] }), 'e.json', 'export'), (error: Error) => !error.message.includes(SECRET))
  assert.throws(() => importSavedFile('employer\nA', 'e.csv', 'export'), /"title"/)
  assert.throws(() => importSavedFile('x', 'e.xlsx', 'export'), /Unsupported export format/)
  assert.throws(() => importSavedFile('[]', 'r.json', 'roster'), /publicRoster/)
})

test('the bundled snapshot keeps all 298 rows, unknown dates and shared links', () => {
  const result = buildJobReport(
    { file: 'e.json', sha256: 'a', imported: importSavedFile(exportText([]), 'e.json', 'export') },
    { file: 'public-jobs.json', sha256: 'b', imported: importSavedFile(readFileSync('datasets/public-jobs/2026-10-18/public-jobs.json', 'utf8'), 'public-jobs.json', 'roster') },
  )
  const { inputs, summary, rosterOnly, sharedRosterLinks } = result
  assert.equal(summary.rosterRows, 298)
  assert.equal(summary.skippedRosterRows, 0)
  assert.equal(rosterOnly.length, 298)
  assert.equal(inputs.roster.unknownDates.firstObservedOn, 5)
  assert.equal(inputs.roster.unknownDates.fetchedOn, 8)
  assert.equal(inputs.roster.unknownDates.postedOn, 104)
  assert.equal(sharedRosterLinks.length, 7)
  assert.equal(inputs.roster.captureWindowUtc?.length, 2)
})

test('the CSV snapshot imports the same rows as the JSON snapshot', () => {
  const dir = 'datasets/public-jobs/2026-10-18'
  const pick = (file: string) => importSavedFile(readFileSync(join(dir, file), 'utf8'), file, 'roster').records.map(({ id, sourceUrl, postedOn, firstObservedOn, fetchedOn }) => ({ id, sourceUrl, postedOn, firstObservedOn, fetchedOn }))
  assert.deepEqual(pick('public-jobs.csv'), pick('public-jobs.json'))
})

test('the fictional publicRoster in the shared fixture is accepted', () => {
  const imported = importSavedFile(readFileSync('fixtures/job-coverage.json', 'utf8'), 'job-coverage.json', 'roster')
  assert.equal(imported.records.length, 1)
  assert.equal(imported.skipped.length, 0)
})

test('the command is repeatable, writes both outputs and leaves inputs unchanged', () => {
  const dir = mkdtempSync(join(tmpdir(), 'job-export-'))
  const inputs = ['fixtures/job-exports/example-export.json', 'fixtures/job-exports/example-roster.json']
  const before = inputs.map(file => readFileSync(file, 'utf8'))
  const first = cli(...inputs)
  assert.equal(first.status, 0)
  assert.equal(cli(...inputs).stdout, first.stdout)
  assert.match(first.stdout, /not a measure of current live coverage/)
  assert.match(first.stdout, /captured separately/)
  assert.equal(cli(...inputs, '--out-dir', dir).status, 0)
  const saved = JSON.parse(readFileSync(join(dir, 'job-export-comparison.json'), 'utf8'))
  assert.equal(saved.inputs.export.file, 'example-export.json')
  assert.match(saved.inputs.export.sha256, /^[0-9a-f]{64}$/)
  assert.deepEqual(inputs.map(file => readFileSync(file, 'utf8')), before)
})

test('the command fails cleanly and never overwrites an input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'job-export-'))
  const bad = join(dir, 'private-export.json')
  writeFileSync(bad, `{"token":"${SECRET}"`)
  const result = cli(bad, 'fixtures/job-exports/example-roster.json')
  assert.equal(result.status, 1)
  assert.ok(!(result.stdout + result.stderr).includes(SECRET))
  const target = join(dir, 'job-export-comparison.json')
  writeFileSync(target, exportText([job()]))
  assert.equal(cli(target, 'fixtures/job-exports/example-roster.json', '--out-dir', dir).status, 1)
  assert.equal(readFileSync(target, 'utf8'), exportText([job()]))
  assert.equal(cli('only-one-file.json').status, 1)
})
