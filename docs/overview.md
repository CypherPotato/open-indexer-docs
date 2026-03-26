# Visão geral

A AIVAX é uma plataforma de orquestração de IA que unifica inferência, recuperação de conhecimento e ferramentas agênticas em uma única API. Com ela, você cria assistentes inteligentes fundamentados na sua base de conhecimento, conectados a ferramentas externas e prontos para operar em múltiplos canais — tudo sem gerenciar infraestrutura de modelos.

## O que a AIVAX resolve?

Construir assistentes de IA que vão além de respostas genéricas exige integrar múltiplos serviços: hospedagem de modelos, busca semântica, chamada de ferramentas, moderação, memória conversacional e canais de atendimento. Cada peça adiciona complexidade, custo e pontos de falha.

A AIVAX consolida tudo isso em uma camada única. Você configura um **AI Gateway**, conecta sua base de conhecimento, ativa ferramentas e publica — sem provisionar servidores, treinar modelos ou manter pipelines de embedding separados.

## Serviços da plataforma

### AI Gateways

O AI Gateway é o núcleo da AIVAX. Ele funciona como um túnel de inferência configurável entre um modelo de linguagem e todos os recursos da plataforma.

Com um gateway você define:

- **Instruções de sistema** que direcionam o comportamento do agente
- **Modelo de linguagem** — use um dos modelos hospedados pela AIVAX ou traga o seu próprio (BYOK) via endpoint OpenAI-compatível
- **Parâmetros de inferência** como temperatura, top_p e prefill
- **Pipelines de processamento** que encadeiam RAG, moderação, truncamento de contexto e pós-processamento

O gateway expõe um endpoint compatível com a API do OpenAI (`chat/completions`), o que significa integração imediata com SDKs existentes em Python, Node.js, C# e qualquer linguagem que suporte a interface OpenAI.

**Casos de uso:** assistentes de suporte ao cliente, copilots internos, agentes de vendas, tutores educacionais e qualquer aplicação que precise de um modelo de IA parametrizado e fundamentado.

### RAG (Retrieval-Augmented Generation)

O serviço de RAG permite que seu agente responda com base em documentos reais em vez de depender apenas do conhecimento pré-treinado do modelo.

- **Coleções**: armazene até dezenas de milhares de documentos por coleção, indexados automaticamente com embeddings semânticos
- **Pesquisa semântica**: recupere os trechos mais relevantes para cada pergunta do usuário, com controle de relevância mínima e número de resultados
- **Múltiplas estratégias de embedding**: desde reescrita completa da query até concatenação com contexto conversacional, permitindo ajustar precisão vs. custo
- **Integração nativa**: o pipeline de RAG injeta os documentos recuperados diretamente no contexto do modelo, sem código adicional

**Casos de uso:** FAQs inteligentes, busca em manuais técnicos, bases de conhecimento corporativas, catálogos de produtos, documentação jurídica e regulatória.

### Ferramentas e Function Calling

A AIVAX oferece um ecossistema completo de ferramentas que transformam seu agente de um modelo conversacional em um sistema agêntico capaz de executar ações.

#### Ferramentas nativas

Ferramentas prontas para uso, sem configuração adicional:

| Ferramenta | O que faz |
|---|---|
| **Pesquisa web** | Busca informações atualizadas na internet |
| **Pesquisa avançada** | Navegação automatizada com browser para pesquisas profundas |
| **Execução de código** | Roda JavaScript em ambiente sandboxed para cálculos e processamento |
| **Contexto de URL** | Analisa até 5 URLs simultaneamente, extraindo conteúdo relevante |
| **Geração de imagens** | Cria imagens em diferentes níveis de qualidade |
| **Pesquisa no X/Twitter** | Busca posts em tempo real |
| **Geração de documentos** | Cria PDFs a partir de HTML |
| **Hospedagem de páginas** | Publica páginas HTML para relatórios e landing pages |
| **Memória** | Armazena contexto entre conversas para experiências personalizadas |

#### Integrações externas

- **MCP (Model Context Protocol)**: conecte servidores MCP externos para expandir as capacidades do agente com suas próprias ferramentas
- **Funções de protocolo**: defina funções personalizadas com callback via webhook, com autenticação por nonce criptografado
- **Shell**: ambiente bash virtual com ferramentas Unix padrão para agentes que precisam manipular dados

**Casos de uso:** agentes de pesquisa que consultam a web, assistentes que geram relatórios em PDF, bots que executam cálculos financeiros, sistemas que integram com APIs internas via webhooks.

### Skills (Habilidades)

Skills são conjuntos de instruções especializadas carregadas sob demanda. Diferente das instruções de sistema (que estão sempre ativas), as skills são ativadas apenas quando o modelo identifica que são relevantes para a conversa atual.

Isso permite criar agentes versáteis com conhecimento profundo em múltiplas áreas sem consumir tokens desnecessariamente.

