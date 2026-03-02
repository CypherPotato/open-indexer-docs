# AI Workers

The AI gateway workers are hooks that allow you to control the behavior of your resources remotely through events.

With an external controller configured, events are sent to it, and the response from your controller determines whether that action should continue, be aborted, or be configured.

When an event is triggered on the AIVAX side, a POST request is fired to the configured worker with information about the triggered event. Based on its response, the action can be cancelled or configured. There is no caching – the request is made on every event that occurs in your AI gateway.

The processing time of the response adds latency to every gateway action, however, it adds a layer of control and moderation that you can manage at any time.

## How it works

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
| **OK response (2xx)** | Continues and proceeds with the normal execution of the event. |
| **Other responses** | Aborts and stops the execution of the event. |
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
            // list of actions
        ]
    }
}
```

The actions available for the `rewrites` field are:

| Action | Description | Parameters |
|--------|-------------|------------|
| `clear` | Removes all specified entities from the context. | `argument`: the entity to be removed. Can be `messages`, `meta`, `system`, `tools`, `skills` or `all`. Defaults to `all` when null. |
| `add-message` | Adds a message to the context. | `message`: OpenAI‑compatible message object (e.g., `role` and `content`) |
| `remove-message` | Removes a message from the context by index. | `index`: index of the message to be removed |
| `add-system` | Adds a system instruction. | `message`: instruction text |
| `add-tool` | Adds a tool to the context. | `tool`: JSON object of the tool |
| `add-protocol-tool` | Adds a definition of a [protocol function](/docs/en/protocol-functions) to the context. | `tool`: protocol function definition object |

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

`data` fields:

| Field | Description |
|-------|-------------|
| `result` | Textual content injected as the tool's result. |
| `messages` | Optional list of additional OpenAI‑format messages attached to the conversation context. |

When `tool.called.response` is returned, the result provided by the worker is used instead of the tool's default execution.

## Examples

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

The example below shows how to intercept a message and replace it with another when the user is not authorized:

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
  // Implement your subscription‑checking logic here
  return true;
}
```