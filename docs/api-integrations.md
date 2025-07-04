# Interfaces de API

Você pode usar a inferência da AIVAX com uma API/SDK existente, fazendo uma troca plug-and-play do serviço. Note que, algumas interfaces possuem limitações quanto à personalização dos agentes e assistentes.

## Interface OpenAI compatível

A AIVAX provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela AIVAX com aplicações existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

O prefixo da API é:

```text
https://inference.aivax.net/api/v1/open-ai
```

No momento, os seguintes endpoints são compatíveis com a API OpenAI:

- `/chat-completions`
- `/models`

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/open-ai/chat-completions
    </span>
</div>

```json
{
    // No campo model, insira o ID do seu gateway de IA ou no formato "nome-do-gateway:parte-do-id"
    "model": "019709af-c909-7545-bb5d-1e08da93400a",
    
    // As mensagens devem seguir o formato da Open AI. Somente "system" e "user" são suportados como "roles" da conversa.
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
    
    // Ambas propriedades são equivalentes e opcionais e vão substituir o campo maxCompletionTokens se forem enviadas na requisição.
    "max_completion_tokens": 1024,
    "max_tokens": 1024,
    
    // Opcional. Substitui o parâmetro do gateway.
    "stop": "\n",
    
    // Opcional. Por padrão a resposta não é por streaming.
    "stream": true
}
```

#### Resposta para não-streaming

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


#### Resposta para streaming

```json
data: {"id":"019672f4-9a58-7932-82f0-022e457a2e63","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_2i0nmn","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant","content":"Hi"}}]}

data: {"id":"019672f4-9ab9-73a2-bdb8-23c4481453a8","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_ar1qol","choices":[{"index":0,"finish_reason":null,"delta":{"content":" there! How can I help you today?\n"}}]}

...

data: {"id":"019672f4-9ac0-7ddf-a76a-e7f8043dd082","object":"chat.completion.chunk","created":1745685355,"model":"gemini-2.0-flash-lite","system_fingerprint":"fp_3e84ge","choices":[{"index":0,"finish_reason":"stop","delta":{}}]}
```

## Interface Ollama compatível

A AIVAX fornece também um endpoint compatível com diversas rotas Ollama.

O prefixo da API é:

```text
https://inference.aivax.net/api/v1/ollama
```

Os endpoints disponíveis são:

- `/`
- `/api/tags`
- `/api/chat` (somente streaming)