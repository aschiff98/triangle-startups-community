import { useState } from 'react'
import { actions, actionsForOpportunity, operatorReviewSchema, recommendationAction, type OperatorReview, type Recommendation, type MatchResult } from '@/lib/resume-rules/schema'

/** Shared neutral layout for this matcher and normalized historical output. */
export function Results({ result, onReview }: { result: MatchResult; onReview?: (id: string, review: OperatorReview | undefined) => void }) {
  const groups = actions.map(action => ({ action, items: result.recommendations.filter(item => recommendationAction(item) === action) }))
  const descriptions = {
    apply: 'Advertised openings with shared evidence and no unresolved selected constraint. Check the full requirements before applying.',
    clarify: 'Openings with answers to resolve before you spend time applying.',
    meet: 'Companies with a specific connection to your experience. No opening or hiring interest is established.',
    watch: 'Leads that need review or fresh evidence before an application or conversation.',
  }
  const labels = { apply: 'Apply', clarify: 'Clarify', meet: 'Meet', watch: 'Watch' }
  return <section aria-label="Opportunity results" className="space-y-8">
    <div className="border-t border-[var(--land-border)] pt-8">
      <h2 className="font-[family-name:var(--font-display)] text-3xl">What to investigate next</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{groups.map(({ action, items }) => <a key={action} href={`#action-${action}`} className="rounded-lg border border-[var(--land-border)] p-4 hover:bg-[var(--land-elevated)]">
        <span className="block font-[family-name:var(--font-display)] text-3xl italic tabular-nums">{items.length}</span><span className="mt-1 block text-sm">{labels[action]}</span>
      </a>)}</div>
      <p className="mt-4 text-sm leading-relaxed text-[var(--land-text-secondary)]">These are next steps, not fit scores. Shared terms do not establish proficiency, credentials or employer interest. Check the source and full requirements before acting.</p>
      <p className="mt-2 text-xs text-[var(--land-text-dim)]">Source snapshot: {result.snapshot}. Check availability before acting.</p>
      {!groups[0].items.length && <p className="mt-4 rounded-lg border border-[var(--land-border)] p-4 text-sm">No advertised role is ready for the Apply list in this snapshot. You can review the questions below, correct the evidence, or broaden your search deliberately.</p>}
    </div>
    {groups.map(({ action, items }) => <div key={action} id={`action-${action}`} className="scroll-mt-8">
      <h3 className="font-[family-name:var(--font-display)] text-2xl">{labels[action]}</h3>
      <p className="mb-4 mt-2 text-sm leading-relaxed text-[var(--land-text-secondary)]">{descriptions[action]}{!items.length && ' No records in this group.'}</p>
      <div className="space-y-5">{items.map(item => <article key={item.opportunity.id} className="rounded-xl border border-[var(--land-border)] bg-[var(--land-surface)] p-5 sm:p-7">
        <p className="text-xs text-[var(--land-text-secondary)]">{item.opportunity.kind === 'opening' ? 'Advertised opening' : 'Company research · no opening established'} · {item.opportunity.location || 'Location unknown'}</p>
        <h4 className="mt-2 font-[family-name:var(--font-display)] text-2xl">{item.opportunity.title || item.opportunity.company}{item.opportunity.title && <span className="mt-1 block font-[family-name:var(--font-body)] text-sm text-[var(--land-text-secondary)]">{item.opportunity.company}</span>}</h4>
        <p className="mt-3 text-sm leading-relaxed">{item.basis}</p>
        {item.operatorReview && <aside className="mt-4 border-l-2 border-[var(--land-accent)] pl-4 text-sm leading-relaxed"><strong className="font-medium">Operator judgment · {item.operatorReview.reviewedOn}</strong><p className="mt-1 whitespace-pre-wrap">{item.operatorReview.reason}</p><a className="text-[var(--land-link)] underline underline-offset-4" href={item.operatorReview.source} target="_blank" rel="noreferrer">Rationale source</a><p className="mt-1 text-xs text-[var(--land-text-dim)]">Original action: {item.action ?? 'not assigned'}. Original evidence and questions remain below.</p></aside>}
        {!item.action && <p className="mt-2 text-sm text-[var(--land-text-secondary)]">Historical packet: no action was assigned. Review its original recommendation below.</p>}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div><h5 className="text-xs uppercase tracking-wide text-[var(--land-text-dim)]">Your evidence</h5><ul className="mt-2 space-y-2 text-sm leading-relaxed">{item.candidate.map((e, i) => <li key={i}><strong className="font-medium">{e.concept}</strong>: “{e.quote}” <span className="text-xs text-[var(--land-text-secondary)]">({e.origin === 'resume' ? 'resume' : 'confirmed addition'})</span></li>)}</ul></div>
          <div><h5 className="text-xs uppercase tracking-wide text-[var(--land-text-dim)]">Employer evidence</h5><ul className="mt-2 space-y-2 text-sm leading-relaxed">{item.employer.map((e, i) => <li key={i}>“{e.quote}” <a href={e.source} target="_blank" rel="noreferrer" className="block break-all text-xs text-[var(--land-link)] underline underline-offset-4">Source · recorded {e.checkedOn}</a></li>)}</ul></div>
        </div>
        {item.questions.length > 0 && <details className="mt-5 border-t border-[var(--land-border)] pt-4" open={action === 'clarify'}><summary className="cursor-pointer text-sm font-medium">Gaps &amp; unanswered questions</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--land-text-secondary)]">{item.questions.map(q => <li key={q}>{q}</li>)}</ul></details>}
        {item.opportunity.text && <details className="mt-4 text-sm"><summary className="cursor-pointer text-[var(--land-text-secondary)]">Full supplied {item.opportunity.kind === 'research' ? 'company description' : 'employer text'}: check requirements and scope</summary><p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-[var(--land-text-secondary)]">{item.opportunity.text}</p><p className="mt-2 text-xs text-[var(--land-text-dim)]">Recorded {item.opportunity.checkedOn}. {item.opportunity.kind === 'research' ? 'Directory descriptions are company context, not employer hiring requirements.' : 'This text may omit separate application questions. Compare it with the current source.'}</p></details>}
        <p className="mt-5 text-sm leading-relaxed"><strong className="font-medium">{item.operatorReview ? 'Original suggested step:' : 'Next action:'}</strong> {item.nextAction}</p>
        {onReview && <OperatorReviewForm item={item} onReview={onReview} />}
      </article>)}</div>
    </div>)}
    <details className="text-sm"><summary className="cursor-pointer text-[var(--land-text-secondary)]">Why other records were left out ({result.exclusions.length})</summary><ul className="mt-4 space-y-3">{result.exclusions.map(e => <li key={e.id}><span className="break-all">{e.id}</span>: {e.reasons.join(' ')}</li>)}</ul></details>
  </section>
}


