# Batch

Batch runs the same AI workflow over many independent inputs. Use it when you want AIVAX to classify, extract, enrich, summarize, validate, or generate structured output for a list of records without keeping a chat or inference request open.

The Batch area is organized around two objects:

- **Workflows** are reusable processing recipes. They define the instruction, model, result schema, optional tools, validation, retries, and error handling.
- **Jobs** are concrete runs created from a workflow. They hold the imported items, processing state, progress, events, cost, confidence, item details, retries, cleanup, and exports.

For implementation details, request fields, and API behavior, see the [Batch developer guide](/docs/features/batch).

## When to use Batch

Use Batch when every item can be processed independently with the same instruction. Good examples include lead classification, support-ticket tagging, metadata extraction, URL or company enrichment, short document summarization, moderation review, response evaluation, and JSON generation for later import into another system.

Do not use Batch for real-time chat, workflows where each answer depends on the previous answer, or searchable knowledge bases. Use [Chat Clients](/docs/platform/chat-clients) for user-facing conversations, [AI Gateways](/docs/platform/ai-gateways) for reusable inference behavior, and [RAG Collections](/docs/platform/rag-collections) when the goal is to index knowledge for retrieval.

## Before you begin

Prepare a small representative sample before importing a large file. Batch can spend balance quickly when a workflow uses an expensive model, validation, web tools, image generation, or many retries.

You need:

- An account with available balance and access to the model or AI Gateway you plan to use.
- A clear instruction that applies to every item.
- A result schema if the output will feed a spreadsheet, database, automation, or review queue.
- A decision about whether validation is worth a second model pass.
- Input data that is safe to process with the selected model and tools.

Avoid importing secrets, credentials, regulated personal data, or customer data that your account is not allowed to process. Exports include original input, generated output, metadata, confidence, validation result, and timing fields, so treat exported JSONL as sensitive operational data.

## Test with a small sample first

Before running a real workload, create a pilot job with 5 to 20 representative items. Start the job, then inspect the **Insights**, **Processing list**, item **View** details, confidence, validation result, cost, and exported JSONL shape.

Use the pilot to answer these questions:

- Does the instruction produce the right decision or extraction for normal, edge, and poor-quality inputs?
- Does the result schema contain the fields your downstream process expects?
- Are validation failures useful, or are they rejecting acceptable results?
- Is the confidence distribution good enough for your review process?
- Is the cost per item acceptable before multiplying it by the full dataset?

Adjust the workflow before creating the production job. For important workloads, keep pilot and production jobs separate so the production export contains only the intended records.

## Understand the Batch page

Open **Batch** from the console sidebar.

The **Workflows** tab lists reusable workflows with their ID, creation time, title, model, job count, and actions. From this table you can create a workflow, create a job from an existing workflow, edit the workflow, or delete it.

The **Jobs** tab lists recent jobs across workflows. Use it when you want to monitor or return to a processing run without first opening the parent workflow. The list shows the job ID, name, state, progress, runtime, event count, and a **Manage** action.

## Create a workflow

Create a workflow when you want to save a repeatable processing rule. The workflow should read like a policy for every item, not like a one-time prompt.

In **Workflows**, select **Create workflow**. Configure the tabs:

| Tab | What to configure | Guidance |
| --- | --- | --- |
| **Basic** | Workflow title, workflow instructions, result schema | Use the title for operators. Put the task rules in the instruction. Use a JSON Schema when downstream systems expect stable fields. |
| **Model** | Model, reasoning effort, enabled tools, tool options | Choose a model that fits the quality, speed, and cost tradeoff. Enable tools only when each item truly needs them. |
| **Validation** | Enable validation and validation instructions | Enable when results need an additional model check against business rules, safety rules, or output quality. |
| **Handling** | Error stop threshold and max retries per item | Use a low threshold while testing so a bad prompt or schema pauses early. Increase it only after the workflow is proven. |

The new workflow draft starts with an empty instruction, a permissive object schema, no tools, validation disabled, an error stop threshold of `5`, and max retries of `2`. Saved workflows require a non-empty instruction, a result schema object, and an available model or AI Gateway. The API accepts `errorStopThreshold` from `1` to `100` and `maxRetries` from `0` to `10`.

Use **Edit with AI** to help refine the instruction, schema, and validation instruction. Review the diff before accepting it, especially if the workflow handles regulated or high-impact decisions.

## Enable tools safely

