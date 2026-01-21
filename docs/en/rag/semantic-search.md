# Semantic Search

The search API, using the query key obtained from collections, performs a semantic search on it, performing an intelligent comparison for each document indexed in a collection.

After creating a collection, you will receive its ID. Use your collection's ID to search the indexed documents of that collection.

AIVAX uses embedding models that allow task orientation. For searching, the term is vectorized with an orientation `DOCUMENT_QUERY`. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search.

> [!WARNING]
> This endpoint incurs cost. The cost is calculated based on the tokens of the search term.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>