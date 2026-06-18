# Documentation MCP

The AIVAX documentation MCP exposes AIVAX documentation, API reference content, and model metadata to MCP-compatible clients. It is designed for assistants, IDEs, internal agents, and implementation workflows that need current AIVAX context before they answer, write code, configure a gateway, or troubleshoot an integration.

This MCP is read-oriented. It does not expose a generic account API invocation tool. Use it when an agent needs to understand AIVAX features, find the right API route, compare model capabilities, or ground its answer in the product manual. Use the [account management MCP](/docs/tools/account-management-mcp) only when the client also needs to inspect or change authenticated account resources through API calls.

> [!NOTE]
> Do not configure the documentation MCP together with the [account management MCP](/docs/tools/account-management-mcp) in the same client unless you have a specific reason to duplicate tools. The account management MCP already includes documentation search functions, so adding both servers usually creates redundant documentation tools and can make tool selection less predictable.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/documentation
```

Authenticate with an AIVAX account API key:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

For key types and authentication options, see [Authentication](/docs/authentication).

## Configuration example

The exact configuration depends on the MCP client. For clients that accept a Streamable HTTP server entry, configure the AIVAX documentation endpoint and pass the API key as a header.

```json
{
  "servers": {
    "aivax-docs": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/documentation",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

After the client connects, it can discover the tools exposed by the server. Tool names are prefixed with `aivax_` so they remain clear when the client also has project, database, browser, or code tools available.

## Available tools

### `aivax_search_documentation`

Searches AIVAX documentation and API reference content. Use this tool when the assistant needs product context before answering or acting.

The tool accepts:

| Argument | Type | Required | Description |
| --- | --- | --- | --- |
| `search_terms` | `string[]` | Yes | Search terms to query against AIVAX documentation and API reference. |
| `search_type` | `string` | No | Search scope. Use `documentation-manual`, `api-function-reference`, or `all`. |

The search can query the documentation manual, the API function reference, or both. It returns relevant documentation snippets in text form so the client can use them directly as context. Search is limited to 10 terms per call and 500 total characters across all terms.

Example arguments:

```json
{
  "search_terms": [
    "AI Gateway MCP headers",
    "tool metadata"
  ],
  "search_type": "all"
}
```

Use more complete phrases when the question has a clear intent, such as `semantic search reranker settings` or `public key chat completion restrictions`. Use multiple terms when you want to cover neighboring concepts, alternate names, or likely API-reference terms.

Search calls are rate-limited per account: 10 requests per minute and 400 requests per four hours.

### `aivax_list_models`

Lists integrated AIVAX chat models and returns a model-readable summary for each match. Use it when the assistant needs to choose a model, explain whether a model is available to the current plan, compare capabilities, or understand pricing and provider routes.

The tool accepts:

| Argument | Type | Required | Description |
| --- | --- | --- | --- |
| `name_filter` | `string` | No | Optional fuzzy filter for model names, such as `gpt 5`, `sonnet`, `qwen coder`, or `@openai/gpt-5-mini`. |

The response includes model description, stability, type, capabilities, flags, rate-limit group, routing model, subscription multiplier, technical metadata, token pricing, and providers. Availability is evaluated against the authenticated account plan.

Example arguments:

```json
{
  "name_filter": "gemini flash"
}
```

Model listing calls are rate-limited per account: 30 requests per minute and 1,000 requests per day.

## When to use it

Use the documentation MCP when you want an assistant to answer AIVAX questions from source-backed context instead of memory. This is useful in IDEs, support tools, onboarding agents, internal implementation copilots, and evaluation workflows where the assistant should search the manual before recommending a route, parameter, feature, model, or debugging step.

It is also helpful for agent-building workflows. Before creating or editing an [AI Gateway](/docs/inference/ai-gateway), an assistant can search for the relevant feature, check model capabilities, then explain what configuration should be used and why. For example, it can compare built-in tools, MCP functions, server-side functions, workers, RAG collections, structured responses, and multimodal pre-processing before suggesting a design.

For troubleshooting, the documentation MCP helps the assistant move from an error message to the likely product boundary. It can search for authentication rules, plan limits, multimodal balance requirements, RAG search parameters, gateway behavior, or public-key restrictions, then produce a focused checklist that reflects AIVAX behavior.

For model selection, combine `aivax_search_documentation` with `aivax_list_models`. Search the manual for the feature requirement, such as tool calling, video input, structured output, or long context, then list matching models and choose one that is available to the account plan.

## Choosing search terms

Good search terms should describe the user's goal, not only one keyword. Prefer:

```text
public key chat completion restrictions
semantic search include references
AI Gateway MCP source headers
multimodal preprocess video
```

Over:

```text
key
search
headers
video
```

When the assistant is unsure which page contains the answer, use `search_type: "all"`. When it needs route names, request bodies, or endpoint behavior, use `api-function-reference`. When it needs conceptual guidance, tradeoffs, or workflow explanations, use `documentation-manual`.

## Security guidance

The documentation MCP is safer than a management tool because it is read-oriented, but it still authenticates as an AIVAX account and may expose account-plan-sensitive model availability. Connect it only to clients that should know the account's available models and documentation context.

Use a dedicated API key for each MCP client. Store it in the client's secret mechanism or local configuration store, not in source control. If a client only needs public documentation and does not need account-specific model availability, prefer linking directly to the public documentation site instead of connecting an authenticated MCP server.
