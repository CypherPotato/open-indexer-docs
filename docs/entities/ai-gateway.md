# AI Gateway

Os gateways de AI é um serviço que a OpenIndexer fornece para criar um túnel de inferência entre um modelo de LLM e uma base de conhecimento. Nele é possível:

- Criar um modelo com instruções personalizadas
- Usar um modelo provido por você através de um endpoint OpenAI compatível, ou usar um modelo disponibilizado pela OpenIndexer
- Personalizar parâmetros de inferência, como temperatura, top_p, prefill
- Usar uma coleção de conhecimento como fundação de respostas para IA

Dentre outros recursos. Com o AI Gateway, você cria um modelo pronto para uso, parametrizado e fundamentado nas instruções que você definir.

## Modelos

Você pode trazer um modelo de IA compatível com a interface OpenAI para o gateway de IA. Se você trazer seu modelo de IA, iremos cobrar apenas pela pesquisa de documentos anexada na IA. Você também pode usar um dos modelos abaixo que já estão prontos para começar com o OpenIndexer.

Ao usar um modelo, você perceberá que alguns são mais inteligentes que outros para determinadas tarefas. Alguns modelos são melhores com certas estratégias de obtenção de dados do que outros. Realize testes para encontrar o melhor modelo.

Você pode ver os modelos disponíveis na [página de modelos](/docs/models).

## Escolhendo uma estratégia de busca

Se você for usar uma coleção de conhecimento com um modelo de IA, você poderá escolher uma estratégia que a IA usará para realizar uma busca por informação. Cada estratégia é mais refinada que a outra. Algumas criam resultados melhores que as demais, mas é importante realizar testes práticos com várias estratégias para entender qual se ajusta melhor no modelo, conversa e tom do usuário.

Talvez seja necessário realizar ajustes no prompt do sistema para informar melhor como a IA deverá considerar os documentos anexados na conversa. Os documentos são anexados como uma mensagem do usuário, limitados aos parâmetros que você define na estratégia de obtenção.

Estratégias sem custo de reescrita:

- `Plain`: a estratégia padrão. É a menos otimizada e não possui custo de reescrita: a última mensagem do usuário é usada como termo de busca para pesquisar na coleção anexada do gateway.
- `Concatenate`: Concatena em linhas as últimas N mensagens do usuário, e então o resultado da concatenação é usada como termo de busca.

Estratégias com custo de reescrita (os tokens de inferência são cobrados):

- `UserRewrite`: reescreve as últimas N mensagens do usuário usando um modelo menor, criando uma pergunta contextualizada no que o usuário quer dizer.
- `FullRewrite`: reescreve as últimas N*2 mensagens do chat usando um modelo menor. Similar ao `UserRewrite`, mas considera também as mensagens da assistente na formulação da nova pergunta. Geralmente cria as melhores perguntas, com um custo um pouco maior. É a estratégia mais estável e consistente. Funciona com qualquer modelo.

Estratégias com reescrita normalmente geram os melhores resultados à um baixo custo de latência e custo. O modelo de reescrita usado sempre o com menor custo, escolhido normalmente por um pool interno que decide o modelo que está com menor latência no momento.

## Usando funções (tools) de IA

No momento, não é possível especificar chamadas de função através da nossa API, seja pelo AI-Gateway ou pela API OpenAI compatível. Esse recurso está no nosso radar para implementação futura.

Se isso é crítico para seu modelo de IA funcionar, você pode usar a API de [busca de documentos](/docs/search) no seu modelo.

## Criando um gateway de IA

Se for usar um modelo providenciado por você, tenha em mãos:

- O base address compatível com a API OpenAI
- A chave de API do endpoint (se aplicável)
- O nome do modelo de inferência.

