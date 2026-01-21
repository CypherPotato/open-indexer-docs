# Best Practices for RAG

To obtain the best results with indexing and semantic search, the quality of your documents is fundamental. The way you structure and write your documents directly impacts the model's ability to retrieve the correct information.

## Structure and Size

A document should represent a limited and self‑contained snippet of knowledge.

- **Ideal size**: Keep documents between 20 and 700 words.  
    - **Too short (< 20 words)**: May not have enough context to be found semantically.  
    - **Too long (> 700 words)**: May have its content truncated, affecting indexing quality, or mix many different topics, confusing the search.

## What to Do and What to Avoid

### ❌ Do not

- **Very short or empty documents**: Avoid creating documents with 10 words or fewer.  
- **Giant documents**: Do not submit documents with thousands of words; break them into smaller parts.  
- **Mixing subjects**: Do not talk about multiple unrelated things in the same document (e.g., "How to start the car" and "Gas price" in the same text).  
- **Mixing languages**: Keep the document in a single language for better embedding performance.  
- **Implicit language**: Avoid texts where the subject or context is not clear (e.g., "He is blue" – who is he?).  
- **Excessively technical language**: Avoid indexing pure JSONs or code logs without textual explanation.

### ✅ Do

- **Be explicit**: The document should make sense on its own.  
- **Single focus**: Each document should cover a single topic or concept.  
- **Keyword repetition**: Use important terms explicitly.  
    - *Example*: Prefer "The color of the 2015 Honda Civic is yellow" instead of "the car's color is yellow".  
- **Natural language**: Write as a human would speak or explain the subject.  
- **Use Tags**: Use tags to categorize your documents and facilitate filters.

## Additional Tips

- **Context Independence**: Imagine the document will be read out of order. Does it still make sense? If the answer is no, rewrite it to be independent.  
- **Metadata**: Use the metadata field to store structured information (source, author, date) that does not need to be searched semantically but is useful for reference.  
- **Chunks**: If you have a large PDF, do the "chunking" (splitting) of it into paragraphs or logical sections before indexing.

Following these guidelines will ensure that the RAG system retrieves the most relevant information for your users.