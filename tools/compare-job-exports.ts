import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { ImportError, importSavedFile } from '../lib/coverage/import-export'
import { buildJobReport, renderMarkdown, type SavedInput } from '../lib/coverage/job-report'

const usage = 'Usage: node --import tsx tools/compare-job-exports.ts <export.json|csv> <roster.json|csv> [--out-dir directory]'
const MAX_BYTES = 25 * 1024 * 1024

function load(path: string, side: 'export' | 'roster'): SavedInput {
  const file = basename(path)
  let bytes: Buffer
  try {
    if (statSync(path).size > MAX_BYTES) throw new ImportError(`The ${side} file is larger than the 25 MB limit.`)
    bytes = readFileSync(path)
  } catch (error) {
    if (error instanceof ImportError) throw error
    throw new ImportError(`Unable to read the ${side} file ${file}.`)
  }
  return { file, sha256: createHash('sha256').update(bytes).digest('hex'), imported: importSavedFile(bytes.toString('utf8'), file, side) }
}

try {
  const args = process.argv.slice(2)
  const flag = args.indexOf('--out-dir')
  const outDir = flag === -1 ? null : args[flag + 1]
  const paths = flag === -1 ? args : args.toSpliced(flag, 2)
  if (args.includes('--help')) console.log(usage)
  else if (paths.length !== 2 || outDir === undefined || paths.some(path => path.startsWith('--'))) {
    console.error(usage)
    process.exitCode = 1
  } else {
    const report = buildJobReport(load(paths[0], 'export'), load(paths[1], 'roster'))
    const markdown = renderMarkdown(report)
    if (outDir === null) console.log(markdown)
    else {
      const outputs = [[join(outDir, 'job-export-comparison.md'), markdown], [join(outDir, 'job-export-comparison.json'), `${JSON.stringify(report, null, 2)}\n`]]
      if (outputs.some(([target]) => paths.some(path => resolve(path) === resolve(target)))) throw new ImportError('The output would overwrite an input file.')
      mkdirSync(outDir, { recursive: true })
      for (const [target, content] of outputs) writeFileSync(target, content)
      console.log(`Wrote ${outputs.length} files to ${outDir}. ${report.notice}`)
    }
  }
} catch (error) {
  console.error(error instanceof ImportError ? error.message : 'Unable to compare these files.')
  process.exitCode = 1
}
