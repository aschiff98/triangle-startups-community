---
authored_by: agent
date: 2026-10-17
status: proposal
---

# Questions about Triangle startups

## Executive summary

Explore a small, self-hostable assistant that answers questions about startups in North Carolina's Research Triangle using approved public sources. Every factual answer should show its sources and dates. Questions beyond that subject, or beyond the available evidence, should receive a clear explanation of the limit. A useful first result is a repeatable local experiment with measured accuracy and costs. No model, dataset, training run or hosted endpoint is being launched by this proposal.

Start by testing a downloadable model near 10 billion parameters with a searchable collection of approved documents. This approach lets the collection stay current without retraining the model for each new job or funding announcement. Whether a model this size answers well enough remains an experiment. The parameter count is a starting point, not an acceptance test.

## What someone would build

A person asks, for example, "Which Durham software companies have advertised engineering roles in the saved sources?" The system finds relevant dated records, uses them to compose an answer, and links each claim to the supporting record. It distinguishes an advertised job from general company research. An old posting does not become a claim that a role is open today.

The first contribution should be a local experiment with a small, explicitly shareable collection and saved evaluation questions. Use fictional examples until a real source collection has been reviewed. Keep the application, document collection and evaluation portable so Triangle Startups can operate the system and change providers later.

Answering about a selected document collection is often called retrieval-augmented generation: find the evidence first, then give that evidence to the model. Source restrictions, answer checks and refusal behavior belong in the application as well as the prompt. A model's small size, fine-tuning or system prompt does not guarantee that it stays on topic or never invents facts.

## Ownership and licenses

The goal is a Triangle Startups-operated product with an exportable document collection, search index, configuration and evaluation. A downloadable third-party model can be run on infrastructure we control, but its existing weights retain their original ownership and license. This does not make those weights exclusively owned by Triangle Startups. Training an entirely new foundation model would require a separate data, compute and ownership plan.

For one concrete candidate, [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) publishes downloadable weights under Apache 2.0. Its license and notices must be preserved if it is used. The repository's MIT License does not replace a model or dataset license. Contributors retain their own copyrights; public collaboration does not automatically assign exclusive ownership to Triangle Startups.

Use only documents approved for this purpose. A page being publicly readable does not establish permission to redistribute its full text or train on it. Record the source, publication/check dates, permission or license, and permitted use for every included document. Private conversations, candidate information and unpublished research stay outside this experiment. Do not export the private platform or connect its database.

## A concrete cost target

Target **10,000 defined questions for less than $10 in generation charges**, then separately report the full operating cost. A target is not a result or a spending authorization.

As checked on 2026-10-17, [Together's model catalog](https://docs.together.ai/docs/serverless/models) lists `Qwen/Qwen3.5-9B` at $0.17 per million input tokens and $0.25 per million output tokens. [Its pricing page](https://www.together.ai/pricing) agrees. A token is a small piece of text; input includes instructions, retrieved documents and conversation history. Output must include all billed generation, including reasoning where applicable.

Assuming one generation call per question, no discounts and no retries:

| Questions | Input tokens per question | Billed output tokens per question | Estimated generation charge |
| --- | --- | --- | --- |
| 1,000 | 3,000 | 500 | $0.635 |
| 10,000 | 3,000 | 500 | $6.35 |
| 10,000 | 8,000 | 1,000 | $16.10 |

Formula: questions × (input tokens × 0.17 + output tokens × 0.25) ÷ 1,000,000. These are calculations from posted rates, not measured costs or a provider commitment. Prices and model availability can change. Quality, actual token counts and reasoning defaults need measurement before adoption.

The estimates exclude retrieval, document preparation, embeddings, reranking, storage, application hosting, taxes and retries. Include every extra model call in the actual cost record. Do not fetch the web separately for each question in the first experiment. Any hosted test needs an explicitly approved account, external spending limit and query/output limits before it runs. No credentials belong in this repository.

Hosted inference is one optional way to measure generation cost. A self-hosted version needs separate measurements for hardware, idle time, power, memory, throughput and cold starts. Downloadable weights permit provider independence, but hosted per-token prices do not predict the cost of running our own server. A $10 generation target is not a $10 training budget or an all-inclusive monthly hosting promise.

## What done looks like for the first contribution

- A small approved or fictional document collection has source IDs, dates and permission records. Its exact version is recorded.
- A command accepts a question and returns either a supported answer with citations, an explanation that the available evidence cannot answer, or an explanation that the question is outside the Triangle startup subject.
- A frozen evaluation includes answerable questions, missing or stale evidence, unrelated questions, and attempts to make source documents override instructions. Proposed first set: 50 answerable, 20 evidence-limited, 15 unrelated and 15 adversarial questions. Keep a separate unseen set before making a broader quality claim.
- A reviewer can inspect claim support, source/date accuracy, missing-evidence behavior and domain refusals. List every failure. No unsupported factual answer, private information disclosure or successful instruction override passes the proposed initial evaluation gate. Passing this finite set does not establish a universal guarantee.
- Compare at least one compact downloadable model against a simple search-only baseline. Report quality and cost rather than choosing by parameter count alone. A supervised fine-tune is a later experiment if measured errors justify it and the training data rights are clear.
- Record exact model/version, generation settings, all billable tokens and calls, retries, input/output limits, evaluation results, review time and median/tail latency. Separate estimates from provider receipts or measured self-hosting costs.
- Return a bounded PR with a runnable local example, test results, a cost calculation and remaining unknowns. A real prototype must be evaluated in its rendered form when a UI is added. Production integration, public model-weight releases and ongoing services require their own review.

## Sources and evidence limits

| Claim | Source | Type | Evidence strength |
| --- | --- | --- | --- |
| Qwen3.5-9B offers downloadable weights with Apache 2.0 licensing | [Publisher model card](https://huggingface.co/Qwen/Qwen3.5-9B) | Primary publisher | Direct; recheck the exact weight revision and LICENSE before use |
| Hosted Qwen3.5-9B is listed at $0.17 input / $0.25 output per million tokens | [Together catalog](https://docs.together.ai/docs/serverless/models), [pricing](https://www.together.ai/pricing) | Primary provider | Direct as checked on 2026-10-17; not a future price guarantee |
| 10,000 calls at 3,000 input / 500 output tokens imply $6.35 generation charges | Formula above using listed rates | Calculation | Conditional on the stated workload; no benchmark has run |
| Retrieval plus a compact model is a useful first experiment | Proposed design and acceptance criteria above | Agent recommendation | Hypothesis to test; quality and total cost are unknown |

This is an exploration proposal, not a paid assignment, employment offer, funding commitment or maintenance obligation. Agree the first contributor's scope, credit and any other terms before work starts.
