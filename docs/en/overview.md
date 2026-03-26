# Overview

AIVAX is an AI orchestration platform that unifies inference, knowledge retrieval, and agentic tools into a single API. With it, you build intelligent assistants grounded in your knowledge base, connected to external tools, and ready to operate across multiple channels — all without managing model infrastructure.

## What does AIVAX solve?

Building AI assistants that go beyond generic answers requires integrating multiple services: model hosting, semantic search, tool calling, moderation, conversational memory, and communication channels. Each piece adds complexity, cost, and points of failure.

AIVAX consolidates all of this into a single layer. You configure an **AI Gateway**, connect your knowledge base, enable tools, and publish — without provisioning servers, training models, or maintaining separate embedding pipelines.

## Platform services

### AI Gateways

The AI Gateway is the core of AIVAX. It works as a configurable inference tunnel between a language model and all platform resources.

With a gateway you define:

- **System instructions** that steer the agent’s behavior  
- **Language model** — use one of the models hosted by AIVAX or bring your own (BYOK) via an OpenAI‑compatible endpoint  
- **Inference parameters** such as temperature, top_p, and prefill  
- **Processing pipelines** that chain RAG, moderation, context truncation, and post‑processing  

The gateway exposes an endpoint compatible with the OpenAI API (`chat/completions`), which means immediate integration with existing SDKs in Python, Node.js, C# and any language that supports the OpenAI interface.

**Use cases:** customer‑support assistants, internal copilots, sales agents, educational tutors, and any application that needs a parametrized, knowledge‑grounded AI model.

### RAG (Retrieval‑Augmented Generation)

The RAG service lets your agent answer based on real documents instead of relying solely on the model’s pre‑trained knowledge.

- **Collections**: store up to tens of thousands of documents per collection, automatically indexed with semantic embeddings  
- **Semantic search**: retrieve the most relevant passages for each user query, with minimum relevance control and result count limits  
- **Multiple embedding strategies**: from full query rewriting to concatenation with conversational context, allowing you to balance precision vs. cost  
- **Native integration**: the RAG pipeline injects the retrieved documents directly into the model’s context, with no additional code  

**Use cases:** intelligent FAQs, technical manual search, corporate knowledge bases, product catalogs, legal and regulatory documentation.

### Tools and Function Calling

AIVAX provides a complete ecosystem of tools that turn your agent from a conversational model into an agentic system capable of performing actions.

#### Native tools

Ready‑to‑use tools, no additional configuration required:

| Tool | What it does |
|---|---|
| **Web search** | Retrieves up‑to‑date information from the internet |
| **Advanced search** | Automated browser navigation for deep research |
| **Code execution** | Runs JavaScript in a sandboxed environment for calculations and processing |
| **URL context** | Analyzes up to 5 URLs simultaneously, extracting relevant content |
| **Image generation** | Creates images at various quality levels |
| **X/Twitter search** | Searches real‑time posts |
| **Document generation** | Creates PDFs from HTML |
| **Page hosting** | Publishes HTML pages for reports and landing pages |
| **Memory** | Stores context between conversations for personalized experiences |

#### External integrations

- **MCP (Model Context Protocol)**: connect external MCP servers to extend the agent’s capabilities with your own tools  
- **Protocol functions**: define custom functions with webhook callbacks, authenticated via encrypted nonce  
- **Shell**: virtual bash environment with standard Unix tools for agents that need to manipulate data  

**Use cases:** research agents that browse the web, assistants that generate PDF reports, bots that perform financial calculations, systems that integrate with internal APIs via webhooks.

### Skills

Skills are sets of specialized instructions loaded on demand. Unlike system instructions (which are always active), skills are activated only when the model identifies them as relevant to the current conversation.

This allows you to create versatile agents with deep knowledge in multiple domains without consuming unnecessary tokens.

