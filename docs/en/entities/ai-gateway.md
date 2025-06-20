# AI Gateway

The AI gateways are a service that the Open Indexer provides to create an inference tunnel between an LLM model and a knowledge base. It is possible to:

- Create a model with customized instructions
- Use a model provided by you through an OpenAI compatible endpoint, or use a model made available by the Open Indexer
- Customize inference parameters, such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a model ready for use, parameterized and based on the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your AI model, we will only charge for the document search attached to the AI. You can also use one of the models below that are already ready to start with the Open Indexer.

When using a model, you will notice that some are more intelligent than others for certain tasks. Some models are better with certain data acquisition strategies than others. Perform tests to find the best model.

You can view the available models on the [models page](/docs/en/models).

## Choosing a search strategy

If you are using a knowledge collection with an AI model, you can choose a strategy that the AI will use to search for information. Each strategy is more refined than the other. Some create better results than others, but it is essential to perform practical tests with several strategies to understand which one fits best in the model, conversation, and user tone.

It may be necessary to make adjustments to the system prompt to better inform the AI how to consider the documents attached to the conversation. The documents are attached as a user message, limited to the parameters you define in the acquisition strategy.

Rewrite strategies usually generate the best results at a low latency and cost. The rewrite model used always has the lowest cost, usually chosen by an internal pool that decides which model has the lowest latency at the moment.

Strategies without rewriting cost:

- `Plain`: the default strategy. It is the least optimized and has no rewriting cost: the last user message is used as a search term to search the attached collection of the gateway.
- `Concatenate`: concatenates the last N user messages in lines, and then the result of the concatenation is used as a search term.

Strategies with rewriting cost (inference tokens are charged):

- `UserRewrite`: rewrites the last N user messages using a smaller model, creating a contextualized question of what the user wants to say.
- `FullRewrite`: rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers the assistant's messages in formulating the new question. It usually creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. It works with any model.

Strategy functions:

- `QueryFunction`: provides a search function in the integrated collection for the AI model. You should adjust the system instructions to the ideal scenarios for the model to call this function when necessary. It may not work as well in smaller models.

## Using AI functions (tools)

At the moment, it is not possible to specify function calls through our API, either through the AI-Gateway or the OpenAI compatible API. This feature is on our radar for future implementation.

If this is critical for your AI model to work, you can use the [document search API](/docs/en/search) in your model.

## Creating an AI gateway

If you are using a model provided by you, have the following in hand:

- The base address compatible with the OpenAI API
- The API key of the endpoint (if applicable)
- The name of the inference model.

