# Support for Model Context Protocol (MCP)

You can bind external tools of the MCP protocol to your [AI Gateway](/docs/en/entities/ai-gateways/ai-gateway). The protocol defines functions that run on the server side and enable the assistant to interact with real‑time services.

MCP functions persist the server‑side action calls of AIVAX, removing the need to implement the function on the client side.

<img src="/assets/diagrams/mcp-1.drawio.svg">

### Choosing the function name

The function name should be simple and deterministic about what the function does. Avoid names that are hard to guess or that do not reflect the function’s role, as the assistant may become confused and fail to call the function when appropriate.

For example, let's consider a function that looks up a user in an external database. The following names are good examples to consider for the call:

- `search_user`
- `query_user`

Bad names include:

- `search` (implicit, possibly ambiguous)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description

The function description should conceptually explain two things: what it does and when it should be called by the assistant. This description should include the scenarios the assistant should consider calling it and when it should not be called, providing a few one‑shot call examples and/or making the function’s rules explicit.

### Defining MCP servers

You can define your MCP servers in the gateway using a JSON array:

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

Your MCP server must be enabled for **SSE** or **Streamable HTTP** to work with AIVAX. You can set custom headers in your MCP server configuration to configure authentication or other requirements.

AIVAX calls to the remote MCP server will normally send additional metadata information via the `_meta` field of the MCP:

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