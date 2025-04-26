# Coleções

Uma coleção é uma biblioteca de conhecimento: ela abriga vários documentos de conhecimento.

- Use coleções para agrupar documentos por finalidade, como documentar um produto, uma empresa, um serviço ou fluxo.
- Coleções não produzem custo. Não há limite de coleções por conta.

## Criar uma coleção

Para criar uma coleção vazia, informe apenas o nome dela:

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/collections
    </span>
</div>

```json
{
    // O nome da coleção não pode ser vazio.
    "collectionName": "Minha primeira coleção"
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        // ID único da coleção criada.
        "collectionId": "01965b62-17c4-7258-9aa8-af5139799527",
        
        // Uma chave privada usada para realizar consulta semântica na coleção.
        "queryKey": "cky_gr5uepj18yhuop3zcsa4c7b8stdmpgg7kk4jaf4iug6x3hg7umyhk3o"
    }
}
```

## Listar coleções

Lista as coleções disponíveis na sua conta.

#### Requisição

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": {
        "pageInfo": {
            "currentPage": 1,
            "hasMoreItems": true
        },
        "items": [
            {
                "id": "01965b62-17c4-7258-9aa8-af5139799527",
                "createdAt": "2025-04-22T02:44:37",
                "name": "Minha coleção"
            },
            {
                "id": "01965b54-7fbd-70cd-982b-604de002ac0a",
                "createdAt": "2025-04-22T02:29:46",
                "name": "Outra coleção"
            }
        ]
    }
}
```

## Ver uma coleção

Obtém detalhes de uma coleção, como seu progresso de indexação e informações como data de criação.

#### Requisição

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": {
        "name": "Minha coleção",
        "createdAt": "2025-04-22T02:29:46",
        "queryKey": "cky_gr5uepj18yhd1qbshep7bki5e83hftbp6hbep97r8di9n4tta9ykswo",
        "state": {
            
            // traz a quantidade de documentos aguardando indexação
            "queuedDocuments": 0,
            
            // quantidade de documentos pronto para consulta
            "indexedDocuments": 227
        }
    }
}
```

## Excluir uma coleção

Exclui uma coleção e todos os documentos nela. Essa ação é irreversível.

#### Requisição

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/
    </span>
</div>

#### Resposta

```json
{
    "message": "Collection deleted successfully.",
    "data": null
}
```


## Limpar uma coleção

Diferente da exclusão de coleção, essa operação remove todos os documentos da coleção, incluindo os indexados e os em fila.

#### Requisição

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/reset-only
    </span>
</div>

#### Resposta

```json
{
    "message": "Collection cleaned successfully.",
    "data": null
}
```