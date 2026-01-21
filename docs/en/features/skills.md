# Skills

Skills (also known as skills) can be used to improve how your agent performs on specific tasks. Skills are special instructions that are retrieved on demand, and your agent loads these skills as needed.

Ideally, your agent should use a skill only when it is relevant to the task it is performing. It is embedded in the conversation through a special tool and skill instructions are added to the context, indicating that the agent has skills provided in the context that can be used in the conversation.

## How do skills work?

Skills are primarily provided through a name and a brief description of what that skill is and when it should be used. You can have multiple skills in your account, but use only some of them in your [AI gateway](/docs/en/entities/ai-gateways/ai-gateway). The skills activated in the AI gateway are injected into the system instructions of your model and an additional function is added to the context.

When the model calls the skill‑reading tool, the instructions of that skill are inserted into the system instructions of the context dynamically. Only one skill can be active per context, and the LLM can change the active skill as needed.

For this to work, the chosen base model must support **function calls** and **system instructions**.

- If your model does not support function calls, consider using a [tool handler](/docs/en/entities/ai-gateways/pipelines) to handle function calls.
- If your model does not support system instructions, consider using the `No system instructions` flag, which provides system instructions as a user message.

Larger models tend to follow instructions and function calls strictly. Run tests to see if your model is changing its skills as required.

## How to write skills?

Writing effective skills requires clarity and specificity in the instructions. Here are the main guidelines:

### Skill structure

A well‑written skill should contain:

1. **Clear, descriptive name**: Use names that immediately identify the purpose of the skill (e.g., "Python Code Analysis", "Customer Support", "Technical Translation").
2. **Concise description**: Provide a brief description (1–2 sentences) that explains when the skill should be activated. This description is crucial, as the model uses it to decide whether to load the skill.
3. **Detailed instructions**: The instructions themselves should include:
   - Clear task objectives
   - Expected response format
   - Specific rules to follow
   - Examples where appropriate
   - Important constraints or limitations

### Best practices

- **Be specific**: Avoid vague instructions. Instead of “be helpful,” say “provide step‑by‑step explanations with code examples.”
- **Use imperative language**: Start sentences with action verbs (analyze, explain, compare, list).
- **Keep scope limited**: Each skill should focus on a specific knowledge area or task type.
- **Test iteratively**: Refine your skills based on how the model responds in practice.
- **Avoid redundancy**: Do not repeat information already present in the base system instructions.

### Skill example
- Name: Code Performance Analysis
- Description: Use when the user requests performance analysis, optimization, or bottleneck identification in code.

```markdown
- Analyze the provided code, identifying possible performance bottlenecks
- Consider time complexity (Big O) and memory usage
- Suggest specific optimizations with code examples
- Explain the impact of each proposed optimization
- Prioritize readability and maintainability together with performance
```

## When to use skills?

Skills are most useful in specific scenarios where you need specialized behavior:

### Ideal scenarios

**1. Domain‑specific expertise**
- Industry‑specific technical terminology
- Compliance with regulations or standards
- Specific methodologies (Scrum, ITIL, SOC 2, etc.)

**2. Tone or style shift**
- Formal vs. casual service
- Technical vs. simplified communication
- Different personas or roles

**3. Complex, structured processes**
- Multi‑step workflows
- Analyses that follow specific frameworks
- Document generation with rigorous formats

**4. Tasks that require extensive context**
- When instructions are too long to include every time
- Knowledge that is only occasionally relevant
- Multiple mutually exclusive rule sets

### When NOT to use skills

- **Permanent instructions**: If instructions should always be active, place them in the base system instructions.
- **Simple tasks**: For direct answers that do not require special context.
- **General knowledge**: Information the model already knows well does not need reinforcement via skills.
- **Too few or too many skills**: Aim for 3–10 skills. Fewer than that, consider using base instructions. More than that can confuse the model.

### Comparison: Skills vs. System Instructions

| Aspect                | Skills                                 | System Instructions                |
|-----------------------|----------------------------------------|------------------------------------|
| When to apply         | On demand, when relevant               | Always active                      |
| Ideal size            | Can be extensive                       | Should be concise                  |
| Context changeability| Yes, can switch                        | No, fixed                          |
| Token usage           | Economical (only when needed)          | Constant                           |
| Best for              | Specialized knowledge                  | Base agent behavior                |

### Implementation tips

- **Start small**: Implement 2–3 skills initially and expand as needed.
- **Monitor usage**: Verify that the model is activating skills correctly.
- **Avoid overlap**: Skills with similar descriptions can confuse the model.
- **Test transitions**: Ensure the model switches skills when appropriate.

## Comparing Skills, RAG, and System Prompt

To better understand when and how to use skills compared to other techniques like **RAG (Retrieval‑Augmented Generation)** and **System Prompt (System Instructions)**, see our full guide:

**[Click to access the comparison guide.](/docs/en/concepts-comparison)**

This guide details:
- The fundamental differences between each approach
- When to use each technique
- Practical examples and use cases
- How to combine the three techniques for robust systems
- Decision tree for choosing the right approach

See also:
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Building Production‑Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents)
- [AI Gateway Documentation](/docs/en/entities/ai-gateways/ai-gateway)