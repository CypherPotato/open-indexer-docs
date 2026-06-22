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

## Request idempotency

Set `idempotency_key` when your integration needs repeat calls to update the same stored conversation record instead of creating a new conversation token. AIVAX uses this value as the internal `ConversationToken` for the AI Gateway context and conversation logging.

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Summarize order 123."
        }
    ],
    "idempotency_key": "order-123-summary"
}
```

The value must be a non-empty string with 128 characters or less. When omitted, AIVAX generates a conversation token automatically.

## Request metadata

Set `metadata` to attach string key/value information to the inference request. AIVAX stores this object with the logged conversation and exposes it to gateway events, so it is useful for operational correlation such as an order ID, tenant, workflow, or internal trace key.

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` must be a JSON object whose property names and values are strings. Do not place secrets, credentials, payment data, or large payloads in this field.

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

Set `rendering_mode: "textual_blocks"` when your client wants AIVAX to place reasoning and server-side tool activity in the same textual response flow that the chat UI already renders. This is useful for clients that build a single response timeline and want to turn reasoning and tool activity into visible components without keeping separate event-handling paths for every marker type.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Search for recent product updates and summarize the important changes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

In this mode, reasoning can be emitted as `<thinking-group>` and `<think>` blocks, assistant-facing text can be emitted as `<assistant-answer>` blocks, and server-side tool markers can appear as tool result elements such as `<div class="tool-result reason" data-tool-name="...">`. Treat these blocks as presentation markers inside the response stream: parse them into chat timeline components, collapsible reasoning sections, assistant answer fragments, or tool status rows, but do not blindly concatenate every marker into the final assistant answer.

Clients that do not understand this markup should keep the default rendering mode and handle the structured stream events directly. In the default mode, reasoning arrives through `delta.reasoning`, and server-side tool activity arrives through `servertool` events. Preserve the order in which stream events arrive so reasoning, tool activity, partial content, and the final answer remain in the same response timeline.

### Raw multi-turn example

The example below shows the shape of a streamed response when server-side reasoning is visible to the client, `tool_invocation_explanations` is enabled, and `textual_blocks` is used to keep the response timeline textual. The exact tool result attributes can vary by renderer, but the important behavior is the ordering: reasoning, assistant answer fragments, tool activity, more reasoning, and the final answer can all belong to the same assistant turn.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Raw streamed assistant timeline:

```text
<thinking-group>
<think>
The user is asking for cheap, fast multimodal models for security camera analysis.
I should list available AIVAX models and search the documentation before recommending options.
</think>
</thinking-group>

<assistant-answer>
I will check the available multimodal models and identify the best options for security camera analysis.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listing the available models in AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Searching documentation about multimodal models and image analysis in AIVAX</span></div>

<think>
The relevant models should support VideoInput or ImageInput, have low input cost, and be fast enough for camera workflows.
I found several candidates and should rank them by cost, speed, and modality support.
</think>
</thinking-group>

<assistant-answer>
For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.

Top picks:

1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.
2. @qwen/qwen3.5-9b: the lowest input cost with video support.
3. @amazon/nova-lite: low input cost and a large context window.

Use VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them.
</assistant-answer>
```

When the user replies, keep the conversation history focused on the user-visible assistant result. Store reasoning and tool details as timeline or audit metadata if your product needs them, but do not turn them into a new user message. The assistant message should use the content from the final `<assistant-answer>` block, not the full reasoning transcript.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        },
        {
            "role": "assistant",
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nTop picks:\n\n1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: the lowest input cost with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
        },
        {
            "role": "user",
            "content": "Now recommend one model for real-time alerts and one for deeper review."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

### Presentation guidance

During generation, reasoning is useful because it lets the user follow what the model is doing before the final answer exists. The assistant can "speak" while it reasons by emitting user-facing process updates or provisional answer fragments. These updates may be interleaved with reasoning blocks, tool calls, and partial answer content as the response develops.

Once the final assistant answer is generated, that answer becomes the main product of the inference. The intermediate reasoning is still useful for audit, orientation, and debugging, but it usually stops being the user's primary goal. Collapse or minimize reasoning by default after completion so the final answer receives the strongest visual emphasis, while keeping the process available for users who want to inspect it.

Use progressive disclosure around that lifecycle. Reasoning can be visible while the model is still working, then become a quieter, secondary element after the final answer appears. Tool activity should read as status, not speech: use concise labels such as "Searching", "Opening source", "Running tool", "Finished", or "Failed", and keep each tool invocation grouped as one timeline item even if its state changes over time.

A good visual hierarchy is:

- Assistant answer: highest prominence, normal reading typography, part of the main conversation.
- In-progress reasoning: visible enough to show what the model is doing while the response is being generated.
- Completed reasoning: lower prominence, subdued color or container, collapsed or minimized by default.
- Tool blocks: compact status rows with clear loading, success, and error states.
- Raw details: hidden by default unless the client is a developer, audit, or debugging surface.

Avoid exposing noisy internals directly to end users. Show tool names, states, source labels, or short summaries when they help the user understand what happened. Hide raw arguments, large payloads, and implementation details unless the user explicitly asks for details or the product surface is built for technical inspection.

For accessibility, make every collapsed block keyboard-toggleable, give each status row a readable label, avoid relying on color alone for state, and keep motion subtle. A streaming response should feel stable while it updates: new reasoning or tool rows can appear in order, but existing content should not jump around or force the user to lose their reading position.

## Direct call or gateway

Use a direct call for simple tasks, tests, internal routines, and integrations where the application controls the model, prompt, tools, and context for each request.

Use an AI Gateway when behavior needs to be stable, auditable, and reusable. Gateways are better for support assistants, chat bots, RAG agents, permanent tools, workers, skills, and configurations shared by multiple clients.
