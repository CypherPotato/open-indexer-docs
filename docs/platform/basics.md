# Platform basics

Use the AIVAX console when you need to configure and monitor the resources that power your AI applications: models, AI Gateways, RAG collections, chat clients, batch jobs, skills, logs, conversations, memories, account usage, and billing.

This page is for account operators and builders who are signing in to the console for the first time or need a reliable mental model for moving around the platform. If you are integrating through code instead of using the console, start with [Getting Started](/docs/getting-started) and [Authentication](/docs/authentication).

## Before you begin

You need an AIVAX account and a 14-character alphanumeric login key. A login key signs you in to the console. It is different from an API key: API keys authenticate applications and integrations, while the login key authenticates a person or operator in the browser.

Keep login keys private. Do not paste them into support tickets, public chat clients, source code, screenshots, or shared documents. If an API key may have been exposed, revoke it from account management. If a hook key may have been exposed, reset it. If a login key may have been exposed, sign out of shared browsers and use the supported account recovery or support process; signing out does not rotate the login key.

## Sign in

Open the [AIVAX console](https://console.aivax.net/) and enter your login key on the Login page. The login form accepts the key as a 14-character value and signs you in automatically when the key is complete.

If you do not have an account yet, use **Register** on the Login page. Registration asks for a full name and email address, then sends a verification email containing the login key. Use an email address that can receive operational account messages, because it may later be used for account-related notices.

After signing in, AIVAX opens the dashboard. If you were sent to the login page while trying to open a protected console URL, the console returns you to the intended page after authentication.

## Understand the dashboard

The dashboard is the console home page. It helps you answer two first questions:

- Is this the right account?
- Is the account ready to make requests?

The top area links to the getting-started guide and shows example requests for common workflows, such as RAG query, chat completions, and structured JSON output. Treat these snippets as starting points: replace generated account-specific values before sharing them, and avoid copying screenshots that reveal masked key identifiers, model or gateway names, collection IDs, or other account-specific values.

The summary cards show account-level signals such as balance, recent spend, token usage, and request volume. Use them as a quick health check before debugging a product issue. For example, if a chat client stops responding, confirm the account has usable balance before investigating the gateway, model, RAG, or integration configuration.

The usage visualization shows recent activity over time. Use it to notice unusual spikes, quiet periods, or changes after a deployment. For deeper analysis, open Analytics or account usage from the account menu.

## Navigate the console

The left navigation is divided into product areas:

| Area | Use it for |
| --- | --- |
| **Home** | Review account readiness, examples, usage summary, and quick links. |
| **Models** | Compare available hosted and routed models before choosing one directly or through a gateway. |
| **AI Gateways** | Configure reusable assistant runtimes with model settings, instructions, tools, RAG, workers, skills, and output behavior. |
| **RAG Collections** | Store and index documents that can be searched directly or attached to gateways. |
| **Chat clients** | Connect a gateway to end-user chat sessions and channel integrations. |
| **Batch** | Run an AI workflow over many independent records asynchronously. |
| **Analytics** | Inspect usage by resource, model, route, or account dimension. |
| **Conversations** | Review stored conversation history and related message activity. |
| **Skills** | Manage reusable instruction bundles that gateways can load during inference. |
| **Instruction Store** | Browse instruction assets available to the account, when enabled. |
| **Logs** | Inspect operational events and failures. |
| **Memories** | Review persistent memory records created by memory-enabled tools or sessions. |

Accounts with administrative access may also see **Admin**. If a page is not visible, your account may not have the required role, plan, or feature access.

The bottom navigation also includes **Avi Assistant**, which opens the in-console assistant, and **Documentation**, which opens the public AIVAX documentation site.

## Use the account menu

The account menu appears at the bottom of the left navigation. It shows the current account name and plan badge, then opens account actions:

| Action | When to use it |
| --- | --- |
| **Add account** | Sign in to another AIVAX account by entering that account's 14-character login key. |
| **Usage** | Open detailed account usage and billing activity. |
| **Top up account** | Add prepaid credit when the account needs more balance. |
| **Manage account** | Update account profile and settings, manage API keys, and reset hook-key configuration where available. |
| **Logout** | Sign out of the current account. If another saved account exists in the browser, AIVAX can switch to it; otherwise it returns to the public entry page. |

Use multiple saved accounts when you operate separate customer, staging, production, or personal accounts from the same browser. Before changing a gateway, collection, key, or billing setting, confirm the account name and plan badge in the menu. This is especially important when production and testing accounts have similar resource names.

Saved accounts are stored in the browser's local storage together with session data. Use this feature only on trusted private browsers. Logging out removes the current saved account locally, but it does not rotate login keys, revoke API keys, or invalidate credentials that were already exposed elsewhere.

## Open help and status pages

The lower navigation includes **Documentation**, which opens the public AIVAX documentation site. The footer also links to the landing page, documentation, privacy policy, Terms of use, and service status page.

Use documentation links when you need product guidance, API reference embeds, or implementation details. Use the status page when a feature that normally works starts failing across multiple unrelated resources.

## Keep account information safe

The console can display sensitive operational data, including account names, API keys, snippets with credentials, collection IDs, resource IDs, usage values, and conversation content. Before sharing a screenshot or copied snippet:

1. Remove API keys and login keys.
2. Redact resource IDs, customer names, conversation content, and private account values.
3. Confirm the screenshot does not show another saved account in the account menu.
4. Prefer linking to the relevant documentation page instead of sharing a console screenshot when the reader only needs instructions.

For API key management, see [Create and list keys](/docs/authentication#create-and-list-keys). For hook validation, see [Hook authentication](/docs/authentication#hook-authentication). For balance checks, plan limits, and usage constraints, see [Plans and limits](/docs/limits) and [Pricing](/docs/pricing).

## FAQ

### Is a login key the same as an API key?

No. A login key is used to sign in to the console. API keys are used by applications, SDKs, MCP clients, and backend integrations. Keep both private, but do not substitute one for the other.

### Why do I see different pages from another teammate?

Visible pages can vary by role, plan, feature availability, and account state. Confirm you are in the same account and plan before comparing screens.

### What should I check first when something fails?

Start with the account and resource basics: current account, balance, plan limits, selected model or gateway, recent logs, and whether the affected resource exists in the expected account. This usually separates account-state issues from model, tool, RAG, or integration issues.

### What should I do if login does not work?

Check that the login key has 14 alphanumeric characters and no leading or trailing spaces. If you are registering, check the email inbox and spam folder for the verification message. If repeated attempts fail, wait before retrying and ask the account owner or support team to confirm the correct recovery path.

### Can I share the example snippets from the dashboard?

Only after redacting account-specific values. Dashboard snippets may include masked key identifiers, model or gateway names, and collection identifiers from the active account.

## Related documentation

- [Getting Started](/docs/getting-started): make a first OpenAI-compatible request.
- [Authentication](/docs/authentication): understand login-independent API authentication, key types, and hook validation.
- [Pricing](/docs/pricing): understand prepaid balance and usage charges.
- [Plans and limits](/docs/limits): review plan, rate, storage, RAG, chat-client, and batch limits.
- [AI Gateways](/docs/inference/ai-gateway): configure reusable assistant behavior.
- [RAG Collections](/docs/rag/collections): store and index documents for retrieval.
