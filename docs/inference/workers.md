# AI Workers

AI Gateway workers are HTTP hooks that let an external service control gateway execution at runtime. A worker can allow an event, stop it, rewrite context, add instructions or tools, or replace a server-side tool result.

Use workers when a rule must be decided outside the prompt. Common cases include subscription checks, CRM enrichment, tenant-specific policy, audit logging, dynamic tool blocking, and replacing a model-visible tool result with data from an internal system.

Workers run in the inference critical path. Every worker event adds an HTTP request before the gateway can continue, so the endpoint must respond quickly and predictably.

## Request format

When a configured worker event fires, AIVAX sends a `POST` request to the gateway's worker URL.

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

The exact `event.data` shape depends on the event. Always validate `gatewayId` when one endpoint serves more than one gateway.

## Authentication

When the account has a hook key, AIVAX sends `X-Request-Nonce`. The nonce is a BCrypt hash derived from the account salt. Validate this header before trusting the body, especially when the worker releases private data, changes context, or authorizes tool usage.

Treat `externalUserId`, `metadata`, messages, and tool arguments as untrusted input.

## Response behavior

After sending the request, AIVAX handles the worker response as follows:

| Response | Behavior |
|---|---|
| `Content-Type: application/json+worker-action` | Execute the action described in the JSON body. |
| `2xx` without `application/json+worker-action` | Continue normally. |
| Non-OK response without `application/json+worker-action` | Stop the event. |

If the worker request fails with an HTTP request exception, AIVAX logs the failure and stops the event.

Choose fail-open or fail-closed behavior intentionally. Return `2xx` when enrichment is optional. Return a non-OK response when authorization, compliance, or business policy cannot fail open.

## `message.received`

The `message.received` event fires after the gateway prepares the incoming message context and before the model call.

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

To modify the context, return `Content-Type: application/json+worker-action` with `type: "message.received.response"`:

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

Available rewrite actions:

| Action | Description | Parameters |
|---|---|---|
| `clear` | Removes context elements. | `argument`: `messages`, `meta`, `system`, `tools`, `skills`, `all`, or omitted. |
| `add-message` | Adds a message to the conversation. | `message`: OpenAI-compatible message object. |
| `remove-message` | Removes a message by index. | `index`: zero-based message index. |
| `add-system` | Adds a system instruction. | `message`: instruction text. |
| `add-tool` | Adds an OpenAI-compatible tool definition. | `tool`: tool JSON object. |
| `add-protocol-tool` | Adds a [protocol function](/docs/tools/protocol-functions). | `tool`: protocol function definition. |

### Replace the user context

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

### Remove a message

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

## `tool.called`

The `tool.called` event fires before AIVAX executes an internal server-side tool.

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

Return a non-OK response to block the tool call. Return `2xx` to let AIVAX execute the tool normally.

To replace the tool result, return `Content-Type: application/json+worker-action` with `type: "tool.called.response"`:

```json
{
    "type": "tool.called.response",
    "data": {
        "result": "Order A123 is paid and scheduled for delivery tomorrow.",
        "messages": []
    }
}
```

Fields of `data`:

| Field | Description |
|---|---|
| `result` | Textual content injected as the tool result. |
| `messages` | Optional additional OpenAI-format messages attached to the conversation context. |

When `tool.called.response` is returned, AIVAX uses the worker-provided result instead of executing the default tool handler.

## Example: blocking unauthorized users

The example below shows a Cloudflare Worker that blocks a gateway call when the external user is not allowed.

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

## Example: replacing a tool with an internal system

Use `tool.called` when the model should see a tool result, but the actual data should come from your system.

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

This pattern prevents exposing the internal API directly to the model. The worker remains responsible for authenticating the request, validating the user, calling the internal system, and deciding how much data can return to the model context.
