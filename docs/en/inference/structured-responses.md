# Structured Responses

AIVAX has a structured response mechanism that works with **any LLM**, even those that do not natively support structured outputs. AIVAX analyzes the provided JSON schema and manually validates whether the model responded as expected. When the model fails, AIVAX automatically notifies the errors until it generates a valid JSON. This mechanism is called **JSON Healing**.

This process continues until the maximum attempts parameter is reached or a valid JSON is generated. AIVAX interprets JSONs in markdown blocks, preceded or followed by text, and automatically extracts the final answer.

You can use structured responses with models that have reasoning without breaking the reasoning phase to generate the JSON. Additionally, you can use [built‑in tools](/docs/en/tools/builtin-tools) during generation, such as web search, document generation, and opening links.

## How it works

When making an inference call, you define **what the model should do** via instructions and **how it should respond** via a JSON Schema.

AIVAX validates the model's response in real time. If the generated JSON is invalid or does not follow the schema, the model receives automatic feedback on the errors and tries again. This cycle continues until:
- A valid JSON is generated (success on the first try or after corrections)
- The `maxAttempts` limit is reached

**Pricing:** You are charged for each generation attempt. Smarter models usually get it right on the first try, while smaller models may need multiple attempts.

**Performance tip:** Use caching on your application side for data that does not change often (weather, daily statistics, etc). AIVAX does not perform automatic caching.

## Built‑in Tools

You can use [built‑in tools](/docs/en/tools/builtin-tools) during JSON generation, allowing the model to:
- Search the internet for up‑to‑date information
- Run code for complex calculations
- Open and analyze URLs
- Generate images
- Fetch social media posts

These tools are especially useful for functions that need real‑time data or additional processing before generating the structured response.

## Choosing the Correct Mode

Use `response_schema` when you want AIVAX to be responsible for validating and correcting the output. This is the safest mode when the model does not natively support structured outputs, when you are using tools, when the model does reasoning before the final answer, or when the output will be consumed by a system that does not tolerate invalid JSON. In this mode, AIVAX extracts the JSON from the response, validates it against the schema, and if necessary, sends feedback to the model to try again up to the configured limit.

Use `response_format` when you want to take advantage of the provider's native structured output. This mode is better when the model is already reliable for JSON Schema and you want to reduce AIVAX interference in the flow. If the account has automatic JSON Healing enabled, AIVAX can still apply healing in this mode. To control this explicitly, use `response_format.json_schema.healing_options` when you want healing or keep only the schema when you want to pass responsibility to the model.

Use `json_only` when the response consumer needs to receive only the JSON, without a chat completion envelope. This is useful for webhooks, internal jobs, automations, and pipelines that expect a JSON object directly. With `stream: true`, the JSON comes in a single chunk and then `[DONE]`; with `stream: false`, the response body contains only the final JSON. This mode removes useful metadata such as usage and choices, so it is not ideal when you need detailed inference audit in the response itself.

In production, treat the schema as a contract. Required fields must be in `required`; objects that should not accept extra fields must use `additionalProperties: false`; lists must declare `items`; critical strings should use `enum`, `format`, `minLength`, `maxLength`, or `pattern` when possible. The more explicit the schema, the smaller the margin for the model to invent similar formats. At the same time, avoid overly complex schemas in the first test: start with the essential object, validate with real data, and only then add restrictions.

## How to Use

You use the structured response service on the same chat completions endpoint.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
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

Note that the `builtin_tools` parameter defines which built‑in tools the model can use to generate the structured response. Note that the model used must be compatible with function calls.

You can also use structured responses with your AI gateways by providing the gateway ID in the model name.

## JSON Response Modes

There are two ways to request structured responses: with or without JSON Healing.

### With JSON Healing (`response_schema`)

Use `response_schema` to automatically enable JSON Healing with the provided schema. AIVAX validates the model's response and, if invalid, provides automatic feedback for correction:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
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
- **Tool compatible:** Works together with [built‑in tools](/docs/en/tools/builtin-tools) and function calling

AIVAX automatically extracts the JSON from the response, even if it is in a markdown block or preceded by explanatory text.

### Without JSON Healing (`response_format`)

Use `response_format` when the native model already supports structured outputs (like GPT‑4o or Gemini) and you do not need additional validation:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
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

In this mode, the schema is passed directly to the model without additional AIVAX validation, except when your account is configured to enable automatic JSON Healing.

### Enabling JSON Healing in `response_format`

You can explicitly enable JSON Healing by passing a `healing_options` object inside `response_format.json_schema` when `type` is `json_schema`:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
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
            },
            "healing_options": {
                "max_attempts": 5
            }
        }
    }
}
```

The `max_attempts` parameter defines the maximum number of correction attempts. You are charged for each failed attempt. Note that smarter models tend to get it right on the first try.

If healing frequently hits the attempts limit, the problem is usually one of these: the schema is too rigid for the available information, the instruction does not explain the expected format, the model is too small for the task, tools are returning noisy text, or the user input does not contain enough data. First adjust the instruction and schema before simply increasing `max_attempts`, because more attempts can increase cost without solving the cause.

## Supported JSON Schema

AIVAX guides the model to generate a response according to the provided JSON Schema. When the model generates something invalid, it receives feedback on the errors and tries again until the output conforms to the specification.

### Supported Types and Validations

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

## Response Support

AIVAX's JSON healing is compatible with any model and any response type via the [chat completions](https://inference.aivax.net/apidocs#Inferencechatcompletions) endpoint. When used with `stream = false`, the full JSON content will come in the delta content generated by the model.

When used with `stream = true` (SSE), the JSON will come in a single complete chunk, even if the model generates the content in multiple chunks. This makes it possible to use structured responses with streaming, which provides a way to **bypass gateway timeouts** for very slow responses.

## `json_only` Mode

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

The response is exactly the JSON generated by the model, without generation metadata, deltas, etc. This function is compatible with `stream = false` and `stream = true` responses. In the case of `stream = true`, the full JSON will come in a single SSE chunk, with no other markup or additional content. After generating the JSON, a `[DONE]` line is sent to indicate the end of the response.

## Practical Patterns

For data extraction, write the instruction specifying which fields should be inferred, which should be null when missing, and which cannot be invented. For classification, use `enum` in the schema and request a short justification in a separate field, because this facilitates auditing without mixing free text with the final label. For responses that use web search, allow the model to use tools before generating the JSON and include source fields when the application needs to track where the information came from. For conversational forms, use optional fields and a property like `missing_fields` so the system knows what to ask next.

When the JSON will be saved to a database or sent to another service, validate it again on your side. AIVAX greatly reduces the chance of invalid JSON, but the application remains responsible for business rules that do not fit in JSON Schema, such as checking whether an ID exists, whether a date is within a contract, whether a category is allowed for that account, or whether the user has permission to perform an action.