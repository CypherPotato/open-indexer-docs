# Conversations

Conversations is the observability area for model interactions stored in your account. Use it to find recent requests, inspect prompt and response behavior, review usage, connect a conversation to a gateway or session, export evidence, and remove stored conversation records when they are no longer needed.

Conversation records can contain prompts, assistant responses, tool calls, metadata, external user IDs, resource IDs, usage objects, response schemas, errors, and timing information. Treat this page as sensitive operational data.

## When to use Conversations

Use Conversations when you need to:

- Investigate a recent answer from the Chat Completions API, Sessions API, or Functions API.
- Find conversations by model, external user, API key, gateway, chat client, or chat session.
- Review token usage and resources connected to a specific interaction.
- Check whether a request failed and see the stored error message.
- Export conversations for audit, offline review, support, or quality analysis.
- Delete stored conversation records from the account.

Use [Analytics](/docs/platform/analytics) when you need billing rollups and spend trends. Use Logs when you need lower-level runtime or operational events.

## Before you begin

Conversation visibility is limited by your account plan's conversation retention period. The list and exports cannot return records outside the retained period, even if you choose a longer range.

Confirm that you are in the correct active account before investigating or deleting conversation data. If your observability or audit process requires stored conversations, also confirm that account-level conversation logging is enabled. When logging is disabled, future conversations may not be stored on this page.

Before sharing a conversation, export, screenshot, or copied JSON, redact secrets, customer data, API keys, session keys, private prompts, personal data, and unrelated metadata. Export URLs opened by the console include an `api-key` query parameter, so do not share browser URLs, history entries, proxy logs, or screenshots that include export request URLs.

## Browse conversations

Open **Conversations** from the console sidebar. The list shows recent conversations with:

- **Origin:** The API surface that created the conversation, such as Chat Completions API, Sessions API, or Functions API.
- **Updated:** The last update time.
- **Model:** The model used by the conversation.
- **Token count:** Total input and output tokens, including server-side tool re-calls when stored.
- **First user message:** A preview of the first user message.
- **Last assistant message:** A preview of the latest assistant response or an error indicator.
- **Actions:** Open the detail view or delete the conversation.

Search and time-range changes refresh the list automatically. Use **Refresh** when waiting for a recent request to appear.

## Filter the list

Use **Time range** to choose the lookback window:

- Last week
- Last 24 hours
- Last 2 hours
- Last 5 minutes

The requested window is also limited by the account retention period.

Use **Search** for free-text filtering or command-style filters. The built-in help lists supported filters:

| Filter | Use it to find |
| --- | --- |
| `--model` or `-m` | Conversations that used a specific model. |
| `--user` or `-u` | Conversations for a specific external user ID. |
| `--api-key` | Conversations associated with a specific API key ID. |
| `--gateway` | Conversations associated with a specific AI Gateway ID. |
| `--chat-client` | Conversations associated with a specific Chat Client. |
| `--chat-session` | Conversations associated with a specific chat session. |

Resource filters such as `--api-key`, `--gateway`, `--chat-client`, and `--chat-session` expect the full resource UUID, not a display name, short ID, or URL. `--model` and `--user` match exact string values case-insensitively.

You can click a model badge in the list to apply a model filter. When investigating a user report, start with the narrowest useful range and the most specific identifier you have, such as external user ID, gateway ID, or chat session ID.

The list is optimized for recent investigation, not complete audit proof. High-volume accounts can hit list caps before every matching conversation in a broad range is visible. Narrow the time range and use the export/API workflow for broader review.

## Inspect a conversation

Select **View** to open the conversation inspector. The inspector keeps the message transcript visible while the side panel shows observability details.

The side panel can include:

| Tab | What it shows | When to use it |
| --- | --- | --- |
| **Conversation data** | Conversation ID, request ID, model name, external user ID, origin, created and updated timestamps, token count, and metadata | Use for support handoff, correlation, and high-level identity checks. |
| **Usage** | Raw usage object and related resources | Use to connect the conversation to billing, gateways, collections, sessions, or other resources. |
| **Response schema** | Stored response schema, when the request used structured output | Use when investigating malformed or unexpected structured responses. |
| **Tools** | Tools available or recorded for the conversation | Use when checking whether a tool-enabled answer used the expected capabilities. |
| **Performance** | Request performance waterfall, when available | Use when diagnosing slow responses or provider/tool latency. |

The main message area shows user, assistant, tool, and informational messages. Very long conversations may show an omitted-message marker in the middle of the inspector. The detail view keeps the first 30 and last 40 messages and inserts an omitted count when the message list is longer. Use export when the middle of the transcript matters.

If the request failed, the inspector can show a **Request error** information block with the stored error message.

## Export conversations

Use **Export all** from the list to export conversations as JSONL. The dialog includes:

