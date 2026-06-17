# Semantic Search

The semantic search API searches one or more collections and returns the most relevant indexed documents for the supplied search terms.

Search is performed in stages:

1. Each query term is embedded with the internal `DocumentQuery` task.
2. Indexed documents were previously embedded with the internal `DocumentRetrieval` task.
3. The search prefilters candidates with compact embedding hashes.
4. Candidate documents are scored with embedding similarity.
5. The configured reranker can adjust the final order.
6. Results are filtered by `minScore`, sorted by score, and limited by `top`.

After creating a collection, use its collection ID in the `collections` array when searching.

> [!WARNING]
> Semantic search incurs cost. Query embedding cost is based on the search term tokens. The `smart` reranker also incurs reranking cost based on the query and candidate document tokens.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Request Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `collections` | `string[]` | Required | Collection IDs to search. Each collection must belong to the authenticated account. |
| `term` | `string` | Required if `terms` is absent | One search term. |
| `terms` | `string[]` | Required if `term` is absent | One or more search terms. |
| `top` | `number` | `5` | Maximum number of documents returned. Current validation allows 1 to 128. |
| `minScore` | `number` | `0.2` | Minimum final relevance score. Current validation allows values from 0.01 to 0.99. |
| `reranker` | `string` | `lexical` | `lexical`, `smart`, or `none`. |
| `includeReferences` | `boolean` | `false` | Includes related documents with the same reference ID when a matched document has a reference. |

The response includes the matched document ID, collection ID, document name, document content, metadata, score, and referenced documents when reference expansion is enabled.

## Reranking

AIVAX can apply reranking after vector candidates are found.

Available rerankers:

| Reranker | Cost | Behavior |
| --- | --- | --- |
| `none` | No reranking cost | Uses vector similarity only. |
| `lexical` | No reranking cost | Applies a local boost based on lexical matches, fuzzy token matches, and term proximity in the document name and content. |
| `smart` | Reranking cost applies | Uses Cloudflare Workers AI (`@cf/baai/bge-reranker-base`) to rescore candidate documents against the full query. |

The default reranker is `lexical`. To disable reranking, send `"reranker": "none"`. To use the model-based reranker, send `"reranker": "smart"`.

> [!NOTE]
> Reranking does not search additional documents. It only reorders candidates already found by the vector search stage.

## Multiple Terms

Multiple terms work as a ranked union by best match, not as a mandatory intersection.

Each document is compared against all supplied terms. The document score uses the best match among those terms. A document can rank well by matching one term strongly, even if it does not match the other terms.

Example:

Searching for:

```text
cancelamento
multa
reembolso
```

in the `suporte` and `contratos` collections means:

```text
best support or contract documents that match cancelamento or multa or reembolso
```

It does not mean:

```text
documents that match cancelamento and multa and reembolso at the same time
```

It also does not mean:

```text
documents that exist in both support and contracts
```

If the user intent is one composite idea, send that idea as one term:

```text
cancelamento de assinatura anual sem multa
```

Use multiple terms when you want to cover synonyms, alternative phrasings, or several acceptable retrieval paths.

## Search Quality

A complete query usually performs better than a list of disconnected keywords because it preserves the relationship between concepts.

Prefer:

```text
como cancelar assinatura anual sem multa
```

Over:

```text
cancelamento
assinatura
multa
```

Tune `top` and `minScore` together:

- Lower `minScore` values return more candidates and more noise.
- Higher `minScore` values reduce noise but may return few or no results.
- Higher `top` values are useful when the answer must compare several policies, procedures, or source excerpts.
- Lower `top` values are better for direct FAQ-style answers.

If search returns poor results:

1. Confirm that the documents are indexed.
2. Query the collection directly before testing through an AI Gateway.
3. Compare short queries, complete questions, and alternative phrasings.
4. Check whether the relevant document is too short, too long, or not self-contained.
5. Check whether the query language matches the document language.
6. If the gateway rewrites questions before searching, test with the plain query path to isolate rewriting issues.

## MCP

You can expose RAG collections as MCP (Model Context Protocol) tools. This lets compatible MCP clients search a collection directly.

Endpoint:

```text
https://inference.aivax.net/v1/mcp/collections
```

Headers:

| Header | Description | Default |
| --- | --- | --- |
| `Authorization` | Bearer token of your API key. | Required |
| `X-Mcp-Collection-Id` | One or more collection IDs. Use commas for multiple collections. | Required |
| `X-Mcp-Collection-Name` | Collection name used to generate tool names. | `collection` |
| `X-Mcp-Reranker` | `lexical`, `smart`, or `none`. | `lexical` |
| `X-Mcp-Top-K` | Maximum number of results to return. | `5` |
| `X-Mcp-Min-Score` | Minimum relevance score greater than 0 and up to 1.0. | `0.4` |
| `X-Mcp-Use-References` | Current server behavior enables references when this header value is `none`; omit the header to disable references. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` to expose document write and delete tools. | disabled |
| `X-Mcp-Naming-Convention` | `default` or `agent`. | `default` |

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

### Generated Tools

With the default naming convention, the read tool is named:

```text
{collection_name}_search
```

It accepts:

- `search_terms` (`string[]`): one or more search terms.

The MCP read tool enforces two request-shaping limits:

- At most 10 search terms per call.
- At most 500 total characters across all search terms.

When `X-Mcp-Allow-Write` is disabled, only the search tool is exposed. This is the recommended mode for assistants that only need to read a knowledge base.

When `X-Mcp-Allow-Write: yes` is sent, the server also exposes document creation/update and delete tools. Enable this only for trusted clients, because a model with write access can change collection contents.

Use collection MCP when an external model or MCP client should decide when to search. For a typical AIVAX chat client, it is often simpler to attach the collection directly to the AI Gateway and let the gateway RAG pipeline retrieve documents automatically.
