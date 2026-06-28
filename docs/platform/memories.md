# Memories

Memories are persisted user-specific facts that AIVAX can carry across conversations when a gateway or chat client uses memory-aware tools. Use the **Memories** page to inspect what the platform has stored for an external user, check whether a memory is shared or gateway-scoped, and delete memories that are no longer appropriate.

Memories are not a knowledge base. Use [RAG Collections](/docs/platform/rag-collections) for product manuals, policies, documents, and other source material that should be searched as knowledge. Use Memories for small pieces of user context, such as preferences, continuity notes, or reminders tied to an identified user.

## When to use Memories

Open **Memories** when you need to:

- Review what an assistant has remembered for a user.
- Check whether a memory belongs to all gateways or one specific gateway.
- Find memories by ID, content, external user ID, format, or gateway.
- Remove one incorrect memory.
- Remove all memories of one format for a user.
- Prepare a migration prompt for a user before moving their stored context.

Use [Conversations](/docs/platform/conversations) when you need to understand how a memory was created during a specific conversation. Use [Chat Clients](/docs/platform/chat-clients) when you need to check whether sessions are using a stable `tag`, because memory depends on an identifiable user reference.

## Before you begin

Memories are account-scoped and visible to authenticated console users who can access the active account. Because memory details and migration prompts can expose user-specific context, limit operational access to people who are authorized to review, migrate, or delete user data for that account.

Memory depends on three conditions:

- The assistant must run in a context with an identifiable user, such as a chat client session `tag` or a `user` value in a chat completions request.
- The relevant AI Gateway or runtime must have the Memory tool enabled when it should save, search, update, or remove text memories.
- Date-based reminders are stored through the Calendar tool and appear in Memories with the `DateReminder` format.

Without a user reference, memory tools cannot store or search user-specific information. AIVAX instructs the model not to save sensitive or personal data, but model behavior is not a compliance boundary. Design your gateway instructions and review process so the assistant does not store secrets, payment data, credentials, medical details, or unnecessary personal information.

Before viewing details, generating a migration prompt, or deleting records, confirm the active account, external user ID, format, and gateway source. If the action is part of a privacy, compliance, or support process, confirm that your destination system is approved for this data.

## Understand the Memories page

Open **Memories** from the console sidebar.

The top filters control the list:

| Filter | What it does |
| --- | --- |
| **Search** | Searches memory ID, content, and external user ID. The console waits briefly while you type before refreshing. |
| **Format** | Filters by `Text`, `DateReminder`, or all formats. |
| **Gateway** | Shows all gateways, only memories with no gateway link, or memories linked to one selected gateway. |
| **Refresh** | Reloads the current list using the selected filters. |

The **Persisted memories** table shows:

| Column | Meaning |
| --- | --- |
| **ID** | The memory identifier. The table shows a short copyable ID label, while the copied value is the full ID. |
| **External user ID** | The user reference that owns the memory. This usually comes from the chat client session `tag` or inference `user`. |
| **Content preview** | A shortened preview of the stored memory content. The API listing truncates content to 120 characters, and the console table shortens that preview again to 72 characters. Open details to retrieve the full content. |
| **Format** | `Text` for general memory or `DateReminder` for calendar/reminder data. |
| **Source** | The linked gateway, or **No gateway** when the memory is shared account memory. |
| **Actions** | Details, Migration prompt, Delete memory, and Delete all memories from user. |

The table paginates in pages of 25 rows. The listing returns only active, unexpired memories for the authenticated account, newest first.

## Find memories for a user

1. Confirm the active account in the account menu.
2. Enter the external user ID, memory ID, or a content phrase in **Search**.
3. Select **Format** when you need only `Text` memories or only `DateReminder` records.
4. Select **Gateway** when you need memories from one gateway or only **No gateway** shared memories.
5. Select **Refresh** after changing context or after a cleanup action.

If a user has no visible memories, clear the filters and search again by external user ID. The list shows active, unexpired records only, so an expired memory may not appear even if older stored data exists outside the normal listing.

## Read a memory safely

Use **Actions > Details** when the table preview is not enough. Details show:

- Full memory ID.
- External user ID.
- Format.
- Gateway link, when present.
- Created at and Expires at timestamps.
- Full content.

Treat the Details dialog as sensitive. Memory content can include user preferences, reminders, internal workflow context, or personal data that the assistant should not have stored. Redact before sharing screenshots or copied values.

## Understand memory scope

Memory scope determines which gateway can read or create a memory.

| Source in table | Meaning | Runtime effect |
| --- | --- | --- |
| **No gateway** | The memory is shared account memory. | Gateways that allow shared memory can see it for the same external user. |
| Gateway name | The memory is linked to that gateway. | The gateway can see its own memories. Other gateways can see it only when their memory visibility allows shared memory. |

In an AI Gateway, the Memory Configuration area controls related behavior:

- **Include all memory context:** When enabled, AIVAX injects all active `Text` memories visible to the gateway into the system context and does not expose `memory_search`. When disabled, AIVAX injects up to 10 visible `Text` memories and, when the Memory tool is enabled, exposes `memory_search` so the model can search additional memories.
- **Memory visibility:** Controls whether a gateway can consume memories from other gateways or only its own gateway-scoped memories.

New memories created while a gateway is running are linked to that gateway. Calls outside a gateway or contexts without a gateway link create shared memories.

