# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas de inferência diretas. Use [AI Gateway](/docs/pt-br/inference/ai-gateway) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também possui o alias de API `/api/v1/chat/completions`.

## Entrada e multimodalidade

AIVAX aceita partes de conteúdo de mensagem compatíveis com OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade, a menos que você peça à AIVAX para pré-processar a mídia em texto.

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
- `input_audio`: Conteúdo de áudio. `input_audio.data` é dados de áudio em base64, e `input_audio.format` indica o formato.
- `file`: Conteúdo de arquivo. `file.filename` indica o nome do arquivo, e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. Use uma URL pública quando possível, especialmente para vídeos grandes:

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

Links externos devem ser acessíveis ao AIVAX sem autenticação, restrições de firewall ou renderização apenas em JavaScript. Downloads falhados, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor podem fazer a inferência falhar.

Você também pode enviar uma solicitação de texto simples com `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Pré-processamento multimodal

Use `multimodal_preprocess` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos focados em texto ou quando você deseja que a AIVAX normalize arquivos antes da inferência principal.

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

Os flags de pré-processamento disponíveis são:

- `Image`
- `Audio`
- `Video`
- `File`
- `OtherFiles`
- `All`

O resolvedor armazena em cache as descrições de mídia por hash de conteúdo para reutilização. O pré-processamento de `Image`, `Audio`, `Video` e PDF `File` usa inferência multimodal auxiliar. `OtherFiles` usa o caminho interno de extração para arquivos não PDF que podem ser convertidos em texto.

Arquivos e vídeos requerem um saldo mínimo de conta de $0,50. Imagens e áudio requerem um saldo mínimo de conta de $0,10.

Quando uma inferência multimodal falha, reduza o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um pequeno anexo.
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

`response_schema` habilita a Cura de JSON. AIVAX solicita JSON ao modelo, extrai JSON do texto ou blocos de markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja alcançado.

Saiba mais sobre [Respostas estruturadas](/docs/pt-br/inference/structured-responses).

## Funções sob demanda

Use `builtin_tools` para habilitar as ferramentas integradas da AIVAX para uma solicitação direta sem criar um gateway:

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

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se a mesma aplicação sempre usar as mesmas ferramentas, prefira configurá-las em um AI Gateway para que a política seja centralizada.

## Corpo de requisição de provedor personalizado

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

`extra_body` não é permitido com modelos AIVAX integrados.

## Explicações de ferramentas

Defina `tool_invocation_explanations: true` para solicitar que a AIVAX inclua campos de explicação nos argumentos de ferramentas do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

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

## Modo de renderização de resposta

Defina `rendering_mode: "textual_blocks"` quando um cliente deseja que o raciocínio e os marcadores de ferramentas do lado do servidor sejam normalizados em blocos textuais. Nesse modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, e os marcadores de ferramentas do lado do servidor podem ser emitidos como blocos `<tool>`.

Esse modo é destinado a clientes que renderizam esses blocos como componentes em uma linha do tempo de chat. Clientes que não entendem a marcação devem usar o modo de renderização padrão e lidar com eventos `delta.reasoning` e `servertool`.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, prompt, ferramentas e contexto para cada solicitação.

Use um AI Gateway quando o comportamento precisar ser estável, auditável e reutilizável. Gateways são melhores para assistentes de suporte, bots de chat, agentes RAG, ferramentas permanentes, trabalhadores, habilidades e configurações compartilhadas por múltiplos clientes.