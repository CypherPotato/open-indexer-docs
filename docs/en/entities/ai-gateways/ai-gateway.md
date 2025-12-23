# AI Gateway

AI gateways are a service that AIVAX provides to create an inference tunnel between an LLM model and a knowledge base. With it you can:

- Create a model with custom instructions
- Use a model provided by you through a compatible OpenAI endpoint, or use a model made available by AIVAX
- Customize inference parameters, such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a ready‑to‑use model, parametrized and grounded in the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your own AI model, we will charge only for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are smarter than others for certain tasks. Some models are better with certain data‑retrieval strategies than others. Run tests to find the best model.

You can see the available models on the [models page](/docs/en/models).

## Using an AI gateway

AIVAX provides an endpoint compatible with the OpenAI interface through an AI‑gateway, which makes it easy to integrate the model created by AIVAX with existing applications and SDKs. Note that only a few properties are supported.

In an AI gateway, you already configure the model parameters, such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overridden by the request.

> [!TIP]
>
> To better understand how to use System Prompt compared to Skills and RAG, see our [complete comparison guide](/docs/en/concepts-comparison).

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Qual a capital da França?"
        }
    ],
    "stream": false,
    "metadata": {
        "foo": "bar"
    }
}
```

#### Response for non‑streaming

```json
{
    "id": "0198d24c-c9ce-70fe-9cf3-00644ef5f2e2",
    "object": "chat.completion",
    "created": 1755874904,
    "model": "@openai/gpt-5-mini",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "A capital da França é Paris.",
                "refusal": null,
                "annotations": [],
                "tool_calls": []
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 84,
        "completion_tokens": 16,
        "total_tokens": 1892,
        "prompt_tokens_details": {
            "cached_tokens": 1792
        }
    },
    "service_tier": "default",
    "generation_context": {
        "generated_usage": [
            {
                "sku": "inference.resolving.routing_complexity.in",
                "amount": 0.0000207,
                "unit_price": 7.5e-8,
                "quantity": 276,
                "description": "Inference for model routing"
            },
            {
                "sku": "inference.resolving.routing_complexity.out",
                "amount": 3e-7,
                "unit_price": 3e-7,
                "quantity": 1,
                "description": "Inference for model routing"
            },
            {
                "sku": "inference.chat_completions.in",
                "amount": 0.000021,
                "unit_price": 2.5e-7,
                "quantity": 84,
                "description": "Inference for AI model '@openai/gpt-5-mini'"
            },
            {
                "sku": "inference.chat_completions.out",
                "amount": 0.000032,
                "unit_price": 0.000002,
                "quantity": 16,
                "description": "Inference for AI model '@openai/gpt-5-mini'"
            },
            {
                "sku": "inference.chat_completions.in.cached",
                "amount": 0.0000448,
                "unit_price": 2.5e-8,
                "quantity": 1792,
                "description": "Inference for AI model '@openai/gpt-5-mini'"
            }
        ],
        "runned_functions": []
    }
}
```

#### Streaming response

```text
data: {"id":"chatcmpl-0198d263-fd80-7645-98b0-3966004e11df","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_2su4hm","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{"role":"assistant","content":""}}],"usage":null}

...

data: {"id":"chatcmpl-0198d263-ff5a-7f53-99e2-b59d5cdae470","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_7ibly5","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{"content":""}}],"usage":null}

data: {"id":"chatcmpl-0198d263-ff80-7d8f-91e7-c61ac2a9e870","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_552km8","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{}}],"usage":{"prompt_tokens":1873,"completion_tokens":41,"total_tokens":1914}}

data: [END]
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