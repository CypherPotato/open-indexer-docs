# Respostas estruturadas

AIVAX possui um mecanismo de respostas estruturadas que funciona com **qualquer LLM**, mesmo aqueles que não suportam nativamente structured outputs. A AIVAX analisa o esquema JSON fornecido e valida manualmente se o modelo respondeu conforme esperado. Quando o modelo não responde de acordo com o schema, a AIVAX faz uma tentativa otimista de correção: tenta extrair e normalizar o JSON gerado e, quando isso não é suficiente, instrui o modelo a corrigir o JSON com base nos erros encontrados. Esse mecanismo é chamado de **JSON Healing**.

Esse processo continua até que um JSON válido seja gerado ou até que o número máximo de tentativas especificado seja atingido. Se o modelo ainda não conseguir produzir uma resposta compatível com o schema após essas tentativas, a chamada retorna erro em vez de entregar um JSON fora do formato esperado. A AIVAX interpreta JSONs em blocos markdown, precedidos ou antecedidos por texto, e extrai a resposta final automaticamente quando a estrutura pode ser validada.

Você pode usar respostas estruturadas com modelos que possuem raciocínio (reasoning) sem quebrar a fase de raciocínio para gerar o JSON. Além disso, é possível usar [ferramentas embutidas](/docs/pt-br/tools/builtin-tools) durante a geração, como pesquisa na internet, geração de documentos e abertura de links.

## Como funciona

Ao fazer uma chamada de inferência, você define **o que o modelo deve fazer** através de instruções e **como ele deve responder** através de um JSON Schema.

A AIVAX valida a resposta do modelo em tempo real. Se o JSON gerado for inválido ou não seguir o schema, a AIVAX tenta corrigir automaticamente a saída quando possível. Se a correção automática não resolver, o modelo recebe feedback sobre os erros e é instruído a corrigir o JSON gerado. Esse ciclo continua até que:
- Um JSON válido seja gerado (sucesso na primeira tentativa ou após correções)
- O limite de `maxAttempts` seja atingido

**Cobrança:** Você é cobrado por cada tentativa de geração. Modelos mais inteligentes geralmente acertam na primeira tentativa, enquanto modelos menores podem precisar de múltiplas tentativas.

**Dica de performance:** Use cache no lado da sua aplicação para dados que não mudam frequentemente (clima, estatísticas diárias, etc). A AIVAX não realiza cache automático.

## Ferramentas embutidas

Você pode usar [ferramentas embutidas](/docs/pt-br/tools/builtin-tools) durante a geração de JSON, permitindo que o modelo:
- Pesquise na internet para obter informações atualizadas
- Execute código para cálculos complexos
- Abra e analise URLs
- Gere imagens
- Busque posts em redes sociais

Essas ferramentas são especialmente úteis para funções que precisam de dados em tempo real ou processamento adicional antes de gerar a resposta estruturada.

## Escolhendo o modo correto

Use `response_schema` quando você quer que a AIVAX seja responsável por validar e corrigir a saída. Esse é o modo mais seguro quando o modelo não suporta structured outputs nativamente, quando você está usando ferramentas, quando o modelo possui raciocínio antes da resposta final ou quando a saída será consumida por um sistema que não tolera JSON inválido. Nesse modo, a AIVAX extrai o JSON da resposta, valida contra o schema e, se necessário, envia feedback ao modelo para tentar novamente até o limite configurado.

Use `response_format` quando você quer aproveitar o structured output nativo do provedor. Esse modo é melhor quando o modelo já é confiável para JSON Schema e você quer reduzir interferência da AIVAX no fluxo. Se a conta estiver com JSON Healing automático ativado, a AIVAX ainda pode aplicar healing mesmo nesse modo. Para controlar isso explicitamente, use `response_format.json_schema.healing_options` quando quiser healing ou mantenha apenas o schema quando quiser passar a responsabilidade ao modelo.

Use `json_only` quando o consumidor da resposta precisa receber apenas o JSON, sem envelope de chat completion. Isso é útil para webhooks, jobs internos, automações e pipelines que esperam um objeto JSON diretamente. Com `stream: true`, o JSON vem em um único chunk e depois `[DONE]`; com `stream: false`, o corpo da resposta contém apenas o JSON final. Esse modo remove metadados úteis como usage e choices, então não é ideal quando você precisa de auditoria detalhada da inferência na própria resposta.

Em produção, trate o schema como contrato. Campos obrigatórios devem estar em `required`; objetos que não devem aceitar campos extras devem usar `additionalProperties: false`; listas devem declarar `items`; strings críticas devem usar `enum`, `format`, `minLength`, `maxLength` ou `pattern` quando possível. Quanto mais explícito o schema, menor a margem para o modelo inventar formatos parecidos. Ao mesmo tempo, evite schemas complexos demais no primeiro teste: comece com o objeto essencial, valide com dados reais e só depois adicione restrições.

## Como usar

Você usa o serviço de respostas estruturadas no mesmo endpoint de chat completions.

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

Veja que o parâmetro `builtin_tools` define quais ferramentas embutidas o modelo pode usar para gerar a resposta estruturada. Note que, o modelo usado deve ser compatível com chamadas de função.

Você também pode usar respostas estruturadas com seus gateways de IA fornecendo o ID do seu gateway no nome do modelo.

## Modos de resposta JSON

Existem duas formas de solicitar respostas estruturadas: com ou sem JSON Healing.

### Com JSON Healing (`response_schema`)

