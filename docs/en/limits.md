# API Limits

Rate limits regulate the number of requests you can send in a time window. These limits help AIVAX prevent abuse and provide a stable API to everyone.

The API limits below are the same for all embedded AIVAX models. These limits are categorized by operations performed by the API. Each account has a tier that defines which limits apply to the account. Tiers change according to the total invested in AIVAX and the age of the account.

- **Tier zero:** new account that has never added credits or that has test credits.  
- **Tier 1:** account created at least 48 hours ago and that has already added any amount of credits.  
- **Tier 2:** account created at least 1 month ago and that has already added at least $100 in credits.  
- **Tier 3:** account created at least 3 months ago and that has already added at least $1,000 in credits.

Measurement is based on **credit addition** and not on consumption. For example, you do not need to spend $100 in credits to move to Tier 2.

Limit legends:

- **RPM:** requests per minute.  
- **RPD:** requests per day (24 hours).  
- **TPM:** input tokens per minute.

# [New account](#tab/free)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 50 | - | - |
| Document insertion | - | 100 | - |
| Inference | 5 | 300 | 50,000 |
| Inference (high‑end models) | - | - | - |
| Serverless execution | 5 | 100 | - |
| Tools (shared) | - | 100 | - |
| `web_search` tool | - | 20 | - |
| `x_posts_search` tool | - | 20 | - |
| `generate_image` tool | - | 5 | - |

# [Tier 1](#tab/tier1)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 150 | - | - |
| Document insertion | - | 3,000 | - |
| Inference | 75 | 10,000 | 1,000,000 |
| Inference (high‑end models) | 75 | 10,000 | 200,000 |
| Serverless execution | 30 | - | - |
| Tools (shared) | - | 1,000 | - |
| `web_search` tool | - | 300 | - |
| `x_posts_search` tool | - | 300 | - |
| `generate_image` tool | - | 30 | - |

# [Tier 2](#tab/tier2)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 300 | - | - |
| Document insertion | - | 10,000 | - |
| Inference | 200 | - | 4,000,000 |
| Inference (high‑end models) | 200 | - | 1,000,000 |
| Serverless execution | 100 | - | - |
| Tools (shared) | - | 10,000 | - |
| `web_search` tool | - | 1,000 | - |
| `x_posts_search` tool | - | 1,000 | - |
| `generate_image` tool | - | 300 | - |

# [Tier 3](#tab/tier3)

| Operation | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Document search | 1,000 | - | - |
| Document insertion | - | 30,000 | - |
| Inference | 1,000 | - | 10,000,000 |
| Inference (high‑end models) | 1,000 | - | 4,000,000 |
| Serverless execution | 500 | - | - |
| Tools (shared) | - | 50,000 | - |
| `web_search` tool | - | 10,000 | - |
| `x_posts_search` tool | - | 10,000 | - |
| `generate_image` tool | - | 1,000 | - |

---

- **Document search:** includes semantic search of documents in a collection via the `../collections/{id}/query` search endpoint.  
- **Document insertion:** includes creation and modification of documents in a collection.  
- **Inference:** any inference or function call, whether through chat client or API.  
    - high‑end models refer to models that require Tier 1 to be used.  
- **Serverless:** includes any call to a [serverless function](/docs/en/serverless).  
- **Tools (shared):** any [built‑in tool](/docs/en/builtin-tools) invoked by the assistant. This limit is shared across all tools provided by AIVAX and does not apply to tools you define or your own APIs.  
- **Tool (tool name):** any use of the mentioned tool.

## Model groups

Certain models have rate multipliers. These multipliers are applied to the “limit groups” for specific models, as follows:

- **Common:** limits are multiplied by 1×  
- **Discounted:** limits are multiplied by 0.5×  
- **Low‑latency:** limits are multiplied by 0.3×  
- **Free:** limits are multiplied by 0.1×  

For example, if you use a discounted‑price model, the rate limits will be 50 % lower for you, so instead of 75 requests per minute in Tier 1, you will have 37 requests.

## Limits for BYOK (Bring‑your‑own‑key)

For models provided by you, the applied limit is **1,500** requests per minute. This limit is separate from the integrated inference limit.