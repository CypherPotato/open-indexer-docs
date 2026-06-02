# Pricing

The payment model of AIVAX is **prepaid**: you add credit to your account and use our services consuming that credit. AIVAX uses a monthly subscription model together with the usage balance of the services. To compare differences between Free, Pro and Max, see the [AIVAX pricing page](https://aivax.net/pricing), which is the up‑to‑date source for plans. Service consumption is always deducted from the account balance.

When adding credits, AIVAX charges a small fee (variable by payment method) to cover taxes (invoices), banking fees and operational costs.

Some plans include a **commission fee** for using credit, which is a percentage applied on the amount spent on inference (text generation). See the [AIVAX pricing page](https://aivax.net/pricing) for the current commission of each plan.

Inference pricing (text generation) is passed through directly from providers (such as Google and OpenAI). You pay on AIVAX exactly the same list price you would pay using those providers directly.

We use different [services](/docs/en/tools/builtin-tools) to help you create agent assistants. Some tools have specific costs that are deducted from your credit without additional fees.

> **Note:** All costs are calculated in US dollars (USD). Currency fluctuations may occur when converting from your local currency to dollars at the time of recharge or usage.

## Credit Expiration

Since we cannot predict which model you will use, we need to align credit validity with the most restrictive policies of our providers.

Currently, credits expire **12 months** after the addition date. See the details in our [terms of use](/docs/en/legal/terms-of-service).

## RAG (Collections and Vectors)

The indexing and embedding cost of RAG documents on AIVAX is **$0.025** per million tokens processed.

## Storage

To maintain the integrity and availability of your data, we charge a storage fee per hour. The price varies according to the subscription plan:

- **Free plan**: 30 MB quota, no additional storage option.
- **Pro plan**: 2 GB quota, $0.50 per additional GB per month, charged hourly.
- **Max plan**: 20 GB quota, $0.20 per additional GB per month, charged hourly.

**How billing works:**
You only pay for the **excess** beyond the quota.
* *Example:* If you are on the Pro plan and use 2.20 GB for one hour, you will only be charged for the 0.20 GB excess. If you use 250 MB, the cost is zero.

**What consumes storage:**
1.  Long‑term user memory (chats and saved inferences);
2.  Image description cache (multi‑modal processing);
3.  RAG document content and its vectors;
4.  Virtual bash/shell storage.

System logs are temporary and do not incur storage costs.

## Tools

The [native tools](/docs/en/tools/builtin-tools) of AIVAX have specific prices and limits. See the documentation for each tool.