# AI Gateway

The AI gateways are a service provided by AIVAX to create an inference tunnel between an LLM model and a knowledge base. It is possible to:

- Create a model with customized instructions
- Use a model provided by you through an OpenAI compatible endpoint, or use a model made available by AIVAX
- Customize inference parameters, such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a model ready for use, parameterized and based on the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your AI model, we will only charge for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are more intelligent than others for specific tasks. Some models are better with certain data retrieval strategies than others. Perform tests to find the best model.

You can see the available models on the [models page](/docs/en/models).

## Choosing a search strategy

If you are using a knowledge collection with an AI model, you can choose a strategy that the AI will use to perform an information search. Each strategy is more refined than the other. Some create better results than others, but it is essential to perform practical tests with several strategies to understand which one fits best in the model, conversation, and user tone.

It may be necessary to make adjustments to the system prompt to better inform how the AI should consider the attached documents in the conversation. The documents are attached as a user message, limited to the parameters you define in the retrieval strategy.

Rewriting strategies usually generate the best results at a low latency and cost. The rewriting model used is always the one with the lowest cost, normally chosen by an internal pool that decides which model has the lowest latency at the moment.

Strategies without rewriting cost:

- `Plain`: the standard strategy. It is the least optimized and has no rewriting cost: the user's last message is used as a search term to search the attached collection in the gateway.
- `Concatenate`: concatenates the user's last N messages in lines, and then the result of the concatenation is used as a search term.

Strategies with rewriting cost (inference tokens are charged):

- `UserRewrite`: rewrites the user's last N messages using a smaller model, creating a contextualized question about what the user means.
- `FullRewrite`: rewrites the last N*2 chat messages using a smaller model. Similar to `UserRewrite`, but also considers the assistant's messages in formulating the new question. It usually creates the best questions, with a slightly higher cost. It is the most stable and consistent strategy. It works with any model.

Function strategies:

- `QueryFunction`: provides a search function in the integrated collection for the AI model. You should adjust the system instructions to define the ideal scenarios for the model to call this function when necessary. It may not work as well with smaller models.

## Using an AI gateway

AIVAX provides an endpoint compatible with the OpenAI interface through an AI gateway, which facilitates the integration of the model created by AIVAX with existing applications and SDKs. It is worth noting that only some properties are supported.

In an AI gateway, you already configure the model parameters, such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overwritten by the request.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/chat-completions
    </span>
</div>

```json
{
    "model": "0197cb0f-893a-7b7d-be0a-71ada1208aaf",
    "messages": [
        {
            "role": "user",
            "content": "Who are you?"
        }
    ],
    "stream": false
}
```

#### Response for non-streaming

```json
{
    "id": "0197dbdc-6456-7d54-b7ec-04cb9c80f460",
    "object": "chat.completion",
    "created": 1751740343,
    "model": "@google/gemini-2.5-flash",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "completion_text": "Hi! I am Zia, the intelligent assistant from Zé do Ingresso. I'm here to help you with everything about tickets, events, and everything that happens in our beloved São José do Rio Preto. If you need anything, just call! Let's enjoy everything that's happening together! What do you need? ",
                "refusal": null,
                "annotations": []
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1118,
        "completion_tokens": 88,
        "total_tokens": 1206
    },
    "service_tier": "default"
}
```

#### Streaming response

```text
data: {"id":"0197dbde-c40b-720d-a13e-f689c303c571","object":"chat.completion.chunk","created":1751740498,"model":"@google/gemini-2.5-flash","system_fingerprint":"fp_y8jidd","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant","content":""}}],"usage":null,"sentinel_usage":null}

...

data: {"id":"0197dbde-c88c-7764-8017-c1fee0d79096","object":"chat.completion.chunk","created":1751740500,"model":"@google/gemini-2.5-flash","system_fingerprint":"fp_2he7ot","choices":[{"index":0,"finish_reason":null,"delta":{"content":""}}],"usage":null,"sentinel_usage":null}

data: {"id":"0197dbde-c890-7329-9e65-faecbe158efa","object":"chat.completion.chunk","created":1751740500,"model":"@aivax/sentinel-mini","system_fingerprint":"fp_q6qh7x","choices":[{"index":0,"finish_reason":"STOP","delta":{}}],"usage":{"prompt_tokens":1097,"completion_tokens":92,"total_tokens":1189},"sentinel_usage":null}
```

## Using with SDKs

By providing endpoints compatible with the OpenAI interface, AIVAX is fully compatible with existing SDKs, facilitating plug-and-play integration.

See the example below:

```python
from openai import OpenAI
 
client = OpenAI(
    base_url="https://inference.aivax.net/api/v1",
    api_key="oky_gr5u...oqbfd3d9y"
)
 
response = client.chat.completions.create(
    model="my-gateway:50c3", # you can also provide your ai-gateway full ID here
    messages=[
        {"role": "user", "content": "Explain why AI-gateways are useful."}
    ]
)
 
print(response.choices[0].message.content)
```

At the moment, AIVAX only supports the `chat/completions` format. In the future, we plan to create support for the API Responses.