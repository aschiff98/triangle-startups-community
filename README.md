---
authored_by: agent
date: 2026-10-17
---

# Triangle Startups community

## Executive summary

Build and review small jobs experiments in a standalone local app with fictional data. Start with either of the two issues below, work in a fork, and open a pull request here. The matcher, results view, design tokens and local fonts come from a sanitized Triangle Startups starter. This repository gives contributors a runnable place to work without access to the private platform or production services.

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

## Start with one issue

1. [Compare public job coverage](https://github.com/aschiff98/triangle-startups-community/issues/1): compare caller-supplied snapshots offline and explain confirmed gaps, duplicates and unknowns.
2. [Put up to three next actions before the full evidence](https://github.com/aschiff98/triangle-startups-community/issues/2): improve the first results view while keeping matching and detailed evidence intact.

The implementations are proposed in [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3) and [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4). They remain separate review decisions. The coverage fixture's expected results are examples, not a comparator on the default branch. See [CONTRIBUTING](CONTRIBUTING.md) for scope, pull requests and validation. Each issue is independent; completing both and ongoing maintenance are optional.

## Contribution terms

The two starter issues are voluntary and have **no monetary compensation**. Adam's offered return is **public acknowledgement of the actual contribution, his vouch and concierge help**. Participation does not promise employment, placement, a referral outcome, a deadline or continuing work. Confirm the credit name/link before public acknowledgement. Contributors retain ownership of their work; disclose third-party code and permissions before integration. Later work needs its own agreed scope and terms.

## What this environment contains

It contains no original Git history, private intake, real candidate records, environment files, database clients, analytics or production deployment connection. Real employer holds are replaced by fictional fixtures. `packet-manifest.json` records source hashes, the original audited archive receipt and the separately reviewed collaboration additions. The manifest and its verifier describe the original exported packet, including historical document hashes. They are not a validator for this licensed publication or later contributions. Use Git review, tests, typechecking and build to validate current work.

GitHub Actions checks pull requests without application secrets. A successful check or merge here does not deploy Triangle Startups. Adam reviews any later integration into the private product separately. Keep real resumes, application answers, private conversations and credentials out of issues, commits and screenshots.

The original software and documentation in this repository are available under the [MIT License](LICENSE). MIT permits reuse, modification and commercial distribution when its notice is retained. Bundled fonts and dependencies retain their own licenses; see [NOTICE](NOTICE.md). The license covers the material published here, not the separate private platform or unpublished data. This first environment is for these two jobs experiments; other proposals can be discussed in an issue before implementation.

## Community experiments

The proposed [Claude trial in PR #5](https://github.com/aschiff98/triangle-startups-community/pull/5) prepares a bounded task and independent checks. It has not connected or run Claude. New ideas should begin with an issue that explains the user problem, fictional or explicitly shareable inputs, a small first deliverable and how it will be checked. Starting a discussion does not grant access to private data or production services.
