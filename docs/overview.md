# Overview

AIVAX is an AI orchestration platform for serving AI assistants through a single account, API surface, and billing wallet. It combines OpenAI-compatible inference, AI gateways, RAG collections, tools, skills, chat clients, workers, and batch processing.

Most application integrations start with an **AI Gateway**. A gateway chooses the model, system instructions, RAG collections, tools, structured output behavior, moderation settings, workers, and chat-channel behavior used for a request.

## Core services

### OpenAI-compatible inference

AIVAX exposes OpenAI-compatible model listing and chat completion endpoints. You can call hosted AIVAX models directly or call an AI Gateway by its model identifier.

The main production base URL is:

```text
https://inference.aivax.net
```

Use `/v1` as the OpenAI SDK base path:

```text
https://inference.aivax.net/v1
```

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### AI Gateways

An AI Gateway is the configured runtime for an assistant. In the source model it stores:

- Provider or integrated model selection.
- System instruction and optional prompt templates.
- RAG collection links and query strategy.
- Built-in tools, protocol functions, MCP sources, and Bash options.
- JSON schema and JSON Healing settings.
- Worker script source and moderation settings.
- Context limits, truncation behavior, reasoning effort, verbosity, and routing settings.

Gateway slugs are convenient for private keys. Public-key chat completions must use the full gateway UUID and cannot call integrated models directly.

### RAG collections

Collections store documents that are indexed with embeddings and searched during inference or through collection endpoints. Plan limits control collection count, search rate, insertion rate, and JSONL import size.

AIVAX also exposes collections as MCP tools through `/v1/mcp/collections`. The collection MCP endpoint reads configuration from headers such as collection IDs, tool name, top-k, minimum score, reranker, and whether write tools are allowed.

### Tools

Gateways can enable tools that let the model call platform services or external systems. The codebase includes built-in functions for web search, advanced web search, X/Twitter search, image generation, document or page generation, code execution, memory, calendar, and scheduled activations.

Private keys can use the full gateway tool configuration. Public-key chat-completion calls strip server-side tool surfaces such as MCP sources, protocol functions, built-in tools, Bash, skills, and sentinel options.

### Skills

Skills are reusable instruction bundles attached to a gateway. They are loaded into the model context when selected by the assistant and can restrict or expose tool behavior.

### Structured output

AIVAX supports two structured-output paths:

- `response_schema`: AIVAX validates generated JSON against the schema and enables JSON Healing.
- `response_format` with `json_schema`: A provider-compatible schema path; AIVAX can also apply JSON Healing when account settings allow it.

Use `json_only` only when the caller expects the raw generated JSON instead of the normal chat-completion envelope.

### Chat clients and integrations

Chat clients connect a gateway to end users. The backend includes public web-chat session endpoints and integrations for Telegram, Z-API WhatsApp, Evolution API, and Kapso. Chat clients have their own per-session and per-hour limits in addition to account balance checks.

### Workers and hooks

Workers are account-owned hooks that can interrupt or modify gateway events. Requests from AIVAX to your service may include `X-Request-Nonce`, a BCrypt hash derived from the account hook key. Validate it before trusting the request.

### Batch processing

Batch workflows process independent items asynchronously with a workflow instruction, model, schema, and optional tools. The plan controls how many batch workflow items can be processed per day.

## How requests are checked

Authenticated API requests pass through account-key middleware. The middleware resolves the account and key, stores both in request context, and adds account headers to the response. Endpoints that spend money or require storage also check balance and storage quota before continuing.

For chat completions, the runtime then checks:

1. Whether the selected model is available to the account plan.
2. Integrated-model request and input-token rate limits, or BYOK request limits.
3. The Free-plan context cap.
4. Tool and modality requirements.
5. Balance and storage requirements, including additional minimum balance checks for image/audio/file/video inputs.

## Next steps

- [Getting started](getting-started.md)
- [Authentication](authentication.md)
- [Pricing](pricing.md)
- [Plans and limits](limits.md)
