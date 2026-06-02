# Welcome

Welcome to AIVAX. Our service makes it easier to develop intelligent AI models that use a knowledge base provided by you to converse with the user, answer questions, provide real‑time information, and more.

To get started, all endpoints should be made on the AIVAX production URL:

```text
https://inference.aivax.net/
```

## Handling Errors

All API errors return an HTTP response with a non‑OK status (never 2xx or 3xx), and always follow the JSON format:

```json
{
    "error": "Uma mensagem explicando o erro",
    "details": {} // um objeto contendo informações relevantes sobre o erro. Na maioria das vezes é nulo
}
```

## Operational Diagnosis

When a call fails, start at the outermost level before investigating the prompt or model. Confirm that the base URL is correct, that the API key was sent with `Authorization: Bearer ...` or via the `?api-key` parameter, that the account has sufficient balance, and that the plan has a limit for the operation. Then, confirm that the called endpoint is the expected one: inference uses `/v1/chat/completions`, inference MCP uses `/v1/mcp/inference`, collection MCP uses `/v1/mcp/collections`, and administrative operations reside on the versioned AIVAX API. Only after that investigate model, tools, RAG, schema, or workers.

Authentication errors usually indicate a missing key, an invalid key, a malformed header, or usage of a key that does not belong to the expected account. Balance errors appear when the account cannot pay for the operation, when multimodality requires a minimum balance, or when a costly tool is invoked. Limit errors appear when the operation exceeds rate limits, daily limits, number of collections, RAG insertions, or the plan's batch processing. To compare commercial differences between plans, always use the [AIVAX pricing page](https://aivax.net/pricing); this documentation describes the technical functioning.

Inference errors can come from the model provider, the message format, context size, inaccessible attachments, invalid JSON Schema, or a misconfigured tool. If the same message works without tools, the problem is likely in the tools. If it works without RAG, review the collection, search strategy, and documents. If it works without multimodality, review format, URL, base64, minimum balance, and model support. If it works with `stream: false` but not in streaming, check the SSE client and whether it handles empty chunks, pings, `[DONE]`, `servertool`, and stream errors.

Workers should be investigated separately because they can interrupt events. When a conversation stops before the model responds, temporarily test without a worker or make the worker respond with an empty 2xx. If that resolves it, review validation of `X-Request-Nonce`, `gatewayId`, response time, returned HTTP status, and the `application/json+worker-action` format. For protocol functions, remember that non‑OK responses indicate failure to the assistant; when the error is expected, respond with 2xx and a human message explaining the problem.

## Implementation Recipes

To create a knowledge‑base support assistant, start by creating a RAG collection with short, self‑contained documents. Then create an AI Gateway with system instructions that explain the assistant's role, link the collection, choose a search strategy, and test direct questions via the API. When the quality is good, build a web chat client or WhatsApp/Telegram integration to expose the assistant to users. If you need external rules, such as blocking non‑subscribed users or enriching context with CRM data, add a worker to the gateway.

To expose a collection to another agent via MCP, use the `/v1/mcp/collections` endpoint with `Authorization`, `X-Mcp-Collection-Id`, `X-Mcp-Collection-Name`, `X-Mcp-Top-K`, `X-Mcp-Min-Score`, and `X-Mcp-Reranker`. Start in read‑only mode. Enable `X-Mcp-Allow-Write: yes` only when the MCP client is trusted and when the agent can create or delete documents. Use descriptive collection names, as they become part of the tool name and influence when the model decides to call the search.

To generate reliable JSON, use `response_schema` when you want validation and JSON Healing by AIVAX. Write a schema with `required`, clear types, and `additionalProperties: false` when the output will be consumed by another system. If the model has native structured outputs and you want to pass the schema directly to the provider, use `response_format` with `json_schema`. If the consumer needs only the final object, use `json_only`, but remember that this removes the chat completion envelope from the response.

To process many records, use Batch instead of opening many manual calls. Create a workflow with instruction, model, schema, and tools; import items in text or JSONL; start the job; monitor states, costs, and confidence; retry only errors or low‑confidence items; export results in JSONL. Use Batch for independent jobs such as classification, extraction, enrichment, and evaluation. Do not use Batch for real‑time conversations or when each item depends on the previous item's result.