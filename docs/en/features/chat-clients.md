# Chat Clients

A chat client provides a user interface through an [AI Gateway](/docs/en/entities/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway inference and supports deep reasoning, research, and text conversation. Multi‑modal features, such as sending images and audio, are under development.

You can customize your chat client’s interface with custom CSS and JavaScript, and you can also choose the language of the chat resources.

## Create a chat session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint providing additional context for the conversation, such as the user’s name, location, etc.

A chat session expires after some time for security of the generated access token. When you call this endpoint providing a `tag` you can call the same endpoint multiple times and obtain the active chat session for the given tag, or create a new chat if no session is in progress.

When a session is found in the chat client via the provided `tag`, the session is renewed for the specified period and the context is updated.

A chat session also restores all conversation messages from the same session after disconnection. The user can clear the conversation by clicking the clear‑conversation button in the upper‑right corner of the chat client. This session uses the limits defined by the chat client, such as maximum messages and tokens in the conversation.

If a session is close to expiring, it is renewed for another 20 minutes on the next user message.

For details on how to create a chat session, see the endpoint [Create Web Chat Session](https://inference.aivax.net/apidocs#CreateWebChatSession).

## Integration sessions

AIVAX provides two integrations for chat clients: Telegram and WhatsApp (via [Z-Api](https://www.z-api.io/)). Each conversation in an app is an individual session, identified by the conversation ID or the user’s phone number.

These sessions follow the rules of the original chat client. Additionally, chat sessions in these integrations have two special commands:

- `/reset`: clears the current session context.
- `/usage`: when `debug` is active in the chat client, displays the current chat usage in tokens.