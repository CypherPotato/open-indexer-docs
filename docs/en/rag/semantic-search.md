# Semantic Search

The search API performs semantic search on the specified collections, making an intelligent comparison between the submitted terms and each indexed document.

After creating a collection, you will receive its ID. Use your collection’s ID to search the indexed documents of that collection.

AIVAX uses embedding models that allow task orientation. For search, the term is vectorized with a `DOCUMENT_QUERY` orientation. For document indexing, the orientation is `DOCUMENT_RETRIEVAL`, which provides a more optimized search.

> [!WARNING]
> This endpoint incurs cost. The cost is calculated based on the tokens of the search term.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Ranking

AIVAX can apply reranking after the vector search. The first stage finds documents that are semantically close to the queried terms. Then, the reranker re‑evaluates the found candidates and adjusts the final order of results.

This process is useful when many documents are similar to each other. Semantic search may find the right set of candidates, but still place the most useful document below other related documents. Reranking works as a second precision step.

For example, in a technical support collection, searching for “how to cancel an annual subscription without penalty” may return documents about “subscription cancellation”, “contractual penalty”, “monthly subscription”, and “refunds”. The reranker reorders these candidates to favor the document that best answers the full query.

Available rerankers:

| Algorithm | Cost | Description |
| --------- | ----- | --------- |
| `none` | No cost | Disables reranking. Final results use only the semantic score from the vector search. |
| `lexical` | No cost | Applies a small local score adjustment based on lexical matching, fuzzy matching, and term proximity in the document name and content. |
| `smart` | $0.005/mtokens | Uses a reranking model to re‑evaluate candidate documents with the full query and replace the final score with the model’s score. |

In the semantic search API, the default reranker is `lexical`. To disable reranking, send `none` in the `reranker` parameter. To use the model‑based reranker, send `smart`.

> [!NOTE]
> Reranking does not expand the search to documents that were outside the initial candidates. It operates on the candidates returned by the vector search and improves the final ordering.

## Term Search

Search by multiple terms works as a ranked union by best match. It does not require mandatory intersection between terms and does not require each result to match all provided terms.

For multiple terms, each document is compared with all supplied terms. The document’s semantic score uses the best match found among those terms. In practice, a document can be well‑ranked by matching very well with just one of the terms.

For multiple collections, the search traverses the configured collections, aggregates the best candidates from each, and orders everything into a single final list. The result is not separated by collection and is not an intersection across collections.

Example: searching the terms `cancelamento`, `multa` and `reembolso` in the `suporte` and `contratos` collections yields a response equivalent to:

> *best support or contract documents that match well with cancelamento or multa or reembolso*

It does **not** mean:

> *documents that match cancelamento and multa and reembolso at the same time*

nor:

> *documents present simultaneously in support and contracts*

If you intend to search a composite idea, prefer sending that idea as a single term, e.g., `cancelamento de assinatura anual sem multa`, instead of breaking the query into many isolated words. Use multiple terms when you want to cover different ways of expressing the same need or when you accept relevant results for any of the variations.

## Search Project and Result Quality

The quality of semantic search depends both on the query and on how the documents were prepared. When a user asks something specific, the best query is usually a complete sentence with clear intent, not a list of loose keywords. For example, `como cancelar assinatura anual sem multa` tends to retrieve better documents than `cancelamento`, `assinatura`, `multa`, because it preserves the relationship between terms. Use multiple terms when you want to cover synonyms or alternative phrasings, such as `cancelar assinatura`, `encerrar contrato` and `rescindir plano`; in this case, the search works as a union of possibilities rather than a requirement that all appear simultaneously.

The `top` parameter controls how many documents are returned, while `minScore` sets the minimum relevance cutoff. Low `minScore` values increase the chance of retrieving any content, but also increase noise. High values reduce noise but may return few results when the collection is small, documents are poorly segmented, or the query uses language different from the documents. In RAG‑enabled assistants on the gateway, start with few documents and a moderate minimum score; then increase `top` only when the answer needs to compare policies, procedures, or excerpts from different sources.

