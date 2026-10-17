---
authored_by: agent
date: 2026-10-09
status: ready to start from fictional fixtures; contributor acceptance pending
---

# Issue 2: Put up to three next actions before the full evidence

## Executive summary

Add a compact first section to the existing results view so a reader can find what to do, why and where to check. Keep the detailed evidence available. This is a presentation experiment; the existing deterministic matcher and action ordering are the baseline. One person's preference does not establish improved hiring outcomes.

**Terms:** no monetary compensation; public acknowledgement of the work, Adam's vouch and concierge help. Participation is voluntary; no job, referral result, deadline or ongoing maintenance is promised. See the packet README for attribution/reuse details.

## Scope and ownership

Own `app/resume/rules/results.tsx`, and relevant fictional UI fixtures/presentation checks. Use `app/page.tsx` only to expose a QA case. Preserve `lib/resume-rules/matcher.ts`, schemas and all coverage files. No auth, storage, analytics, profile intake, export rewrite, model calls or new dependencies.

## Acceptance

1. The first section shows at most three records in the matcher's existing ordering. Each shows company/role, existing action, one sourced reason and the source destination. Remaining records, candidate evidence, employer evidence and full employer text stay reachable.
2. Apply leads to an advertised posting. Clarify shows its unresolved question. Meet stays company research with no implied opening. Watch keeps age/availability limitations. Do not add a generic Apply button to each category or a percentage fit score.
3. Use `recommendationAction()` so an existing operator review still takes precedence, remains labeled and preserves the original evidence. Historical records without an action remain conservative. Test or demonstrate these cases using fictional data.
4. The existing populated fixture, empty fixture, long title/URL and all four categories work. An omitted skill stays unmentioned, not absent. No live data or external action is necessary to review.
5. Preserve public design tokens and local DM Sans/Newsreader fonts. Capture 1440px, 768px and 390px screenshots, interact with disclosures and keyboard navigation, report console/page errors and check horizontal overflow. Do not add fabricated company logos.

## Review evidence

One pull request, before/after screenshots, starter checks and a short explanation of how to find an action, its reason and one caveat. Human evaluation with a reader who likes shorter output and a reader who prefers depth is a follow-up owned by Adam; neither is scheduled by this issue. No wider product rollout is implied by local QA.
