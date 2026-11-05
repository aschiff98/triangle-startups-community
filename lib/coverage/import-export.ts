import { normalizeSourceUrl } from './compare'
import type { CoverageRecord } from './types'

/** Reads saved text only. Messages name files, rows and fields; they never repeat input values. */
export class ImportError extends Error {}

export const EXPORT_SCHEMA = 'atriveo.job-export.v1'
export const EXPORT_FIELDS = ['employer', 'title', 'sourceUrl', 'scope', 'availability', 'postedOn', 'firstObservedOn', 'fetchedOn', 'location', 'evidence'] as const
export const ROSTER_FIELDS = ['id', 'employer', 'title', 'sourceUrl', 'listingUrl', 'scope', 'availability', 'postedOn', 'firstObservedOn', 'fetchedOn', 'listedOn'] as const
const EXPORT_TOP_LEVEL = ['schemaVersion', 'capturedAt', 'jobs']
const SCOPES: readonly string[] = ['startup', 'ecosystem', 'out_of_scope', 'unknown']
const AVAILABILITY: readonly string[] = ['open', 'closed', 'unknown']
const DATE_FIELDS = ['postedOn', 'firstObservedOn', 'fetchedOn'] as const

export type ImportedRecord = CoverageRecord & {
  /** 1-based data row in the source file; not a job identity. */
  row: number; listingUrl: string | null; location: string | null; evidence: string | null; notes: string[]
}
export type SkippedRow = { row: number; reason: string }
export type ImportedFile = {
  format: 'json' | 'csv'; rows: number; records: ImportedRecord[]; skipped: SkippedRow[]
  metadata: { schemaVersion: string | null; capturedAt: string | null; captureWindowUtc: string[] | null; note: string | null }
}
type Side = 'export' | 'roster'
type Row = Record<string, unknown>

/** A field name is only repeated when it looks like one, so a value used as a CSV header stays hidden. */
const fieldLabel = (name: string) => /^[A-Za-z][A-Za-z0-9_ -]{0,40}$/.test(name) ? `"${name}"` : '(name withheld)'
const text = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const optional = (value: unknown) => text(value) || null

function isoDate(value: unknown, field: string, notes: string[]): string | null {
  if (value === null || value === undefined || value === '') return null
  const match = typeof value === 'string' ? /^(\d{4}-\d{2}-\d{2})(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/.exec(value.trim()) : null
  const parsed = match ? new Date(`${match[1]}T00:00:00Z`) : null
  if (match && parsed && !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(match[1])) return match[1]
  notes.push(`${field} was not a valid date, so it stays unknown.`)
  return null
}

function choice<T extends string>(value: unknown, allowed: readonly string[], field: string, notes: string[]): T {
  const given = text(value)
  if (!given) return 'unknown' as T
  if (allowed.includes(given)) return given as T
  notes.push(`${field} was not a recognised value, so it stays unknown.`)
  return 'unknown' as T
}

function toRecord(raw: unknown, row: number, side: Side): ImportedRecord | SkippedRow {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { row, reason: 'Row is not an object.' }
  const input = raw as Row
  const allowed: readonly string[] = side === 'export' ? EXPORT_FIELDS : ROSTER_FIELDS
  const unexpected = Object.keys(input).filter(key => !allowed.includes(key))
  if (unexpected.length) return { row, reason: `Rejected unexpected field(s) ${unexpected.map(fieldLabel).join(', ')}; the row was not imported and its values were not read.` }

  const notes: string[] = []
  const employer = text(input.employer), title = text(input.title), link = text(input.sourceUrl)
  if (!employer) notes.push('Employer is missing.')
  if (!title) notes.push('Title is missing.')
  const usable = normalizeSourceUrl(link) !== null
  if (!usable) notes.push(link ? 'Source link is invalid, not HTTP(S), or contains credentials, so it is withheld.' : 'Source link is missing.')
  const dates = Object.fromEntries(DATE_FIELDS.map(field => [field, isoDate(input[field], field, notes)])) as Record<typeof DATE_FIELDS[number], string | null>
  return {
    id: side === 'roster' && text(input.id) || `${side}-row-${row}`, row, employer, title, sourceUrl: usable ? link : '',
    scope: choice(input.scope, SCOPES, 'scope', notes), availability: choice(input.availability, AVAILABILITY, 'availability', notes), ...dates,
    listingUrl: optional(input.listingUrl), location: optional(input.location), evidence: optional(input.evidence), notes,
  }
}

function importRows(rows: unknown[], side: Side, rowErrors: SkippedRow[] = []) {
  const records: ImportedRecord[] = [], skipped = [...rowErrors]
  rows.forEach((raw, index) => {
    const result = toRecord(raw, index + 1, side)
    if ('employer' in result) records.push(result); else skipped.push(result)
  })
  return { records, skipped: skipped.sort((a, b) => a.row - b.row) }
}

/** RFC 4180 rows: quoted commas, doubled quotes and embedded line breaks. */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let cells: string[] = [], cell = '', quoted = false, wasQuoted = false
  const endCell = () => { cells.push(cell); cell = ''; wasQuoted = false }
  const endRow = () => { endCell(); if (cells.length > 1 || cells[0] !== '') rows.push(cells); cells = [] }
  const content = input.replace(/^\uFEFF/, '')
  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    if (quoted) {
      if (char !== '"') cell += char
      else if (content[i + 1] === '"') { cell += '"'; i++ }
      else quoted = false
    } else if (char === '"') {
      if (cell || wasQuoted) throw new ImportError('CSV file has a quote in the wrong place.')
      quoted = true; wasQuoted = true
    } else if (char === ',') endCell()
    else if (char === '\n') endRow()
    else if (char !== '\r') cell += char
  }
  if (quoted) throw new ImportError('CSV file has an unterminated quote.')
  if (cell || cells.length) endRow()
  return rows
}

