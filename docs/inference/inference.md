# Inference

AIVAX exposes an OpenAI-compatible `chat/completions` API with additional AIVAX parameters. The additions are optional and are designed to support gateways, RAG, built-in tools, structured responses, multimodal pre-processing, model routing, and billing metadata.

Use this page for direct inference calls. Use [AI Gateway](/docs/inference/ai-gateway) when the same configuration must be reused or centrally managed.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

The endpoint also has the API alias `/api/v1/chat/completions`.

## Input and multimodality

AIVAX accepts OpenAI-compatible message content parts for text, images, audio, videos, and files. The selected model must support the modality unless you ask AIVAX to pre-process the media into text.

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe these inputs briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/receipt.png",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "base64-encoded-audio",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "https://bitcoin.org/bitcoin.pdf"
                    }
                }
            ]
        }
    ]
}
```

Supported content part mappings:

- `text`: Plain text.
- `image_url`: Image content. `image_url.url` can be an external URL or a base64 data URL. `image_url.detail` can be `low`, `high`, or `auto` when the model supports it.
- `video_url`: Video content. `video_url.url` can be an external URL or a base64 data URL. Prefer URLs for large videos.
- `input_audio`: Audio content. `input_audio.data` is base64 audio data, and `input_audio.format` names the format.
- `file`: File content. `file.filename` names the file, and `file.file_data` can be an external URL or a base64 data URL.

For video input, send a `video_url` content part. Use a publicly reachable URL when possible, especially for large videos:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the main actions in this video and identify any visible safety risks."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "https://example.com/factory-inspection.mp4"
                    }
                }
            ]
        }
    ]
}
```

External links must be accessible to AIVAX without authentication, firewall restrictions, or JavaScript-only rendering. Failed downloads, redirects, blocked URLs, unsupported formats, or provider-specific size limits can fail the inference.

You can also send a simple text request with `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Multimodal pre-processing

Use `multimodal_preprocess` when the main model should receive a textual description of media instead of the original media object. This is useful for text-first models or when you want AIVAX to normalize files before the main inference.

```json
{
    "model": "@meta/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe this file briefly."
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,BASE64_PDF_CONTENT"
                    }
                }
            ]
        }
    ],
    "multimodal_preprocess": "File"
}
```

Available pre-processing flags are:

- `Image`
- `Audio`
- `Video`
- `File`
- `OtherFiles`
- `All`

The resolver caches media descriptions by content hash for reuse. `Image`, `Audio`, `Video`, and PDF `File` pre-processing use auxiliary multimodal inference. `OtherFiles` uses the internal extraction path for non-PDF files that can be converted to text.

Files and videos require a minimum account balance of $0.50. Images and audio require a minimum account balance of $0.10.

When a multimodal inference fails, narrow down the problem:

1. Test a simple text message with the same model.
2. Test one small attachment.
3. Test the same attachment with `multimodal_preprocess`.
4. Review the URL, format, size, balance requirement, and model modality support.

## Structured responses

AIVAX supports structured responses through `response_schema`, `response_format`, and `json_only`.

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

`response_schema` enables JSON Healing. AIVAX asks the model for JSON, extracts JSON from the generated text or markdown blocks, validates it against the schema, and retries with validation feedback until the output is valid or the attempt limit is reached.

Read more on [Structured responses](/docs/inference/structured-responses).

## On-demand functions

Use `builtin_tools` to enable AIVAX built-in tools for a direct request without creating a gateway:

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
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

Built-in tools include `WebSearch`, `AdvancedWebUsage`, `OpenUrl`, `Code`, `Request`, `Calendar`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch`, and `ImageGeneration`.

On-demand tools are suitable for occasional calls, prototypes, and integrations that do not need a persistent gateway. If the same application always uses the same tools, prefer configuring them in an AI Gateway so the policy is centralized.

## Custom provider request body

When a gateway uses a provided API key and an OpenAI-compatible provider endpoint, `extra_body` can merge custom JSON into the provider request body:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` is not allowed with integrated AIVAX models.

## Tool explanations

Set `tool_invocation_explanations: true` to ask AIVAX to include explanation fields in server-side tool arguments. When the model supplies `_tool_reason` and `_tool_goal`, `servertool.explanation` contains a client-friendly copy:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather forecast for today?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Example stream event:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-70944e44-fbc5-4906-9f9f-99559c05db11-0",
        "contents": "{\"query\":\"weather forecast today\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to answer accurately.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Searching for today's weather forecast online",
            "goal": "I need current weather information to answer accurately."
        }
    },
    "usage": null
}
```

## Response rendering mode

Set `rendering_mode: "textual_blocks"` when a client wants reasoning and server-side tool markers normalized into textual blocks. In this mode, reasoning can be emitted as `<thinking-group>` and `<think>` blocks, and server-side tool markers can be emitted as `<tool>` blocks.

This mode is intended for clients that render those blocks as components in a chat timeline. Clients that do not understand the markup should use the default rendering mode and handle `delta.reasoning` and `servertool` events instead.

## Direct call or gateway

Use a direct call for simple tasks, tests, internal routines, and integrations where the application controls the model, prompt, tools, and context for each request.

Use an AI Gateway when behavior needs to be stable, auditable, and reusable. Gateways are better for support assistants, chat bots, RAG agents, permanent tools, workers, skills, and configurations shared by multiple clients.
