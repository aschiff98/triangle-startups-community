---
authored_by: agent
date: 2026-11-04
---

# Job export comparison

This command compares a sanitized aggregator export with a saved Triangle Startups job list and explains the differences. It reads two saved files and makes no network requests. The result describes those two snapshots, not current live coverage or hiring outcomes.

## Run it

From a fresh checkout, using fictional data:

```sh
npm ci
node --import tsx tools/compare-job-exports.ts fixtures/job-exports/example-export.json fixtures/job-exports/example-roster.json
```

That prints a Markdown report. To save the report and its machine-readable results, add `--out-dir`:

```sh
node --import tsx tools/compare-job-exports.ts your-export.json datasets/public-jobs/2026-10-18/public-jobs.json --out-dir ../job-comparison-output
```

This writes `job-export-comparison.md` and `job-export-comparison.json`. Both inputs may be `.json` or `.csv`. Keep real exports and their reports outside Git unless they are approved for publication. The bundled public snapshot is the one approved exception.

## Sample output

Summary from the fictional example above:

| Result | Count |
| --- | --- |
| Already listed | 1 |
| Confirmed missing open startup jobs | 1 |
| Explicitly eligible startup-support jobs | 1 |
| Duplicates | 1 |
| Closed | 1 |
| Out of scope | 1 |
| Needs review | 3 |
| Roster rows with no matching export link | 1 |
| Export rows skipped | 0 |
| Roster rows skipped | 0 |

Each section lists the employer, role, source link, available dates and a short reason. The report also lists roster rows the export did not find, roster links shared by several roles, and any skipped rows. It records each file's name, SHA-256 and observation dates, and repeated runs give identical output.

## Export format

JSON uses this envelope, and the same fields work as CSV columns:

```json
{
  "schemaVersion": "atriveo.job-export.v1",
  "capturedAt": "2026-10-20",
  "jobs": [{ "employer": "Example River", "title": "Software Engineer", "sourceUrl": "https://river.example.test/jobs/two", "scope": "startup", "availability": "open", "postedOn": null, "firstObservedOn": "2026-10-18", "fetchedOn": "2026-10-20" }]
}
```

`location` and `evidence` are optional job-evidence fields. Any other field is rejected. Its row is skipped and reported by row number and field name, and its values are never read into the report. An unexpected top-level field rejects the whole file.

## Field mapping

The aggregator is `atriveo-engine`. It has no export command yet, so a sanitized export needs to be produced from these `jobs` columns.

| Export field | `atriveo-engine` source | Notes |
| --- | --- | --- |
| `employer` | `company` | |
| `title` | `title` | |
| `sourceUrl` | `job_url` | |
| `location` | `location` | Optional. Useful scope evidence. |
| `postedOn` | `date_posted` | Greenhouse falls back to `updated_at` when `first_published` is absent, so this may be an edit date. Leave it null unless it is a true publication date. |
| `firstObservedOn` | `first_run` | Holds a run ID. Use that run's `runs.started_at`. |
| `fetchedOn` | `last_run` | Holds a run ID, and it is carried forward when a source or board fails. Use it only where that run actually fetched the source. |
| `scope` | None | Not recorded by the engine. Defaults to `unknown`. |
| `availability` | None | Not recorded by the engine. Defaults to `unknown`. |

Do not export the engine's `score`, `summary`, `search_term`, sponsorship or description data. The comparison does not need them. Resumes, application answers and histories, inbox data, contacts, credentials and private notes must never be included.

Without `scope` and `availability`, every engine record correctly lands in **Needs review**. Those records still carry a note when the link or employer is on the roster, which is useful for triage. Reporting a confirmed missing job requires adding that evidence to the record.

## How records are sorted

Matching uses the existing comparator without changing its decisions: the same employer and normalized posting link. Equal titles at different employers stay separate, tracking parameters are ignored and meaningful job IDs are kept. The report then applies stricter evidence rules, each of which can only move a record to **Needs review**:

- A link on the roster under a different title is not treated as listed.
- A repeated export link with a different title is not treated as a duplicate.
- An open record with no check date or no title is not treated as confirmed missing.

`matcherDecision` in the JSON keeps the comparator's original result, so each of these moves can be audited. Unknown or conflicting availability and scope also stay in review. Invalid links are held for review with the link withheld, because a link with embedded credentials must not be printed.

Dates stay separate. Missing or invalid dates stay unknown, and importing a file does not count as checking a posting.

## Limitations

- **Shared links:** the comparator identifies a job by employer and link, so a general careers page cannot separate roles. In the bundled snapshot, 298 rows have 279 distinct links, and 7 links are shared by several titles. Row counts are not job-level coverage rates.
- **Job moves:** a role that changes link or employer name appears as two jobs. There is no fuzzy matching, and any such rule needs a separate review.
- **Bundled snapshot availability:** every row is `unknown` because the capture did not recheck employer postings. Presence on the roster is not evidence that a job is open.
- **No scope check:** the tool does not decide whether an employer is a Triangle startup. It only reports what the files state.
- **Timing:** the two files may be captured on different dates, which can explain differences on its own. Check the dates under "Files compared".
