---
authored_by: agent
date: 2026-10-17
---

# Instructions for coding agents

Read [README](README.md), [CONTRIBUTING](CONTRIBUTING.md), the user-selected issue and any existing PR before editing. The current proposed starter is [job export comparison #8](https://github.com/aschiff98/triangle-startups-community/issues/8); issues #1/#2 are completed and closed. Their implementation PRs #3/#4 are archived references and were not merged into community main. Follow #8's fixed-commit restore instructions when reusing its comparator; do not import an old handoff or overwrite current instructions. Record the starting commit and selected branch. Work only on the selected issue's paths and acceptance criteria; propose a separate task when the scope must grow. Do not treat a proposal or an open issue as permission to start paid execution or a scheduled agent.

## Access and data

This independent fixture project has no production connection or access to the private Triangle Startups repository. Do not add credentials, environment files, database clients, telemetry, live crawlers, email integration or deployment automation. Keep real personal or candidate data, resumes and private conversations out of fixtures, issues, logs and screenshots. Do not retrieve private data to make an example more realistic.

The Claude trial preparation is parked in closed PR #5; it does not authorize connecting or running Claude. The Triangle Q&A work is a proposal; it does not authorize model calls, training, hosting or collecting a corpus. New services, spending, credentials, schedules, workflow permissions and repository settings require an explicit maintainer instruction for that action.

For #8, use fictional fixtures for tests and read the [approved public-job snapshot](datasets/public-jobs/2026-10-18/README.md) for a real comparison. It contains 298 public listing rows, unknown dates and shared source URLs requiring review; all availability values are unknown because this capture did not recheck employer postings. The snapshot is the specifically approved public input, not a blanket approval to publish other real inputs/reports. Keep those outside Git unless approved. Preserve missing dates/evidence as unknown; do not fabricate dates, silently drop roster entries or infer duplicate jobs from shared careers links. Do not assume public search provides a jobs API.

User-selected public-source research and local fixture prototypes for new tools are welcome on separate issues/branches. State the problem, coverage, source links, dates, reuse/access terms, costs and a checkable result. Agree maintained-integration scope and terms separately. This invitation does not grant agents authority to choose new projects, connect sources, install new dependencies, crawl continuously, schedule work or expand production access.

## Implementation rules

Read the relevant local `node_modules/next/dist/docs/` guide before editing Next.js code. Use existing `--land-*` tokens, Newsreader headings and DM Sans body text. Keep missing values unknown. Distinguish advertised openings from company research; source age, limitations and evidence remain visible. Do not invent a percentage fit score.

## Verification and stopping point

The current starter and the two completed starter issues are voluntary bounded work under the [README terms](README.md#contribution-terms), with no monetary compensation. A proposed issue does not establish that a contributor has accepted it. Do not promise payment, employment, credit wording or ongoing maintenance on anyone's behalf; later work needs separately agreed scope and terms.

Run `npm test`, `npm run check` and `npm run build` before committing. Presentation work also requires desktop 1440px, intermediate 768px and mobile 390px screenshots, keyboard/disclosure checks, no horizontal overflow and a console-error report. Report the actual commands and results; identify missing evidence instead of claiming a pass.

Use a task branch and open a ready-for-review PR into community `main`, with a patch, acceptance evidence, assumptions and remaining questions. Stop there. Do not merge, approve your own PR, enable auto-merge, deploy or port changes to the private product without Adam's explicit instruction for that action. Do not push directly to `main`, force-push, delete branches or weaken checks/protection. Update branches with a normal merge from `upstream/main` and rerun checks. Human review and any later production integration are separate decisions.
