import { isCompanyMatchHeld } from '../company-evidence-holds'
import { actions, recommendationAction, levels, type Evidence, type MatchResult, type Opportunity, type Preferences, type Recommendation, type Snapshot } from './schema'

export const RULE_VERSION = 'rules-v2'
// A small, inspectable vocabulary. No embeddings, training or generated synonyms.
export const concepts: Record<string, readonly string[]> = {
  javascript: ['javascript', 'js'], typescript: ['typescript'], react: ['react', 'react.js'],
  python: ['python'], sql: ['sql', 'postgresql', 'postgres'], java: ['java'],
  excel: ['excel', 'spreadsheets'], analytics: ['analytics', 'data analysis', 'data analytics'],
  research: ['research', 'user interviews'], design: ['figma', 'ux', 'user experience', 'usability'],
  product: ['product management', 'product manager', 'product discovery', 'roadmap', 'roadmaps'],
  sales: ['sales', 'prospecting', 'account executive'], customer: ['customer support', 'customer success', 'client support'],
  operations: ['operations', 'logistics', 'scheduling', 'supply chain'],
  project: ['project management', 'project manager', 'project coordination', 'coordinated projects'],
  lab: ['laboratory', 'lab', 'assay', 'assays'], biology: ['biology', 'biochemistry', 'cell culture'],
  devops: ['devops', 'ci/cd', 'kubernetes', 'infrastructure as code'],
  implementation: ['implementation', 'onboarding', 'workflow automation'],
  prototyping: ['prototyping', 'prototypes', 'prototype'],
  'machine learning': ['machine learning'],
  'ai tooling': ['llm', 'llms', 'ai agents', 'ai agent', 'generative ai'],
  'healthcare software': ['healthcare software', 'health care software', 'clinical software', 'patient monitoring'],
  wearables: ['wearable', 'wearables', 'on-device', 'embedded systems'],
  payments: ['payments', 'payment processing'],
  fraud: ['fraud', 'fraud detection'],
  hardware: ['hardware', 'oem', 'hardware commercialization'],
  finance: ['accounting', 'financial analysis', 'financial modeling', 'bookkeeping', 'fp&a', 'financial planning and analysis'],
}
const titlePatterns: Record<Preferences['direction'], RegExp> = {
  software: /\b(software|frontend|front.end|backend|back.end|full.stack|developer|devops|platform engineer|implementation engineer|forward.deployed engineer)\b/i,
  data: /\b(data|analytics|business intelligence|machine learning)\b/i,
  product: /\bproduct\b/i, design: /\b(design|ux|user experience)\b/i,
  sales: /\b(sales|account executive|business development)\b/i,
  customer: /\b(customer|support|implementation|solutions)\b/i,
  operations: /\b(operations|logistics|project coord|supply chain)\b/i,
  science: /\b(scientist|research|laboratory|lab |clinical|biolog|chemist)\b/i,
  finance: /\b(finance|financial|accounting|accountant|fp&a)\b/i,
}
const researchConcepts: Record<Preferences['direction'], string[]> = {
  software: ['javascript', 'typescript', 'react', 'python', 'java', 'devops', 'implementation', 'prototyping'], data: ['sql', 'python', 'analytics', 'excel'],
  product: ['product', 'research', 'analytics', 'prototyping'], design: ['design', 'research'], sales: ['sales'],
  customer: ['customer', 'project', 'implementation'], operations: ['operations', 'project', 'excel'],
  science: ['biology', 'lab', 'research'], finance: ['finance', 'excel'],
}
function escape(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function aliasPattern(alias: string) { return new RegExp(`(^|[^a-z0-9])${escape(alias)}(?=$|[^a-z0-9])`, 'i') }
function has(text: string, aliases: readonly string[]) {
  return aliases.some(alias => aliasPattern(alias).test(text))
}
function evidenceQuote(text: string, aliases: readonly string[]) {
  const index = aliases.map(alias => text.search(aliasPattern(alias))).find(index => index >= 0) ?? 0
  const start = Math.max(0, index - 180)
  return text.slice(start, start + 500)
}
// Conservative: a negated/aspirational clause earns no skill evidence. The
// extracted text is editable; the user can supply a concrete confirmed example.
const uncertain = /\b(no|not|never|lack|without|don't|do not|learning|learn|aspire|want to|interested in|hopes? to)\b/i
const isUncertain = (text: string) => uncertain.test(text.replace(/\bmachine learning\b/gi, 'technical-field'))
const domains = new Set(['machine learning', 'ai tooling', 'healthcare software', 'wearables', 'payments', 'fraud', 'hardware'])
const generic = new Set(['analytics', 'research', 'excel', 'operations', 'project', 'product', 'sales', 'customer'])
// A clause ends at a line break or at sentence punctuation followed by space or
// end of text. A dot inside a token (Salesforce.com, Node.js) does not split.
const clauses = (text: string) => text.split(/\n+|[.!?]+(?=\s|$)/).map(line => line.trim()).filter(Boolean)
// Roster records that say nothing about a field are unknowns to clarify, never
// documented conflicts.
const unspecified = (value: string) => !value || /unknown|not specified/i.test(value)
export function extractEvidence(text: string, origin: Evidence['origin'] = 'resume'): Evidence[] {
  const lines = clauses(text)
  return Object.entries(concepts).flatMap(([concept, aliases]) => {
    const quote = lines.find(line => has(line, aliases) && !isUncertain(line))
    return quote ? [{ concept, quote: evidenceQuote(quote, aliases), origin }] : []
  })
}
function employerEvidence(item: Opportunity, concept: string) {
  // Title/metadata remain legitimate, explicitly limited evidence. Never use
  // generated summary copy as if it were an employer requirement.
  const sentence = clauses(item.text).find(line => has(line, concepts[concept] ?? []) && !isUncertain(line))
  return sentence ? evidenceQuote(sentence, concepts[concept] ?? []) : (has(item.title, concepts[concept] ?? []) ? item.title : null)
}
function normalize(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() }
function locationMatches(location: string, wanted: string) {
  const actual = ` ${normalize(location)} `
  return wanted.split(',').map(normalize).filter(Boolean).some(city => actual.includes(` ${city} `))
}

export function matchOpportunities(evidence: Evidence[], prefs: Preferences, snapshot: Snapshot): MatchResult {
  const exclusions: MatchResult['exclusions'] = []
  const recommendations: Recommendation[] = []
  const requestedDirections = [...new Set([prefs.direction, ...(prefs.additionalDirections ?? [])])]
  const uncoveredConstraints = prefs.otherConstraints.trim() ? [prefs.otherConstraints.trim()] : []
  for (const item of snapshot.opportunities) {
    const reasons: string[] = []
    const questions: string[] = []
    let strictUnknown = false
    const unknown = (question: string) => { questions.push(question); strictUnknown = true }
    if (!item.active) reasons.push('Not active in this snapshot.')
    if (isCompanyMatchHeld(item.slug)) reasons.push('Company evidence is on hold.')
    // Real employer-identity holds are omitted from this fixture-only snapshot.
    if (item.kind === 'opening' && !requestedDirections.some(direction => titlePatterns[direction].test(item.title))) reasons.push('Outside your requested direction.')
    if (!prefs.anywhere) {
      if (!item.location || /^(unknown|remote|—)$/i.test(item.location)) unknown('Confirm the work location; remote does not establish geographic eligibility.')
      else if (!locationMatches(item.location, prefs.location)) reasons.push('Outside your selected work locations.')
    }
    if (prefs.workMode !== 'any') {
      if (item.workMode === 'unknown') unknown(`Confirm whether ${prefs.workMode} work is available.`)
      else if (item.workMode !== prefs.workMode) reasons.push('Work arrangement conflicts with your selection.')
    }
    if (prefs.employment !== 'any') {
      if (unspecified(item.employment) || item.kind === 'research') unknown('Confirm employment type.')
      else if (item.employment !== prefs.employment) reasons.push('Employment type conflicts with your selection.')
    }
    if (prefs.level !== 'any') {
      // Legacy roster levels (Director, Lead, Senior Manager, VP / Head of) are
      // outside the selectable ladder: a question, not a documented conflict.
      if (unspecified(item.level) || item.kind === 'research' || !(levels as readonly string[]).includes(item.level)) unknown('Confirm the role level.')
      else if (item.level !== prefs.level) reasons.push('Role level conflicts with your selection.')
    }
    if (prefs.minimumSalary != null) {
      if (item.salaryMax == null) unknown('Confirm compensation; the record has no usable annual USD range.')
      else if (item.salaryMax < prefs.minimumSalary) reasons.push('Published salary ceiling is below your minimum.')
      else questions.push('The published salary ceiling is not an offer. Confirm the amount available for your experience.')
    }
    if (prefs.needsSponsorship) {
      if (item.authorization === 'no_sponsorship' || item.authorization === 'us_persons') reasons.push('Published authorization policy conflicts with needing sponsorship.')
      else if (item.authorization === 'unknown') unknown('Confirm sponsorship before investing in an application.')
    }
    if (item.startDate && item.startDate < prefs.availableOn) reasons.push('Documented start date is before your availability.')
    else if (!item.startDate) {
      if (/\b(immediate start|start immediately)\b/i.test(item.text) && prefs.availableOn > snapshot.capturedOn) reasons.push('Immediate start conflicts with your future availability.')
      else if (prefs.availableOn > snapshot.capturedOn) unknown(`Confirm the employer can accommodate your ${prefs.availableOn} availability; a posting date is not a start date.`)
    }
    if (uncoveredConstraints.length) unknown('Your additional constraints have not been interpreted by software. Confirm them with the employer.')
    const pairs = evidence.flatMap(candidate => {
      if (!concepts[candidate.concept] || !candidate.quote.trim()) return []
      if (item.kind === 'research' && !domains.has(candidate.concept) && !requestedDirections.some(direction => researchConcepts[direction].includes(candidate.concept))) return []
      const quote = employerEvidence(item, candidate.concept)
      return quote ? [{ candidate, quote }] : []
    })
    if (item.kind === 'research' && pairs.length && pairs.every(pair => generic.has(pair.candidate.concept))) {
      reasons.push('Only broad terms overlap; no specific skill or domain supports a company connection.')
    }
    if (!pairs.length) reasons.push('No supported overlap found in the confirmed evidence and supplied employer record.')
    if (reasons.length) { exclusions.push({ id: item.id, reasons }); continue }
    const employerConcepts = extractEvidence(item.text).map(e => e.concept)
    const unmentioned = employerConcepts.filter(concept => !evidence.some(e => e.concept === concept))
    if (unmentioned.length) {
      const question = `Not mentioned in your confirmed evidence: ${unmentioned.join(', ')}. This does not establish that you lack them.`
      if (item.kind === 'opening') unknown(question)
      else questions.push(question)
    }
    if (item.kind === 'opening' && !item.text.trim()) unknown('Full employer requirements are missing; this is a title match only.')
    if (item.kind === 'opening' && pairs.every(pair => domains.has(pair.candidate.concept))) unknown('The shared domain does not establish experience with this role’s responsibilities. Compare a concrete work example with the posting.')
    if (item.kind === 'opening' && /\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\+? years?\b/i.test(item.text)) unknown('Compare the posting’s experience requirement with your work history; the matcher has not established years or scope.')
    const age = (Date.parse(snapshot.capturedOn) - Date.parse(item.checkedOn)) / 86400000
    if (age > 14) unknown('Source evidence is more than 14 days old in this snapshot. Check whether the opportunity is still available.')
    if (item.kind === 'research') questions.push('No advertised opening or hiring interest is established. Shared experience is a reason to explore a conversation; work conditions remain unknown.')
    const action = age > 14 ? 'watch' : item.kind === 'research' ? 'meet' : strictUnknown ? 'clarify' : 'apply'
    recommendations.push({
      opportunity: item, action,
      basis: item.kind === 'research' ? `Company research lead for your ${requestedDirections.join(' / ')} direction; no opening established.` : `Requested ${requestedDirections.join(' / ')} direction with ${pairs.length} documented evidence overlap${pairs.length === 1 ? '' : 's'}.`,
      candidate: pairs.map(pair => pair.candidate),
      employer: pairs.map(pair => ({ quote: pair.quote, source: item.source, checkedOn: item.checkedOn })),
      questions: [...new Set(questions)], status: strictUnknown ? 'clarify' : 'investigate',
      nextAction: action === 'watch' ? 'Refresh the source before acting. Keep this as a lead until current evidence supports an application or conversation.' : action === 'meet' ? 'Read the company source and decide whether your shared experience gives you a useful reason to connect. No opening or introduction is promised.' : action === 'clarify' ? 'Resolve the flagged questions before deciding whether to apply.' : 'Open the posting, check the remaining requirements against your work, and apply if they hold.',
    })
  }
  recommendations.sort((a, b) =>
    actions.indexOf(recommendationAction(a)) - actions.indexOf(recommendationAction(b)) ||
    b.candidate.length - a.candidate.length || a.questions.length - b.questions.length ||
    a.opportunity.id.localeCompare(b.opportunity.id, 'en'))
  return { version: RULE_VERSION, snapshot: `${snapshot.label} · ${snapshot.capturedOn}`, recommendations, exclusions, uncoveredConstraints, modelCalls: 0 }
}
