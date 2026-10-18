---
authored_by: agent
date: 2026-10-17
---

# Triangle Startups community

## Executive summary

Build and review small Triangle Startups experiments in a standalone local app with fictional data. Anyone can read the code, fork it and propose a change. Contributions arrive through pull requests; Adam reviews and decides what to merge. A merge here changes this community project only. It does not update the live Triangle Startups site.

**Start here: [Import a sanitized job export and compare it with Triangle Startups (#8)](https://github.com/aschiff98/triangle-startups-community/issues/8).** This is the next proposed starter for Atishay: turn a saved export from his aggregator and a saved Triangle Startups job list into a repeatable report of missing jobs, duplicates and uncertainty. The original comparison engine and results-screen tasks are already implemented; do not rebuild them.

Humans should read [CONTRIBUTING](CONTRIBUTING.md); coding agents must also read [AGENTS](AGENTS.md). The starter is voluntary and remains unassigned until accepted.

## The current starter: job export comparison

1. Document the aggregator's export fields using a small fictional example. Import job information only; leave application, candidate and private account data out.
2. Reuse the comparator preserved in closed PR #3. It is absent from `main`; [issue #8](https://github.com/aschiff98/triangle-startups-community/issues/8) gives the fixed commit and exact files to carry into a fresh task branch. The fictional Triangle Startups roster is available now. Adam supplies or approves a saved public-job snapshot for a real run; no production access is needed.
3. Hand in one PR with a documented command, readable report, machine-readable output, fictional tests and remaining limits. Show job links and dates; keep missing or conflicting evidence unresolved. A fictional demonstration does not establish a live coverage gap.

Read the issue for the inputs, allowed scope and full definition of done. Real files stay outside Git unless approved for public release. Do not assume the public search API returns jobs.

## New tools and data sources are welcome

Atishay and other contributors are also welcome to research public data sources or try a small local tool that would make Triangle Startups more useful. That might be a way to inspect job quality, compare company records, or find useful public information about companies, jobs, funding, programs or events. These are optional contributions, separate from the export-comparison task.

Open a short issue with the problem, who it helps, what is missing today and a small first result. Read-only public-source research and local prototypes with fictional or explicitly shareable inputs are welcome. For a source proposal, include the source link, a small shareable example, coverage, dates, reuse/access terms, likely refresh needs and any cost. Flag what is unknown. For a tool, include a runnable example and how someone would judge whether it helps.

Use a separate issue and branch for each idea. Agree implementation scope and terms before turning a prototype into a maintained integration. Live crawlers, schedules, credentials, paid services, new dependencies, workflow authority and production connections still need separate review. See [CONTRIBUTING](CONTRIBUTING.md#propose-a-tool-or-data-source).

## Start locally

Use Node 22 and npm. Clone your fork or this repository:

```sh
git clone https://github.com/aschiff98/triangle-startups-community.git
cd triangle-startups-community
npm ci
npm test
npm run check
npm run dev -- --port 3217
```

Open `http://127.0.0.1:3217`. Toggle the empty fixture and expand the evidence. `npm run build` checks the production bundle. Installation downloads dependencies; the app itself uses local fonts and fictional fixtures, needs no account or environment file, and disables Next telemetry. `.example.test` links are fictional.

## How changes reach the product

Fork → choose an agreed task → build and check a branch → open a PR → Adam reviews and merges here → separately review any port into the private Triangle Startups product. See [CONTRIBUTING](CONTRIBUTING.md) for commands and the definition of done. Each task is independent; completing other tasks or providing ongoing maintenance is optional.

`main` requires a pull request, an up-to-date branch, passing **Test, build and types** checks and resolved review conversations. These rules apply to admins too; force pushes and branch deletion are blocked. There is no required second approver because Adam is currently the sole maintainer. GitHub enforces the PR and check requirements; agents must still wait for Adam's explicit merge instruction. See the [protection details](CONTRIBUTING.md#review-and-branch-protection).

## Contribution terms

The export-comparison starter is voluntary and has **no monetary compensation**. Adam's offered return is **public acknowledgement of the actual contribution, his vouch and concierge help**. Participation does not promise employment, placement, a referral outcome, a deadline or continuing work. Confirm the credit name/link before public acknowledgement. Contributors retain ownership of their work; disclose third-party code and permissions before integration. Optional tool/source proposals do not promise paid work. Later implementation needs its own agreed scope and terms. The same voluntary terms applied to the two completed starter issues.

## What this environment contains

It contains no original Git history, private intake, real candidate records, environment files, database clients, analytics or production deployment connection. Real employer holds are replaced by fictional fixtures. `packet-manifest.json` records source hashes, the original audited archive receipt and the separately reviewed collaboration additions. The manifest and its verifier describe the original exported packet, including historical document hashes. They are not a validator for this licensed publication or later contributions. Use Git review, tests, typechecking and build to validate current work.

GitHub Actions checks pull requests without application secrets. A successful check or merge here does not deploy Triangle Startups. Adam reviews any later integration into the private product separately. Keep real resumes, application answers, private conversations and credentials out of issues, commits and screenshots.

The original software and documentation in this repository are available under the [MIT License](LICENSE). MIT permits reuse, modification and commercial distribution when its notice is retained. Bundled fonts and dependencies retain their own licenses; see [NOTICE](NOTICE.md). The license covers the material published here, not the separate private platform or unpublished data. This environment supports the current jobs contribution and separately scoped tool/source experiments.

## Completed work and parked ideas

| Work | State after the 2026-10-17 cleanup |
| --- | --- |
| [Original comparison task #1](https://github.com/aschiff98/triangle-startups-community/issues/1) | Completed implementation; issue closed. [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3) is a closed reference with its branch and tests preserved. It was not merged into community `main`; reuse it for #8 as described above. |
| [Original results-screen task #2](https://github.com/aschiff98/triangle-startups-community/issues/2) | Completed implementation; issue closed. [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4) is a closed reference with its branch and screenshots preserved, absent from `main`. |
| [Claude trial preparation #5](https://github.com/aschiff98/triangle-startups-community/pull/5) | Closed and parked. No Claude trial has been connected or run. |
| [Triangle startup Q&A proposal #7](https://github.com/aschiff98/triangle-startups-community/issues/7) | Unassigned exploration proposal. The [brief](proposals/triangle-questions.md) is available; no model or data collection is connected. |

These references are not a request to repeat completed work. Check the linked issue for its current status before choosing a task.
