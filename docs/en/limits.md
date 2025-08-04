# API Limits

Rate limits regulate the number of requests you can send in a time window. These limits help AIVAX prevent abuse and provide a stable API to everyone.

The API limits below are the same for all AIVAX embedded models. These limits are categorized by operations made by the API. Each account has a tier that defines which limits are applied to the account. Tiers change according to the total invested in AIVAX and the time the account exists.

- **Tier zero:** new account that has never added credits or has test credits.
- **Tier 1**: account created at least 48 hours ago and has added any credit value.
- **Tier 2**: account created at least 1 month ago and has added at least $100 in credits.
- **Tier 3**: account created at least 3 months ago and has added at least $1,000 in credits.

The measurement is by **credit addition** and not by consumption. For example, you don't need to consume $100 in credits to advance to Tier 2.

Limit legends:

- **RPM**: requests per minute.
- **RPD**: requests per day (24 hours).

# [New Account](#tab/free)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 50 | - |
| Document insertion | - | 100 |
| Inference | 5 | 300 |
| Internet function | 2 | 30 |

# [Tier 1](#tab/tier1)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 150 | - |
| Document insertion | - | 3,000 |
| Inference | 75 | 10,000 |
| Internet function | 20 | 500 |

# [Tier 2](#tab/tier2)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 300 | - |
| Document insertion | - | 10,000 |
| Inference | 150 | - |
| Internet function | 60 | - |

# [Tier 3](#tab/tier3)

| Operation | RPM | RPD |
| --- | --- | --- |
| Document search | 1,000 | - |
| Document insertion | - | 30,000 |
| Inference | 1,000 | - |
| Internet function | 200 | - |

---

- **Document search**: includes semantic search of documents in a collection by the search endpoint `../collections/{id}/query`.
- **Document insertion**: includes creation and modification of documents in a collection.
- **Inference**: every inference or function call, either by chat client or API.
- **Internet function**: every function call connected to the internet through internet search (does not include `fetch`).

## Limits for BYOK (Bring-your-own-key)

For models provided by you, the applied limit is **3,600** requests per minute.