## Work with Text and DateReminder formats

`Text` memories are plain user-persistent information, such as preferences or continuity notes. The Memory tool can save, search, update, remove, and clear these records.

`DateReminder` memories are calendar/reminder records stored by the Calendar tool. They appear in the same Memories page so account operators can inspect and delete them, but their content is structured reminder data rather than ordinary prose.

When filtering by format, remember that bulk deletion by user also requires a format. Deleting all `Text` memories for a user does not delete that user's `DateReminder` memories, and deleting `DateReminder` memories does not delete `Text` memories.

`memory_save` and `memory_update` reject `memoryData` larger than 10 KB. Both tools accept `retentionDays` from 1 to 365 days; when omitted, retention defaults to 30 days.

## Delete memories

Deletion is permanent from the console.

Use **Actions > Delete memory** when one specific record is wrong, outdated, or unsafe to keep. Confirm the flyout to remove that memory by ID. After deletion, refresh or repeat the same search; the deleted row should no longer appear, and opening details by that ID should no longer succeed.

Use **Actions > Delete all memories from user** only when you intend to clear one user's memories for the selected row's format. This is not a row-only action. It can remove multiple records.

This action deletes by format and by a normalized external user prefix: the API removes everything after the first `@` in the supplied `externalUserId`, then deletes records whose stored `ExternalUserId` starts with that normalized value. Confirm the identifier carefully before proceeding.

Before deleting:

1. Confirm the active account.
2. Confirm the external user ID.
3. Check the format: `Text` or `DateReminder`.
4. Open **Details** for at least one affected row if the preview is ambiguous.
5. Preserve approved evidence outside AIVAX if the deletion is part of a support, privacy, or compliance process.

Deleting a memory does not rewrite past conversations, remove exported conversation files, revoke chat sessions, or change gateway instructions. It only removes persisted memory records from future memory retrieval.

To confirm cleanup worked, refresh the page, search for the same external user ID, and verify that the deleted memory or deleted format no longer appears. Future memory retrieval should exclude the removed records, but past conversation logs remain unchanged.

## Use the migration prompt

Use **Actions > Migration prompt** when you need a compact, model-readable export of stored context for one exact external user ID. The prompt includes all memory records whose `ExternalUserId` exactly matches that value, plus related scheduled and recurring message data for the same exact value. Unlike the Memories list, this prompt is not limited to unexpired records and does not use normalized-prefix matching.

Before using a migration prompt:

1. Confirm the active account.
2. Confirm the exact external user ID.
3. Confirm the intended destination and data-handling approval.
4. Decide whether the included scheduled or recurring message data is appropriate for the migration.
5. Review and redact the generated prompt before sending it anywhere.

The migration prompt is not anonymized. It may contain sensitive user context or operational details, and it is meant as a working migration aid rather than a public export. Do not paste it into unrelated tools, tickets, or prompts unless the destination is approved for that data.

## Privacy and data minimization

Memories affect future assistant behavior, so store only what the assistant genuinely needs to personalize or continue work for a user.

Avoid storing:

- API keys, passwords, tokens, login keys, webhook secrets, or payment data.
- Government IDs, financial account data, health information, or other high-risk personal data.
- Customer-private details that are not needed for future assistance.
- Temporary issue details that belong in a support ticket or conversation log instead.
- Large documents, policies, manuals, or knowledge-base text that belongs in RAG.

Use expiration deliberately. Memory tool calls can request retention from 1 to 365 days, and the default is 30 days when no retention is supplied. Expired memories are hidden from normal listing and use; old expired records are later removed by background cleanup.

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| No memories appear for a user | The session did not have a stable user reference, the memory expired, the wrong account is active, or the filters are too narrow. | Confirm the active account, clear filters, search by external user ID, and verify the chat client session `tag` or inference `user`. |
| The assistant does not remember prior context | Memory tool may not be enabled, the gateway may not see shared memory, or the session user changed. | Check the AI Gateway built-in tools, Memory Configuration, and the user reference used by the client. |
| The wrong gateway sees a memory | Shared memory visibility may be enabled, or the memory has no gateway source. | Filter by Gateway on the Memories page and review the gateway's Memory visibility setting. |
| A memory contains sensitive or incorrect data | The assistant saved content that should not persist. | Delete the specific memory, review gateway instructions, and inspect Conversations to understand how it was created. |
| Bulk delete removed more than expected | Delete all memories from user deletes by normalized external user prefix and format, not by the selected row only. | Verify the affected external user ID and format before confirming; use single-memory delete for precise cleanup. |
| Calendar reminders appear in Memories | Calendar uses the same persistent store with the `DateReminder` format. | Filter by `DateReminder` when reviewing reminders, and delete only that format when clearing calendar data. |

## API reference

Use the console for manual review and cleanup. Use the Memories API when you need to build an audited, repeatable, or bulk internal workflow around persisted memories. The API is account-authenticated and exposes listing, detail, and deletion operations.

### List memories

List memories when you need to find active persisted records for the authenticated account. Use `filter`, `format`, and `gatewayId` to narrow the result before deleting or inspecting details.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Memories&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Get memory details

Get one memory when you already have the memory ID from the console, listing endpoint, or a review workflow.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Memory&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Delete memories

Delete by ID when you need precise cleanup. Delete by external user ID and format when fulfilling a user-level cleanup request for one memory type.

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Memories&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
