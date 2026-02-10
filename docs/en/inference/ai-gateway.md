# AI Gateway

The AI gateways are a service that AIVAX provides to create an inference tunnel between an LLM model and a knowledge base. With it you can:

- Create a model with custom instructions
- Use a model provided by you via a compatible OpenAI endpoint, or use a model offered by AIVAX
- Customize inference parameters such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a ready‑to‑use model, parameterized and grounded in the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your own AI model, we will only charge for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are smarter than others for certain tasks. Some models perform better with certain data retrieval strategies than others. Conduct tests to find the best model.

You can see the available models on the [models page](/docs/en/models).

## Using an AI Gateway

AIVAX provides an endpoint compatible with the OpenAI interface through an AI‑gateway, which simplifies integration of the model created by AIVAX with existing applications and SDKs. Note that only some properties are supported.

In an AI gateway, you already configure model parameters such as System Prompt, temperature, and model name. When using this endpoint, some gateway values may be overridden by the request.

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Usage with SDKs

By providing endpoints compatible with the OpenAI interface, AIVAX is fully compatible with existing SDKs, facilitating plug‑and‑play integration.

See the example below:

```python
from openai import OpenAI
 
client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="oky_gr5u...oqbfd3d9y"
)
 
response = client.chat.completions.create(
    model="my-gateway:50c3", # you can also provide your ai-gateway full ID here
    messages=[
        {"role": "user", "content": "Explain why AI-gateways are useful."}
    ]
)
 
print(response.choices[0].message.content)
```

Currently, AIVAX only supports the `chat/completions` format. In the future, we plan to add support for the API Responses.

## Usage with MCP

You can expose your AI Gateways via MCP functions (Model Context Protocol). This allows AI models to invoke other models (sub‑agents) natively through the MCP protocol.

To configure an AI Gateway as an MCP server, use the endpoint `https://inference.aivax.net/v1/mcp/inference` and set the following HTTP headers:

| Header | Description | Required |
|-----------|-----------|-------------|
| `Authorization` | Bearer token of your API key | Yes |
| `X-Mcp-Model-Name` | Model tag or gateway ID. Can be the full gateway ID or the slug format `name:partial-id` | Yes |
| `X-Mcp-Tool-Name` | MCP tool name. Will be converted to identifier format | No (default: `ai_model`) |
| `X-Mcp-Tool-Description` | Description of the tool for the model to understand when to use it | No |
| `X-Mcp-Tool-Title` | Friendly title of the tool | No |
| `X-Mcp-User` | External user ID for tracking | No |

### Gateway Identification

There are three ways to identify the gateway via the `X-Mcp-Model-Name` header:

1. **Full gateway ID**: `550e8400-e29b-41d4-a716-446655440000`
2. **Slug format**: `meugateway:50c3` (gateway name + final part of the ID)
3. **Integrated model tag**: Direct name of a model available on AIVAX

### Configuration Example

Visual Studio Code:

```json
{
    "servers": {
        "my-ai-gateway-mcp": {
            "type": "http",
            "url": "https://inference.aivax.net/v1/mcp/inference",
            "headers": {
                "Authorization": "Bearer {your_api_key}",
                "X-Mcp-Model-Name": "meugateway:50c3",
                "X-Mcp-Tool-Name": "my_assistant",
                "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis",
                "X-Mcp-Tool-Title": "Data Analysis Assistant"
            }
        }
    }
}
```

AIVAX Gateway MCP:

```json
[
    {
        "name": "Search sub agent",
        "url": "https://inference.aivax.net/v1/mcp/inference",
        "headers": {
            "Authorization": "Bearer {your_api_key}",
            "X-Mcp-Model-Name": "meugateway:50c3",
            "X-Mcp-Tool-Name": "my_assistant",
            "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis",
            "X-Mcp-Tool-Title": "Data Analysis Assistant"
        }
    }
]
```

### Generated Tool

The MCP server will automatically create a tool named `invoke_{tool_name}` that accepts the parameter:

- **prompt** (string): The prompt to be sent to the model

The tool will perform an inference on the configured AI Gateway and return the model's response.

This MCP shares the [inference rate limits](/docs/en/limits) to prevent abuse and ensure service stability. If the rate limits are exceeded, the tool will return an error indicating that the limit has been reached.