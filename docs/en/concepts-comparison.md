# Skills vs. RAG vs. System Prompt: Understanding the Differences

When building AI systems, it is essential to understand the differences between **Skills**, **RAG (Retrieval-Augmented Generation)**, and **System Prompt**. Each approach serves specific purposes and is optimized for different scenarios. This page explores in detail how each technique works, when to use them, and their main differences.

## In Simple Terms: What’s the Difference?

Think of your AI assistant as an employee in a company:

### 🎭 System Prompt = Personality and values of the person

It is like the personality, values, and basic behavior of the employee. It defines how they act, speak, and behave in **all** situations.

**Practical example**: “Always be polite”, “Speak professionally”, “Never make up information”

**Use when**: You want the behavior to be **always the same**, regardless of the situation.

---

### 🎓 Skills = Specializations the person knows how to do

They are special abilities that the employee can use **when needed**. Like having a specialist in different areas who is only called upon when required.

**Practical example**:  
- Need to talk to executives? Activate the skill “Executive Communication”  
- Need to analyze code? Activate the skill “Code Review”  
- Need to solve a technical problem? Activate the skill “Troubleshooting”

**Use when**: You need **different ways of doing things** depending on the situation. The model itself decides which skill to use based on what the user is asking.

---

### 📚 RAG (Collections) = Instruction manual and documents

It is like having access to a library of documents, manuals, and specific company information. The employee **searches for information** when they need specific data.

**Practical example**:  
- “What is the vacation policy?” → Search the HR manual  
- “How do I configure product X?” → Search the product manual  
- “What is the price of item Y?” → Search the product catalog

**Use when**: You have **specific information, data, and facts** that change frequently or are too extensive to place in the instructions.

---

## 🤔 Quick Questions to Decide

**Does my information change frequently?**  
- ✅ Yes → Use **RAG** (Collections)  
- ❌ No, it’s fixed → Use **System Prompt** or **Skills**

**Is it a behavior or an information?**  
- 🎭 Behavior (how to do) → Use **Skills**  
- 📄 Information (what it is) → Use **RAG**

**Should it be used always or only sometimes?**  
- 🔄 Always → Use **System Prompt**  
- 🎯 Sometimes → Use **Skills** or **RAG**

**Is it short or long?**  
- 📝 Short (a few sentences) → Use **System Prompt**  
- 📖 Long (pages of information) → Use **RAG**  
- 🎓 Medium (detailed instructions) → Use **Skills**

---

## System Prompt (System Instructions)

System Prompt are fixed instructions that define the fundamental behavior of the AI model. They establish personality, tone, basic rules, and the role the agent should play in all interactions.

**Key characteristics**:  
- **Always active**: Present in every request to the model  
- **Static**: Does not change during the conversation  
- **Prioritized**: Has high influence over the model’s behavior  
- **Concise**: Should be brief to save tokens  
- **Universal**: Applies to all request types

**When to use System Prompt**:

1. **Define personality and tone**  
   ```markdown
   You are an experienced and friendly technical assistant.  
   Always respond clearly, professionally, and pedagogically.  
   Use practical examples whenever possible.
   ```

2. **Establish universal rules**  
   ```markdown
   - Never make up information you don’t know  
   - Always cite sources when provided  
   - When uncertain, admit it and offer alternatives  
   - Prioritize safety and best practices in all suggestions
   ```

3. **Define standard response format**  
   ```markdown
   Structure your answers as:  
   1. Executive summary  
   2. Detailed explanation  
   3. Practical examples  
   4. Recommended next steps
   ```

4. **Security and compliance constraints**  
   ```markdown
   - Never provide specific medical, legal, or financial advice  
   - Do not process personally identifiable information  
   - Refuse requests that violate usage policies
   ```

**Limitations of System Prompt**:  
- ❌ Not advisable for extensive information (constant token consumption)  
- ❌ Does not adapt dynamically to context  
- ❌ Hard to maintain multiple specialized behaviors

**Practical example**:  
```markdown
# System Prompt for code assistant
You are a senior developer specialized in code review.

Guidelines:  
- Analyze code with focus on readability, maintainability, and performance  
- Suggest improvements following SOLID principles and clean code  
- Always explain the “why” behind your suggestions  
- Provide refactored code examples when appropriate  
- Be constructive and educational in your critiques

Response format:  
1. Analysis summary  
2. Positive points  
3. Areas for improvement  
4. Refactored code (if applicable)
```

