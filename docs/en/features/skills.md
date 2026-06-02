# Skills

Skills (also known as abilities) can be used to improve how your agent performs on specific tasks. Skills are special instructions that are retrieved on demand, and your agent loads these skills as needed.

Ideally, your agent should only use a skill when it is relevant to the task it is performing. It is embedded in the conversation through a special tool, and skill instructions are added to the context, indicating that the agent has context provided in the context that can be used in the conversation.

## How do skills work?

Skills are primarily provided through a name and a brief description of what that skill is and when it should be used. You can have multiple skills in your account, but only use a subset of them in your [AI Gateway](/docs/en/inference/ai-gateway). The skills activated in the AI Gateway are injected into your model’s system instructions and an additional function is added to the context.

When the model calls the skill‑reading tool, the instructions for that skill are inserted into the system instructions of the context dynamically. Only one skill can be activated per context, and the LLM can change the active skill as needed.

For this to work, the chosen base model must support **function calls** and **system instructions**.

- If your model does not support function calls, consider using a [tool handler](/docs/en/inference/pipelines) to handle function calls.
- If your model does not support system instructions, consider using the `No system instructions` flag, which provides system instructions as a user message.

Larger models tend to follow instructions and function calls very strictly. Run tests to see if your model is changing its skills as required.

## Structure and operation

A skill has `slug`, `description`, `instructions`, and `options`. The `slug` is the technical identifier used by the account and should be short, stable, and readable. The `description` is the text that helps the model decide when that skill should be loaded; it needs to explain the usage scenario, not just repeat the name. The `instructions` are the full content that will be inserted when the skill is activated. In `options`, you can define `instructionSources` to load additional instructions from remote sources, and `allowedToolsNames` to control which tools are associated with that skill.

Write the description as a routing rule. A description like “legal skill” is weak because it doesn’t say when to use it. A better description would be “use when the user asks for analysis, review, or explanation of contractual clauses in simple language.” The instructions, on the other hand, should be operational: explain how to respond, what questions to ask when data is missing, which tools may be useful, what limits must be respected, and the expected final format. The model reads the description to choose the skill and reads the instructions to perform the task.

`allowedToolsNames` is useful when a skill should only expose a subset of the gateway’s tools. For example, a research skill may allow `web_search` and `open_url`, while a visual generation skill may allow image generation and web page creation. If the gateway is configured to hide tools without a skill, the tools are only visible when the relevant skill is active, reducing noise in the context and helping the model choose actions more precisely.

Skills can also be imported and exported in JSONL. This format is useful for versioning skills, migrating settings between accounts, keeping a set of skills in a repository, or reviewing changes before publishing. Each line must represent a skill with at least `slug` and `instructions`; `description` and `options` can complement the configuration. When importing a skill with an existing `slug`, AIVAX updates the corresponding skill instead of creating a duplicate.

## How to write skills?

Writing effective skills requires clarity and specificity in the instructions. Here are the main guidelines:

### Skill structure

A well‑written skill should contain:

1. **Clear, descriptive name**: Use names that immediately identify the purpose of the skill (e.g., “Python Code Analysis”, “Customer Support”, “Technical Translation”).

2. **Concise description**: Provide a brief description (1–2 sentences) that explains when the skill should be activated. This description is crucial because the model uses it to decide whether to load the skill.

3. **Detailed instructions**: The actual instructions should include:
   - Clear objectives of the task
   - Expected response format
   - Specific rules to follow
   - Examples where appropriate
   - Important constraints or limitations

### Best practices

- **Be specific**: Avoid vague instructions. Instead of “be helpful,” say “provide step‑by‑step explanations with code examples.”
- **Use imperative language**: Start sentences with action verbs (analyze, explain, compare, list).
- **Keep the scope limited**: Each skill should focus on a specific knowledge area or type of task.
- **Iteratively test**: Refine your skills based on how the model responds in practice.
- **Avoid redundancy**: Do not repeat information already present in the base system instructions.

### Skill example
- Name: Code Performance Analysis
- Description: Use when the user asks for performance analysis, optimization, or bottleneck identification in code.

```markdown
- Analyze the provided code identifying possible performance bottlenecks
- Consider temporal complexity (Big O) and memory usage
- Suggest specific optimizations with code examples
- Explain the impact of each proposed optimization
- Prioritize readability and maintainability alongside performance
```

## When to use skills?

Skills are most useful in specific scenarios where you need specialized behavior:

### Ideal scenarios

**1. Domain‑specific expertise**
- Technical terminology specific to an industry
- Compliance with regulations or standards
- Specific methodologies (Scrum, ITIL, SOC 2, etc.)

**2. Tone or style shift**
- Formal vs. casual service
- Technical vs. simplified communication
- Different personas or roles

**3. Complex, structured processes**
- Multi‑step workflows
- Analyses that follow specific frameworks
- Document generation with strict formats

**4. Tasks that require extensive context**
- When instructions are too long to include every time
- Knowledge that is only occasionally relevant
- Multiple mutually exclusive rule sets

### When NOT to use skills

- **Permanent instructions**: If instructions should always be active, put them in the base system instructions.
- **Simple tasks**: For direct answers that don’t require special context.
- **General knowledge**: Information the model already knows well does not need to be reinforced via skills.
- **Too few or too many skills**: Aim for 3–10 skills. Less than that, consider using base instructions. More than that can confuse the model.

### Comparison: Skills vs. System Instructions

| Aspect | Skills | System Instructions |
|--------|--------|----------------------|
| When to apply | On demand, when relevant | Always active |
| Ideal size | Can be extensive | Should be concise |
| Context switching | Yes, can alternate | No, fixed |
| Token usage | Economical (only when needed) | Constant |
| Best for | Specialized knowledge | Base agent behavior |

### Implementation tips

- **Start small**: Implement 2–3 skills initially and expand as needed.
- **Monitor usage**: Check that the model is activating skills correctly.
- **Avoid overlap**: Skills with similar descriptions can confuse the model.
- **Test transitions**: Ensure the model switches skills when appropriate.

## Comparing Skills, RAG, and System Prompt

To better understand when and how to use skills compared to other techniques such as **RAG (Retrieval‑Augmented Generation)** and **System Prompt (System Instructions)**, use the guidance on this page together with the documentation for [collections](/docs/en/rag/collections) and [pipelines](/docs/en/inference/pipelines).

See also:
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Building Production‑Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents)
- [AI Gateway Documentation](/docs/en/inference/ai-gateway)