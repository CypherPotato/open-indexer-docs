# Documents

A document represents a piece of knowledge. It is a limited, self‑contained excerpt that makes sense in isolation. A document is the component that is indexed by the internal model to be retrieved later through a semantic search term.

Consider a car manual: it is not a single document but several documents. Each of these documents talks, in isolation, about a specific subject concerning that car, so that the document does not depend on external context or information to make sense.

Each document in this manual will cover a topic: one will explain how to start the car, another how to turn it off, another how its paint is applied, and another how to change the oil periodically. It is not a good idea to reserve a document for multiple things at once, because that will reduce the objectivity and scope of inference and lower the quality of retrieval.

Examples of document creation:

### ❌ Do not

- Do not create very short documents (with 10 words or fewer).
- Do not create very large documents (with 700 words or more).
- Do not talk about more than one thing in a document.
- Do not mix different languages in documents.
- Do not be implicit in documents.
- Do not write documents using technical language, such as code or structures like JSON.

### ✅ Do

- Be explicit about the purpose of your document.
- Focus documents on individual subjects that summarize what should be done or explained.
- Always repeat terms that are keywords for the document search. Example: prefer using “The color of the 2015 Honda Civic is yellow” instead of “the car’s color is yellow”.
- Restrict the document content to talk about only one topic or subject.
- Use human, simple, and easy‑to‑understand language.

## API Usage

Since all documents are entities that belong to a [collection](collections.md), always have the collection where the document is/will be located at hand.

For detailed information about the document API endpoints, see the [official API documentation](https://inference.aivax.net/apidocs#Documents).

## Bulk upload documents

To upload a large list of documents to a collection, structure them following the [JSONL](https://jsonlines.org/) format. The structure consists of the following properties:

| Property | Type | Description |
| ----------- | ---- | --------- |
| `docid` | `string` | Specifies the document’s name. Useful for debugging and identification. |
| `text`  | `string` | The raw content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID for the document. |
| `__tags` | `string[]` | Optional. Specifies an array of tags for the document. Useful for document management. |

A document’s reference is an ID that can be specified in multiple documents that need to be linked in a search when one of them is matched in a similarity search. For example, if a search finds a document that has a reference ID, all other documents in the same collection that share the same reference ID will also be included in the search response.

Using references can be helpful when a document depends on one or more other documents to make sense. There is no required format for the reference ID: any format is accepted.

You can send up to **10,000** document lines per request. If you need to send more documents, split the upload into multiple requests. If you send a document with more than 1,000 lines, the subsequent lines will be ignored.

Note that very long documents, which exceed the token limit of the internal embedding model, will have their content **truncated** and the indexing quality may be severely affected. To avoid this issue, send documents that contain between 20 and 700 words.

> [!WARNING]
>
> **Attention:** this endpoint incurs cost. The cost is calculated based on the tokens in each document’s content. Each document’s content is tokenized according to the model used for indexing the documents.

For details on how to bulk‑upload documents, see the endpoint [Index Documents (JSONL)](https://inference.aivax.net/apidocs#IndexDocumentsJSONL).

## Create or update a document

This endpoint creates or updates a document by its name. When a document is updated, its indexing vectors are reset, meaning the document will re‑enter the queue to be indexed by the indexing engine.

This indexing is not free. The cost is proportional to the number of tokens in the submitted content. The cost is only generated when the document is actually changed. Calling this route with the same document content does not produce a modification, therefore no cost is incurred.

> [!WARNING]
>
> **Attention:** this endpoint incurs cost. The cost is calculated based on the tokens in the file’s content. The file’s content is tokenized according to the model used for indexing the documents.

For details on how to create or update documents, see the endpoint [Create or Update Document](https://inference.aivax.net/apidocs#CreateorUpdateDocument).

## List documents

This endpoint lists all documents available in a collection. You can pass an additional query parameter `filter` to filter documents by name, tag, or content.

The filter supports expressions that help narrow down what you are looking for:
- `-t "tag"` – filters documents that have this tag.
- `-r "reference"` – filters documents that have this reference ID.
- `-c "content"` – filters documents that contain this snippet in their content.
- `-n "name"` – filters documents that contain this snippet in their name.
- `in "id"` – filters documents by ID.

For details on how to list documents, see the endpoint [Browse Documents](https://inference.aivax.net/apidocs#BrowseDocuments).

## Get document

View details about a specific document.

For details on how to retrieve a document, see the endpoint [Get Document](https://inference.aivax.net/apidocs#GetDocument).

## Delete document

Permanently delete a document by its ID.

For details on how to delete a document, see the endpoint [Delete Document](https://inference.aivax.net/apidocs#DeleteDocument).