# Server-side Functions

The protocol functions of AIVAX, or _server-side functions_, are an implementation where the model tool calls occur on the server side. Similar to MCP, but with native authentication support and optimized to work externally.

Protocol functions allow taking actions on the AIVAX server side, removing the need to implement the function on the client side and integrating with existing applications and services.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

These functions expect a **callback** via a URL, and when the model decides to call the function, the callback is accessed with the parameters provided by the assistant itself. The assistant does not know which URL it is calling, as it remains invisible to both the assistant and the user.

### Choosing the function name

The function name should be simple and deterministic to what the function does. Avoid hard‑to‑guess names or names that do not reflect the function’s role, as the assistant may get confused and not call the function when appropriate.

As an example, let's think of a function that queries a user in an external database. The following names are good examples to consider for the call:

- `search_user`
- `query_user`

Bad names include:

- `search` (too generic)
- `query-user-in-database-data` (name too long)
- `pesquisa-usuario` (name not in English)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description

The function description should conceptually explain two situations: what it does and when it should be called by the assistant. This description should include the scenarios the assistant should consider calling it and when it should not be called, providing a few one‑shot call examples and/or making the function rules explicit.

## Defining protocol functions

These functions are defined in the [AI-gateway](/entities/ai-gateway.md), which enables the creation of intelligent agents that perform actions without human intervention. They follow a simple syntax, expecting the function name, a description of what it does, and the invocation parameters.

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
                "description": "Use this tool to get details and orders of a client by its ID.",
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

In the snippet above, you are providing two functions for your AI model: `list_clients` and `view_client`, which the model will decide which to execute during its reasoning. You can also provide a JSON content format that the model will use when calling your API with the supplied content.

You can also define the list of supported functions through an endpoint. Every time the model receives a message, it will query the provided endpoint to obtain a list of functions it can execute.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Define the function‑listing endpoints in your AI gateway:

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

The function‑provision endpoint must respond following the format:

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
            "description": "Use this tool to get details and orders of a client by its ID.",
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

Functions are invoked at the `callbackUrl` endpoint via an HTTP POST request, with the body:

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

The response to this action must always return an HTTP OK status (2xx or 3xx), even for errors the assistant may have made. A non‑OK response will indicate to the assistant that the function could not be called, and it will not continue with what it was planning to do.

#### Response format

Successful responses should be textual and will be attached as the function’s answer in whatever form the endpoint returns. There is no JSON format or structure for this response, but it is advisable to give a simple, human‑readable answer so the assistant can read the result of the action.

Errors can be common, such as not finding a client by ID or a field not being in the desired format. In these cases, respond with an OK status and include a human‑readable description of the error and how the assistant can work around it in the response body.

**It is guaranteed** that the request will strictly follow the JSON Schema of the content defined by the function definition. Functions that do not expect arguments should not specify a content format for that function.

> [!IMPORTANT]
> 
> The more functions you define, the more input tokens you will consume in the reasoning process. The function definition, as well as its format, consumes tokens in the reasoning process.

#### Authentication

Request authentication is performed via the `X-Aivax-Nonce` header sent in all protocol function requests, including listing requests.

See the [authentication](/docs/en/authentication) manual to understand how to authenticate reverse requests from AIVAX.

#### User authentication

Function calls send a `$.context.externalUserId` field containing the user tag created in a [chat session](/docs/en/entities/chat-clients). This tag can be used to authenticate the user who invoked the function.

#### Security considerations

For the AI model, only the name, description, and format of the function are visible. It cannot see the endpoint to which the function points. Moreover, it does not have access to the user tag authenticated in a [chat client](/docs/en/entities/chat-clients).

## Specialist functions

In addition to the [built‑in tools](/docs/en/builtin-tools), you can define specialist functions that perform specific tasks in your AIVAX account.

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

The function above creates a tool for the AI to query a specific [document collection](/docs/en/entities/collections), guiding the assistant on what to search in that collection and what to expect in a response. This way, you can link multiple RAG collections for an assistant to retrieve specialist content.

You can customize the description of the JSON Schema properties for specialist functions but not its structure, as our backend expects a specific format to call the functions. Specialist function parameters are supplied in the URL via query parameters.

Currently, only one specialist function exists:
- `query-collection`: performs a RAG search in a specified collection.  
  Query parameters:
  - `collection-id`: the UUID of the collection to be searched.
  - `top`: a number indicating how many documents should be returned in the search.
  - `min`: a decimal indicating the minimum similarity score of the search.

  JSON format of the function:
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