Use `response_schema` para habilitar automaticamente o JSON Healing com o schema fornecido. A AIVAX valida a resposta do modelo e, se inválida, fornece feedback automático para correção:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
    "messages": [{ "role": "user", "content": "Liste 3 capitais europeias" }],
    "response_schema": {
        "type": "object",
        "properties": {
            "capitals": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string" },
                        "country": { "type": "string" }
                    },
                    "required": ["city", "country"]
                }
            }
        },
        "required": ["capitals"]
    }
}
```

**Vantagens do JSON Healing:**

- **Formato controlado por validação:** A AIVAX só entrega a resposta estruturada quando ela pode ser validada no formato JSON especificado; se as tentativas de correção falharem, a chamada retorna erro.
- **Compatível com raciocínio:** O modelo pode raciocinar livremente antes de gerar o JSON
- **Compatível com ferramentas:** Funciona em conjunto com [ferramentas embutidas](/docs/pt-br/tools/builtin-tools) e function calling

A AIVAX extrai automaticamente o JSON da resposta, mesmo que esteja em um bloco markdown ou precedido por texto explicativo.

### Sem JSON Healing (`response_format`)

Use `response_format` quando o modelo nativo já suporta structured outputs (como GPT-4o ou Gemini) e você não precisa de validação adicional:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@openai/gpt-4o",
    "messages": [{ "role": "user", "content": "Liste 3 capitais europeias" }],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "capitals": { "type": "array" }
                }
            }
        }
    }
}
```

Neste modo, o schema é passado diretamente ao modelo sem validação adicional da AIVAX, exceto quando sua conta estiver configurada para ativar JSON Healing automático.

### Habilitando JSON Healing no `response_format`

Você pode habilitar JSON Healing explicitamente passando um objeto `healing_options` dentro de `response_format.json_schema` quando `type` é `json_schema`:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "answer": { "type": "string" }
                }
            },
            "healing_options": {
                "max_attempts": 5
            }
        }
    }
}
```

O parâmetro `max_attempts` define o número máximo de tentativas de correção. Você é cobrado por cada tentativa que falhar. Vale notar que, modelos mais inteligentes tendem a acertar na primeira tentativa.

Se o healing atinge o limite de tentativas com frequência, o problema geralmente está em um destes pontos: o schema está rígido demais para a informação disponível, a instrução não explica o formato esperado, o modelo é pequeno para a tarefa, ferramentas estão retornando texto ruidoso ou a entrada do usuário não contém dados suficientes. Ajuste primeiro a instrução e o schema antes de simplesmente aumentar `max_attempts`, porque mais tentativas podem aumentar custo sem resolver a causa.

## JSON Schema suportado

A AIVAX guia o modelo para gerar uma resposta conforme o JSON Schema fornecido. Quando o modelo gera algo inválido, ele recebe feedback sobre os erros e tenta novamente até que a saída esteja conforme a especificação.

### Tipos e validações suportadas

- **string**:
    - `minLength`, `maxLength`
    - `pattern` (regex)
    - `format`: `date-time`, `email`, `time`, `duration`, `uri`, `url`, `ipv4`, `ipv6`, `uuid`, `guid`
    - `enum`
- **number** e **integer**:
    - `minimum`, `maximum`
    - `exclusiveMinimum`, `exclusiveMaximum`
    - `multipleOf`
- **array**:
    - `items`
    - `uniqueItems`
    - `minItems`, `maxItems`
- **object**:
    - `properties`
    - `required`
- **bool**, **boolean**
- **null**

**Tipos múltiplos:** Você pode especificar múltiplos tipos em um campo:

```json
{
    "type": ["string", "number"]
}
```

> **Nota:** `number` e `integer` são sinônimos. O tipo `integer` não garante que o valor será um número inteiro.

## Suporte de respostas

O JSON healing da AIVAX é compatível com qualquer modelo e qualquer tipo de resposta através do endpoint de [chat completions](https://inference.aivax.net/apidocs#Inferencechatcompletions). Quando usado com `stream = false`, o conteúdo JSON completo virá no conteúdo delta gerado pelo modelo. 

Quando usado com `stream = true` (SSE), o JSON virá em um único chunk completo, mesmo que o modelo gere o contéudo em múltiplos chunks. Isso torna possível o uso de respostas estruturadas com streaming, o que possibilita uma maneira de **contornar timeouts do gateway** para respostas muito demoradas.

## Modo `json_only`

Ao usar o parâmetro especial `json_only` no corpo da requisição:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [{ "role": "user", "content": "Liste 3 capitais europeias" }],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "capitals": { "type": "array" }
                }
            }
        }
    },
    "json_only": true
}
```

A resposta é exatamente o JSON gerado pelo modelo, sem os metadados de geração, deltas, etc. Essa função é compatível com respostas `stream = false` e `stream = true`. No caso de `stream = true`, o JSON completo virá em um único chunk do SSE, sem nenhuma outra marcação ou conteúdo adicional. Após gerar o JSON, uma linha `[DONE]` é enviada para indicar o fim da resposta.

## Padrões práticos

Para extração de dados, escreva a instrução dizendo quais campos devem ser inferidos, quais devem ficar nulos quando ausentes e quais não podem ser inventados. Para classificação, use `enum` no schema e peça justificativa curta em um campo separado, porque isso facilita auditoria sem misturar texto livre ao rótulo final. Para respostas que usam pesquisa web, permita que o modelo use ferramentas antes de gerar o JSON e inclua campos de fonte quando a aplicação precisa rastrear de onde veio a informação. Para formulários conversacionais, use campos opcionais e uma propriedade como `missing_fields` para que o sistema saiba o que perguntar em seguida.

Quando o JSON será salvo em banco ou enviado para outro serviço, valide novamente no seu lado. A AIVAX reduz muito a chance de JSON inválido, mas a aplicação continua sendo responsável por regras de negócio que não cabem em JSON Schema, como verificar se um ID existe, se uma data está dentro de um contrato, se uma categoria é permitida para aquela conta ou se o usuário tem permissão para executar uma ação.
