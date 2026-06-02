# AI Workers

The AI gateway workers are hooks that allow you to control the behavior of your resources remotely via events.

With an external controller configured, events are sent to it, and the controller's response determines whether that action should continue, be aborted, or be configured.

When an event is triggered on the AIVAX side, a POST request is sent to the configured worker with information about the triggered event. Based on its response, the action can be cancelled or configured. There is no cache – the request is made for every event that occurs on your AI gateway. 

The response processing time adds latency to every gateway action, however, it adds a layer of control and moderation that you can manage at any time.

Use workers when a rule needs to be decided outside the prompt. Common examples include validating whether a user has an active subscription, attaching CRM data before inference, removing information that should not reach the model, swapping a message for a normalized version, disabling tools at certain times, replacing a tool's result with data from an internal system, or logging audit information in your own system. If the rule is stable and textual, prefer a system instruction; if it depends on a database, dynamic policy, external identity, or deterministic decision, use a worker.

The worker should be treated as part of the inference critical path. Each event sent to it adds an HTTP request before the conversation can continue, so the endpoint must respond quickly, with a predictable timeout and without unnecessary operations. Avoid long pipelines, slow calls, or fragile dependencies inside the worker. When you need to query external systems, prefer concise responses and caching on your side. A 2xx response lets the flow continue; a non-OK response aborts the event; a response with `Content-Type: application/json+worker-action` allows altering the context or substituting results.

## Security, authentication, and operation

When the account has a configured hook key, AIVAX sends `X-Request-Nonce` in requests to the worker. This header contains a BCrypt hash derived from the account's hook key. The worker must validate this hash before trusting the received body, especially if it performs sensitive actions such as querying customer data, altering context with private information, or releasing tools. See [Authentication](/docs/en/authentication) for validation examples in C#, Python, and JavaScript.

The event body includes `gatewayId`, `moment`, `event.name`, and `event.data`. Always check the `gatewayId` when the same endpoint serves more than one gateway, because this prevents applying one agent's rules to another. Use `externalUserId` for per-user or per-channel decisions, but do not assume it always exists; direct API calls may not have a user tag. Use `metadata` for auxiliary channel or session data, and treat any user-provided data as untrusted.

For failures, choose an explicit behavior. If the worker cannot query your system, it can respond with 2xx and let inference continue without enrichment, or it can respond non-OK and block the action. The first option is better for auxiliary resources; the second is better for authorization, compliance, and rules that cannot fail open. In both cases, log on your endpoint with `gatewayId`, `event.name`, `externalUserId`, execution time, and decision made.

## Operation

When an event is triggered, a POST request is sent to your worker following the format below:

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
                    "content": "bom dia"
                },
                {
                    "role": "assistant",
                    "content": "Bom dia! 😊 Como posso te ajudar hoje?"
                },
                {
                    "role": "user",
                    "content": "tudo bem?"
                }
            ],
            "origin": [
                "SessionsApi"
            ],
            "externalUserId": "mini-app-session@hse075q0q5gftm6jmitvi5",
            "metadata": {}
        }
    }
}
```

The example above illustrates a `message.received` event message with its event arguments.

## Response types

After sending the request, AIVAX waits for your worker's response. There are three possible response types:

| Response | Behavior |
|----------|----------|
| **OK Response (2xx)** | Continues and proceeds with normal event execution. |
| **Other responses** | Aborts and interrupts event execution. |
| **Content-Type `application/json+worker-action`** | Executes the actions specified in the response and continues execution. |

## Events

Currently, the events that can be sent to your worker are:

### `message.received`

Sent when a message is received by the gateway. This event is triggered with the full conversation message history.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": ["SessionsApi"],
        "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1",
        "metadata": {}
    }
}
```

#### Available actions

To perform actions on the `message.received` event, return a response with the header `Content-Type: application/json+worker-action` and a body in the format:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            // lista de ações
        ]
    }
}
```

The available actions for the `rewrites` field are:

| Action | Description | Parameters |
|--------|-------------|------------|
| `clear` | Removes all specified entities from the context. | `argument`: the entity to be removed. Can be `messages`, `meta`, `system`, `tools`, `skills`, or `all`. Defaults to `all` when null. |
| `add-message` | Adds a message to the context. | `message`: OpenAI-compatible message object (e.g., `role` and `content`) |
| `remove-message` | Removes a message from the context by index. | `index`: index of the message to remove |
| `add-system` | Adds a system instruction. | `message`: instruction text |
| `add-tool` | Adds a tool to the context. | `tool`: tool JSON object |
| `add-protocol-tool` | Adds a definition of a [protocol function](/docs/en/tools/protocol-functions) to the context. | `tool`: protocol function definition object |

##### Action examples

**Clear and add message:**

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
                    "content": "Mensagem substituída pelo worker."
                }
            }
        ]
    }
}
```

