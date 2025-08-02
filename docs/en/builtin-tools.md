# Built-in Tools

AIVAX provides a list of built-in tools for you to enable in your model. These tools can be used in conjunction with the [server-side functions](/docs/en/protocol-functions).

Some functions have a cost. This cost is applied to models used by AIVAX and those you provide through BYOK (bring-your-own-key), so it's essential to add balance if you intend to use these tools.

Note that each model decides which function to call and its parameters. Not all models can follow the calling rules.

## Internet Search

This function enables internet search in your model. With this, the model can query specific or real-time information, such as weather data, news, game results, etc.

The internet search is performed by multiple providers, chosen according to network availability and latency. The current providers used by AIVAX are [linkup](https://www.linkup.so/) and [Exa](https://exa.ai/).

AIVAX provides two types of configurable search through your dashboard:

- **Full**: the search performed is complete, inserting the entire content of each result found into the conversation context.
- **Summarized**: the search performed is summarized, inserting a summary made by AI by the search provider itself into the conversation context.

The cost of both modes is **$5** per **1,000** searches performed. The `Full` mode may consume more conversation input tokens, but it can provide more accurate results.

## Code Execution

This function allows the model to execute JavaScript code and inspect the execution result. With this, the model can evaluate mathematical expression results and other situations that are better represented through code.

The code is executed in a protected environment with very few available functions. The model will not be able to access I/O, internet access, or import scripts through this tool.

This function has no cost.

## URL Context

This function allows the model to access external content in URLs and links provided by the user. With this function, the model can access links and evaluate their content.

Note that some destinations may identify access as a bot and block access, since this function is not crawling but a simple GET request to the destination.

The model can access up to 5 links at a time. Only the first 10MB of the links are read. When obtaining the link content, the system checks the return content and handles it according to each type:

- HTML content is rendered: HTML tags, scripts, CSS, and "noise" are removed from the access result, keeping only the pure text of the link.
- Other textual content: the content is read directly, and no transformation is performed.
- Non-textual content: when the link responds with non-textual content and the response indicates a file name (either by path or by `Content-Disposition` header), the system attempts to convert the downloaded file to a textual version.

This function has no cost.

## Memory

This function allows the model to store relevant content for use in multiple conversations.

> Currently, this function is only available when used in [chat clients](/docs/en/entities/chat-clients) and when the session is identified by a `tag`.

Through the session `tag`, the model stores relevant conversation data, such as name preferences, reminders, or actions the assistant should perform.

The instruction of this memory instructs the model not to save sensitive or personal data; however, it is not guaranteed that the model will always follow this rule.

The data is stored for one year in AIVAX's databases and can be deleted at any time by the platform. For every conversation by a chat client, this data is obtained and attached to the conversation.

This function has no cost.

## Image Generation

This function allows the model to create AI-generated images.

The AI-generated images are attached to the conversation context but are not directly visible to the assistant.

Currently, there are four categories of generated images:

![Image quality](/assets/img/imgquality.png)

- **Low quality**: generates images quickly with a low cost, but may generate many artifacts, such as extra fingers, distorted eyes, or misplaced arms.
- **Medium quality**: balances good quality and speed, but may still generate artifacts.
- **High quality**: higher quality in images and lower chance of artifacts in the image.
- **Very high quality**: the highest quality in image generation. After generation, an upscaling model performs the adjustment on the created image.

This function has a cost. The cost varies depending on the processing time of each image, which is affected by processing consumption, queue size, models used, etc. Image generation occurs on an external provider, so the cost may change according to various factors.

The example image above shows a forecast of the price of each image quality.

You can also activate the generation of explicit and adult images in image generation. When you activate this feature, the model will be allowed to generate adult material. For this to happen, the model must also "agree" to generate this content. Certain models have a lower security filter than others. For example, Gemini models have the lowest security filter, making them a viable option for role-play and generating this type of material.

You are always responsible for the [material you generate](/docs/en/legal/terms-of-service.md), and the generated material must be compatible with our terms of service.