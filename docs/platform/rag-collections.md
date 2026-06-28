# RAG Collections

Use **RAG Collections** to store searchable knowledge that AI Gateways, MCP clients, and direct RAG API calls can retrieve later. A collection is the boundary for a knowledge base: it groups documents, indexing state, context, tags, search tests, and retrieval history in one place.

This page is for builders and operators who manage knowledge bases from the AIVAX console. For API schemas, JSONL import format, and deeper retrieval behavior, see [Collections and Documents](/docs/rag/collections) and [Semantic search](/docs/rag/semantic-search).

## Before you begin

Sign in to the [AIVAX console](https://console.aivax.net/) and open **Dashboard > RAG Collections**. Confirm the active account before importing, resetting, deleting, or reindexing a collection.

Before changing a production collection, identify:

- Which AI Gateways, chat clients, batch workflows, MCP clients, or applications use it.
- Whether the change affects source documents, metadata only, or generated vectors.
- Whether users are currently querying the collection.
- Whether you need a JSONL export before making the change.
- Whether the import or reindexing operation can generate indexing cost.

## When to use a collection

Use a collection when an assistant or application needs answers grounded in account-owned knowledge, such as product manuals, policies, support articles, contract clauses, catalog items, operational procedures, or tenant-specific information.

A collection is useful when the knowledge should be:

- Searchable by semantic meaning, not only exact keywords.
- Reused by more than one gateway or integration.
- Maintained separately from gateway instructions.
- Exported, audited, reimported, or tested directly.
- Observed through retrieval scores and transaction history.

Do not put every source into one large collection by default. Prefer separate collections when knowledge has different owners, lifecycle, languages, access rules, environments, or quality expectations.

## Understand the collection list

The RAG Collections page shows the collections owned by the active account.

| Column or control | Use it for |
| --- | --- |
| **New collection** | Create an empty collection before adding documents. |
| **Filter columns...** | Search collections by visible table text. |
| **Id.** | Short display form of the collection ID. Copy the full ID when integrating through API or MCP. |
| **Name** | Friendly collection name shown in the console. |
| **Created at** | Creation date and time. |
| **Current state** | Indexed, queued, and outdated document counts as a segmented status bar. |
| **View** | Open the collection details, documents, transactions, and settings. |

Create a collection with a name that identifies its purpose and environment, such as `Help Center - Production` or `Legal Policies - Internal`. The console requires a name of at least three characters.

## Create a collection

To create a collection:

1. Select **New collection**.
2. Enter a purpose-oriented collection name.
3. Confirm the dialog.
4. Open the new collection with **View**.

Confirm that the new collection appears under the expected active account and starts with the expected document state. For production knowledge bases, consider creating separate staging and production collections so you can test imports, chunking, and retrieval quality before changing the collection that live gateways use.

## Browse documents

Open **View** on a collection to reach the collection workspace. The **Browse documents** tab is the main maintenance surface.

The summary cards show:

| Card | Meaning |
| --- | --- |
| **Total documents** | Number of documents currently stored in the collection. |
| **Query coverage** | Portion of recorded RAG transactions that returned documents. Use it as a quality signal, not as a complete relevance guarantee. |
| **Avg. Performance** | Average retrieval processing time from recorded RAG transactions. |
| **Avg. Score** | Average score from recorded RAG transactions. |

The document table shows each document's short ID, updated time, name, reference ID, tags, content preview, indexing state, and actions. Use the search box for name, ID, or content text. Use **Filter state** to focus on all, indexed, or queued documents. Use **Order by** to sort by created, updated, or indexed time in either direction.

Use this tab after imports to confirm that documents arrived, moved from queued to indexed, and look like focused chunks rather than entire source files pasted into one document.

## Add or edit documents

Select **New document** to create one document manually, or **Edit** on an existing row to update a document.

The document editor has:

| Field or control | Use it for |
| --- | --- |
| **Document name** | Stable name used to identify this document on later updates. |
| **Tags** | Maintenance labels for filtering and organization. |
| **Reference ID** | Shared identifier for related chunks from the same source. |
| **Split multiple sections** | On document creation, split text separated by `---` into multiple documents. |
| **Document contents** | The text that will be indexed and retrieved. |
| **Document information** | Approximate token count, estimated indexing cost, word count, character count, and section count. |
| **Edit with AI** | Ask AIVAX to propose an edit to the document text before saving. |

Write documents as focused, self-contained chunks. A retrieved document should contain enough context for the model to use it without guessing what came before or after it. If you paste a long manual page, split it into topic-sized sections first. If you edit an existing document that contains section separators, the console warns that saving will not split it into multiple documents.

Changed document text is queued for indexing. Metadata-only maintenance can avoid unnecessary reindexing when performed through the API. For the exact upsert behavior and JSONL field names, see [Document fields](/docs/rag/collections#document-fields).

## Import documents

Use **Options** in the collection workspace when you need to import or export data.

| Action | Use it for |
| --- | --- |
| **Import from files** | Upload images, audio, video, or PDF files so AIVAX can extract documents with an LLM-based OCR/extraction algorithm. |
| **Import from JSONL** | Upload prepared text documents where each line is one JSON object. |
| **Export to JSONL** | Download collection documents for backup, migration, review, or offline processing. Treat exports as sensitive operational data. |
| **View MCP code** | Configure the collection as an MCP source through the collections MCP endpoint. |

Choose **Import from JSONL** when your application or preprocessing pipeline already prepared clean chunks. The console import dialog accepts a `.jsonl` file, explains that unchanged existing documents are ignored, and states a console file limit of 10,000 documents and 50 MB per file. Plan and API limits may still apply; see [Batch import limits](/docs/rag/collections#batch-import-limits).

A JSONL import is an upsert. If `docid` matches an existing document and `text` changes, AIVAX updates that document and queues it for reindexing. Export first, test in a non-production collection when possible, and verify `docid` collisions before importing into production.

Choose **Import from files** when you need AIVAX to extract text from source media. The dialog accepts image, audio, video, and PDF files, asks for an extraction algorithm, and includes a **Context** field to guide extraction. Use the context field to describe what the source contains and what should be preserved, not to add unrelated instructions.

Only upload files you are allowed to process with AIVAX. Extracted text becomes collection content and can later be retrieved by gateways, MCP clients, or API calls that use the collection.

> [!WARNING]
> Imports and vector updates can consume credits. Export the collection first when you need a rollback copy, and test imports in a non-production collection when the source format or chunking strategy is new.

Treat exported collection JSONL as sensitive data. It may contain source text, customer data, internal procedures, tags, references, and document IDs. Store it securely and redact it before sharing outside the team that owns the knowledge base.

## Use the playground

Select **Playground** from the collection workspace to test retrieval before attaching the collection to a production gateway.

The playground lets you configure:

| Setting | Use it for |
| --- | --- |
| **Search text** | The query you want to test. Use realistic user wording. |
| **Minimum score** | Lowest score accepted for returned documents. Higher values reduce noise but can hide useful results. |
| **Maximum results** | Number of documents to return. More results can improve recall but increase context size. |
| **Reranker** | `none`, `lexical`, or `smart`. Lexical is a no-cost word-aware reranker; smart uses a specialized reranking model and is priced separately. |
| **Endpoint** | `/query` returns matching documents; `/answer` asks a model to answer using retrieved documents. |
| **Include chunked references** | Include related chunks that share references when enabled. |

Use the playground as a quality gate:

1. Test common user questions.
2. Confirm that the returned documents are relevant and specific.
3. Compare `/query` and `/answer` when you need both source inspection and answer behavior.
4. Adjust score, result count, reranker, document chunking, or collection context.
5. Attach the collection to an [AI Gateway](ai-gateways.md) only after retrieval is consistent.

The **View code** action generates a quick example for the selected playground endpoint. Use the API reference below as the canonical integration source, replace placeholders, and keep API keys in environment variables before sharing or committing examples.

## Configure collection settings

Open **Settings** to manage collection-level metadata.

| Setting | Use it for |
| --- | --- |
| **Collection Name** | Friendly name used in the console and model-facing collection awareness. |
| **Collection Context** | A hint that describes what the collection contains so models and operators understand its purpose. |
| **Generate context from documents** | Ask AIVAX to propose collection context and tags from existing documents. This may consume credits and analyzes stored document content. Review the proposed diff for secrets, private data, and unintended model-facing instructions before saving. |
| **Collection Tags** | Tags that categorize the collection as a whole. |
| **Save changes** | Persist edited name, context, and tags. |

Good collection context tells the model what the collection is about and what kinds of answers it can support. Keep it factual and concise. Do not put secrets, private customer data, credentials, or hidden operational instructions in collection context.

## Use advanced settings safely

The **Advanced settings** menu contains high-impact maintenance actions.

| Action | Effect | Use it when |
| --- | --- | --- |
| **Update outdated documents** | Marks outdated vectors so the indexing job rebuilds embeddings. The console warns that this may generate cost. | Embedding behavior changed, documents show outdated state, or retrieval quality depends on refreshed vectors. |
| **Reset collection** | Deletes all pending and indexed documents, but keeps the collection record and configuration. | You want to keep the collection shell but rebuild its contents from scratch. |
| **Delete collection** | Deletes the collection and all documents. This cannot be undone from the console. | The collection is no longer used by any gateway, client, workflow, or application. |

Before resetting or deleting:

1. Export the collection to JSONL if you may need the documents later.
2. Check AI Gateways and integrations that reference the collection.
3. Confirm that no production traffic depends on it.
4. Prefer testing replacement collections before changing production collections.
5. After the change, verify gateway behavior and collection transactions.

## Review RAG transactions

Use the **Transactions** tab to understand how the collection is actually being searched.

The tab includes:

| Control or column | Meaning |
| --- | --- |
| **View** | Switch between `Recent`, `Low quality`, and `High quality` transaction views. |
| **Refresh** | Reload the selected transaction view. |
| **Export JSONL** | Download the selected transaction view for offline review. |
| **ID** | Transaction identifier. |
| **Moment** | When the retrieval happened. |
| **Original score** | Initial retrieval score before reranking. |
| **Reranker score** | Score assigned by the reranker when one was used. |
| **Query** | Search query recorded for the transaction. |
| **Results** | Number of returned documents. |
| **Details** | Opens timing, cost, score, reranker, and matched-document details. |

Use **Low quality** to find queries that need better documents, lower score thresholds, different chunking, clearer collection context, or a different reranker. Use **High quality** to identify examples worth reusing as regression tests. Transaction visibility is subject to account-plan retention; review [Plans and limits](/docs/limits) when planning monitoring or export cadence.

The details dialog can show request ID, query text, processing time, cost, original score, reranker score, final score, reranker name, matched document IDs, document names, scores, and content previews. Treat exported transactions as operational data: remove user text, customer data, and internal identifiers before sharing outside your team.

## Use collections through MCP

The **View MCP code** action generates an MCP configuration for querying the collection through `/v1/mcp/collections`. The generated configuration includes collection headers such as collection ID, collection name, top-k, minimum score, and reference behavior.

Generated MCP snippets can include the current console session key in the `Authorization` header. Replace it with `YOUR_AIVAX_API_KEY` or an environment variable before sharing, saving, or committing the configuration. Do not share generated console URLs or snippets that include `api-key` or `Authorization` values. If a real key, session-bearing URL, or session-bearing snippet was exposed, rotate or revoke the affected credential.

Keep MCP access read-only by default. Do not enable collection write access for general assistants or untrusted clients. Write-enabled MCP tools can create, update, or delete collection documents. Use a dedicated credential with the minimum access needed and rotate it if exposed.

## Troubleshooting

| Symptom | Check | Fix |
| --- | --- | --- |
| Collection does not appear in the list | Active account, account switcher, and collection limit for the current plan. | Switch to the expected account or create the collection in the correct account. |
| Documents stay queued | Indexing volume, account balance, daily RAG insertion limits, document size, and background processing time. | Wait for indexing, reduce import size, top up balance, or split imports into smaller batches. |
| Search returns no documents | Query wording, indexing state, minimum score, collection ID, and whether the right collection is selected. | Lower minimum score temporarily, test broader wording, confirm documents are indexed, and inspect document contents. |
| Search returns irrelevant documents | Chunk size, document context, tags, references, reranker, score threshold, and query strategy in the gateway. | Split broad documents, improve source text, test lexical or smart reranking, and raise minimum score deliberately. |
| Gateway answer ignores the collection | Gateway RAG tab, attached collection IDs, query strategy, maximum results, minimum score, and prompt instructions. | Test the collection directly in the playground, then retest the same prompt through the gateway. |
| Import skips records | Existing document names with unchanged content, JSONL format, missing required fields, or file-size/line limits. | Validate the JSONL file, change document text when reindexing is intended, and split large files. |
| Reset was done by mistake | Whether a JSONL export exists and whether gateways still reference the same collection. | Reimport the latest export into the same collection, wait for indexing, then retest affected gateways. |
| Collection was deleted by mistake | Whether a JSONL export exists and which gateways, MCP clients, or API callers referenced the deleted collection ID. | Recreate a collection, reimport the latest export, wait for indexing, and update every integration that used the old collection ID. |
| MCP client cannot query the collection | API key, generated headers, collection ID, minimum score, top-k, and reference behavior. | Replace session credentials with a private API key, verify headers, and test the same query in the console playground. |

## API reference

Create, inspect, edit, export, reset, delete, and reindex collections through the Collections API:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collections&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Collection%20Details&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Reset%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Update%20Collection%20Vectors&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Review RAG transaction activity through the collection transaction endpoints:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Collection%20RAG%20Transaction&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Manage collection documents through the Documents API:

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Test retrieval through the RAG API:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Answer%20generation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Related documentation:

- [Collections and Documents](/docs/rag/collections): technical collection and document behavior.
- [Semantic search](/docs/rag/semantic-search): query parameters, reranking, references, and answer generation.
- [AI Gateways](ai-gateways.md): attach collections to assistant configurations.
- [Account, balance, and multiple accounts](account-balance.md): manage balance, limits, and API keys.
