# Getting Started

This guide shows the shortest path from an AIVAX account to a first OpenAI-compatible chat completion.

## Before you begin

You need:

- An AIVAX account.
- A private API key from the account dashboard or API key endpoint.
- Enough account balance for the operation. Some routes only require the balance not to be negative, while chat clients, integrations, batch processing, and multimodal inputs can require a strictly positive or minimum balance.
- Either a hosted model name or an AI Gateway ID.

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

## 1. Create an API key

Use a **private** API key for server-side calls. Private keys are generated with the `sk-aiv-acc` prefix and can call authenticated account APIs and OpenAI-compatible inference endpoints.

Public keys use the `pk-aiv-` prefix. They are intended for restricted client-side use on public routes, such as public RAG query/answer routes and restricted chat completions. They cannot call account-management endpoints.

For most first integrations, start with a private key from a backend service. It gives you the complete account surface: model listing, chat completions, AI Gateways, RAG collections, batch workflows, and administrative APIs. Public keys are useful later, when you intentionally expose a restricted capability to a browser or another client-side environment.

See [Authentication](authentication.md) for key types, accepted auth schemes, and hook validation. If the next thing you want to build is an end-user widget instead of a backend integration, also read [Chat Clients](features/chat-clients.md), because chat sessions solve identity, conversation history, attachments, and per-user limits more directly than a raw public key.

## 2. Find a model or gateway ID

You can call either:

- A hosted model name returned by the model listing endpoint.
- A gateway identifier from your account.

Gateway slugs are supported for private keys. Public-key chat completions must use the full gateway UUID and cannot call integrated models directly.

Use a hosted model name when you only need a direct model call. Use an AI Gateway when you want reusable behavior: instructions, RAG collections, built-in tools, workers, MCP servers, protocol functions, skills, moderation, or provider settings. A gateway becomes the stable "assistant configuration" your application can call repeatedly without rebuilding the same options in every request.

If you are still exploring, list models first and make one direct call. When the prompt, tools, or retrieval rules start becoming part of the product, move that configuration into an [AI Gateway](inference/ai-gateway.md).

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 3. Make a chat-completion request

Install the OpenAI SDK for your language, then point it to AIVAX:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="sk-aiv-acc..."
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ]
)

print(response.choices[0].message.content)
```

Replace `<MODEL_OR_GATEWAY_ID>` with an integrated model name or a gateway ID available to your account.

This request is intentionally small: one user message, one model or gateway, and one response. After it works, you can add the product pieces one at a time. For structured JSON output, see [Structured Responses](inference/structured-responses.md). To retrieve knowledge from documents before answering, create a [RAG collection](rag/collections.md) and attach it to a gateway. To let the model call external systems, compare [Built-in Tools](tools/builtin-tools.md), [MCP](tools/mcp.md), and [Protocol Functions](tools/protocol-functions.md).

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 4. Confirm billing and limits

After a successful request, usage is recorded against the authenticated account and the API key resource. Integrated model usage is charged from account balance unless it is covered by a subscription-model reserve window.

Checking balance after the first call is a good sanity step because it confirms that authentication, model access, usage tracking, and billing all resolved under the expected account. The balance endpoint also returns plan and limit information, which is useful before enabling higher-volume features such as RAG imports, chat clients, or batch processing.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Error formats

AIVAX uses two response shapes:

- OpenAI-compatible endpoints return an OpenAI-style `error` object with `message`, `type`, `param`, and `code`.
- Administrative endpoints return `{"error": "...", "details": null}` for errors and `{"message": "...", "data": ...}` for successful `JsonResponse` results.

Common failures:

| Status | Likely cause |
| --- | --- |
| `401 Unauthorized` | Missing, malformed, expired, or unknown API key. |
| `403 Forbidden` | A public key tried to call a non-public route, or the resource is not allowed. |
| `402 Payment Required` | Balance is insufficient or the account exceeded storage quota. |
| `429 Too Many Requests` | A rate limit was reached. |
| `400 Bad Request` | Invalid request body, unsupported parameter, missing model, invalid schema, or invalid tool configuration. |

For streaming chat completions, handle normal SSE chunks, optional `servertool` chunks, final usage metadata, `[DONE]`, and streaming error chunks.

## Troubleshooting checklist

When a request fails, verify in this order:

1. Base URL is `https://inference.aivax.net/v1` for OpenAI SDK calls.
2. The key is sent as `Authorization: Bearer <KEY>`, Basic auth, or the `api-key` query parameter.
3. The account has enough balance and storage quota.
4. The model or gateway ID exists and is allowed by the current plan.
5. The request is under the plan's request, token, RAG, tool, or batch limits.
6. Public-key calls use only allowed chat-completion parameters and full gateway UUIDs.
7. Tool, RAG, worker, or schema configuration is isolated by testing the same prompt without that feature.

## Next steps

- [Authentication](authentication.md): understand private keys, public keys, and reverse hook validation.
- [Plans and limits](limits.md): check request limits, context limits, RAG limits, tool limits, and batch limits before opening a workflow to users.
- [Pricing](pricing.md): understand how credits, usage, storage, and minimum-balance checks work.
- [AI Gateways](inference/ai-gateway.md): move from a direct model call to a reusable assistant configuration.
- [RAG collections](rag/collections.md): store documents and retrieve them during inference.
- [Batch](features/batch.md): run the same AI workflow over many independent records.
