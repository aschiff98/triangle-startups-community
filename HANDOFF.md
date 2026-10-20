---
authored_by: agent
date: 2026-10-20
---

# Community review queue

## 2026-10-20 · Three optional proposals published

The maintainer selected publication of the revised Claude drafts and a README update PR. The three issues are live and unassigned: [accessible views #12](https://github.com/aschiff98/triangle-startups-community/issues/12), [offline research tools #13](https://github.com/aschiff98/triangle-startups-community/issues/13) and [community-guide prototype #14](https://github.com/aschiff98/triangle-startups-community/issues/14). The README and contributor guide now link them while keeping #8 as the current job-export starter. No proposal implementation is included in this documentation branch.

The accessibility proposal has a smaller first milestone and separate text-resize/reflow checks. Research keeps provenance, amendment chains, co-issuers, exact money and unknown dates, with fictional fixtures and no network access. Guides use passive Markdown with accurate authorship, approved credit and tests for hostile content; renderer dependencies remain a separate explicit decision. Existing MIT documentation terms remain in effect. New proposals are unpaid, with scope, credit and support agreed before implementation; the current starter's vouch and concierge offer is not automatically extended.

PR #11 merged the earlier README rewrite at `c89ff438a70244b1567b99471de9e05074c03b02`, the starting point of this branch. The GitHub connector could read the repo but issue creation returned 403; the existing authenticated CLI published the proposals after duplicate checks. No app permissions, repository settings, dependencies, license files, workflows or production connections changed.

**Next prompt:** Review the documentation PR linking issues #12/#13/#14. After merge, choose one issue and agree its first deliverable, allowed files, fixtures and terms before any implementation. Keep #8 independent. Do not implement all proposals, add a tool server, connect a model, change the license or enable new services merely because they are mentioned in the proposals. The October 19 security findings below remain a separate follow-up and were not re-audited or fixed by this task.

## 2026-10-19 · README for all contributors

The README welcomes contributors without naming an individual, puts three ways to help near the top and explains the larger recurring-coverage goal in plain language. Issue #8 remains the current offline export-comparison task. PR #10 merged at `2cb685ea2daaebce33a1c86124bcc3867af0b405`; its public snapshot and instructions are on main. The README revision subsequently merged in PR #11 at `c89ff438a70244b1567b99471de9e05074c03b02`.

Read-only security checks on October 19 confirmed public forking, only the owner having write access, protected main, no stored Actions secrets or environments, GitHub-hosted runners, read-only workflow permissions, two allowed actions pinned to commits, first-time-contributor workflow approval and no automatic merge or production deployment in the [workflow](.github/workflows/checks.yml). These settings limit access; the checks test/build/typecheck and do not establish that contributed code is malware-free. CodeQL default setup is not configured, Dependabot alerts/security updates are disabled, repository-level secret scanning/push-protection settings report disabled, and no independent approving review is required. Maintainers can recheck [security settings](https://github.com/aschiff98/triangle-startups-community/settings/security_analysis), [Actions settings](https://github.com/aschiff98/triangle-startups-community/settings/actions) and the [documented protection rules](CONTRIBUTING.md#review-and-branch-protection). No security settings or workflow authority were changed in this README task. GitHub may [separately scan supported public secrets](https://docs.github.com/en/code-security/reference/secret-security/secret-scanning-scope); the repository settings are not evidence that all public secret detection is absent.

**Remaining follow-up from that review:** If security hardening is selected as a separate task, prepare required code/dependency checks and maintainer review of scripts, dependencies and workflows; keep untrusted execution isolated and request explicit authorization before changing repository settings or workflow permissions. Do not treat passing tests as a malware scan or connect community code to production automatically.

## Current next contribution

[Issue #8](https://github.com/aschiff98/triangle-startups-community/issues/8) is the current proposed starter for contributors: import a sanitized aggregator export, compare two saved job lists and deliver a reproducible report with sources, dates and uncertainty. It remains voluntary and unassigned until accepted. PR #9 merged the current starter instructions at `97f0d49e0e112cba0e94fc6903c78c3a94e4b6b1`. Our [approved public snapshot](datasets/public-jobs/2026-10-18/README.md) now supplies 298 roster rows in JSON/CSV; the contributor still supplies a sanitized aggregator export. No private database or production access is available.

Capture window: 2026-10-18 00:46:26–00:47:45 UTC. All 298 employer/title/posting-URL triples matched the complete anonymous Markdown roster; 297 are startup roles and one is startup support. Preserve 5 unknown first-seen dates, 8 unknown last-check dates and all 298 unknown availability values. Seven source-URL groups span different titles, often through careers pages. Do not report grouped URLs as distinct confirmed jobs or silently discard those rows. The archived CLI is not a drop-in reader for the new snapshot because it requires combined inputs and non-null dates.

The comparator is preserved at `ff57d6148183e717b9927d3af672f53b6922b266`, not on main. Issue #8 names the exact three files to restore onto a fresh branch, preserving current docs. The new contribution owns the importer, input mapping and report, rather than rebuilding the comparison engine.

Optional public-source research and small local tools are welcome as separate issues and branches. Record the problem, evidence, permitted inputs and success criterion. Maintained integrations, credentials, dependencies, live crawlers, paid services, schedules and production authority remain separate decisions. No optional proposal is a condition of completing #8 or a promise of payment.

**Next prompt:** Read issue #8 and the public snapshot README. Confirm the aggregator format with a fictional sample, restore only the three pinned comparator files, and build/check the offline importer/report in one separate PR. Use our approved snapshot as the Triangle Startups input. Keep other real data outside Git unless approved, preserve unknowns and flag shared-URL ambiguity. Do not implement the optional tool/source ideas as part of that task.

## Current repository state

`main` is protected as of 2026-10-17: PRs, an up-to-date branch, the GitHub Actions **Test, build and types** check and resolved review conversations are required. The rule includes admins and blocks force pushes and deletion. Required second approvals are zero while Adam is the sole maintainer; this is not an independent human identity gate. Agents must stop at a review-ready PR and wait for Adam's explicit merge instruction.

The [README starter](README.md#the-current-starter-job-export-comparison), [contributor guide](CONTRIBUTING.md) and [agent instructions](AGENTS.md) explain access, scope, terms, checks and stopping points. PR #6 merged the original instructions at `91f01ae8106e00a688909d4bff953cd00fa45c83`; the subsequent cleanup closed PRs #3/#4/#5 and completed issues #1/#2 without deleting their branches.

| Work | Review state on 2026-10-17 | Next action |
| --- | --- | --- |
| Coverage comparator | Implemented in closed [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3), absent from main. | Reuse the pinned files for #8; do not rebuild issue #1. |
| Clear next actions | Implemented in closed [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4), absent from main. | Preserved reference; do not rebuild issue #2. |
| Claude trial preparation | Closed [PR #5](https://github.com/aschiff98/triangle-startups-community/pull/5), parked; no Claude run. | Revisit only as a separately selected, bounded trial. |
| Triangle Q&A | [Issue #7](https://github.com/aschiff98/triangle-startups-community/issues/7) and [brief on main](proposals/triangle-questions.md); no prototype. | Agree a first task, source permissions, evaluation and contribution terms. |

The archived branches have prior validation, but every new contribution must run current checks. Do not manufacture a passing status or bypass protection. Their separate private-product integration review remains outside this task.

## Publication boundary

The community starter is public under MIT using a fresh independent Git history. Both earlier repository copies remain private because the owner chose not to publish their personal author contact metadata. Commit-email privacy is enabled, and the final repository's generated PR merge commits use GitHub no-reply identities. The public repository recreates the original issues and separate contribution PRs without copying old Git objects or workflow records. Clone the new community repository for future work; do not push branches from an old local clone into it.

The separate coverage and compact-results PRs are closed implementation references; Claude preparation is parked. Claude has not run or been connected. Publication does not deploy Triangle Startups or grant access to its private platform.

The next proposed project is a small, self-hostable Triangle startup Q&A experiment. Read proposals/triangle-questions.md for the ownership distinction, approved-source requirement, citation/refusal checks and conditional $6.35 generation estimate for 10,000 short questions. No inference, training, new credentials or spending was started.

The Q&A idea is not part of #8. If selected later, first choose a shareable collection and frozen questions, agree scope/terms, and keep paid execution, hosting, model-weight publication and production integration as separate decisions.
