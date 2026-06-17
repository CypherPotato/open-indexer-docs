# Inferência

A AIVAX utiliza uma versão customizada do antigo protocolo `chat/completions` criado pela OpenAI. Essas customizações são aditivas: não alteram o comportamento esperado do protocolo e é totalmente compatível com clientes e SDKs OpenAI.

Algumas customizações foram feitas para tornar a comunicação com o modelo normalizada, compatível e comunicar com os serviços que a AIVAX fornece.

## Entrada e multi-modalidade

AIVAX é totalmente compatível com multi-modalidade. É possível encaminhar áudios, imagens, vídeos e documentos para o modelo usando a API compatível:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                { 
                    "type": "text",
                    "text": "Describe this image briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/receipt.png",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "base64-encoded-audio",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "https://bitcoin.org/bitcoin.pdf",
                    },
                },
            ]
        }
    ]
}
```

- Interpretação de imagens: 
    - conteúdo tipo `image_url`
    - `image_url.url` pode ser uma URL externa ou um data-url codificado em base64 (`data:image/png;base64,...`).
    - `image_url.detail` pode ser nulo, `low`, `high` ou `auto`. Nem todos modelos suportam este parâmetro.
- Interpretação de vídeo:
    - conteúdo tipo `video_url`
    - `video_url.url` pode ser uma URL externa ou um data-url codificado em base64 (`data:video/mp4;base64,...`). Modelos Gemini geralmente suportam links do YouTube. É altamente recomendado fornecer uma URL ao invés de um conteúdo inline.
- Interpretação de áudio:
    - conteúdo tipo `input_audio`
    - `input_audio.data` áudio codificado em base64. Não são aceitos links externos em áudios.
    - `input_audio.format` formato do áudio. Geralmente modelos aceitam melhor `wav` e `mp3`, mas certos modelos podem expandir para `aiff`, `aac`, `ogg`, `flac`, `m4a` e `pcm16/24`.
- Interpretação de arquivos:
    - conteúdo tipo `file`
    - `file.filename` nome do arquivo. É útil para guiar o modelo para o que esse arquivo representa.
    - `file.file_data` pode ser uma URL externa ou um data-url codificado em base64. Alguns modelos suportam mais formatos além de PDFs.

É necessário saber que o modelo que está usando suporta a modalidade de entrada que está enviando. Para certos tipos de arquivos, modelos tendem à rejeitar por regras específicas de tamanhos e formatos.

Tenha certeza que links para recursos externos sejam acessíveis sem autenticação e sem firewall, pois respostas incorretas, redirecionamentos ou renderização preguiçosa (JavaScript) poderão atirar uma exceção na inferência.

Você também pode fornecer uma entrada textual simples usando o parâmetro `prompt`:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

É possível também ativar o processamento multi-modalidades do lado do servidor da AIVAX, convertendo conteúdo multi-modal para texto para modelos que não possuem capacidades de leitura multi-modal:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@meta/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                { 
                    "type": "text",
                    "text": "Describe this file briefly."
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "https://bitcoin.org/bitcoin.pdf",
                    },
                },
            ]
        }
    ],
    "multimodal_preprocess": [
        "File"
    ]
}
```

Opções disponíveis de pre-processamento multi-modalidades são:
- `Image`
- `File`
- `Video`
- `Audio`
- `OtherFiles`
- `All`

> Dica: A modalidade `OtherFiles` processa vários tipos de arquivos, como PDFs, planilhas do excel, apresentações do powerpoint, usando um motor interno da AIVAX e essa modalidade não possui custo.

Arquivos e vídeos exigem saldo mínimo de $0,50 na conta. Imagens e áudios exigem saldo mínimo de $0,10.

Use multimodalidade direta quando o modelo escolhido já entende aquele tipo de entrada. Use `multimodal_preprocess` quando você precisa transformar a entrada em texto antes de enviá-la ao modelo principal, normalmente porque o modelo é barato, rápido ou especializado em texto, mas não entende imagem, áudio, vídeo ou arquivo. Essa escolha muda a forma como a conversa é construída: com entrada multimodal direta, o conteúdo original chega ao modelo; com pré-processamento, a AIVAX gera uma descrição textual e essa descrição entra no contexto. O pré-processamento é especialmente útil para PDFs, planilhas, apresentações e imagens simples que só precisam ser resumidas ou extraídas antes de uma resposta textual.

