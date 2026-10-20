import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Convert a CodeQL SARIF report into a merge decision without printing snippets. */
export function checkReport(report) {
  if (report?.version !== '2.1.0' || !Array.isArray(report.runs) || !report.runs.length) {
    throw new Error('Missing or invalid CodeQL runs')
  }
  const blocking = []
  for (const run of report.runs) {
    const driver = run.tool?.driver
    if (driver?.name !== 'CodeQL' || !Array.isArray(driver.rules) || !Array.isArray(run.results)) {
      throw new Error('Incomplete CodeQL report')
    }
    if (run.invocations?.some(invocation => invocation.executionSuccessful === false)) {
      throw new Error('CodeQL reported an unsuccessful invocation')
    }
    for (const finding of run.results) {
      const rule = Number.isInteger(finding.ruleIndex)
        ? driver.rules[finding.ruleIndex]
        : driver.rules.find(rule => rule.id === finding.ruleId)
      if (!rule?.id || (finding.ruleId && finding.ruleId !== rule.id)) {
        throw new Error('Finding has no matching CodeQL rule')
      }
      const level = finding.level ?? rule.defaultConfiguration?.level ?? 'warning'
      if (!['none', 'note', 'warning', 'error'].includes(level)) throw new Error('Invalid finding level')
      const score = rule.properties?.['security-severity']
      const security = rule.properties?.tags?.includes('security')
      if ((score !== undefined && (String(score).trim() === '' || !Number.isFinite(Number(score)) || Number(score) < 0 || Number(score) > 10)) || (security && score === undefined)) {
        throw new Error('Security finding has missing or invalid severity')
      }
      if (level === 'error' || (score !== undefined && Number(score) >= 7)) blocking.push(rule.id)
    }
  }
  return blocking
}

export function checkDirectory(directory) {
  const files = readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.sarif(?:\.json)?$/.test(entry.name))
  if (!files.length) throw new Error('No CodeQL SARIF results found')
  return files.flatMap(file => checkReport(JSON.parse(readFileSync(resolve(directory, file.name), 'utf8'))))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const blocking = checkDirectory(process.argv[2] ?? 'codeql-results')
    console.log(`CodeQL gate: ${blocking.length} blocking findings`)
    if (blocking.length) process.exitCode = 1
  } catch {
    console.error('CodeQL gate: missing, invalid or unsuccessful scan; review the analysis logs')
    process.exitCode = 1
  }
}
