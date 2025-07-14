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