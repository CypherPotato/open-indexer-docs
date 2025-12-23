# Skills vs. RAG vs. System Prompt: Entendendo as diferenças

Ao construir sistemas de IA, é fundamental compreender as diferenças entre **Skills (Habilidades)**, **RAG (Retrieval-Augmented Generation)** e **System Prompt (Instruções de Sistema)**. Cada abordagem serve propósitos específicos e é otimizada para diferentes cenários. Esta página explora em detalhes como cada técnica funciona, quando utilizá-las e suas principais diferenças.

## Em termos simples: Qual a diferença?

Pense no seu assistente de IA como um funcionário em uma empresa:

### 🎭 System Prompt = Personalidade e valores da pessoa

É como a personalidade, valores e comportamento básico do funcionário. Define como ele age, fala e se comporta em **todas** as situações.

**Exemplo prático**: "Seja sempre educado", "Fale de forma profissional", "Nunca invente informações"

**Use quando**: Você quer que o comportamento seja **sempre igual**, independente da situação.

---

### 🎓 Skills = Especializações que a pessoa sabe fazer

São habilidades especiais que o funcionário pode usar **quando necessário**. Como ter um especialista em diferentes áreas que só é chamado quando precisa.

**Exemplo prático**: 
- Precisa falar com executivos? Ativa a skill "Comunicação Executiva"
- Precisa analisar código? Ativa a skill "Code Review"
- Precisa resolver problema técnico? Ativa a skill "Troubleshooting"

**Use quando**: Você precisa de **diferentes formas de fazer as coisas** dependendo da situação. O próprio modelo decide qual skill usar baseado no que o usuário está pedindo.

---

### 📚 RAG (Coleções) = Manual de instruções e documentos

É como ter acesso a uma biblioteca de documentos, manuais e informações específicas da empresa. O funcionário **busca informações** quando precisa de dados específicos.

**Exemplo prático**:
- "Qual a política de férias?" → Busca no manual de RH
- "Como configurar o produto X?" → Busca no manual do produto
- "Qual o preço do item Y?" → Busca no catálogo de produtos

**Use quando**: Você tem **informações específicas, dados e fatos** que mudam com frequência ou são muito extensos para colocar nas instruções.

---

## 🤔 Perguntas rápidas para decidir

**Minha informação muda com frequência?**
- ✅ Sim → Use **RAG** (Coleções)
- ❌ Não, é fixa → Use **System Prompt** ou **Skills**

**É um comportamento ou uma informação?**
- 🎭 Comportamento (como fazer) → Use **Skills**
- 📄 Informação (o que é) → Use **RAG**

**Deve ser usado sempre ou só às vezes?**
- 🔄 Sempre → Use **System Prompt**
- 🎯 Às vezes → Use **Skills** ou **RAG**

**É curto ou longo?**
- 📝 Curto (poucas frases) → Use **System Prompt**
- 📖 Longo (páginas de informação) → Use **RAG**
- 🎓 Médio (instruções detalhadas) → Use **Skills**

---

## System Prompt (Instruções de Sistema)

System Prompt são instruções fixas que definem o comportamento fundamental do modelo de IA. Elas estabelecem a personalidade, o tom, as regras básicas e o papel que o agente deve desempenhar em todas as interações.

**Características principais**:
- **Sempre ativo**: Presente em cada requisição ao modelo
- **Estático**: Não muda durante a conversa
- **Prioritário**: Tem alta influência sobre o comportamento do modelo
- **Conciso**: Deve ser breve para economizar tokens
- **Universal**: Aplica-se a todos os tipos de requisição

**Quando usar System Prompt**:

1. **Definir personalidade e tom**
   ```markdown
   Você é um assistente técnico experiente e amigável.
   Sempre responda de forma clara, profissional e didática.
   Use exemplos práticos sempre que possível.
   ```

2. **Estabelecer regras universais**
   ```markdown
   - Nunca invente informações que você não sabe
   - Sempre cite fontes quando fornecidas
   - Quando incerto, admita e ofereça alternativas
   - Priorize segurança e boas práticas em todas as sugestões
   ```

