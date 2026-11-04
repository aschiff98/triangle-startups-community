import { compareCoverage, identity, normalizeEmployer } from './compare'
import type { ImportedFile, ImportedRecord, SkippedRow } from './import-export'
import type { Disposition } from './types'

export const NOTICE = 'This report describes two saved snapshots. It is not a measure of current live coverage or of hiring outcomes.'
export const SNAPSHOT_NOTICE = 'The two files were captured separately, so a difference can come from timing as well as from coverage.'

export const CATEGORIES = {
  listed: 'Already listed',
  missing_startup: 'Confirmed missing open startup jobs',
  eligible_support: 'Explicitly eligible startup-support jobs',
  duplicate: 'Duplicates',
  closed: 'Closed',
  out_of_scope: 'Out of scope',
  needs_review: 'Needs review',
} as const
export type Category = keyof typeof CATEGORIES

export type ReportItem = {
  row: number; employer: string; title: string; sourceUrl: string | null; location: string | null; evidence: string | null
  scope: string; availability: string; postedOn: string | null; firstObservedOn: string | null; fetchedOn: string | null
  matcherDecision: Disposition; reason: string; notes: string[]; onRoster: boolean; employerOnRoster: boolean
}
export type RosterItem = Pick<ReportItem, 'row' | 'employer' | 'title' | 'sourceUrl' | 'postedOn' | 'firstObservedOn' | 'fetchedOn' | 'notes'> & { id: string; listingUrl: string | null }
export type InputSummary = {
  file: string; sha256: string; format: string; schemaVersion: string | null; capturedAt: string | null; captureWindowUtc: string[] | null; note: string | null
  rows: number; imported: number; skipped: number
  firstObserved: { earliest: string | null; latest: string | null }
  lastChecked: { earliest: string | null; latest: string | null }
  unknownDates: { postedOn: number; firstObservedOn: number; fetchedOn: number }
}
export type SavedInput = { file: string; sha256: string; imported: ImportedFile }
export type JobReport = {
  schemaVersion: 'job-export-comparison.v1'; notice: string; snapshotNotice: string
  inputs: { export: InputSummary; roster: InputSummary }
  summary: {
    exportRows: number; rosterRows: number; skippedExportRows: number; skippedRosterRows: number
    counts: Record<Category, number>; rosterOnlyRows: number; rosterRowsMatched: number; sharedRosterLinks: number
  }
  categories: Record<Category, ReportItem[]>
  rosterOnly: RosterItem[]
  sharedRosterLinks: { employer: string; sourceUrl: string; rows: number; titles: string[] }[]
  skipped: { export: SkippedRow[]; roster: SkippedRow[] }
}

const sameText = (a: string, b: string) => a.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase() === b.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()

function range(values: (string | null)[]) {
  const known = values.filter((value): value is string => value !== null).sort()
  return { earliest: known[0] ?? null, latest: known.at(-1) ?? null }
}

function describe({ file, sha256, imported }: SavedInput): InputSummary {
  const { records, skipped, rows, format, metadata } = imported
  const unknown = (pick: (record: ImportedRecord) => string | null) => records.filter(record => pick(record) === null).length
  return {
    file, sha256, format, ...metadata, rows, imported: records.length, skipped: skipped.length,
    firstObserved: range(records.map(record => record.firstObservedOn)),
    lastChecked: range(records.map(record => record.fetchedOn)),
    unknownDates: { postedOn: unknown(r => r.postedOn), firstObservedOn: unknown(r => r.firstObservedOn), fetchedOn: unknown(r => r.fetchedOn) },
  }
}

