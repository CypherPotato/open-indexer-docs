# Pesquisa

A API de pesquisa, através da query key obtida das coleções, realiza uma busca semântica na mesma, realizando uma comparação inteligente para cada documento indexado em uma coleção.

Após criar uma coleção, você obterá seu ID. Utilize o ID da sua coleção para realizar a busca nos documentos indexados da mesma.

Use os endpoints dessa API para embutir a pesquisa semântica de documentos no seu modelo de IA ou chatbot.

## Pesquisando documentos

Esse endpoint espera uma requisição GET com os parâmetros:

- `term`: **obrigatório.** Especifica o termo de pesquisa que será pesquisado nos documentos.
- `top`: Especifica o máximo de documentos que deverão ser retornados na busca.
- `min`: Especifica o score mínimo para obtenção dos documentos.

> [!WARNING]
>
> Atenção: esse endpoint gera custo. O custo é calculado em cima dos tokens do termo de busca. O termo de busca é tokenizado de acordo com o modelo usado na indexação dos documentos.

#### Requisição

<div class="request-item post">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/query
    </span>
</div>

```text
term=Qual a cor do honda CIVIC?
```

#### Resposta

```json
{
    "message": null,
    "data": [
        {
            "documentId": "01965f93-a391-71a8-968a-47ccd4949de0",
            "documentName": "Produtos/Honda Civic 2015.rmd:1",
            "documentContent": "[...]",
            "score": 0.7972834229469299,
            "referencedDocuments": []
        },
        {
            "documentId": "01965f93-a391-76b3-bbf5-3fb74d10d412",
            "documentName": "Produtos/Honda Civic 2015.rmd:2",
            "documentContent": "[...]",
            "score": 0.5693517327308655,
            "referencedDocuments": []
        },
        {
            "documentId": "01965f93-a391-7026-b7aa-1cc6c63cd7d1",
            "documentName": "Produtos/Honda Civic 2015.rmd:5",
            "documentContent": "[...]",
            "score": 0.5475733876228333,
            "referencedDocuments": []
        },
        ...
    ]
}
```

Para o resultado da busca, quanto maior o score, mais semelhante é o documento para o termo da busca. O AIVAX utiliza modelos de embedding que permitem a orientação da tarefa. Para a busca, o termo é vetorizado com uma orientação `DOCUMENT_QUERY`. Para indexação dos documentos, a orientação é `DOCUMENT_RETRIEVAL`, o que fornece uma busca mais otimizada e não para averiguar a similaridade entre documentos.