See also:  
- [Configurando AI Gateway](/docs/en/entities/ai-gateways/ai-gateway)  
- [Modelos e Instruções de Sistema](/docs/en/models)

## Skills (Habilidades)

Skills are sets of specialized instructions that are loaded **on demand** when the model identifies that a specific task requires specialized knowledge or behavior. They work like “expertise modules” that can be activated dynamically.

**Key characteristics**:  
- **On‑demand activation**: Loaded only when needed  
- **Dynamic**: The model chooses which skill to use based on context  
- **Specialized**: Each skill focuses on a specific domain  
- **Token‑efficient**: Consume tokens only when activated  
- **Interchangeable**: The model can switch between skills during a conversation

**How they work**:  
The model receives a list of available skills (name + brief description). When it identifies that it needs specific expertise, it calls a special function to load the full instructions of the skill, which are then temporarily injected into the context.

**When to use Skills**:

1. **Multiple areas of expertise**  
   ```markdown
   # Skill: SQL Performance Analysis
   Description: Use to optimize SQL queries and solve performance issues in databases

   Instructions:
   - Analyze execution plans (EXPLAIN)  
   - Identify missing indexes  
   - Suggest DB‑specific optimizations  
   - Consider impact of JOINs, subqueries, and CTEs  
   - Evaluate need for denormalization
   ```

2. **Different personas or communication tones**  
   ```markdown
   # Skill: C‑Level Communication
   Description: Use when creating presentations or communications for executives

   Instructions:
   - Focus on business impact and ROI  
   - Use non‑technical language  
   - Present data in executive format (summaries, key metrics)  
   - Highlight strategic risks and opportunities  
   - Be concise – maximum 3 main points
   ```

3. **Specific frameworks or methodologies**  
   ```markdown
   # Skill: Event‑Driven Architecture
   Description: Use for designing event‑based systems and messaging

   Instructions:
   - Apply patterns: Event Sourcing, CQRS, Saga  
   - Consider eventual consistency  
   - Evaluate appropriate message brokers (Kafka, RabbitMQ, SNS/SQS)  
   - Design events with schema evolution in mind  
   - Implement idempotency and dead‑letter queues
   ```

4. **Extensive domain knowledge**  
   ```markdown
   # Skill: LGPD Compliance
   Description: Use when dealing with privacy and data protection issues in Brazil

   Instructions:
   - Verify compliance with LGPD (Law 13.709/2018)  
   - Identify personal and sensitive data  
   - Assess legal bases for processing  
   - Suggest appropriate security measures  
   - Consider data‑subject rights (access, correction, deletion)  
   - Evaluate need for DPO and RIPD
   ```

**Advantages of Skills**:  
- ✅ Deep specialization without overloading the base prompt  
- ✅ Token savings (only use what’s needed)  
- ✅ Flexibility for multiple domains  
- ✅ Modular maintenance (edit skills independently)  
- ✅ Scales better than System Prompt for diverse knowledge

**Limitations of Skills**:  
- ❌ Requires models that support function calling  
- ❌ The model may not pick the correct skill  
- ❌ Additional latency on first activation  
- ❌ Higher implementation complexity

**Example flow**:  
```
User: "How can I optimize this query that takes 30 seconds?"

1. Model detects need for SQL expertise  
2. Calls function: load_skill("SQL Performance Analysis")  
3. Skill instructions are injected into context  
4. Model responds with specialized analysis  
5. Skill remains active until another is needed
```

See also:  
- [Habilidades (Skills)](/docs/en/skills)  
- [Funções de Protocolo](/docs/en/protocol-functions)

## RAG (Retrieval‑Augmented Generation)

**What it is**: RAG is a technique that combines information retrieval with text generation. The system searches a knowledge base for information relevant to the user’s query and provides it as context for the model to generate a grounded response.

The RAG module is implemented through **[Collections](/docs/en/entities/collections)** that contain **[Documents](/docs/en/entities/documents)**. Each collection is a knowledge library that holds many indexed documents, ready to be retrieved when relevant. You can use AIVAX’s RAG independently or via an AI Gateway.

