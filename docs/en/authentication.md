# Authentication

When you have your account, use your unique authentication key to authenticate with our API via the `Authorization` header:

```bash
curl https://inference.aivax.net/api/v1/information/models.json \
    -H 'Authorization: Bearer oky_gr5uepj...'
```

You can also send your authorization token via the query parameter `?api-key`, for example:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt?api-key=oky_gr5uepj...
```

There is no need to send the `Bearer` authentication scheme in both headers, but it is possible for compatibility reasons.

## Authenticating hooks

AIVAX requests to your services, whether AI gateway workers or server‑side function calls, include an `X-Request-Nonce` header in every request containing a BCrypt hash that is a derived value of the [hook key](https://console.aivax.net/dashboard/account) set in your account.

Validation is simple: verify that the hash in `X-Request-Nonce` is a product of the derived key set in your account.

In this way, you can authenticate whether AIVAX requests to your services are genuine using this token. If your account has not defined a hook key, this header will not be sent.

See the examples below for hook key validation:

# [C# (with Sisk)](#tab/csharp-sisk)

```csharp
using BCrypt.Net;

[RoutePrefix("/api/aivax-protocol-functions")]
internal class MyController : Controller
{
    public MyController()
    {
        this.HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // Get the nonce sent from the request
                var hash = this.Request.Headers ["X-Request-Nonce"];
                if (hash == null)
                {
                    return new HttpResponse(HttpStatusInformation.Unauthorized);
                }
                
                // Validate the hook using the BCrypt.Net library
                var secretWord = Environment.GetEnvironmentVariable ("AIVAX_HOOK_SECRET");
                if (!BCrypt.Net.BCrypt.Verify(secretWord, hash, enhancedEntropy: false))
                {
                    return new HttpResponse(HttpStatusInformation.Forbidden);
                }
                
                // Continue the request after hook validated
                return null;
            }));
    }
    ...
}
```

# [Python (with Flask)](#tab/python-flask)

```python
from flask import Flask, request, abort
import os
import bcrypt

app = Flask(__name__)

@app.before_request
def autenticar_token():
    # 1. Read the header containing the token hash
    token_hash = request.headers.get("X-Request-Nonce")
    if not token_hash:
        abort(401)

    # 2. Load the plain-text secret from environment variables
    secret = os.getenv("AIVAX_HOOK_SECRET")
    if secret is None:
        abort(500)

    # 3. Verify that the received hash matches the secret
    if not bcrypt.checkpw(secret.encode("utf-8"),
                          token_hash.encode("utf-8")):
        abort(403)

@app.route("/api/aivax-protocol-functions/some-action", methods=["POST"])
def some_action():
    return "", 204

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

# [JavaScript (with Express.js)](#tab/js-express)

```javascript
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')

const app = express()

app.use(async (req, res, next) => {
  const tokenHash = req.header('X-Request-Nonce')
  if (!tokenHash) {
    return res.sendStatus(401)
  }

  // 2. Load the plain-text secret from environment variables
  const secret = process.env.AIVAX_HOOK_SECRET
  if (!secret) {
    return res.sendStatus(500)
  }

  try {
    // 3. Verify that the received hash matches the secret
    const match = await bcrypt.compare(secret, tokenHash)
    if (!match) {
      return res.sendStatus(403)
    }
    
    next()
  } catch (err) {
    return res.sendStatus(500)
  }
})

app.post(
  '/api/aivax-protocol-functions/some-action',
  (req, res) => {
    res.sendStatus(204)
  }
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

---