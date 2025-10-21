# Documents

A document represents a piece of knowledge. It is a limited, self‑contained excerpt that makes sense in isolation. A document is the component indexed by the internal model to be retrieved later through a semantic search term.

Consider a car manual: it is not a single document but several documents. Each of these documents talks, in isolation, about a specific subject of that car, so that the document does not depend on external context or information to make sense.

Each document in this manual will cover a topic: one will explain how to start the car, another how to turn it off, another how its paint is applied, and another how to change the oil periodically. It is not a good idea to reserve a document for multiple things at once, as this reduces the objectivity and scope of inference and lowers retrieval quality.

Examples of creating documents:

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
- Restrict the document content to a single topic or subject.
- Use human, simple, and easy‑to‑understand language.

## API Usage

Since all documents are entities that belong to a [collection](/entities/collections), always have the collection where the document is/will be located at hand.

## Batch upload documents

To send a bulk list of documents to a collection, structure them following the [JSONL](https://jsonlines.org/) format. The indexing file structure is:

```json
{"docid":"Carros/HondaCivic2015.rmd:1","text":"O Honda Civic 2015 está disponível em [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
{"docid":"Carros/HondaCivic2015.rmd:2","text":"O motor do Honda Civic 2015 é [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
{"docid":"Carros/HondaCivic2015.rmd:3","text":"A cor do Honda Civic 2015 é Amarela [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
...
```

The structure consists of the following properties:

| Property | Type | Description |
| ----------- | ---- | --------- |
| `docid` | `string` | Specifies the document name. Useful for debugging and identification. |
| `text`  | `string` | The raw content of the document that will be indexed. |
| `__ref` | `string` | Optional. Specifies a reference ID for the document. |
| `__tags` | `string[]` | Optional. Specifies an array of tags for the document. Useful for document management. |

A document reference is an ID that can be specified in multiple documents that need to be linked in a search when one of them is matched in a similarity search. For example, if a search finds a document that has a reference ID, all other documents in the same collection that share the same reference ID will also be included in the search response.

Using references can be helpful when a document depends on one or more other documents to make sense. There is no required format for the reference ID: any format is accepted.

You can send up to **10,000** document lines per request. If you need to send more documents, split the upload into multiple requests. If you send a document with more than 1,000 lines, the subsequent lines will be ignored.

Note that very long documents, which exceed the token limit of the internal embedding model, will have their content **truncated** and indexing quality may be severely affected. To avoid this issue, send documents that contain between 20 and 700 words.

> [!WARNING]
>
> Attention: this endpoint incurs cost. The cost is calculated based on the tokens of each document’s content. Each document’s content is tokenized according to the model used for indexing the documents.

#### Request

The upload must be performed using **multipart form data**.

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
            "name": "Institucional/Empresa.rmd:1",
            "documentId": "01965f93-a36b-7fc2-9e6a-c733f4955927"
        },
        {
            "name": "Institucional/Empresa.rmd:2",
            "documentId": "01965f93-a390-79d3-9b3d-338d407f6b64"
        },
        {
            "name": "Institucional/Empresa.rmd:3",
            "documentId": "01965f93-a391-79ef-adcf-737d98303a78"
        },
        {
            "name": "Produtos/Agendamentos.rmd:1",
            "documentId": "01965f93-a391-712e-9292-c4d8e010bf42"
        },
        ...
    ]
}
```

## Create or modify document

This endpoint creates or modifies a document by its name. When a document is modified, its indexing vectors are reset, meaning the document will be queued again for indexing by the indexing engine.

This indexing is not free. The cost is proportional to the number of tokens in the submitted content. The cost is only generated when the document is actually changed. Calling this route with the same document content does not produce a modification, therefore no cost is incurred.

> [!WARNING]
>
> Attention: this endpoint incurs cost. The cost is calculated based on the tokens of the file’s content. The file’s content is tokenized according to the model used for indexing the documents.

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
        
        // the operation state indicating the result:
        // NotModified - not changed (no alterations)
        // Modified - changes occurred and the document was queued for indexing
        // Created - document did not exist and was queued for indexing
        "state": ["Modified"]
    }
}
```


## List documents

This endpoint lists all documents available in a collection. You can pass an additional query parameter `filter` to filter documents by name, tag, or content.

The filter supports expressions that help narrow down what you are looking for:
- `-t "tag"` – filters documents that have this tag.
- `-r "reference"` – filters documents that have this reference ID.
- `-c "content"` – filters documents that contain this snippet in their content.
- `-n "name"` – filters documents that contain this snippet in their name.
- `in "id"` – filters documents by ID.

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
                "name": "Ajuda/Clientes.rmd:1",
                "reference": null,
                "tags": [
                    "Ajuda",
                    "Clientes"
                ],
                "contentsPreview": "Um cliente é um cadastro na sua platafor...",
                "indexState": ["Indexed"]
            },
            {
                "id": "01968452-6a53-7ce3-adad-fad32d508856",
                "name": "Ajuda/Clientes.rmd:2",
                "reference": null,
                "tags": [
                    "Ajuda",
                    "Clientes"
                ],
                "contentsPreview": "No cadastro do cliente, é possível modif...",
                "indexState": ["Indexed"]
            },
            ...
        ]
    }
}
```

## View document

Shows details about a specific document.

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
        "name": "Institucional/Empresa.rmd:1",
        
        // represents the indexing status of the document.
        // valid values: Queued, Indexed, Cancelled
        "state": ["Indexed"],

        // indexed document content
        "contents": "...",

        // document reference ID
        "reference": "institucional-empresa"
    }
}
```

## Delete document

Permanently deletes a document by its ID.

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