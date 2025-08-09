# AI Gateway

The AI gateways are a service that AIVAX provides to create an inference tunnel between an LLM model and a knowledge base. With it you can:

- Create a model with custom instructions
- Use a model provided by you through a compatible OpenAI endpoint, or use a model provided by AIVAX
- Customize inference parameters such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a ready‑to‑use model, parameterized and based on the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your own AI model, we will only charge for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are smarter than others for certain tasks. Some models are better with certain data retrieval strategies than others. Run tests to find the best model.

You can see the available models on the [models page](/docs/en/models).

## Using an AI gateway

AIVAX provides an endpoint compatible with the OpenAI interface through an AI gateway, which makes it easier to integrate the model created by AIVAX with existing applications and SDKs. Note that only some properties are supported.

In an AI gateway, you already configure model parameters such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overridden by the request.

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

#### Response for non‑streaming

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
                "completion_text": "Hi! 😊 I am Zia, the smart assistant of Zé do Ingresso. I'm here to help you with everything about tickets, events, and everything happening in our beloved São José do Rio Preto. If you need anything, like learning about the naming of the thing, just ask! Let's enjoy everything that's happening! What do you need? 🥳 ",
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

data: {"id":"0197dbde-c890-7329-9e65-faecbe158efa","object":"chat.completion.chunk","created":1751740500,"model":"@aivax\/sentinel-mini","system_fingerprint":"fp_q6qh7x","choices":[{"index":0,"finish_reason":"STOP","delta":{}}],"usage":{"prompt_tokens":1097,"completion_tokens":92,"total_tokens":1189},"sentinel_usage":null}
```

## Usage with SDKs

By providing endpoints compatible with the OpenAI interface, AIVAX is fully compatible with existing SDKs, making plug‑and‑play integration easy.

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

Currently, AIVAX only supports the `chat/completions` format. In the future, we plan to add support for the API Responses.