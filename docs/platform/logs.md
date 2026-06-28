# Logs

Logs give authenticated account users a short, account-scoped view of operational warnings and errors that AIVAX records while platform resources run. Use this page when something looks wrong and you need a fast signal before opening a deeper page such as Conversations, RAG Collections, Batch, or Analytics.

Logs are not a full transcript system and they are not an analytics ledger. They are most useful for recent operational messages: failed generation attempts, provider or tool errors, indexing warnings, document-size warnings, and other notifications that should be visible to the account owner.

## When to use Logs

Open **Logs** when you need to answer questions like:

- Did AIVAX record a recent warning or error for this account?
- Did an indexing job flag a document as too small or too large?
- Did a provider, gateway, or tool path fail while processing a request?
- Is a support case related to account state, resource configuration, or a deeper conversation-specific issue?

Use [Conversations](/docs/platform/conversations) when you need the actual prompt, response, metadata, usage, tools, or request details for an inference. Use [Analytics](/docs/platform/analytics) when you need usage totals, cost trends, or invoices. Use [RAG Collections](/docs/platform/rag-collections) when the problem is retrieval quality, indexing state, or collection transactions.

## Understand the Logs page

Open **Logs** from the console sidebar. The page title is **Account Logs**.

The table shows the most recent logs for the active account:

| Column | Meaning |
| --- | --- |
| **Date and time** | When AIVAX wrote the log entry. |
| **Level** | The severity. The console may show the level as a compact badge such as `I`, `W`, or `E` for Information, Warning, or Error. |
| **Message** | The human-readable log message. Long stored messages may be truncated by the platform before they reach the table. |
| **Actions** | Per-row actions. The current console action is **Copy to clipboard**. |

Use **Refresh** to reload the list. The console requests `/api/v1/information/logs.json`, which returns the newest authenticated-account log entries first, capped at 300 entries. The console table paginates those results in pages of 30 rows. This console endpoint is used by the authenticated AIVAX console and is not currently listed in the published API reference.

## Read log levels

Log levels help you decide the next action.

| Level | What it usually means | What to do |
| --- | --- | --- |
| **Information** | A normal account-level event or background notification. | Use it as context; no action is usually required unless it relates to an investigation. |
| **Warning** | A resource worked, but AIVAX detected something that may reduce quality or reliability. | Read the message and check the named resource. For example, a large-document warning usually means you should split that RAG document into smaller chunks. |
| **Error** | A request, provider call, tool call, indexing step, or integration path failed. | Use the timestamp and message to find the related resource, then inspect the deeper page for the affected feature. |

## Investigate a warning or error

Start from the log message and work outward. A log row usually gives you a timestamp and a short description; some messages also include a resource identifier.

1. Confirm the active account in the account menu.
2. Select **Refresh** so you are looking at the newest rows.
3. Find the most recent Warning or Error near the time of the reported issue.
4. Open the row **Actions** menu and select **Copy to clipboard** when you need to paste the message into an internal ticket or compare it with another resource.
5. Open the product page related to the message:
   - RAG document or indexing messages: open [RAG Collections](/docs/platform/rag-collections).
   - Batch job or item messages: open [Batch](/docs/platform/batch).
   - Unexpected model behavior, failed tools, or request-level problems: open [Conversations](/docs/platform/conversations).
   - Cost or balance problems: open [Analytics](/docs/platform/analytics) or [Account, balance, and multiple accounts](/docs/platform/account-balance).
6. Use the timestamp, model, gateway, resource ID, collection ID, batch job ID, or related conversation to narrow the investigation. Never paste raw API keys into tickets or shared notes.

When a log points to a document-size issue, treat it as a quality signal. Oversized chunks can make retrieval less precise, while very small chunks can lack enough context. Adjust the document chunking strategy, reimport or reindex the affected documents, and test retrieval before relying on the collection in production.

## Share log information safely

Log messages are account operational data. They may contain resource IDs, provider names, tool names, document names, or fragments of operational context. They should not normally contain secrets, but do not assume every copied message is safe to share.

Before sharing a log message, redact:

- API keys, session keys, login keys, webhook secrets, or bearer tokens.
- Personal data or customer identifiers.
- Internal URLs, request IDs, account IDs, and infrastructure details unless the recipient needs them.
- Private prompts, tool arguments, or business process details.

Do not share browser network logs from the console. Network captures may include authorization headers or authenticated response headers that are not part of the visible log table.

## Limits and retention

Logs are intentionally short-lived and recent-focused:

- Logs are account-scoped to the authenticated account.
- The listing returns the newest account logs first.
- The API response is capped at 300 entries, and the console paginates those results 30 rows at a time.
- Messages longer than 5,000 characters are truncated before storage.
- Background cleanup removes log entries older than 7 days, so Logs should not be treated as permanent audit storage.

If you need durable investigation evidence, copy the relevant message into your own approved support or incident system while the entry is still available. For full conversation evidence, use Conversations export instead of relying on Logs.

## What Logs do not show

Logs are a high-level operational signal. They do not replace:

- Conversation transcripts, tool calls, request metadata, or message hashes.
- Complete API request and response payloads.
- Full provider traces or infrastructure logs.
- Billing ledgers or detailed usage breakdowns.
- RAG transaction scoring and matched-document details.

Use Logs to decide where to look next, then move to the product-specific page that owns the full detail.

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| A known issue does not appear in Logs | The issue did not create an account log entry, the entry is older than the retention window, or you are viewing the wrong account. | Confirm the active account, refresh, then check Conversations, Batch, RAG Collections, or Analytics for feature-specific evidence. |
| The table shows only old rows | No newer account-level log entries have been written, or the page has not refreshed. | Select **Refresh** and reproduce the issue in a controlled test if you need a new signal. |
| A warning mentions a large document | The RAG document may be too large for precise retrieval. | Split the document into smaller chunks, reimport or reindex it, and test the collection before production use. |
| An error message is too general | Logs intentionally summarize account-level failures. | Use the timestamp, resource ID, gateway, API key, or related conversation to open the deeper diagnostic page. |
| You need to share evidence with another team | The raw message may include operational context. | Copy only the relevant row, redact sensitive data, and avoid sharing console network captures or screenshots that include secrets. |
