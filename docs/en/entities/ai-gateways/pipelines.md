# AI Pipelines

AIVAX provides several pipelines to use in your AI gateway.

You can use multiple pipelines to run in the context of your gateway.

## RAG

Through [collections](/docs/en/entities/collections), you can link a collection of documents to your AI gateway. You can define embedding parameters such as number of documents, minimum score, and embedding strategy.

Each embedding strategy is more refined than the others. Some produce better results than others, but it is important to conduct practical tests with various strategies to understand which fits best with the model, conversation, and user tone.

It may be necessary to adjust the system prompt to better inform how the AI should consider the documents attached to the conversation. The documents are attached as a user message, limited by the parameters you set in the retrieval strategy.

Rewrite strategies usually generate the best results at low latency and cost. The rewrite model used is always the cheapest one, typically chosen by an internal pool that selects the model with the lowest latency at the moment.

Strategies without rewrite cost:

- `Plain`: the default strategy. It is the least optimized and has no rewrite cost: the last user message is used as the search term to query the gateway's attached collection.
- `Concatenate`: concatenates the last N user messages in lines, and then the concatenated result is used as the search term.

Strategies with rewrite cost (inference tokens are charged):

- `UserRewrite`: rewrites the last N user messages using a smaller model, creating a contextual question about what the user wants to say.
- `FullRewrite`: rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers the assistant's messages when formulating the new question. Generally creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. Works with any model.

Function strategies:

- `QueryFunction`: provides a search function over the integrated collection for the AI model. You should adjust the system instructions with ideal scenarios for the model to call this function when needed. May not work as well with smaller models.

When defining a RAG collection in your gateway's pipeline, the first message in the conversation context will be the result of the RAG embedding as a user message (except when used as tools where the embedding result is attached as a tool response).

Defining many RAG response documents increases input token consumption and can raise the final inference cost.

## Fixing Instructions

The instruction pipeline allows prefixing instructions in various places of the model, guiding and restricting the model's response format.

Current ways to define instructions are:
- **System instructions**: inserts a fixed text into the system prompt of the context.
- **User prompt template**: reformats the user's question to follow a specific question format.
- **Assistant initialization (prefill)**: initializes the assistant's message with initial generation tokens.

These parameters can be very useful for prompt engineering, however, they may not be compatible with all models.

Note: prefixing instructions, templates, and initializations can remove the model's reasoning ability, multimodal interpretation, and tool-calling capabilities.

## Multimodal Processing

Multimodal content pre‑processing allows processing audio, images, video, and documents using models with those capabilities for models that lack them.

The generated content is stored in a long‑term cache on our servers and is evicted after a period of inactivity. After that period, the content tends to be re‑processed if inserted into the conversation again.

Each multimodal content piece is converted to a textual representation of it via an auxiliary model.

The cost of this processing is **$0.10** per million input tokens and **$0.40** per million output tokens.

## Parameterization

The parameterization pipeline configures the initial inference hyper‑parameters, such as temperature, nucleus sampling, presence penalty, and other inference hyper‑parameters.

## Truncating

The truncating pipeline allows setting a token size limit for a conversation before it is trimmed.

When this pipeline is enabled, before every inference it checks whether `num_of_chars / 4` exceeds the maximum input tokens for the conversation. If the context is larger, the pipeline starts removing messages from the beginning of the conversation until the messages fit within the specified context.

At least one user message (usually the last one) is kept in the conversation. All other messages are removed, except system instructions.

Alternatively, you can configure it so that reaching the limit triggers an error in the API instead of trimming the context.

## Tool Message Truncating

The tool‑message counting pipeline is similar to truncating: it removes older tool responses and preserves only the newest ones.

This can be useful when earlier tool responses are no longer helpful in newer messages and occupy context space, but it can be detrimental when using agentic models that call tools in chains.

This pipeline is configured by the number of tool messages to preserve rather than by tokens. When a tool message is considered old, it is not removed, but its content is cleared.

## Server‑Side Tools

This pipeline enables execution of AIVAX server‑side tools, similar to the MCP protocol.

Read more about this pipeline [here](/docs/en/protocol-functions).

## Built‑in Tools

You can add tools provided by AIVAX to your gateway, such as internet search, image generation, and link access. See all available tools [here](/docs/en/builtin-tools).

## Function Interpreter

It is possible to change the function interpreter used by the model. This adds the ability to **call functions** for models that do not support this feature.

Currently, there are two types of interpreters:
- ReAct: an interpreter based on the [ReAct prompting](https://www.promptingguide.ai/techniques/react) technique using an auxiliary model. The `react.v1.selfcall` interpreter uses the inference model itself to call functions before generating a response.
- NtvCall: uses another model to call functions for the main model. The flow resumes when the alternative model does not call any function and starts generating a response.

## Moderation

You can add a moderation layer to your AI gateway. An auxiliary model will analyze the entire conversation context and classify it as safe or unsafe according to your moderation preferences.

Conversations classified as unsafe are removed from inference and the model tends to generate a response indicating it cannot produce content on that subject.

The moderation cost is **$0.20** per million processed tokens.

## Workers

Workers define the behavior of your gateway remotely, used to control when certain events should be aborted or continued.

Read more about this pipeline [here](/docs/en/entities/ai-gateways/workers).