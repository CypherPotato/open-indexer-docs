# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré‑processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas de inferência diretas. Use o [AI Gateway](/docs/pt-br/inference/ai-gateway) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também tem o alias de API `/api/v1/chat/completions`.

## Entrada e multimodalidade

AIVAX aceita partes de conteúdo de mensagem compatíveis com OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade a menos que você peça à AIVAX para pré‑processar a mídia em texto.

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe these inputs briefly."
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
                        "file_data": "https://bitcoin.org/bitcoin.pdf"
                    }
                }
            ]
        }
    ]
}
```

Mapeamentos de partes de conteúdo suportados:

- `text`: Texto simples.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo o suporta.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` é áudio codificado em base64, e `input_audio.format` indica o formato.
- `file`: Conteúdo de arquivo. `file.filename` nomeia o arquivo, e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. Use uma URL publicamente acessível quando possível, especialmente para vídeos grandes:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the main actions in this video and identify any visible safety risks."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "https://example.com/factory-inspection.mp4"
                    }
                }
            ]
        }
    ]
}
```

Links externos devem ser acessíveis ao AIVAX sem autenticação, restrições de firewall ou renderização apenas em JavaScript. Downloads falhos, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor podem fazer a inferência falhar.

Você também pode enviar uma solicitação de texto simples com `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Idempotência da requisição

Defina `idempotency_key` quando sua integração precisar de chamadas repetidas para atualizar o mesmo registro de conversa armazenado ao invés de criar um novo token de conversa. AIVAX usa esse valor como o `ConversationToken` interno para o contexto do AI Gateway e registro de conversa.

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Summarize order 123."
        }
    ],
    "idempotency_key": "order-123-summary"
}
```

O valor deve ser uma string não vazia com 128 caracteres ou menos. Quando omitido, AIVAX gera um token de conversa automaticamente.

## Metadados da requisição

Defina `metadata` para anexar informações de chave/valor de string à requisição de inferência. AIVAX armazena esse objeto com a conversa registrada e o expõe a eventos de gateway, sendo útil para correlação operacional como ID de pedido, locatário, fluxo de trabalho ou chave de rastreamento interno.

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` deve ser um objeto JSON cujos nomes e valores de propriedades são strings. Não coloque segredos, credenciais, dados de pagamento ou cargas úteis grandes neste campo.

## Pré‑processamento multimodal

Use `multimodal_preprocess` quando o modelo principal deve receber uma descrição textual da mídia ao invés do objeto de mídia original. Isso é útil para modelos que priorizam texto ou quando você quer que a AIVAX normalize arquivos antes da inferência principal.

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
                        "file_data": "data:application/pdf;base64,BASE64_PDF_CONTENT"
                    }
                }
            ]
        }
    ],
    "multimodal_preprocess": "File"
}
```

Bandeiras de pré‑processamento disponíveis:

- `Image`
- `Audio`
- `Video`
- `File`
- `OtherFiles`
- `All`

O resolvedor armazena em cache descrições de mídia por hash de conteúdo para reutilização. `Image`, `Audio`, `Video` e o pré‑processamento PDF `File` usam inferência multimodal auxiliar. `OtherFiles` usa o caminho interno de extração para arquivos não‑PDF que podem ser convertidos em texto.

Arquivos e vídeos requerem um saldo mínimo de conta de $0,50. Imagens e áudio requerem um saldo mínimo de conta de $0,10.

Quando uma inferência multimodal falha, reduza o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um anexo pequeno.
3. Teste o mesmo anexo com `multimodal_preprocess`.
4. Revise a URL, formato, tamanho, requisito de saldo e suporte à modalidade do modelo.

## Respostas estruturadas

AIVAX suporta respostas estruturadas através de `response_schema`, `response_format` e `json_only`.

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
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
                            "description": "News title"
                        },
                        "summary": {
                            "type": "string",
                            "description": "News summary"
                        }
                    },
                    "required": ["title", "summary"]
                }
            }
        },
        "required": ["news"]
    }
}
```

`response_schema` habilita a Cura JSON. AIVAX solicita ao modelo JSON, extrai JSON do texto ou blocos markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja atingido.

Leia mais sobre [Structured responses](/docs/pt-br/inference/structured-responses).

## Funções sob demanda

Use `builtin_tools` para habilitar ferramentas integradas da AIVAX para uma requisição direta sem criar um gateway:

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

Ferramentas integradas incluem `WebSearch`, `AdvancedWebUsage`, `OpenUrl`, `Code`, `Request`, `Calendar`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch` e `ImageGeneration`.

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se a mesma aplicação sempre usar as mesmas ferramentas, prefira configurá‑las em um AI Gateway para que a política seja centralizada.

## Corpo da requisição do provedor personalizado

Quando um gateway usa uma chave de API fornecida e um endpoint de provedor compatível com OpenAI, `extra_body` pode mesclar JSON personalizado ao corpo da requisição do provedor:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` não é permitido com modelos integrados da AIVAX.

## Explicações de ferramenta

