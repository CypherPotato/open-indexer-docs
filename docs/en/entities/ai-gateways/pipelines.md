# AI Pipelines

AIVAX provides several pipelines to use in your AI gateway.

You can use multiple pipelines to run in the context of your gateway.

## RAG

Through [collections](/docs/en/entities/collections), you can link a collection of documents to your AI gateway. You can set the embedding parameters, such as number of documents, minimum score, and embedding strategy.

Each embedding strategy is more refined than the other. Some produce better results than others, but it is important to conduct practical tests with various strategies to understand which fits best with the model, conversation, and user tone.

It may be necessary to adjust the system prompt to better inform how the AI should consider the attached documents in the conversation. The documents are attached as a user message, limited by the parameters you define in the retrieval strategy.

Rewrite strategies usually generate the best results at low latency and cost. The rewrite model used is always the one with the lowest cost, usually chosen by an internal pool that decides which model has the lowest latency at the moment.

### Strategies without rewrite cost:

- `Plain`: the default strategy. It is the least optimized and has no rewrite cost: the last user message is used as the search term to query the gateway's attached collection.
- `Concatenate`: concatenates the last N user messages in lines, and then the result of the concatenation is used as the search term.

### Strategies with rewrite cost (inference tokens are charged):

- `UserRewrite`: rewrites the last N user messages using a smaller model, creating a contextual question about what the user wants to say.
- `FullRewrite`: rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers the assistant's messages when formulating the new question. Usually creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. Works with any model.

### Function strategies:

- `QueryFunction`: provides a search function in the integrated collection for the AI model. You should adjust the system instructions with ideal scenarios for the model to call this function when necessary. May not work as well on smaller models.

When defining a RAG collection in your gateway's pipeline, the first message in the conversation context will be the result of the RAG embedding as a user message (except when used as tools where the embedding result is attached as a tool response).

Defining many RAG response documents increases input token consumption and may increase the final inference cost.

## Fixing instructions

The instruction pipeline allows prefixing instructions in various places of the model, guiding and restricting the model's response format.

The current ways to define instructions are:
- **System instructions**: inserts a fixed text into the system prompt of the context.
- **User prompt template**: reformats the user's question to follow a specific question format.
- **Assistant initialization (prefill)**: initializes the assistant's message with initial generation tokens.

These parameters can be very useful for prompt engineering, however, they may not be compatible with all models.

**Attention**: prefixing instructions, templates, and initializations can remove the model's reasoning, multi‑modal interpretation, and tool‑calling capabilities.

## Parameterization

The parameterization pipeline configures the initial inference hyperparameters, such as temperature, nucleus sampling, presence penalty, and other inference hyperparameters.

## Truncating

The truncating pipeline allows setting the size of a conversation in tokens before it is trimmed.

When this pipeline is enabled, before each inference, it calculates whether `num_of_chars / 4` is greater than the maximum input tokens for the conversation. If the context is larger, the pipeline starts removing messages from the beginning of the conversation until the messages fit within the specified context.

At least one user message (commonly the last message) is kept in the conversation. All other messages are removed, except system instructions.

Alternatively, you can define that when the limit is reached, an error is thrown in the API instead of truncating the context.

## Tool message truncating

The tool message counting pipeline is similar to truncating: it removes older tool responses and preserves only the newest.

This can be useful when previous tool responses are no longer useful in newer messages and occupy space in the context, but can be detrimental when using agentic models that call tools in a chain.

This pipeline is configured in the number of tool messages to be preserved instead of tokens. When a tool message is considered old, it is not removed, but its content is removed.

## Server‑side tools

This pipeline allows execution of AIVAX server‑side tools, similar to the MCP protocol.

Read more about this pipeline [here](/docs/en/protocol-functions).

## Built‑in tools

You can add tools provided by AIVAX to your gateway, such as internet search, image generation, and link access. See all available tools [here](/docs/en/builtin-tools).

## Workers

Workers define the behavior of your gateway remotely, used to control when certain events should be aborted or continued.

Read more about this pipeline [here](/docs/en/entities/ai-gateways/workers).