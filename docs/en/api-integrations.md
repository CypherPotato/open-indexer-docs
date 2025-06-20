# API Interfaces

You can use AIVAX inference with an existing API/SDK, making a plug-and-play service swap. Note that some interfaces have limitations regarding agent and assistant customization.

## OpenAI Compatible Interface

Open Indexer provides an endpoint compatible with the OpenAI interface through an AI-gateway, making it easier to integrate the model created by Open Indexer with existing applications. It is worth noting that only some properties are supported.

In an AI gateway, you already configure the model parameters, such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overridden by the request.

The API prefix is:

```text
https://inference.aivax.net/api/v1/open-ai
```

Currently, the following endpoints are compatible with the OpenAI API:

- `/chat-completions`
- `/models`

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/open-ai/chat-completions
    </span>
</div>

```json
{
    // In the model field, enter the ID of your AI gateway or in the format "gateway-name:part-of-id"
    "model": "019709af-c909-7545-bb5d-1e08da93400a",
    
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
    
    // Both properties are equivalent and optional and will replace the maxCompletionTokens field if sent in the request.
    "max_completion_tokens": 1024,
    "max_tokens": 1024,
    
    // Optional. Replaces the gateway parameter.
    "stop": "\n",
    
    // Optional. By default, the response is not streaming.
    "stream": true
}
```

#### Response for Non-Streaming

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


#### Response for Streaming

```json
data: {"id":"019672f4-9a58-7932-82f0-022e457a2e63","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_2i0nmn","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant","content":"Hi"}}]}

data: {"id":"019672f4-9ab9-73a2-bdb8-23c4481453a8","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_ar1qol","choices":[{"index":0,"finish_reason":null,"delta":{"content":" there! How can I help you today?\n"}}]}

...

data: {"id":"019672f4-9ac0-7ddf-a76a-e7f8043dd082","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_3e84ge","choices":[{"index":0,"finish_reason":"stop","delta":{}}]}
```

## Ollama Compatible Interface

AIVAX also provides an endpoint compatible with various Ollama routes.

The API prefix is:

```text
https://inference.aivax.net/api/v1/ollama
```

The available endpoints are:

- `/`
- `/api/tags`
- `/api/chat` (only streaming)