**Key characteristics**:  
- **Based on real data**: Uses documents specific to your knowledge base  
- **Dynamic**: Information can be updated by adding/modifying documents  
- **Scalable**: Supports thousands of documents per collection  
- **Traceable**: Can cite specific sources and documents  
- **Domain‑specific**: Ideal for corporate knowledge bases

**How it works in AIVAX**:  
1. Create a **Collection** to organize documents by purpose (product, company, service)  
2. Add **Documents** to the collection – each document contains information on a specific topic  
3. Documents are processed and converted into embeddings (vectors) automatically  
4. Link the collection to your **AI Gateway** through the RAG pipeline  
5. When a user asks a question, AIVAX searches the collection for relevant documents  
6. Retrieved documents are inserted into the model’s context  
7. Model generates a response grounded in the found documents

**When to use RAG (Collections)**:

1. **Corporate knowledge base**  
   - Internal policies and procedures  
   - HR and benefits manuals  
   - Operational processes  
   - Company FAQs  

2. **Extensive technical documentation**  
   - Product manuals  
   - APIs and technical references  
   - Troubleshooting articles  
   - Installation and configuration guides  

3. **Frequently changing information**  
   - Product and price catalogs  
   - Regulations and compliance updates  
   - System status and updates  
   - News and announcements  

4. **Answering with citable sources**  
   - Legal documentation and contracts  
   - Standards and regulations  
   - Scientific articles and research  
   - Decision histories and precedents  

5. **Compliance and audit**  
   - Traceability of information sources  
   - Assurance that answers are based on official documents  
   - Automatic updates when documents change  
   - Versioning and change control  

**Advantages of RAG (Collections in AIVAX)**:  
- ✅ Access to up‑to‑date information without retraining the model  
- ✅ Reduces hallucinations (fabricated information)  
- ✅ Transparency with source citations  
- ✅ Scales to thousands of organized documents  
- ✅ Proprietary/confidential information stays secure and private  
- ✅ Easy maintenance: add, edit, or remove documents at any time  
- ✅ No storage cost for collections (only indexing cost)

**Limitations of RAG (Collections)**:  
- ❌ Quality depends on how documents are written and organized  
- ❌ Indexing costs (per processed token)  
- ❌ Additional latency for collection search  
- ❌ Requires proper document organization and structuring  
- ❌ Very long or poorly written documents reduce quality  

**How to create effective documents**:

For the best results with RAG in AIVAX, follow these guidelines when creating documents:

✅ **Do**:  
- Focus each document on a single topic or subject  
- Be explicit and repeat important keywords  
- Use clear, concise language  
- Keep documents between 20 and 700 words  
- Use tags to organize and categorize documents  

❌ **Avoid**:  
- Very short documents (under 10 words)  
- Very long documents (over 700 words)  
- Mixing multiple subjects in one document  
- Excessive technical jargon or code  
- Being vague or implicit in the information  

