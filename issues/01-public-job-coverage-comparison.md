---
authored_by: agent
date: 2026-10-09
status: ready to start from fictional fixtures; contributor acceptance pending
---

# Issue 1: Compare public job coverage without private access

## Executive summary

Build a small offline comparison of employer-source records and a public job roster. The result should explain each disposition and identify confirmed eligible open roles missing from the roster. Counts alone cannot establish a coverage gap. Start with supplied fictional fixtures; identifying a real demo role is a later source-validation step, not a blocker to this implementation.

**Terms:** no monetary compensation; public acknowledgement of the work, Adam's vouch and concierge help. Participation is voluntary; no job, referral result, deadline or ongoing maintenance is promised. See the packet README for attribution/reuse details.

## Scope and ownership

Own new `lib/coverage/compare.ts`, an optional local `tools/compare-coverage.ts`, focused `tests/coverage.test.ts`, and a short comparison receipt. Use `lib/coverage/types.ts` and `fixtures/job-coverage.json`. Do not change the matcher, UI, input contract or dependencies without naming the reason for review.

Inputs are dated snapshots passed by the caller, not a database or network fetch. Accept startup and startup-support ecosystem records when explicitly marked eligible. General enterprise/staffing records are outside this comparison's eligible set; their exclusion must not erase their existence. Unknown scope requires review. This fixture scope is not a change to the site's directory policy.

## Acceptance

1. The supplied fixture produces the eight expected dispositions: listed, missing confirmed open (startup and ecosystem), availability unknown, closed, duplicate, out of scope and scope unknown.
2. Compare canonical source URLs after safe URL parsing and documented normalization. Deduplicate within one employer; do not merge different employers solely on equal titles. Include tests for the same title at different employers, malformed URLs, and contradictory open/closed observations. Conflicting observations need an explicit unresolved explanation, not a guessed closure or silently counted miss.
3. Preserve `postedOn`, `firstObservedOn` and `fetchedOn` separately. A missing posted date stays null. An unavailable board never establishes closure or a confirmed missing open job. Every finding keeps its source and reason.
4. Return stable findings without altering either input. Provide a repeatable CLI invocation or exported-function example. Tests and the receipt must make deduplication and count denominators inspectable.
5. No credentials, application answers, resume ingestion, account access, new crawler, scheduler, data writes, new job API or source-registration change.

## Review evidence

One pull request, comparison output, focused tests and normal starter checks. The receipt labels all initial data fictional. If a real role is later supplied, record its exact employer URL, check time, current availability, eligible scope and dated public-roster snapshot. The fictional tool run does not prove any real role was missed. A larger source/refresh change is a separate reviewed decision.
