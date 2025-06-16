# Autenticação

Quando tiver sua conta em mãos, use sua chave de autenticação única para se autenticar na nossa API através do cabeçalho `Authorization`:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt \
    -H 'Authorization: Bearer oky_gr5uepj...'
```

Você também pode enviar o seu token de autorização pelo parâmetro da query `?api-key`, exemplo:

```bash
curl https://inference.aivax.net/api/v1/information/models.txt?api-key=oky_gr5uepj...
```

Não há necessidade de enviar o esquema de autenticação `Bearer` em ambos cabeçalhos, mas é possível por questões de compatibilidade.

## Obtendo a API Key a partir da Login Key

Sua Login Key é a chave que você usa para acessar seu painel de usuário e controlar as diversas funções da AIVAX. A partir dessa chave é possível recuperar sua API key:

#### Requisição

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

#### Resposta

```json
{
    "message": null,
    "data": {
        "apiKey": "oky_gr5uepj18yhdec3z6nskw3w1kqfbaawcfrwe837c8o",
        "accountName": "Fernando Diniz"
    }
}
```

## Autenticando um nonce

Nonces são gerados por webhooks e funções de protocolo para autenticar transações feitas pela AIVAX em conteúdos externos. Em requisições que incluam o cabeçalho `X-Aivax-Nonce`, valide esse token chamando este endpoint:

<div class="request-item get">
    <span>POST</span>
    <span>
        /api/v1/auth/nonce
    </span>
</div>

```json
{
    "nonce": "kgnjcyjy7ksz5eeocc4iw14bre.7cahcn8phfmrdkidhqaecp4e4w"
}
```

> Observação: essa rota requer autenticação para funcionar.

Uma resposta para um nonce validado é retornada neste formato:

```json
{
    "message": null,
    "data": {
        "validated": true,
        "reason": "The nonce informed is valid and has been consumed."
    }
}
```

Ao validar um nonce, ele é consumido, e não é possível validar o mesmo nonce novamente. Nonces devem ser validados em até 10 minutos de sua emissão.