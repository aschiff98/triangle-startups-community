---
authored_by: agent
date: 2026-10-20
---

# Security and contribution review

Use the repository's **Security → Report a vulnerability** option to report a suspected vulnerability privately. Do not put credentials, private records or exploit details in a public issue. Maintainers can view reports in the [security advisories area](https://github.com/aschiff98/triangle-startups-community/security/advisories).

## Checks before merge

Every PR into `main` must pass these GitHub Actions checks:

| Check | What blocks a merge |
| --- | --- |
| Test, build and types | A failed test, typecheck or build. |
| Secret scan | A Gitleaks finding anywhere in fetched Git history, a failed download/checksum or a failed detection self-test. Values are redacted. |
| Dependency review | A changed dependency with a known high or critical vulnerability, including runtime, development and unknown scopes. |
| Dependency audit | A known high or critical vulnerability anywhere in the full npm lockfile, or an unavailable/failed audit. |
| CodeQL (javascript-typescript) | Failed analysis, missing/invalid results, a security score of 7 or higher, or an error-level finding. |
| CodeQL (actions) | The same rules, applied to GitHub Actions workflows. |

CodeQL uploads its reports to GitHub's Security tab. The separate result check matters: successful upload alone does not establish that a report has no blocking findings. Missing severity metadata on a security finding fails closed. Low/moderate findings remain visible for review. No findings or advisories are silently allowlisted by this change. See the [security workflow](.github/workflows/security.yml), [CodeQL result gate](tools/check-codeql-results.mjs) and [dependency-review documentation](https://github.com/actions/dependency-review-action).

Secret scanning and push protection are also enabled in repository settings. These detect supported secret patterns; they do not identify every possible password. GitHub's separate non-provider-pattern and partner-validity settings still report disabled after API requests, so they are not counted as active protections. Partner validity checks have [plan and ownership requirements](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/customize-leak-detection/enable-validity-checks); no paid plan was enabled. The independent PR scanner uses Gitleaks' built-in rules, ignores inline allow comments and does not read a contribution's ignore file. Its synthetic-token self-test creates no real credential and prints no token. The [scanner release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1) and archive SHA-256 are pinned in the workflow.

## Running untrusted contributions

- Review a fork PR's code, workflow and dependency changes **before approving its workflows**. Approval is required for all outside contributors, including returning contributors. Approval to run tests is separate from approval to merge.
- Use a disposable environment without application secrets or access to private repositories. Public CI uses GitHub-hosted runners. No self-hosted runner, production credential, deployment or privileged `pull_request_target`/`workflow_run` checkout is part of this setup.
- Tokens default to read-only. Only the CodeQL job requests `security-events: write` to upload analysis results; it cannot write repository contents or approve PRs. No job receives an application secret.
- npm installation hooks are disabled by `.npmrc` and explicitly in CI. `npm test` and other deliberately invoked scripts still execute code, so isolation and review remain necessary. A dependency that needs an installation hook requires a separate reviewed change; do not turn all hooks back on to fix an install.
- `CODEOWNERS` requests maintainer review. It does not add an independent approval requirement: Adam remains the sole maintainer and the current policy requires zero second approvals. Human review of unfamiliar code remains essential.

## Ongoing checks and updates

CodeQL, the full dependency audit and secret scanning run on PRs, pushes to `main` and weekly on Tuesday at 09:23 UTC. Dependency review compares the base and head of each PR. Dependabot proposes weekly npm and action updates and opens security-fix PRs; it does not merge them. These schedules begin on `main` after this workflow/configuration PR is merged.

Actions are pinned to exact, verified commits, and the repository's allowlist admits only the reviewed pins. A future action-update PR may need a maintainer to verify and allow its new exact commit before it can run. Keep existing `main` pins allowed until the replacement is merged. Never open the allowlist to all actions merely to get a check passing. Recheck the [Actions settings](https://github.com/aschiff98/triangle-startups-community/settings/actions) when changing a pin.

GitHub-hosted scanning, advisory data and pattern rules have limits. Passing checks do not prove the absence of malware. A community merge does not authorize production integration: that still requires a separate private-product PR and review. If a secret is detected, keep its value out of discussion and logs and have the owner handle revocation; deleting a line does not revoke a credential.
