import type { CoverageFinding, CoverageInput, CoverageRecord, Disposition } from './types'

const dispositions: Disposition[] = ['listed', 'missing_confirmed_open', 'availability_unknown', 'closed', 'duplicate', 'out_of_scope', 'scope_unknown']

/** Preserve identity-bearing parameters and path case; remove only known tracking. */
export function normalizeSourceUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null
    // Hash-router paths and unknown anchors may identify different jobs.
    if (/^#(?:apply|application)$/i.test(url.hash)) url.hash = ''
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || /^(fbclid|gclid|msclkid)$/i.test(key)) url.searchParams.delete(key)
    }
    url.searchParams.sort()
    url.pathname = url.pathname.replace(/\/+$/, '') || '/'
    return url.href
  } catch {
    return null
  }
}

function identity(record: CoverageRecord): string | null {
  const employer = record.employer.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
  const url = normalizeSourceUrl(record.sourceUrl)
  return employer && url ? JSON.stringify([employer, url]) : null
}

export type CoverageComparison = {
  findings: (CoverageFinding & { record: CoverageRecord })[]
  summary: {
    employerRecords: number
    rosterRecords: number
    uniqueComparableJobs: number
    confirmedOpenEligibleJobs: number
    counts: Record<Disposition, number>
  }
}

/** Compare caller-supplied observations only. No fetching, date guessing or writes. */
export function compareCoverage(input: CoverageInput): CoverageComparison {
  const observations = new Map<string, CoverageRecord[]>()
  const rosterKeys = new Set<string>()
  for (const record of [...input.employerRecords, ...input.publicRoster]) {
    const key = identity(record)
    if (key) observations.set(key, [...(observations.get(key) ?? []), record])
  }
  for (const record of input.publicRoster) {
    const key = identity(record)
    if (key) rosterKeys.add(key)
  }
  const seen = new Map<string, string>()
  const findings = input.employerRecords.map(record => {
    const key = identity(record)
    const related = key ? observations.get(key)! : []
    const states = new Set(related.map(item => item.availability))
    const availabilityConflict = states.has('open') && states.has('closed')
    const eligible = related.some(item => item.scope === 'startup' || item.scope === 'ecosystem')
    const scopeConflict = eligible && related.some(item => item.scope === 'out_of_scope')
    const first = key ? seen.get(key) : undefined
    if (key && first === undefined) seen.set(key, record.id)

    let disposition: Disposition
    let reason: string
    if (!key) {
      disposition = 'availability_unknown'
      reason = 'Cannot compare this record safely: employer is blank or source URL is invalid, non-HTTP(S), or includes credentials.'
    } else if (first !== undefined) {
      disposition = 'duplicate'
      reason = `Same employer and normalized posting URL as ${first}; counted once.`
      if (availabilityConflict) reason += ' Open and closed observations conflict; availability remains unresolved.'
      if (scopeConflict) reason += ' Eligibility observations also conflict.'
    } else if (scopeConflict || record.scope === 'unknown') {
      disposition = 'scope_unknown'
      reason = scopeConflict ? 'Observations disagree on whether this job belongs in the eligible set; review scope.' : 'Startup or startup-support eligibility has not been established.'
    } else if (record.scope === 'out_of_scope') {
      disposition = 'out_of_scope'
      reason = 'Record is explicitly outside the startup and startup-support comparison; retained but excluded from the open-job denominator.'
    } else if (availabilityConflict) {
      disposition = 'availability_unknown'
      reason = 'Open and closed observations share this employer and posting URL; availability remains unresolved.'
    } else if (record.availability === 'closed') {
      disposition = 'closed'
      reason = 'Supplied employer observation says closed; excluded from the open-job denominator.'
    } else if (record.availability === 'unknown') {
      disposition = 'availability_unknown'
      reason = 'Employer availability is unknown; absence or an unreachable source cannot establish closure or a missing open job.'
    } else if (rosterKeys.has(key)) {
      disposition = 'listed'
      reason = 'Confirmed open eligible job has the same employer and normalized posting URL in the supplied roster.'
    } else {
      disposition = 'missing_confirmed_open'
      reason = 'Supplied employer observation confirms an open eligible job with no matching employer and posting URL in the supplied roster.'
    }
    if (availabilityConflict && !reason.includes('unresolved')) reason += ' Open and closed observations conflict; availability remains unresolved.'
    return { id: record.id, disposition, sourceUrl: record.sourceUrl, reason, record: { ...record } }
  })
  const counts = Object.fromEntries(dispositions.map(value => [value, 0])) as Record<Disposition, number>
  for (const finding of findings) counts[finding.disposition]++
  return {
    findings,
    summary: {
      employerRecords: input.employerRecords.length,
      rosterRecords: input.publicRoster.length,
      uniqueComparableJobs: seen.size,
      confirmedOpenEligibleJobs: counts.listed + counts.missing_confirmed_open,
      counts,
    },
  }
}
