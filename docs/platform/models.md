# Models

Use **Models** to discover the integrated models available to your AIVAX account and decide whether to call a model directly or use it as the base model for an AI Gateway.

This page is for builders choosing a model for a product workflow. It explains how to read the model catalog, compare options, open integration examples, and create a gateway from a model. For the API-level model listing and direct inference behavior, see [Getting Started](/docs/getting-started) and [Inference](/docs/inference/inference).

## Before you begin

Sign in to the [AIVAX console](https://console.aivax.net/) and open **Dashboard > Models**. Confirm you are using the intended account and plan before testing models, because model access, balance, subscription reserves, request limits, model status, and gateway configuration can affect whether a visible model can be used successfully.

For API examples, create or choose a private API key for a backend integration. Do not use shared browsers for model testing, and do not commit keys or generated playground URLs to source control.

## When to use Models

Open **Models** when you need to:

- Find the exact model name to use in an OpenAI-compatible request.
- Compare model speed, intelligence, context size, price, stability, and capabilities.
- Check whether a model is included in subscription reserve usage.
- Choose a model that supports a required capability, such as image input, audio input, video input, reasoning, tool calling, code execution, web search, or model routing.
- Create a new AI Gateway from a model.
- Copy starter integration code for Python, JavaScript, or curl.

Use a direct model call for simple tests, prototypes, internal routines, or code paths where your application controls every request option. Use an [AI Gateway](/docs/inference/ai-gateway) when the behavior should be reusable, centrally managed, auditable, or shared by chat clients, RAG workflows, skills, tools, workers, or multiple applications.

## Search and filter the catalog

The Models page shows the integrated model catalog and current model count. A model appearing in the catalog does not guarantee every account can use it in every workflow. Plan access, account balance, subscription reserves, request limits, model status, and gateway configuration can still affect runtime behavior.

Use the search box to search by model name. The search is tolerant of spaces and punctuation, so searching for a provider or model family can narrow the list even when the full model name contains symbols such as `@`, `/`, `-`, or `:`.

Use filters when you already know the tradeoff you want:

| Filter | Use it when |
| --- | --- |
| **Speed** | You need lower latency for chat, support, routing, extraction, or user-facing flows. |
| **Intelligence** | You need stronger reasoning, coding, instruction following, or long-horizon work. |
| **Price** | You need to control output cost or compare cheaper and more expensive models. |
| **Subscription** | You want to identify models with included usage for subscription plans. |

Filters can produce an empty list. If that happens, clear the search term first, then relax one filter at a time. For example, if no model matches a provider name plus **Ultra fast** plus **Included**, remove the subscription filter or choose **Fast**.

## Read a model card

Each model card combines product and billing signals:

| Field | What it means |
| --- | --- |
| **Model name** | The exact value used in `model`, such as `@provider/model-name`. Copy this value when calling the model directly. |
| **Description** | A short summary of the model's intended strengths and provider positioning. |
| **Provider and release date** | Helps distinguish model families and understand freshness. |
| **Context window** | The maximum context size exposed for the model. Long context helps with large documents and project-scale prompts, but it can increase cost and latency. |
| **Stability** | Indicates whether the model is stable, unstable, or offline. |
| **Pricing** | Shows input, cached input, audio input when available, and output prices per million tokens. Some models show different pricing by context tier. |
| **Speed** | A relative speed rating from slowest to ultra fast. |
| **Intelligence** | A relative capability rating from lowest to highest. |
| **Capabilities** | Icons for supported model features, such as image, audio, video, web search, thinking, tool calling, code execution, external links, memory, JSON functions, uncensored behavior, model routing, or diffusion. |
| **Badges** | Important status labels such as subscription included, new, preview, deprecated, discounted, free, or other account/model flags when shown. |

Do not choose by one signal alone. A cheap model can become expensive if it needs many retries, produces long answers, or lacks a required capability. A high-intelligence model can be the wrong choice for high-volume extraction if a faster and cheaper model can meet the quality bar.

## Choose a model for a workflow

Start with the workflow's hard requirements:

1. **Input type:** text only, image, audio, video, file, or mixed content.
2. **Output shape:** plain text, structured JSON, tool calls, code execution, or generated media.
3. **Latency:** interactive chat, background job, batch processing, or long-running analysis.
4. **Context size:** short prompt, conversation history, large documents, or project-scale context.
5. **Cost profile:** expected input tokens, output tokens, cached input, and retry rate.
6. **Operational risk:** stable production use, preview testing, deprecated migration, or model-router behavior.

Then use the catalog filters to find candidates and test them with a small representative prompt. For production, prefer stable models that support the required capabilities directly. Use preview, deprecated, free, uncensored, or router models only when their tradeoffs are intentional and documented for your team.

If the model will be used with RAG, tools, skills, workers, public chat clients, or channel integrations, create an AI Gateway instead of hardcoding the integrated model name in every client. The gateway keeps model selection, instructions, retrieval, tools, and safety settings in one place.

## Use model actions

Open the action menu on a model card to use the selected model.

| Action | What it does |
| --- | --- |
| **Copy model name** | Copies the exact model identifier for direct API calls or documentation. |
| **Create gateway** | Opens a form for a gateway name and creates an AI Gateway using the selected integrated model. |
| **Open playground** | Opens the AIVAX playground with the selected model and current session context. Use it for quick trusted-browser tests before committing to a configuration. |
| **View integration code** | Opens starter examples in Python, JavaScript, and curl using an `AIVAX_API_KEY` environment variable. |

Creating a gateway from a model sets the gateway to use the integrated model through AIVAX. After the gateway exists, review its instructions, RAG collections, tools, skills, workers, and output settings before using it in production. See [AI Gateways](/docs/inference/ai-gateway) for the full gateway workflow.

Playground tests and API calls can consume account balance or subscription reserves. Use short test prompts first, and check [Usage](account-balance.md#check-balance-and-usage) if you are comparing several models.

Do not share generated playground URLs. The console can include session information in the playground link so the test can run. For durable integrations, use a private API key stored in `AIVAX_API_KEY` or in a secret manager instead of relying on a browser session.

## Use integration examples safely

The **View integration code** dialog shows examples for Python, JavaScript, and curl. The examples use an environment variable for the API key instead of printing a real key in the code block. The console may show the `/api/v1` endpoint alias; for SDK configuration, the canonical OpenAI-compatible base URL is `https://inference.aivax.net/v1`.

Before running an example:

1. Create or choose a private API key for the integration.
2. Store it in an environment variable or secret manager as `AIVAX_API_KEY`.
3. Confirm the model name matches the model you selected.
4. Start with a small prompt.
5. Move reusable behavior into an AI Gateway when the prompt, model, tools, RAG, or output rules become product configuration.

Do not paste API keys into the code examples or commit them to source control. For API key guidance, see [Manage API keys](account-balance.md#manage-api-keys) and [Authentication](/docs/authentication).

## Common decisions

### Direct model or AI Gateway?

Use a direct model when the request is simple and fully controlled by your application. Use an AI Gateway when you want to reuse instructions, attach RAG collections, enable tools, enforce output behavior, connect chat clients, expose an MCP tool, or change model settings without redeploying your app.

### Fast model or high-intelligence model?

Use a faster model for interactive support, classification, routing, extraction, and high-volume tasks with clear success criteria. Use a higher-intelligence model for ambiguous analysis, coding, long context, multi-step reasoning, and tasks where answer quality matters more than latency.

### Cheapest model or subscription-included model?

Use the price filter when the workflow is paid per token and cost is mostly driven by output volume. Use the subscription filter when your plan includes reserve usage and the selected model's usage multiplier fits the workload. Always validate with real prompts because retries and long outputs can change the effective cost.

### Stable, preview, deprecated, or router model?

Use stable models for production. Use preview models for evaluation and controlled experiments. Treat deprecated models as migration targets: find a replacement and update gateways or applications before removal. Router models can be useful when you want AIVAX to route within a model family, but validate behavior against your own prompts before depending on them.

## Troubleshooting

### The model list is empty

Clear the search field and reset filters to **All speeds**, **All intelligences**, **All prices**, and **All models**. If the list is still empty, refresh the page and confirm the account is authenticated.

### A model does not work with my prompt

Check the model's capabilities first. If the request includes images, audio, video, files, tools, JSON functions, or long context, the selected model must support that requirement or the gateway must use AIVAX pre-processing or another model path that does.

### A model is available in the catalog but fails in production

Check, in order: account balance, plan access, request limits, context size, required capabilities, model stability or deprecation status, API key validity, and gateway settings. Then test a simple direct prompt with the same model. If the same direct prompt works but the gateway fails, review the gateway's model name, base address, RAG collections, tools, workers, and output settings.

### A model became deprecated

Open Models, search for the provider or model family, and choose a replacement with comparable capabilities, context size, speed, and price. Update AI Gateways first, then direct integrations. If deprecated-model notifications are enabled, the account can email you when recently used models become deprecated.

## Reference

OpenAI-compatible model listing API reference:

The reference below documents the API model-listing surface used by integrations. It is not the same rich catalog payload rendered by the dashboard Models page, which includes UI-oriented metadata such as pricing tiers, flags, relative speed, relative intelligence, and action menus.

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Related documentation:

- [Inference](/docs/inference/inference): call models through the OpenAI-compatible chat completions API.
- [AI Gateways](/docs/inference/ai-gateway): turn model selection into reusable assistant configuration.
- [Plans and limits](/docs/limits): understand plan access, rate limits, context limits, and subscription reserves.
- [Pricing](/docs/pricing): understand model usage, balance, and storage billing.
