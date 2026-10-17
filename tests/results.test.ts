import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Results } from '../app/resume/rules/results'
import { presentationResult } from '../fixtures/presentation'
import { recommendationAction, type MatchResult } from '../lib/resume-rules/schema'

const render = (result: MatchResult) => renderToStaticMarkup(createElement(Results, { result }))
const compact = (html: string) => html.split('aria-labelledby="next-steps-heading"')[1].split('</section>')[0]
const destinations = (html: string) => [...html.matchAll(/href="#result-([^"]+)"/g)].map(match => decodeURIComponent(match[1]))

test('compact section keeps the first three in input order with reasons, sources and full-evidence destinations', () => {
  const result = presentationResult('All four actions')
  const html = render(result)
  const first = compact(html)
  assert.deepEqual(destinations(first), result.recommendations.slice(0, 3).map(item => item.opportunity.id))
  assert.equal((first.match(/<li /g) ?? []).length, 3)
  for (const item of result.recommendations.slice(0, 3)) {
    assert.ok(first.includes(item.opportunity.source))
    assert.ok(first.includes(item.basis))
  }
  for (const item of result.recommendations) assert.ok(html.includes(`id="result-${item.opportunity.id}"`))
  assert.ok(html.indexOf('Your next steps') < html.indexOf('All results and evidence'))
  assert.match(html, /Full supplied employer text/)
  assert.match(html, /Your evidence/)
})

test('one and zero results do not fabricate extra suggestions', () => {
  assert.equal(destinations(compact(render(presentationResult('One result')))).length, 1)
  const empty = compact(render(presentationResult('No results')))
  assert.deepEqual(destinations(empty), [])
  assert.match(empty, /No next steps in this snapshot/)
  assert.doesNotMatch(empty, /View advertised job/)
})

test('each action keeps its destination and caveat, including Watch outside the initial three', () => {
  const result = presentationResult('All four actions')
  for (const item of result.recommendations) {
    const first = compact(render({ ...result, recommendations: [item] }))
    const action = recommendationAction(item)
    assert.ok(first.includes(item.opportunity.source))
    if (action === 'apply') assert.match(first, /View advertised job/)
    if (action === 'clarify') assert.match(first, /Not mentioned in your confirmed evidence: sql/i)
    if (action === 'meet') assert.match(first, /No opening or hiring interest is established/)
    if (action === 'watch') assert.match(first, /more than 14 days old/)
    if (action !== 'apply') assert.doesNotMatch(first, /View advertised job/)
  }
})

test('reviewer overrides label and reason without replacing original evidence or leaking the old Apply advice', () => {
  const result = presentationResult('Reviewer decision')
  result.recommendations[0].operatorReview!.source = 'https://orchard.example.test/reviewer-note'
  const html = render(result)
  const first = compact(html).split('</li>')[0]
  assert.match(first, />Watch</)
  assert.match(first, /Fictional reviewer/)
  assert.match(first, /Reviewer decision/)
  assert.match(first, /orchard.example.test\/reviewer-note/)
  assert.match(first, /Refresh availability/)
  assert.doesNotMatch(first, /View advertised job|apply if they hold/)
  assert.match(html, /Original action: apply/)
  assert.ok(html.includes(result.recommendations[0].candidate[0].quote))
})

test('an Apply override still links to the advertised posting, with the rationale source separately available', () => {
  const result = presentationResult('All four actions')
  result.recommendations[0].operatorReview = { action: 'apply', reason: 'Fictional reviewed evidence.', source: 'https://orchard.example.test/review', reviewedOn: '2026-10-09' }
  const first = compact(render(result))
  assert.match(first, /href="https:\/\/orchard.example.test\/jobs\/one"[^>]*>View advertised job/)
  assert.match(first, /href="https:\/\/orchard.example.test\/review"/)
})

test('older records retain conservative fallback actions and unknown skills stay unknown', () => {
  const old = presentationResult('Older records')
  const first = compact(render(old))
  assert.deepEqual(old.recommendations.map(recommendationAction), ['clarify', 'watch'])
  assert.equal((first.match(/Older record/g) ?? []).length, 2)
  assert.doesNotMatch(first, /View advertised job/)
  assert.match(render(presentationResult('All four actions')), /This does not establish that you lack them/)
})

test('hostile text is escaped, arbitrary ids have reachable anchors and rendering is immutable', () => {
  const result = structuredClone(presentationResult('One result'))
  result.recommendations[0].opportunity.id = 'example / test#1'
  result.recommendations[0].opportunity.title = '<script>alert(1)</script>'
  const before = structuredClone(result)
  const html = render(result)
  assert.deepEqual(result, before)
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
  const anchor = encodeURIComponent(result.recommendations[0].opportunity.id)
  assert.ok(html.includes(`href="#${encodeURIComponent(`result-${anchor}`)}"`) && html.includes(`id="result-${anchor}"`))
})
