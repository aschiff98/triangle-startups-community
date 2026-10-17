import { preferencesSchema, snapshotSchema, type Opportunity } from '../lib/resume-rules/schema'

export const candidateText = 'Built Python APIs and React interfaces for a fictional inventory project.'
export const preferences = preferencesSchema.parse({ direction: 'software', location: 'Durham', anywhere: true, workMode: 'any', employment: 'any', level: 'any', availableOn: '2026-10-09', minimumSalary: null, needsSponsorship: false, otherConstraints: '' })
const base: Opportunity = {
  id: 'apply-example', company: 'Example Orchard', slug: 'example-orchard', title: 'Software Engineer', kind: 'opening',
  text: 'Build Python APIs and React interfaces.', source: 'https://orchard.example.test/jobs/one', checkedOn: '2026-10-09',
  location: 'Durham, NC', workMode: 'hybrid', employment: 'Full-time', level: 'Mid-level',
  salaryMin: null, salaryMax: null, authorization: 'unknown', startDate: null, active: true,
}
export const snapshot = snapshotSchema.parse({ capturedOn: '2026-10-09', label: 'Fictional starter fixture', opportunities: [
  base,
  { ...base, id: 'clarify-example', company: 'Example River', slug: 'example-river', title: 'Software Engineer for a very long cross-functional developer platform and customer integration program', text: 'Build Python APIs and SQL reports.', source: 'https://river.example.test/jobs/a-deliberately-long-source-path-for-responsive-layout-checks/software-engineer' },
  { ...base, id: 'meet-example', company: 'Example Grove', slug: 'example-grove', title: '', kind: 'research', text: 'We develop Python tools for fictional gardens.', source: 'https://grove.example.test/about', employment: '', level: '', workMode: 'unknown' },
  { ...base, id: 'watch-example', company: 'Example Harbor', slug: 'example-harbor', checkedOn: '2026-09-01', source: 'https://harbor.example.test/jobs/stale' },
  { ...base, id: 'held-example', company: 'Example Hold', slug: 'held-example', source: 'https://hold.example.test/jobs/one' },
] })
