# Account, balance, and multiple accounts

Use **My account** and **Usage** to manage the account-level settings that affect every AIVAX resource: plan, balance, notifications, API keys, hook authentication, storage usage, model reserve usage, and saved browser accounts.

This page is for account owners, operators, and developers who need to keep an AIVAX account usable and safe. If you only need to make your first API call, start with [Getting Started](/docs/getting-started). If you need the API authentication rules, see [Authentication](/docs/authentication).

## Before you begin

You need to be signed in to the [AIVAX console](https://console.aivax.net/). Some actions can affect production systems, billing, or integrations, so confirm the account name and plan badge in the lower-left account menu before changing anything.

Do not perform account, key, hook-key, or billing actions from a shared or untrusted browser. Saved accounts and login sessions are stored locally by the browser.

## Choose the right account page

AIVAX separates account administration into a few related surfaces:

| Surface | Use it when you need to |
| --- | --- |
| **My account** | Update account profile settings, notification preferences, API keys, hook key, conversation logging, automatic JSON healing, and logout behavior. |
| **Usage** | Check current plan, balance, storage usage, subscription-model reserve usage, and reserve breakdowns when available. |
| **Account level** | Compare Free, Pro, and Max plan capabilities and production limits. |
| **Account menu** | Switch or add saved accounts, open usage, top up balance, manage account settings, or log out. |

Use **My account** for configuration. Use **Usage** for operational state. Use **Account level** when deciding whether a plan supports the workflow you want to run.

## Manage account information

Open **My account > Account information** to review and update account-wide settings.

You can:

- Open the plan comparison from **Account plan**.
- Edit the account name shown in the console.
- Review the account email address.
- Enable or disable conversation-content logging.
- Enable or disable automatic JSON healing.
- Open Gravatar to change the account profile picture.
- Log out of the current account.

The account name is visible in the platform, so choose a name that lets operators distinguish production, staging, customer, and personal accounts. The account email address is currently read-only in the console. If it needs to change, use the supported account recovery or support path.

Turn **Conversations logging** on when your team needs stored conversation content for debugging, analytics, review, or audit workflows. Turn it off when your account should avoid retaining conversation content beyond what is necessary for the active workflow. Before changing this setting, coordinate with anyone who relies on Conversations, Analytics, or troubleshooting workflows.

Turn **Automatic JSON healing** on when applications expect structured JSON and you want AIVAX to attempt repair of malformed model output. For implementation details and schema behavior, see [Structured Responses](/docs/inference/structured-responses).

## Configure notifications

Open **My account > Notifications** to control account emails.

Notifications are currently sent to the account email address. The notification settings include:

| Notification | What it does | Timing guard |
| --- | --- | --- |
| **Low balance** | Sends an email when account balance falls below the configured threshold. | At most once every 3 days. |
| **Deprecated models** | Sends an email when a model used recently becomes deprecated. | Only models used in the last 30 days are considered; emails are sent at most once every 7 days. |

Use low-balance notifications for production accounts and batch-heavy workflows. Set the threshold high enough that the team can top up before chat clients, integrations, multimodal calls, or batch jobs stop for insufficient balance.

Use deprecated-model notifications when gateways or direct integrations depend on specific model names. After receiving a notification, review the affected gateway or application before the model is removed or becomes unsuitable for production.

## Check balance and usage

Open **Usage** from the account menu.

Usage shows:

- Current plan.
- Account balance.
- A **Top up account** action.
- Storage usage against the included storage quota.
- Subscription-model usage windows, when the plan includes subscription-model reserves.
- Weekly subscription-model reserve breakdown, when the plan includes reserves and usage exists for the current period.

Balance is consumed by inference, RAG, subscriptions, and other AIVAX services. Some workflows require a positive balance or a route-specific minimum before they start, and billable routes can return `402 Payment Required` when balance or storage quota is insufficient. See [Pricing](/docs/pricing#balance-requirements), [Credits and invoices](/docs/pricing#credits-and-invoices), and [Plans and limits](/docs/limits#how-limits-are-enforced) for the technical rules.

If a workflow fails unexpectedly, check Usage before debugging the model or resource configuration. Low balance, exhausted reserve windows, or storage over quota can make healthy gateways, collections, chat clients, and batch jobs appear broken.

## Top up account balance

Use **Top up account** from the account menu or the Usage page when the prepaid balance is too low.

The credit dialog asks for the credit amount and shows the payment method, processor fee, service fee, and total before creating the payment link. Confirm only after the total matches what you intend to add. AIVAX then opens the payment provider link in a new browser tab. For how credits and invoices affect balance, see [Credits and invoices](/docs/pricing#credits-and-invoices).

Do not use the browser back button or duplicate tabs to create multiple payment links unless you intentionally want multiple payments. After payment, return to Usage or the dashboard to confirm the balance changed.

## Manage API keys

Open **My account > API Keys** to create, inspect, and revoke API keys.

API keys authenticate applications, SDKs, MCP clients, and backend services. They are different from login keys. Create separate API keys for separate applications so you can revoke one integration without breaking every system in the account.

When creating a key, choose:

| Field | Guidance |
| --- | --- |
| **Key name** | Use an owner and purpose, such as `production support bot` or `staging batch importer`. |
| **Key type** | Use **Private** for server-side integrations and account-management APIs. Use **Public (beta)** only for restricted browser/client-side routes designed for public keys. |
| **Key expiration** | Choose 7, 30, or 90 days for temporary work; choose **Never** only when you have an external rotation process. |

AIVAX shows a newly generated API key only once. Copy it directly into the destination secret manager or deployment environment. Do not store it in source code, issue trackers, screenshots, shared notes, or chat transcripts.

The API key table shows the masked key, type, label, expiration, last-used time, and actions. Use **View conversation logs** to open conversations filtered to that key when investigating a specific integration. Use **Delete** to revoke a key. Deleting a key can immediately break every service that uses it, so rotate callers to a replacement key before deletion when uptime matters.

For key types and accepted API authentication schemes, see [Authentication](/docs/authentication#api-key-types) and [Create and list keys](/docs/authentication#create-and-list-keys).

## Manage the hook key

Open **My account > Hook key** to manage the secret used for AIVAX reverse calls to your services, such as workers and server-side protocol-function callbacks.

Use **Reset hook key** when the hook key may have been exposed or when you intentionally rotate webhook verification material. Resetting it means every service that validates AIVAX reverse calls must be updated with the new secret. Plan this like a credential rotation, especially for production workers or integrations.

Use **Copy** only when you are ready to paste the hook key into a trusted secret store. Do not paste it into logs or client-side code.

For validation details, see [Hook authentication](/docs/authentication#hook-authentication).

## Use multiple saved accounts

The account menu lets you add another account by entering that account's 14-character login key. After an account is saved, it appears in the account menu and can be selected without returning to the Login page.

To add and switch accounts:

1. Open the lower-left account menu.
2. Select **Add account**.
3. Enter the other account's 14-character login key.
4. Confirm the form. AIVAX authenticates with that key and switches the console to that account.
5. Confirm the account name and plan badge before making changes.

To switch back later, open the account menu and select the saved account. To remove temporary local access, log out of that account. If another saved account exists, AIVAX may switch to it automatically.

Multiple saved accounts are useful when you operate separate production, staging, customer, or personal accounts from the same browser. They are also a common source of mistakes. Before editing a key, gateway, collection, notification, or balance setting, check the active account name and plan badge.

Saved account login keys and session data are stored in the browser's local storage. Use this feature only on a trusted private device and browser profile. Do not add accounts while screen sharing, because the login-key field is visible while you type or paste. Logging out removes the current saved account locally and may switch to another saved account, but it does not rotate exposed login keys, revoke API keys, or invalidate credentials stored elsewhere.

## Troubleshooting

### A request fails with `402 Payment Required`

Open Usage and check balance and storage usage. The account may have insufficient balance, a minimum-balance requirement for the input type, or storage usage above the plan quota. See [Pricing](/docs/pricing#balance-requirements).

### Balance did not update after topping up

Confirm that the payment link opened in a new tab and that the payment was completed. If the browser blocked the new tab, create a new payment link from the credit dialog. Avoid creating duplicate links unless you intend to make multiple payments. Payment confirmation may not be instant; check the dashboard or Usage again after the provider confirms payment. If you need invoice-level confirmation, open Analytics and review invoices or billing activity when available.

### A service stopped after an API key change

Check whether the key was deleted, expired, or replaced without updating the service. Create a replacement private key, update the service secret, test it, and then delete the old key.

### A worker or server-side function callback is rejected

Check whether the hook key was reset. Update the receiving service to validate against the current hook key and the current `X-Request-Nonce` validation scheme, then retry a controlled request. If the receiver or worker was provisioned with older callback settings, redeploy or reprovision the affected service before testing again. See [Hook authentication](/docs/authentication#hook-authentication).

### I changed accounts and cannot find a resource

Confirm the account name in the lower-left account menu. Resources such as gateways, collections, keys, logs, conversations, and memories belong to the active account.

### Notification emails are missing or delayed

Check that the notification is enabled and that the threshold or event condition has actually been met. Notifications are sent to the account email address, so check that inbox and spam folder. Low-balance notifications are sent at most once every 3 days. Deprecated-model notifications are sent at most once every 7 days and only consider models used in the last 30 days.

## Related documentation

- [Platform basics](basics.md): sign in and navigate the console.
- [Authentication](/docs/authentication): API key families, accepted auth schemes, and hook validation.
- [Pricing](/docs/pricing): prepaid balance, usage charges, storage billing, and balance requirements.
- [Plans and limits](/docs/limits): plan quotas, rate limits, storage limits, and feature availability.
- [Structured Responses](/docs/inference/structured-responses): JSON schema output and JSON healing behavior.
