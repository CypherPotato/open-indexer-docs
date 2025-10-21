# Chat Clients

A chat client provides a user interface through an [AI Gateway](/docs/en/entities/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway inference and supports deep reasoning, research, and text conversation. Multi‑modal features, such as sending images and audio, are under development.

You can customize your chat client’s interface with custom CSS and JavaScript, and you can also choose the language of the chat resources.

## Create a chat session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint providing additional context for the conversation, such as the user’s name, location, etc.

A chat session expires after some time for security of the generated access token. When you call this endpoint providing a `tag` you can call the same endpoint multiple times and obtain the active chat session for the given tag, or create a new chat if no session is in progress.

When a session is found in the chat client via the provided `tag`, the session is renewed for the specified period and the context is updated.

A chat session also restores all conversation messages from the same session after disconnection. The user can clear the conversation by clicking the clear‑conversation button in the upper‑right corner of the chat client. This session uses the limits defined by the chat client, such as maximum messages and tokens in the conversation.

If a session is close to expiring, it is renewed for another 20 minutes on the next user message.

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>/sessions
    </span>
</div>

```json
{
    // Time in seconds for the chat to expire. Minimum is 10 minutes. Maximum is 90 days.
    "expires": 3600,
    
    // Optional. Additional context for the AI about the chat.
    "extraContext": "# Additional context\r\n\r\nYou are talking to Eduardo.",
    
    // Optional. Provides an endpoint for the session to obtain additional context. This endpoint is called on every message sent by the user, updated in real time without any cache.
    "contextLocation": "https://example.com/context.txt",
    
    // Optional (recommended). An external id to identify the session later and reuse it whenever you call the same endpoint. It can be the user ID from your database or a string that makes it easier to identify this chat later.
    "tag": "my-user-tag",
    
    // Optional. Additional key‑value metadata to store in the client. Not visible to the assistant.
    "metadata": {
        "foo": "bar"
    }
}
```

#### Response

```json
{
    "message": null,
    "data": {
        // ID of the created chat session
        "sessionId": "01966f0b-172d-7bbc-9393-4273b86667d2",
        
        // Public access key for the chat
        "accessKey": "wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe",
        
        // Public URL to talk with the chat
        "talkUrl": "https://console.aivax.net/chat/wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe"
    }
}
```

## Integration Sessions

AIVAX provides two integrations for chat clients: Telegram and WhatsApp (through [Z‑Api](https://www.z-api.io/)). Each conversation in an app is an individual session, identified by the conversation ID or the user’s phone number.

These sessions follow the rules of the original chat client. In addition, chat sessions in these integrations have two special commands:

- `/reset`: clears the current session context.
- `/usage`: when `debug` is active in the chat client, displays the current chat usage in tokens.