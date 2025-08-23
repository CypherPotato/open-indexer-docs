# AI Gateway

Os gateways de AI é um serviço que a AIVAX fornece para criar um túnel de inferência entre um modelo de LLM e uma base de conhecimento. Nele é possível:

- Criar um modelo com instruções personalizadas
- Usar um modelo provido por você através de um endpoint OpenAI compatível, ou usar um modelo disponibilizado pela AIVAX
- Personalizar parâmetros de inferência, como temperatura, top_p, prefill
- Usar uma coleção de conhecimento como fundação de respostas para IA

Dentre outros recursos. Com o AI Gateway, você cria um modelo pronto para uso, parametrizado e fundamentado nas instruções que você definir.

## Modelos

Você pode trazer um modelo de IA compatível com a interface OpenAI para o gateway de IA. Se você trazer seu modelo de IA, iremos cobrar apenas pela pesquisa de documentos anexada na IA. Você também pode usar um dos modelos abaixo que já estão prontos para começar com o AIVAX.

Ao usar um modelo, você perceberá que alguns são mais inteligentes que outros para determinadas tarefas. Alguns modelos são melhores com certas estratégias de obtenção de dados do que outros. Realize testes para encontrar o melhor modelo.

Você pode ver os modelos disponíveis na [página de modelos](/docs/models).

## Usar um gateway de IA

A AIVAX provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela AIVAX com aplicações e SDKs existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/chat-completions
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

#### Resposta para não-streaming

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

#### Resposta streaming

```text
data: {"id":"chatcmpl-0198d263-fd80-7645-98b0-3966004e11df","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_2su4hm","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{"role":"assistant","content":""}}],"usage":null}

...

data: {"id":"chatcmpl-0198d263-ff5a-7f53-99e2-b59d5cdae470","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_7ibly5","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{"content":""}}],"usage":null}

data: {"id":"chatcmpl-0198d263-ff80-7d8f-91e7-c61ac2a9e870","object":"chat.completion.chunk","created":1755876425,"model":"@openai\/gpt-5-mini","system_fingerprint":"fp_552km8","choices":[{"index":0,"finish_reason":"stop","logprobs":null,"delta":{}}],"usage":{"prompt_tokens":1873,"completion_tokens":41,"total_tokens":1914}}

data: [END]
```

## Uso com SDKs

Por prover endpoints compatíveis com a interface OpenAI, a AIVAX é totalmente compatível com SDKs existentes, facilitando a integração plug-and-play.

Veja o exemplo abaixo:

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

No momento, a AIVAX só suporta o formato `chat/completions`. No futuro, pretendemos criar suporte para a API Responses.