# Collections and Documents

A AIVAX provides an autonomous RAG (Retrieval-Augmented Generation) service that allows using documents in chat conversations. Collections are groups of documents that contain information that will be retrieved later, stored persistently in a similarity database.

## Collections

Collections let you upload, save, manage, and semantically query documents stored in them. You can associate a collection with an AI gateway or query it directly via the API.

Through the AIVAX interface, you can upload batches of documents and create documents with chunking, and associate them as a single document in the embedding result.

### Costs and limits

There is no limit to how many documents can be indexed in collections. Query and [storage](/docs/en/pricing) charges may apply to the account.

The cost of search and indexing is calculated based on the tokens of each document’s content when it is indexed or modified. The content is tokenized according to the model used for indexing.

## Documents

A document represents a piece of knowledge. It is a limited, self‑contained excerpt that makes sense on its own. A document is the component that is indexed by the internal model to be retrieved later via a semantic search term.

Consider a car manual: it is not a single document but several documents. Each of these documents talks, in isolation, about a specific topic regarding that car, so that the document does not depend on external context or information to make sense.

### Upload documents in batch

To upload a large list of documents to a collection, structure them following the [JSONL](https://jsonlines.org/) format. The structure consists of the following properties:

| Property | Type | Description |
| ----------- | ---- | --------- |
| `docid` | `string` | Specifies the document’s name. Useful for debugging and identification. |
| `text`  | `string` | The raw content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID for the document. |
| `__tags` | `string[]` | Optional. Specifies an array of tags for the document. Useful for document management. |

The **reference** of a document is an ID that can be specified in multiple documents that need to be linked in a search when one of them is matched in a similarity search. For example, if a search finds a document that has a reference ID, all other documents in the same collection that share that reference ID will also be included in the search response.

You can upload up to **50,000** document lines per request. If you need to send more documents, split the upload into multiple requests.

> [!WARNING]
> This endpoint incurs cost calculated based on the tokens of each document’s content.

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Document Management

#### Create or update document

This endpoint creates or updates a document by its name. When a document is updated, its indexing vectors are reset and the document is queued for re‑indexing. The cost is incurred only when the document is actually changed.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs%23CreateorUpdateDocument"></script>

#### List documents

Lists all documents available in a collection. Supports filtering by name, tag, reference, or content.

Supported filters:
- `-t "tag"`: filters documents that have this tag.
- `-r "reference"`: filters documents that have this reference ID.
- `-c "content"`: filters documents that contain this snippet in their content.
- `-n "name"`: filters documents that contain this snippet in their name.
- `in "id"`: filters documents by ID.

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>