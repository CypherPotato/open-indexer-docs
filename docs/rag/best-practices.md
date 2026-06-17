# Best Practices for RAG

Use this guide when preparing documents for AIVAX collections and semantic search. The search pipeline indexes document text as embeddings, stores the resulting vectors, and later compares user queries with those indexed vectors. Search quality depends heavily on how clear, focused, and self-contained each document is.

## Document Size

A document should represent one limited piece of knowledge.

As a practical target, keep most documents between 20 and 700 words. This range is not a hard API rule, but it usually gives the embedding model enough context without mixing unrelated topics.

The current indexer also records warnings for unusually small or large documents:

- Documents below about 10 tokens are accepted, but may be too small to retrieve reliably.
- Documents above about 1,562 tokens are accepted, but the indexer truncates the text used for embedding to about 5,000 characters and records a warning.

If a document is longer than that, split it before indexing. Use paragraphs, sections, policy clauses, FAQ entries, product descriptions, or other logical units.

## What to Avoid

- Empty, tiny, or title-only documents.
- Entire PDFs, chapters, logs, or manuals as one document.
- Multiple unrelated subjects in one document.
- Text that depends on surrounding pages to make sense.
- Mixed languages inside the same document, unless the user is expected to search that way.
- Raw JSON, code, tables, or logs without a short natural-language explanation.
- Generic pronouns and references such as "it", "this process", or "the product" when the document does not identify the subject.

## What to Do

- Give each document a clear name and focused text.
- Put the subject near the start of the document.
- Use natural language similar to the way users ask questions.
- Repeat important identifiers, product names, policy names, acronyms, and terms when they matter.
- Keep one document focused on one answerable topic.
- Use `__tags` to organize documents operationally.
- Use `__ref` to group chunks that belong to the same logical source.
- Use `__meta` for structured data your application needs to keep, such as source URL, version, author, or publication date.

Example:

Prefer:

```text
The color of the 2015 Honda Civic registered in fleet record CAR-123 is yellow.
```

Avoid:

```text
The car is yellow.
```

The first version can be retrieved and understood without external context.

## Metadata, Tags, and References

Only the document text is embedded for semantic matching. Metadata is returned with results and can be useful for applications, audits, source links, versioning, or display, but it should not replace searchable text.

Use tags for maintenance and filtering, not as the only place where important meaning appears. If a user may search for "refund policy", those words should appear in the document text, not only in a tag.

Use references when several chunks represent the same source item. When reference expansion is enabled, a matched chunk can return other documents that share the same reference.

## Chunking Larger Sources

When importing PDFs, spreadsheets, web pages, or manuals, inspect the generated chunks before relying on the collection. Remove repeated headers, footers, navigation menus, broken tables, boilerplate, and irrelevant disclaimers when possible.

Good chunks usually include:

- A title or source heading.
- The immediate section context.
- The complete rule, answer, instruction, or explanation.
- Enough surrounding text to answer a question without neighboring pages.

Poor chunks often contain:

- Half of a table row.
- A sentence that depends on the previous page.
- Several policies mixed into one block.
- Repeated layout text from the original file.

## Query Quality

Semantic search works best when documents and queries use compatible language. If users ask full questions, prepare documents that contain complete explanations. If users search by product codes, policy IDs, plan names, or procedure names, include those identifiers in the text.

When search results are poor, check the basics first:

- Confirm the documents are indexed.
- Search the collection directly before testing through an AI gateway.
- Try a complete question instead of isolated keywords.
- Compare the query language with the document language.
- Review whether the relevant answer is split across too many small chunks or buried inside a very large one.

Well-prepared documents make RAG predictable: the model receives clearer source material, search returns fewer irrelevant matches, and answers become easier to audit.
