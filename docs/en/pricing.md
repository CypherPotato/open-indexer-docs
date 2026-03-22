# Pricing

AIVAX's payment model is **prepaid**: you add balance to your account and use our services by consuming that credit. AIVAX uses a [monthly subscription](/docs/en/limits) model together with the service usage balance. The subscription plans (Free, Pro, and Max) offer different levels of access to features, usage limits, and support, but service consumption is always deducted from the account balance.

When adding credits, AIVAX charges a small fee (varying by payment method) to cover taxes (invoices), bank fees, and operational costs.

Some plans include a **commission fee** for using balance, which is a percentage applied to the amount spent on inference (text generation). The commissions are currently:
- Free plan: 25% commission on the amount spent on inference.
- Pro plan: 5% commission on the amount spent on inference.
- Max plan: no commission.

Inference pricing (text generation) is passed through directly from the providers (such as Google and OpenAI). You pay at AIVAX exactly the same list price you would pay using those providers directly.

We use various [services](/docs/en/builtin-tools) to help you create agentic assistants. Some tools have specific costs that are deducted from your balance without additional fees.

> **Note:** All costs are calculated in United States dollars (USD). There may be currency fluctuations when converting from your local currency to dollars at the time of recharge or usage.

## Credit Expiration

Since we cannot predict which model you will use, we need to align the credit validity with the most restrictive policies of our providers.

Currently, credits expire **12 months** after the addition date. See the details in our [terms of service](/docs/en/legal/terms-of-service).

## RAG (Collections and Vectors)

The indexing cost depends on the chosen embedding model.

**Default Model:**
* `@google/gemini-embedding-001`: **$0.15** / 1 million tokens.

**Legacy/Compatibility Models:**
* `@google/text-embedding-004`: $0.10 / 1 million tokens.
* `@baai/bge-m3`: $0.012 / 1 million tokens.

## Storage

To maintain the integrity and availability of your data, we charge a storage fee per hour. The price varies according to the subscription plan:

- **Free plan**: 30 MB quota, no additional storage option.
- **Pro plan**: 2 GB quota, $0.50 per additional GB per month, billed hourly.
- **Max plan**: 20 GB quota, $0.20 per additional GB per month, billed hourly.

**How billing works:**
You only pay for the **excess** over the quota.
*Example:* If you are on the Pro plan and use 2.20 GB for one hour, you will only be charged for the 0.20 GB excess. If you use 250 MB, the cost is zero.

**What consumes storage:**
1. Long-term user memory (saved chats and inferences);
2. Image description cache (multi-modal processing);
3. RAG document content and its vectors;
4. Virtual bash/shell storage.

System logs are temporary and do not incur storage costs.

## Tools

The [native tools](/docs/en/builtin-tools) of AIVAX have specific pricing and limits. See the documentation for each tool.