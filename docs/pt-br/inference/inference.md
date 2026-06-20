# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas de inferência diretas. Use [AI Gateway](/docs/pt-br/inference/ai-gateway) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Ponto de extremidade

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O ponto de extremidade também tem o alias de API `/api/v1/chat/completions`.

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
                    "text": "Descreva brevemente essas entradas."
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

Mapeamentos de partes de conteúdo suportadas:

- `text`: Texto simples.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo suporta.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` é dados de áudio em base64, e `input_audio.format` indica o formato.
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
                    "text": "Resuma as principais ações neste vídeo e identifique quaisquer riscos de segurança visíveis."
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
    "prompt": "Diga olá"
}
```

## Pré-processamento multimodal

Use `multimodal_preprocess` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos que priorizam texto ou quando você deseja que a AIVAX normalize arquivos antes da inferência principal.

```json
{
    "model": "@meta/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Descreva brevemente este arquivo."
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

O resolvedor armazena em cache as descrições de mídia por hash de conteúdo para reutilização. O pré-processamento de `Image`, `Audio`, `Video` e PDF `File` usa inferência multimodal auxiliar. `OtherFiles` usa o caminho interno de extração para arquivos não-PDF que podem ser convertidos em texto.

Arquivos e vídeos requerem um saldo mínimo de conta de $0,50. Imagens e áudio requerem um saldo mínimo de conta de $0,10.

Quando uma inferência multimodal falha, estreite o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um pequeno anexo.
3. Teste o mesmo anexo com `multimodal_preprocess`.
4. Revise a URL, formato, tamanho, requisito de saldo e suporte à modalidade do modelo.

## Respostas estruturadas

AIVAX suporta respostas estruturadas através de `response_schema`, `response_format` e `json_only`.

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Buscar notícias recentes sobre veículos elétricos.",
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
                        "summary": {
                            "type": "string",
                            "description": "Resumo da notícia"
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

`response_schema` habilita JSON Healing. AIVAX pede ao modelo JSON, extrai JSON do texto ou blocos de markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja alcançado.

Leia mais sobre [Respostas estruturadas](/docs/pt-br/inference/structured-responses).

## Funções sob demanda

Use `builtin_tools` para habilitar ferramentas integradas da AIVAX para uma solicitação direta sem criar um gateway:

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Buscar notícias recentes sobre veículos elétricos.",
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

## Corpo de solicitação de provedor personalizado

Quando um gateway usa uma chave de API fornecida e um endpoint de provedor compatível com OpenAI, `extra_body` pode mesclar JSON personalizado no corpo da solicitação ao provedor:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explique o trade‑off."
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

Defina `tool_invocation_explanations: true` para pedir à AIVAX que inclua campos de explicação nos argumentos de ferramentas no lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "Qual é a previsão do tempo para hoje?"
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
        "contents": "{\"query\":\"previsão do tempo hoje\",\"_tool_reason\":\"Procurando a previsão do tempo de hoje online\",\"_tool_goal\":\"Preciso de informações atuais do tempo para responder com precisão.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Procurando a previsão do tempo de hoje online",
            "goal": "Preciso de informações atuais do tempo para responder com precisão."
        }
    },
    "usage": null
}
```

## Modo de renderização de resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente deseja que a AIVAX coloque o raciocínio e a atividade de ferramentas no lado do servidor no mesmo fluxo de resposta textual que a interface de chat já renderiza. Isso é útil para clientes que constroem uma linha do tempo única de resposta e desejam transformar o raciocínio e a atividade de ferramentas em componentes visíveis sem manter caminhos de tratamento de eventos separados para cada tipo de marcador.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Buscar atualizações recentes de produtos e resumir as mudanças importantes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado ao assistente pode ser emitido como blocos `<assistant-answer>`, e marcadores de ferramentas no lado do servidor podem aparecer como elementos de resultado de ferramenta como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do fluxo de resposta: analise-os em componentes da linha do tempo de chat, seções de raciocínio recolhíveis, fragmentos de resposta do assistente ou linhas de status de ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não entendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega através de `delta.reasoning`, e a atividade de ferramentas no lado do servidor chega através de eventos `servertool`. Preserve a ordem em que os eventos de stream chegam para que o raciocínio, a atividade de ferramenta, o conteúdo parcial e a resposta final permaneçam na mesma linha do tempo de resposta.

### Exemplo de múltiplas trocas brutas

