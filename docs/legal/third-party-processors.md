# Data Processors

AIVAX uses third-party services for specific operations such as infrastructure, object storage, email delivery, payment processing, web search, AI inference, reranking, and image generation. The providers involved in a request depend on the selected model, gateway, tool, and integration.

This page is a technical inventory, not legal advice. Provider policies may change, and Account Managers should review the provider terms that apply to their selected models and tools before sending personal, confidential, regulated, or sensitive data.

## Operations, Services, and Infrastructure

| Provider | Used for | Evidence in the platform code |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Reverse proxy/security where deployed; Workers AI reranking; Cloudflare embedding service configuration | Cloudflare API key/account parameters; `CloudflareWorkersAiReranker`; `CloudflareEmbeddingService` |
| [Backblaze](https://www.backblaze.com/) | Object/file storage for generated media, uploaded media, generated documents, exposed files, and error artifacts | `BackblazeService`; B2 bucket/account parameters |
| [Brevo](https://www.brevo.com/) | Transactional email and notifications | `EmailService`; Brevo API key parameter |
| [InfinitePay](https://infinitepay.io/) | Payment invoice creation and payment confirmation webhook | `InfinitePayProvider`; InfinitePay webhook |
| [Stripe](https://stripe.com/) | Payment event webhook support where Stripe checkout is configured | Stripe API key parameter; Stripe webhook |
| [Twitter/X](https://developer.x.com/) | Built-in X/Twitter search and post reading tools | `TwitterService`; `TwitterFunctions`; X/Twitter API key parameter |
| [Linkup](https://www.linkup.so/) | Web search for context enrichment | `LinkupResearchClient` |
| [Tavily](https://www.tavily.com/) | Web search for context enrichment | `TavilyResearchClient` |
| [Sinkin AI](https://sinkin.ai/) | Image generation provider for selected image models | `SinkinImageGenerationProvider` |
| [Pollinations](https://pollinations.ai/) | Image generation provider for selected image models | `PollinationsImageGenerationProvider` |

## Direct Inference, Embedding, and Reranking Providers

These providers are directly configured in provider factories, embedding services, rerankers, or runtime parameters.

| Provider | Used for | Evidence in the platform code |
| --- | --- | --- |
| [Groq](https://groq.com/) | LLM inference through an OpenAI-compatible endpoint | `CreateGroqAi`; Groq API key parameter |
| [DeepInfra](https://deepinfra.com/) | LLM inference through an OpenAI-compatible endpoint | `CreateDeepInfra`; DeepInfra API key parameter |
| [Vultr](https://www.vultr.com/) | LLM inference through Vultr Inference | `CreateVultr`; Vultr inference API key parameter |
| [CrofAI](https://ai.nahcrof.com/) | LLM inference through an OpenAI-compatible endpoint | `CreateCrof`; Crof API key parameter |
| [OpenRouter](https://openrouter.ai/) | Model routing and fallback for many model families; Grok Voice TTS | `CreateOpenRouter`; OpenRouter API key parameter; `TtsService` |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Xiaomi model inference | `CreateXiaomi`; Xiaomi API key parameter |
| [NagaAI](https://naga.ac/) | LLM inference, embeddings, TTS, and selected research flows | `CreateNagaAi`; `NagaEmbeddingService`; `TtsService` |
| [Inception Labs](https://www.inceptionlabs.ai/) | Mercury model inference | `CreateInception`; Inception API key parameter |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Smart reranking and Cloudflare embedding service | `CloudflareWorkersAiReranker`; `CloudflareEmbeddingService` |

## Model Families and Underlying Providers

The model catalog also identifies model families or underlying providers that may be selected directly or reached through aggregators such as OpenRouter or NagaAI. Not every request is sent to every provider.

| Provider | Used for |
| --- | --- |
| [OpenAI](https://openai.com/) | OpenAI model families exposed in the catalog or compatible integrations |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Gemini and other Google model families |
| [Anthropic](https://www.anthropic.com/) | Claude model families |
| [AWS](https://aws.amazon.com/) | AWS-hosted model families such as Amazon Nova or Bedrock-backed providers |
| [Cohere](https://cohere.com/) | Cohere model families |
| [xAI](https://x.ai/) | Grok model families and Grok Voice through configured routes |
| [Mistral AI](https://mistral.ai/) | Mistral model families |
| [DeepSeek](https://www.deepseek.com/) | DeepSeek model families |
| [Z.ai](https://z.ai/) | GLM/Z.ai model families |
| [Alibaba Cloud](https://www.alibabacloud.com/) | Qwen/Alibaba model families |
| [Cerebras](https://www.cerebras.ai/) | Cerebras model families |
| [Nebius](https://nebius.com/) | Nebius-backed model families |
| [Fireworks AI](https://fireworks.ai/) | Fireworks-backed model families |
| [Novita](https://novita.ai/) | Novita-backed model families |
| [Azure](https://azure.microsoft.com/) | Azure-backed model families |
| [LongCat](https://longcat.chat/) | LongCat/Meituan model family metadata |

## Data Handling Notes

AIVAX does not use Account Manager Input Content, Generated Content, or Conversations to train proprietary AIVAX models.

Third-party providers and aggregators may have their own processing, retention, abuse-monitoring, and model-improvement rules. The selected model, provider, tool, or integration determines which third party receives data for a specific request.

Avoid sending sensitive, confidential, regulated, or personal information to a provider unless you have reviewed that provider's current terms and have an appropriate legal basis for the processing.
