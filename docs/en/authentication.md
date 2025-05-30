# Authentication

When you have your account in hand, use your unique authentication key to authenticate on our API through the `Authorization` header:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt \
    -H 'Authorization: Bearer oky_gr5uepj...'
```

You can also send your authorization token through the query parameter `?api-key`, example:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt?api-key=oky_gr5uepj...
```

There is no need to send the authentication scheme `Bearer` in both headers, but it is possible for compatibility reasons.

## Obtaining the API Key from the Login Key

Your Login Key is the key you use to access your user panel and control the various functions of AIVAX. From this key, it is possible to recover your API key:

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/auth/login
    </span>
</div>

```json
{
    "loginKey": "n38oy4nq2orry7"
}
```

#### Response

```json
{
    "message": null,
    "data": {
        "apiKey": "oky_gr5uepj18yhdec3z6nskw3w1kqfbaawcfrwe837c8o",
        "accountName": "Fernando Diniz"
    }
}
```