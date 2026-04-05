# Plans and Limits

## Plans

AIVAX offers three subscription plans: **Free**, **Pro** and **Max**. Each plan has specific usage limits, resource access and support, suitable for different needs and usage levels.

The plans fit best to each situation and usage moment of each user:
- **Free:** $0/month: ideal for those starting out, testing the platform, or with basic needs. Provides access to basic models and limited resources, with a reasonable number of requests and built‑in tools.
- **Pro:** $39/month: perfect for users who need more resources, access to advanced models, and higher limits. Includes priority support and additional storage options.
- **Max:** $399/month: intended for advanced users and enterprises that require maximum performance, access to all models, high limits and dedicated support. Offers the best experience and resources available on the platform.

Support is an important differentiator between the plans, with Pro offering priority support and Max offering dedicated support to ensure users' needs are met efficiently. The difference between priority and dedicated support is that priority support provides faster response and access to specialists, while dedicated support offers an exclusive contact for personalized assistance and problem resolution.

All plans are renewed monthly and do not require a long‑term commitment, allowing users to choose the plan that best fits their needs and change as needed. When subscribing to a plan, the subscription fee is automatically deducted from the account balance. On the 1st of each month, the subscription fee is renewed again if there is sufficient balance in the account for the current monthly fee. When subscribing to a plan after the first day of the month, a proportional amount is charged for the remaining period of the month, and the full renewal will occur in the next monthly cycle.

No plan includes usage credits, and usage limits are applied regardless of the account balance, independent of the available balance. The plans provide better access to plans and resources that are offered in AIVAX, as well as the convenience of consolidating balance for multiple different services into a single wallet.

It is important to note that the use of cost‑incurring resources is immediately halted when the account balance is zero or negative, regardless of the subscription plan. Therefore, it is essential to maintain a positive balance to ensure continued access to resources and avoid service interruptions.

## Limits

Usage limits regulate the number of requests and resources available according to your account's subscription plan.

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
| Searches | Low limit — 30 searches/minute |
| Insertions | Low limit — 500 insertions/day |
| Composite processing | Not available |
| **Built‑in tools** |  |
| Internet search | 15/day |
| Twitter/X search | Not available |
| Deep search | Not available |
| Document and web page generation | 5/day |
| Image generation and editing | 5/day |
| Code execution and advanced requests | 30/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 30 MB (fixed limit) |
| Conversation retention | 2 hours |
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
| Searches | High limit — 500 searches/minute |
| Insertions | High limit — 10,000 insertions/day |
| Composite processing | Up to 3 files/day |
| **Built‑in tools** |  |
| Internet search | 1,000/day |
| Twitter/X search | 1,000/day |
| Deep search | 100/day |
| Document and web page generation | 1,000/day |
| Image generation and editing | 500/day |
| Code execution and advanced requests | 5,000/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 2 GB (excess: $0.50/GB/month) |
| Conversation retention | 2 days |
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
| Searches | High limit — 3,000 searches/minute |
| Insertions | Unlimited |
| Composite processing | Up to 10 files/day |
| **Built‑in tools** |  |
| Internet search | 10,000/day |
| Twitter/X search | 10,000/day |
| Deep search | 1,000/day |
| Document and web page generation | 50,000/day |
| Image generation and editing | 5,000/day |
| Code execution and advanced requests | 100,000/day |
| Memory and calendar | Yes |
| **Account** |  |
| Included storage | 20 GB (excess: $0.20/GB/month) |
| Conversation retention | 30 days |
| Support | Dedicated |

---

## Model groups

Certain models have rate multipliers:
- **Standard:** 1x
- **Discounted:** 0.5x
- **Low‑latency:** 0.3x
- **Free:** 0.1x

Example: if you use a “discounted” model, the rate limits will be 50% lower (e.g., 75 req/min → 37 req/min).

## Limits for BYOK (Bring‑your‑own‑key)

There is no cost to use your own API key, however, for the free plan the limits are more restrictive. For the Pro and Max plans there are no limits for BYOK usage.

## Rate limits details

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

Bash limits refer to the number of commands executed per hour within containers.

- **Free:** 
    - 30 commands per hour
    - 2 concurrent instances
    - command timeout of 15 seconds
    - memory limit of 32 MB per instance
    - 1 virtual processor per instance
    - expires immediately after the agent loop ends
    - allows persistent storage
- **Pro:**
    - 1,500 commands per hour
    - 10 concurrent instances
    - command timeout of 30 seconds
    - memory limit of 128 MB per instance
    - 2 virtual processors per instance
    - persistent sessions expire after 15 minutes
    - allows persistent storage
- **Max:**
    - 10,000 commands per hour
    - 50 concurrent instances
    - command timeout of 60 seconds
    - memory limit of 256 MB per instance
    - 4 virtual processors per instance
    - persistent sessions expire after 30 minutes
    - allows persistent storage