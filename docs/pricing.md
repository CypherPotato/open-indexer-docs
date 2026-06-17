# Pricing

AIVAX uses a prepaid account balance. Paid invoices add credit to the account, and usage records subtract from that balance.

The backend calculates balance as:

```text
balance = paid, unexpired invoice total - usage total
```

Use the [AIVAX pricing page](https://aivax.net/pricing) for current commercial plan prices. This page documents billing behavior that is visible in the API source.

## Credits and invoices

Credits are represented as invoices.

- Paid invoices increase the usable account balance until their expiration date.
- Unpaid payment invoices are created with a one-year expiration.
- Unpaid invoices older than three days are removed by cleanup.
- Expired paid invoices no longer count toward balance.
- Payment invoice creation requires at least 3 USD and is rate-limited.

## Usage billing

Every billable operation writes one or more usage records. Each usage record has:

- Description.
- Unit price.
- Quantity.
- Optional model name.
- Usage category.
- Resources such as API key, gateway, or collection.

The final unit price is multiplied by the account tax multiplier and the current plan commission multiplier.

| Plan | Commission multiplier |
| --- | --- |
| Free | 1.25x |
| Pro | 1.05x |
| Max | 1.00x |

## Inference billing

Integrated model billing uses the model's pricing table from the backend. Pricing can vary by model and by input-token threshold. Usage can include:

- Text input tokens.
- Cached input tokens, when the selected model has cached-input pricing.
- Audio input tokens, when applicable.
- Output tokens.

Some integrated models can be covered by subscription-model reserve windows. When a model has a subscription usage multiplier and the account still has reserve remaining in both the six-hour and weekly windows, the recorded model usage can be covered instead of charged to balance.

Current reserve windows are:

| Plan | Six-hour reserve | Weekly reserve |
| --- | --- | --- |
| Free | None | None |
| Pro | 250 units | 3,000 units |
| Max | 1,000 units | 15,000 units |

BYOK calls use your external provider key, but AIVAX still enforces BYOK request limits because the request passes through AIVAX infrastructure.

## RAG billing

The default embedding model is `@aivax/data-embedding`. Its backend price is:

```text
$0.015 per 1,000,000 input tokens
```

This applies to document indexing and query embedding usage that uses the default embedding model. Reranking, when enabled, can add separate reranking usage.

## Storage billing

Storage is checked before balance-gated operations. If storage usage exceeds the plan quota, the request can fail with `402 Payment Required`.

| Plan | Included storage | Overage |
| --- | --- | --- |
| Free | 30 MB | No paid overage |
| Pro | 2 GB | $0.50/GB/month, charged hourly |
| Max | 20 GB | $0.20/GB/month, charged hourly |

Storage overage is charged hourly. The job bills only excess usage above the included quota, and only when the billable excess is greater than 1 MB.

Storage can include RAG document content and vectors, long-term memory items, media description cache, web chat session content, and shell files.

## Balance requirements

Billable routes check balance before running. The generic balance middleware rejects balances below the route minimum; chat clients, integrations, and batch processing also stop when the balance is zero or negative. Some multimodal chat-completion inputs require a minimum balance before the model call starts:

| Input type | Minimum balance |
| --- | --- |
| Image or audio | $0.10 |
| File or video | $0.50 |

If the account balance is too low, the API returns `402 Payment Required`.

## Plans and limits

Plans affect both price and operation:

- Model access.
- Commission multiplier.
- Request and token rate limits.
- BYOK request limits.
- RAG quotas.
- Tool limits.
- Storage quota and overage price.
- Conversation retention.
- Subscription-model reserve windows.

See [Plans and limits](limits.md) for the technical quota matrix.