/** Routes the comparator's decisions into report sections. Evidence gaps only ever move a job to review. */
export function buildJobReport(exportInput: SavedInput, rosterInput: SavedInput): JobReport {
  const exported = exportInput.imported.records, roster = rosterInput.imported.records
  const comparison = compareCoverage({ employerRecords: exported, publicRoster: roster })
  const byId = new Map(exported.map(record => [record.id, record]))
  const rosterByLink = new Map<string, ImportedRecord[]>()
  for (const record of roster) {
    const key = identity(record)
    if (key) rosterByLink.set(key, [...(rosterByLink.get(key) ?? []), record])
  }
  const rosterEmployers = new Set(roster.map(record => normalizeEmployer(record.employer)).filter(Boolean))
  const exportLinks = new Set(exported.map(identity))
  const firstInExport = new Map<string, ImportedRecord>()
  const categories = Object.fromEntries(Object.keys(CATEGORIES).map(name => [name, []])) as unknown as JobReport['categories']

  for (const finding of comparison.findings) {
    const record = byId.get(finding.id)!
    const key = identity(record)
    const matches = key ? rosterByLink.get(key) ?? [] : []
    const first = key ? firstInExport.get(key) : undefined
    if (key && !first) firstInExport.set(key, record)
    const onRoster = matches.length > 0
    const employerOnRoster = rosterEmployers.has(normalizeEmployer(record.employer))
    const titleOnRoster = matches.some(match => sameText(match.title, record.title))
    let category: Category
    let reason = finding.reason

    switch (finding.disposition) {
      case 'listed':
        category = 'listed'
        if (!record.title || !titleOnRoster) { category = 'needs_review'; reason = 'The same employer and link is on the roster under a different title. A shared link does not prove these are the same job.' }
        break
      case 'missing_confirmed_open':
        category = record.scope === 'ecosystem' ? 'eligible_support' : 'missing_startup'
        if (!record.title) { category = 'needs_review'; reason = 'The record says open and eligible, but it has no title to confirm.' }
        else if (!record.fetchedOn) { category = 'needs_review'; reason = 'The record says open, but no check date supports that status.' }
        break
      case 'duplicate':
        category = 'duplicate'
        if (first && !sameText(first.title, record.title)) { category = 'needs_review'; reason = `Same employer and link as export row ${first.row} with a different title. A shared link does not prove a duplicate.` }
        break
      case 'closed': category = 'closed'; break
      case 'out_of_scope': category = 'out_of_scope'; break
      default: category = 'needs_review'
    }

    const notes = [...record.notes]
    if (category === 'needs_review') {
      if (onRoster) notes.push('This link is also on the roster.')
      else if (employerOnRoster) notes.push('The employer is on the roster, but this link is not.')
    }
    if (new Set(matches.map(match => match.title.toLowerCase())).size > 1) notes.push(`The roster uses this link for ${matches.length} rows with different titles.`)
    const { row, employer, title, location, evidence, scope, availability, postedOn, firstObservedOn, fetchedOn, sourceUrl } = record
    categories[category].push({ row, employer, title, sourceUrl: sourceUrl || null, location, evidence, scope, availability, postedOn, firstObservedOn, fetchedOn, matcherDecision: finding.disposition, reason, notes, onRoster, employerOnRoster })
  }

  const rosterOnly: RosterItem[] = roster.filter(record => !exportLinks.has(identity(record)) || identity(record) === null).map(({ id, row, employer, title, sourceUrl, listingUrl, postedOn, firstObservedOn, fetchedOn, notes }) => ({ id, row, employer, title, sourceUrl: sourceUrl || null, listingUrl, postedOn, firstObservedOn, fetchedOn, notes }))
  const sharedRosterLinks = [...rosterByLink.values()].filter(group => group.length > 1).map(group => ({
    employer: group[0].employer, sourceUrl: group[0].sourceUrl, rows: group.length, titles: [...new Set(group.map(record => record.title))],
  }))
  return {
    schemaVersion: 'job-export-comparison.v1', notice: NOTICE, snapshotNotice: SNAPSHOT_NOTICE,
    inputs: { export: describe(exportInput), roster: describe(rosterInput) },
    summary: {
      exportRows: exportInput.imported.rows, rosterRows: rosterInput.imported.rows,
      skippedExportRows: exportInput.imported.skipped.length, skippedRosterRows: rosterInput.imported.skipped.length,
      counts: Object.fromEntries(Object.entries(categories).map(([name, items]) => [name, items.length])) as Record<Category, number>,
      rosterOnlyRows: rosterOnly.length, rosterRowsMatched: roster.length - rosterOnly.length, sharedRosterLinks: sharedRosterLinks.length,
    },
    categories, rosterOnly, sharedRosterLinks, skipped: { export: exportInput.imported.skipped, roster: rosterInput.imported.skipped },
  }
}

