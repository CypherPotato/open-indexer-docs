# Server-side functions

The protocol functions of AIVAX, or _server-side functions_, are an implementation where the model's tool calls occur on the server side. Similar to MCP, but with native authentication support and optimized to work externally.

Protocol functions allow taking actions on the AIVAX server side, removing the need to implement the function on the client side and integrating with existing applications and services.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

These functions expect a **callback** via a URL, and when the model decides to call the function, the callback is accessed with the parameters provided by the assistant itself. The assistant does not know which URL it is calling, as it remains invisible to both the assistant and the user.

## When to use protocol functions

Use protocol functions when you want to expose a specific HTTP action to an AI Gateway without creating a full MCP server. They are good for point integrations, such as checking an order, opening a ticket, fetching a user, validating a coupon, registering a lead, or invoking an internal automation. AIVAX keeps the URL invisible to the model, sends the request from the server side, and adds the textual result to the conversation context.

If you have many tools, dynamic tools, or a system that already implements Model Context Protocol, prefer [MCP](/docs/en/tools/mcp). If you want to use capabilities already maintained by AIVAX, prefer [built-in tools](/docs/en/tools/builtin-tools). If you need to make decisions before or after inference events, prefer [workers](/docs/en/inference/workers). Protocol functions sit in the middle: they are simpler than MCP and more specific than workers, but still give the model a controlled tool to execute an external action.

A protocol function must have a tool name, a description, and an argument schema. The name helps the model recognize the action; the description explains when to call; the schema limits the argument format. The callback URL and authentication details are not visible to the model. This allows creating specialized tools without exposing internal endpoints, provided your service validates the `X-Request-Nonce`, validates received arguments, and applies its own authorization when the call depends on the user.

### Choosing the function name

The function name should be simple and deterministic to what the function does. Avoid names that are hard to guess or that do not reflect the function's role, as the assistant may get confused and not call the function when appropriate.

For example, let's think of a function to query a user in an external database. The following names are good examples to consider for the call:

- `search_user`
- `query_user`

Bad names include:

- `search` (not very broad)
- `query-user-in-database-data` (name too long)
- `pesquisa-usuario` (name not in English)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description.

The function description should conceptually explain two situations: what it does and when it should be called by the assistant. This description should include the scenarios the assistant should consider calling it and when it should not be called, providing a few call examples (one-shot) and/or making the function's rules explicit.

## Defining protocol functions

These functions are defined in the [AI Gateway](/docs/en/inference/ai-gateway), which allows the creation of intelligent agents that perform actions without human intervention. They follow a simple syntax, expecting the function name, a description of what it does, and the invocation parameters.

Protocol functions are defined in the AI gateway following the JSON:

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctions": [
            {
                "name": "list_clients",
                "description": "Use this tool to list and search for the user's clients.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": null
            },
            {
                "name": "view_client",
                "description": "Use this tool to obtain details and orders of a client via its ID.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "format": "uuid"
                        }
                    },
                    "required": ["user_id"]
                }
            }
        ]
    }
}
```

In the snippet above, you are providing two functions for your AI model: `list_clients` and `view_client`, which will decide which one will be executed during its reasoning. You can also provide a JSON content format for which the model will call your API supplying the provided content.

You can also define the list of supported functions via an endpoint. Every time the model receives a message, it will query the provided endpoint to obtain a list of functions it can execute.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Define the function listing endpoints in your AI gateway:

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctionSources": [
            "https://my-external-api.com/api/scp/listings"
        ]
    }
}
```

The function provisioning endpoint must respond following the format:

<div class="request-item post">
    <span>GET</span>
    <span>
        https://my-external-api.com/api/scp/listings
    </span>
</div>

```json
{
    "functions": [
        {
            "name": "list_clients",
            "description": "Use this tool to list and search for the user's clients.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": null
        },
        {
            "name": "view_client",
            "description": "Use this tool to obtain details and orders of a client via its ID.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "format": "uuid"
                    }
                },
                "required": ["user_id"]
            }
        }
    ]
}
```

