'use client'

import { useState } from 'react'
import { Results } from './resume/rules/results'
import { extractEvidence, matchOpportunities } from '@/lib/resume-rules/matcher'
import { candidateText, preferences, snapshot } from '@/fixtures/matching'

export default function Page() {
  const [empty, setEmpty] = useState(false)
  const result = matchOpportunities(extractEvidence(candidateText), preferences, empty ? { ...snapshot, opportunities: [] } : snapshot)
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <header className="mb-10 max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-[var(--land-text-dim)]">Triangle jobs · contributor starter</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">A starting point for clearer next steps</h1>
      <p className="mt-5 text-base leading-relaxed text-[var(--land-text-secondary)]">This local demo uses fictional people, companies and source URLs. It shows the existing results view before the compact-view contribution.</p>
      <p className="mt-3 text-sm text-[var(--land-text-secondary)]">No account, credentials or data service is needed. Source links are examples and do not lead to real postings.</p>
      <button type="button" onClick={() => setEmpty(!empty)} className="mt-6 rounded-lg border border-[var(--land-border)] px-4 py-3 text-sm hover:bg-[var(--land-elevated)]">{empty ? 'Show populated fixture' : 'Show empty fixture'}</button>
    </header>
    <Results result={result} />
  </main>
}