It is not necessary to have a collection to link to your AI gateway. You can create an AI gateway and link a knowledge base to it later.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    // Name of the gateway to identify it later.
    "name": "my-gateway-model",
    
    "parameters": {

        // Required. Endpoint compatible with OpenAI chat/completions, or use @integrated
        // to use a model provided by the Open Indexer.
        "baseAddress": "@integrated",

        // Required. Specifies the name of the model that will be used in inference.
        "modelName": "@groq/compound-beta",
        
        // Optional. ID of the collection that will be used as the knowledge base by the AI.
        "knowledgeCollectionId": "01965b62-17c4-7258-9aa8-af5139799527",
        
        // Optional. Specifies how many documents should be attached to the AI context.
        "knowledgeBaseMaximumResults": 16,
        
        // Optional. Specifies the minimum similarity score that the document search should attach to the AI context.
        "knowledgeBaseMinimumScore": 0.55,

        // Optional. Specifies whether document references should be attached to the AI context.
        "knowledgeUseReferences": false,

        // Optional. Specifies the document acquisition strategy. Read "Choosing a search strategy" to learn more.
        "queryStrategy": "UserRewrite",
        
        // Optional. Parameters of the acquisition strategy.
        "queryStrategyParameters": {

            // Optional. Specifies the number of messages that should be considered for the UserRewrite and FullRewrite strategies. Note: for FullRewrite, the value is always multiplied by 2 to consider assistant messages.
            "rewriteContextSize": 3,

            // Optional. Specifies the number of user messages that should be concatenated in the search term.
            "concatenateContextSize": 3
        }

        // Optional. Specifies the API key "Authorization: Bearer ..." used in inference. Leave null if using an embedded AIVAX model.
        "apiKey": null,
        
        // Optional. Specifies the model temperature.
        "temperature": 1.25,
        
        // Optional. Specifies the model's nucleos sampling.
        "topP": null,

        // Optional. Specifies the presence penalty of model tokens.
        "presencePenalty": null,

        // Optional. Specifies a "stop" term for the model.
        "stop": null,

        // Optional. Specifies the maximum response tokens of the model.
        "maxCompletionTokens": 4096,
        
        // Optional. Specifies the system-prompt used in the model.
        "systemInstruction": "You are a friendly assistant.",

        // Optional. Transforms the user's question into the indicated format, where "{prompt}" is the user's original prompt.
        "userPromptTemplate": null,
        
        // Optional. Specifies a prefill (initialization) of the assistant's message.
        "assistantPrefill": null,

        // Optional. Specifies whether the assistantPrefill and stop should be included in the message generated by the assistant.
        "includePrefillingInMessages": false,
        
        // Optional. Specifies special flags for the model. Leave as "0" to not use any flag. The allowed flags are:
        //      NoSystemInstruct: instead of using system prompt, inserts system instructions in a user message
        "flags": ["Flag1", "Flag2"],
        
        // Optional. Passes an array of functions to the AI.
        "tools": [],
        
        // Optional. Activates protocol functions for Sentinel models. Read "Protocol Functions" to learn more.
        "protocolFunctions": [
            {
                "name": "get-weather",
                "description": "Use this function to get weather data for the informed location.",
                "callbackUrl": "https://my-service.com/ai-service",
                "contentFormat": {
                    "location": "city name"
                }
            }
        ],
        
        // Optional. Provides endpoints where the model can obtain protocol functions Sentinel. Read "Protocol Functions" to learn more.
        "protocolFunctionSources": [
            "https://my-external-api.com/api/scp/listings"
        ]
    }
}
```

#### Response

```json
{
    "message": null,
    "data": {
        "aiGatewayId": "01965b64-a8eb-716c-892d-880159a9f12d"
    }
}
```

## Editing an AI gateway

The request body is basically the same as the create AI gateway endpoint. Instead of using POST, use PATCH.

#### Request

<div class="request-item patch">
    <span>PATCH</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": "Gateway edited.",
    "data": null
}
```

## Using an AI gateway

The endpoint for conversing with an AI gateway is simple: it only expects the conversation. You can receive the response at once or by streaming.

#### Request

<div class="request-item patch">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>/inference
    </span>
</div>

```json
{
    "messages": [
        {
            "role": "user",
            "content": "How can I turn on my Civic 2015?"
        }
    ],
    "stream": true
}
```

#### Response for stream=true

The streaming response is based on server-sent events. The first line is always a response with debugging information.

```text
data: {"content":"","isFirstChunkMetadata":true,"embeddedDocuments":[],"debugInfo":[{"name":"EmbeddingTimeMs","value":7.5045},{"name":"InferenceTimeMs","value":0},{"name":"ElapsedTotalMs","value":8.3489},{"name":"KnowledgeQueryText","value":null}]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}
... 

data: [END]
```

#### Response for stream=false

```json
{
    "message": null,
    "data": {
        "generatedMessage": "[...]",
        "embeddedDocuments": [],
        "debugInfo": [
            {
                "name": "EmbeddingTimeMs",
                "value": 4140.8628
            },
            {
                "name": "InferenceTimeMs",
                "value": 4140.803
            },
            {
                "name": "ElapsedTotalMs",
                "value": 4141.4771
            },
            {
                "name": "KnowledgeQueryText",
                "value": null
            }
        ]
    }
}
```

## Viewing an AI gateway

The request below brings details of an AI gateway.

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": {
        "name": "my-gateway-client",
        "parameters": {
            "baseAddress": "@integrated",
            "knowledgeCollectionId": "01965b54-7fbd-70cd-982b-604de002ac0a",
            "knowledgeBaseMaximumResults": 16,
            "knowledgeBaseMinimumScore": 0.55,
            "knowledgeUseReferences": false,
            "queryStrategy": "ToolCall",
            "queryStrategyParameters": {
                "rewriteContextSize": 3,
                "concatenateContextSize": 3
            },
            "apiKey": null,
            "modelName": "@google/gemini-2.0-flash-lite",
            "temperature": 1.25,
            "topP": null,
            "presencePenalty": null,
            "stop": null,
            ...
        }
    }
}
```

## Deleting an AI gateway

Permanently removes an AI gateway.

> [!WARNING]
>
> When removing an AI gateway, all associated chat clients are also removed. Collections are not removed.

#### Request

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": "AI gateway deleted.",
    "data": null
}
```