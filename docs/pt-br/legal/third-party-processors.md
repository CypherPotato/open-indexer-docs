# Processadores de dados

A AIVAX utiliza serviços de terceiros para operações específicas, como coleta de pagamentos, envio de mensagens, inferência e armazenamento de dados. Note que, a AIVAX não possue nenhum vínculo comercial ou de parceria com os provedores listados abaixo, e a escolha por eles é baseada exclusivamente em critérios técnicos e de desempenho.

### Provedores de operações, serviços e infraestrutura:

| Provedor | Usado em | País de origem | Legislação de proteção de dados |
| --- | --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | CDN, proxy reverso, proteção contra DDoS, firewall e DNS | Estados Unidos | [GDPR](https://www.cloudflare.com/trust-hub/gdpr/), [CCPA](https://www.cloudflare.com/trust-hub/ccpa/), [DPF](https://www.cloudflare.com/trust-hub/eu-us-data-privacy-framework/) |
| [Hetzner](https://www.hetzner.com/) | Hospedagem de servidores e infraestrutura de computação em nuvem | Alemanha | [GDPR](https://www.hetzner.com/legal/privacy-policy/) |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos | Estados Unidos | [GDPR](https://www.backblaze.com/company/privacy.html), [CCPA](https://www.backblaze.com/company/ccpa.html) |
| [Brevo](https://www.brevo.com/) | Envio de e-mails transacionais e notificações | França | [GDPR](https://www.brevo.com/legal/privacypolicy/) |
| [Twitter/X](https://developer.x.com/) | Integração com a API para publicação e autenticação via redes sociais | Estados Unidos | [CCPA](https://x.com/en/privacy), [GDPR](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Pesquisa na web em tempo real para enriquecimento de contexto | França | [GDPR](https://www.linkup.so/privacy-policy), [CCPA](https://www.linkup.so/privacy-policy) |
| [InfinitePay](https://infinitepay.io/) | Coleta de pagamentos e processamento de transações | Brasil | [LGPD](https://infinitepay.io/politica-de-privacidade-e-cookies) |

---

### Provedores de inferência e inteligência artificial:

| Provedor | Usado em | País de origem | Legislação de proteção de dados |
| --- | --- | --- | --- |
| [Groq](https://groq.com/) | Inferência de LLMs de alta velocidade | Estados Unidos | [GDPR](https://groq.com/privacy-policy/), [CCPA](https://groq.com/privacy-policy/) |
| [DeepInfra](https://deepinfra.com/) | Inferência de modelos de IA open-source | Estados Unidos | [GDPR](https://deepinfra.com/privacy) |
| [Vultr](https://www.vultr.com/) | Inferência de modelos via cloud computing | Estados Unidos | [GDPR](https://www.vultr.com/legal/privacy/), [CCPA](https://www.vultr.com/legal/privacy/) |
| [OpenAI](https://openai.com/) | Inferência de modelos GPT e outros | Estados Unidos | [GDPR](https://openai.com/policies/privacy-policy/), [CCPA](https://openai.com/policies/privacy-policy/) |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Inferência de modelos Gemini e outros | Estados Unidos | [GDPR](https://cloud.google.com/terms/data-privacy), [CCPA](https://cloud.google.com/terms/data-privacy) |
| [Inception](https://www.inceptionlabs.ai/) | Inferência de modelos Mercury | Estados Unidos | [Política de privacidade](https://www.inceptionlabs.ai/privacy) |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Inferência de modelos proprietários Xiaomi | Países Baixos / Singapura | [GDPR](https://platform.xiaomimimo.com/#/docs/en/terms/privacy-policy) |
| [NagaAI](https://naga.ac/) | Agregador de APIs de modelos de IA | Polônia | [Política de privacidade](https://naga.ac/legal/privacy) |
| [CrofAI](https://ai.nahcrof.com/) | Inferência de modelos de IA | Estados Unidos | [CCPA](https://ai.nahcrof.com/privacy) |
| [Pollinations](https://pollinations.ai/) | Geração de imagens e vídeo | Estônia | [GDPR](https://pollinations.ai/privacy) |
| [OpenRouter](https://openrouter.ai/) | Roteamento e fallback entre provedores de IA | Estados Unidos | [GDPR](https://openrouter.ai/privacy), [CCPA](https://openrouter.ai/privacy) |
| [Anthropic](https://www.anthropic.com/) | Inferência de modelos Claude | Estados Unidos | [Política de privacidade](https://www.anthropic.com/privacy) |
| [AWS](https://aws.amazon.com/) | Inferência e infraestrutura de IA | Estados Unidos | [GDPR](https://aws.amazon.com/compliance/gdpr-center/), [CCPA](https://aws.amazon.com/compliance/ccpa/) |
| [Cohere](https://cohere.com/) | Inferência de modelos de IA | Canadá | [Política de privacidade](https://cohere.com/privacy) |
| [xAI](https://x.ai/) | Inferência de modelos Grok | Estados Unidos | [Política de privacidade](https://x.ai/privacy) |
| [Mistral AI](https://mistral.ai/) | Inferência de modelos de IA | França | [Política de privacidade](https://mistral.ai/terms/#privacy-policy) |
| [DeepSeek](https://www.deepseek.com/) | Inferência de modelos de IA | China | [Política de privacidade](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) |
| [Z.ai](https://z.ai/) | Inferência de modelos de IA | China | [Política de privacidade](https://z.ai/privacy) |
| [Alibaba Cloud](https://www.alibabacloud.com/) | Inferência de modelos de IA | China | [Política de privacidade](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-privacy-policy) |

### Coleta de dados de provedores

A AIVAX não utiliza prompts, respostas ou conversas para fins comerciais próprios, treinamento de modelos próprios ou revenda de dados. Conversas podem ser armazenadas pela AIVAX para segurança, auditoria técnica, depuração e operação do serviço, conforme a [política de privacidade](/docs/pt-br/legal/privacy-policy), e o usuário pode visualizar, gerenciar ou desativar esse armazenamento quando o recurso estiver disponível para sua conta.

Quando uma requisição é enviada a um provedor de inferência, esse provedor processa os dados necessários para executar o modelo escolhido e aplica suas próprias políticas de privacidade, retenção, segurança e uso de dados. A AIVAX seleciona e configura provedores buscando reduzir coleta e uso indevido de prompts, mas não controla de forma absoluta as políticas internas de terceiros. Por isso, antes de enviar dados pessoais, sensíveis, confidenciais ou regulados, valide a política do provedor do modelo escolhido e considere usar modelos, chaves ou configurações compatíveis com os requisitos do seu caso.
