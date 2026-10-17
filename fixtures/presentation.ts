import { extractEvidence, matchOpportunities } from '../lib/resume-rules/matcher'
import type { MatchResult } from '../lib/resume-rules/schema'
import { candidateText, preferences, snapshot } from './matching'

export const presentationCases = ['All four actions', 'One result', 'No results', 'Reviewer decision', 'Older records', 'Watch only'] as const
export type PresentationCase = typeof presentationCases[number]

/** Fictional presentation cases only; the matcher and its ordering are unchanged. */
export function presentationResult(example: PresentationCase): MatchResult {
  const result = matchOpportunities(extractEvidence(candidateText), preferences, snapshot)
  if (example === 'No results') return { ...result, recommendations: [] }
  if (example === 'One result') return { ...result, recommendations: result.recommendations.slice(0, 1) }
  if (example === 'Watch only') return { ...result, recommendations: result.recommendations.filter(item => item.action === 'watch') }
  if (example === 'Reviewer decision') {
    return { ...result, recommendations: result.recommendations.map((item, index) => index ? item : {
      ...item,
      operatorReview: { action: 'watch', reason: 'Fictional reviewer: confirm the advertised responsibilities before acting.', source: item.opportunity.source, reviewedOn: '2026-10-09' },
    }) }
  }
  if (example === 'Older records') {
    return { ...result, recommendations: result.recommendations.filter(item => item.action === 'apply' || item.action === 'meet').map(item => {
      const historical = { ...item }
      delete historical.action
      return historical
    }) }
  }
  return result
}
