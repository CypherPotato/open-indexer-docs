# Search

The search API, through the query key obtained from the collections, performs a semantic search in it, performing an intelligent comparison for each indexed document in a collection.

After creating a collection, you will get its ID. Use the ID of your collection to perform the search in the indexed documents of the same.

Use the endpoints of this API to embed the semantic search of documents in your AI model or chatbot.

## Searching documents

This endpoint expects a GET request with the following parameters:

- `term`: **required.** Specifies the search term that will be searched in the documents.
- `top`: Specifies the maximum number of documents that should be returned in the search.
- `min`: Specifies the minimum score for obtaining the documents.

> [!WARNING]
>
> Warning: this endpoint generates cost. The cost is calculated based on the tokens of the search term. The search term is tokenized according to the model used in the indexing of the documents.

#### Request

<div class="request-item post">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/query
    </span>
</div>

```text
term=What is the color of the Honda CIVIC?
```

#### Response

```json
{
    "message": null,
    "data": [
        {
            "documentId": "01965f93-a391-71a8-968a-47ccd4949de0",
            "documentName": "Products/Honda Civic 2015.rmd:1",
            "documentContent": "[...]",
            "score": 0.7972834229469299,
            "referencedDocuments": []
        },
        {
            "documentId": "01965f93-a391-76b3-bbf5-3fb74d10d412",
            "documentName": "Products/Honda Civic 2015.rmd:2",
            "documentContent": "[...]",
            "score": 0.5693517327308655,
            "referencedDocuments": []
        },
        {
            "documentId": "01965f93-a391-7026-b7aa-1cc6c63cd7d1",
            "documentName": "Products/Honda Civic 2015.rmd:5",
            "documentContent": "[...]",
            "score": 0.5475733876228333,
            "referencedDocuments": []
        },
        ...
    ]
}
```

For the search result, the higher the score, the more similar the document is to the search term. The Open Indexer uses embedding models that allow task orientation. For the search, the term is vectorized with a `DOCUMENT_QUERY` orientation. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search and not to verify the similarity between documents.