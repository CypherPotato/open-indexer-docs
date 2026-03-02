# Structured Responses

AIVAX has a structured response mechanism that works with **any LLM**, even those that do not natively support structured outputs. AIVAX analyzes the provided JSON schema and manually validates whether the model responded as expected. When the model fails, AIVAX automatically notifies the errors until it generates a valid JSON. This mechanism is called **JSON Healing**.

This process continues until the maximum attempts parameter is reached or a valid JSON is generated. AIVAX interprets JSONs in markdown blocks, preceded or followed by text, and automatically extracts the final response.

You can use structured responses with models that have reasoning without breaking the reasoning phase to generate the JSON. In addition, you can use [built‑in tools](/docs/en/builtin-tools) during generation, such as web search, document generation, and opening links.

## How it works

When making an inference call, you define **what the model should do** through instructions and **how it should respond** through a JSON Schema.

AIVAX validates the model's response in real time. If the generated JSON is invalid or does not follow the schema, the model receives automatic feedback about the errors and tries again. This cycle continues until:
- A valid JSON is generated (success on the first try or after corrections)
- The `maxAttempts` limit is reached

**Billing:** You are charged for each generation attempt. Smarter models usually succeed on the first try, while smaller models may need multiple attempts.

**Performance tip:** Cache data that does not change frequently (weather, daily statistics, etc.) on your application side. AIVAX does not perform automatic caching.

## Built‑in tools

You can use [built‑in tools](/docs/en/builtin-tools) during JSON generation, allowing the model to:
- Search the web for up‑to‑date information
- Execute code for complex calculations
- Open and analyze URLs
- Generate images
- Fetch posts on social networks

These tools are especially useful for functions that need real‑time data or additional processing before generating the structured response.

## How to use

You use the structured response service on the same chat completions endpoint.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for news in São José do Rio Preto.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "news": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "News title"
                        },
                        "content": {
                            "type": "string",
                            "description": "News summary"
                        }
                    }
                }
            }
        }
    }
}
```

Note that the `builtin_tools` parameter defines which built‑in tools the model may use to generate the structured response. Also, the model used must be compatible with function calling.

You can also use structured responses with your AI gateways by providing the gateway ID in the model name.

## JSON response modes

There are two ways to request structured responses: with or without JSON Healing.

### With JSON Healing (`response_schema`)

Use `response_schema` to automatically enable JSON Healing with the provided schema. AIVAX validates the model's response and, if invalid, provides automatic feedback for correction:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "messages": [{ "role": "user", "content": "List 3 European capitals" }],
    "response_schema": {
        "type": "object",
        "properties": {
            "capitals": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string" },
                        "country": { "type": "string" }
                    },
                    "required": ["city", "country"]
                }
            }
        },
        "required": ["capitals"]
    }
}
```

**Advantages of JSON Healing:**

- **Format guarantee:** The model will always respond in the specified JSON format
- **Reasoning compatible:** The model can reason freely before generating the JSON
- **Tool compatible:** Works together with [built‑in tools](/docs/en/builtin-tools) and function calling

AIVAX automatically extracts the JSON from the response, even if it is in a markdown block or preceded by explanatory text.

### Without JSON Healing (`response_format`)

Use `response_format` when the native model already supports structured outputs (like GPT‑4o or Gemini) and you do not need additional validation:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "@openai/gpt-4o",
    "messages": [{ "role": "user", "content": "List 3 European capitals" }],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "capitals": { "type": "array" }
                }
            }
        }
    }
}
```

In this mode, the schema is passed directly to the model without additional validation by AIVAX.

### Enabling JSON Healing in `response_format`

You can explicitly enable JSON Healing by passing an `options` object inside `response_format` when `type` is `json_schema`:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "answer": { "type": "string" }
                }
            }
        },
        "options": {
            "max_attempts": 5
        }
    }
}
```

The `max_attempts` parameter defines the maximum number of correction attempts. You are charged for each failed attempt. Note that smarter models tend to succeed on the first try.

## Supported JSON Schema

AIVAX guides the model to generate a response according to the provided JSON Schema. When the model generates something invalid, it receives feedback about the errors and tries again until the output conforms to the specification.

### Supported types and validations

- **string**:
    - `minLength`, `maxLength`
    - `pattern` (regex)
    - `format`: `date-time`, `email`, `time`, `duration`, `uri`, `url`, `ipv4`, `ipv6`, `uuid`, `guid`
    - `enum`
- **number** and **integer**:
    - `minimum`, `maximum`
    - `exclusiveMinimum`, `exclusiveMaximum`
    - `multipleOf`
- **array**:
    - `items`
    - `uniqueItems`
    - `minItems`, `maxItems`
- **object**:
    - `properties`
    - `required`
- **bool**, **boolean**
- **null**

**Multiple types:** You can specify multiple types for a field:

```json
{
    "type": ["string", "number"]
}
```

> **Note:** `number` and `integer` are synonyms. The `integer` type does not guarantee that the value will be an integer.

## Response support

AIVAX's JSON healing is compatible with any model and any type of response via the [chat completions] endpoint (https://inference.aivax.net/apidocs#Inferencechatcompletions). When used with `stream = false`, the full JSON content will appear in the delta content generated by the model.

When used with `stream = true` (SSE), the JSON will come in a single complete chunk, even if the model generates the content in multiple chunks. This makes it possible to use structured responses with streaming, providing a way to **bypass gateway timeouts** for very long responses.

## `json_only` mode

When using the special `json_only` parameter in the request body:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [{ "role": "user", "content": "List 3 European capitals" }],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "capitals": { "type": "array" }
                }
            }
        }
    },
    "json_only": true
}
```

The response is exactly the JSON generated by the model, without generation metadata, deltas, etc. This function works with `stream = false` and `stream = true` responses. In the case of `stream = true`, the full JSON will come in a single SSE chunk, with no other markup or additional content. After generating the JSON, a `[DONE]` line is sent to indicate the end of the response.