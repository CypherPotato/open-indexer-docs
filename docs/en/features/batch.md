# Batch

Batch is AIVAX's feature for running the same AI workflow over many independent items. It turns a list of inputs into a background‑processed queue, with fixed instructions, defined model, structured output, optional validation, progress metrics, cost per item, retries, and result export.

Use Batch when you have dozens, hundreds, or thousands of records that need to undergo the same reasoning: classifying leads, extracting fields from text, enriching records, summarizing short documents, evaluating responses, moderating content, generating structured data, or invoking embedded tools for each line of a list.

## What Batch solves

Processing many items with AI usually requires a queue, concurrency control, pausing for balance or limits, error handling, retries, JSON validation, cost tracking, and result export. Batch consolidates these parts in AIVAX.

In practice, it mainly solves:

- **Repeatable processing:** the same instruction, model, and schema are applied to all items.  
- **Asynchronous execution:** the work continues in the background, without keeping a request open.  
- **Structured output:** each item can be required to return an object compatible with a JSON Schema.  
- **Correction and validation:** AIVAX tries to reprocess invalid responses and can run a second validation step.  
- **Operation at scale:** jobs can be started, paused, resumed, monitored, filtered, cleaned, resent for retry, and exported.  
- **Operational control:** the UI shows progress, failures, confidence, cost, and job events.

## When to use

Use Batch when items can be processed independently and do not need to share memory. Good examples are one line per client, URL, product, ticket, message, short document, contract snippet, or raw record.

Batch is a good choice when:

- the same prompt applies to all items;  
- you need tabular or JSON results for later consumption;  
- response time can be asynchronous;  
- you want to track errors and retry only the problematic items;  
- you want to use embedded tools, such as web search, for each item;  
- you need to measure cost, confidence, and success rate per run.

Do **not** use Batch for real‑time conversations, flows where one item depends on the previous item's response, document indexing for RAG, or purely deterministic tasks that do not require an AI model. To index searchable knowledge, use [RAG collections](/docs/en/rag/collections). For a single immediate response to a user, use [inference](/docs/en/inference/inference).

## Concepts

### Workflow

The workflow is the processing recipe. It defines how future items will be handled:

- title;  
- processing instructions;  
- model;  
- expected result schema;  
- enabled embedded tools;  
- reasoning effort, when the model supports it;  
- validation instructions;  
- consecutive error limit before pausing;  
- maximum retries per item.

Changing a workflow affects subsequent jobs and items processed with that configuration. Use separate workflows when the instruction, schema, model, or validation rules change in a significant way.

### Job

A job is a concrete execution created from a workflow. It groups the items of a workload, maintains state, events, and metrics.

A job can be:

- `Active`: processing pending items;  
- `Paused`: stopped manually or paused due to limit, balance, temporary unavailability, or many consecutive errors;  
- `Finished`: completed because all items were processed or because it was terminated.

### Item

An item is a row from the imported list. Each row becomes an independent input sent to the model with the workflow's instructions.

An item can end as:

- `Finished`: processed successfully;  
- `Refused`: the model rejected the input;  
- `ExecutionError`: there was an execution or inference error;  
- `ValidationError`: the response did not pass the schema or validation;  
- `Cancelled`: the item was cancelled/removed;  
- `Pending`: still awaiting processing.

Each item can also record priority, output, confidence, cost, and validation details.

## How to use in the console

In the AIVAX console, go to **Batch**.

### Create a workflow

In **Workflows**, create a workflow and configure:

1. **Basic:** set a title, the processing instruction, and the JSON Schema of the result.  
2. **Model:** choose an integrated model available in the account, the reasoning effort, and the embedded tools the model may use.  
3. **Validation:** enable a second validation pass when the response needs to be checked against business rules.  
4. **Handling:** adjust the consecutive error limit and the maximum retries per item.

Write the instruction as a general rule, not as a single question. The imported item will be the variable input.

Instruction example:

```text
Classify the company provided in the input. Return the likely sector, a short justification, and signals found in the text. If the input does not contain enough information, use sector "Undefined".
```

