# AI Gateway

AI gateways are a service that AIVAX provides to create an inference tunnel between an LLM model and a knowledge base. With it you can:

- Create a model with custom instructions
- Use a model provided by you through a compatible OpenAI endpoint, or use a model made available by AIVAX
- Customize inference parameters such as temperature, top_p, prefill
- Use a knowledge collection as the foundation for AI responses

Among other features. With the AI Gateway, you create a ready‑to‑use model, parametrized and grounded in the instructions you define.

## Models

You can bring an AI model compatible with the OpenAI interface to the AI gateway. If you bring your own AI model, we will charge only for the document search attached to the AI. You can also use one of the models below that are already ready to start with AIVAX.

When using a model, you will notice that some are smarter than others for specific tasks. Some models perform better with certain data‑retrieval strategies than others. Run tests to find the best model.

You can see the available models on the [models page](/docs/en/models).

## Using an AI gateway

AIVAX provides an endpoint compatible with the OpenAI interface through an AI‑gateway, which makes it easy to integrate the model created by AIVAX with existing applications and SDKs. Note that only a few properties are supported.

In an AI gateway you already configure model parameters such as System Prompt, temperature, and model name. When using this endpoint, some gateway values can be overridden by the request.

> [!TIP]
>
> To better understand how to use System Prompt compared to Skills and RAG, see our [full comparison guide](/docs/en/concepts-comparison).

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

For more detailed API reference, see the [API reference](https://inference.aivax.net/apidocs#ChatCompletions).

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