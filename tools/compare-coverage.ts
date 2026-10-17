import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { compareCoverage } from '../lib/coverage/compare'

const record = z.object({
  id: z.string().min(1), employer: z.string(), title: z.string(), sourceUrl: z.string(),
  scope: z.enum(['startup', 'ecosystem', 'out_of_scope', 'unknown']),
  availability: z.enum(['open', 'closed', 'unknown']),
  postedOn: z.iso.date().nullable(), firstObservedOn: z.iso.date(), fetchedOn: z.iso.date(),
})
const inputSchema = z.object({ employerRecords: z.array(record), publicRoster: z.array(record) })

try {
  const path = process.argv[2]
  if (path === '--help' || !path || process.argv.length !== 3) {
    console.log('Usage: node --import tsx tools/compare-coverage.ts path/to/saved-lists.json')
    if (path !== '--help') process.exitCode = 1
  } else {
    const raw: unknown = JSON.parse(readFileSync(path, 'utf8'))
    const input = inputSchema.parse(raw)
    const sample = typeof raw === 'object' && raw !== null && 'note' in raw && typeof raw.note === 'string' && /fictional/i.test(raw.note)
    console.log(JSON.stringify({ data: sample ? 'Fictional sample data; no live coverage claim.' : 'Caller-supplied snapshots; availability and scope were not independently verified.', ...compareCoverage(input) }, null, 2))
  }
} catch (error) {
  console.error(error instanceof z.ZodError ? z.prettifyError(error) : error instanceof Error ? error.message : 'Unable to compare input')
  process.exitCode = 1
}