These functions are cached for 10 minutes before a new request is made to the provided endpoint.

### Handling function calls

Functions are invoked at the provided endpoint in `callbackUrl` via an HTTP POST request, with the body:

```json
{
    "function": {
        "name": "view_client",
        "content": {
            "user_id": "3e5a2823-98fa-49a1-831a-0c4c5d33450e"
        }
    },
    "context": {
        "externalUserId": "...",
        "moment": "2025-05-18T03:36:27"
    }
}
```

The response to this action must always return an HTTP OK status (2xx or 3xx), even for errors the assistant may have made. A non-OK response will indicate to the assistant that the function could not be called and it will not continue with what it was planning to do.

#### Response format

Successful responses should be textual and will be attached as the function response in whatever way the endpoint returns. There is no JSON format or structure for this response, but it is advisable to give a simple, human‑readable answer so that the assistant can read the action result.

Errors can be common, such as not finding a client by ID or a field not being in the desired format. In these cases, respond with an OK status and include a human description of the error in the response body and how the assistant can work around it.

**It is guaranteed** that the request will strictly follow the JSON Schema of the content provided by the function definition. Functions that do not expect arguments should not specify a content format for that function.

The function response should be written for the model, not for the end user. It may contain data, warnings, and short instructions on how to use the result. For example, if an order search finds the status, respond with the status, expected date, and relevant restrictions. If not found, respond that the order was not located and indicate which data the assistant should ask the user for. Avoid returning huge objects, HTML, raw logs, or internal messages, because this content enters the context and can confuse the next response.

> [!IMPORTANT]
>
> The more functions you define, the more input tokens you will consume in the reasoning process. The function definition, as well as its format, consumes tokens from the reasoning process.

#### Authentication

Request authentication is done via the `X-Request-Nonce` header sent in the protocol function requests, including listing ones.

See the [authentication](/docs/en/authentication) manual to understand how to authenticate reverse requests from AIVAX.

#### User authentication

Function calls send a `$.context.externalUserId` field containing the user tag created in a [chat session](/docs/en/features/chat-clients). This tag can be used to authenticate the user who called this function.

#### Security considerations

For the AI model, only the name, description, and format of the function are visible. It cannot see the endpoint the function points to. Moreover, it does not have access to the user tag authenticated in a [chat client](/docs/en/features/chat-clients).

## Specialist functions

In addition to [built-in functions](/docs/en/tools/builtin-tools), you can define specialist functions that perform specific tasks in your AIVAX account.

You define specialist functions using the `aivax://` URL scheme, following the example below:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctions": [
            {
                "name": "search_disease",
                "description": "Use this tool to search for diseases, treatments, and symptoms.",
                "callbackUrl": "aivax://query-collection?collection-id=0196f5ef-9334-742b-a988-f913bb3be5ba&top=5&min=0.4",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Name of the disease, treatment, or symptoms."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            }
        ]
    }
}
```

The above function creates a tool for the AI to query a specific [document collection](/docs/en/rag/collections), guiding the assistant on what to search in that collection and what to expect from a response. This way, you can link multiple RAG collections for an assistant to retrieve specialist content.

You can customize the description of the JSON Schema properties for specialist functions but not its structure, as our backend expects a specific format to call the functions. Specialist function parameters are supplied in the URL via query parameters.

Currently, only one specialist function exists:
- `query-collection`: performs an RAG search on a specified collection.

Query parameters:
- `collection-id`: the UUID of the collection to be searched.
- `top`: a number indicating how many documents should be returned in the search.
- `min`: a decimal indicating the minimum similarity score of the search.

Function JSON format:
```json
{
    "type": "object",
    "properties": {
        "query": {
            "type": "string",
            "description": "Search content."
        }
    },
    "required": [
        "query"
    ]
}
```