import { z } from 'zod'

const short = z.string().max(200)
const date = z.iso.date()
const url = z.string().url().refine(value => /^https?:\/\//.test(value))
export const opportunitySchema = z.object({
  id: short.min(1), company: short.min(1), slug: short.min(1), title: short,
  kind: z.enum(['opening', 'research']),
  text: z.string().max(24000), source: url, checkedOn: date,
  location: short, workMode: z.enum(['remote', 'hybrid', 'onsite', 'unknown']),
  employment: short, level: short,
  salaryMin: z.number().nonnegative().nullable(), salaryMax: z.number().nonnegative().nullable(),
  authorization: z.enum(['sponsors', 'no_sponsorship', 'us_persons', 'unknown']),
  startDate: date.nullable(), active: z.boolean(),
})
export const snapshotSchema = z.object({
  capturedOn: date, label: short.min(1),
  opportunities: z.array(opportunitySchema).max(1500),
}).superRefine((snapshot, ctx) => {
  const ids = new Set<string>()
  for (const item of snapshot.opportunities) {
    if (ids.has(item.id)) ctx.addIssue({ code: 'custom', message: 'Duplicate opportunity id' })
    ids.add(item.id)
    if (item.checkedOn > snapshot.capturedOn) ctx.addIssue({ code: 'custom', message: 'Evidence date is after snapshot date' })
    if (item.salaryMin != null && item.salaryMax != null && item.salaryMin > item.salaryMax) ctx.addIssue({ code: 'custom', message: 'Invalid salary range' })
  }
})
export type Opportunity = z.infer<typeof opportunitySchema>
export type Snapshot = z.infer<typeof snapshotSchema>

export const directions = ['software', 'data', 'product', 'design', 'sales', 'customer', 'operations', 'science', 'finance'] as const
// The public roster's own seniority ladder (lib/jobs-roster-state.ts), so a
// selection can actually match stored records. 'Not specified' is an unknown.
export const levels = ['Early career', 'Mid-level', 'Senior', 'Staff / lead', 'Manager', 'Executive'] as const
export const preferencesSchema = z.object({
  direction: z.enum(directions),
  additionalDirections: z.array(z.enum(directions)).max(8).optional(),
  location: short.min(1), anywhere: z.boolean(),
  workMode: z.enum(['any', 'remote', 'hybrid', 'onsite']),
  employment: z.enum(['any', 'Full-time', 'Part-time', 'Internship', 'Contract']),
  level: z.enum(['any', ...levels]),
  availableOn: date,
  minimumSalary: z.number().nonnegative().max(10000000).nullable(),
  needsSponsorship: z.boolean(),
  otherConstraints: z.string().max(2000),
})
export type Preferences = z.infer<typeof preferencesSchema>
export type Evidence = { concept: string; quote: string; origin: 'resume' | 'confirmed' }
export const actions = ['apply', 'clarify', 'meet', 'watch'] as const
export type Action = typeof actions[number]
export function actionsForOpportunity(kind: Opportunity['kind']): readonly Action[] {
  return kind === 'opening' ? ['apply', 'clarify', 'watch'] : ['meet', 'watch']
}
export const operatorReviewSchema = z.object({ action: z.enum(actions), reason: z.string().trim().min(1).max(2000), source: url, reviewedOn: date })
export type OperatorReview = z.infer<typeof operatorReviewSchema>
export type Recommendation = {
  opportunity: Opportunity; basis: string; candidate: Evidence[];
  employer: { quote: string; source: string; checkedOn: string }[];
  questions: string[]; nextAction: string;
  status: 'investigate' | 'clarify';
  // Optional for historical packets. Never upgrade an old investigate label to Apply.
  action?: Action;
  operatorReview?: OperatorReview;
}
export type MatchResult = {
  version: string; snapshot: string; recommendations: Recommendation[];
  exclusions: { id: string; reasons: string[] }[];
  uncoveredConstraints: string[];
  modelCalls: number | null;
}

// Strictly parse review packets; files stay in browser memory. The normalized
// presentation deliberately omits method/model labels.
const evidenceSchema = z.object({ concept: short, quote: z.string().max(2000), origin: z.enum(['resume', 'confirmed']) })
export const reviewPacketSchema = z.object({
  code: short.min(1),
  result: z.object({
    version: short, snapshot: short,
    recommendations: z.array(z.object({
      opportunity: opportunitySchema, basis: z.string().max(3000),
      candidate: z.array(evidenceSchema).max(100),
      employer: z.array(z.object({ quote: z.string().max(3000), source: url, checkedOn: date })).max(100),
      questions: z.array(z.string().max(3000)).max(100), nextAction: z.string().max(3000),
      status: z.enum(['investigate', 'clarify']),
      action: z.enum(actions).optional(),
      operatorReview: operatorReviewSchema.optional(),
    }).refine(item => [item.action, item.operatorReview?.action].every(action => action == null || actionsForOpportunity(item.opportunity.kind).includes(action)), { message: 'Action must preserve whether a record is an opening or a company lead' })).max(1500),
    exclusions: z.array(z.object({ id: short, reasons: z.array(short) })).max(1500),
    uncoveredConstraints: z.array(z.string().max(2000)), modelCalls: z.number().int().nonnegative().nullable(),
  }),
})

export function recommendationAction(item: Recommendation): Action {
  return item.operatorReview?.action ?? item.action ?? (item.opportunity.kind === 'research' ? 'watch' : 'clarify')
}