| Option | Values | Guidance |
| --- | --- | --- |
| **Period** | 2 hours, 1 day, 7 days, 30 days | The selected export period is still limited by account retention. |
| **Media** | Include, Truncate to text | Use text truncation when exports should not include full multipart media payloads. |
| **Thinking** | All, Only visible, None | Use **None** for most support handoffs, **Only visible** when reviewing user-facing reasoning, and **All** only for trusted internal debugging with approved storage. |
| **Truncate** | Token limit, where `0` disables truncation | Use a non-zero limit when exports may be large or when you only need a sample of each conversation. |

Use the detail page **Export** menu to export one conversation as JSON, or **Copy to clipboard** to copy the currently loaded detail object.

Single-conversation **Export as JSON** is a direct download, not the same configurable dialog as **Export all**. In the current console behavior, it exports the stored conversation with media included, all reasoning included, and no truncation. **Copy to clipboard** copies the loaded inspector object, which can omit middle messages in long conversations.

Both **Export all** and single **Export as JSON** open URLs with an `api-key` query parameter. Do not share those URLs, browser history, screenshots, network logs, or copied request URLs.

Exports may contain prompts, responses, hidden metadata, tool traces, media references, reasoning content depending on the selected option, and account identifiers. Store exports securely and delete local copies when they are no longer needed.

## Investigate a conversation

Use this flow for bad answers, errors, unexpected cost, or suspected unauthorized traffic:

1. Confirm the active account and choose the narrowest useful time range.
2. Search by the most specific identifier available: chat session, external user, gateway, API key, chat client, or model.
3. Open the conversation and copy the conversation ID and request ID.
4. Inspect **Conversation data**, **Usage**, **Tools**, **Response schema**, **Performance**, and any **Request error** block.
5. Cross-check related billing in [Analytics](/docs/platform/analytics) and runtime evidence in Logs.
6. Preserve only the minimum evidence needed for support, audit, or remediation.
7. Remediate the source: update the gateway, stop the caller, rotate or revoke an exposed key, delete an exposed session, or correct the source data.

## Share conversation evidence safely

Prefer sharing the conversation ID, request ID, approximate time range, origin, and a redacted description of the problem. Avoid full exports unless the recipient is trusted and the storage location is approved.

Before sending evidence, redact customer data, prompts, tool outputs, media, hidden reasoning, API keys, session keys, external user IDs when not required, unrelated metadata, and browser URLs with query strings.

## Delete conversations

Use the row action menu and select **Delete conversation** to remove a stored conversation. The console asks for confirmation and warns that the action cannot be undone.

Before deleting, verify the active account, confirm the conversation ID and request ID, and export or copy only the evidence you are allowed to retain. Deletion is irreversible from the console.

Deletion removes the stored conversation record from the account. It does not revoke API keys, delete chat sessions, remove source data, change invoices, or undo usage that was already recorded. If a conversation shows unauthorized activity, delete only after preserving the evidence needed for investigation, then rotate or revoke the relevant key or session separately.

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| A recent conversation is missing | The time range is too narrow, retention expired, account logging is disabled, list caps hide the record, or the request has not been stored yet | Choose a wider range within retention, clear filters, confirm logging settings, narrow the search, and refresh. |
| Search returns no results | The filter uses the wrong identifier type or a value not present in stored metadata | Use one filter at a time. Try model, external user ID, gateway ID, chat client, or chat session separately. |
| The detail view shows omitted messages | The conversation is long and the inspector keeps the beginning and end while omitting the middle | Export the conversation if you need the middle of the transcript, and choose export truncation carefully. |
| A conversation shows an error | The request failed during inference, tool use, validation, or another runtime step | Open the detail view, copy the request ID, inspect related Logs, and review the gateway, model, tool, or session involved. |
| Export is too large or too sensitive | The period is broad, media is included, reasoning is included, or truncation is disabled | Narrow the period, select **Truncate to text**, choose **Only visible** or **None** for Thinking, and set a truncate limit. |
| You found unauthorized traffic | An API key, public session, gateway, chat client, or integration may be exposed | Preserve minimum evidence, stop the caller, rotate or revoke keys, delete exposed sessions, and review Analytics for impact. |

## API reference

Use the Conversations API when you need to build your own observability, audit, export, or cleanup workflow.

### List and export

List recent conversations with optional filters, or export multiple conversations as JSONL.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Conversations&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Conversations%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Inspect, export, or delete one conversation

Use a single-conversation endpoint when you already have the conversation ID from the list, a support case, logs, or an internal correlation workflow.

The public reference for single-conversation export may show query options also used by JSONL exports. Verify current behavior before relying on truncation, media, or thinking controls for single JSON exports; use bulk JSONL export when configurable redaction is required.

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Conversation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Conversation%20%28JSON%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Conversation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