O exemplo abaixo mostra o formato de uma resposta transmitida quando o raciocínio no lado do servidor está visível ao cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo da resposta textual. Os atributos exatos do resultado da ferramenta podem variar por renderizador, mas o comportamento importante é a ordem: raciocínio, fragmentos de resposta do assistente, atividade da ferramenta, mais raciocínio e a resposta final podem todos pertencer à mesma troca do assistente.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmera de segurança?"
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

Linha do tempo do assistente transmitida:

```text
<thinking-group>
<think>
O usuário está pedindo modelos multimodais baratos e rápidos para análise de câmera de segurança.
Eu devo listar os modelos AIVAX disponíveis e pesquisar a documentação antes de recomendar opções.
</think>
</thinking-group>

<assistant-answer>
Vou verificar os modelos multimodais disponíveis e identificar as melhores opções para análise de câmera de segurança.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listing the available models in AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Searching documentation about multimodal models and image analysis in AIVAX</span></div>

<think>
Os modelos relevantes devem suportar VideoInput ou ImageInput, ter custo de entrada baixo e ser rápidos o suficiente para fluxos de trabalho de câmera.
Encontrei vários candidatos e devo classificá-los por custo, velocidade e suporte à modalidade.
</think>
</thinking-group>

<assistant-answer>
Para análise de câmera de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.

Principais escolhas:

1. @google/gemini-2.5-flash-lite: rápido, barato e suporta vídeo.
2. @qwen/qwen3.5-9b: o menor custo de entrada com suporte a vídeo.
3. @amazon/nova-lite: baixo custo de entrada e uma grande janela de contexto.

Use VideoInput para clipes quando possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá‑los.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível do assistente. Armazene o raciocínio e os detalhes da ferramenta como linha do tempo ou metadados de auditoria se seu produto precisar, mas não os transforme em uma nova mensagem de usuário. A mensagem do assistente deve usar o conteúdo do bloco `<assistant-answer>` final, não a transcrição completa do raciocínio.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmera de segurança?"
        },
        {
            "role": "assistant",
            "content": "Para análise de câmera de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.\n\nPrincipais escolhas:\n\n1. @google/gemini-2.5-flash-lite: rápido, barato e suporta vídeo.\n2. @qwen/qwen3.5-9b: o menor custo de entrada com suporte a vídeo.\n3. @amazon/nova-lite: baixo custo de entrada e uma grande janela de contexto.\n\nUse VideoInput para clipes quando possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá‑los."
        },
        {
            "role": "user",
            "content": "Agora recomende um modelo para alertas em tempo real e outro para revisão mais profunda."
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

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode “falar” enquanto raciocina emitindo atualizações de processo voltadas ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramenta e conteúdo parcial da resposta à medida que a resposta se desenvolve.

Quando a resposta final do assistente é gerada, essa resposta se torna o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas geralmente deixa de ser o objetivo principal do usuário. Recolha ou minimize o raciocínio por padrão após a conclusão, para que a resposta final receba a   visual, mantendo o processo disponível para usuários que desejam inspecioná‑lo.

Use divulgação progressiva ao longo desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, depois tornar‑se um elemento secundário mais discreto após a aparição da resposta final. A atividade da ferramenta deve ser lida como status, não como fala: use rótulos concisos como “Searching”, “Opening source”, “Running tool”, “Finished” ou “Failed”, e mantenha cada invocação de ferramenta agrupada como um item da linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior destaque, tipografia de leitura normal, parte da conversa principal.
- Raciocínio em progresso: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor destaque, cor ou contêiner atenuado, recolhido ou minimizado por padrão.
- Blocos de ferramenta: linhas de status compactas com indicações claras de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja um desenvolvedor, auditoria ou superfície de depuração.

Evite expor detalhes internos ruidosos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, cargas úteis grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja projetada para inspeção técnica.

Para acessibilidade, torne cada bloco recolhido acionável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas de cor para indicar estado e mantenha o movimento sutil. Uma resposta de streaming deve parecer estável enquanto atualiza: novos raciocínios ou linhas de ferramenta podem aparecer em ordem, mas o conteúdo existente não deve pular ou forçar o usuário a perder a posição de leitura.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, prompt, ferramentas e contexto para cada solicitação.

Use um AI Gateway quando o comportamento precisa ser estável, auditável e reutilizável. Gateways são melhores para assistentes de suporte, bots de chat, agentes RAG, ferramentas permanentes, trabalhadores, habilidades e configurações compartilhadas por múltiplos clientes.