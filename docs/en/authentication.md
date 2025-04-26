# Authentication

When you have your account, use your unique authentication key to authenticate in our API through the `Authorization` header:

```bash
curl https://openindexer.proj.pw/api/v1/information/models.txt \
    -H 'Authorization: Bearer oky_gr5uepj...'
```

## Obtaining the API Key from the Login Key

Your Login Key is the key you use to access your user panel and control the various functions of OpenIndexer. From this key, it is possible to recover your API key:

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