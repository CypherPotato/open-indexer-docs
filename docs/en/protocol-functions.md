# Protocol Functions

The protocol functions of AIVAX, or _server-side functions_, are a customized implementation of function calls created by AIVAX that allows the model to strictly follow a function context that is not based on JSON documents. This feature is available for models with [Sentinel reasoning](/docs/en/sentinel).

The protocol functions allow actions to be taken on the AIVAX server side, removing the need to implement the function on the client side and integrating with existing applications and services.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

These functions expect a **callback** through a URL, and when the model decides to call the function, the callback is accessed with the parameters informed by the assistant itself. The assistant does not know which URL it is calling, as it remains invisible to both the assistant and the user.

## Defining Protocol Functions

These functions are defined in the [AI-gateway](/entities/ai-gateway.md), which allows the creation of intelligent agents that perform actions without human intervention. They follow a simple syntax, expecting the function name, a description of what it does, and the invocation parameters.

### Choosing the Function Name

The function name must be simple and deterministic to what the function does. Avoid names that are difficult to guess or do not refer to the function's role, as the assistant may become confused and not call the function when appropriate.

As an example, let's consider a function to query a user in an external database. The following names are good examples to consider for the call:

- `search-user`
- `query-user`
- `search_user`

Bad names include:

- `search` (too broad)
- `query-user-in-database-data` (name too long)
- `pesquisa-usuario` (name not in English)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the Function Description

The function description must conceptually explain two situations: what it does and when it should be called by the assistant. This description must include the scenarios that the assistant should consider calling it and when it should not be called, providing a few examples of calls (one-shot) and/or making the function rules explicit.

### Creating the Endpoint that the Function will Call

### Creating the Function Definition