Para arquivos, prefira URLs públicas quando o arquivo é grande ou quando você quer evitar payloads base64 muito longos. Para imagens pequenas, data URLs podem simplificar a integração. Para áudio, envie base64 no campo `input_audio.data` e informe `format`; links externos de áudio não são aceitos nesse campo. Para vídeo, prefira URL externa, principalmente quando o provedor do modelo consegue buscar o conteúdo diretamente. Em qualquer modalidade, o recurso precisa estar acessível sem autenticação, sem bloqueios por IP e sem depender de JavaScript para carregar o conteúdo principal.

Quando uma inferência multimodal falhar, reduza o problema. Primeiro, teste uma mensagem textual simples com o mesmo modelo. Depois, teste um único anexo pequeno. Em seguida, teste o mesmo anexo com `multimodal_preprocess`. Se o modelo direto falha e o pré-processamento funciona, o problema provavelmente é suporte multimodal do modelo. Se ambos falham, revise URL, formato, tamanho, saldo mínimo e acessibilidade do recurso. Em produção, trate anexos como entradas que podem falhar e escreva a experiência do usuário para pedir reenvio, usar outro formato ou responder com uma limitação clara.

## Respostas estruturadas

AIVAX suporta respostas estruturas e JSON healing, que automaticamente corrije JSONs defeituosos ou que não seguem o schema fornecido durante inferência.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Pesquise por notícias em São José do Rio Preto.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "news": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Título da notícia"
                        },
                        "content": {
                            "type": "string",
                            "description": "Resumo da notícia"
                        }
                    }
                }
            }
        }
    }
}
```

Leia mais sobre respostas estruturadas em sua [página dedicada](/docs/pt-br/inference/structured-responses).

## Funções em demanda

Você pode usar ferramentas embutidas da AIVAX durante inferência sem a necessidade de definir um gateway de IA para isso.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Pesquise por notícias em São José do Rio Preto.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    }
}
```

A lista de opções e ferramentas embutidas disponíveis está disponível na página de [ferramentas embutidas](/docs/pt-br/tools/builtin-tools).

Ferramentas em demanda são adequadas para chamadas pontuais, protótipos e integrações que não precisam de um gateway persistente. Se a mesma aplicação sempre usa as mesmas ferramentas, prefira configurá-las no AI Gateway para manter a política centralizada. Em chamadas diretas, o cliente que faz a requisição controla a lista de ferramentas a cada chamada; em gateways, o administrador do agente controla o conjunto disponível. Essa diferença é importante para segurança: ferramentas como `Request`, `AdvancedWebUsage`, geração de documentos e pesquisa web podem acessar recursos externos ou gerar conteúdo hospedado, então devem ser habilitadas com intenção clara.

## Corpo customizado em resposta

Ao usar gateways de IA com API key fornecida (BYOK), você pode encaminhar JSON customizado na requisição, substituindo o JSON comum da AIVAX:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "my-custom-model:abc4",
    "messages": [...],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Essa propriedade não é compatível com modelos roteados pela AIVAX.

## Explicações de ferramentas 

