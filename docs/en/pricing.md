# Pricing

The AIVAX payment model is **pre‑paid**, meaning you use our services with the balance you add to your account. We do not send invoices at the beginning of the month for your usage. This makes it predictable to know how much you will spend using our inference and agent‑creation services.

AIVAX charges a small fee (varying by payment method) at the time credits are added to cover taxes, payment‑provider fees, and our service fee. Model and inference pricing is provided directly by the inference providers and their models, such as Google and OpenAI. There is no additional fee or markup on these prices. You pay the same amount you would pay those providers directly.

We use different [services](/docs/en/builtin-tools) to help you create agentic assistants. Some tools and services have a cost, and these costs are passed on to your account with no extra fee.

Inference is billed in United States dollars (USD), so there may be currency fluctuation when converting from your local currency to USD.

## Expiration

Some providers have an expiration period for added credits. Since we do not know which model or service you will use with the added balance, we must consider the shortest expiration period to also define our expiration period for the added credits.

Currently, credits expire after **12 months** from the time they are added. Read more about refunds, expiration, and balance in the [terms of use](/docs/en/legal/terms-of-service).

## Bring‑your‑own‑key (BYOK)

You can bring your own OpenAI‑compatible API key to use directly with AIVAX. Because we do not know which model you will be using, we do not charge anything on the inference you run with your models. In addition, when using your own model with AIVAX, rate limits are increased to **1,500 requests per minute**, with no token‑weight limitation, which is equivalent to 60 requests per second.

Note that you are still charged for services you use with your own models, such as [RAG](/docs/en/entities/collections.md), web search, image generation, etc. If your account balance becomes negative, you will not be able to use any service, including inference for your own API keys, until you add balance again.

## RAG (collections)

Currently, the default model used for collection embedding is the [Gemini Embedding](https://ai.google.dev/gemini-api/docs/en/pricing#gemini-embedding), which is priced at **$0.15** per 1 million input tokens.

Other documents can be vectorized using other embedding models that are deprecated in the system but kept for compatibility:

- `@google/gemini-embedding-001`, $0.15 per million tokens. (default)  
- `@google/text-embedding-004`, $0.10 per million tokens. (deprecated)  
- `@baai/bge-m3`, $0.012 per million tokens. (deprecated)

At the moment, we do not charge any compute and/or storage fees for vectors.

For billing to occur, we need to calculate how many tokens were processed from the input, and not all embedding providers return the number of indexed tokens. Therefore, we use an approximation to calculate the number of processed tokens:

```csharp
tokens = ceil(utf8_bytes_count / 4)
```

The result of this approximation is what we charge you.

## Tools

Tools provided by AIVAX ([built‑in tools](/docs/en/builtin-tools)) have distinct pricing and limits from one another.

For functions you define for your API, there is no charge.