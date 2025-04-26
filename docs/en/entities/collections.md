# Collections

A collection is a knowledge library: it houses several knowledge documents.

- Use collections to group documents by purpose, such as documenting a product, a company, a service, or workflow.
- Collections do not incur costs. There is no limit to the number of collections per account.

## Create a Collection

To create an empty collection, provide only its name:

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/collections
    </span>
</div>

```json
{
    // The collection name cannot be empty.
    "collectionName": "My first collection"
}
```

#### Response

```json
{
    "message": null,
    "data": {
        // Unique ID of the created collection.
        "collectionId": "01965b62-17c4-7258-9aa8-af5139799527",
        
        // A private key used to perform semantic queries on the collection.
        "queryKey": "cky_gr5uepj18yhuop3zcsa4c7b8stdmpgg7kk4jaf4iug6x3hg7umyhk3o"
    }
}
```

## List Collections

Lists the collections available in your account.

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections
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
                "id": "01965b62-17c4-7258-9aa8-af5139799527",
                "createdAt": "2025-04-22T02:44:37",
                "name": "My collection"
            },
            {
                "id": "01965b54-7fbd-70cd-982b-604de002ac0a",
                "createdAt": "2025-04-22T02:29:46",
                "name": "Another collection"
            }
        ]
    }
}
```

## View a Collection

Obtains details of a collection, such as its indexing progress and information like creation date.

#### Request

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/
    </span>
</div>

#### Response

```json
{
    "message": null,
    "data": {
        "name": "My collection",
        "createdAt": "2025-04-22T02:29:46",
        "queryKey": "cky_gr5uepj18yhd1qbshep7bki5e83hftbp6hbep97r8di9n4tta9ykswo",
        "state": {
            
            // Returns the number of documents waiting for indexing
            "queuedDocuments": 0,
            
            // Number of documents ready for query
            "indexedDocuments": 227
        }
    }
}
```

## Delete a Collection

Deletes a collection and all documents within it. This action is irreversible.

#### Request

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/
    </span>
</div>

#### Response

```json
{
    "message": "Collection deleted successfully.",
    "data": null
}
```


## Clear a Collection

Unlike deleting a collection, this operation removes all documents from the collection, including indexed and queued ones.

#### Request

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/reset-only
    </span>
</div>

#### Response

```json
{
    "message": "Collection cleaned successfully.",
    "data": null
}
```