function fromCsv(input: string, side: Side): ImportedFile {
  const [header, ...rows] = parseCsv(input)
  if (!header) throw new ImportError(`The ${side} CSV file is empty.`)
  const columns = header.map(name => name.trim())
  for (const required of ['employer', 'title', 'sourceUrl']) {
    if (!columns.includes(required)) throw new ImportError(`The ${side} CSV file has no "${required}" column.`)
  }
  const objects: unknown[] = [], rowErrors: SkippedRow[] = []
  rows.forEach((cells, index) => {
    if (cells.length !== columns.length) {
      rowErrors.push({ row: index + 1, reason: `Row has ${cells.length} columns; the header has ${columns.length}.` })
      objects.push(null) // Keeps row numbers aligned; this row is explained by rowErrors.
    } else objects.push(Object.fromEntries(columns.map((name, column) => [name, cells[column]])))
  })
  const { records, skipped } = importRows(objects, side)
  const merged = skipped.filter(item => !rowErrors.some(error => error.row === item.row)).concat(rowErrors).sort((a, b) => a.row - b.row)
  return { format: 'csv', rows: rows.length, records, skipped: merged, metadata: { schemaVersion: null, capturedAt: null, captureWindowUtc: null, note: null } }
}

function parseJson(input: string, side: Side): unknown {
  // JSON.parse errors can quote the input, so they are replaced rather than passed on.
  try { return JSON.parse(input.replace(/^\uFEFF/, '')) } catch { throw new ImportError(`The ${side} file is not valid JSON.`) }
}

function exportFromJson(input: string): ImportedFile {
  const parsed = parseJson(input, 'export')
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new ImportError(`The export must be an object with schemaVersion "${EXPORT_SCHEMA}" and a jobs array.`)
  const file = parsed as Row
  const unexpected = Object.keys(file).filter(key => !EXPORT_TOP_LEVEL.includes(key))
  if (unexpected.length) throw new ImportError(`The export has unexpected top-level field(s) ${unexpected.map(fieldLabel).join(', ')}.`)
  if (file.schemaVersion !== EXPORT_SCHEMA) throw new ImportError(`Unsupported export schemaVersion; expected "${EXPORT_SCHEMA}".`)
  if (!Array.isArray(file.jobs)) throw new ImportError('The export has no jobs array.')
  const notes: string[] = []
  return { format: 'json', rows: file.jobs.length, ...importRows(file.jobs, 'export'), metadata: { schemaVersion: EXPORT_SCHEMA, capturedAt: isoDate(file.capturedAt, 'capturedAt', notes), captureWindowUtc: null, note: null } }
}

function rosterFromJson(input: string): ImportedFile {
  const parsed = parseJson(input, 'roster')
  const file = (typeof parsed === 'object' && parsed !== null ? parsed : {}) as Row
  if (!Array.isArray(file.publicRoster)) throw new ImportError('The roster file has no publicRoster array.')
  const window = Array.isArray(file.captureWindowUtc) && file.captureWindowUtc.every(item => typeof item === 'string') ? file.captureWindowUtc as string[] : null
  return {
    format: 'json', rows: file.publicRoster.length, ...importRows(file.publicRoster, 'roster'),
    metadata: { schemaVersion: optional(file.schemaVersion), capturedAt: null, captureWindowUtc: window, note: optional(file.note) },
  }
}

/** The file extension selects the parser; anything else is an unsupported format. */
export function importSavedFile(input: string, fileName: string, side: Side): ImportedFile {
  const extension = /\.([a-z0-9]+)$/i.exec(fileName)?.[1].toLowerCase()
  if (extension === 'csv') return fromCsv(input, side)
  if (extension === 'json') return side === 'export' ? exportFromJson(input) : rosterFromJson(input)
  throw new ImportError(`Unsupported ${side} format; use a .json or .csv file.`)
}
