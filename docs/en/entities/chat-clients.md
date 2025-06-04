# Chat Clients

A chat client provides a user interface through an [AI Gateway](/docs/en/entities/ai-gateway) that allows the user to converse with their assistant. A chat client is integrated with the AI gateway's inference and supports deep thinking, research, and text conversation. Multi-modal features, such as sending images and audio, are under development.

> [!NOTE]
>
> The Open Indexer never stores the content of a chat between a client and the user. You can use JavaScript for this task, but it is your responsibility to use and store it.

You can customize the interface of your chat client with custom CSS and JavaScript, as well as choose the language of the chat features.

## Creating a Chat Client

Create a new chat client.

<div class="request-item get">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/
    </span>
</div>

```json
{
    // Specifies the public name of your chat client
    "name": "My Assistant",
    
    // Specifies the ID of the AI gateway to be used by the chat
    "aiGatewayId": "01965b64-a8eb-716c-892d-880159a9f12d",

    "clientParameters": {
        
        // Optional. Specifies the language code to be used in the chat for most elements, such as error messages, buttons, etc.
        //      Values: pt-BR, en
        "languageCode": "pt-BR" | "en",

        // Optional. Specifies a JavaScript code to execute in the chat.
        "customScripts": null,

        // Optional. Specifies a CSS code to apply custom styles to the chat.
        "customStyles": null,

        // Optional. Specifies the highlight color of the chat client elements.
        "primaryColor": "#eabe44",

        // Optional. Specifies the title of the chat page.
        "pageTitle": "Assistant",

        // Optional. Specifies the title when entering the chat for the first time.
        "helloLabel": "It's great to see you here.",

        // Optional. Specifies the subtitle when entering the chat for the first time.
        "helloSubLabel": "I'm your assistant.",
        
        // Optional. Specifies the placeholder of the message sending field.
        "textAreaPlaceholder": "Talk to the assistant",

        // Optional. Specifies an image/logo to display in the chat for the first time.
        "logoImageUrl": null,
        
        // Optional. Enables debugging features.
        "debug": true,
        
        // Optional. Specifies whether the chat supports multi-modal media processing, specifying which buttons will be visible to send multimedia content to the model.
        // Document is processed internally as markdown by the Open Indexer.
        "inputModes": ["Image", "Audio", "Document"],
        
        // Optional. Specifies which origins should be allowed to embed the chat client in an iframe. If this field is empty, any origin will be accepted.
        "allowedFrameOrigins": ["https://my-domain.com.br"],
        
        // Optional. Specifies conversation suggestion buttons when starting a new chat session. You can add as many buttons as you want, but it is recommended to have up to 3 buttons.
        "suggestionButtons": [
            {
                // Title to be displayed on the button.
                "label": "How to buy a car?",
                // Prompt to be sent to the model.
                "prompt": "Where and how can I buy a car in your store?"
            },
            ...
        ]
    },
    
    "limitingParameters": {
        
        // Optional. Specifies how many messages the user can send per hour in the chat. This option is tracked by the userTag of the session.
        "messagesPerHour": 30,
        
        // Optional. Specifies the limit of messages (for the user and AI) that a session can have.
        "maxMessages": 300
    }
}
```

#### Response

```json
{
    "message": null,
    "data": {
        "id": "01965b65-e95e-7795-848c-ff0919ef1436"
    }
}
```

## Editing a Chat Client

The body of this request is exactly the same as creating a chat client.

<div class="request-item get">
    <span>PUT</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": "Web client updated successfully.",
    "data": null
}
```

## Listing Chat Clients

Get a list of created chat clients.

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/web-chat-client/
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": [
        {
            "id": "01965b59-daf6-7809-94c8-2a65b7264dba",
            "name": "My Chat Client"
        },
        ...
    ]
}
```

## Viewing a Specific Chat Client

Get details of an existing chat client.

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": {
        "name": "My Chat Client",
        "aiGateway": {
            "id": "01965b59-49ff-7753-8327-b3b6a6a871f2",
            "name": "gateway-t1",
            "knowledgeCollection": {
                "id": "01965b54-7fbd-70cd-982b-604de002ac0a",
                "name": "Car Information"
            }
        },
        "limitingParameters": {
            "messagesPerHour": 30,
            "userInputMaxTokens": 1024,
            "maxMessages": 500
        },
        "clientParameters": {
            "languageCode": "pt-BR",
            "customScripts": null,
            "customStyles": null,
            "primaryColor": "#f011d2",
            "pageTitle": "Lyra",
            "helloLabel": "It's great to see you here.",
            "helloSubLabel": "I'm your assistant.",
            "textAreaPlaceholder": "Talk to the assistant",
            "logoImageUrl": null,
            "debug": true,
            "allowedFrameOrigins": []
        }
    }
}
```

## Creating a Chat Session

A chat session is where you create a conversation between your chat client and the user. You can call this endpoint providing additional context for the conversation, such as the user's name, location, etc.

A chat session expires after a certain time for security reasons of the generated access token. When you call this endpoint providing a `tag`, you can call the same endpoint multiple times and get the active chat session for the informed tag, or create a new chat if there is no ongoing session.

A chat session also restores all conversation messages from the same session after disconnection. The user can clear the conversation by clicking the clear conversation button in the top right corner of the chat client. This session uses the limits defined by the chat client, such as the maximum number of messages and tokens in the conversation.

A session is automatically renewed for another 3 days when receiving a message from the user.

> [!IMPORTANT]
>
> It is only possible to determine the number of tokens used in a message when using a [model provided by the Open Indexer](/docs/en/models). If you use an external model, the `limitingParameters.userInputMaxTokens` property will be ignored.

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

    // Optional (recommended). An external ID to identify the session later and reuse it whenever you call the same endpoint. It can be the ID of the user in your database or a string that facilitates the identification of this chat later.
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