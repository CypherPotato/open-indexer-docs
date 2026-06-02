# Inference

AIVAX uses a customized version of the old `chat/completions` protocol created by OpenAI. These customizations are additive: they do not change the expected behavior of the protocol and are fully compatible with OpenAI clients and SDKs.

Some customizations were made to make communication with the model standardized, compatible, and to communicate with the services that AIVAX provides.

## Input and multimodality

AIVAX is fully compatible with multimodality. You can send audio, images, videos, and documents to the model using the compatible API:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                { 
                    "type": "text",
                    "text": "Describe this image briefly."
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
                        "file_data": "https://bitcoin.org/bitcoin.pdf",
                    },
                },
            ]
        }
    ]
}
```

- Image interpretation:
    - content type `image_url`
    - `image_url.url` can be an external URL or a base64-encoded data URL (`data:image/png;base64,...`).
    - `image_url.detail` can be null, `low`, `high`, or `auto`. Not all models support this parameter.
- Video interpretation:
    - content type `video_url`
    - `video_url.url` can be an external URL or a base64-encoded data URL (`data:video/mp4;base64,...`). Gemini models usually support YouTube links. It is highly recommended to provide a URL instead of inline content.
- Audio interpretation:
    - content type `input_audio`
    - `input_audio.data` audio encoded in base64. External links are not accepted for audio.
    - `input_audio.format` audio format. Models generally accept `wav` and `mp3` better, but some models may expand to `aiff`, `aac`, `ogg`, `flac`, `m4a`, and `pcm16/24`.
- File interpretation:
    - content type `file`
    - `file.filename` file name. It is useful to guide the model about what this file represents.
    - `file.file_data` can be an external URL or a base64-encoded data URL. Some models support more formats beyond PDFs.

You need to know that the model you are using supports the input modality you are sending. For certain file types, models tend to reject them due to specific size and format rules.

Make sure that links to external resources are accessible without authentication and without a firewall, because incorrect responses, redirects, or lazy rendering (JavaScript) may throw an exception during inference.

You can also provide a simple textual input using the `prompt` parameter:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

It is also possible to enable server-side multimodal processing in AIVAX, converting multimodal content to text for models that do not have multimodal reading capabilities:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

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
                        "file_data": "https://bitcoin.org/bitcoin.pdf",
                    },
                },
            ]
        }
    ],
    "multimodal_preprocess": [
        "File"
    ]
}
```

Available multimodal pre-processing options are:
- `Image`
- `File`
- `Video`
- `Audio`
- `OtherFiles`
- `All`

> Tip: The `OtherFiles` modality processes several file types, such as PDFs, Excel spreadsheets, PowerPoint presentations, using an internal AIVAX engine, and this modality has no cost.

Files and videos require a minimum balance of $0.50 in the account. Images and audio require a minimum balance of $0.10.

Use direct multimodality when the chosen model already understands that type of input. Use `multimodal_preprocess` when you need to transform the input into text before sending it to the main model, usually because the model is cheap, fast, or text-specialized, but does not understand image, audio, video, or file. This choice changes how the conversation is built: with direct multimodal input, the original content reaches the model; with pre-processing, AIVAX generates a textual description and that description enters the context. Pre-processing is especially useful for PDFs, spreadsheets, presentations, and simple images that only need to be summarized or extracted before a textual response.

For files, prefer public URLs when the file is large or when you want to avoid very long base64 payloads. For small images, data URLs can simplify integration. For audio, send base64 in the `input_audio.data` field and specify `format`; external audio links are not accepted in this field. For video, prefer an external URL, especially when the model provider can fetch the content directly. In any modality, the resource must be accessible without authentication, without IP blocking, and without relying on JavaScript to load the main content.

When a multimodal inference fails, narrow down the problem. First, test a simple textual message with the same model. Then, test a single small attachment. Next, test the same attachment with `multimodal_preprocess`. If the direct model fails and pre-processing works, the problem is likely the model's multimodal support. If both fail, review the URL, format, size, minimum balance, and resource accessibility. In production, treat attachments as inputs that can fail and write the user experience to request a resend, use another format, or respond with a clear limitation.

## Structured responses

AIVAX supports structured responses and JSON healing, which automatically corrects defective JSONs or those that do not follow the schema provided during inference.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Pesquise por notícias em São José do Rio Preto.",
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
                            "description": "Título da notícia"
                        },
                        "content": {
                            "type": "string",
                            "description": "Resumo da notícia"
                        }
                    }
                }
            }
        }
    }
}
```

Read more about structured responses on its [dedicated page](/docs/en/inference/structured-responses).

## On-demand functions

You can use AIVAX built-in tools during inference without needing to define an AI gateway for it.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Pesquise por notícias em São José do Rio Preto.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    }
}
```

