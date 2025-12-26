# RAG

AIVAX provides an autonomous RAG (Retrieval-Augmented Generation) service and allows you to use these documents in chat conversations with your [AI gateways](/docs/en/entities/ai-gateways/ai-gateway). When the user asks a domain‑specific or specific question, an AI gateway automatically incorporates relevant documents to answer that question.

You can use RAG directly, without associating it to an AI gateway, through a collection. Collections are groups of [documents](/docs/en/entities/documents) that contain information that will be retrieved later. These documents are persistently stored in a similarity database.

## Collections

Collections allow you to upload, save, manage, and semantically query documents stored in them. You can associate a collection with an AI gateway or query it directly via the API.

Through the AIVAX interface, you can upload batches of documents and create documents with chunking, and associate them as a single document in the embedding result.

## Costs and limits

There is no storage limit on collections, only the existing [rate limits](/docs/en/limits) on the account. Collections