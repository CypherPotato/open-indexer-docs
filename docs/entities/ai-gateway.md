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

## Escolhendo uma estratégia de busca

Se você for usar uma coleção de conhecimento com um modelo de IA, você poderá escolher uma estratégia que a IA usará para realizar uma busca por informação. Cada estratégia é mais refinada que a outra. Algumas criam resultados melhores que as demais, mas é importante realizar testes práticos com várias estratégias para entender qual se ajusta melhor no modelo, conversa e tom do usuário.

Talvez seja necessário realizar ajustes no prompt do sistema para informar melhor como a IA deverá considerar os documentos anexados na conversa. Os documentos são anexados como uma mensagem do usuário, limitados aos parâmetros que você define na estratégia de obtenção.

Estratégias com reescrita normalmente geram os melhores resultados à um baixo custo de latência e custo. O modelo de reescrita usado sempre o com menor custo, escolhido normalmente por um pool interno que decide o modelo que está com menor latência no momento.

Estratégias sem custo de reescrita:

- `Plain`: a estratégia padrão. É a menos otimizada e não possui custo de reescrita: a última mensagem do usuário é usada como termo de busca para pesquisar na coleção anexada do gateway.
- `Concatenate`: Concatena em linhas as últimas N mensagens do usuário, e então o resultado da concatenação é usada como termo de busca.

Estratégias com custo de reescrita (os tokens de inferência são cobrados):

- `UserRewrite`: reescreve as últimas N mensagens do usuário usando um modelo menor, criando uma pergunta contextualizada no que o usuário quer dizer.
- `FullRewrite`: reescreve as últimas N*2 mensagens do chat usando um modelo menor. Similar ao `UserRewrite`, mas considera também as mensagens da assistente na formulação da nova pergunta. Geralmente cria as melhores perguntas, com um custo um pouco maior. É a estratégia mais estável e consistente. Funciona com qualquer modelo.

Estratégias de função:

- `QueryFunction`: fornece uma função de pesquisa na coleção integrada para o modelo de IA. Você deverá ajustar nas instruções do sistema os cenários ideais para o modelo chamar essa função quando necessário. Pode não funcionar tão bem em modelos menores.

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
    "model": "0197cb0f-893a-7b7d-be0a-71ada1208aaf",
    "messages": [
        {
            "role": "user",
            "content": "Quem é você?"
        }
    ],
    "stream": false
}
```

#### Resposta para não-streaming

```json
{
    "id": "0197dbdc-6456-7d54-b7ec-04cb9c80f460",
    "object": "chat.completion",
    "created": 1751740343,
    "model": "@aivax/sentinel-mini",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "completion_text": "Oi! 😊 Eu sou a Zia, a assistente inteligente do Zé do Ingresso. Tô aqui pra te ajudar com tudo sobre ingressos, eventos, e tudo que rola na nossa querida São José do Rio Preto. Se precisar de alguma coisa, tipo saber sobre nomeação de ja o bagulho, só chamar! Vamos juntos aproveitar tudo o que tiver rolando! O que você precisa? 🥳 ",
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
    "sentinel_usage": null,
    "service_tier": "default"
}
```

#### Resposta streaming

```text
data: {"id":"0197dbde-c40b-720d-a13e-f689c303c571","object":"chat.completion.chunk","created":1751740498,"model":"gpt-4o-mini","system_fingerprint":"fp_y8jidd","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant","content":""}}],"usage":null,"sentinel_usage":null}

...

data: {"id":"0197dbde-c88c-7764-8017-c1fee0d79096","object":"chat.completion.chunk","created":1751740500,"model":"gpt-4o-mini","system_fingerprint":"fp_2he7ot","choices":[{"index":0,"finish_reason":null,"delta":{"content":""}}],"usage":null,"sentinel_usage":null}

data: {"id":"0197dbde-c890-7329-9e65-faecbe158efa","object":"chat.completion.chunk","created":1751740500,"model":"@aivax\/sentinel-mini","system_fingerprint":"fp_q6qh7x","choices":[{"index":0,"finish_reason":"STOP","delta":{}}],"usage":{"prompt_tokens":1097,"completion_tokens":92,"total_tokens":1189},"sentinel_usage":null}
```