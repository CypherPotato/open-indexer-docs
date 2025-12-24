# Collections

A collection is a knowledge library: it houses multiple knowledge documents.

- Use collections to group documents by purpose, such as documenting a product, a company, a service, or a workflow.
- Collections incur no cost. There is no limit to the number of collections per account.

> [!TIP]
>
> Collections implement the **RAG (Retrieval-Augmented Generation)** technique. To understand when to use RAG compared to Skills and System Prompt, see our [complete comparison guide](/docs/en/concepts-comparison).

## Create a collection

To create an empty collection, provide only its name.

For details on how to create a collection, refer to the [Create Collection](https://inference.aivax.net/apidocs#CreateCollection) endpoint.

## List collections

Lists the collections available in your account.

For details on how to list collections, refer to the [List Collections](https://inference.aivax.net/apidocs#ListCollections) endpoint.

## View a collection

Retrieves details of a collection, such as its indexing progress and information like creation date.

For details on how to view a collection, refer to the [Get Collection Details](https://inference.aivax.net/apidocs#GetCollectionDetails) endpoint.

## Delete a collection

Deletes a collection and all documents within it. This action is irreversible.

For details on how to delete a collection, refer to the [Delete Collection](https://inference.aivax.net/apidocs#DeleteCollection) endpoint.

## Reset a collection

Unlike deleting a collection, this operation removes all documents from the collection, including indexed ones and those in the queue.

For details on how to reset a collection, refer to the [Reset Collection](https://inference.aivax.net/apidocs#ResetCollection) endpoint.