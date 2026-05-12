# Inference

AIVAX uses a customized version of the old `chat/completions` protocol created by OpenAI. These customizations are additive: they do not change the expected behavior of the protocol and are fully compatible with OpenAI clients and SDKs.

Some customizations were made to normalize communication with the model, make it compatible, and interact with the services that AIVAX provides.

## Input and multimodality

AIVAX is fully compatible with multimodality. It is possible to send audio, images, videos and documents to the model using the compatible API:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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
    - `image_url.url` can be an external URL or a base64‑encoded data‑url (`data:image/png;base64,...`).  
    - `image_url.detail` can be null, `low`, `high` or `auto`. Not all models support this parameter.  
- Video interpretation:  
    - content type `video_url`  
    - `video_url.url` can be an external URL or a base64‑encoded data‑url (`data:video/mp4;base64,...`). Gemini models usually support YouTube links. It is highly recommended to provide a URL instead of inline content.  
- Audio interpretation:  
    - content type `input_audio`  
    - `input_audio.data` base64‑encoded audio. External links are not accepted for audio.  
    - `input_audio.format` audio format. Models generally prefer `wav` and `mp3`, but some may also accept `aiff`, `aac`, `ogg`, `flac`, `m4a` and `pcm16/24`.  
- File interpretation:  
    - content type `file`  
    - `file.filename` file name. Useful to guide the model about what the file represents.  
    - `file.file_data` can be an external URL or a base64‑encoded data‑url. Some models support more formats beyond PDFs.  

It is necessary to know that the model you are using supports the input modality you are sending. For certain file types, models tend to reject them due to specific size and format rules.

Make sure that links to external resources are accessible without authentication and without a firewall, as incorrect responses, redirects, or lazy rendering (JavaScript) may throw an exception during inference.

You can also provide a simple textual input using the `prompt` parameter:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

It is also possible to enable server‑side multimodal processing in AIVAX, converting multimodal content to text for models that do not have multimodal reading capabilities:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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

Available multimodal pre‑processing options are:
- `Image`
- `File`
- `Video`
- `Audio`
- `OtherFiles`

> Tip: The `OtherFiles` modality processes various file types, such as PDFs, Excel spreadsheets, PowerPoint presentations, using an internal AIVAX engine and this modality has no cost.

## Structured responses

AIVAX supports structured responses and JSON healing, which automatically corrects defective JSONs or those that do not follow the schema provided during inference.

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
                            "description": "Title of the news"
                        },
                        "content": {
                            "type": "string",
                            "description": "Summary of the news"
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

You can use AIVAX's built‑in tools during inference without needing to define an AI gateway for it.

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
    }
}
```

The list of available options and built‑in tools is available on the [built‑in tools](/docs/en/tools/builtin-tools) page.

## Custom response body

When using AI gateways with a provided API key (BYOK), you can send a custom JSON in the request, replacing the standard AIVAX JSON:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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

## Tool invocation explanations

Models invoke tools during actions, whether local (client‑side) or server‑side (built‑in, MCP, or function protocol). By sending the `tool_invocation_explanations` property, you can include an additional parameter in the function body for the model to explain why it is calling that tool. This can be useful to display to the user in a pleasant and real‑time manner what the model is doing to answer the user.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "my-custom-model:abc4",
    "messages": [...],
    "tool_invocation_explanations": true
}
```

In this case, server‑tool chunks `servertool` will have a tool explanation property:

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

It is possible to render reasoning and tool calls on the server side for a segmented, real‑time timeline display by normalizing reasoning into custom XML blocks.

When enabling this feature, the model will respond by grouping its function calls and reasoning into `<thinking_group>` and `<think>` blocks:

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

It is automatically grouped into reasoning groups, thought fragments emitted by the model, and consecutive server‑side tool calls, and automatically terminated when the model starts a response.

This function is intended to render a pleasant and informative chat to the end user, treating the XML fragments as components or extended specifications of the application's markdown reader.