function OperatorReviewForm({ item, onReview }: { item: Recommendation; onReview: (id: string, review: OperatorReview | undefined) => void }) {
  const [action, setAction] = useState(recommendationAction(item))
  const [reason, setReason] = useState(item.operatorReview?.reason ?? '')
  const [source, setSource] = useState(item.operatorReview?.source ?? item.opportunity.source)
  const [error, setError] = useState('')
  const field = 'mt-2 block w-full rounded-lg border border-[var(--land-border)] bg-[var(--land-bg)] p-3 text-sm'
  return <details className="mt-5 border-t border-[var(--land-border)] pt-4 text-sm"><summary className="cursor-pointer">Record operator judgment</summary>
    <p className="mt-3 text-xs leading-relaxed text-[var(--land-text-secondary)]">Use candidate-shareable facts only. This rationale is included in private exports. It stays in this tab until you download it.</p>
    <form className="mt-3 space-y-3" onSubmit={event => {
      event.preventDefault()
      const parsed = operatorReviewSchema.safeParse({ action, reason, source, reviewedOn: new Date().toISOString().slice(0, 10) })
      if (!parsed.success) { setError('Add a reason and a valid HTTP or HTTPS source.'); return }
      setError(''); onReview(item.opportunity.id, parsed.data)
    }}>
      <label className="block">Action<select aria-label="Action" className={field} value={action} onChange={event => setAction(event.target.value as typeof action)}>{actionsForOpportunity(item.opportunity.kind).map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
      <label className="block">Reason<textarea className={field} maxLength={2000} value={reason} onChange={event => setReason(event.target.value)} required /></label>
      <label className="block">Supporting source<input className={field} type="url" value={source} onChange={event => setSource(event.target.value)} required /></label>
      {error && <p role="alert">{error}</p>}
      <div className="flex flex-wrap gap-3"><button className="rounded-lg border border-[var(--land-border)] px-4 py-3" type="submit">Save judgment in this tab</button>{item.operatorReview && <button className="rounded-lg border border-[var(--land-border)] px-4 py-3" type="button" onClick={() => onReview(item.opportunity.id, undefined)}>Restore original action</button>}</div>
    </form>
  </details>
}
