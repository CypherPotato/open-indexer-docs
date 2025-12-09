# Autenticação

Quando tiver sua conta em mãos, use sua chave de autenticação única para se autenticar na nossa API através do cabeçalho `Authorization`:

```bash
curl https://inference.aivax.net/api/v1/information/models.json \
    -H 'Authorization: Bearer oky_gr5uepj...'
```

Você também pode enviar o seu token de autorização pelo parâmetro da query `?api-key`, exemplo:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt?api-key=oky_gr5uepj...
```

Não há necessidade de enviar o esquema de autenticação `Bearer` em ambos cabeçalhos, mas é possível por questões de compatibilidade.

## Autenticando hooks

Requisições da AIVAX para seus serviços, seja workers de gateways de IA ou chamadas de função server-side, um cabeçalho `X-Request-Nonce` é encaminhado em todas as requisições conténdo um hash BCrypt sendo um salto da [chave de hook](https://console.aivax.net/dashboard/account) definida em sua conta.

A validação é simples: verifique se o hash em `X-Request-Nonce` é um produto da chave de salto definida em sua conta.

Dessa forma, você poderá autenticar se as requisições da AIVAX para seus serviços são genuínas através desse token. Se sua conta não tiver definido uma chave de hook, esse cabeçalho não será enviado.

Veja os exemplos abaixo para validação da chave de hook:

# [C# (com Sisk)](#tab/csharp-sisk)

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
                // Obtém o nonce enviado da requisição
                var hash = this.Request.Headers ["X-Request-Nonce"];
                if (hash == null)
                {
                    return new HttpResponse(HttpStatusInformation.Unauthorized);
                }
                
                // Valida o hook usando a biblioteca BCrypt.Net
                var secretWord = Environment.GetEnvironmentVariable ("AIVAX_HOOK_SECRET");
                if (!BCrypt.Net.BCrypt.Verify(secretWord, hash, enhancedEntropy: false))
                {
                    return new HttpResponse(HttpStatusInformation.Forbidden);
                }
                
                // Continua a requisição após hook validado
                return null;
            }));
    }
    ...
}
```

# [Python (com Flask)](#tab/python-flask)

```python
from flask import Flask, request, abort
import os
import bcrypt

app = Flask(__name__)

@app.before_request
def autenticar_token():
    # 1. Lê o cabeçalho que contém o hash do token
    token_hash = request.headers.get("X-Request-Nonce")
    if not token_hash:
        abort(401)

    # 2. Carrega o segredo em texto puro das variáveis de ambiente
    secret = os.getenv("AIVAX_HOOK_SECRET")
    if secret is None:
        abort(500)

    # 3. Verifica se o hash recebido corresponde ao segredo
    if not bcrypt.checkpw(secret.encode("utf-8"),
                          token_hash.encode("utf-8")):
        abort(403)

@app.route("/api/aivax-protocol-functions/some-action", methods=["POST"])
def some_action():
    return "", 204

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

# [JavaScript (com Express.js)](#tab/js-express)

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

  // 2. Carrega o segredo em texto puro das variáveis de ambiente
  const secret = process.env.AIVAX_HOOK_SECRET
  if (!secret) {
    return res.sendStatus(500)
  }

  try {
    // 3. Verifica se o hash recebido corresponde ao segredo
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