**Use cases:** support agent that switches between technical and commercial tone based on the customer profile, legal assistant that loads area‑specific rules, tutor that adapts teaching style per subject.

### Structured responses (JSON Healing)

The structured‑response service ensures the model’s output conforms to a defined JSON Schema — even for models that do not natively support structured outputs.

When the model’s response is invalid, AIVAX runs automatic validation and correction cycles, providing feedback to the model until the JSON complies. It works with any LLM and preserves the reasoning phase in reasoning models.

**Use cases:** extracting data from free‑form text, conversational forms, data pipelines that consume model output, integrations with systems that require strict formatting.

### Chat Clients

AIVAX offers ready‑to‑use chat clients to connect your agent to end users:

- **Web chat**: embeddable widget with visual customization, session management, and conversation persistence  
- **Telegram**: native integration with special commands and user identification  
- **WhatsApp**: integration via Z‑Api with conversation‑based sessions  

**Use cases:** website customer service, WhatsApp support, informational bots on Telegram, query interfaces embedded in web applications.

### Workers

Workers are remote hooks triggered by inference‑pipeline events. They allow you to intercept and control processing flow at specific points, such as when a message is received or before a response is sent.

**Use cases:** data validation before processing, context enrichment with information from external systems, custom logging, conditional flow control.

### Moderation

Security layer that analyzes model responses with an auxiliary model before delivering them to the user, ensuring compliance with content policies.

**Use cases:** consumer‑facing applications, regulated environments, children’s or educational products.

## How the services integrate

AIVAX services are not isolated pieces — they form a cohesive pipeline where each component amplifies the others:

```
User → Chat Client → AI Gateway
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
              RAG      Tools   Skills
          (documents)  (actions) (instructions)
                └───────────┼───────────┘
                            ▼
                    Processed response
                  (moderation, JSON healing)
                            ▼
                         User
```

1. The user’s message arrives via the **chat client** or directly through the **API**  
2. The **AI Gateway** orchestrates processing: loads instructions, queries the knowledge base via **RAG**, makes **tools** available, and activates **skills** as needed  
3. The model generates a response, which passes through validation (**JSON healing** if configured) and **moderation**  
4. The response is delivered to the user through the same originating channel  

This flow is fully configurable. You can use only the gateway with RAG for a simple FAQ, or combine all services for a complex agent with multiple tools and sub‑agents via MCP.

## Getting started in minutes

Creating an agent in AIVAX involves three steps:

1. **Create an AI Gateway** with the desired instructions and model  
2. **Connect a collection** of documents (optional, for RAG)  
3. **Integrate** via the OpenAI‑compatible API, chat widget, or messaging channel  

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="your_api_key"
)

response = client.chat.completions.create(
    model="my-agent:50c3",
    messages=[
        {"role": "user", "content": "What are the return policies?"}
    ]
)

print(response.choices[0].message.content)
```

No proprietary SDKs, no lock‑in. The same integration that works with OpenAI works with AIVAX.

## Pricing model

AIVAX operates on a **pre‑paid** model combined with subscription plans:

| | Free | Pro | Max |
|---|---|---|---|
| **Monthly cost** | $0 | $39 | $399 |
| **Commission** | 25% | 5% | 0% |
| **Storage** | 30 MB | 2 GB | 20 GB |
| **Web searches/day** | 15 | 1,000 | 10,000 |
| **Collections** | 2 | Unlimited | Unlimited |

Inference costs are passed through directly from providers without markup — you pay the same list price you would when using Google or OpenAI directly.

For full details, see the [pricing page](/docs/en/pricing).

## Next steps

- [Getting started](/docs/en/getting-started) — set up your account and make your first call  
- [Authentication](/docs/en/authentication) — obtain and use your API key  
- [AI Gateways](/docs/en/inference/ai-gateway) — configure your first agent  
- [Collections](/docs/en/rag/collections) — import documents for RAG  
- [Tools](/docs/en/tools/builtin-tools) — explore the available tools