3. **Definir formato de resposta padrão**
   ```markdown
   Estruture suas respostas em:
   1. Resumo executivo
   2. Explicação detalhada
   3. Exemplos práticos
   4. Próximos passos recomendados
   ```

4. **Restrições de segurança e conformidade**
   ```markdown
   - Nunca forneça conselhos médicos, legais ou financeiros específicos
   - Não processe informações pessoalmente identificáveis
   - Recuse solicitações que violem políticas de uso
   ```

**Limitações do System Prompt**:
- ❌ Não é aconselhável ter informações extensas (consumo constante de tokens)
- ❌ Não se adapta dinamicamente ao contexto
- ❌ Difícil de manter múltiplos comportamentos especializados

**Exemplo prático**:
```markdown
# System Prompt para assistente de código
Você é um desenvolvedor sênior especializado em revisão de código.

Diretrizes:
- Analise código com foco em legibilidade, manutenibilidade e performance
- Sugira melhorias seguindo princípios SOLID e clean code
- Sempre explique o "porquê" das suas sugestões
- Forneça exemplos de código refatorado quando apropriado
- Seja construtivo e educativo nas críticas

Formato de resposta:
1. Resumo da análise
2. Pontos positivos
3. Áreas de melhoria
4. Código refatorado (se aplicável)
```

Veja também:
- [Configurando AI Gateway](/docs/entities/ai-gateways/ai-gateway)
- [Modelos e Instruções de Sistema](/docs/models)

## Skills (Habilidades)

Skills são conjuntos de instruções especializadas que são carregadas **sob demanda** quando o modelo identifica que uma tarefa específica requer conhecimento ou comportamento especializado. Funcionam como "módulos de expertise" que podem ser ativados dinamicamente.

**Características principais**:
- **Ativação sob demanda**: Carregadas apenas quando necessário
- **Dinâmicas**: O modelo escolhe qual skill usar baseado no contexto
- **Especializadas**: Cada skill foca em um domínio específico
- **Econômicas em tokens**: Só consomem tokens quando ativadas
- **Intercambiáveis**: O modelo pode alternar entre skills durante a conversa

**Como funcionam**: 
O modelo recebe uma lista de skills disponíveis (nome + descrição breve). Quando identifica que precisa de expertise específica, chama uma função especial para carregar as instruções completas da skill, que são então injetadas temporariamente no contexto.

**Quando usar Skills**:

1. **Múltiplas áreas de especialização**
   ```markdown
   # Skill: Análise de SQL Performance
   Descrição: Use para otimizar queries SQL e resolver problemas de performance em bancos de dados
   
   Instruções:
   - Analise planos de execução (EXPLAIN)
   - Identifique missing indexes
   - Sugira otimizações específicas para o SGBD
   - Considere impacto de JOIN, subqueries e CTEs
   - Avalie necessidade de desnormalização
   ```

2. **Diferentes personas ou tons de comunicação**
   ```markdown
   # Skill: Comunicação C-Level
   Descrição: Use ao criar apresentações ou comunicações para executivos
   
   Instruções:
   - Foque em impacto nos negócios e ROI
   - Use linguagem não-técnica
   - Apresente dados em formato executivo (resumos, métricas-chave)
   - Destaque riscos e oportunidades estratégicas
   - Seja conciso - máximo 3 pontos principais
   ```

3. **Frameworks e metodologias específicas**
   ```markdown
   # Skill: Arquitetura Event-Driven
   Descrição: Use para design de sistemas baseados em eventos e mensageria
   
   Instruções:
   - Aplique padrões: Event Sourcing, CQRS, Saga
   - Considere consistência eventual
   - Avalie message brokers apropriados (Kafka, RabbitMQ, SNS/SQS)
   - Projete eventos com schema evolution em mente
   - Implemente idempotência e dead letter queues
   ```

4. **Conhecimento de domínio extenso**
   ```markdown
   # Skill: Compliance LGPD
   Descrição: Use ao lidar com questões de privacidade e proteção de dados no Brasil
   
   Instruções:
   - Verifique conformidade com LGPD (Lei 13.709/2018)
   - Identifique dados pessoais e sensíveis
   - Avalie bases legais para tratamento
   - Sugira medidas de segurança apropriadas
   - Considere direitos dos titulares (acesso, correção, exclusão)
   - Avalie necessidade de DPO e RIPD
   ```

