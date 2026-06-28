# Skills

Skills are reusable instruction packages that help an AI Gateway apply specialized behavior only when it is relevant. Use them for domain expertise, response style, review procedures, compliance rules, or task-specific workflows that would be too large or too situational to keep in the gateway's base instructions.

A skill has:

- **Slug:** The stable identifier used by gateways, imports, exports, and API calls.
- **Description:** A short routing explanation that tells the model when the skill should be used.
- **Instructions:** The full guidance inserted when the skill is active.
- **Options:** Stored remote instruction-source configuration and tool-name associations.

For deeper behavior and activation details, see the [Skills developer guide](/docs/features/skills).

## When to use Skills

Use Skills when the assistant needs specialized behavior only for some tasks:

- Legal, finance, healthcare, support, engineering, or other domain-specific methods.
- A tone or response format that should apply only to a certain workflow.
- A review checklist, operating procedure, or escalation policy.
- A set of long instructions that would waste context if always active.
- Several distinct rule sets that should not all apply at once.

Do not use Skills for instructions that must always apply. Put permanent behavior in the AI Gateway instructions. Do not use Skills as a searchable knowledge base; use [RAG Collections](/docs/platform/rag-collections) when the assistant needs to retrieve factual documents. Do not use a skill to expose a tool unless the task truly needs that tool.

## Understand the Skills page

Open **Skills** from the console sidebar.

The **My skills** table shows:

- **Id:** The unique skill ID.
- **Slug:** The stable skill name.
- **Description:** A preview of when the skill should be used.
- **Allowed tools:** The number of tool names stored in the skill options. Zero is normal for instruction-only skills.
- **Actions:** Edit or delete the skill.

Use **New skill** to create one skill. Use **Manage** to import skills from JSONL, export all skills, or delete all skills.

## Create a skill

Select **New skill**, then fill in the **Skill editor** tab.

| Field | What to enter | Guidance |
| --- | --- | --- |
| **Slug** | A short technical name | Use 1-64 letters, numbers, underscores, periods, or hyphens. Lowercase words separated by hyphens, such as `contract-review` or `support-escalation`, are easiest to read. Keep it stable; changing it can affect gateways, imports, and references. |
| **Description** | When the skill should be used | Write this as a routing rule. A good description says the task, domain, and trigger conditions. |
| **Instructions** | The full behavior to apply | Write operational guidance: what to do, what to avoid, what to ask when information is missing, expected output format, and any limits. |

Use **Edit with AI** when you want help improving the description or instructions. Review the diff before accepting it; this action can rewrite important operating rules.

After saving, test the skill through an AI Gateway that has access to it. A skill that looks well-written in isolation can still conflict with gateway instructions, tools, or other skills.

## Write a strong description

The description is how the model decides whether to load the skill. It should be specific enough to separate this skill from nearby skills.

Weak:

```text
Legal skill.
```

Better:

```text
Use when the user asks to review, explain, or compare contract clauses in plain language, especially obligations, termination, liability, confidentiality, or dispute-resolution terms.
```

Avoid overlapping descriptions across many skills. If two skills both claim the same task, the model may load the wrong one or load too many.

## Write useful instructions

Instructions should tell the model how to perform the task after the skill is active.

Good skill instructions usually include:

- The objective of the skill.
- The expected response structure.
- Domain rules or checklists.
- Questions to ask when required information is missing.
- Boundaries, disclaimers, or escalation rules.
- Tool-use guidance, if tools are allowed.
- Examples only when they reduce ambiguity.

Keep sensitive secrets, API keys, credentials, customer-private data, one-off case details, escalation contacts, policy thresholds, defensive controls, legal positions, and incident procedures out of reusable skills unless the skill truly requires them. Skills can be exported, reused, and enabled in gateways, so treat them as account-level operational configuration.

## Configure Options

Open the **Options** tab to configure additional behavior.

### Remote instruction sources

Remote instruction sources store external instruction-source configuration with the skill. They are useful as configuration metadata, but current skill activation reliably injects the inline **Instructions** field. Do not depend on remote instruction sources for required runtime behavior unless your integration has verified that path.

Before adding a remote source, confirm:

- The source is stable, versioned or pinned, and controlled by your organization.
- The content is reviewed before production use and reviewed again when it changes.
- The source does not expose secrets or private customer data.
- The source is not third-party controlled, publicly editable, or user-editable without review.
- You have tested the gateway/runtime behavior that is expected to use the stored source configuration.

If the assistant must rely on a changing body of factual content, prefer RAG Collections over embedding that knowledge directly in a skill.

### Skill visible tools

**Skill visible tools** stores tool names intended to be associated with the skill. Use this configuration carefully, and verify behavior in the exact gateway where the skill will run. The reliable way to keep shared tools visible when an AI Gateway hides tools without a skill is the gateway's general always-visible tool configuration.

Only expose tools the task actually needs. Tool access can change cost, privacy, external data exposure, and output reliability.

| Tool category | Main risk | Safer practice |
| --- | --- | --- |
| External web, browser, or search tools | The assistant may send task context outside AIVAX | Allow only when the workflow requires current external information, and state what may be searched. |
| Account, database, or internal-operation tools | The assistant may act on sensitive business data | Restrict to reviewed skills and test with non-production prompts first. |
| Write, send, delete, or publish tools | The assistant may create side effects | Require explicit user confirmation in the skill instructions. |
| Expensive generation tools | The assistant may increase usage cost | Describe when the tool is allowed and how to stop after enough output is produced. |