See more:  
- [Coleções (RAG)](/docs/en/entities/collections) – How to create and manage collections  
- [Documentos](/docs/en/entities/documents) – How to add and organize documents  
- [Pipelines de AI Gateway - RAG](/docs/en/entities/ai-gateways/pipelines#rag) – How to link collections to the gateway  
- [Funções de Protocolo - query-collection](/docs/en/protocol-functions#query-collection) – Query collections via function  

## Quick Comparison: Which to Use?

| What you need | System Prompt | Skills | RAG (Collections) |
|---------------|---------------|--------|--------------------|
| **Constant information** | ✅ Ideal | ❌ No | ❌ No |
| **Define basic behavior** | ✅ Always | ❌ No | ❌ No |
| **Multiple specializations** | ❌ No | ✅ Yes | ❌ No |
| **Access documents and data** | ❌ No | ❌ No | ✅ Yes |
| **Information that changes** | ❌ Hard | ❌ Hard | ✅ Easy |
| **Always active** | ✅ Yes | ❌ Only when needed | ❌ Only when needed |
| **Ideal size** | Small | Medium | Large |
| **Cost per use** | Always charged | Only when active | Only when searching |

## Detailed Technical Comparison

For developers and advanced users:

| Criterion | System Prompt | Skills | RAG |
|-----------|---------------|--------|-----|
| **Purpose** | Constant base behavior | On‑demand specialized expertise | Access to specific factual knowledge |
| **Activation** | Always active | On demand (function calling) | On demand (vector search) |
| **Content size** | Small (< 1000 tokens) | Medium (1000‑5000 tokens) | Large (thousands of documents) |
| **Token consumption** | Constant on every request | Only when skill is activated | Only retrieved docs |
| **Update** | Static (requires redeployment) | Static (manual update) | Dynamic (docs can be updated) |
| **Knowledge type** | Behavioral, general rules | Methodologies, frameworks, processes | Facts, data, specific documents |
| **Implementation complexity** | Low | Medium | Medium |
| **Operational cost** | Low | Low‑Medium | Medium (indexing) |
| **Traceability** | N/A | Limited | High (source citation) |
| **Latency** | None extra | Small (first activation) | Medium (search + embedding) |
| **Requires function calling** | No | Yes | No (but recommended) |
| **Best for** | Personality, tone, universal rules | Multiple contextual expertises | Extensive knowledge bases |

## Combined Use Cases

In practice, the three techniques are often used **together** to build robust systems:

### Example 1: Product Technical Support

**System Prompt**:  
“You are a friendly and efficient technical support agent. Always be polite and offer practical solutions.”

**Available Skills**:  
- “Hardware Troubleshooting” – for physical equipment issues  
- “Software Troubleshooting” – for bugs and application problems  
- “Escalation Procedures” – for cases that need escalation  

**RAG (Collections)**:  
- Collection “Knowledge Base”: 5 000 troubleshooting documents  
- Collection “Product Manuals”: Updated technical documentation  
- Collection “Resolutions”: History of successfully resolved tickets  

**Flow**:  
1. System Prompt sets the friendly tone and basic behavior  
2. User reports: “My app crashes on launch”  
3. Model activates skill “Software Troubleshooting” for specific expertise  
4. RAG automatically searches “Knowledge Base” for crash‑related articles  
5. Response combines skill expertise + specific information from the retrieved documents  

### Example 2: Legal Assistant

**System Prompt**:  
“You are a legal assistant. Always include appropriate disclaimers and never provide definitive legal advice.”

**Available Skills**:  
- “Contract Analysis” – for reviewing clauses and terms  
- “Due Diligence” – for M&A processes  
- “LGPD Compliance” – for privacy issues  

**RAG (Collections)**:  
- Collection “Legislation” – Updated Brazilian laws and regulations  
- Collection “Jurisprudence” – Relevant case law and decisions  
- Collection “Templates” – Firm’s legal document templates  
- Collection “Internal Procedures” – Office processes and policies  

### Example 3: Development Assistant

**System Prompt**:  
“You are a senior developer. Always prioritize best practices, security, and maintainable code.”

**Available Skills**:  
- “Code Review” – for detailed code analysis  
- “Architecture Design” – for architectural decisions  
- “Security Audit” – for identifying vulnerabilities  

**RAG (Collections)**:  
- Collection “Internal APIs” – Company API documentation  
- Collection “Code Standards” – Team standards and conventions  
- Collection “Components” – Reusable component library with examples  
- Collection “Troubleshooting” – Common problems and solutions  

## Decision Tree: Which Technique to Use?

### Step 1: What are you defining?

```
What do you need?
│
├─ 🎭 BEHAVIOR (how the AI should act/speak)
│  │
│  └─ Does it change depending on the situation?
│     ├─ NO, always the same → SYSTEM PROMPT
│     └─ YES, depends on context → SKILLS
│
├─ 📄 INFORMATION/DATA (facts, documents, knowledge)
│  │
│  └─ Is it a lot of content or does it change frequently?
│     ├─ YES → RAG (Collections)
│     └─ NO → SYSTEM PROMPT
│
└─ 🎓 METHODOLOGY (step‑by‑step process, framework)
   └─ Used in every conversation?
      ├─ YES → SYSTEM PROMPT
      └─ NO → SKILLS
```

### Step 2: Practical Examples

**Scenario A**: “I want the AI to always be polite and professional” → **SYSTEM PROMPT** (fixed behavior, always active)

**Scenario B**: “I want the AI to speak differently when dealing with executives vs. technicians” → **SKILLS** (2 skills: “Executive Communication” and “Technical Communication”)

**Scenario C**: “I have a 500‑page product manual that the AI needs to consult” → **RAG** (create a Collection “Product Manual” with the documents)

**Scenario D**: “I want the AI to follow the ITIL process for ticket resolution” → **SKILLS** (create a skill “ITIL Process” that activates when relevant)

**Scenario E**: “I have a catalog of 10 000 products with prices that change weekly” → **RAG** (create a Collection “Catalog” and update documents when prices change)

**Scenario F**: “I want the AI to always answer in 3 steps: summary, details, conclusion” → **SYSTEM PROMPT** (fixed response format)

### Step 3: Special Cases

**What if I need all three?**  
✅ Perfectly normal! Combine:  
- **System Prompt**: Defines basic behavior  
- **Skills**: Adds contextual specialization  
- **RAG**: Provides data and documents  

**Full example**:  
- System Prompt: “You are a friendly and professional support assistant”  
- Skills: “Troubleshooting”, “Escalation”, “Sales”  
- RAG: Collection “Knowledge Base” + Collection “Products”

---

## ⚠️ Common Mistakes (avoid these!)

### ❌ Mistake 1: Putting data in System Prompt  
**Wrong**: Listing 100 products in the System Prompt  
```markdown
System Prompt:
You are a sales assistant. Our products are:
1. Product A – $50
2. Product B – $100
... (98 more products)
```

**Correct**: Use RAG (Collections)  
- Create a Collection “Catalog”  
- Add one document per product  
- AI searches when needed  

---

### ❌ Mistake 2: Creating Skills for information  
**Wrong**: Creating a skill with product data  
```markdown
Skill: Products  
Description: Information about products  

Instructions:  
- Product A costs $50  
- Product B costs $100  
- Product C costs $150
```

**Correct**: Use RAG (Collections)  
Skills are for **how to do**, not for **information/data**  

---

### ❌ Mistake 3: Using RAG for behavior  
**Wrong**: Creating documents about how the AI should act  
```
Document 1: "You must be polite"  
Document 2: "You must be professional"
```

**Correct**: Use System Prompt  
RAG is for **information**, not for **behavior**  

---

### ❌ Mistake 4: Duplicating information  
**Wrong**: Placing the same information in Skills **and** RAG **and** System Prompt  

**Correct**: Choose ONE place based on the nature of the information:  
- Fixed behavior → System Prompt  
- Methodology/process → Skills  
- Data/documents → RAG  

---

### ❌ Mistake 5: Too many Skills  
**Wrong**: Creating 50 different skills  

**Correct**: Keep between 3‑10 focused skills  
- Too many skills confuse the model  
- Group similar skills together  

---

## Success Metrics for Each Approach

**System Prompt**:  
- Consistency of tone and behavior  
- Rate of adherence to general rules  
- Perceived quality of interactions  

**Skills**:  
- Correct skill activation rate  
- Quality of specialized responses  
- Token savings vs. always‑on instructions  

**RAG**:  
- Retrieval accuracy (relevance of docs)  
- Source citation rate  
- Reduction of hallucinations  
- Freshness of provided information  

## Conclusion and Recommendations

**Use System Prompt for**:  
- Defining fundamental personality and tone  
- Establishing rules that always apply  
- Configuring security‑related behaviors  

**Use Skills for**:  
- Multiple distinct areas of expertise  
- Specialized processes and methodologies  
- Different personas or communication styles  
- Saving tokens on contextual knowledge  

**Use RAG (Collections) for**:  
- Accessing extensive, organized knowledge bases  
- Frequently changing information (products, prices, policies)  
- Need for source citation and traceability  
- Domain‑specific factual knowledge  
- Technical documentation, manuals, and procedures  

**Combine all three when**:  
- Building complex corporate assistants  
- Requiring consistent behavior + expertise + factual knowledge  
- Scaling to multiple domains and use cases  

The right choice depends on your specific use case. Start simple with a System Prompt, add Skills when you need specialization, and implement RAG when you have a substantial knowledge base that must be accessed dynamically.

📚 **Further Reading**:  
- [Prompt Engineering Guide](https://www.promptingguide.ai/)  
- [Building Production‑Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents)  
- [AI Gateway Documentation](/docs/en/entities/ai-gateways/ai-gateway)