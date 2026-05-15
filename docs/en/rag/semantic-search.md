# Semantic Search

The search API, using the query key obtained from the collections, performs a semantic search on it, making an intelligent comparison for each document indexed in a collection.

After creating a collection, you will get its ID. Use your collection's ID to search the indexed documents of it.

AIVAX uses embedding models that allow task orientation. For search, the term is vectorized with an orientation `DOCUMENT_QUERY`. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search.

> [!WARNING]
> This endpoint incurs cost. The cost is calculated based on the tokens of the search term.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Ranking

AIVAX can apply reranking after the vector search. The first stage finds documents semantically close to the queried terms. Then, the reranker re-evaluates the found candidates and adjusts the final order of results.

This process is useful when many documents are similar to each other. Semantic search may find the right set of candidates, but still place the most useful document below other related documents. Reranking works as a second precision step.

For example: in a technical support collection, searching for "how to cancel an annual subscription without penalty" may return documents about "subscription cancellation", "contractual penalty", "monthly subscription" and "refunds". The reranker reorders these candidates to favor the document that best answers the full query.

Available rerankers:

| Algorithm | Cost | Description |
| --------- | ----- | ----------- |
| `none` | No cost | Disables reranking. The final results use only the semantic score from the vector search. |
| `lexical` | No cost | Applies a small local score adjustment based on lexical matching, fuzzy matching, and term proximity in the document's name and content. |
| `smart` | $0,005/mtokens | Uses a reranking model to re-evaluate candidate documents with the full query and replace the final score with the model's score. |

In the semantic search API, the default reranker is `lexical`. To disable reranking, send `none` in the `reranker` parameter. To use the model-based reranker, send `smart`.

> [!NOTE]
> Reranking does not expand the search to documents that were outside the initial candidates. It operates on the candidates returned by the vector search and improves the final ordering.

## Search by terms

Search by multiple terms works as a union ranked by best match. It does not require mandatory intersection between terms and does not require each result to match all provided terms.

For multiple terms, each document is compared with all provided terms. The document's semantic score uses the best match found among those terms. In practice, a document can be well positioned by matching very well with just one of the terms.

For multiple collections, the search traverses the configured collections, aggregates the best candidates from each, and orders everything into a single final list. The result is not separated by collection and is also not an intersection across collections.

Example: when searching the terms `cancelamento`, `multa` and `reembolso` in the collections `suporte` and `contratos`, the response will be equivalent to:

> *best support or contract documents that match well with cancelamento or multa or reembolso*

It does not mean:

> *documents that match cancelamento and multa and reembolso at the same time*

nor:

> *documents present simultaneously in suporte and contratos*

If the intention is to search for a composite idea, prefer to send that idea as a single term, e.g., `cancelamento de assinatura anual sem multa`, instead of breaking the query into many isolated words. Use multiple terms when you want to cover different ways of expressing the same need or when you accept relevant results for any of the variations.

## MCP

You can provide your RAG collections via MCP (Model Context Protocol) functions. This allows AI models to access and search your collections natively through the MCP protocol.

To configure a collection as an MCP server, use the endpoint `https://inference.aivax.net/v1/mcp/collections` and set the following HTTP headers:

| Header | Description | Default |
|-----------|-----------|--------|
| `Authorization` | Bearer token of your API key | - |
| `X-Mcp-Collection-Id` | IDs of the collections to be exposed (comma-separated for multiple collections) | - |
| `X-Mcp-Collection-Name` | Name of the collection for identification in the MCP tool | `collection` |
| `X-Mcp-Reranker` | Reranker to be used (`lexical`, `smart` or `none`). | `lexical` |
| `X-Mcp-Top-K` | Maximum number of results to return | `5` |
| `X-Mcp-Min-Score` | Minimum relevance score (0.0 to 1.0) | `0.4` |
| `X-Mcp-Use-References` | Defines whether to include chunk references. Use `none` to disable | enabled |

### Configuration Example

Visual Studio Code:

```json
{
  "servers": {
    "my-rag-collection-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/collections",
      "headers": {
        "Authorization": "Bearer {your_api_key}",
        "X-Mcp-Collection-Id": "019b80d5-cee2-7010-ab22-f676271af866",
        "X-Mcp-Collection-Name": "my_collection",
        "X-Mcp-Top-K": "5",
        "X-Mcp-Min-Score": "0.4",
        "X-Mcp-Use-References": "enabled" // or "none"
      }
    }
  }
}
```

### Generated Tool

The MCP server will automatically create a tool named `search_{collection_name}` that accepts the parameter:

- **search_terms** (string): Search terms to retrieve information from the collection

The tool will perform a semantic search on the configured collection(s) and return the most relevant documents based on the defined parameters.

This search limits the number of queries that `search_terms` can perform to at most 5 terms per call and up to 500 characters (total of all terms). If the limits are exceeded, the tool will return an error. This limit ensures the tool is used for specific and relevant searches, avoiding overly broad queries that could impact model performance and generate high costs.

This MCP shares the [semantic search rate limits](/docs/en/limits) to prevent abuse and ensure service stability. If the rate limits are exceeded, the tool will return an error indicating that the limit has been reached.