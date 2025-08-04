# Chat Clients

A chat client provides a user interface through an [AI Gateway](/docs/en/entities/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway's inference and supports deep thinking, research, and text conversation. Multi-modal features, such as sending images and audio, are under development.

You can customize the interface of your chat client with custom CSS and JavaScript, as well as choose the language of the chat features.

## Creating a Chat Session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint by providing additional context for the conversation, such as the user's name, location, etc.

A chat session expires after a certain period for security reasons related to the generated access token. When you call this endpoint by providing a `tag`, you can call the same endpoint multiple times and get the active chat session for the provided tag, or create a new chat session if none exists.

When a session is found on the chat client through the provided `tag`, the session is renewed for the specified period and the context is updated.

A chat session also restores all conversation messages from the same session after disconnection. The user can clear the conversation by clicking the clear conversation button in the top right corner of the chat client. This session uses the limits defined by the chat client, such as the maximum number of messages and tokens in the conversation.

If a session is about to expire, it is renewed for an additional 20 minutes on the user's next message.

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>/sessions
    </span>
</div>

```json
{
    // Time in seconds for the chat to expire. The minimum is 10 minutes. The maximum is 30 days.
    "expires": 3600,
    
    // Optional. Additional context for the AI about the chat.
    "extraContext": "# Additional context\r\n\r\nYou are talking to Eduardo.",
    
    // Optional. Provides an endpoint for the session to get additional context. This endpoint is called on every message sent by the user, updated in real-time without any cache.
    "contextLocation": "https://example.com/context.txt",
    
    // Optional (recommended). An external ID to identify the session later and reuse it whenever calling the same endpoint. It can be the user's ID from your database or a string that facilitates identifying this chat later.
    "tag": "my-user-tag"    
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
        
        // Public URL to converse with the chat
        "talkUrl": "https://console.aivax.net/chat/wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe"
    }
}
```

## Integration Sessions

AIVAX provides two integrations for chat clients: Telegram and WhatsApp (through [Z-Api](https://www.z-api.io/)). Each conversation in an application is an individual session, identified by the conversation ID or the user's phone number.

These sessions follow the rules of the original chat client. Additionally, chat sessions in these integrations have two special commands:

- `/reset`: clears the current context of the session.
- `/usage`: when `debug` is active on the chat client, displays the current usage of the chat in tokens.