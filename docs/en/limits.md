# API Rate Limits

Rate limits regulate the number of requests you can send within a time window. They help prevent abuse and ensure stability for all users.

The limits below are applied according to your account tier:

- **Tier zero:** new account that has never added credits or that has test credits.
- **Tier 1:** account created at least 48 hours ago and has already added any amount of credits.
- **Tier 2:** account created at least 1 month ago and has already added at least $100 in credits.
- **Tier 3:** account created at least 3 months ago and has already added at least $1,000 in credits.

Measurement is based on **credit addition** rather than consumption. Example: you don't need to spend $100 to move to Tier 2; you just need to add that amount.

**Legend:**
- **RPM**: requests per minute
- **RPD**: requests per day (24h)
- **TPM**: input tokens per minute

## [New account](#tab/free)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 10 | - | - |
| Document insertion | - | 30 | - |
| Inference (requests) | 5 | 30 | - |
| Inference (input tokens) | - | - | 50.000 |
| Inference (input tokens - high-end) | 0 | - | 0 |
| Serverless execution | 5 | 100 | - |
| Tools (shared) | - | 100 | - |
| Tool `web_search` | - | 15 | - |
| Tool `x_posts_search` | - | 10 | - |
| Tool `generate_image` | - | 3 | - |

## [Tier 1](#tab/tier1)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 150 | - | - |
| Document insertion | - | 3.000 | - |
| Inference (requests) | 75 | 10.000 | - |
| Inference (input tokens) | - | - | 1.000.000 |
| Inference (input tokens - high-end) | - | - | 200.000 |
| Serverless execution | 30 | - | - |
| Tools (shared) | - | 1.000 | - |
| Tool `web_search` | - | 300 | - |
| Tool `x_posts_search` | - | 100 | - |
| Tool `generate_image` | - | 30 | - |

## [Tier 2](#tab/tier2)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 300 | - | - |
| Document insertion | - | 10.000 | - |
| Inference (requests) | 200 | - | - |
| Inference (input tokens) | - | - | 4.000.000 |
| Inference (input tokens - high-end) | - | - | 1.000.000 |
| Serverless execution | 100 | - | - |
| Tools (shared) | - | 10.000 | - |
| Tool `web_search` | - | 1.000 | - |
| Tool `x_posts_search` | - | 500 | - |
| Tool `generate_image` | - | 300 | - |

## [Tier 3](#tab/tier3)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 1.000 | - | - |
| Document insertion | - | 30.000 | - |
| Inference (requests) | 1.000 | - | - |
| Inference (input tokens) | - | - | 10.000.000 |
| Inference (input tokens - high-end) | - | - | 4.000.000 |
| Serverless execution | 500 | - | - |
| Tools (shared) | - | 50.000 | - |
| Tool `web_search` | - | 10.000 | - |
| Tool `x_posts_search` | - | 5.000 | - |
| Tool `generate_image` | - | 1.000 | - |

---

**Operation descriptions:**
- **Document search:** includes semantic search of documents in a collection.
- **Document insertion:** creation and modification of documents in a collection.
- **Inference (requests):** number of inference or function calls (API or chat client).
- **Inference (input tokens):** input tokens used in inference.
- **Inference (input tokens - high-end):** input tokens for high‑end models (Tier 1+).
- **Serverless execution:** calls to [serverless function](/docs/en/serverless).
- **Tools (shared):** use of [built‑in tools](/docs/en/builtin-tools) provided by AIVAX (does not include custom tools).
- **Tool (name):** individual use of each integrated tool.

## Model groups

Certain models have rate multipliers:
- **Common:** 1x
- **Discounted:** 0.5x
- **Low‑latency:** 0.3x
- **Free:** 0.1x

Example: if you use a "discounted" model, the rate limits will be 50% lower (e.g., 75 req/min → 37 req/min).

## Limits for BYOK (Bring‑your‑own‑key)

For models provided by you, the limit is **1,500 requests per minute** (separate from the integrated inference limit).