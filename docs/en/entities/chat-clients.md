# Chat Clients

A chat client provides a user interface through an [AI Gateway](/docs/en/entities/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway's inference and supports deep thinking, research, and text conversation. Multi-modal features, such as sending images and audio, are under development.

> [!NOTE]
>
> AIVAX never stores the content of a chat between a client and the user. You can use JavaScript for this task, but under your responsibility for usage and storage.

You can customize the interface of your chat client with custom CSS and JavaScript, as well as choose the language of the chat features.

## Creating a Chat Session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint by providing additional context for the conversation, such as the user's name, location, etc.

A chat session expires after some time for security of the generated access token. When you call this endpoint by providing a `tag`, you can call the same endpoint multiple times and get the active chat session for the informed tag, or create a new chat if there is no ongoing session.

A chat session also restores all conversation messages from the same session after disconnection. The user can clear the conversation by clicking the clear conversation button in the top right corner of the chat client. This session uses the limits defined by the chat client, such as the maximum number of messages and tokens in the conversation.

A session is automatically renewed for another 3 days when receiving a message from the user.

> [!IMPORTANT]
>
> It is only possible to determine the number of tokens used in a message when using a [model provided by AIVAX](/docs/en/models). If you use an external model, the `limitingParameters.userInputMaxTokens` property will be ignored.

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>/sessions
    </span>
</div>

```json
{
    // Optional. Additional context for the AI about the chat.
    "extraContext": "# Additional context\r\n\r\nYou are talking to Eduardo.",
    
    // Time in seconds for the chat to expire. The minimum is 10 minutes. The maximum is 30 days.
    "expires": 3600,

    // Optional (recommended). An external ID to identify the session later and reuse it whenever calling the same endpoint. It can be the ID of the user in your database or a string that facilitates the identification of this chat later.
    "tag": "my-user-tag"
}
```

#### Response

```json
{
    "message": null,
    "data": {
        // ID of the created chat session.
        "sessionId": "01966f0b-172d-7bbc-9393-4273b86667d2",

        // Public access key of the chat.
        "accessKey": "wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe",

        // Public URL to converse with the chat.
        "talkUrl": "https://preview-s01.proj.pw/www/web-chat-clients/wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe"
    }
}
```