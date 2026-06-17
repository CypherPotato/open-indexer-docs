# Authentication

AIVAX authenticates API requests with account API keys. The authentication middleware accepts keys from:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefer the `Authorization` header for server-to-server calls. Use the query parameter only when a client or integration cannot send headers, because URLs can be logged by proxies, browsers, and monitoring tools.

## API key types

AIVAX has two key families because browser-facing and server-side use cases have different risk profiles. If your code runs on your server, use a private key and keep it out of client bundles, logs, and public repositories. If your code runs in a browser or another environment where the key can be inspected by the end user, use a public key and keep the workflow limited to routes designed for public access.

| Type | Prefix | Intended use | Access |
| --- | --- | --- | --- |
| Private key | `sk-aiv-acc` | Server-side integrations and administrative API calls. | Authenticated account APIs and OpenAI-compatible inference. |
| Public key | `pk-aiv-` | Restricted client-side calls to explicitly public routes. | Public RAG query/answer routes and restricted chat-completion calls. |

Public keys are currently accepted only on routes marked public in the backend, including RAG semantic search, RAG answer generation, and chat completions. When a public key calls chat completions:

- The `model` must be a full AI Gateway UUID; direct integrated-model calls and gateway slug lookup are disabled.
- Gateway slug lookup is disabled.
- MCP sources, protocol functions, built-in tools, Bash, skills, and sentinel options are stripped from the request.
- Only these request parameters are accepted: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, and `stream`.
- Request and token rate limits are applied both globally per key and per remote address.

Use private keys for backend services, account management, model listing, collection management, batch operations, and any workflow that needs the full gateway tool surface.

For a first server-side request, continue with [Getting Started](getting-started.md). If you are exposing a browser or widget experience to end users, review [Chat Clients](/docs/features/chat-clients) before deciding whether a public key is the right boundary.

## Create and list keys

API keys belong to an account and can have a label, expiration, and type. A key with a negative duration does not expire; expired keys are rejected by authentication and are later removed by cleanup jobs.

Create separate keys for separate applications. That makes rotation safer: if one integration is compromised, you can revoke only that key instead of breaking every service tied to the account. Labels and expiration dates are operational tools, not decoration; use them to identify who owns the key and when it should be reviewed.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20API%20Key&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20API%20Keys&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Send a key with Bearer auth

For OpenAI-compatible SDKs, pass the AIVAX key as the SDK API key and set the base URL to `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="sk-aiv-acc..."
)
```

## Send a key with Basic auth

For Basic auth, AIVAX decodes the Basic credential and uses the password portion after the colon as the API key.

```text
username:sk-aiv-acc...
```

The username is ignored by the authentication middleware.

## Hook authentication

AIVAX can authenticate outbound requests to your services, such as AI Gateway workers and server-side protocol functions.

This is the reverse direction of normal API authentication. In a normal API call, your application proves it is allowed to call AIVAX by sending an API key. In a worker or protocol-function callback, AIVAX is calling your service, so your service needs a way to verify that the request really came from the account configuration you control. That is what `X-Request-Nonce` is for.

If your account has a hook key, AIVAX sends:

```text
X-Request-Nonce: <BCrypt hash>
```

The nonce is a BCrypt hash derived from the account hook key. Validate the header by verifying the stored plain-text hook key against the hash. If the account has no hook key, the header is not sent.

Rolling the hook key invalidates existing worker and integration validation secrets.

### C# example

```csharp
using BCrypt.Net;

var nonce = request.Headers["X-Request-Nonce"];
var hookKey = Environment.GetEnvironmentVariable("AIVAX_HOOK_SECRET");

if (nonce is null || hookKey is null)
{
    return Results.Unauthorized();
}

if (!BCrypt.Net.BCrypt.Verify(hookKey, nonce, enhancedEntropy: false))
{
    return Results.Forbid();
}
```

### Python example

```python
import os
import bcrypt
from flask import abort, request

nonce = request.headers.get("X-Request-Nonce")
hook_key = os.getenv("AIVAX_HOOK_SECRET")

if nonce is None or hook_key is None:
    abort(401)

if not bcrypt.checkpw(hook_key.encode("utf-8"), nonce.encode("utf-8")):
    abort(403)
```

### JavaScript example

```javascript
import bcrypt from "bcrypt";

const nonce = req.header("X-Request-Nonce");
const hookKey = process.env.AIVAX_HOOK_SECRET;

if (!nonce || !hookKey) {
  return res.sendStatus(401);
}

if (!(await bcrypt.compare(hookKey, nonce))) {
  return res.sendStatus(403);
}
```
