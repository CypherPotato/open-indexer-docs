# AI Gateway

The AI gateways are a service that the Open Indexer provides to create an inference tunnel between an LLM model and a knowledge base. It is possible to:

- Create a model with customized instructions
- Use a model provided by you through an OpenAI compatible endpoint, or use a model made available by the Open Indexer
- Customize inference parameters, such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a model that is ready for use, parameterized, and based on the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your AI model, we will only charge for the document search attached to the AI.

You can also use one of the models below that are already ready to start with the Open Indexer.

When using a model, you will notice that some are more intelligent than others for certain tasks. Some models are better with certain data acquisition strategies than others. Perform tests to find the best model.

You can view the available models on the [models page](/docs/en/models).

## Choosing a search strategy

If you are using a knowledge collection with an AI model, you can choose a strategy that the AI will use to perform an information search. Each strategy is more refined than the other. Some create better results than others, but it is essential to perform practical tests with several strategies to understand which one fits best in the model, conversation, and user tone.

It may be necessary to make adjustments to the system prompt to better inform how the AI should consider the documents attached to the conversation. The documents are attached as a user message, limited to the parameters you define in the acquisition strategy.

Strategies without rewriting cost:

- `Plain`: the default strategy. It is the least optimized and has no rewriting cost: the last user message is used as a search term to search the attached collection of the gateway.
- `Concatenate`: Concatenates the last N user messages in lines, and then the result of the concatenation is used as a search term.

Strategies with rewriting cost (inference tokens are charged):

- `UserRewrite`: Rewrites the last N user messages using a smaller model, creating a contextualized question about what the user means.
- `FullRewrite`: Rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers the assistant's messages in formulating the new question. It usually creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. It works with any model.

Rewriting strategies normally generate the best results at a low latency and cost. The rewriting model used always has the lowest cost, usually chosen by an internal pool that decides which model has the lowest latency at the moment.

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

        // Endpoint compatible with OpenAI chat/completions, or use @integrated
        // to use a model provided by the Open Indexer.
        "baseAddress": "@integrated",

        // ID of the collection that will be used as the knowledge base by the AI.
        // Can be null.
        "knowledgeCollectionId": "01965b62-17c4-7258-9aa8-af5139799527",

        // Optional. Specifies how many documents should be attached to the AI context.
        "knowledgeBaseMaximumResults": 16,

        // Optional. Specifies the minimum similarity score that the document search should attach to the AI context.
        "knowledgeBaseMinimumScore": 0.55,

        // Optional. Specifies whether document references should be attached to the AI context.
        "knowledgeUseReferences": false,

        // Optional. Specifies the document acquisition strategy. Read "Choosing a search strategy" to learn more.
        "queryStrategy": "UserRewrite",
        
        // Parameters of the acquisition strategy.
        "queryStrategyParameters": {

            // Optional. Specifies the number of messages that should be considered for the UserRewrite and FullRewrite strategies. Note: for FullRewrite, the value is always multiplied by 2 to consider assistant messages.
            "rewriteContextSize": 3,

            // Optional. Specifies the number of user messages that should be concatenated in the search term.
            "concatenateContextSize": 3
        }

        // Optional. Specifies the API key "Authorization: Bearer ..." used in inference. Leave null if using an embedded Open Indexer model.
        "apiKey": null,

        // Required. Specifies the name of the model that will be used in inference.
        "modelName": "@groq/compound-beta",

        // Optional. Specifies the model temperature.
        "temperature": 1.25,
        
        // Optional. Specifies the model's nucleos sampling.
        "topP": null,

        // Optional. Specifies the model's presence penalty.
        "presencePenalty": null,

        // Optional. Specifies a "stop" term for the model.
        "stop": null,

        // Optional. Specifies the maximum number of response tokens for the model.
        "maxCompletionTokens": 4096,

        // Optional. Specifies the system prompt used in the model.
        "systemInstruction": "You are a helpful assistant.",

        // Optional. Transforms the user's question into the indicated format, where "{prompt}" is the user's original prompt.
        "userPromptTemplate": null,
        
        // Optional. Specifies a prefill (initialization) of the assistant's message.
        "assistantPrefill": null,

        // Optional. Specifies whether the assistantPrefill and stop should be included in the message generated by the assistant.
        "includePrefillingInMessages": false,

        // Optional. Specifies special flags for the model. Leave as "0" to not use any flag. The allowed flags are:
        //      NoSystemInstruct: instead of using system prompt, inserts system instructions into a user message
        "flags": "0",

        // Optional. Passes an array of functions to the AI.
        "tools": null
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
            "maxCompletionTokens": 4096,
            "systemInstruction": "[...]",
            "userPromptTemplate": null,
            "assistantPrefill": null,
            "includePrefillingInMessages": false,
            "flags": "0",
            "tools": null
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


## OpenAI Endpoint

The Open Indexer provides an OpenAI compatible endpoint through an AI gateway, which facilitates the integration of the model created by the Open Indexer with existing applications. It is worth noting that only some properties are supported.

In an AI gateway, you already configure the model parameters, such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overwritten by the request.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>/open-ai/v1/chat/completions
    </span>
</div>

```json
{
    // The "model" field is required, but it does nothing in this request. It only exists to be compatible with the Open AI API. You can leave it empty or write anything in its place, as the model considered is the one defined in the AI Gateway.
    "model": "foobar",
    
    // Messages must follow the Open AI format. Only "system" and "user" are supported as conversation "roles".
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello!"
        }
    ],
    
    // Both properties are equivalent and optional, and will replace the maxCompletionTokens field if sent in the request.
    "max_completion_tokens": 1024,
    "max_tokens": 1024,
    
    // Optional. Replaces the gateway parameter.
    "stop": "\n",
    
    // Optional. By default, the response is not streaming.
    "stream": true
}
```


#### Response for non-streaming

```json
{
    "id": "019672f3-699c-7d45-8484-7a23f4cdc079",
    "object": "chat.completion",
    "created": 1745685277,
    "model": "gemini-2.0-flash-lite",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Hi there! How can I help you today?\n",
                "refusal": null,
                "annotations": []
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 0,
        "completion_tokens": 0,
        "total_tokens": 0
    },
    "service_tier": "default"
}
```


#### Response for streaming

```text
data: {"id":"019672f4-9a58-7932-82f0-022e457a2e63","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_2i0nmn","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant","content":"Hi"}}]}

data: {"id":"019672f4-9ab9-73a2-bdb8-23c4481453a8","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_ar1qol","choices":[{"index":0,"finish_reason":null,"delta":{"content":" there! How can I help you today?\n"}}]}

... 

data: {"id":"019672f4-9ac0-7ddf-a76a-e7f8043dd082","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_3e84ge","choices":[{"index":0,"finish_reason":"stop","delta":{}}]}
```