The list of available options and built-in tools is available on the [builtin tools](/docs/en/tools/builtin-tools) page.

On-demand tools are suitable for occasional calls, prototypes, and integrations that do not need a persistent gateway. If the same application always uses the same tools, prefer configuring them in the AI Gateway to keep the policy centralized. In direct calls, the client making the request controls the tool list for each call; in gateways, the agent administrator controls the available set. This difference is important for security: tools such as `Request`, `AdvancedWebUsage`, document generation, and web search can access external resources or generate hosted content, so they should be enabled with clear intent.

## Custom response body

When using AI gateways with a provided API key (BYOK), you can forward custom JSON in the request, replacing the usual AIVAX JSON:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "my-custom-model:abc4",
    "messages": [...],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

This property is not compatible with models routed by AIVAX.

## Tool explanations

Models invoke tools during actions, either local (client-side) or server-side tools (built-in, MCP, or function protocol). By forwarding the `tool_invocation_explanations` property, you can include an additional parameter in the function body for the model to explain why it is calling that tool. This can be useful to display to the user in a pleasant and real-time way what the model is doing to answer the user.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "my-custom-model:abc4",
    "messages": [...],
    "tool_invocation_explanations": true
}
```

In this case, server tool chunks `servertool` will have a tool explanation property:

```json
{
  "id": "chatcmpl-019e1d73-cf92-7f3f-bac7-d0869770cda8",
  "object": "chat.completion.chunk",
  "created": 1778610589,
  "model": "@x-ai/grok-4.3",
  "system_fingerprint": "fp_uu72kl",
  "choices": [],
  "servertool": {
    "name": "web_search",
    "id": "call-70944e44-fbc5-4906-9f9f-99559c05db11-0",
    "contents": "{\"query\":\"What's the weather forecast for today?\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to provide an accurate forecast for today, as the user's location isn't specified so I'll use a general search to retrieve relevant data.\"}",
    "state": "Created",
    "explanation": {
      "reason": "Searching for today's weather forecast online",
      "goal": "I need current weather information to provide an accurate forecast for today, as the user's location isn't specified so I'll use a general search to retrieve relevant data."
    }
  },
  "usage": null
}
```

## Response rendering

It is possible to render reasoning and tool calls on the server side for a segmented timeline display in real time by normalizing reasoning into custom XML blocks.

When enabling this function, the model will start responding by grouping its function calls and reasoning into `<thinking_group>` and `<think>` blocks:

```
<thinking-group>

<think>We need current weather forecast for São Paulo. Must use web_search tool. Provide meta fields. Search term likely "São Paulo weather forecast today".</think>

<tool><toolname>web_search</toolname><toolreason>Searching today's weather forecast for São Paulo</toolreason></tool>

<think>The search results are messy. Need specific forecast. Could open one of the Brazilweather.org pages. Let's open the English? The result appears to be Portuguese/Catalan. Use open? There's no open tool, only web_search. We may need to extract info from snippet. The snippet for tradefairdates shows temperature 14°C 20°C today 10.05.2026 (future). Not relevant. We need today's forecast. Likely we can answer based on typical current data, but should provide up-to-date. Could try another search with "São Paulo weather today" maybe results better. Let's call again.</think>

<tool><toolname>web_search</toolname><toolreason>Searching for São Paulo Brazil weather today forecast</toolreason></tool>

<think>We should answer in English (conversation language). Provide forecast, temperature highs, lows, chance of rain, maybe wind.</think>
</thinking-group>

Here’s the weather outlook for **São Paulo (Brazil) today, May 12 2026**:

...

**Current conditions (as of 15:30 local time)** – Sunny, 20 °C (68 °F), light east breeze (~4 km/h), humidity 40 %, no precipitation observed.

Overall, today will be comfortably warm and dry, with clear skies and virtually no rain expected.
```

It is automatically grouped into reasoning groups, thought fragments emitted by the model, and consecutive server-side tool calls, and automatically terminated when the model starts a response.

This function is intended to render a pleasant and informative chat to the end user, treating the XML fragments as components or extended specifications of the application's markdown reader.

## When to use direct call or gateway

Use direct call for simple tasks, tests, internal routines, and integrations where the application already controls prompt, model, tools, and context. It is the shortest path to call a model, send multimodal input, request a structured response, or enable built-in tools per request. Direct call is also useful when you want to switch models dynamically from the application and do not need a persistent configuration in the console.

Use an AI Gateway when the behavior needs to be stable, auditable, and reusable. Gateways are better for support assistants, chat client bots, RAG agents, permanent tools, workers, skills, and configurations that multiple clients will share. The gateway reduces repetition in the application and allows changing behavior without changing code. A good rule of thumb: if you are copying the same prompt, the same tool list, or the same RAG collection across multiple calls, this configuration probably should be in a gateway.