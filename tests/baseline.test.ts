import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractEvidence, matchOpportunities } from '../lib/resume-rules/matcher'
import { candidateText, preferences, snapshot } from '../fixtures/matching'
import { recommendationAction } from '../lib/resume-rules/schema'

test('fictional baseline preserves action distinctions, unknowns, evidence and holds', () => {
  const result = matchOpportunities(extractEvidence(candidateText), preferences, snapshot)
  assert.deepEqual(result.recommendations.map(recommendationAction), ['apply', 'clarify', 'meet', 'watch'])
  assert.equal(result.modelCalls, 0)
  assert.deepEqual(result.exclusions.map(item => item.id), ['held-example'])
  assert.match(result.recommendations[1].questions.join(' '), /does not establish that you lack/)
  assert.match(result.recommendations[2].nextAction, /No opening or introduction is promised/)
  assert.match(result.recommendations[3].questions.join(' '), /14 days old/)
  assert.ok(result.recommendations.every(item => item.candidate.length && item.employer.length))
})
test('empty input establishes no opening or employer interest', () => {
  const result = matchOpportunities(extractEvidence(candidateText), preferences, { ...snapshot, opportunities: [] })
  assert.equal(result.recommendations.length, 0)
  assert.equal(result.exclusions.length, 0)
})
