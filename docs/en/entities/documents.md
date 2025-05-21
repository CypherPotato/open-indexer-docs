# Documents

A document represents a piece of knowledge. It is a limited, self-sufficient, and meaningful piece of text on its own. A document is the component that is indexed by the internal model to be retrieved later through a semantic search term.

Consider a car manual: it is not a document, but rather several documents. Each of these documents talks, in isolation, about a specific topic related to that car, in such a way that the document does not depend on external context or information to make sense.

Each document in this manual will talk about a topic: one will talk about how to turn on the car, another about how to turn it off, another about how its paint is made, and another about how to change the oil periodically. It is not a good idea to reserve a document to talk about several things at the same time, as this will reduce the objectivity and scope of the inference and reduce the quality of acquisition.

Examples of document creation:

### Do not do

- Do not create very short documents (with 10 or fewer words).
- Do not create very large documents (with 700 or more words).
- Do not talk about more than one thing in a document.
- Do not mix different languages in documents.
- Do not be implicit in documents.
- Do not write documents using technical language, such as codes or structures like JSON.

### Do

- Be explicit about the purpose of your document.
- Focus documents on individual topics, summarizing what should be done or explained.
- Always repeat terms that are keywords for the document search. Example: prefer to use "The color of the Honda Civic 2015 is yellow" instead of "the color of the car is yellow".
- Restrict the document content to talk about only one topic or subject.
- Use simple and easy-to-understand human language.

## API Usage

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
| `docid` | `string` | Specifies the document name. Useful for debugging and identification. |
| `text`  | `string` | The "raw" content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID of the document. |
| `__tags` | `string[]` | Optional. Specifies an array of document tags. Useful for document management. |

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
            "name": "Products/Schedules.rmd:1",
            "documentId": "01965f93-a391-712e-9292-c4d8e010bf42"
        },
        ...
    ]
}
```

## Create or modify document

This endpoint creates or modifies a document from its name. When a document is modified, its indexing vectors are reset, that is, the document will enter the queue again to be indexed by the indexing engine.

This indexing is not exempt from cost. The cost is relative to the number of tokens of the sent content. The cost is only generated when the document is actually changed. Calling this route with the same content as the document does not generate modification, therefore, it does not generate cost.

> [!WARNING]
>
> Warning: this endpoint generates cost. The cost is calculated based on the tokens of the content of the file. The content of the file is tokenized according to the model used in the indexing of the documents.

#### Request

<div class="request-item put">
    <span>PUT</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

```json
{
    // the name of the document that will be modified
    "name": "document-name",

    // the content of the document that will be created or overwritten if the name already exists
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
        
        // the state of the operation indicates whether the document was modified "Modified" or created "Created".
        "state": "Modified"
    }
}
```

## List documents

This endpoint lists all available documents in a collection. You can pass an additional query parameter `filter` to filter documents by name, tag, or content.

This filter supports expressions that help filter what you are looking for:
- `-t "tag"` - filters documents that have this tag.
- `-r "reference"` - filters documents that have this reference ID.
- `-c "content"` - filters documents that have this snippet in their content.
- `-n "name"` - filters documents that have this snippet in their name.

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
                "id": "01968452-69f6-7f00-a497-d14c5b906b79",
                "name": "Help/Customers.rmd:1",
                "reference": null,
                "tags": [
                    "Help",
                    "Customers"
                ],
                "contentsPreview": "A customer is a registration on your platform...",
                "indexState": "Indexed"
            },
            {
                "id": "01968452-6a53-7ce3-adad-fad32d508856",
                "name": "Help/Customers.rmd:2",
                "reference": null,
                "tags": [
                    "Help",
                    "Customers"
                ],
                "contentsPreview": "In the customer registration, it is possible to modify...",
                "indexState": "Indexed"
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
        
        // represents the indexing situation of the document.
        // valid values: Queued, Indexed, Cancelled
        "state": "Indexed",

        // content of the indexed document
        "contents": "...",

        // document reference ID
        "reference": "institutional-company"
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