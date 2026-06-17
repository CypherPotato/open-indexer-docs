# Chat Clients

A chat client provides a user interface via an [AI Gateway](/docs/inference/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway inference and supports deep thinking, search, text conversation, and image sending. Audio features depend on the integration and client configuration.

You can customize the chat client interface with CSS, custom JavaScript, colors, labels, suggestion buttons, frame origins, input modes, and the language used by the chat resources.

## How the chat client works

A chat client is a session layer on top of an AI Gateway. The gateway defines the assistant’s behavior; the chat client defines how an end user converses with it, how the session is identified, how long it lasts, what limits are applied, which visual resources appear, and how messages enter and exit through external channels. This separation is important: you can use the same gateway in an internal API, a web widget, Telegram, and WhatsApp, but each channel will have its own rules for identity, attachments, formatting, commands, and message delivery.

Each session maintains a message history, additional context, metadata, conversation token, and an optional external identifier. When you create a session with a `tag`, AIVAX tries to reuse the active session for that tag instead of creating a new conversation. This allows a user to return to the widget or send another message through the same channel without immediately losing context. When the session has no `tag`, it functions as an independent conversation controlled by the access token generated at creation.

The `tag` also serves as the connection point between the chat client, memory, calendar, workers, and integrations. Tools like memory need a stable identifier to know who a preference or persistent information belongs to. Workers receive `externalUserId` to apply rules per user, per channel, or per external account. WhatsApp and Telegram integrations use the conversation ID, phone number, or user to retrieve the correct session. Therefore, choose a stable, non‑sensitive, unique `tag` per user or conversation.

## Creating a chat session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint providing additional context for the conversation, such as the user’s name, location, etc.

A chat session expires after the period requested at creation time. The API default is 3,600 seconds, the minimum is 10 minutes, and the maximum is 90 days. When you call this endpoint with a `tag`, you can call the same endpoint multiple times and obtain the chat session that is active for the given tag, or create a new chat if no session is in progress.

When a session is found in the chat client via the provided `tag`, the session is renewed for the specified period and the context is updated.

A chat session also restores all messages from the same session’s conversation after disconnection. The user can clear the conversation by clicking the clear conversation button in the upper right corner of the chat client. This session uses the limits defined by the chat client, such as maximum messages and tokens in the conversation.

If a session is close to expiring, the next user message renews it for at least 30 additional minutes.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

When creating a session, use `extraContext` for information that helps the assistant in that conversation but should not become permanent memory: displayed name, client plan, preferred language, referrer page, product the user is viewing, order number, or current flow state. Do not use this field for secrets, internal tokens, or data the model should not see. The additional context goes into inference and can influence responses, tools, and workers.

You can also provide `contextLocation`, a URL that AIVAX loads during response generation and appends to the session context. Use it for server-controlled context that may change over time, and make sure the URL is reachable by AIVAX.

The web chat accepts text messages and attachments. Images, files, videos, and audio are materialized before inference; supported image, file, video, and audio types can be forwarded as multimodal content when the selected model and gateway configuration support them. Audio can also be synthesized as a response when the chat client’s audio synthesis setting is active. When a channel cannot embed an attachment, AIVAX turns unsupported content into a textual attachment notice so that the assistant can reply clearly.

## Integration sessions

AIVAX provides integrations for chat clients via Telegram and WhatsApp, including [Z-Api](https://www.z-api.io/), Evolution API, and Kapso. Each conversation in an app is an individual session, identified by the conversation ID, chat ID, or the user’s phone number, depending on the provider. Integration sessions default to a three-hour duration unless the integration parameters specify another value.

These sessions obey the original chat client rules. Additionally, chat sessions in these integrations have two special commands:

- `/reset`: clears the current session context.
- `/usage`: when `debug` is active in the chat client, displays the current chat usage in tokens.

Integrations treat the channel as the source of messages, but inference continues to be performed by the AI Gateway associated with the chat client. In Telegram, the conversation receives additional instructions about formatting and expected channel behavior. In WhatsApp, each provider has its own webhook details, media download, and response sending; Z-Api, Evolution API, and Kapso are different paths to the same operational goal. In all cases, user messages enter the session, are materialized as inference‑compatible messages, and the assistant’s response is sent back via the integration’s messenger.

Use Telegram when you need a simple bot with users identifiable by chat and easy‑to‑test commands. Use WhatsApp when the user’s primary support channel is already the phone and the conversation needs to happen in a daily app. Use the web widget when you want to embed the assistant in a website, product, support center, or dashboard. The channel choice should not change the gateway’s essential content, but may require adjustments to tone, response size, formatting, and attachment tolerance.

For production, configure limits on the chat client before opening the channel to the public. `messagesPerHour` controls the per-session hourly message limit, and `maxMessages` controls the maximum messages retained in a session. Session duration is controlled when creating web sessions and by each integration’s `sessionDuration`. Enable debug commands only for internal testing. If the assistant uses memory, explain to the user when information may be remembered and avoid storing sensitive data. If using workers, use the `externalUserId` to apply blocks, subscription rules, profile enrichment, or auditing without embedding that logic in the model instructions.

When an integration does not respond as expected, diagnose in order: confirm that the chat client is associated with the correct gateway, verify that the integration is saved with the correct parameters, send a simple message without an attachment, confirm that the session was created or reused via the tag, check for a per‑hour message limit, check account balance, and only then investigate the model, tools, and RAG. This order reduces confusion because it separates channel, session, billing, and inference issues.
