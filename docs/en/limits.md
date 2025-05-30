# API Limits

Rate limits ("rate limiters") regulate the number of requests you can send in a time window. These limits help Open Indexer prevent abuse and provide a stable API to everyone.

The API limits below are the same for all embedded AIVAX models. These limits are categorized by operations performed by the API. Each account has a tier that defines which limits are applied to the account. Tiers change according to the total invested in Open Indexer and the time the account has existed.

- **Tier zero (free account):** new account that has never added credits.
- **Tier 1**: account created at least 48 hours ago and has added any credit value.
- **Tier 2**: account created at least 1 month ago and has added at least $100 in credits.
- **Tier 3**: account created at least 3 months ago and has added at least $1,000 in credits.

The measurement is by **credit addition** and not by consumption. For example, you don't need to consume $100 in credits to advance to Tier 2.

Limit legends:

- **RPM**: requests per minute.
- **RPD**: requests per day (24 hours).

# [Free](#tab/free)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 50 | - |
| Document insertion | - | 100 |
| Inference | 5 | 500 |
| Function | 5 | 500 |
| Function (Live) | 3 | 30 |

# [Tier 1](#tab/tier1)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 150 | - |
| Document insertion | - | 3,000 |
| Inference | 75 | 1,000 |
| Function | 50 | 1,000 |
| Function (Live) | 5 | 200 |

# [Tier 2](#tab/tier2)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 300 | - |
| Document insertion | - | 10,000 |
| Inference | 150 | - |
| Function | 50 | 10,000 |
| Function (Live) | 10 | 400 |

# [Tier 3](#tab/tier3)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 1,000 | - |
| Document insertion | - | 30,000 |
| Inference | 1,000 | - |
| Function | 750 | - |
| Function (Live) | 200 | - |

---

- **Document search**: includes semantic search of documents in a collection by the search endpoint `../collections/{id}/query`.
- **Document insertion**: includes creation and modification of documents in a collection.
- **Inference**: every inference call, either by the Open-AI compatible API, by the route `/ai-gateways/{id}/inference`, or by each message sent by a client chat session.
- **Function**: every function call `/functions`.
- **Function (Live)**: every function call connected to the internet by the `webSearch` parameter. Does not include `fetch` calls.