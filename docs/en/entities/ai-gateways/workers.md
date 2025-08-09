# AI Workers

The AI gateway workers are resources of the [AI Gateways](/docs/en/entities/ai-gateways/ai-gateway) that allow you to control the behavior of your resources remotely through events.

With an external controller configured, events are sent to it, and the response from your controller determines whether that action should continue, be aborted, or be configured.

When an event is triggered on the AIVAX side, a POST request is sent to the configured worker with information about the triggered event. Based on its response, the action can be cancelled or configured. There is no caching – the request is made for every event that occurs in your AI gateway.

The processing time of the response adds latency to each gateway action, however, it adds a layer of control and moderation that you can manage at any time.

## Creating an AI Worker

When an event is triggered, a POST request is sent to your worker following the format below:

```json
{
  "gatewayId": "0197dda5-985f-7d76-96e5-0d0451c539f6",
  "moment": "2025-08-09T00:21:40",
  "event": {
    "name": "message.received",
    "data": {
      "message": {
        "role": "user",
        "content": "Bom dia!"
      },
      "origin": [
        "SessionsApi"
      ],
      "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1"
    }
  }
}
```

The example above illustrates a `message.received` event message with its event arguments.

After sending the request, AIVAX waits for the response from your worker, and with it:
- OK response (2xx): **continues** and proceeds with the normal execution of the event.
- Other responses: **aborts** and stops the execution of the event.

## List of events

Currently, the events that can be sent to your worker are:

- `message.received` – sent when a message is received by the gateway. This event is triggered with the last message received in the context, which may be from the user or not.

```js
{
    "name": "message.received",
    "data": {
      "message": {}, // chat/completions message entity
      "origin": [
        "SessionsApi" // message origin
      ],
      "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1"
    }
  }
```

## Example

The example below illustrates a [Cloudflare Worker](https://workers.cloudflare.com/) that authenticates a Telegram conversation based on the username of the conversation:

```js
export default {
  
  async fetch(request, env, ctx) {
    
    // The ID of the gateway we are expecting to handle
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";
    const ALLOWED_USERNAMES = [
      "myusername"
    ];

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      // Checks if it is a message received event, if it is the gateway we are
      // managing in the worker, and if this message comes from a Telegram chat
      if (gatewayId === CHECKING_GATEWAY_ID &&
        event.name == "message.received" &&
        event.data.externalUserId?.startsWith("zp_telegram:")) {
        
        // obtains the Telegram username, which is between the ':' and '@' of the externalUserId
        const telegramUsername = event.data.externalUserId.split(':')[0].split('@')[0];

        // checks if the user is allowed in the integration
        if (!ALLOWED_USERNAMES.includes(telegramUsername)) {

          // the user does not exist in the list of allowed usernames, therefore returns a non-ok response
          // indicating that the message should not be sent
          return new Response("User is not authed", { status: 400 });
        }
      }
    }

    // continues execution
    return new Response();
  }
};
```