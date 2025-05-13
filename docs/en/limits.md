# API Limits

API rate limits ("rate limiters") regulate the number of requests you can send within a time window. These limits help Open Indexer prevent abuse and provide a stable API to everyone.

The API limits below are the same for all embedded Open Indexer models. These limits are categorized by operations performed by the API.

- **Document search**: occurs when you search documents in a collection through the `/v1/collections/<collection-id>/query` endpoint.
    
    - Limited to **300** requests every **1 minute**.

- **Document insertion**: occurs whenever a single document is inserted or updated.

    - Limited to **1,000** requests every **6 hours**.

- **Inference**: occurs whenever you use the inference of embedded models by Open Indexer, either through the OpenAI API, direct inference, or web chat client. Does not consider function calls.

    - Limited to **75** requests every **1 minute**.

- **Function call**: occurs whenever you make a function call.

    - Limited to **30** requests every **1 minute**; and
    - Limited to **300** requests every **1 hour**.

- **Connected function calls**: occurs whenever you call a function that performs internet searches (not through fetch).

    - Limited to **5** requests every **1 minute**; and
    - Limited to **50** requests every **1 hour**.

## Increasing usage limits

At the moment, these limits are applied to all accounts. If you need a higher limit, please contact us.