const cell = (value: string | number | null | undefined) => value === null || value === undefined || value === '' ? 'unknown' : String(value).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ')
const days = (value: { earliest: string | null; latest: string | null }) => value.earliest ? (value.earliest === value.latest ? value.earliest : `${value.earliest} to ${value.latest}`) : 'unknown'

function inputLines(label: string, input: InputSummary): string[] {
  const captured = input.captureWindowUtc?.join(' to ') ?? input.capturedAt ?? 'not stated in the file'
  return [
    `**${label}:** \`${input.file}\` (${input.format}), ${input.imported} of ${input.rows} rows imported`,
    `- SHA-256: \`${input.sha256}\``, `- Captured: ${captured}`,
    `- First observed: ${days(input.firstObserved)}. Last checked: ${days(input.lastChecked)}`,
    `- Unknown dates: posted ${input.unknownDates.postedOn}, first observed ${input.unknownDates.firstObservedOn}, last checked ${input.unknownDates.fetchedOn}`, '',
  ]
}

function jobTable(items: ReportItem[]): string[] {
  if (!items.length) return ['None.', '']
  return ['| Row | Employer | Role | Link | Posted | First seen | Checked | Why |', '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...items.map(item => `| ${item.row} | ${cell(item.employer)} | ${cell(item.title)} | ${item.sourceUrl ? cell(item.sourceUrl) : 'withheld or missing'} | ${cell(item.postedOn)} | ${cell(item.firstObservedOn)} | ${cell(item.fetchedOn)} | ${cell([item.reason, ...item.notes].join(' '))} |`), '']
}

export function renderMarkdown(report: JobReport): string {
  const { summary, inputs } = report
  const names = Object.keys(CATEGORIES) as Category[]
  const lines = ['# Job export comparison', '', report.notice, '', report.snapshotNotice, '', '## Files compared', '', ...inputLines('Aggregator export', inputs.export), ...inputLines('Triangle Startups roster', inputs.roster),
    '## Summary', '', '| Result | Count |', '| --- | --- |', ...names.map(name => `| ${CATEGORIES[name]} | ${summary.counts[name]} |`),
    `| Roster rows with no matching export link | ${summary.rosterOnlyRows} |`, `| Export rows skipped | ${summary.skippedExportRows} |`, `| Roster rows skipped | ${summary.skippedRosterRows} |`, '']
  for (const name of names) lines.push(`## ${CATEGORIES[name]}`, '', ...jobTable(report.categories[name]))
  lines.push('## Roster rows with no matching export link', '', 'These rows are kept for coverage in the other direction. Absence from the export does not show that a job closed.', '')
  if (report.rosterOnly.length) lines.push('| Row | Employer | Role | Link | First seen | Checked |', '| --- | --- | --- | --- | --- | --- |', ...report.rosterOnly.map(item => `| ${item.row} | ${cell(item.employer)} | ${cell(item.title)} | ${item.sourceUrl ? cell(item.sourceUrl) : 'withheld or missing'} | ${cell(item.firstObservedOn)} | ${cell(item.fetchedOn)} |`), '')
  else lines.push('None.', '')
  lines.push('## Shared roster links', '', 'One link can serve several roles, often a general careers page, so these rows are kept separate and are not treated as duplicates.', '')
  if (report.sharedRosterLinks.length) lines.push('| Employer | Rows | Titles | Link |', '| --- | --- | --- | --- |', ...report.sharedRosterLinks.map(group => `| ${cell(group.employer)} | ${group.rows} | ${cell(group.titles.join('; '))} | ${cell(group.sourceUrl)} |`), '')
  else lines.push('None.', '')
  lines.push('## Skipped rows', '')
  const skipped = [...report.skipped.export.map(item => ({ ...item, side: 'Export' })), ...report.skipped.roster.map(item => ({ ...item, side: 'Roster' }))]
  if (skipped.length) lines.push('| File | Row | Reason |', '| --- | --- | --- |', ...skipped.map(item => `| ${item.side} | ${item.row} | ${cell(item.reason)} |`), '')
  else lines.push('None.', '')
  return lines.join('\n')
}
