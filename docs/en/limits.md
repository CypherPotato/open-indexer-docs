# Plans and limits

## Plans

AIVAX offers three subscription plans: **Free**, **Pro**, and **Max**. To compare commercial differences, included features and updated prices between the plans, see the [AIVAX pricing page](https://aivax.net/pricing). This page only maintains technical limits useful for integration and operation.

All plans are renewed monthly and do not require a long‑term commitment. When you subscribe to a plan, the subscription amount is automatically deducted from the account balance. On the 1st of each month, the subscription amount is renewed again if there is sufficient balance in the account for the current monthly fee. When you subscribe to a plan after the first day of the month, a proportional amount is charged for the remaining period of the month, and the full renewal will occur in the next monthly cycle.

No plan includes usage credits, and usage limits are applied regardless of the account balance, independent of the available balance. The plans imply better in plans and resources that are provided in AIVAX, in addition to the convenience of consolidating the balance for multiple different services into a single wallet.

It is important to note that the use of cost‑incurring resources is immediately stopped when the account balance is zero or negative, regardless of the subscription plan. Therefore, it is essential to maintain a positive balance to ensure continued access to resources and avoid service interruptions.

## Limits

Usage limits regulate the number of requests and resources available according to your account's subscription plan.

Limits appear in different forms depending on the resource. In inference, they may limit requests per minute, tokens per minute, or access to model groups. In BYOK, they limit the number of calls that go through the AIVAX infrastructure even when the external provider cost is yours. In RAG, they control the number of collections, searches per minute, insertions per day, and JSONL batch size. In embedded tools, they control how many times a service action can be executed per day or per period. In Batch, they control how many items can be processed in the background according to the plan.

When a limit is reached, the expected behavior is to stop, pause, or return an error, depending on the resource. A direct inference call tends to return an error immediately. A Batch job can be paused and resumed later because it is asynchronous. An embedded tool may fail within the conversation and the model must explain the limitation to the user. A RAG insertion above the plan limit should be split into smaller batches or performed after a plan adjustment. For commercial differences, prices and included features, use the [AIVAX pricing page](https://aivax.net/pricing); this page serves to guide integration and operation.

## [Free](#tab/free)

| Feature | Value |
| --- | --- |
| Model access | Basic models |
| Inference commission | 25% |
| BYOK (Bring your own key) | Limited |
| JSON Healing | Yes |
| Stability routing | Yes |
| Complexity routing | No |
| Rate limits | Considerable |
| Maximum context | 64K tokens |
| **RAG** |  |
| Collections | Up to 5 RAG collections |
| Searches | Low limit — 20 searches/min |
| Insertions | Low limit — 500 insertions/day |
| Composite processing | Not available |
| **Embedded tools** |  |
| Internet search | 15/day |
| Twitter/X search | Not available |
| Deep search | Not available |
| Document and web page generation | 5/day |
| Image generation and editing | 5/day |
| Code execution and advanced requests | 30/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 30 MB (fixed limit) |
| Conversation retention | 2 hours |
| Support | By email |

## [Pro](#tab/pro)

| Feature | Value |
| --- | --- |
| Model access | Advanced models |
| Inference commission | 5% |
| BYOK (Bring your own key) | Yes |
| JSON Healing | Yes |
| Stability routing | Yes |
| Complexity routing | Yes |
| Rate limits | High |
| Maximum context | Unlimited |
| **RAG** |  |
| Collections | Unlimited |
| Searches | High limit — 500 searches/min |
| Insertions | High limit — 10,000 insertions/day |
| Composite processing | Up to 3 files/day |
| **Embedded tools** |  |
| Internet search | 1,000/day |
| Twitter/X search | 1,000/day |
| Deep search | 100/day |
| Document and web page generation | 1,000/day |
| Image generation and editing | 500/day |
| Code execution and advanced requests | 5,000/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 2 GB (overage: $0.50/GB/month) |
| Conversation retention | 2 days |
| Support | Priority |

## [Max](#tab/max)

| Feature | Value |
| --- | --- |
| Model access | All models |
| Inference commission | None |
| BYOK (Bring your own key) | Yes |
| JSON Healing | Yes |
| Stability routing | Yes |
| Complexity routing | Yes |
| Rate limits | Highest |
| Maximum context | Unlimited |
| **RAG** |  |
| Collections | Unlimited |
| Searches | Elevated limit — 3,000 searches/min |
| Insertions | Unlimited |
| Composite processing | Up to 10 files/day |
| **Embedded tools** |  |
| Internet search | 10,000/day |
| Twitter/X search | 10,000/day |
| Deep search | 1,000/day |
| Document and web page generation | 50,000/day |
| Image generation and editing | 5,000/day |
| Code execution and advanced requests | 100,000/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 20 GB (overage: $0.20/GB/month) |
| Conversation retention | 30 days |
| Support | Dedicated |

---

## Model groups

Certain models have rate multipliers:
- **Standard:** 1x
- **Discounted:** 0.5x
- **Low‑latency:** 0.3x
- **Free:** 0.1x

Example: if you use a "discounted" model, the rate limits will be 50 % lower (e.g., 75 req/min → 37 req/min).

## Limits for BYOK (Bring‑your‑own‑key)

There is no cost to use your own API key. The Free plan has more restrictive limits, the Pro plan has a higher limit, and the Max plan has no BYOK request limit. To compare differences between plans, see the [AIVAX pricing page](https://aivax.net/pricing).

## Rate limit details

This section details the limits applied per operation for each plan.

### Integrated inference

- **Free:** 20 req/min, 500 req/day, 1,000,000 tokens/min
- **Pro:** 200 req/min, 20,000,000 tokens/min
- **Max:** Unlimited

### BYOK (Bring your own key)

- **Free:** 30 req/min, no input token limit
- **Pro:** 200 req/min, no input token limit
- **Max:** Unlimited

### Bash (code execution)

Bash limits refer to the number of commands executed per hour inside containers.

- **Free:** 
    - 30 commands per hour
    - 2 concurrent instances
    - command timeout of 15 seconds
    - 32 MB memory limit per instance
    - 1 virtual CPU per instance
    - expires immediately after the end of the synthetic loop
    - allows persistent storage
- **Pro:**
    - 1,500 commands per hour
    - 10 concurrent instances
    - command timeout of 30 seconds
    - 128 MB memory limit per instance
    - 2 virtual CPUs per instance
    - persistent sessions expire after 15 minutes
    - allows persistent storage
- **Max:**
    - 10,000 commands per hour
    - 50 concurrent instances
    - command timeout of 60 seconds
    - 256 MB memory limit per instance
    - 4 virtual CPUs per instance
    - persistent sessions expire after 30 minutes
    - allows persistent storage