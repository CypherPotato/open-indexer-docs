# Respostas estruturadas

AIVAX possui um mecanismo de respostas estruturadas que funciona com **qualquer LLM**, mesmo aqueles que não suportam nativamente structured outputs. A AIVAX analisa o esquema JSON fornecido e valida manualmente se o modelo respondeu conforme esperado. Quando o modelo falha, a AIVAX notifica os erros automaticamente até que ele gere um JSON válido. Esse mecanismo é chamado de **JSON Healing**.

Esse processo continua até que o parâmetro o máximo de tentavias seja atingido ou um JSON válido seja gerado. A AIVAX interpreta JSONs em blocos markdown, precedidos ou antecedidos por texto, e extrai a resposta final automaticamente.

Você pode usar respostas estruturadas com modelos que possuem raciocínio (reasoning) sem quebrar a fase de raciocínio para gerar o JSON. Além disso, é possível usar [ferramentas embutidas](/docs/builtin-tools) durante a geração, como pesquisa na internet, geração de documentos e abertura de links.

## Como funciona

Ao fazer uma chamada de inferência, você define **o que o modelo deve fazer** através de instruções e **como ele deve responder** através de um JSON Schema.

A AIVAX valida a resposta do modelo em tempo real. Se o JSON gerado for inválido ou não seguir o schema, o modelo recebe feedback automático sobre os erros e tenta novamente. Esse ciclo continua até que:
- Um JSON válido seja gerado (sucesso na primeira tentativa ou após correções)
- O limite de `maxAttempts` seja atingido

**Cobrança:** Você é cobrado por cada tentativa de geração. Modelos mais inteligentes geralmente acertam na primeira tentativa, enquanto modelos menores podem precisar de múltiplas tentativas.

**Dica de performance:** Use cache no lado da sua aplicação para dados que não mudam frequentemente (clima, estatísticas diárias, etc). A AIVAX não realiza cache automático.

## Ferramentas embutidas

Você pode usar [ferramentas embutidas](/docs/builtin-tools) durante a geração de JSON, permitindo que o modelo:
- Pesquise na internet para obter informações atualizadas
- Execute código para cálculos complexos
- Abra e analise URLs
- Gere imagens
- Busque posts em redes sociais

Essas ferramentas são especialmente úteis para funções que precisam de dados em tempo real ou processamento adicional antes de gerar a resposta estruturada.

## Como usar

Você usa o serviço de respostas estruturadas no mesmo endpoint de chat completions.

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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
        /v1/chat-completions
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

- **Garantia de formato:** O modelo sempre responderá no formato JSON especificado
- **Compatível com raciocínio:** O modelo pode raciocinar livremente antes de gerar o JSON
- **Compatível com ferramentas:** Funciona em conjunto com [ferramentas embutidas](/docs/builtin-tools) e function calling

A AIVAX extrai automaticamente o JSON da resposta, mesmo que esteja em um bloco markdown ou precedido por texto explicativo.

### Sem JSON Healing (`response_format`)

Use `response_format` quando o modelo nativo já suporta structured outputs (como GPT-4o ou Gemini) e você não precisa de validação adicional:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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

Neste modo, o schema é passado diretamente ao modelo sem validação adicional da AIVAX.

### Habilitando JSON Healing no `response_format`

Você pode habilitar JSON Healing explicitamente passando um objeto `options` dentro de `response_format` quando `type` é `json_schema`:

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
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
            }
        },
        "options": {
            "max_attempts": 5
        }
    }
}
```

O parâmetro `max_attempts` define o número máximo de tentativas de correção. Você é cobrado por cada tentativa que falhar. Vale notar que, modelos mais inteligentes tendem a acertar na primeira tentativa.

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