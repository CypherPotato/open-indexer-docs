# Semantic Search

The search API, through the query key obtained from the collections, performs a semantic search on it, performing an intelligent comparison for each document indexed in a collection.

After creating a collection, you will get its ID. Use your collection's ID to search the indexed documents of it.

AIVAX uses embedding models that allow task orientation. For search, the term is vectorized with an orientation `DOCUMENT_QUERY`. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search.

> [!WARNING]
> This endpoint incurs cost. The cost is calculated based on the tokens of the search term.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## MCP

It is possible to provide your RAG collections via MCP functions (Model Context Protocol). This allows AI models to access and search your collections natively through the MCP protocol.

To configure a collection as an MCP server, use the endpoint `https://inference.aivax.net/v1/mcp/collections` and set the following HTTP headers:

| Header | Description | Default |
|--------|-------------|---------|
| `Authorization` | Bearer token of your API key | - |
| `X-Mcp-Collection-Id` | IDs of the collections to be exposed (comma‑separated for multiple collections) | - |
| `X-Mcp-Collection-Name` | Name of the collection for identification in the MCP tool | `collection` |
| `X-Mcp-Top-K` | Maximum number of results to return | `5` |
| `X-Mcp-Min-Score` | Minimum relevance score (0.0 to 1.0) | `0.4` |
| `X-Mcp-Use-References` | Determines whether to include references of the chunks. Use `none` to disable | enabled |

### Example configuration

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

### Generated tool

The MCP server will automatically create a tool named `search_{collection_name}` that accepts the parameter:

- **search_terms** (string): Search terms to retrieve information from the collection

The tool will perform a semantic search on the configured collection(s) and return the most relevant documents based on the defined parameters.

This search limits the amount of queries that `search_terms` can perform to at most 5 terms per call and a maximum of 500 characters (sum of all terms). If the limits are exceeded, the tool will return an error. This limit ensures the tool is used for specific and relevant searches, avoiding overly broad queries that could impact model performance and generate high costs.

This MCP shares the [semantic search rate limits](/docs/en/limits) to prevent abuse and ensure service stability. If the rate limits are exceeded, the tool will return an error indicating the limit has been reached.