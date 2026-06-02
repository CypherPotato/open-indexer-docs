# AI Gateway

The AI gateways are a service that AIVAX provides to create an inference tunnel between an LLM model and a knowledge base. With it you can:

- Create a model with custom instructions
- Use a model provided by you via a compatible OpenAI endpoint, or use a model provided by AIVAX
- Customize inference parameters such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a ready‑to‑use model, parameterized and grounded in the instructions you define.

## How to think about a gateway

Think of the AI Gateway as the permanent configuration of an agent. A direct call to `/v1/chat/completions` resolves an isolated inference, but a gateway stores the decisions you do not want to repeat for each request: which model to use, which base instructions define the assistant's personality and rules, which RAG collections enter the context, which tools are available, which skills can be activated, how the context will be truncated, how tools will be interpreted, and which external workers can intervene in the flow. This separation is useful because the client application then only needs to send the conversation and, optionally, some controlled overrides, while the agent's operational configuration remains centralized in the console or the AIVAX API.

A gateway also functions as a responsibility boundary. The system that calls AIVAX does not need to know all the internal details of RAG, MCP, protocol functions, built‑in tools, or moderation; it only needs to call a model by the gateway name. Conversely, the gateway administrator can swap the model, adjust instructions, enable tools, and change strategies without republishing the client application. In production environments, this prevents business rules, integration keys, and prompt decisions from being scattered across multiple services.

The main configuration decisions are grouped into several blocks. The **model** block defines whether the gateway uses an integrated AIVAX model or a BYOK model compatible with OpenAI, as well as parameters such as `temperature`, `top_p`, `reasoning_effort`, and the assistant's prefill. The **context** block defines system instructions, templates, skills, remote instructions, and truncation. The **knowledge** block defines RAG collections and the search strategy. The **tools** block includes directly provided OpenAI tools, built‑in AIVAX tools, external MCP, and protocol functions. The **control** block includes moderation, workers, and tool handlers for models that need help calling functions.

In production, start with a conservative configuration: a clear system instruction, a model that supports the required modalities and tools, a single well‑prepared RAG collection, and a few truly useful tools. After observing real conversations, increase sophistication. Adding many tools, many skills, or many unfiltered documents increases input tokens, cost, and the chance of the model choosing the wrong path. A good gateway tends to resemble a well‑defined operation rather than a catalog of all possible capabilities.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your own AI model, we will only charge for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are smarter than others for certain tasks. Some models perform better with certain data acquisition strategies than others. Run tests to find the best model.

You can identify a gateway by its full ID or by the format `name:final-id`, such as `support:50c3`. This format is useful because it allows swapping the full ID for a short reference, but still avoids ambiguity when there are gateways with similar names. Integrated AIVAX models use their own tags, usually starting with `@`, and can be called directly when you do not need a permanent gateway configuration.

When choosing a model, validate three points before putting it into production. First, confirm that it supports the inputs you intend to send, such as image, audio, video, or files. Second, confirm that it supports function calls if the gateway uses tools, RAG via `QueryFunction`, MCP, protocol functions, or skills. Third, check that the model accepts the parameters you want to use; some models do not accept temperature, assistant prefill, or reasoning effort, and in those cases the gateway must be configured compatibly.

## Using an AI gateway

AIVAX provides an endpoint compatible with the OpenAI interface via an AI‑gateway, which simplifies integration of the model created by AIVAX with existing applications and SDKs. Note that only some properties are supported.

In an AI gateway, you already configure the model parameters, such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overridden by the request.

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

For guidance on streaming rendering, reasoning, tools, and continuous responses, see [Chat handling](/docs/en/inference/chat-handling).

## Using with SDKs

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

Currently, AIVAX only supports the `chat/completions` format. In the future, we plan to add support for API Responses.

## Recommended configuration for production

A production configuration should be written so that the model understands its purpose, its sources of truth, and its limits. In the system instructions, describe the assistant's role, the audience it serves, what it can or cannot promise, when to use RAG, when to use tools, and how to respond when information is unavailable. Avoid putting operational rules that already exist elsewhere in the gateway, such as truncation limits or tool lists, into the prompt, as this duplicates maintenance and increases the risk of contradiction.

For RAG, prefer linking collections with short, self‑contained, well‑named documents. If the assistant needs to answer based on a specific base, state in the instructions that the collection is the preferred source and that the assistant should alert when insufficient information is found. Choose the search strategy based on the conversation type: `Plain` works well for direct questions; `Concatenate` helps when the question depends on the user's recent messages; `UserRewrite` and `FullRewrite` are better when the user asks fragmented or anaphoric questions, such as “and in this case?”; `QueryFunction` is useful when the model must decide whether to search or not before answering.

For tools, enable only those that have a clear role. Built‑in tools handle common tasks such as web search, opening URLs, code execution, image generation, documents, and pages. External MCP is better when you already have an MCP server with business tools. Protocol functions are useful when you want to expose specific HTTP callbacks to the model without installing a full MCP server. When the model does not call tools reliably, configure a tool handler; when it calls tools excessively, make the descriptions more restrictive and remove redundant tools.

For observability and control, use workers when you need an external decision at runtime. A worker can block a message, enrich context, replace a tool call, or log an action in a proprietary system. Since the worker is invoked during the inference flow, it must respond quickly and deterministically. Use workers for rules that need to query external systems or updated policies; use system instructions for stable rules that the model only needs to follow.

## Using with MCP

It is possible to expose your AI Gateways via MCP functions (Model Context Protocol). This allows AI models to invoke other models (sub‑agents) natively through the MCP protocol.

To configure an AI Gateway as an MCP server, use the endpoint `https://inference.aivax.net/v1/mcp/inference` and set the following HTTP headers:

| Header | Description | Required |
|--------|-------------|----------|
| `Authorization` | Bearer token of your API key | Yes |
| `X-Mcp-Model-Name` | Model tag or gateway ID. Can be the full gateway ID or the slug format `name:partial-id` | Yes |
| `X-Mcp-Tool-Name` | MCP tool name. Will be converted to identifier format | No (default: `ai_model`) |
| `X-Mcp-Tool-Description` | Description of the tool for the model to understand when to use it | No |
| `X-Mcp-Tool-Title` | Friendly title of the tool | No |
| `X-Mcp-User` | External user ID for tracking | No |

### Gateway identification

There are three ways to identify the gateway via the `X-Mcp-Model-Name` header:

1. **Full gateway ID**: `550e8400-e29b-41d4-a716-446655440000`
2. **Slug format**: `meugateway:50c3` (gateway name + final part of the ID)
3. **Integrated model tag**: Direct name of a model available in AIVAX

### Configuration example

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

### Generated tool

The MCP server will automatically create a tool named `invoke_{tool_name}` that accepts the parameter:

- **prompt** (string): The prompt to be sent to the model

The tool will perform an inference on the configured AI Gateway and return the model's response.

This MCP shares the [inference rate limits](/docs/en/limits) to prevent abuse and ensure service stability. If the rate limits are exceeded, the tool will return an error indicating that the limit has been reached.