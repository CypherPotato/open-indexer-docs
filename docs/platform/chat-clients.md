# Chat Clients

Use **Chat Clients** to connect an AI Gateway to people through a web chat session, Telegram bot, or WhatsApp integration. The gateway controls the assistant's behavior; the chat client controls the channel, session identity, user interface, limits, integrations, scheduled continuations, and conversation entry points.

This page is for builders and operators who manage chat clients from the AIVAX console. For API session mechanics and channel behavior, see the [developer Chat Clients guide](/docs/features/chat-clients).

## Before you begin

Sign in to the [AIVAX console](https://console.aivax.net/) and open **Dashboard > Chat clients**. Confirm the active account before editing a client, copying session links, changing integrations, or deleting sessions.

Before creating or changing a production chat client, identify:

- Which [AI Gateway](ai-gateways.md) should answer messages.
- Which channel you are serving: web chat, Telegram, WhatsApp, or a mix.
- What user identity should be used as the session tag or external user ID.
- Which attachments, tools, audio, memory, scheduled continuations, or workers the gateway may use.
- What limits should protect the assistant from abuse or runaway sessions.
- Where conversation logs and support review should happen.

## When to use a chat client

Use a chat client when a human user needs a managed conversation surface rather than a raw API call. Chat clients are useful for:

- Website or product assistants.
- Support portals and internal help desks.
- Telegram bots.
- WhatsApp support through Evolution API, Kapso, or legacy Z-Api.
- Demo links or controlled test conversations.
- Session-based conversations that need context, expiration, usage limits, and observability.

Use direct inference instead when your application owns the full UI, identity model, and conversation state.

## Understand the chat-client list

The Chat clients page shows each client owned by the active account.

| Column or control | Use it for |
| --- | --- |
| **New chat client** | Create a client and link it to an AI Gateway. |
| **Filter columns** | Search visible list values. |
| **Id.** | Short display form of the chat client ID. Copy the full ID when integrating through API or configuring webhooks. |
| **Name** | Friendly client name shown in the console. |
| **Associated gateway** | Gateway that receives messages from this client. |
| **Active sessions** | Number of sessions currently listed for the client. |
| **Manage** | Open the client editor. |
| **Sessions** | Open session management for the client. |
| **Scheduled messages** | Open scheduled messages and recurring tasks for the client. |

## Create a chat client

To create a client:

1. Select **New chat client**.
2. Set **Chat client name** to a clear channel and environment name.
3. Select the **Associated gateway** that should answer messages.
4. Choose the **UI language** or leave it on auto-detect.
5. Review customization, limits, and channel settings.
6. Select **Create chat client**.

Confirm that the client appears in the list with the expected gateway. For public or customer-facing channels, test with a non-production gateway or private session before publishing links or webhooks.

## Configure the client editor

Open **Manage** on a chat client to edit it. Save changes only after reviewing all tabs that affect production behavior.

| Tab | Use it for |
| --- | --- |
| **Chat client** | Client name, associated gateway, and interface language. |
| **Customization** | Primary color, page title, presentation title/subtitle, logo, suggestion buttons, and input placeholder. |
| **Parameters** | Maximum messages per hour, maximum retained messages, and allowed input modes such as image, document, and audio. |
| **Text-to-speech** | Voice synthesis provider, voice name, speech instructions, and optional summarization before synthesis. |
| **Integrations** | Telegram, Evolution API, Kapso, legacy Z-Api, messaging behavior, scheduled continuations, and shared integration settings. |
| **Advanced** | Custom CSS, custom JavaScript, debug mode, and tool-call visibility. |

Review the associated gateway first. If the gateway does not support the input modes or tools enabled in the client, users may be able to submit content the assistant cannot handle well.

## Customize the web chat

Use **Customization** to make the chat client understandable to users before the first message is sent.

| Setting | Use it for |
| --- | --- |
| **Primary color** | Highlight color for links, buttons, and client UI elements. |
| **Page title** | Browser page title. |
| **Presentation title** | Empty-state headline shown before a conversation starts. |
| **Presentation subtitle** | Empty-state supporting text. |
| **Logo image** | Logo shown at the opening of the chat. |
| **Suggestion buttons** | Conversation starters displayed near the input. |
| **Input area placeholder** | Placeholder text in the message field. |

Write suggestion buttons as safe, high-value starting prompts. Avoid putting private customer data, credentials, account IDs, or internal-only procedures into visible UI text.

## Set limits and input modes

Use **Parameters** to protect user experience, cost, and account resources.

| Setting | Meaning |
| --- | --- |
| **Maximum messages per hour** | Per-session hourly message limit. |
| **Maximum messages** | Maximum messages allowed in a session, counting both user and assistant messages. When a session exceeds this cap, the chat is blocked instead of silently trimming old messages. |
| **Input modes** | Which input types the client allows, such as image, document, and audio. |

Set limits before exposing a chat client publicly. If you allow files or audio, verify that the associated gateway and selected model can process those inputs, and explain expected attachment behavior to users where appropriate.

## Configure text-to-speech

Use **Text-to-speech** when the chat experience should produce audio responses.

| Setting | Meaning |
| --- | --- |
| **Voice Synthesis Origin** | Provider used for text-to-speech, or none. |
| **Synthesis Voice** | Voice identifier used by the selected provider. |
| **Special Instructions** | Tone, speaking style, or pronunciation guidance. |
| **Summarize before synthesis** | Shortens text before synthesis to improve audio quality and control cost. |

Text-to-speech can add cost and can change how responses are perceived. Test with realistic answers, long answers, and error messages before enabling it for users.

## Configure messaging integrations

Open **Integrations** to connect the chat client to messaging channels.

| Integration | Use it for | Main setup fields |
| --- | --- | --- |
| **Telegram** | Telegram bot conversations. | Bot token and session duration. Use **Update hooks** after saving token changes. |
| **Evolution API** | WhatsApp through a self-hosted Evolution API instance. | Instance endpoint, instance name, instance token, session duration, and the generated webhook URL. |
| **Kapso** | WhatsApp through Kapso. | API key, phone number ID, optional webhook secret key, session duration, and optional continued-message template ID. |
| **Z-Api** | Legacy WhatsApp integration. | Instance ID, instance token, optional client token, session duration, and the generated webhook URL. |

Provider tokens and webhook secrets are credentials. Store them only in the integration settings, do not paste them into documentation, screenshots, browser recordings, or support messages, and rotate them if exposed.

For WhatsApp integrations, configure the provider webhook exactly as the integration page instructs. For Z-Api, do not enable provider options that notify messages sent by the bot itself; that can create an infinite response loop. For Evolution API, the console specifies the message-upsert event and webhook settings required for normal operation.

Removing an integration disconnects that provider configuration from the chat client. It does not replace the underlying provider account setup, and it can immediately stop users on that channel from reaching the assistant until the integration is configured again.

## Rotate or change provider credentials

Treat provider credentials as production infrastructure. For live Telegram or WhatsApp channels:

1. Create or use a staging chat client when possible.
2. Save the new token, API key, or webhook secret in the staging client first.
3. Configure the provider webhook with the staging webhook URL.
4. Send a simple test message and confirm the reply plus conversation logs.
5. Apply the new credential to the production client.
6. Update hooks or provider webhook settings as required by the integration page.
7. Confirm production logs and then revoke the old credential or webhook.

Avoid deleting the old integration until the replacement path is tested. If delivery stops after rotation, restore the previous provider configuration or disable the provider webhook while you investigate.

## Configure shared messaging behavior

The **Integrations** tab also includes shared messaging settings:

| Setting | Meaning |
| --- | --- |
| **Split answer into message chunks** | Sends long answers as multiple channel messages. |
| **Message debounce interval** | Wait time after user input stops before processing. |
| **Upload unsupported files** | Allows files that are not natively supported by the model to be uploaded and represented for the assistant. |
| **Allow continued conversations** | Allows the assistant to schedule continued messages and actions. |
| **Maximum ignored time for continued messages** | How long a scheduled continuation can be ignored before being discarded. |

Use scheduled continuations only when users have agreed to later follow-ups. Verify the target identifier before relying on it, provide an opt-out path in the channel, and review stale recurring tasks before changing integrations, deleting clients, or reassigning a phone number or bot.

## Use Advanced settings safely

Use **Advanced** only when you need controlled client-level customization or debugging.

Custom CSS and JavaScript run in the chat client experience. Use code only from trusted sources, and do not load third-party scripts that can read session URLs, message content, user input, or provider context.

Keep **Debug** and **Tool call visibility** disabled for production clients unless you are reproducing an issue in a private test session. These settings can expose tool parameters, internal errors, request details, or session data to browser users or logs. Disable them immediately after testing.

## Use sessions safely

Open **Sessions** from the chat-client list or Manage menu to inspect conversations created for that client.

The session list shows:

| Column or action | Meaning |
| --- | --- |
| **Session key** | Access key for the session. Treat it as sensitive. |
| **Tag/User** | External user ID or tag associated with the session. |
| **Usage** | Token count and message count. |
| **Created at** | Session creation time. |
| **Last activity** | Last user or assistant activity. |
| **Context** | Preview of extra context attached to the session. |
| **Open chat** | Opens the web chat for that session. |
| **Copy link** | Copies a session URL. Anyone with the link can access that session while it is valid. |
| **Export conversation** | Downloads that session transcript. |
| **View conversation logs** | Opens Conversations filtered to the session. |
| **Clear conversation** | Clears conversation messages while keeping the session. This does not revoke the session key or invalidate copied links. |
| **Delete** | Deletes the session and ends access through its key. |

Do not share session keys or chat links publicly. A session link is an access token for that conversation. If a link is exposed, delete the session or create a new session and share the replacement only with the intended user. Clear conversation is useful for resetting content, but use **Delete** when a session link or key may have been exposed.

Treat exported conversations and logs as sensitive data. Store them only in approved locations, avoid sending raw exports to support, and redact credentials, session keys, phone numbers, personal data, and internal context when sharing examples.

## Create a session

Use **New session** when you need a controlled web-chat link or a test conversation.

| Field | Use it for |
| --- | --- |
| **Tag** | Stable external ID for the user, account, or application conversation. Use one unique tag per real user or conversation. If an active session already exists with the same tag, creating a session refreshes and returns that session, which can expose prior context if two users share a tag by accident. |
| **Expiration** | How long the session remains valid. The console enforces the supported 10-minute to 90-day range. |
| **Context** | Additional model-visible context for this session. |

Keep tags stable but non-sensitive. The tag is searchable identity for restoring sessions, not a place for private metadata. Do not use raw personal identifiers, credentials, or secrets as tags. Put only information in **Context** that the assistant is allowed to see. Session metadata is forwarded through inference context; do not store secrets or credentials.

## Review scheduled tasks

Open **Scheduled messages** to monitor follow-ups created for a chat client.

The page includes:

| Section | Use it for |
| --- | --- |
| **Filter by user** | Filter schedules and recurring tasks by external user ID. |
| **Scheduled messages** | One-time messages scheduled for future delivery. |
| **Recurring tasks** | Cron-based tasks that activate repeatedly. |
| **Details** | Inspect target, target identifier, timing, reason, context, execution result, cron expression, and activation history. |
| **Cancel** | Cancel a one-time schedule or recurring task. This cannot be undone from the console. |

Use this page when users report unexpected follow-ups, missing reminders, or repeated messages. Check the external user ID, target, scheduled time, status, next activation, execution count, and related conversation logs.

Before deleting or recreating a session, check whether scheduled messages or recurring tasks use the same external user ID. Deleting the session does not automatically prove that a future provider-side or schedule-side follow-up is no longer relevant.

## Delete or disconnect safely

Before deleting a chat client or integration:

1. Review active sessions.
2. Check scheduled messages and recurring tasks.
3. Open conversation logs for recent activity.
4. Identify websites, bots, provider webhooks, or applications that use the client ID or session URLs.
5. Export conversations if retention or audit requirements require it.
6. Disable external provider webhooks if the provider should stop sending messages to AIVAX.

Deleting a chat client also deletes its sessions. Removing an integration only removes that provider configuration from the client.

## Troubleshooting

When escalating an issue, share the chat client ID, provider name, timestamp, masked user or tag, and relevant error text. Do not share bot tokens, API keys, webhook secrets, full session URLs, session keys, or unredacted transcripts.

| Symptom | Check | Fix |
| --- | --- | --- |
| User cannot open a web chat link | Session key, expiration time, deleted session, copied URL, and active account/client. | Create a new session and share the new link only with the intended user. |
| Bot receives messages but does not answer | Associated gateway, account balance, message limits, integration credentials, provider webhook URL, and conversation logs. | Test the gateway directly, verify provider settings, then send a simple text-only message. |
| WhatsApp bot loops or replies to itself | Provider webhook options and whether sent-by-bot messages are forwarded back to AIVAX. | Disable provider options that notify messages sent by the bot and retest with one message. |
| Attachments fail or produce poor answers | Input modes, model modality support, gateway multimodal settings, unsupported-file setting, and provider media support. | Enable only supported input modes or switch to a gateway/model that supports the channel content. |
| Users hit limits too quickly | Maximum messages per hour, maximum messages, integration session duration, and repeated retry behavior. | Increase limits deliberately, split users across sessions where appropriate, or reduce automated retries. |
| Scheduled follow-up did not send | Allow continued conversations, scheduled task status, target identifier, external user ID, next activation, provider credentials, and account balance. | Inspect scheduled task details, fix provider/gateway issues, and recreate the schedule if needed. |
| Tool errors are hidden | Debug and tool-call visibility settings. | Enable debug temporarily in a controlled test client, reproduce, inspect logs, then disable debug for production users. |
| Conversation quality differs by channel | Gateway instructions, channel formatting, message chunking, attachments, and session context. | Test the same user task in the web chat and the messaging integration, then adjust channel-specific settings. |

## API reference

Manage chat clients through the Web Chat API:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Web%20Chat%20Clients&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Web%20Chat%20Client%20Integrations&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Client%20Integration&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Create and manage sessions through the Web Chat Sessions API:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Web%20Chat%20Sessions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use these public session actions from a valid chat session:

**Clear conversation** is available from the console session menu. Its backing reset action is not currently exposed as an embedded public API reference, so use the console when you need to clear a session without deleting it.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Session%20Info&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Send%20Prompt&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Last%20Message&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Download%20Session%20Transcript&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Monitor scheduled and recurring follow-ups through Hook Schedules:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Hook%20Schedules&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Schedule&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Recurring%20Task&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Cancel%20Schedule&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Cancel%20Recurring%20Task&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Related documentation:

- [Developer Chat Clients guide](/docs/features/chat-clients): technical session and integration behavior.
- [AI Gateways](ai-gateways.md): configure the assistant behind the client.
- Conversations: inspect conversation logs and exports from the console.
- [Account, balance, and multiple accounts](account-balance.md): manage balance, limits, and API keys.