**Vantagens das Skills**:
- ✅ Especialização profunda sem sobrecarregar o prompt base
- ✅ Economia de tokens (só usa o necessário)
- ✅ Flexibilidade para múltiplos domínios
- ✅ Manutenção modular (edite skills independentemente)
- ✅ Escala melhor que System Prompt para conhecimento diverso

**Limitações das Skills**:
- ❌ Requer modelos com suporte a function calling
- ❌ O modelo pode não escolher a skill correta
- ❌ Latência adicional na primeira ativação
- ❌ Complexidade de implementação maior

**Exemplo de fluxo**:
```
Usuário: "Como otimizar esta query que está demorando 30 segundos?"

1. Modelo identifica necessidade de expertise em SQL
2. Chama função: load_skill("Análise de SQL Performance")
3. Instruções da skill são injetadas no contexto
4. Modelo responde com análise especializada
5. Skill permanece ativa até que outra seja necessária
```

Veja também:
- [Habilidades (Skills)](/docs/skills)
- [Funções de Protocolo](/docs/protocol-functions)

## RAG (Retrieval-Augmented Generation)

**O que é**: RAG é uma técnica que combina recuperação de informações (retrieval) com geração de texto. O sistema busca em uma base de conhecimento informações relevantes para a consulta do usuário e as fornece como contexto para o modelo gerar uma resposta fundamentada.

O módulo de RAG é implementado através de **[Coleções](/docs/entities/collections)** que contêm **[Documentos](/docs/entities/documents)**. Cada coleção é uma biblioteca de conhecimento que abriga vários documentos indexados, prontos para serem recuperados quando relevantes. Você pode usar o RAG da AIVAX de forma independente ou através de um AI Gateway.

**Características principais**:
- **Baseado em dados reais**: Usa documentos específicos da sua base de conhecimento
- **Dinâmico**: Informações podem ser atualizadas adicionando/modificando documentos
- **Escalável**: Suporta milhares de documentos por coleção
- **Rastreável**: Pode citar fontes e documentos específicos
- **Específico do domínio**: Ideal para bases de conhecimento corporativas

**Como funciona na AIVAX**:
1. Você cria uma **Coleção** para organizar documentos por finalidade (produto, empresa, serviço)
2. Adiciona **Documentos** à coleção - cada documento contém informações sobre um tópico específico
3. Documentos são processados e convertidos em embeddings (vetores) automaticamente
4. Vincula a coleção ao seu **AI Gateway** através do pipeline de RAG
5. Quando usuário faz uma pergunta, a AIVAX busca documentos relevantes na coleção
6. Documentos recuperados são inseridos no contexto do modelo
7. Modelo gera resposta fundamentada nos documentos encontrados

**Quando usar RAG (Coleções)**:

1. **Base de conhecimento corporativa**
   - Políticas e procedimentos internos
   - Manuais de RH e benefícios
   - Processos operacionais
   - FAQs da empresa

2. **Documentação técnica extensa**
   - Manuais de produto
   - APIs e referências técnicas
   - Artigos de troubleshooting
   - Guias de instalação e configuração

3. **Informações que mudam frequentemente**
   - Catálogos de produtos e preços
   - Regulamentações e compliance
   - Status e atualizações de sistemas
   - Notícias e comunicados

4. **Responder com fontes citáveis**
   - Documentação legal e contratos
   - Normas e regulamentações
   - Artigos científicos e pesquisas
   - Histórico de decisões e precedentes

5. **Compliance e auditoria**
   - Rastreabilidade de onde vêm as informações
   - Garantia de que respostas são baseadas em documentos oficiais
   - Atualização automática quando documentos são modificados
   - Versionamento e controle de mudanças

**Vantagens do RAG (Coleções na AIVAX)**:
- ✅ Acesso a informações atualizadas sem retreinar o modelo
- ✅ Reduz alucinações (informações inventadas pelo modelo)
- ✅ Transparência com citação de fontes e documentos
- ✅ Escala para milhares de documentos organizados em coleções
- ✅ Informações proprietárias/confidenciais ficam seguras e privadas
- ✅ Fácil manutenção: adicione, edite ou remova documentos a qualquer momento
- ✅ Sem custo de armazenamento de coleções (apenas custo de indexação)

