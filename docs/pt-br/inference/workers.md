# Trabalhadores de IA

Os trabalhadores do AI Gateway são hooks HTTP que permitem que um serviço externo controle a execução do gateway em tempo de execução. Um trabalhador pode permitir um evento, interrompê-lo, reescrever o contexto, adicionar instruções ou ferramentas, ou substituir o resultado de uma ferramenta do lado do servidor.

Use trabalhadores quando uma regra deve ser decidida fora do prompt. Casos comuns incluem verificações de assinatura, enriquecimento de CRM, política específica de locatário, registro de auditoria, bloqueio dinâmico de ferramentas e substituição de um resultado de ferramenta visível ao modelo por dados de um sistema interno.

Os trabalhadores executam no caminho crítico da inferência. Cada evento de trabalhador adiciona uma requisição HTTP antes que o gateway possa continuar, portanto o endpoint deve responder rapidamente e de forma previsível.

## Formato da requisição

Quando um evento de trabalhador configurado dispara, a AIVAX envia uma requisição `POST` para a URL do trabalhador do gateway.

```json
{
    "gatewayId": "019a6afb-5a03-7b83-a1a2-760bd1ecd11c",
    "moment": "2025-12-29T17:04:39",
    "event": {
        "name": "message.received",
        "data": {
            "messages": [
                {
                    "role": "system",
                    "content": "User local date is Monday, December 29, 2025 (timezone is America/Sao_Paulo)"
                },
                {
                    "role": "user",
                    "content": "Good morning"
                }
            ],
            "origin": "ChatCompletionsApi",
            "externalUserId": "customer-123",
            "metadata": {}
        }
    }
}
```

A forma exata de `event.data` depende do evento. Sempre valide `gatewayId` quando um endpoint serve mais de um gateway.

## Autenticação

Quando a conta possui uma chave de hook, a AIVAX envia `X-Request-Nonce`. O nonce é um hash BCrypt derivado do sal da conta. Valide este cabeçalho antes de confiar no corpo, especialmente quando o trabalhador libera dados privados, altera o contexto ou autoriza o uso de ferramentas.

Trate `externalUserId`, `metadata`, mensagens e argumentos de ferramentas como entrada não confiável.

## Comportamento da resposta

Depois de enviar a requisição, a AIVAX lida com a resposta do trabalhador da seguinte forma:

| Resposta | Comportamento |
|---|---|
| `Content-Type: application/json+worker-action` | Executar a ação descrita no corpo JSON. |
| `2xx` sem `application/json+worker-action` | Continuar normalmente. |
| Resposta não OK sem `application/json+worker-action` | Interromper o evento. |

Se a requisição do trabalhador falhar com uma exceção de requisição HTTP, a AIVAX registra a falha e interrompe o evento.

Escolha intencionalmente o comportamento fail-open ou fail-closed. Retorne `2xx` quando o enriquecimento for opcional. Retorne uma resposta não OK quando a autorização, conformidade ou política de negócios não puder falhar aberto.

## `message.received`

O evento `message.received` dispara após o gateway preparar o contexto da mensagem recebida e antes da chamada ao modelo.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

Para modificar o contexto, retorne `Content-Type: application/json+worker-action` com `type: "message.received.response"`:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-system",
                "message": "Answer in formal English."
            }
        ]
    }
}
```

Ações de reescrita disponíveis:

| Ação | Descrição | Parâmetros |
|---|---|---|
| `clear` | Remove elementos do contexto. | `argument`: `messages`, `meta`, `system`, `tools`, `skills`, `all`, ou omitido. |
| `add-message` | Adiciona uma mensagem à conversa. | `message`: objeto de mensagem compatível com OpenAI. |
| `remove-message` | Remove uma mensagem por índice. | `index`: índice da mensagem baseado em zero. |
| `add-system` | Adiciona uma instrução de sistema. | `message`: texto da instrução. |
| `add-tool` | Adiciona uma definição de ferramenta compatível com OpenAI. | `tool`: objeto JSON da ferramenta. |
| `add-protocol-tool` | Adiciona uma [função de protocolo](/docs/pt-br/tools/protocol-functions). | `tool`: definição da função de protocolo. |
| `add-mcp-source` | Adiciona as ferramentas descobertas de uma fonte [MCP](/docs/pt-br/tools/mcp) ao contexto. | `source`: objeto de fonte MCP com `url`, `headers`, `name` e/ou `cacheDuration`. |

### Substituir o contexto do usuário

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "clear"
            },
            {
                "type": "add-message",
                "message": {
                    "role": "user",
                    "content": "The original message was removed by an external policy check. Tell the user they need an active subscription to continue."
                }
            }
        ]
    }
}
```