Schema example:

```json
{
  "type": "object",
  "properties": {
    "sector": { "type": "string" },
    "reason": { "type": "string" },
    "signals": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["sector", "reason", "signals"],
  "additionalProperties": false
}
```

### Create and run a job

After creating the workflow, create a job for the load you want to process. Import a list where each line is an item.

Lines can be plain text, delimited CSV, URLs, IDs, compact JSON, or any format the instruction knows how to interpret. For structured inputs, prefer JSONL: one JSON object per line.

Example:

```jsonl
{"name":"Empresa A","description":"Marketplace B2B para autopeças"}
{"name":"Empresa B","description":"Escritório especializado em contratos trabalhistas"}
{"name":"Empresa C","description":"Rede regional de farmácias"}
```

With the items imported, start the job. The job screen lets you monitor:

- overall progress;  
- pending, completed, and failed items;  
- cost already charged and projected cost;  
- average confidence;  
- job events;  
- most recent processed items;  
- full item list with filters by state and confidence.

### Operate on failed items

Use the list filters to find items with execution error, validation error, refusal, or low confidence. Then you can:

- retry all errors;  
- retry only execution errors;  
- retry only validation errors;  
- retry completed items with low confidence;  
- remove pending, completed, error, or all non‑running items;  
- open an individual item to review input, output, state, confidence, and cost.

### Export results

When the job finishes, export the results in JSONL. Each exported line contains metadata, the original input, and the output. Use this export to import into a spreadsheet, database, data pipeline, or manual review step.

## How to use via the API

Use the API when you want to integrate Batch into your internal system, data pipeline, or automation. Authentication follows the same pattern as the AIVAX API.

### Create workflow

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Create job

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Jobs are created paused. Import the items before starting.

### Import items

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Empty lines are ignored. Each non‑empty line becomes a pending item.

### Start, pause, or finish

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use `Paused` to pause and `Finished` to terminate.

### Monitor

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

To list items:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Useful filters:

- `state=Pending`, `Finished`, `Refused`, `ExecutionError`, `ValidationError` or `Cancelled`;  
- `confidence=high` for confidence ≥ 80%;  
- `confidence=low` for confidence < 30%;  
- `filter=text` to search in the input;  
- `limit=100` to adjust the list size within the allowed limit.

### Retry and clean

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Retry modes:

- `errors`;  
- `execution-error`;  
- `validation-error`;  
- `low-confidence`.

To remove non‑running items:

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Removal modes:

- `pending`;  
- `finished`;  
- `errors`;  
- `all`.

### Export

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use `state=all`, `finished`, `errors` or a specific state. You can also combine with `confidence=high` or `confidence=low`.

## Costs, limits, and automatic pauses

Each processed item generates inference cost according to the model used. If validation is enabled, validation runs a second model call and can also incur cost. Enabled embedded tools in the workflow may generate costs or consume their own limits.

A job can pause automatically when:

- the account has no available balance;  
- the plan’s processing limit has been reached;  
- the inference provider is temporarily unavailable;  
- the job accumulates many consecutive errors;  
- the user manually pauses the job.

When the pause occurs due to temporary unavailability or a recoverable limit, AIVAX may automatically resume the job later. When the pause is due to lack of balance, add balance before resuming manually or wait for automatic resumption.

## Best practices

- Test the workflow with a few items before importing a large list.  
- Use restrictive schemas with `required` and `additionalProperties: false` when the output will be consumed by a system.  
- Include input and output examples in the instruction when the format is ambiguous.  
- Prefer one line per item; if you need to send complex objects, use JSONL.  
- Keep validation enabled for sensitive tasks such as legal, financial extraction, or data that feeds automations.  
- Use `maxRetries` to fix occasional failures, but investigate repeated errors in the prompt or schema.  
- Set a low `errorStopThreshold` in new workflows to avoid spending on a batch with a wrong configuration.  
- Retry low‑confidence items separately; low confidence does not mean error, but indicates the response deserves review.  
- Export results by state when manual review is needed, e.g., first `finished`, then `errors`.