Não é necessário ter uma coleção para vincular no seu gateway de IA. Você pode criar um gateway de IA e vincular uma base de conhecimento nela posteriormente.

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    // Nome do gateway para identificá-lo posteriormente.
    "name": "my-gateway-model",
    
    "parameters": {

        // Endpoint compatível com chat/completions da OpenAI, ou use @integrated
        // para usar um modelo provido pela Open Indexer.
        "baseAddress": "@integrated",

        // ID da coleção que será usada como base de conhecimento pela IA.
        // Pode ser nulo.
        "knowledgeCollectionId": "01965b62-17c4-7258-9aa8-af5139799527",

        // Opcional. Especifica quantos documentos devem ser anexados no contexto da IA.
        "knowledgeBaseMaximumResults": 16,

        // Opcional. Especifica a pontuação mínima de similaridade que a busca de documentos deve anexar no contexto da IA.
        "knowledgeBaseMinimumScore": 0.55,

        // Opcional. Especifica se referências de documentos devem ser anexadas no contexto da IA.
        "knowledgeUseReferences": false,

        // Opcional. Especifica a estratégia de obtenção de documentos. Leia "Escolhendo uma estratégia de busca" para saber mais.
        "queryStrategy": "UserRewrite",
        
        // Parâmetros da estratégia de obtenção.
        "queryStrategyParameters": {

            // Opcional. Especifica a quantidade de mensagens que devem ser consideradas para as estratégias UserRewrite e FullRewrite. Nota: para FullRewrite, o valor sempre é multiplicado por 2 para considerar mensagens da assistente.
            "rewriteContextSize": 3,

            // Opcional. Especifica a quantidade de mensagens do usuário que devem ser concatenadas no termo da busca.
            "concatenateContextSize": 3
        },

        // Opcional. Especifica a chave de api "Authorization: Bearer ..." usado na inferência. Deixe nulo se usar um modelo embutido da Open Indexer.
        "apiKey": null,

        // Obrigatório. Especifica o nome do modelo que será usado na inferência.
        "modelName": "@groq/compound-beta",

        // Opcional. Especifica a temperatura do modelo.
        "temperature": 1.25,
        
        // Opcional. Especifica o nucleos sampling do modelo.
        "topP": null,

        // Opcional. Especifica a penalidade de presença de tokens do modelo.
        "presencePenalty": null,

        // Opcional. Especifica um termo de "stop" para o modelo.
        "stop": null,

        // Opcional. Especifica o máximo de tokens de resposta do modelo.
        "maxCompletionTokens": 4096,

        // Opcional. Especifica o system-prompt usado no modelo.
        "systemInstruction": "Você é uma assistente amigável.",

        // Opcional. Transforma a pergunta do usuário para o formato indicado abaixo, onde "{prompt}" é o prompt original do usuário.
        "userPromptTemplate": null,
        
        // Opcional. Especifica um prefill (inicialização) da mensagem da assistente.
        "assistantPrefill": null,

        // Opcional. Especifica se o assistantPrefill e o stop devem ser incluídos na mensagem gerada pela assistente.
        "includePrefillingInMessages": false,

        // Opcional. Especifica flags especiais para o modelo. Deixe como "0" para não usar nenhuma flag. As flags permitidas são:
        //      NoSystemInstruct: ao invés de usar system prompt, insere as instruções do system em uma mensagem de usuário
        "flags": "0",

        // Opcional. Passa um array de funções para a IA.
        "tools": null
    }
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        "aiGatewayId": "01965b64-a8eb-716c-892d-880159a9f12d"
    }
}
```


## Editar um gateway de IA

O corpo da requisição é basicamente o mesmo do endpoint de criar um ai-gateway. Ao invés de usar POST, use PATCH.

#### Requisição

<div class="request-item patch">
    <span>PATCH</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": "Gateway editted.",
    "data": null
}
```


## Usar um gateway de IA

O endpoint de conversação com um gateway de IA é simples: ele espera apenas a conversa. Você pode receber a resposta de uma vez ou por streaming.

#### Requisição

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
            "content": "Como eu posso ligar meu Civic 2015?"
        }
    ],
    "stream": true
}
```

#### Resposta para stream=true

A resposta de streaming é baseada em server-sent events. A primeira linha sempre é uma resposta com informações de depuração.

```text
data: {"content":"","isFirstChunkMetadata":true,"embeddedDocuments":[],"debugInfo":[{"name":"EmbeddingTimeMs","value":7.5045},{"name":"InferenceTimeMs","value":0},{"name":"ElapsedTotalMs","value":8.3489},{"name":"KnowledgeQueryText","value":null}]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}

data: {"content":"[...]","isFirstChunkMetadata":false,"embeddedDocuments":[],"debugInfo":[]}
...

data: [END]
```

#### Resposta para stream=false


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

## Ver um gateway de IA

A requisição abaixo traz detalhes de um AI gateway.

#### Requisição

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Resposta

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


## Excluir um gateway de IA

Permanentemente remove um gateway de IA.

> [!WARNING]
>
> Ao remover um gateway de IA, todos os chat clients associados também são removidos. Coleções não são removidas.

#### Requisição

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": "AI gateway deleted.",
    "data": null
}
```

## Endpoint OpenAI

A Open Indexer provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela Open Indexer com aplicações existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways/<span>{ai-gateway-id}</span>/open-ai/v1/chat/completions
    </span>
</div>

```json
{
    // O campo "model" é obrigatório, mas não faz nada nessa requisição. Ele só existe para ser compatível com a API Open AI. Você pode deixar ele vazio ou escrever qualquer coisa no lugar, pois o modelo considerado é o definido no AI Gateway.
    "model": "foobar",
    
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
```'