Enabled tools are available to the model for every processed item. They can improve results, but they can also add cost, expose item content to external retrieval paths, create persistent side effects, or make runs harder to reproduce.

| Tool | Use when | Safety guidance |
| --- | --- | --- |
| **Open URLs** | Each item includes a URL that should be read directly | Import only URLs the account is allowed to process. Expect failures for blocked, private, or unstable pages. |
| **Web search** | The model needs current public information | Search can add latency and cost. Do not rely on it for private facts or records that should stay internal. |
| **X posts search** | Public X posts are part of the evidence | Treat social results as noisy and time-sensitive. Validate outputs before acting on them. |
| **Advanced web usage** | A task needs deeper browsing behavior | Use only for workflows where external page interaction is required. Test with a small job because failures can be site-specific. |
| **Code execution** | Each item needs computation or parsing that the model can express as code | Do not feed secrets or untrusted code instructions. Review outputs carefully before using them in automations. |
| **Image generation** | The expected result includes generated images | This can materially increase cost and may produce content that needs human review before publication. |
| **Memory** | The workflow intentionally needs remembered context | Avoid using it for isolated, auditable jobs where each item should be processed only from its input and workflow instruction. |

If a result includes unexpected external or remembered context, pause the job, disable the related tool, revise the instruction, and test with a new pilot job.

## Use validation carefully

Validation runs a second model pass to check the output. It is useful when the result must follow business rules, safety requirements, or a strict schema before it can be trusted downstream.

Write validation instructions as concrete checks. For example, ask the validator to confirm that required fields are present, the justification cites evidence from the input, or the chosen label belongs to an allowed list. Avoid vague instructions such as "make sure the answer is good"; they can create inconsistent `ValidationError` results.

Validation can add cost and can turn generated outputs into failed items. When validation errors appear, open item details and review the validation reason before retrying. If the reason shows a prompt or schema problem, fix the workflow and run a pilot job instead of retrying the whole workload.

## Create a job

Create a job when you have a concrete workload to process through a workflow. From a workflow row, open the actions menu and select **Create job**. Give the job a name that describes the dataset, period, customer, or review round.

New jobs are created paused. This is intentional: import and inspect the item list before starting processing.

## Import items

Open the job and go to **Processing list**. Use **Insert data** to add items.

| Mode | When to use it | What becomes one item |
| --- | --- | --- |
| **From text file** | You already have one file with many records | Each non-empty line |
| **From files** | Each source file is one record | Each uploaded plain-text file |
| **From zip** | You want to upload many text files together | Each plain-text ZIP entry |
| **Type text** | You want to add one manual test item | The submitted text field |

For structured line-based inputs, JSONL is usually the safest format: one compact JSON object per line. The workflow instruction should explain how to interpret each object.

Example JSONL:

```jsonl
{"company":"Northwind Parts","description":"Regional distributor of industrial replacement parts"}
{"company":"Contoso Legal","description":"Law firm focused on employment contracts"}
```

Include only fields the workflow needs. Extra identifiers, personal data, or internal notes can appear later in exports.

For `files` and `zip` imports, current limits are 1,000 files or ZIP entries per request, 10 MB per file or ZIP entry, and 100 MB total imported content per request. ZIP imports also check for invalid compression behavior. In `lines` mode, AIVAX imports each non-empty line from the uploaded file; empty lines are skipped.

## Start, pause, and finish

Use **Start job** only after the imported items look correct. Starting a job moves it to `Active` and allows workers to process pending items. Processing can generate model, validation, and tool costs.

Use **Pause job** when you need to stop new processing while investigating errors, reviewing cost, changing operational timing, or waiting for more balance. A running item may finish even after a pause request; pausing stops further processing but does not interrupt an inference already running.

Jobs finish automatically when all items are processed. The console primarily exposes start and pause controls. Use the API to set a job to `Finished` only when an automation should close the run instead of leaving it resumable.

## Monitor a job

The job page has three main tabs:

- **Insights** shows progression, completion, success rate, refusal rate, average confidence, charged cost, predicted cost, elapsed time, ETA, and latest processed items.
- **Processing list** shows every listed item with state, priority, input preview, confidence, cost, filters, retries, removal actions, and item details.
- **Events** shows operational history such as job creation, start, pause, finish, and automatic state changes.

Open **View** on an item to inspect metadata, input content, output, cost, confidence, validation status, and validation reason. Use this before changing prompts, retrying items, or trusting low-confidence output.

## Work with item states and confidence

Items can be:

- `Pending`: waiting for processing.
- `Finished`: processed successfully.
- `Refused`: the model refused the item.
- `ExecutionError`: inference or execution failed.
- `ValidationError`: the response did not pass schema or validation.
- `Cancelled`: a possible terminal item state returned by the system.

The Processing list can filter by state, high confidence, and low confidence. High confidence means at least 80%. Low confidence means below 30%. Low confidence is not automatically a failure, but it is a strong signal for manual review or retry.

Item priority affects processing order together with account plan priority and insertion order. Pending, non-running items can be moved up, moved down, or removed from the processing list with **Cancel**. The current cancel action is destructive for that item and does not interrupt an inference already running, so export anything you need first.

## Retry safely

Use **Retry** after you understand the failure pattern.

Retry options are:

- **All failed**
- **Low confidence**
- **Execution error**
- **Validation error**

Retry moves matching non-running items back to `Pending`. If at least one item is retried and the job is not already active, AIVAX starts the job automatically. This can generate new cost, so check the instruction, schema, validation rule, and model before retrying many items.

## Remove or delete data

Use **Remove** on the Processing list to remove groups of non-running items:

- Pending items
- Successful items
- Failed items
- All non-running items

Removal is destructive for the selected items. Export anything you need before removing it.

Deleting a job deletes the job and all its items. Deleting a workflow deletes the workflow, all of its jobs, and every queued or processed item under those jobs. Use deletion only after exports and audit requirements are satisfied.

## Export results

Use **Export** on the job page to download processed items as JSONL.

Available exports include:

- Successful
- High confidence
- Low confidence
- Failed
- All processed

The console also includes **Copy line schema** as a clipboard helper. It copies the JSON Schema for exported JSONL lines, including metadata, input, output, confidence, and validation fields; it is not a separate JSONL export mode.

Pending items are not exported. Each exported line contains metadata, original input, output, confidence, and validation result. Keep exports in a secure location and avoid sharing them in support tickets unless sensitive fields are removed.

The console export download opens a URL that includes the current session key as an `api-key` query parameter. Do not share export URLs, browser history, proxy logs, screenshots, or copied request URLs that include this query string. Redact query parameters before troubleshooting with another person.

Use separate exports when your review process differs by outcome. For example, export successful high-confidence items for downstream import, then export low-confidence or failed items for human review.

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| The job does not process items | The job is paused, finished, out of balance, blocked by limits, or has no pending items | Check job state, balance, pending count, and events. Start or resume only after the item list is correct. |
| Many validation errors appear | The schema is too strict, the instruction is ambiguous, or validation rules conflict with the result schema | Open item details, compare output with the schema, adjust the workflow, and retry a small subset first. |
| Many execution errors appear | Provider, model, tool, or request failures are occurring | Check events and item details. Retry execution errors after confirming the model and tools are available. |
| Confidence is low | The item lacks enough evidence, the instruction is underspecified, or the model is uncertain | Review sample outputs, improve the instruction or input format, and retry low-confidence items separately. |
| Imported items look wrong | The source file was not one-record-per-line, ZIP entries were not plain text, or unnecessary fields were included | Pause the job before processing. Remove non-running items, fix the import format, and rerun a pilot job. |
| Tool-based workflow fails | The selected tool cannot access the URL, search source, page, code path, or generated media requirement | Open item details and events, test with fewer items, and disable tools that are not required for the task. |
| Results include unexpected external or remembered context | A web or memory tool added context that was not intended for this isolated run | Pause the job, disable the related tool, revise the instruction, and create a new pilot job. |
| Export is missing records | Pending items are not exported, or the export filter excludes them | Check the Processing list filters and use **All processed** when you need every processed outcome. |
| Cost is higher than expected | The model, validation pass, tools, retries, or item count increased usage | Pause the job, inspect cost and predicted cost, reduce tools or validation if appropriate, and test with a smaller sample. |

## API reference

Use the API when Batch is part of an internal data pipeline or automation. The API follows the same flow as the console: create a workflow, create a paused job, import items, start the job, monitor items, retry or remove selected records, and export processed results.

When using API exports, protect credentials the same way you protect API keys. Do not paste export URLs with `api-key` query parameters into tickets, chat messages, logs, or screenshots.

### Workflows

Create and maintain reusable processing recipes.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Workflows&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Jobs

Create, start, pause, monitor, and delete concrete processing runs.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Account%20Batch%20Jobs&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Jobs&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Items and export

Import workload items, inspect individual outputs, retry or clean groups, and export processed JSONL.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