**Limitações do RAG (Coleções)**:
- ❌ Qualidade depende de como os documentos são escritos e organizados
- ❌ Custos de indexação de documentos (por tokens processados)
- ❌ Latência adicional para busca na coleção
- ❌ Requer organização e estruturação adequada dos documentos
- ❌ Documentos muito longos ou mal escritos reduzem a qualidade

**Como criar documentos eficazes**:

Para obter os melhores resultados com RAG na AIVAX, siga estas diretrizes ao criar documentos:

✅ **Faça**:
- Foque cada documento em um único tópico ou assunto
- Seja explícito e repita palavras-chave importantes
- Use linguagem clara e objetiva
- Mantenha documentos entre 20 e 700 palavras
- Use tags para organizar e categorizar documentos

❌ **Evite**:
- Documentos muito curtos (menos de 10 palavras)
- Documentos muito longos (mais de 700 palavras)
- Misturar múltiplos assuntos em um único documento
- Usar linguagem técnica excessiva ou código
- Ser vago ou implícito nas informações

Veja mais:
- [Coleções (RAG)](/docs/entities/collections) - Como criar e gerenciar coleções
- [Documentos](/docs/entities/documents) - Como adicionar e organizar documentos
- [Pipelines de AI Gateway - RAG](/docs/entities/ai-gateways/pipelines#rag) - Como vincular coleções ao gateway
- [Funções de Protocolo - query-collection](/docs/protocol-functions#query-collection) - Buscar em coleções via função

## Comparação rápida: Qual usar?

| O que você precisa | System Prompt | Skills | RAG (Coleções) |
|-------------------|---------------|--------|----------------|
| **Informações constantes** | ✅ Ideal | ❌ Não | ❌ Não |
| **Definir comportamento básico** | ✅ Sempre | ❌ Não | ❌ Não |
| **Múltiplas especializações** | ❌ Não | ✅ Sim | ❌ Não |
| **Acessar documentos e dados** | ❌ Não | ❌ Não | ✅ Sim |
| **Informações que mudam** | ❌ Difícil | ❌ Difícil | ✅ Fácil |
| **Sempre ativo** | ✅ Sim | ❌ Só quando necessário | ❌ Só quando necessário |
| **Tamanho ideal** | Pequeno | Médio | Grande |
| **Custo por uso** | Sempre cobra | Só quando ativa | Só quando busca |

## Comparação detalhada (técnica)

Para desenvolvedores e usuários avançados:

| Critério | System Prompt | Skills | RAG |
|----------|--------------|--------|-----|
| **Propósito** | Comportamento base constante | Expertise especializada sob demanda | Acesso a conhecimento factual específico |
| **Ativação** | Sempre ativo | Sob demanda (function calling) | Sob demanda (busca vetorial) |
| **Tamanho do conteúdo** | Pequeno (< 1000 tokens) | Médio (1000-5000 tokens) | Grande (milhares de documentos) |
| **Consumo de tokens** | Constante em toda requisição | Apenas quando skill ativada | Apenas docs recuperados |
| **Atualização** | Estático (requer redeployment) | Estático (requer atualização manual) | Dinâmico (docs podem ser atualizados) |
| **Tipo de conhecimento** | Comportamental, regras gerais | Metodologias, frameworks, processos | Fatos, dados, documentos específicos |
| **Complexidade de implementação** | Baixa | Média | Média |
| **Custo de operação** | Baixo | Baixo-Médio | Médio (indexação) |
| **Rastreabilidade** | Não aplicável | Limitada | Alta (citação de fontes) |
| **Latência** | Nenhuma adicional | Pequena (primeira ativação) | Média (busca + embedding) |
| **Requer function calling** | Não | Sim | Não (mas recomendado) |
| **Melhor para** | Personalidade, tom, regras universais | Múltiplas expertises contextuais | Bases de conhecimento extensas |

## Cenários de uso combinado

Na prática, as três técnicas frequentemente são usadas **em conjunto** para criar sistemas robustos:

### Exemplo 1: Suporte técnico de produto

**System Prompt**:
"Você é um agente de suporte técnico amigável e eficiente.
Sempre seja educado e ofereça soluções práticas."

**Skills disponíveis**:
- "Troubleshooting Hardware": Para problemas físicos de equipamentos
- "Troubleshooting Software": Para bugs e problemas de aplicativos
- "Escalation Procedures": Para casos que requerem escalação

**RAG (Coleções)**:
- Coleção "Base de Conhecimento": 5000 documentos de troubleshooting
- Coleção "Manuais de Produtos": Documentação técnica atualizada
- Coleção "Resoluções": Histórico de tickets resolvidos com sucesso

**Fluxo**:
1. System Prompt define o tom amigável e comportamento básico
2. Usuário relata: "Meu aplicativo está crashando ao abrir"
3. Modelo ativa skill "Troubleshooting Software" para expertise específica
4. RAG busca automaticamente em "Base de Conhecimento" artigos sobre crashes
5. Resposta combina a expertise da skill + informações específicas dos documentos encontrados

### Exemplo 2: Assistente jurídico

**System Prompt**:
"Você é um assistente jurídico. Sempre inclua disclaimers apropriados
e nunca forneça aconselhamento legal definitivo."

**Skills disponíveis**:
- "Análise Contratual": Para revisar cláusulas e termos
- "Due Diligence": Para processos de M&A
- "Compliance LGPD": Para questões de privacidade

**RAG (Coleções)**:
- Coleção "Legislação": Leis e regulamentos brasileiros atualizados
- Coleção "Jurisprudência": Precedentes e decisões judiciais relevantes
- Coleção "Templates": Modelos de documentos jurídicos da firma
- Coleção "Procedimentos Internos": Processos e políticas do escritório

### Exemplo 3: Assistente de desenvolvimento

**System Prompt**:
"Você é um desenvolvedor sênior. Sempre priorize boas práticas,
segurança e código manutenível."

**Skills disponíveis**:
- "Code Review": Para análise detalhada de código
- "Architecture Design": Para decisões arquiteturais
- "Security Audit": Para identificar vulnerabilidades

**RAG (Coleções)**:
- Coleção "APIs Internas": Documentação das APIs da empresa
- Coleção "Padrões de Código": Standards e conventions do time
- Coleção "Componentes": Biblioteca de componentes reutilizáveis com exemplos
- Coleção "Troubleshooting": Problemas comuns e suas soluções

## Árvore de decisão: Qual técnica usar?

### Passo 1: O que você está definindo?

```
O que você precisa?
│
├─ 🎭 COMPORTAMENTO (como a IA deve agir/falar)
│  │
│  └─ Isso muda dependendo da situação?
│     ├─ NÃO, sempre igual → SYSTEM PROMPT
│     └─ SIM, depende do contexto → SKILLS
│
├─ 📄 INFORMAÇÃO/DADOS (fatos, documentos, conhecimento)
│  │
│  └─ É muito conteúdo ou muda frequentemente?
│     ├─ SIM → RAG (Coleções)
│     └─ NÃO → SYSTEM PROMPT
│
└─ 🎓 METODOLOGIA (processo passo-a-passo, framework)
   └─ Usa em todas as conversas?
      ├─ SIM → SYSTEM PROMPT
      └─ NÃO → SKILLS
```

### Passo 2: Exemplos práticos

**Cenário A**: "Quero que a IA sempre seja educada e profissional"
→ **SYSTEM PROMPT** (comportamento fixo, sempre ativo)

**Cenário B**: "Quero que a IA fale de forma diferente quando atender executivos vs. técnicos"
→ **SKILLS** (2 skills: "Comunicação Executiva" e "Comunicação Técnica")

**Cenário C**: "Tenho 500 páginas de manual do produto que a IA precisa consultar"
→ **RAG** (crie uma Coleção "Manual do Produto" com os documentos)

**Cenário D**: "Quero que a IA siga o processo ITIL para resolver tickets"
→ **SKILLS** (crie uma skill "Processo ITIL" que será ativada quando relevante)

**Cenário E**: "Tenho um catálogo de 10.000 produtos com preços que mudam semanalmente"
→ **RAG** (crie uma Coleção "Catálogo" e atualize os documentos quando preços mudarem)

**Cenário F**: "Quero que a IA sempre responda em 3 passos: resumo, detalhes, conclusão"
→ **SYSTEM PROMPT** (formato fixo de resposta)

### Passo 3: Casos especiais

**E se eu precisar dos três?**
✅ Perfeitamente normal! Combine:
- **System Prompt**: Define comportamento básico
- **Skills**: Adiciona especialização contextual
- **RAG**: Fornece acesso aos dados e documentos

**Exemplo completo**:
- System Prompt: "Você é um assistente de suporte amigável e profissional"
- Skills: "Troubleshooting", "Escalação", "Vendas"
- RAG: Coleção "Base de Conhecimento" + Coleção "Produtos"

---

## ⚠️ Erros comuns (evite isso!)

### ❌ Erro 1: Colocar dados no System Prompt
**Errado**: Colocar lista de 100 produtos no System Prompt
```markdown
System Prompt:
Você é um assistente de vendas. Nossos produtos são:
1. Produto A - R$ 50
2. Produto B - R$ 100
... (98 produtos depois)
```

**Correto**: Use RAG (Coleções)
- Crie uma Coleção "Catálogo"
- Adicione um documento para cada produto
- A IA busca quando necessário

---

### ❌ Erro 2: Criar Skills para informações
**Errado**: Criar uma skill com dados de produtos
```markdown
Skill: Produtos
Descrição: Informações sobre produtos

Instruções:
- Produto A custa R$ 50
- Produto B custa R$ 100
- Produto C custa R$ 150
```

**Correto**: Use RAG (Coleções)
Skills são para **como fazer**, não para **informações/dados**

---

### ❌ Erro 3: Usar RAG para comportamento
**Errado**: Criar documentos sobre como a IA deve agir
```
Documento 1: "Você deve ser educado"
Documento 2: "Você deve ser profissional"
```

**Correto**: Use System Prompt
RAG é para **informações**, não para **comportamento**

---

### ❌ Erro 4: Duplicar informações
**Errado**: Colocar a mesma informação em Skills E RAG E System Prompt

**Correto**: Escolha UM lugar baseado na natureza da informação:
- Comportamento fixo → System Prompt
- Metodologia/processo → Skills
- Dados/documentos → RAG

---

### ❌ Erro 5: Skills demais
**Errado**: Criar 50 skills diferentes

**Correto**: Mantenha entre 3-10 skills focadas
- Muitas skills confundem o modelo
- Agrupe skills similares

---

## Métricas de sucesso para cada abordagem

**System Prompt**:
- Consistência no tom e comportamento
- Taxa de seguimento de regras gerais
- Qualidade percebida das interações

**Skills**:
- Taxa de ativação correta da skill
- Qualidade das respostas especializadas
- Economia de tokens vs. instruções sempre ativas

**RAG**:
- Precisão da recuperação (relevância dos docs)
- Taxa de citação de fontes
- Redução de alucinações
- Atualidade das informações fornecidas

## Conclusão e recomendações

**Use System Prompt para**:
- Definir a personalidade e tom fundamental
- Estabelecer regras que sempre se aplicam
- Configurar comportamentos de segurança

**Use Skills para**:
- Múltiplas áreas de expertise distintas
- Processos e metodologias especializadas
- Diferentes personas ou estilos de comunicação
- Economizar tokens em conhecimento contextual

**Use RAG (Coleções) para**:
- Acessar bases de conhecimento extensas e organizadas
- Informações que mudam frequentemente (produtos, preços, políticas)
- Necessidade de citação de fontes e rastreabilidade
- Conhecimento factual específico do domínio
- Documentação técnica, manuais e procedimentos

**Combine as três quando**:
- Construir assistentes corporativos complexos
- Precisar de comportamento consistente + expertise + conhecimento factual
- Escalar para múltiplos domínios e casos de uso

A escolha certa depende do seu caso de uso específico. Comece simples com System Prompt, adicione Skills quando precisar de especialização, e implemente RAG quando tiver uma base de conhecimento substancial que precisa ser acessada dinamicamente.

📚 **Leitura adicional**:
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Building Production-Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents)
- [AI Gateway Documentation](/docs/entities/ai-gateways/ai-gateway)
