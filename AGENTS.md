---
authored_by: agent
date: 2026-10-17
---

# Instructions for coding agents

Read [README](README.md), [CONTRIBUTING](CONTRIBUTING.md), the selected issue and any existing PR before editing. Check the work table: the first two jobs features already have implementations awaiting review. Record the starting commit and selected branch. Work only on the selected issue's paths and acceptance criteria; propose a separate task when the scope must grow. Do not treat a proposal or an open issue as permission to start paid execution or a scheduled agent.

## Access and data

This independent fixture project has no production connection or access to the private Triangle Startups repository. Do not add credentials, environment files, database clients, telemetry, live crawlers, email integration or deployment automation. Keep real personal or candidate data, resumes and private conversations out of fixtures, issues, logs and screenshots. Do not retrieve private data to make an example more realistic.

The Claude work prepares a trial; it does not authorize connecting or running Claude. The Triangle Q&A work is a proposal; it does not authorize model calls, training, hosting or collecting a corpus. New services, spending, credentials, schedules, workflow permissions and repository settings require an explicit maintainer instruction for that action.

## Implementation rules

Read the relevant local `node_modules/next/dist/docs/` guide before editing Next.js code. Use existing `--land-*` tokens, Newsreader headings and DM Sans body text. Keep missing values unknown. Distinguish advertised openings from company research; source age, limitations and evidence remain visible. Do not invent a percentage fit score.

## Verification and stopping point

Both starter issues are voluntarily accepted bounded work under the [README terms](README.md#contribution-terms), with no monetary compensation. Do not promise payment, employment, credit wording or ongoing maintenance on anyone's behalf.

Run `npm test`, `npm run check` and `npm run build` before committing. Presentation work also requires desktop 1440px, intermediate 768px and mobile 390px screenshots, keyboard/disclosure checks, no horizontal overflow and a console-error report. Report the actual commands and results; identify missing evidence instead of claiming a pass.

Use a task branch and open a ready-for-review PR into community `main`, with a patch, acceptance evidence, assumptions and remaining questions. Stop there. Do not merge, approve your own PR, enable auto-merge, deploy or port changes to the private product without Adam's explicit instruction for that action. Do not push directly to `main`, force-push, delete branches or weaken checks/protection. Update branches with a normal merge from `upstream/main` and rerun checks. Human review and any later production integration are separate decisions.
