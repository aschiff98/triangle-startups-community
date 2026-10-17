'use client'

import { useState } from 'react'
import { Results } from './resume/rules/results'
import { presentationCases, presentationResult, type PresentationCase } from '@/fixtures/presentation'

export default function Page() {
  const [example, setExample] = useState<PresentationCase>('All four actions')
  const result = presentationResult(example)
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <header className="mb-10 max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-[var(--land-text-dim)]">Triangle jobs · contributor starter</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">A starting point for clearer next steps</h1>
      <p className="mt-5 text-base leading-relaxed text-[var(--land-text-secondary)]">This local demo uses fictional people, companies and source URLs. Start with up to three suggested steps, then open the complete evidence.</p>
      <p className="mt-3 text-sm text-[var(--land-text-secondary)]">No account, credentials or data service is needed. Source links are examples and do not lead to real postings.</p>
      <label className="mt-6 block max-w-sm text-sm">Demo example<select className="mt-2 block w-full rounded-lg border border-[var(--land-border)] bg-[var(--land-surface)] px-4 py-3" value={example} onChange={event => setExample(event.target.value as PresentationCase)}>{presentationCases.map(value => <option key={value}>{value}</option>)}</select></label>
    </header>
    <Results result={result} />
  </main>
}
