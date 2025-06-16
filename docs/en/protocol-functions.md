# Server-side Functions

The AIVAX protocol functions, or _server-side functions_, are a customized implementation of function calls created by AIVAX that allows the model to strictly follow a function context that is not based on JSON documents. This feature is available for models with [Sentinel reasoning](/docs/en/sentinel). Similar to MCP, but a bit simpler.

The protocol functions allow for actions to be taken on the AIVAX server-side, removing the need for function implementation on the client-side and integrating with existing applications and services.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

These functions expect a **callback** through a URL, and when the model decides to call the function, the callback is accessed with the parameters informed by the assistant itself. The assistant does not know which URL it is calling, as it remains invisible to both the assistant and the user.

### Choosing the Function Name

The function name should be simple and deterministic to what the function does. Avoid names that are difficult to guess or do not refer to the function's role, as the assistant may become confused and not call the function when appropriate.

As an example, let's consider a function to query a user in an external database. The following names are good examples to consider for the call:

- `search-user`
- `query-user`
- `search_user`

Bad names include:

- `search` (too broad)
- `query-user-in-database-data` (name too large)
- `pesquisa-usuario` (name not in English)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the Function Description

The function description should explain conceptually two situations: what it does and when it should be called by the assistant. This description should include scenarios that the assistant should consider calling it and when it should not be called, providing a few examples of calls (one-shot) and/or making the function rules explicit.

## Defining Protocol Functions

These functions are defined in the [AI-gateway](/entities/ai-gateway.md), which allows the creation of intelligent agents that perform actions without human intervention. They follow a simple syntax, expecting the function name, a description of what it does, and the invocation parameters.

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
                "name": "list-clients",
                "description": "Use this tool to list and search for the user's clients.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": null
            },
            {
                "name": "view-client",
                "description": "Use this tool to get details and orders from a client through their ID.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "user_id": "guid"
                }
            }
        ]
    }
}
```

In the snippet above, you are providing two functions for your AI model: `list-clients` and `view-client`, which will decide which one to execute during its reasoning. You can also provide a content format JSON for which the model will call your API providing the informed content.

You can also define the list of supported functions through an endpoint. Every time the model receives a message, it will consult the provided endpoint to get a list of functions it can execute.

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

The endpoint for providing functions must respond following the format:

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
            "name": "list-clients",
            "description": "Use this tool to list and search for the user's clients.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": null
        },
        {
            "name": "view-client",
            "description": "Use this tool to get details and orders from a client through their ID.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "user_id": "guid"
            }
        }
    ]
}
```

These functions are stored in cache for 10 minutes before a new request is made to the provided endpoint.

### Handling Function Calls

The functions are invoked at the endpoint provided in `callbackUrl` through an HTTP POST request, with the body:

```json
{
    "function": {
        "name": "view-client",
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

The response to this action must always respond with an HTTP OK status (2xx or 3xx), even for errors that the assistant may have made. A non-OK response will indicate to the assistant that it was not possible to call the function and it will not continue with what it was planning to do.

#### Response Format

Successful responses must be textual and will be attached as a response to the function in the way it is responded by the endpoint. There is no JSON format or structure for this response, but it is advisable to provide a simple, human-readable response so that the assistant can read the result of the action.

Errors can be common, such as not finding a client by ID or some field not being in the desired format. In these cases, respond with an OK status and in the response body include a human description of the error and how the assistant can work around it.

**It is guaranteed** that the request will strictly follow the content format provided by the function definition. Functions that do not expect arguments should not specify a content format for that function. You can also indicate to the model how it should fill in the content fields of the function in the function instructions. More complex content, nested or with high structure depth, may increase the time it takes to generate this content, as it increases the chance of the assistant making errors and failing to validate the generated content.

> [!IMPORTANT]
>
> The more functions you define, the more tokens you will consume in the reasoning process. The function definition, as well as its format, consumes tokens from the reasoning process.

#### Authentication

The authentication of requests is done through the `X-Aivax-Nonce` header sent in all protocol function requests, including listing requests.

See the [authentication](/docs/en/authentication) manual to understand how to authenticate reverse AIVAX requests.

#### User Authentication

Function calls send a `$.context.externalUserId` field containing the user tag created in a [chat session](/docs/en/entities/chat-clients). This tag can be used to authenticate the user who called this function.

#### Security Considerations

For the AI model, only the function name, description, and format are visible. It is not capable of seeing the endpoint to which the function points. Additionally, it does not have access to the user tag that is authenticated in a [chat client](/docs/en/entities/chat-clients).