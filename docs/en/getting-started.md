# Welcome

Welcome to AIVAX. Our service makes it easier to develop intelligent AI models that use a knowledge base provided by you to converse with the user, answer questions, provide real-time information and more.

To get started, all endpoints should be made on AIVAX's production URL:

```text
https://inference.aivax.net/
```

## Handling errors

All API errors return an HTTP response with a non-OK status (never 2xx or 3xx), and always follow the JSON format:

```json
{
    "error": "A message explaining the error",
    "details": {} // an object containing relevant information about the error. Most of the time it is null
}
```