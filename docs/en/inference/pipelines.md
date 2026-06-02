# AI Pipelines

AIVAX provides several pipelines to use in your AI gateway.

You can use multiple pipelines to run in the context of your gateway.

## RAG

Through [collections](/docs/en/rag/collections), you can link document collections to your AI gateway. You can set embedding parameters such as number of documents, minimum score, and embedding strategy.

Each embedding strategy is more refined than the other. Some produce better results than others, but it is important to perform practical tests with various strategies to understand which fits best with the model, conversation, and user tone.

You may need to adjust the system prompt to better inform how the AI should consider the attached documents in the conversation. The documents are attached as a user message, limited to the parameters you define in the retrieval strategy.

Rewrite strategies usually generate the best results at a low latency and cost. The rewrite model used is always the cheapest one, normally chosen by an internal pool that decides which model has the lowest latency at the moment.

Strategies without rewrite cost:

- `Plain`: the default strategy. It is the least optimized and has no rewrite cost: the last user message is used as a search term to query the attached collection of the gateway.
- `Concatenate`: Concatenates the last N user messages line by line, and then the concatenated result is used as a search term.

Strategies with rewrite cost (inference tokens are charged):

- `UserRewrite`: rewrites the last N user messages using a smaller model, creating a contextualized question of what the user means.
- `FullRewrite`: rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers assistant messages when formulating the new question. Generally creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. Works with any model.

Function strategies:

- `QueryFunction`: provides a search function on the integrated collection for the AI model. You should adjust the system instructions with ideal scenarios for the model to call this function when needed. May not work well on smaller models.

When defining an RAG collection in your gateway pipeline, the first message of the conversation context will be the result of the RAG embedding as a user message (except when used as tools where the embedding result is attached as a tool response).

Defining many RAG response documents increases input token consumption and may increase the final inference cost.

## Fixing instructions

The instructions pipeline allows prefixing instructions in various places of the model, guiding and restricting the model's response format.

Current ways to define instructions are:
- **System instructions**: inserts a fixed text into the system prompt of the context.
- **User prompt template**: reformats the user's question to follow a specific question format.
- **Assistant initialization (prefill)**: initializes the assistant's message with initial generation tokens.

These parameters can be very useful for prompt engineering, however, they may not be compatible with all models.

Note: prefixing instructions, templates, and initializations can remove the model's reasoning, multi-modal interpretation, and tool calling capabilities.

## Remote instructions

You can also provide **remote** instructions in the context. Remote instructions make a GET request to the supplied resource and cache it internally for 10 minutes. These resources are read as text, limited to 10 MB per resource.

These resources are inserted into the LLM system instructions.

## Skills

Skills are on-demand instructions provided to the model, which can obtain refined and enhanced instructions for different specialized tasks.

Read more about [skills](/docs/en/features/skills).

## Multi-modal processing

Multi-modal content pre-processing allows processing audio, images, videos, and documents using models with those capabilities for models that lack them.

Each multi-modal content is converted to a textual representation of itself through an auxiliary model.

This processing is done by a multi-modal model, which incurs processing cost directly from the provider. The generated content is stored in a long‑term cache on our servers and is evicted after a certain period of inactivity. After that period, the content tends to be re‑processed if inserted again into the conversation.

## Parameterization

The parameterization pipeline configures the initial inference hyper‑parameters such as temperature, nucleus sampling, presence penalty, and other inference hyper‑parameters.

## Truncating

The truncating pipeline allows defining the size of a conversation in tokens before it is cut off.

When this pipeline is enabled, before each inference, it checks whether `num_of_chars / 4` is greater than the maximum input tokens for the conversation. If the context is larger, the pipeline starts removing messages from the beginning of the conversation until the messages fit within the specified context.

At least one user message (usually the last message) is kept in the conversation. All other messages are removed, except system instructions.

Alternatively, you can set that reaching the limit triggers an error in the API instead of cutting the context.

## Tool message truncating

The tool message counting pipeline is similar to truncating: it removes older tool responses and preserves only the newest ones.

This can be useful when earlier tool responses are no longer helpful in later messages and take up context space, but it can be detrimental when used with agentic models that call tools in chains.

This pipeline is configured by the number of tool messages to preserve rather than tokens. When a tool message is considered old, it is not removed, but its content is removed.

## Server‑side tools

This pipeline allows execution of server‑side tools of AIVAX, similar to the MCP protocol.

Read more about this pipeline [here](/docs/en/tools/protocol-functions).

## Built‑in tools

You can add tools provided by AIVAX to your gateway, such as web search, image generation, and link access. See all available tools [here](/docs/en/tools/builtin-tools).

## Function interpreter (tool handler)

It is possible to change the function interpreter used by the model. This brings the ability to add **function calling** capability for models that do not support this feature.

Currently, there are two types of interpreters:
- ReAct: an interpreter based on the [ReAct prompting](https://www.promptingguide.ai/techniques/react) technique using an auxiliary model. The `react.v1.selfcall` interpreter uses the inference model itself to call functions before generating a response.
- NtvCall: uses another model to call functions for the main model. The flow resumes when the alternative model does not call any function and starts generating a response.

## Moderation

You can add a moderation layer to your AI gateway. An auxiliary model will analyze the entire conversation context and classify it as safe or unsafe according to your moderation preferences.

Conversations classified as unsafe are removed from inference and the model tends to generate a response indicating it cannot generate content about that topic.

The moderation cost is **$0.20** per million processed tokens.

## Workers

Workers define the behavior of your gateway remotely, used to control when certain events should be aborted or continued.

Read more about this pipeline [here](/docs/en/inference/workers).