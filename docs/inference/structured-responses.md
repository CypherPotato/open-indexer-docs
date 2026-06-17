# Structured Responses

AIVAX can produce structured JSON through two paths:

- `response_schema`: AIVAX validates the final model output against a JSON Schema and retries with validation feedback when the output is invalid. This is the JSON Healing path.
- `response_format`: AIVAX passes a native OpenAI-compatible response format to the provider, or applies healing when `healing_options` is present or automatic JSON Healing is enabled on the account.

Use structured responses when another system will consume the output and free-form text would be fragile.

## How JSON Healing works

When `response_schema` is present, AIVAX adds schema instructions to the model request. After the model generates an answer, AIVAX tries to extract JSON from:

- The complete generated text.
- Common repaired variants, such as missing opening or closing braces.
- JSON code blocks found in the generated text.

If the extracted JSON does not validate against the schema, AIVAX adds a feedback message with the validation errors and asks the model to generate the JSON again. This continues until a valid JSON value is generated or the configured attempt limit is reached.

JSON Healing improves reliability, but it is not an absolute guarantee. If the model repeatedly fails the schema, the request can fail after the attempt limit.

## Choosing a mode

Use `response_schema` when AIVAX should own validation and repair. This is the safest mode for models that do not natively support structured output, for responses that use tools before producing JSON, and for systems that cannot tolerate malformed JSON.

Use `response_format` with `type: "json_schema"` when the provider model should handle the structured output natively. AIVAX will still use the schema internally, and healing is applied when `response_format.json_schema.healing_options` is provided or the account has automatic JSON Healing enabled.

Use `json_only: true` when the HTTP response body should be only the final JSON. This removes the normal chat completion envelope, choices, usage, and generation metadata from the response body.

## Basic example

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
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
                        "summary": {
                            "type": "string",
                            "description": "News summary"
                        }
                    },
                    "required": ["title", "summary"]
                }
            }
        },
        "required": ["news"]
    }
}
```

`builtin_tools` is optional. If you enable tools, the selected model must support tool calling or the gateway must provide a tool handler.

## Native structured output

Use `response_format` when you want to use the provider's native JSON Schema support:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "List 3 European capitals."
        }
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
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
    }
}
```

If the selected integrated model has strict JSON support, AIVAX can forward the schema using the provider's JSON Schema response format.

## Enabling healing in `response_format`

You can explicitly enable JSON Healing inside `response_format.json_schema`:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "Return a short status object."
        }
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "status": { "type": "string" },
                    "message": { "type": "string" }
                },
                "required": ["status", "message"]
            },
            "healing_options": {
                "max_attempts": 5
            }
        }
    }
}
```

`max_attempts` must be between 1 and 10. Each retry is another model generation attempt and can increase cost and latency.

If healing frequently reaches the attempt limit, adjust the instruction and schema before raising the limit. Common causes are overly rigid schemas, missing `required` fields, vague prompts, noisy tool results, or a model that is too small for the task.

## `json_only` mode

Set `json_only: true` when the client should receive only the generated JSON:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "List 3 European capitals."
        }
    ],
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
    },
    "json_only": true
}
```

With `stream: false`, the HTTP response body is the final JSON with `Content-Type: application/json`. With `stream: true`, AIVAX sends the complete JSON as one SSE data event and then sends `[DONE]`.

## Supported schema features

AIVAX validates the generated JSON with JSON Schema. The documented supported features are:

- `string`: `minLength`, `maxLength`, `pattern`, `format`, and `enum`.
- `number` and `integer`: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, and `multipleOf`.
- `array`: `items`, `uniqueItems`, `minItems`, and `maxItems`.
- `object`: `properties` and `required`.
- `boolean` and `bool`.
- `null`.
- Multiple types, for example `"type": ["string", "number"]`.

Use `required` for fields your application must receive. Use explicit `items` for arrays. Use `enum`, `format`, and length or pattern restrictions when the accepted values are known.

## Practical patterns

For extraction, tell the model which fields must be inferred, which fields should be `null` when missing, and which fields must not be invented.

For classification, use `enum` for the final label and add a short `reason` field when humans need to audit the decision.

For tool-backed JSON, allow the model to use tools before producing the JSON and include source fields when the application needs provenance.

For database writes or external API calls, validate the JSON again in your application. AIVAX validates the JSON shape, but your application remains responsible for business rules such as permissions, valid IDs, date ranges, and account-specific constraints.
