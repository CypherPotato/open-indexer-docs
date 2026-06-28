# AI Gateways

Use **AI Gateways** to turn a model into a reusable assistant configuration. A gateway stores the model, provider connection, instructions, RAG collections, skills, tools, MCP sources, moderation, workers, context controls, and tuning parameters that AIVAX applies whenever the gateway is called.

This page is for builders and operators who manage assistant behavior from the console. For the technical gateway model and API behavior, see [AI Gateway](/docs/inference/ai-gateway).

## Before you begin

Sign in to the [AIVAX console](https://console.aivax.net/) and open **Dashboard > AI Gateways**. Confirm the active account before editing a gateway. Gateway changes can immediately affect applications, chat clients, MCP clients, batch workflows, and integrations that call the gateway by slug or ID.

Before changing a production gateway, identify:

- Which app, chat client, workflow, or MCP client calls it.
- Whether callers use the gateway slug or full gateway ID.
- Which model capabilities are required, such as tools, image input, RAG, structured output, or long context.
- Whether the gateway currently has active conversations or production traffic.

## When to use a gateway

Use a gateway when behavior should be stable and centrally managed. A gateway is the right place for decisions that should not be repeated in every API request:

- Model name and provider connection.
- System instructions and prompt template.
- RAG collections and retrieval strategy.
- Skills and tool visibility.
- Built-in tools, MCP sources, protocol functions, raw tool definitions, and Bash settings.
- Sampling, reasoning, verbosity, and context controls.
- Moderation thresholds and worker webhooks.

Use a direct model call instead when you only need a simple one-off prompt or an internal test where the application owns every option.

## Find and open a gateway

The AI Gateways list shows each gateway with:

| Column | Meaning |
| --- | --- |
| **Id.** | Short display form of the gateway ID. Copy the full ID when you need a stable identifier. |
| **Name** | Friendly name shown in the console. |
| **Base model** | The model configured for the gateway. |
| **Base address** | Integrated inference or the external OpenAI-compatible provider endpoint. |
| **Slug** | Human-readable model value that private-key callers can use in chat completions. |
| **Actions** | Opens the gateway editor. |

Use the filter box to search across gateway columns. Open **View** to inspect or edit the gateway.

## Create a gateway

You can create a gateway from the AI Gateways page with **New AI gateway**, or from a model card in **Models > Create gateway**.

At minimum, configure:

1. **Gateway name:** A clear name that identifies purpose and environment.
2. **Gateway model name:** The integrated model or routed model value.
3. **Base address:** Use integrated inference for AIVAX-hosted models, or an OpenAI-compatible base URL for external providers.
4. **API key:** Required only when the gateway calls an external provider that needs one.
5. **Instructions:** The assistant's role, boundaries, source of truth, and response style.

Select **Create AI gateway** or **Save changes** only after reviewing the pipeline preview. For production, start with the smallest working configuration, test it, then add RAG, tools, skills, moderation, and workers deliberately.

## Choose integrated or external inference

The **Inference** tab controls how the gateway reaches the model.

| Choice | Use it when | Base address | API key |
| --- | --- | --- | --- |
| **Integrated inference** | You want AIVAX to call an integrated model from the catalog. | Integrated inference, represented internally as `@integrated`. | Not required for the model provider. |
| **External OpenAI-compatible provider** | You bring your own provider endpoint or model. | Provider base URL compatible with the OpenAI chat-completions interface. | Required when the provider requires authentication. |
| **Model router** | You want the gateway to route by request complexity. | Integrated routing model. | Configure low, medium, and high complexity models and reasoning effort where supported. |

Before saving, verify that the selected model supports the gateway's required behavior. Tool-heavy gateways need reliable tool calling. Multimodal gateways need the required input modality or a preprocessing plan. Structured-output gateways need compatible schema behavior. RAG gateways need enough context for retrieved documents plus the user conversation.

## Understand the editor tabs

The gateway editor is organized by configuration area:

| Tab | Use it for |
| --- | --- |
| **Gateway** | Name and high-level pipeline structure. |
| **Inference** | Model name, integrated or external provider connection, API key, and model-router parameters. |
| **RAG** | Collections, query strategy, reranker, result count, minimum score, rewrite windows, and metadata presentation. |
| **Skills** | Skills attached to the gateway, whether tools are hidden unless selected by a skill, and tools that should stay visible. |
| **Instructions** | System instructions, remote instruction sources, user prompt template, assistant prefill, stop text, and prefilling behavior. |
| **Parameters + Tuning** | Temperature, top-p, penalties, reasoning effort, verbosity, max tokens, context length, multimodal preprocessing, and tool-message limits. |
| **Tools + MCP** | MCP sources, protocol functions, raw tools, built-in tools, Bash environment, web search, memory, image generation, and advanced JSON settings. |
| **Moderation** | Thresholds for violence/hate, sexual content, politics, dangerous content, and jailbreak attempts. |
| **Workers** | External worker URL that can control gateway events before the final action happens. |

Use **Hide disabled steps** when you want to focus on enabled pipeline parts. Leave it off when you are auditing a gateway and need to see which capabilities are intentionally disabled.

## Review high-impact settings

Before saving a production gateway, review:

- Model name, base address, and provider API key.
- RAG collections, query strategy, result count, minimum score, and reranker.
- System instructions, prompt template, assistant prefill, and stop text.
- Tool, MCP, protocol-function, raw-tool, and Bash exposure, especially write-capable tools.
- Skills, hidden tools, and always-visible tools.
- Context length, max tokens, reasoning effort, verbosity, and tool-message limits.
- Multimodal preprocessing and selected media types.
- Moderation thresholds and worker URL.
- Generated integration, MCP, and playground snippets before sharing them.
- Conversation logs after testing.

## Configure RAG carefully

Attach RAG collections when the assistant must answer from account-owned documents. Choose the query strategy based on the conversation:

- **Plain:** Uses the latest user message as the search query.
- **Concatenate:** Joins recent messages into the query.
- **User rewrite:** Rewrites recent user messages before searching.
- **Full rewrite:** Rewrites recent user and assistant context before searching.
- **Query function:** Gives the model a search tool instead of injecting results automatically.

Tune **Maximum results** and **Minimum score** together. More results can improve recall but increase token use and noise. Higher minimum scores reduce irrelevant context but can hide useful documents if the collection quality is uneven. Test retrieval before using the gateway in production.

## Configure tools and MCP deliberately

Gateway tools can let the model search the web, open URLs, execute code, call HTTP endpoints, generate images or documents, remember information, use calendar-like memory, call MCP servers, or call protocol functions.

Enable only tools that have a clear job in the assistant. Each extra tool increases prompt size, cost, and the chance of a wrong tool call. If tool selection becomes unreliable, use skills, always-visible tools, or hide tools without skills to narrow what the model can see.

Treat external tools and MCP sources as integrations. Validate authentication, authorization, and expected arguments on the receiving side. Do not expose write-capable tools to untrusted users without application-level approval rules. For built-in tool behavior, see [Built-in tools](/docs/tools/builtin-tools).

## Use options safely

Generated code and playground links can contain credentials. **View integration code** expects you to provide `AIVAX_API_KEY` from an environment variable. **View MCP code** can include the current session key in the generated `Authorization` header. **Run in playground** can place key material in the generated playground URL. Replace real values with `YOUR_AIVAX_API_KEY` or an environment variable before sharing, committing, or pasting snippets into support tools. If a real key or session-bearing URL was exposed, rotate or revoke the affected credential.

The **Options** menu includes:

| Action | Use it for |
| --- | --- |
| **View integration code** | Copy Python, JavaScript, or curl examples for `/v1/chat/completions` using the gateway slug or ID. |
| **View MCP code** | Configure the gateway as an MCP tool through `/v1/mcp/inference`. |
| **Run in playground** | Test the gateway interactively in the AIVAX playground. |
| **Copy model slug** | Copy the gateway slug for private-key callers. |
| **Copy ID** | Copy the full gateway ID. |
| **Import from JSON** | Replace the editor's current gateway fields from a JSON configuration. Review and save to persist. |
| **Export to JSON** | Copy the current gateway configuration for backup, review, or migration. |
| **View conversation logs** | Open conversation logs filtered to this gateway. |
| **Delete gateway** | Remove the gateway. This can break callers that use its slug or ID. |

Before importing or deleting a production gateway:

1. Export the current gateway JSON.
2. Copy the gateway ID and slug.
3. Review conversation logs for recent activity.
4. Identify callers that use the slug or full ID.
5. Test the replacement or imported configuration in a separate gateway when possible.
6. Save or delete only after callers and rollback are understood.

Importing JSON changes the editor state first. It is not persisted until you save. After import, review sensitive fields, external URLs, tool definitions, workers, and provider keys before saving.

## Test before production

Before using a gateway in production:

1. Send a simple direct message through the gateway.
2. Test the main user task with realistic input.
3. If RAG is enabled, test retrieval quality and references with [Semantic search](/docs/rag/semantic-search).
4. If tools are enabled, verify the model chooses the right tool and the receiver validates requests.
5. If moderation or workers are enabled, test allowed and blocked examples. For worker behavior, see [AI workers](/docs/inference/workers).
6. Check [Usage](account-balance.md#check-balance-and-usage), Analytics, Logs, and Conversations for errors, cost, and unexpected behavior.

## Troubleshooting

| Symptom | Check | Fix |
| --- | --- | --- |
| Gateway call returns `401` or `403` | API key, public/private key type, caller permissions, and whether the caller uses a gateway slug that public keys cannot resolve. | Use a valid private key for administrative or slug-based calls, or use the full gateway ID where required. |
| Gateway call returns `402` | Account balance, storage quota, and route-specific minimums in Usage. | Top up balance, reduce storage, or lower-cost model/tool usage. |
| Gateway call returns `429` | Account plan, model rate limits, tool limits, and batch/chat-client volume. | Reduce request rate, choose a different model path, or upgrade plan. |
| External provider call fails | Base address, provider API key, model name, provider rate limits, and provider response errors. | Test the provider credentials separately, then update the gateway inference settings. |
| RAG answers are missing or irrelevant | Attached collections, indexing state, query strategy, reranker, maximum results, minimum score, references, and system instructions. | Test the collection directly, compare `Plain` with rewrite strategies, adjust score/result limits deliberately, then retest through the gateway. |
| Tool calls are wrong or noisy | Enabled tools, MCP sources, raw tools, skills, always-visible tools, and tool instructions. | Reduce the tool set, use skills to narrow visible tools, and document when each tool should be used. |
| Worker or callback rejects AIVAX | Account hook key, `X-Request-Nonce` validation, callback URL, worker deployment, and timeout behavior. | Update the receiver to validate the current hook key, redeploy or reprovision affected workers, and retry a controlled request. See [Hook authentication](/docs/authentication#hook-authentication). |
| Users still hit an old configuration | Caller model value, gateway slug, full ID, copied playground URL, cached client configuration, and direct model calls that bypass the gateway. | Update every caller that bypasses or pins the old gateway value. |

## Call A Gateway

Gateway chat-completion calls use the standard inference endpoint:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Related documentation:

- [AI Gateway](/docs/inference/ai-gateway): technical gateway behavior and MCP configuration.
- [Models](models.md): choose the base model for a gateway.
- [RAG Collections](/docs/rag/collections): prepare collections before attaching them.
- [Skills](/docs/features/skills): create reusable instruction bundles.
- [MCP functions](/docs/tools/mcp): connect external MCP tools.
- [Protocol functions](/docs/tools/protocol-functions): expose server-side HTTP functions.