### Remover uma mensagem

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "remove-message",
                "index": 0
            }
        ]
    }
}
```

### Adicionar uma fonte MCP temporária

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-mcp-source",
                "source": {
                    "name": "Internal CRM",
                    "url": "https://crm.example.com/mcp",
                    "headers": {
                        "Authorization": "Bearer server-token"
                    },
                    "cacheDuration": 600
                }
            }
        ]
    }
}
```

Use `add-mcp-source` quando a lista de ferramentas precisa depender da mensagem, usuário, canal ou de uma política externa. A AIVAX lista as ferramentas do servidor MCP, converte cada esquema em uma função chamável pelo modelo e disponibiliza essas ferramentas apenas para aquela inferência. Para fontes permanentes, configure o MCP diretamente no AI Gateway.

## `tool.called`

O evento `tool.called` dispara antes da AIVAX executar uma ferramenta interna do lado do servidor.

```json
{
    "name": "tool.called",
    "data": {
        "toolName": "check_order",
        "toolArguments": {
            "order_id": "A123"
        },
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

Retorne uma resposta não OK para bloquear a chamada da ferramenta. Retorne `2xx` para permitir que a AIVAX execute a ferramenta normalmente.

Para substituir o resultado da ferramenta, retorne `Content-Type: application/json+worker-action` com `type: "tool.called.response"`:

```json
{
    "type": "tool.called.response",
    "data": {
        "result": "Order A123 is paid and scheduled for delivery tomorrow.",
        "messages": []
    }
}
```

Campos de `data`:

| Campo | Descrição |
|---|---|
| `result` | Conteúdo textual injetado como resultado da ferramenta. |
| `messages` | Mensagens adicionais em formato OpenAI opcionalmente ao contexto da conversa. |

Quando `tool.called.response` é retornado, a AIVAX usa o resultado fornecido pelo trabalhador em vez de executar o manipulador padrão da ferramenta.

## Exemplo: bloqueando usuários não autorizados

O exemplo abaixo mostra um Cloudflare Worker que bloqueia uma chamada ao gateway quando o usuário externo não é permitido.

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();

    if (body.gatewayId !== env.CHECKING_GATEWAY_ID) {
      return new Response();
    }

    if (body.event?.name !== "message.received") {
      return new Response();
    }

    const externalUserId = body.event.data.externalUserId;
    const allowedUsers = new Set((env.ALLOWED_USERS || "").split(","));

    if (!allowedUsers.has(externalUserId)) {
      return new Response("User is not authorized", { status: 403 });
    }

    return new Response();
  }
};
```

## Exemplo: substituindo uma ferramenta por um sistema interno

Use `tool.called` quando o modelo deve ver o resultado de uma ferramenta, mas os dados reais devem vir do seu sistema.

```js
export default {
  async fetch(request, env) {
    const body = await request.json();

    if (body.event?.name !== "tool.called") {
      return new Response();
    }

    const { toolName, toolArguments, externalUserId } = body.event.data;

    if (toolName !== "check_order") {
      return new Response();
    }

    const orderId = toolArguments?.order_id;
    const orderResponse = await fetch(`${env.INTERNAL_API}/orders/${orderId}`, {
      headers: {
        "Authorization": `Bearer ${env.INTERNAL_API_TOKEN}`
      }
    });

    if (!orderResponse.ok) {
      return new Response(JSON.stringify({
        type: "tool.called.response",
        data: {
          result: `The order ${orderId} could not be retrieved for user ${externalUserId}. Ask the user to confirm the order number.`
        }
      }), {
        headers: {
          "Content-Type": "application/json+worker-action"
        }
      });
    }

    const order = await orderResponse.json();

    return new Response(JSON.stringify({
      type: "tool.called.response",
      data: {
        result: `Order ${order.id}: status ${order.status}, estimated delivery ${order.eta}.`
      }
    }), {
      headers: {
        "Content-Type": "application/json+worker-action"
      }
    });
  }
};
```

Esse padrão evita expor a API interna diretamente ao modelo. O trabalhador continua responsável por autenticar a requisição, validar o usuário, chamar o sistema interno e decidir quanta dados podem ser retornados ao contexto do modelo.