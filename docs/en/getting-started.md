# Welcome

Welcome to Open Indexer. Our service makes it easier to develop intelligent AI models that use a knowledge base provided by you to converse with the user, answer questions, provide real-time information, and more.

To get started, all endpoints must be made to the Open Indexer production URL:

```text
https://open-indexer-api.proj.pw/
```

## Concepts and definitions

Understand the concepts used by the API below:

- **Account:** represents a user account, which has an authentication token.
    - **Collection:** represents a collection of knowledge documents. A user can have multiple document collections.
        - **Document:** represents a fact, a single piece of knowledge, and an item in a collection. A collection can have multiple documents.
    - **AI Gateway:** represents an AI gateway that benefits from or does not use a knowledge collection, such as a plug-and-play knowledge middleware for a model.
        - **Embedded model:** represents an AI model that Open Indexer provides to the user.
        - **Chat client:** represents a user interface that makes the AI gateway available through an interactive online chat.
            - **Chat session**: hosts a conversation and context of a chat client.

## Handling errors

All API errors return an HTTP response with a non-OK status (never 2xx or 3xx), and always follow the JSON format:

```json
{
    "error": "An error explanation message",
    "data": {} // an object containing relevant error information. Most of the time it is null
}
```