/** Fictional comparison input contract; this is not a hosted JSON API. */
export type CoverageRecord = {
  id: string; employer: string; title: string; sourceUrl: string;
  scope: 'startup' | 'ecosystem' | 'out_of_scope' | 'unknown';
  availability: 'open' | 'closed' | 'unknown';
  postedOn: string | null; firstObservedOn: string; fetchedOn: string;
}
export type CoverageInput = { employerRecords: CoverageRecord[]; publicRoster: CoverageRecord[] }
export type Disposition = 'listed' | 'missing_confirmed_open' | 'availability_unknown' | 'closed' | 'duplicate' | 'out_of_scope' | 'scope_unknown'
export type CoverageFinding = { id: string; disposition: Disposition; sourceUrl: string; reason: string }
