# Data Processors

AIVAX uses third‑party services for specific operations such as payment collection, message sending, inference, and data storage. Note that AIVAX has no commercial or partnership relationship with the providers listed below, and the choice of them is based exclusively on technical and performance criteria.

### Providers of operations, services and infrastructure:

| Provider | Used in | Country of origin | Data protection legislation |
| --- | --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | CDN, reverse proxy, DDoS protection, firewall and DNS | United States | [GDPR](https://www.cloudflare.com/trust-hub/gdpr/), [CCPA](https://www.cloudflare.com/trust-hub/ccpa/), [DPF](https://www.cloudflare.com/trust-hub/eu-us-data-privacy-framework/) |
| [Hetzner](https://www.hetzner.com/) | Server hosting and cloud computing infrastructure | Germany | [GDPR](https://www.hetzner.com/legal/privacy-policy/) |
| [Backblaze](https://www.backblaze.com/) | Object and file storage | United States | [GDPR](https://www.backblaze.com/company/privacy.html), [CCPA](https://www.backblaze.com/company/ccpa.html) |
| [Brevo](https://www.brevo.com/) | Transactional email and notification sending | France | [GDPR](https://www.brevo.com/legal/privacypolicy/) |
| [Twitter/X](https://developer.x.com/) | API integration for publishing and social‑login authentication | United States | [CCPA](https://x.com/en/privacy), [GDPR](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Real‑time web search for context enrichment | France | [GDPR](https://www.linkup.so/privacy-policy), [CCPA](https://www.linkup.so/privacy-policy) |
| [InfinitePay](https://infinitepay.io/) | Payment collection and transaction processing | Brazil | [LGPD](https://infinitepay.io/politica-de-privacidade-e-cookies) |

---

### Providers of inference and artificial intelligence:

| Provider | Used in | Country of origin | Data protection legislation |
| --- | --- | --- | --- |
| [Groq](https://groq.com/) | High‑speed LLM inference | United States | [GDPR](https://groq.com/privacy-policy/), [CCPA](https://groq.com/privacy-policy/) |
| [DeepInfra](https://deepinfra.com/) | Open‑source AI model inference | United States | [GDPR](https://deepinfra.com/privacy) |
| [Vultr](https://www.vultr.com/) | Model inference via cloud computing | United States | [GDPR](https://www.vultr.com/legal/privacy/), [CCPA](https://www.vultr.com/legal/privacy/) |
| [OpenAI](https://openai.com/) | GPT and other model inference | United States | [GDPR](https://openai.com/policies/privacy-policy/), [CCPA](https://openai.com/policies/privacy-policy/) |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Gemini and other model inference | United States | [GDPR](https://cloud.google.com/terms/data-privacy), [CCPA](https://cloud.google.com/terms/data-privacy) |
| [Inception](https://www.inceptionlabs.ai/) | Mercury model inference | United States | [Privacy policy](https://www.inceptionlabs.ai/privacy) |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Proprietary Xiaomi model inference | Netherlands / Singapore | [GDPR](https://platform.xiaomimimo.com/#/docs/en/terms/privacy-policy) |
| [NagaAI](https://naga.ac/) | AI model API aggregator | Poland | [Privacy policy](https://naga.ac/legal/privacy) |
| [CrofAI](https://ai.nahcrof.com/) | AI model inference | United States | [CCPA](https://ai.nahcrof.com/privacy) |
| [Pollinations](https://pollinations.ai/) | Image and video generation | Estonia | [GDPR](https://pollinations.ai/privacy) |
| [OpenRouter](https://openrouter.ai/) | Routing and fallback between AI providers | United States | [GDPR](https://openrouter.ai/privacy), [CCPA](https://openrouter.ai/privacy) |

### Data collection from providers

According to our [privacy policy](/docs/en/legal/privacy-policy), AIVAX does not collect any sensitive data, including prompts, for any commercial or training purpose. Conversations are stored solely for security and audit purposes, and the user can view, manage, or disable this storage at any time.

AIVAX requires that the inference providers used do not collect prompt data for model training. However, because this guarantee depends on each provider’s compliance, AIVAX cannot assure it absolutely. We recommend avoiding the sharing of sensitive or personal information in prompts as an additional precaution. No provider that collects prompt data for training is used by AIVAX.