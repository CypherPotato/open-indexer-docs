# Built-in Tools

A AIVAX provides a list of built‑in tools that you can enable in your model. These tools can be used together with the [server‑side functions](/docs/en/protocol-functions).

Some functions have a cost. This cost is applied to models used by AIVAX and those you provide through BYOK (bring‑your‑own‑key), so it is important to add balance if you intend to use these tools.

Note that each model decides which function to call and its parameters. Not all models may obey the call rules.

## Web Search

This function enables web search in your model. With it, the model can look up specific or real‑time information, such as weather data, news, game results, etc.

Web search is performed by several providers, chosen according to network availability and latency. AIVAX uses a mix of providers to carry out web searches.

AIVAX offers two configurable search types via its dashboard:

- **Full**: the search returns the complete content of each result, inserted into the conversation context.
- **Summarized**: the search returns a summary, inserted into the conversation context as an AI‑generated summary by the search provider.

The cost for both modes is **$5** per **1,000** searches performed. The `Full` mode may consume more input tokens in the conversation but can provide more precise results.

> [!NOTE] 
> 
> **Important:** the `Full` search is not always available.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "WebSearch"
    ],
    "options": {
        // maximum number of results returned by web search operations.
        "web_search_max_results": 10, // between 1-25

        // level of detail returned by web search operations.
        "web_search_mode": "full" // full, summarized
    }
}
```

## Advanced Web Usage

This function allows the model to have a web browser and perform automation, such as searches, navigating sites, filling forms, and clicking buttons.

There is currently no parameterization for this function.

The cost of this function is **$2** per hour of automation, plus a fixed amount of **$11.10** per **1,000** calls of this function.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "AdvancedWebUsage"
    ],
    "options": {
    }
}
```

## Code Execution

This function allows the model to execute JavaScript code and inspect the execution result. With it, the model can evaluate mathematical expressions and other situations that are best represented through code.

The code runs in a sandboxed environment with very few functions available. The model cannot access I/O, the internet, or import scripts through this tool.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Code"
    ],
    "options": {
    }
}
```

## URL Context

This function lets the model access external content at URLs and links provided by the user. With it, the model can fetch links and evaluate their content.

Note that some destinations may identify the access as a bot and block it, as this function performs a simple GET rather than crawling.

The model can access up to 5 links at once. Only the first 10 MB of each link are read. When the link content is retrieved, the system checks the response type and handles it accordingly:

- HTML content is rendered: HTML tags, scripts, CSS, and “noise” are stripped, leaving only the plain text of the link.
- Other textual content: the content is read directly with no transformation.
- Non‑textual content: when the link returns a non‑textual file and the response indicates a filename (either via the path or the `Content-Disposition` header), the system attempts to convert the downloaded file to a textual version.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "OpenUrl"
    ],
    "options": {
    }
}
```

## Memory

This function allows the model to store relevant content for use across multiple conversations.

> Currently, this function is only available when used in [chat clients](/docs/en/entities/chat-clients) and when the session is identified by a `tag`.

Through the session `tag`, the model stores a relevant piece of conversation data, such as name preferences, reminders, or actions the assistant should perform.

The instruction for this memory tells the model not to save sensitive or personal data; however, it is not guaranteed that the model will always follow this rule.

Data are stored for one year in AIVAX’s databases and can be deleted at any time by the platform. For every conversation via a chat client, this data are retrieved and attached to the conversation.

> Note: in chat/completions requests, the `tag` is specified in the `$.user` parameter.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ],
    "options": {
        // indicates whether all memory contexts should be included in the system instructions.
        "include_all_memory_context": true
    }
}
```

## Image Generation

This function allows the model to create AI‑generated images.

AI‑generated images are attached to the conversation context but are not directly visible to the assistant.

This function has a cost. The cost varies by the image‑generation model used. Image generation occurs on an external provider, so the price can change based on several factors.

You can also enable explicit and adult image generation. When this feature is enabled, the model is allowed to generate adult material, but the model must also “agree” to generate such content. Some models have a lower safety filter than others. For example, Gemini models have the lowest safety filter, making them a viable option for role‑play and generating this type of material.

You are always responsible for the [material you generate](/docs/en/legal/terms-of-service.md), and generated material must comply with our terms of service.

Available image‑generation models are:
- `grok-imagine-pro`
- `grok-imagine`
- `seedream-5-lite`
- `seedream-4-5-pro`
- `seedream-4`
- `nanobanana-2`
- `nanobanana-pro`
- `nanobanana`
- `gpt-image-1.5`
- `gpt-image-1-mini`
- `flux-2-klein`
- `flux-schnell`
- `zimage-turbo`

Generated images are stored on AIVAX’s servers for a few months before being permanently removed.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        // sets the generation model to use for image generation.
        "image_generation_model_name": "grok-imagine",

        // indicates whether image generation is allowed to use references (e.g. images from the web or user uploads) as input.
        "image_generation_allow_reference_usage": true,

        // deprecated. sets the quality level for generated images.
        "image_generation_quality": "low|medium|high|highest",

        // sets the maximum number of images that can be generated in a single request.
        "image_generation_max_results": 2, // 1-4

        // indicates whether image generation is allowed to produce mature content.
        "image_generation_allow_mature_content": false
    }
}
```

## X Posts Search

This function lets the model search for posts on X (formerly Twitter).

It is a direct alternative to `web_search`, as it can be used to look up real‑time updated information such as news, data, game results, etc. This tool returns much more recent results than conventional web search.

It is not recommended to use both functions together because they serve the same purpose.

Currently, the latest 20 posts on a given topic are inserted into the conversation context, including link and author.

At the moment, it is not possible to access posts from specific profiles.

The cost of this function is **$5** per **1,000** searches performed.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "XPostsSearch"
    ],
    "options": {
    }
}
```

## Document Generation

This function allows the model to create PDFs from HTML text.

The generated files are hosted on AIVAX’s servers and made available by the assistant.

The content is hosted for a few months before being permanently deleted.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "GenerateDocument"
    ],
    "options": {
    }
}
```

## Web Page Generation

This function allows the model to host HTML pages on AIVAX’s servers.

This enables the model to host reports, landing pages, and other HTML infographics.

The content is hosted for a few months before being permanently deleted.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "GenerateWebPage"
    ],
    "options": {
    }
}
```

## Advanced Request

This function provides an advanced HTTP request tool to the model. With it, the model can define headers, forms, bodies, and methods to perform advanced HTTP requests.

Large responses are automatically truncated and rendered server‑side (rendering HTML, Markdown, etc.).

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Request"
    ],
    "options": {
    }
}
```

## Calendar

A static function almost identical to the memory function, with the same storage parameters but optimized for storing memory in dates rather than as loose items.

It is not recommended to enable this function together with the memory function or chat‑client message‑scheduling functions.

This function has no cost.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Calendar"
    ],
    "options": {
    }
}
```