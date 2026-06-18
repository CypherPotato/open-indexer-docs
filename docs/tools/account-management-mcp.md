# Account management MCP

The account management MCP exposes selected AIVAX account operations to an MCP-compatible client, such as an IDE, desktop assistant, internal agent, or automation environment. It is designed for trusted operators and backend workflows that need to inspect account capabilities, discover documentation, or call authenticated AIVAX API routes without leaving the MCP client.

This endpoint is different from configuring an external MCP source inside an [AI Gateway](/docs/tools/mcp). In that flow, AIVAX is the MCP client and your gateway calls another server during inference. With the account management MCP, AIVAX is the MCP server. Your MCP client connects to AIVAX and receives tools for operating the authenticated account.

Use this MCP when an agent needs account-aware context before it acts: which models are available to the current plan, how a feature is documented, what an API route returns, or whether an account resource can be created, updated, or inspected through the existing AIVAX API. It is especially useful for internal support assistants, development environments, account administration copilots, and implementation agents that need to combine documentation lookup with real API calls.

Because the MCP can invoke authenticated AIVAX functions, connect it only from trusted clients and use a private API key. Do not expose this server to end users or browser-side applications.

> [!NOTE]
> Do not configure the account management MCP together with the [documentation MCP](/docs/tools/documentation-mcp) in the same client unless you have a specific reason to duplicate tools. The account management MCP already includes documentation search functions, so adding both servers usually creates redundant documentation tools and can make tool selection less predictable.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

The request must authenticate with an account API key. Use a private key with the `Authorization` header:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

For key types and authentication options, see [Authentication](/docs/authentication).

## Configuration example

The exact MCP configuration shape depends on the client. For clients that accept a Streamable HTTP server entry, configure the AIVAX endpoint and send the private key as a header.

```json
{
  "servers": {
    "aivax-account": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/account-management",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

After the client connects, it can list the tools exposed by the account management server. The tool names are stable and intentionally prefixed with `aivax_` so they remain clear when mixed with tools from other MCP servers.

## What you can use it for

The account management MCP is useful when the assistant needs to reason about the account itself, not only answer an end-user prompt. It gives an MCP client a controlled way to combine AIVAX documentation, model metadata, and authenticated account API calls. This makes it a good fit for operational agents, implementation copilots, and internal assistants that need to inspect how an AIVAX workspace is configured before recommending or changing something.

### Create and maintain agents

An internal development agent can use the MCP to help create, review, and adjust [AI Gateways](/docs/inference/ai-gateway). Before changing a gateway, the agent can search the AIVAX manual for the relevant feature, list available models for the current account, compare model capabilities and plan availability, then invoke the appropriate account API route.

This is useful when teams frequently create assistants for different departments, tenants, or products. The MCP lets the operator ask for an agent in product terms, such as "create a support assistant for refund policies with the CRM MCP enabled", while the implementation assistant checks which models, tools, RAG collections, and gateway options are available in the account.

For production workflows, keep a human approval step before writes. The MCP can help prepare the configuration, explain the tradeoffs, and show the API action it intends to perform before it modifies account state.

### Monitor costs and model choices

The MCP can help an operations assistant investigate cost patterns and model selection. By listing models and invoking account API routes for usage, billing, gateway, or key information, the assistant can explain which models are expensive, which routes are using a subscription multiplier, and whether a cheaper model could handle part of the workload.

This is especially useful when a team has many gateways or batch jobs and wants to understand why spend changed. Instead of looking only at totals, an assistant can connect usage to model metadata, plan availability, gateway configuration, and feature choices such as RAG, tools, batch, or multimodal input.

Use this for recurring checks such as "which gateways are likely to drive cost this week?", "which model families are being used most?", or "can we move this low-risk workflow to a smaller model without losing required capabilities?"

### Understand errors and improve observability

When an integration fails, the account management MCP can help an assistant move from a generic error to a useful diagnosis. The assistant can search documentation for the failing route or feature, inspect account resources through API calls, and compare the observed response with the expected behavior.

For example, a support assistant can investigate whether a failure is caused by an expired API key, insufficient balance, plan restrictions, a missing collection, a disabled provider route, an invalid gateway configuration, or a tool schema problem. The result is a clearer explanation: what failed, where it likely failed, what evidence supports that conclusion, and what the operator should check next.

This kind of observability is most valuable when the assistant is allowed to read relevant account state but not automatically change it. Give write access only to trusted maintenance workflows.

### Meta-prompting and conversation review

The MCP can support meta-prompting workflows where an assistant reviews prior conversations, gateway behavior, and documentation to suggest improvements. The goal is not to answer the original user again; it is to inspect how the agent behaved and identify what could be improved in prompts, instructions, tools, model choice, or RAG setup.

A review agent can look for patterns such as overlong answers, missing questions, wrong tool selection, repeated clarification loops, unsafe assumptions, or responses that ignore retrieved context. It can then propose concrete changes: a better system instruction, a narrower tool description, a stronger structured-output schema, a different model, or an added retrieval source.

This is useful for teams that treat assistants as products. Instead of tuning prompts only by intuition, they can review real interactions and turn the findings into smaller gateway or knowledge-base changes.

### Identify why models fail in specific situations

Some model failures are not caused by the model alone. A wrong answer can come from missing context, a weak prompt, a bad retrieval result, an unavailable tool, a mismatched model capability, or a schema that lets the model produce ambiguous output.

With account context available through MCP, an assistant can investigate these layers together. It can check which model was selected, whether that model supports the needed capability, what gateway configuration was active, whether the relevant RAG collection exists, and which documentation explains the expected behavior.

This helps answer questions like "why does the assistant fail when users ask about refunds?", "why does this model ignore a tool?", or "why do answers degrade when the request includes a file?" The result should be an evidence-based explanation and a focused fix, such as changing the model, improving the tool description, adding retrieval material, or rewriting the gateway instruction.

### Improve RAG quality

The account management MCP is also useful for maintaining RAG systems. An assistant can inspect collection-related API behavior, search the AIVAX documentation for retrieval guidance, and help compare gateway configuration with the intended retrieval flow.

Use it to investigate weak retrieval, missing citations, irrelevant chunks, overly broad searches, low-quality documents, or cases where a gateway should use a collection but does not. A RAG maintenance assistant can suggest better query phrasing, chunking changes, collection organization, reranker settings, `top` and `minScore` adjustments, or when to expose a collection through [collection MCP](/docs/rag/semantic-search#mcp).

The best workflow is iterative: inspect a failing answer, identify which context should have been retrieved, test or review the retrieval path, update documents or gateway settings, then re-check the same conversation pattern.

## Security guidance

Treat this MCP server as an administrative integration. A private key connected to it may be able to read or mutate account resources depending on the routes the agent invokes.

Use a dedicated API key for each MCP client or automation. Label it clearly, set an expiration when possible, and rotate it if the client is shared, compromised, or no longer needed. Store the key in the MCP client's secret mechanism or local configuration store, not in source control.

Do not connect the account management MCP to untrusted agents, public chat clients, or user-controlled browser sessions. If a workflow only needs retrieval from a RAG collection, use the [collection MCP](/docs/rag/semantic-search#mcp) with read-only configuration. If a gateway needs to call your external tools during inference, configure [MCP functions](/docs/tools/mcp) or [server-side functions](/docs/tools/protocol-functions) instead.