Modelos invocam ferramentas durante ações, seja ferramentas locais (client-side) ou ferramentas do lado do servidor (embutidas, MCP ou protocolo de funções). Ao encaminhar a propriedade `tool_invocation_explanations`, você pode incluir um parâmetro adicional no corpo da função para o modelo explicar por que está chamando aquela ferramenta. Isso pode ser útil para exibir ao usuário de forma agradável e em tempo real do que o modelo está fazendo para responder o usuário.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "my-custom-model:abc4",
    "messages": [...],
    "tool_invocation_explanations": true
}
```

Nisso, chunks de ferramentas de servidor `servertool` terão uma propriedade da explicação da ferramenta:

```json
{
  "id": "chatcmpl-019e1d73-cf92-7f3f-bac7-d0869770cda8",
  "object": "chat.completion.chunk",
  "created": 1778610589,
  "model": "@x-ai/grok-4.3",
  "system_fingerprint": "fp_uu72kl",
  "choices": [],
  "servertool": {
    "name": "web_search",
    "id": "call-70944e44-fbc5-4906-9f9f-99559c05db11-0",
    "contents": "{\"query\":\"What's the weather forecast for today?\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to provide an accurate forecast for today, as the user's location isn't specified so I'll use a general search to retrieve relevant data.\"}",
    "state": "Created",
    "explanation": {
      "reason": "Searching for today's weather forecast online",
      "goal": "I need current weather information to provide an accurate forecast for today, as the user's location isn't specified so I'll use a general search to retrieve relevant data."
    }
  },
  "usage": null
}
```

## Renderização de resposta

É possível renderizar raciocínio e chamadas de ferramenta do lado do servidor para uma exibição em linha do tempo segmentada e em tempo real normalizando raciocínio em blocos XML customizados.

Ao habilitar essa função, o modelo passará a responder agrupando suas chamadas de função e raciocínio em blocos `<thinking_group>` e `<think>`:

```
<thinking-group>

<think>We need current weather forecast for São Paulo. Must use web_search tool. Provide meta fields. Search term likely "São Paulo weather forecast today".</think>

<tool><toolname>web_search</toolname><toolreason>Searching today's weather forecast for São Paulo</toolreason></tool>

<think>The search results are messy. Need specific forecast. Could open one of the Brazilweather.org pages. Let's open the English? The result appears to be Portuguese/Catalan. Use open? There's no open tool, only web_search. We may need to extract info from snippet. The snippet for tradefairdates shows temperature 14°C 20°C today 10.05.2026 (future). Not relevant. We need today's forecast. Likely we can answer based on typical current data, but should provide up-to-date. Could try another search with "São Paulo weather today" maybe results better. Let's call again.</think>

<tool><toolname>web_search</toolname><toolreason>Searching for São Paulo Brazil weather today forecast</toolreason></tool>

<think>We should answer in English (conversation language). Provide forecast, temperature highs, lows, chance of rain, maybe wind.</think>
</thinking-group>

Here’s the weather outlook for **São Paulo (Brazil) today, May 12 2026**:

...

**Current conditions (as of 15:30 local time)** – Sunny, 20 °C (68 °F), light east breeze (~4 km/h), humidity 40 %, no precipitation observed.

Overall, today will be comfortably warm and dry, with clear skies and virtually no rain expected.
```

É agrupado automaticamente em grupos de raciocínios trechos de pensamento emitidos pelo modelo e chamadas de ferramentas do lado do servidor consecutivos, e automaticamente terminado quando o modelo começa uma resposta.

Essa função é indicada para renderizar um chat agradável e informativo ao usuário final, tratando os trechos XML como componentes ou especificações extendidas do leitor markdown da aplicação.

## Quando usar chamada direta ou gateway

Use chamada direta para tarefas simples, testes, rotinas internas e integrações em que a aplicação já controla prompt, modelo, ferramentas e contexto. Ela é o caminho mais curto para chamar um modelo, enviar uma entrada multimodal, pedir uma resposta estruturada ou habilitar ferramentas embutidas por requisição. A chamada direta também é útil quando você quer alternar modelos dinamicamente pela aplicação e não precisa de uma configuração persistente no console.

Use um AI Gateway quando o comportamento precisa ser estável, auditável e reutilizável. Gateways são melhores para assistentes de atendimento, bots em chat clients, agentes com RAG, ferramentas permanentes, workers, skills e configurações que vários clientes vão compartilhar. O gateway reduz repetição na aplicação e permite alterar comportamento sem mudar código. Uma boa regra prática: se você está copiando o mesmo prompt, a mesma lista de ferramentas ou a mesma coleção de RAG em várias chamadas, essa configuração provavelmente deveria estar em um gateway.