Defina `tool_invocation_explanations: true` para pedir à AIVAX que inclua campos de explicação nos argumentos de ferramenta do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather forecast for today?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Exemplo de evento de stream:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-70944e44-fbc5-4906-9f9f-99559c05db11-0",
        "contents": "{\"query\":\"weather forecast today\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to answer accurately.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Searching for today's weather forecast online",
            "goal": "I need current weather information to answer accurately."
        }
    },
    "usage": null
}
```

## Modo de renderização da resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que a AIVAX coloque raciocínio e atividade de ferramenta do lado do servidor no mesmo fluxo de resposta textual que a UI de chat já renderiza. Isso é útil para clientes que constroem uma única linha do tempo de resposta e desejam transformar raciocínio e atividade de ferramenta em componentes visíveis sem manter caminhos de tratamento de eventos separados para cada tipo de marcador.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Search for recent product updates and summarize the important changes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado ao assistente pode ser emitido como blocos `<assistant-answer>`, e marcadores de ferramenta do lado do servidor podem aparecer como elementos de resultado de ferramenta como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do stream de resposta: analise‑os em componentes da linha do tempo de chat, seções de raciocínio recolhíveis, fragmentos de resposta do assistente ou linhas de status de ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não entendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega via `delta.reasoning`, e a atividade de ferramenta do lado do servidor chega via eventos `servertool`. Preserve a ordem em que os eventos de stream chegam para que raciocínio, atividade de ferramenta, conteúdo parcial e a resposta final permaneçam na mesma linha do tempo de resposta.

### Exemplo de multi‑turn bruto

O exemplo abaixo mostra a forma de uma resposta em stream quando o raciocínio do lado do servidor é visível ao cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo textual. Os atributos exatos do resultado da ferramenta podem variar por renderizador, mas o comportamento importante é a ordenação: raciocínio, fragmentos de resposta do assistente, atividade de ferramenta, mais raciocínio e a resposta final podem pertencer ao mesmo turno do assistente.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Linha do tempo do assistente em stream bruto:

```text
<thinking-group>
<think>
The user is asking for cheap, fast multimodal models for security camera analysis.
I should list available AIVAX models and search the documentation before recommending options.
</think>
</thinking-group>

<assistant-answer>
I will check the available multimodal models and identify the best options for security camera analysis.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listing the available models in AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Searching documentation about multimodal models and image analysis in AIVAX</span></div>

<think>
The relevant models should support VideoInput or ImageInput, have low input cost, and be fast enough for camera workflows.
I found several candidates and should rank them by cost, speed, and modality support.
</think>
</thinking-group>

<assistant-answer>
For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.

Top picks:

1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.
2. @qwen/qwen3.5-9b: the lowest input cost with video support.
3. @amazon/nova-lite: low input cost and a large context window.

Use VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível ao usuário. Armazene o raciocínio e detalhes da ferramenta como metadados de linha do tempo ou auditoria se seu produto precisar, mas não os transforme em uma nova mensagem de usuário. A mensagem do assistente deve usar o conteúdo do bloco `<assistant-answer>` final, não a transcrição completa do raciocínio.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        },
        {
            "role": "assistant",
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nTop picks:\n\n1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: the lowest input cost with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
        },
        {
            "role": "user",
            "content": "Now recommend one model for real-time alerts and one for deeper review."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

### Orientação de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode “falar” enquanto raciocina emitindo atualizações de processo voltadas ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramenta e conteúdo parcial da resposta conforme a resposta se desenvolve.

Quando a resposta final do assistente é gerada, essa resposta se torna o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas geralmente deixa de ser o objetivo principal do usuário. Colapse ou minimize o raciocínio por padrão após a conclusão para que a resposta final receba a   visual, mantendo o processo disponível para usuários que desejam inspecioná‑lo.

Use revelação progressiva ao longo desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, depois se tornar um elemento secundário mais discreto após a aparição da resposta final. A atividade de ferramenta deve ser lida como status, não como discurso: use rótulos concisos como “Searching”, “Opening source”, “Running tool”, “Finished” ou “Failed”, e mantenha cada invocação de ferramenta agrupada como um item da linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior destaque, tipografia de leitura normal, parte da conversa principal.
- Raciocínio em progresso: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor destaque, cor ou contêiner atenuado, recolhido ou minimizado por padrão.
- Blocos de ferramenta: linhas de status compactas com carregamento, sucesso e erros claros.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja desenvolvedor, auditor ou superfície de depuração.

Evite expor ruídos internos diretamente aos usuários finais. Mostre nomes de ferramenta, estados, rótulos de origem ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, cargas úteis grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja projetada para inspeção técnica.

Para acessibilidade, torne cada bloco recolhível acionável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas de cor para estado e mantenha o movimento sutil. Uma resposta em streaming deve parecer estável enquanto atualiza: novos raciocínios ou linhas de ferramenta podem aparecer em ordem, mas o conteúdo existente não deve pular ou forçar o usuário a perder a posição de leitura.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, prompt, ferramentas e contexto para cada requisição.

Use um AI Gateway quando o comportamento precisar ser estável, auditável e reutilizável. Gateways são melhores para assistentes de suporte, chatbots, agentes RAG, ferramentas permanentes, trabalhadores, habilidades e configurações compartilhadas por múltiplos clientes.