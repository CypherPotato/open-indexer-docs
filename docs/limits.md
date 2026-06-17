# Plans and Limits

AIVAX has three account plans: **Free**, **Pro**, and **Max**. The current plan is stored on the account and controls model access, commissions, rate limits, RAG quotas, tool limits, storage quota, conversation retention, and subscription-model reserve windows.

For commercial subscription prices and plan packaging, use the [AIVAX pricing page](https://aivax.net/pricing). This page documents the technical limits implemented by the API.

## How limits are enforced

Limits are enforced at different layers:

- Authentication rejects missing, expired, or unknown API keys.
- Public API keys are restricted to public routes and have key-level and per-IP request and token limits.
- Balance middleware rejects billable requests when the account balance is below the required minimum.
- Storage middleware rejects requests when account storage exceeds the plan quota.
- Inference checks model access, request rate, input-token rate, BYOK rate, and Free-plan context size.
- RAG checks collection count, search rate, insertion rate, and JSONL import size.
- Built-in tools check daily service limits.
- Batch processing checks how many workflow items can be processed per day.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Plan summary

| Feature | Free | Pro | Max |
| --- | --- | --- | --- |
| Model access | Low-price/basic models | Advanced models | All models |
| Inference commission multiplier | 1.25x | 1.05x | 1.00x |
| BYOK requests | 30/min | 200/min | Unlimited |
| Maximum context | 65,536 input tokens enforced at runtime | Model or gateway limit | Model or gateway limit |
| Subscription model reserve | None | 250 units/6h and 3,000 units/week | 1,000 units/6h and 15,000 units/week |
| Storage quota | 30 MB | 2 GB | 20 GB |
| Conversation retention | 2 hours | 2 days | 30 days |
| Support level | Email | Priority | Dedicated |

## Integrated inference

Integrated model requests are rate-limited by request count and input tokens.

| Plan | Request limit | Input-token limit |
| --- | --- | --- |
| Free | 20/min and 500/day | 1,000,000/min |
| Pro | 200/min | 20,000,000/min |
| Max | Unlimited | Unlimited |

Model rate-limit groups adjust request-count thresholds:

| Rate-limit group | Threshold multiplier |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

For example, a Pro account normally has 200 integrated-model requests per minute. With a `Discounted` model group, the adjusted threshold is 100 requests per minute.

## BYOK inference

BYOK means the gateway uses a provider key configured on the gateway instead of an integrated AIVAX model. BYOK still passes through AIVAX infrastructure and is rate-limited by plan:

| Plan | BYOK request limit |
| --- | --- |
| Free | 30/min |
| Pro | 200/min |
| Max | Unlimited |

## Public API keys

Public keys have additional limits independent of the account plan.

| Scope | Request limits |
| --- | --- |
| Per remote address | 3/5s, 20/min, 300/hour, 1,000/day |
| Global per key | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Scope | Token limits |
| --- | --- |
| Per remote address | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global per key | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Public keys are only accepted on routes marked public by the backend. In this checkout, public routes include RAG semantic search, RAG answer generation, and chat completions. For chat completions, public keys also require a full AI Gateway UUID, restrict request parameters, and strip server-side tool surfaces. See [Authentication](authentication.md).

## RAG and collection limits

| Feature | Free | Pro | Max |
| --- | --- | --- | --- |
| Collections | 5 | Unlimited | Unlimited |
| Semantic searches | 20/min | 500/min | 3,000/min |
| Document insertions | 500/day | 10,000/day | Unlimited |
| JSONL documents per import request | 1,000 | 10,000 | 1,000,000 |
| Compound file processing | Not available | 3 files/day | 10 files/day |

The JSONL import endpoint rejects a request when it reaches the plan's per-request document limit.

## Built-in tool limits

| Tool category | Free | Pro | Max |
| --- | --- | --- | --- |
| Web search | 15/day | 1,000/day | 10,000/day |
| X/Twitter search | Not available | 1,000/day | 10,000/day |
| Advanced web search | Not available | 100/day | 1,000/day |
| Document and web page generation | 5/day | 1,000/day | 50,000/day |
| Image generation and editing | 5/day | 500/day | 5,000/day |
| General service actions | 30/day | 5,000/day | 100,000/day |
| Bash commands | 30/hour | 1,500/hour | 10,000/hour |

General service actions cover service operations wired through the shared `ServicesGeneral` limiter.

## Batch processing

Batch imports have request-size guards, and workflow processing has a daily plan limit.

| Feature | Free | Pro | Max |
| --- | --- | --- | --- |
| Workflow items processed | 500/day | 100,000/day | Unlimited |
| Files per import request | 1,000 | 1,000 | 1,000 |
| Total import size | 100 MB/request | 100 MB/request | 100 MB/request |
| Single imported file size | 10 MB | 10 MB | 10 MB |

Batch is asynchronous. If processing is paused or fails because of quota, retry after the quota window resets or upgrade the account.
