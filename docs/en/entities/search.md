# Search

The search API, using the query key obtained from collections, performs a semantic search on it, performing an intelligent comparison for each document indexed in a collection.

After creating a collection, you will receive its ID. Use your collection's ID to search the indexed documents of it.

Use the endpoints of this API to embed semantic document search into your AI model or chatbot.

## Searching documents

This endpoint expects a GET request with the parameters:

- `term`: **required.** Specifies the search term that will be searched in the documents.
- `top`: Specifies the maximum number of documents to be returned in the search.
- `min`: Specifies the minimum score for retrieving documents.

> [!WARNING]
>
> Attention: this endpoint incurs cost. The cost is calculated based on the tokens of the search term. The search term is tokenized according to the model used for indexing the documents.

See the [reference](https://inference.aivax.net/apidocs#QueryCollection) for the collection query API endpoint.

For the search results, the higher the score, the more similar the document is to the search term. AIVAX uses embedding models that allow task orientation. For searching, the term is vectorized with an orientation `DOCUMENT_QUERY`. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search and is not intended to assess similarity between documents.