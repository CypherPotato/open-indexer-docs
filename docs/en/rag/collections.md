# Collections and Documents

The AIVAX provides an autonomous RAG (Retrieval‑Augmented Generation) service that allows using documents in chat conversations. Collections are groups of documents that have information that will be retrieved later, stored persistently in a similarity database.

## Collections

Collections allow you to send, save, manage and semantically query documents stored in them. You can associate a collection with an AI gateway or query it directly via the API.

Through the AIVAX interface, you can send batches of documents and create documents with chunking, and associate them as a single document in the embedding result.

### Costs and limits

There is no limit to how many documents can be indexed in collections. Query and [storage](/docs/en/pricing) costs may occur on the account.

The cost of search and indexing is calculated based on the tokens of each document's content when it is indexed or modified. The content is tokenized according to the model used for indexing.

## Documents

A document represents a piece of knowledge. It is a limited, self‑contained excerpt that makes sense in isolation. A document is the component that is indexed by the internal model to be later retrieved via a semantic search term.

Consider a car manual: it is not a single document but several documents. Each of these documents talks, in isolation, about a specific subject of that car, such that the document does not depend on external context or information to make sense.

A good RAG document should be small enough to be retrieved accurately and complete enough to answer a question without relying on neighboring pages. Avoid turning entire chapters into a single document, because long texts dilute semantic scoring and increase the chance of the model receiving too much context. Also avoid documents that are too short, like a stray sentence without a title, because they may lose the information needed for the user to understand the answer. As a practical rule, write documents with a clear title, a single subject, language similar to the user's question, and content that can be quoted directly in the answer.

Use `docid` as a stable identifier. If you resend a line with the same `docid` and different text, the document will be updated and reindexed. If you only change `__meta`, the metadata can be updated without reindexing the content. Use `__tags` for operational organization, filters, and base maintenance. Use `__ref` when multiple documents represent parts of the same logical item and should be retrieved together, such as sections of a policy, excerpts from the same contract, or fragments of a product. Use `__meta` for auxiliary data that your application needs to preserve, such as source, version, internal category, author, canonical URL, or publication date.

When importing documents generated from large files, review the chunking result before considering the collection ready. PDFs, spreadsheets, and web pages can produce excerpts with repeated headers, footers, broken tables, or out‑of‑context text. These noises degrade both search and the final answer. When possible, normalize the content before indexing: remove menus, repetitions, and irrelevant disclaimers; include title and subtitle at the start of the document; keep related units of information together; and use tags to separate products, languages, versions, or audiences.

### Sending documents in batch

To send a bulk list of documents to a collection, structure them following the [JSONL](https://jsonlines.org/) format. The structure consists of the properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `docid` | `string` | Specifies the document name. Useful for debugging and identification. |
| `text`  | `string` | The raw content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID for the document. |
| `__tags` | `string[]` | Optional. Specifies an array of tags for the document. Useful for document management. |
| `__meta` | `object` | Optional. Additional metadata for the document. Changes only to `__meta` update the metadata without reindexing the content. |

The **reference** of a document is an ID that can be specified in multiple documents that need to be linked in a search when one of them is matched in a similarity search. For example, if a search finds a document that has a reference ID, all other documents in the same collection that share the same reference ID of the matched document will also be included in the search response.

The line limit per request depends on the account plan: Free accepts up to 1,000 lines, Pro up to 10,000 lines, and Max up to 1,000,000 lines. To compare plan differences, see the [AIVAX pricing page](https://aivax.net/pricing). If you need to send more documents, split the sending into more requests.

> [!WARNING]
> This endpoint incurs cost calculated based on the tokens of each document's content.

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Document Management

#### Create or update document

This endpoint creates or updates a document based on its name. When a document is modified, its indexing vectors are reset and the document enters the queue to be reindexed. The cost is generated only when the document is actually changed.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs%23CreateorUpdateDocument"></script>

#### List documents

Lists all available documents in a collection. Supports filtering by name, tag, reference, or content.

Supported filters:
- `-t "tag"`: filters documents that have this tag.
- `-r "reference"`: filters documents that have this reference ID.
- `-c "content"`: filters documents that contain this snippet in their content.
- `-n "name"`: filters documents that contain this snippet in their name.
- `in "id"`: filters documents by ID.

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>