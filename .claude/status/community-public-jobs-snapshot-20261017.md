---
authored_by: agent
date: 2026-10-17
---

## Task: Merge contributor instructions and prepare the public jobs snapshot
- Status: review-ready
- Blocker: none for our snapshot; the contributor still supplies the sanitized aggregator export.
- Next action: Use the linked public snapshot for issue #8 and review the data/documentation PR.
- Branch: codex/public-jobs-snapshot-20261017
- Source prompt: ad-hoc
- Started: 2026-10-17
- Last activity: 2026-10-17
- Files touched:
  - datasets/public-jobs/2026-10-18/public-jobs.json
  - datasets/public-jobs/2026-10-18/public-jobs.csv
  - datasets/public-jobs/2026-10-18/provenance.json
  - datasets/public-jobs/2026-10-18/README.md
  - README.md
  - CONTRIBUTING.md
  - AGENTS.md
  - HANDOFF.md
  - .claude/status/community-public-jobs-snapshot-20261017.md
- Notes for Claude Code side: PR #9 is merged at 97f0d49e0e112cba0e94fc6903c78c3a94e4b6b1. The snapshot contains public listing facts only, captured anonymously; no private DB/API was queried, no provider/model was connected, and no importer was implemented. Real descriptions/raw HTML are not published. Preserve all 298 rows, unknown dates and shared careers-page URL ambiguities. The existing CLI needs the issue #8 adapter to handle the two files and unknown dates. This specific public snapshot is approved; other real data still needs separate approval. Original feature PRs remain closed references.

## Verification

All 298 employer/title/posting-URL triples and displayed listed dates match the public Markdown roster. JSON/CSV parity, unique synthetic row IDs, the strict field allowlist, date/null semantics, checksums and safe source links pass validation. The export has no email addresses; Gitleaks reports no credentials in the data/documents. The existing 2 tests, typecheck and production Webpack build pass on Node 24.19.0. Inspect the exact pushed head's hosted Node 22 check separately. No app UI or workflow change is part of the snapshot.

## Next

Atishay can download our approved public snapshot without private-repository or production access. A real comparison still needs his sanitized export and the importer/report work in issue #8.
