# Support for Model Context Protocol (MCP)

You can bind external MCP protocol tools to your [AI Gateway](/docs/en/inference/ai-gateway). The protocol defines functions that run on the server side and enable the assistant to interact with real‑time services.

MCP functions persist the server‑side action call of AIVAX, removing the need to implement the client‑side function.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## When to use MCP

Use MCP when you already have external tools that need to be discovered and called by models in a standardized way. An MCP server is suitable for tool catalogs, integrations with internal systems, stateful operations, tools shared among multiple agents, and environments where you want to keep logic outside of AIVAX. AIVAX acts as an MCP client: it connects the AI Gateway to the remote server, reads the available tools, and allows the model to call those tools during inference.

Do not use MCP just to replace a single simple HTTP call. When you need to expose an isolated function with a specific callback and nonce authentication, [protocol functions](/docs/en/tools/protocol-functions) are usually simpler. When the capability already exists in AIVAX, such as web search, URL opening, code execution, or image generation, [built‑in tools](/docs/en/tools/builtin-tools) are usually the most direct path. MCP is better when there is a set of tools with their own schema, when another system already speaks MCP, or when you want the same server to be used by different clients.

In production, treat the MCP server as an API exposed to an agent. Tool descriptions should be clear, schemas should be restrictive, and authentication should be configured in the server headers. The model should not receive overly generic tools such as `execute`, `request`, or `search` without strong descriptions and controlled parameters. Ambiguous tools increase wrong calls; specific tools like `lookup_customer_by_email` or `create_support_ticket` help the model decide better.

### Choosing the function name

The function name should be simple and deterministic about what the function does. Avoid names that are hard to guess or that do not hint at the function’s role, as the assistant may get confused and not call the function when appropriate.

As an example, let’s think of a function that queries a user in an external database. The following names are good examples to consider for the call:

- `search_user`
- `query_user`

Bad names include:

- `search` (implicit, possibly ambiguous)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description

The function description should conceptually explain two situations: what it does and when the assistant should call it. This description should include the scenarios the assistant should consider calling it and when it should not be called, providing a few one‑shot call examples and/or making the function rules explicit.

### Defining MCP servers

You can define your MCP servers in the gateway through a JSON array:

```json
[
    {
        "name": "Meu servidor MCP",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "sk-pv-12nbo..."
        }
    }
]
```

Your MCP server must be enabled for **SSE** or **Streamable HTTP** to work with AIVAX. You can define custom headers in your MCP server configuration to set up authentication or other needs.

Calls from AIVAX to the remote MCP server will normally send additional metadata information via the `_meta` field of MCP:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "New York"
        },
        "_meta": {
            "_aiv_nonce": "$2a$12$ynC9kC2q6iuEjO8SFDQqVeDxvHPUIZ9jTClE91SJo8VYtt/BSJDUG",
            "_aiv_external_user_id": "custom-user-id",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "iiocc6stxgj5jc75ay4y",
            "_aiv_moment": "2025-09-09T16:58:05",
            "custom_metadata_field_1": "foo",
            "something": "bar"
        }
    }
}
```

From the values defined in `_meta`, you have the inference, client, or function metadata parameters. Values prefixed with `_aiv` are reserved for AIVAX parameters.

Use `_aiv_external_user_id` to apply user‑based authorization when the call comes from a chat client or identified session. Use `_aiv_call_source` to differentiate calls coming from API, web chat, or integrations. Use `_aiv_conversation_token` when the MCP server needs to maintain correlation with a specific conversation. Use `_aiv_moment` for decisions dependent on local date. When `_aiv_nonce` is present, validate it the same way as `X-Request-Nonce` in reverse hooks, comparing the hash with the hook key configured on the account.

When an MCP tool does not appear for the model, verify that the remote server is reachable, that it uses SSE or Streamable HTTP, that the authentication headers are correct, and that the gateway is actually configured with the MCP source. When the tool appears but is not called, review the name, description, and schema. When it is called with bad arguments, restrict the JSON Schema and include property descriptions. When the call fails, make the MCP server return readable errors, because the model needs to understand whether to try another argument, ask the user for information, or terminate the action.