After changing tool associations, test the skill in the gateway where it will be used and review Conversations to confirm the behavior is expected.

## Enable skills in an AI Gateway

Creating a skill stores it in the account, but the assistant only benefits from it when the runtime or AI Gateway can use it. In a typical gateway setup, enable the relevant skills on the AI Gateway and test a prompt that should activate each one.

When a gateway has skills available, the runtime can expose a `read_skill` function. The model calls `read_skill` with matching skill slugs, and the selected skill instructions are inserted into the next context turn inside activated-skill blocks. For this to work reliably, the selected model and gateway path must support function calling and system instructions, unless your gateway pipeline provides an equivalent compensation path.

To connect a skill to a gateway:

1. Open the relevant [AI Gateway](/docs/platform/ai-gateways).
2. Find the gateway area where skills, tools, or behavior are configured.
3. Attach or enable the skill by its slug or name.
4. Save the gateway.
5. Run a prompt that clearly matches the skill description.

To validate a skill:

1. Save the skill.
2. Attach or enable it in the relevant AI Gateway.
3. Ask a prompt that clearly matches the skill description.
4. Ask a nearby prompt that should not use the skill.
5. Review the response for format, scope, and tool use.
6. Check [Conversations](/docs/platform/conversations) when you need evidence of model behavior, tool calls, usage, or errors.

If the skill affects a production workflow, validate one skill at a time before enabling a larger bundle.

## Import and export Skills

Use **Manage > Export skills** to download all account skills as JSONL. Each line contains one skill with `slug`, `description`, `instructions`, and `options`.

Use **Manage > Import skills** to upload a `.jsonl` file. Each line must be a JSON object with at least `slug` and `instructions`.

Example JSONL line:

```json
{"slug":"support-escalation","description":"Use when a support answer needs escalation criteria or handoff wording.","instructions":"Classify the issue, state the escalation reason, and ask for missing account or incident context before recommending a handoff."}
```

Import behavior:

- Existing skills are matched by slug case-insensitively and updated rather than duplicated.
- `instructions` are required and replace the existing instructions.
- `description` is replaced by the imported value and may become empty if the file omits it.
- `options` are preserved when omitted and replaced when supplied.
- Large imports may be capped; compare the returned imported and skipped counts with the number of JSONL lines you expected to process.

Before importing over a production account:

1. Confirm the active account.
2. Export the current skills and verify the download.
3. Review the JSONL file in source control or a trusted review process.
4. Import a small pilot file first when possible.
5. Test affected AI Gateways after import.

A JSONL import can update many skills at once, and changed instructions can affect any gateway that uses those skills.

The console export opens a URL that includes the current session key as an `api-key` query parameter. Do not share export URLs, browser history, screenshots, proxy logs, or copied request URLs that include this query string. The exported JSONL itself can also contain sensitive operating rules, tool associations, and source configuration, so store it as account configuration rather than public documentation.

## Delete Skills

Use the row action menu to delete one skill. Use **Manage > Delete all skills** only when you intentionally want to remove every skill in the active account.

Deletion is irreversible from the console. Before deleting:

- Confirm the active account.
- Export the current skills if you may need to restore them.
- Search AI Gateways for the skill slug or name, document affected gateways, and remove or replace the skill before deleting it.
- Preserve change notes outside AIVAX if the deletion is part of a controlled rollout.

Deleting a skill removes the stored instruction package. It does not automatically rewrite gateway instructions, delete conversations, undo prior usage, or remove exported copies.

Delete all skills is an account-wide action for the active account. Avoid using it during production traffic unless you have exported a backup, verified the account selector, and planned the gateway behavior that should remain after the skills are gone.

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| The assistant does not use the skill | The skill is not enabled on the relevant gateway, the model did not select it, or the description is too vague | Confirm the skill is attached to the gateway, confirm the model path supports function calls and system instructions, test with only this skill enabled, then make the description more specific. |
| The wrong skill activates | Skill descriptions overlap or use broad language | Rewrite descriptions as distinct routing rules and reduce overlap between similar skills. |
| Responses ignore the skill instructions | Gateway instructions, model limitations, or other skills conflict with the skill | Check that activation happened, test one skill at a time, simplify instructions, and review Conversations or Logs for evidence. |
| Tool behavior is unexpected | Tool associations do not match the gateway configuration, too many tools are visible, or the skill does not explain when to use tools | Review both the skill options and the AI Gateway tool visibility settings, add tool-use rules to the instructions, and retest in the gateway. |
| Import changes more than expected | Existing skills were matched by slug and overwritten | Restore from a prior export if needed, then import a smaller reviewed JSONL file. |
| Export contains sensitive data | Skill instructions include private operating rules, customer details, or secrets | Remove sensitive content from skills and rotate any exposed secrets outside AIVAX. |

## API reference

Use the Skills API when you manage skills from an internal tool, deployment pipeline, or backup workflow.

The update endpoint accepts partial skill changes and shallow-merges `options`. JSONL import has different semantics: it upserts by slug, replaces imported fields, preserves `options` only when omitted, and replaces `options` when supplied.

### Create and manage one skill

Create, inspect, update, or delete individual skills.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Skills&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Update%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Import, export, and clear

Use JSONL import/export for migration, backups, review, and versioned skill bundles. Use clear only after exporting and confirming the active account.

Exports can be requested with an API key. Treat the request URL and downloaded JSONL as sensitive account configuration, especially when they include instructions, tool associations, or source configuration.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Skills%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Skills%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Clear%20Skills&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