**Add system instruction:**

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-system",
                "message": "Responda sempre em português formal."
            }
        ]
    }
}
```

**Remove message by index:**

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

### `tool.called`

Sent when an internal server tool is about to be executed.

```json
{
  "name": "tool.called",
  "data": {
    "toolName": "memory_search",
    "toolArguments": {
      "query": "preferências do usuário"
    },
    "origin": "SessionsApi",
    "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1",
    "metadata": {}
  }
}
```

#### Available actions

To perform actions on the `tool.called` event, return a response with the header `Content-Type: application/json+worker-action` and a body in the format:

```json
{
  "type": "tool.called.response",
  "data": {
    "result": "Resultado textual da ferramenta.",
    "messages": []
  }
}
```

Fields of `data`:

| Field | Description |
|-------|-------------|
| `result` | Textual content injected as the tool's result. |
| `messages` | Optional list of additional OpenAI-format messages attached to the conversation context. |

When `tool.called.response` is returned, the result provided by the worker is used instead of the tool's default execution.

## Usage examples

The examples below show common patterns. They should be adapted to your authentication system, user structure, and channel. The most important point is to clearly separate the decision: respond non-OK when the action must stop, respond with an empty 2xx when it should continue unchanged, or respond with `application/json+worker-action` when the context should be modified.

### Blocking unauthorized users

The example below illustrates a [Cloudflare Worker](https://workers.cloudflare.com/) that authenticates a Telegram conversation based on the username:

```js
export default {
  async fetch(request, env, ctx) {
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";
    const ALLOWED_USERNAMES = ["myusername"];

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      if (gatewayId === CHECKING_GATEWAY_ID &&
        event.name == "message.received" &&
        event.data.externalUserId?.startsWith("zp_telegram:")) {
        
        const telegramUsername = event.data.externalUserId.split(':')[0].split('@')[0];

        if (!ALLOWED_USERNAMES.includes(telegramUsername)) {
          return new Response("User is not authed", { status: 400 });
        }
      }
    }

    return new Response();
  }
};
```

### Intercepting and modifying messages

The example below demonstrates how to intercept a message and replace it with another when the user is not authorized:

```js
export default {
  async fetch(request, env, ctx) {
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      if (gatewayId === CHECKING_GATEWAY_ID && event.name == "message.received") {
        const userIsPaid = await checkUserSubscription(event.data.externalUserId);

        if (!userIsPaid) {
          return new Response(JSON.stringify({
            type: "message.received.response",
            data: {
              rewrites: [
                { type: "clear" },
                {
                  type: "add-message",
                  message: {
                    role: "user",
                    content: "O usuário enviou uma mensagem mas ela foi excluída pelo sistema. Informe ao usuário que ele não pagou sua assinatura mensal para continuar."
                  }
                }
              ]
            }
          }), {
            headers: { "Content-Type": "application/json+worker-action" }
          });
        }
      }
    }

    return new Response();
  }
};

async function checkUserSubscription(externalUserId) {
  // Implemente sua lógica de verificação de assinatura aqui
  return true;
}
```

### Replacing a tool with an internal system

The `tool.called` event is useful when you want the model to continue believing it called a tool, but the actual result comes from a system you control. For example, a gateway may have a tool called `memory_search`, `check_order`, or `lookup_customer`; before AIVAX executes the default behavior, your worker can recognize the tool name, query your internal API, and return a textual result to be attached to the conversation.

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
    const order = await fetch(`${env.INTERNAL_API}/orders/${orderId}`, {
      headers: { "Authorization": `Bearer ${env.INTERNAL_API_TOKEN}` }
    });

    if (!order.ok) {
      return new Response(JSON.stringify({
        type: "tool.called.response",
        data: {
          result: `Não foi possível consultar o pedido ${orderId} para o usuário ${externalUserId}. Oriente o usuário a conferir o número do pedido.`
        }
      }), {
        headers: { "Content-Type": "application/json+worker-action" }
      });
    }

    const orderJson = await order.json();

    return new Response(JSON.stringify({
      type: "tool.called.response",
      data: {
        result: `Pedido ${orderJson.id}: status ${orderJson.status}, previsão ${orderJson.eta}.`
      }
    }), {
      headers: { "Content-Type": "application/json+worker-action" }
    });
  }
};
```

This pattern prevents exposing the internal API directly to the model. The model only sees the tool name, parameters, and textual result. The worker remains responsible for authenticating the request, validating the user, calling the internal system, and deciding how much data can return to the context.