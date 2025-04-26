# Documents

A document represents a piece of knowledge. It is a limited, self-sufficient, and meaningful piece of information on its own. A document is the component that is indexed by the internal model to be retrieved later through a semantic search term.

Consider a car manual: it is not a document, but rather several documents. Each of these documents talks, in isolation, about a specific topic related to that car, in such a way that the document does not depend on external context or information to make sense.

Each document in this manual will discuss a topic: one will discuss how to turn on the car, another how to turn it off, another how the paint is made, and another how to change the oil periodically. It is not a good idea to reserve a document to discuss several things at the same time, as this will reduce the objectivity and scope of the inference and reduce the quality of acquisition.

Examples of document creation:

### ❌ Do not

- Do not create very short documents (with 10 or fewer words).
- Do not create very large documents (with 700 or more words).
- Do not discuss more than one thing in a document.
- Do not mix different languages in documents.
- Do not be implicit in documents.
- Do not write documents using technical language, such as codes or structures like JSON.

### ✅ Do

- Be explicit about the purpose of your document.
- Focus documents on individual topics, summarizing what should be done or explained.
- Always repeat terms that are keywords for the document search. Example: prefer to use "The color of the Honda Civic 2015 is yellow" instead of "the color of the car is yellow".
- Restrict the document content to discuss only one topic or subject.
- Use simple and easy-to-understand human language.

## Using the API

As all documents are entities that belong to a [collection](/entities/collections), always have the collection where the document is/will be located at hand.

## Sending documents in bulk

To send a large list of documents to a collection, structure them following the [JSONL](https://jsonlines.org/) format. The indexing file structure is:

```json
{"docid":"Cars/HondaCivic2015.rmd:1","text":"The Honda Civic 2015 is available in [...]","__ref":null,"__tags":["Cars","Honda-Civic-2015"]}
{"docid":"Cars/HondaCivic2015.rmd:2","text":"The engine of the Honda Civic 2015 is [...]","__ref":null,"__tags":["Cars","Honda-Civic-2015"]}
{"docid":"Cars/HondaCivic2015.rmd:3","text":"The color of the Honda Civic 2015 is Yellow [...]","__ref":null,"__tags":["Cars","Honda-Civic-2015"]}
...
```

The structure consists of the following properties:

| Property | Type | Description |
| ----------- | ---- | --------- |
| `docid` | `string` | Specifies the name of the document. Useful for debugging and identification. |
| `text`  | `string` | The "raw" content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID for the document. |
| `__tags` | `string[]` | Optional. Specifies an array of tags for the document. Useful for document management. |

A document reference is an ID that can be specified in several documents that need to be linked in a search when one of them is matched in a similarity search. For example, if a search finds a document that has a reference ID, all other documents in the same collection that share the same reference ID as the matched document will also be included in the search response.

The use of references can be useful when a document depends on another or more documents to make sense. There is no format requirement for the reference ID: any format is accepted.

You can send up to **1,000** lines of documents per request. If you need to send more documents, separate the sending into more requests. If you send a document with more than 1,000 lines, the following lines will be ignored.

Note that very long documents, which exceed the allowed number of tokens in the internal embedding model, will have their content **truncated** and the indexing quality may be severely affected. To avoid this problem, send documents that contain between 20 and 700 words.

> [!WARNING]
>
> Warning: this endpoint generates cost. The cost is calculated based on the tokens of the content of each document. The content of each document is tokenized according to the model used in the indexing of the documents.

#### Request

The sending must be done using **multipart form data**.

<div class="request-item get">
    <span>POST</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

```text
documents=[documents.jsonl]
```

#### Response

```json
{
    "message": null,
    "data": [
        {
            "name": "Institutional/Company.rmd:1",
            "documentId": "01965f93-a36b-7fc2-9e6a-c733f4955927"
        },
        {
            "name": "Institutional/Company.rmd:2",
            "documentId": "01965f93-a390-79d3-9b3d-338d407f6b64"
        },
        {
            "name": "Institutional/Company.rmd:3",
            "documentId": "01965f93-a391-79ef-adcf-737d98303a78"
        },
        {
            "name": "Products/Scheduling.rmd:1",
            "documentId": "01965f93-a391-712e-9292-c4d8e010bf42"
        },
        ...
    ]
}
```

## Create or modify document

This endpoint creates or modifies a document from its name. When a document is modified, its indexing vectors are reset, i.e., the document will be re-indexed by the indexing engine.

This indexing is not cost-free. The cost is relative to the number of tokens in the sent content.

> [!WARNING]
>
> Warning: this endpoint generates cost. The cost is calculated based on the tokens of the file content. The file content is tokenized according to the model used in the indexing of the documents.

#### Request

<div class="request-item put">
    <span>PUT</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

```json
{
    // the name of the document to be modified
    "name": "document-name",

    // the content of the document to be created or overwritten if the name already exists
    "contents": "Content of my document",

    // parameters explained earlier
    "reference": null,
    "tags": ["products", "my-product"]
}
```

#### Response

```json
{
    "message": null,
    "data": {
        "documentId": "0196663c-3a15-72c7-98e6-b496f8e8bb8c",

        // the operation status indicates whether the document was modified "Modified" or created "Created".
        "state": "Modified"
    }
}
```


## List documents

This endpoint lists all available documents in a collection.

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": {
        "pageInfo": {
            "currentPage": 1,
            "hasMoreItems": true
        },
        "items": [
            {
                "id": "01965b54-b31c-7184-9f5c-60b2648106d9",
                "name": "Institutional/Company.rmd:1",
                "reference": null,
                "tags": []
            },
            {
                "id": "01965b54-b32b-7433-b90b-73d71d21ae38",
                "name": "Institutional/Company.rmd:2",
                "reference": null,
                "tags": []
            },
            {
                "id": "01965b54-b32b-79bb-ac5e-729dfec701a8",
                "name": "Products/Scheduling.rmd:1",
                "reference": null,
                "tags": []
            },
            ...
        ]
    }
}
```


## View document

View details about a specific document.

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents/<span>{document-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": {
        "id": "01965f93-a36b-7fc2-9e6a-c733f4955927",
        "name": "Institutional/Company.rmd:1",
        
        // represents the indexing status of the document.
        // valid values: Queued, Indexed, Cancelled
        "state": "Indexed",

        // content of the indexed document
        "contents": "...",

        // id of the document reference
        "reference": "institutional-company",
        
        // brings all documents that share the same reference
        "references": [
            {
                "id": "01965b54-b32b-7433-b90b-73d71d21ae38",
                "name": "Institutional/Company.rmd:2"
            },
            {
                "id": "01965b54-b31c-7184-9f5c-60b2648106d9",
                "name": "Institutional/Company.rmd:3"
            }
        ]
    }
}
```


## Delete document

Permanently deletes a document through its ID.

#### Request

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents/<span>{document-id}</span>
    </span>
</div>

#### Response

```json
{
    "message": "Document removed.",
    "data": null
}
```