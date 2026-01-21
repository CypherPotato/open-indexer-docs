# Pricing

The AIVAX payment model is **pre‑paid**: you add balance to your account and use our services by consuming that credit. We don’t send surprise invoices at the end of the month. This guarantees full predictability of your inference and agent spending.

When adding credits, AIVAX charges a small fee (varying by payment method) to cover taxes (invoices), bank fees, and operational costs.

Inference pricing (text generation) is passed through directly from providers (such as Google and OpenAI) **without markup**. You pay AIVAX exactly the same list price you would pay when using those providers directly.

We use different [services](/docs/en/builtin-tools) to help you create agentic assistants. Some tools have specific costs that are debited from your balance with no additional fees.

> **Note:** Inference is calculated in US dollars (USD). Currency fluctuations may occur when converting from your local currency to dollars at the time of recharge or usage.

## Credit Expiration

Since we cannot predict which model you will use, we need to align credit validity with the most restrictive policies of our suppliers. Currently, credits expire **12 months** after the addition date. See the details in our [terms of service](/docs/en/legal/terms-of-service).

## Bring‑your‑own‑key (BYOK)

You can connect your own API key (compatible with OpenAI) to use AIVAX’s infrastructure.

* **Inference Cost:** $0.00 (charged directly by the key owner).  
* **Limits:** Rate limits are increased to **1,500 requests per minute** (≈ 25 req/s), with no token limits.

**Important:** Even when using your own key, peripheral AIVAX services (such as storage of [RAG](/docs/en/entities/collections.md), web search, image generation, etc.) are still charged against your AIVAX balance. If your balance goes negative, the service will be halted, including BYOK calls.

## RAG (Collections and Vectors)

Indexing cost depends on the embedding model you choose.

**Default Model:**  
* `@google/gemini-embedding-001`: **$0.15** / 1 million tokens.

**Legacy/Compatibility Models:**  
* `@google/text-embedding-004`: $0.10 / 1 million tokens.  
* `@baai/bge-m3`: $0.012 / 1 million tokens.

*At the moment, we do not charge computational fees for processing the indexing, only for the resulting storage.*

**Token Calculation**  
Since not all providers return the exact token count in the response, we use the industry‑standard approximation for billing:  
`tokens = ceil(utf8_bytes_count / 4)`

## Storage

To maintain the integrity and availability of your data, we charge a storage fee per hour.

* **Price:** **$0.0015** per GB / hour.  
* **Free Tier:** The first **100 MB are free**.

**How billing works:**  
You pay only for the **excess** beyond the free tier.  
* *Example:* If you use 120 MB for one hour, you pay only for the 20 MB excess.  
* *Example:* If you use 80 MB, the cost is zero.

**What consumes storage:**  
1. Long‑term user memory (saved chats and inferences);  
2. Cache of image descriptions (multimodal processing);  
3. RAG document content and its vectors.

System logs are temporary and do not generate storage costs.

## Tools

The [native tools](/docs/en/builtin-tools) of AIVAX have specific prices and limits. See the documentation for each tool.