The reranker should be chosen based on the task’s error cost. `lexical` is a good default because it improves ordering at no extra cost, especially when names, codes, titles, or technical terms appear in the document. `smart` makes sense when candidate documents are very similar to each other and the query requires understanding the whole sentence, such as in technical, legal, financial support, or long documentation. `none` should only be used when you want the lowest possible latency and accept purely vector‑based ordering. Reranking does not fix a bad collection: if relevant documents are not among the initial candidates, improve chunking, names, content, or query strategy.

When the search does not return what you expect, investigate in layers. First, confirm that the documents are indexed and that the correct collection is being queried. Second, test the query directly via the API before testing inside a gateway, because this separates search problems from prompt problems. Third, compare a short query, a full query, and two or three semantic variations. Fourth, check whether the documents are self‑contained; documents that depend on external context, generic titles, or very long excerpts tend to score poorly. Finally, if the gateway uses a rewriting strategy, test the same question with `Plain` to discover whether the problem lies in the rewrite or the collection.

## MCP

You can provide your RAG collections via MCP (Model Context Protocol) functions. This allows AI models to access and search your collections natively through the MCP protocol.

To configure a collection as an MCP server, use the endpoint `https://inference.aivax.net/v1/mcp/collections` and set the following HTTP headers:

| Header | Description | Default |
|-----------|-----------|--------|
| `Authorization` | Bearer token of your API key | - |
| `X-Mcp-Collection-Id` | IDs of the collections to expose (comma‑separated for multiple collections) | - |
| `X-Mcp-Collection-Name` | Collection name for identification in the MCP tool | `collection` |
| `X-Mcp-Reranker` | Reranker to use (`lexical`, `smart` or `none`). | `lexical` |
| `X-Mcp-Top-K` | Maximum number of results to return | `5` |
| `X-Mcp-Min-Score` | Minimum relevance score (0.0 to 1.0) | `0.4` |
| `X-Mcp-Use-References` | Defines whether to include chunk references. In the current behavior, send `none` to include references; omit the header to exclude them. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` to expose document creation and deletion tools on the MCP server. | disabled |
| `X-Mcp-Naming-Convention` | Naming convention for the tools. Use `default` or `agent`. | `default` |

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
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

### Generated Tool

The MCP server will automatically create a tool named `{collection_name}_search` that accepts the parameter:

- **search_terms** (`string[]`): Search terms to retrieve information from the collection

The tool will perform a semantic search on the configured collection(s) and return the most relevant documents based on the defined parameters.

This search limits the amount of queries `search_terms` can perform to a maximum of 10 terms per call and a total of 500 characters (sum of all terms). If the limits are exceeded, the tool will return an error. This limit ensures the tool is used for specific, relevant searches, avoiding overly broad queries that could impact model performance and incur high costs.

When `X-Mcp-Allow-Write` is disabled, the collection MCP functions as a read‑only tool. This is the recommended mode for assistants that only need to query knowledge. When `X-Mcp-Allow-Write: yes` is sent, the server also exposes write and delete tools for documents. This mode is useful for internal agents that maintain a live base, for example a assistant that records newly approved answers, updates a procedures base, or removes obsolete documents. Enable writing only for trusted clients, because the model could alter the collection based on conversation.

The naming convention also changes how the model perceives the tool. In `default` mode, the read tool uses the name `{collection_name}_search`, which works well when the collection has a clear name, such as `manual_suporte_search`. In `agent` mode, the tools use more direct names for agents, like read, write, and delete associated with the collection name. The choice should consider the MCP client: in a code editor, explicit names help the model choose the tool; in a sub‑agent with few tools, short names may be sufficient.

Collection MCP is best when you want to give direct access to the base for another model or MCP client. For a typical chat client, it is usually simpler to bind the collection in the AI Gateway itself and let the RAG pipeline attach the documents automatically. Use MCP when the calling model needs to decide when to search, when you want to expose the same collection to multiple external tools, or when the collection needs to be accessed by agents that are not inside AIVAX.

This MCP shares the [semantic search rate limits](/docs/en/limits) to prevent abuse and ensure service stability. If rate limits are exceeded, the tool will return an error indicating that the limit has been reached.