**Casos de uso:** agente de suporte que alterna entre tom técnico e comercial conforme o perfil do cliente, assistente jurídico que carrega regras específicas por área do direito, tutor que adapta a didática por disciplina.

### Respostas estruturadas (JSON Healing)

O serviço de respostas estruturadas garante que a saída do modelo esteja em conformidade com um JSON Schema definido — mesmo em modelos que não suportam nativamente structured outputs.

Quando a resposta do modelo não está válida, a AIVAX executa ciclos automáticos de validação e correção, fornecendo feedback ao modelo até que o JSON esteja em conformidade. Funciona com qualquer LLM e preserva a fase de raciocínio em modelos de reasoning.

**Casos de uso:** extração de dados de textos livres, formulários conversacionais, pipelines de dados que consomem saída do modelo, integrações com sistemas que exigem formato estrito.

### Chat Clients

A AIVAX oferece clientes de chat prontos para conectar seu agente a usuários finais:

- **Chat web**: widget embarcável com personalização visual, gerenciamento de sessão e persistência de conversas
- **Telegram**: integração nativa com comandos especiais e identificação de usuários
- **WhatsApp**: integração via Z-Api com sessões por conversa

**Casos de uso:** atendimento ao cliente em site, suporte via WhatsApp, bots informativos no Telegram, interfaces de consulta embarcadas em aplicações web.

### Workers

Workers são hooks remotos acionados por eventos do pipeline de inferência. Eles permitem interceptar e controlar o fluxo de processamento em pontos específicos, como ao receber uma mensagem ou antes de enviar a resposta.

**Casos de uso:** validação de dados antes do processamento, enriquecimento de contexto com informações de sistemas externos, logging customizado, controle de fluxo condicional.

### Moderação

Camada de segurança que analisa as respostas do modelo com um modelo auxiliar antes de entregá-las ao usuário, garantindo conformidade com políticas de conteúdo.

**Casos de uso:** aplicações voltadas ao público, ambientes regulados, produtos infantis ou educacionais.

## Como os serviços se integram

Os serviços da AIVAX não são peças isoladas — eles formam um pipeline coeso onde cada componente potencializa os demais:

```
Usuário → Chat Client → AI Gateway
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
              RAG      Ferramentas   Skills
          (documentos)  (ações)    (instruções)
                └───────────┼───────────┘
                            ▼
                    Resposta processada
                  (moderação, JSON healing)
                            ▼
                         Usuário
```

1. A mensagem do usuário chega pelo **chat client** ou via **API** direta
2. O **AI Gateway** orquestra o processamento: carrega instruções, consulta a base de conhecimento via **RAG**, disponibiliza **ferramentas** e ativa **skills** conforme necessário
3. O modelo gera a resposta, que passa por validação (**JSON healing** se configurado) e **moderação**
4. A resposta é entregue ao usuário pelo mesmo canal de origem

Esse fluxo é totalmente configurável. Você pode usar só o gateway com RAG para um FAQ simples, ou combinar todos os serviços para um agente complexo com múltiplas ferramentas e sub-agentes via MCP.

## Começando em minutos

Criar um agente na AIVAX envolve três passos:

1. **Crie um AI Gateway** com as instruções e o modelo desejado
2. **Conecte uma coleção** de documentos (opcional, para RAG)
3. **Integre** via API OpenAI-compatível, chat widget ou canal de mensagens

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="sua_api_key"
)

response = client.chat.completions.create(
    model="meu-agente:50c3",
    messages=[
        {"role": "user", "content": "Quais são as políticas de devolução?"}
    ]
)

print(response.choices[0].message.content)
```

Sem SDKs proprietários, sem lock-in. A mesma integração que funciona com OpenAI funciona com AIVAX.

## Modelo de custos

A AIVAX opera com um modelo **pré-pago** combinado com planos de assinatura:

| | Free | Pro | Max |
|---|---|---|---|
| **Custo mensal** | $0 | $39 | $399 |
| **Comissão** | 25% | 5% | 0% |
| **Armazenamento** | 30 MB | 2 GB | 20 GB |
| **Pesquisas web/dia** | 15 | 1.000 | 10.000 |
| **Coleções** | 2 | Ilimitadas | Ilimitadas |

Os custos de inferência são repassados diretamente dos provedores sem markup — você paga o mesmo valor de tabela que pagaria usando Google ou OpenAI diretamente.

Para detalhes completos, consulte a [página de precificação](/docs/pricing).

## Próximos passos

- [Começando](/docs/getting-started) — configure sua conta e faça sua primeira chamada
- [Autenticação](/docs/authentication) — obtenha e use sua API key
- [AI Gateways](/docs/inference/ai-gateway) — configure seu primeiro agente
- [Coleções](/docs/rag/collections) — importe documentos para RAG
- [Ferramentas](/docs/tools/builtin-tools) — explore as ferramentas disponíveis
