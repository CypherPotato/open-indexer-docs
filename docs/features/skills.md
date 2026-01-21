# Habilidades

Habilidades (também conhecido como skills) podem ser usadas para melhorar como seu agente performa em tarefas específicas. Habilidades são instruções especiais que são recuperadas por demanda, e o seu agente carrega essas habilidades conforme necessita.

O ideal é que seu agente só use uma habilidade quando relevante para a tarefa que está desempenhando. Ela é embutida na conversa através de uma ferramenta especial e instruções sobre habilidades são adicionadas no contexto, indicando que o agente possui habilidades fornecidas no contexto e que podem ser usadas na conversa.

## Como funcionam as habilidades?

As habilidades são primariamente fornecidas através de nome e uma breve descrição do que aquela habilidade é e quando ela deve ser usada. Você pode ter várias habilidades em sua conta, mas usar somente parte delas em seu [AI gateway](/docs/entities/ai-gateways/ai-gateway). As habilidades ativadas no AI gateway são injetadas nas instruções de sistema do seu modelo e uma função adicional é adicionada no contexto.

Quando o modelo chama a ferramenta de leitura de habilidades, as instruções daquela habilidade é inserida nas instruções do sistema do contexto de forma dinâmica. Somente uma habilidade pode ser ativada por contexto, e o LLM pode alterar a habilidade ativa conforme necessita.

Para que isso funcione, o modelo base escolhido deve suportar **chamadas de função** e **instruções de sistema**.

- Caso seu modelo não suporte chamadas de função, considere usar um [tool handler](/docs/entities/ai-gateways/pipelines) para manipular chamadas de função.
- Caso seu modelo não suporte instruções de sistema, considere usar a flag `No system instructions`, que fornece instruções de sistema como uma mensagem de usuário.

Modelos maiores tendem à seguir estritamente instruções e chamadas de função. Realize testes para saber se seu modelo está alterando suas habilidades conforme necessário.

## Como escrever habilidades?

Escrever habilidades eficazes requer clareza e especificidade nas instruções. Aqui estão as principais diretrizes:

### Estrutura de uma habilidade

Uma habilidade bem escrita deve conter:

1. **Nome claro e descritivo**: Use nomes que identifiquem imediatamente o propósito da habilidade (ex: "Análise de Código Python", "Atendimento ao Cliente", "Tradução Técnica").

2. **Descrição concisa**: Forneça uma descrição breve (1-2 frases) que explique quando a habilidade deve ser ativada. Esta descrição é crucial, pois o modelo usa ela para decidir se deve carregar a habilidade.

3. **Instruções detalhadas**: As instruções propriamente ditas devem incluir:
   - Objetivos claros da tarefa
   - Formato esperado de resposta
   - Regras específicas a seguir
   - Exemplos quando apropriado
   - Restrições ou limitações importantes

### Boas práticas

- **Seja específico**: Evite instruções vagas. Em vez de "seja útil", diga "forneça explicações passo a passo com exemplos de código".
- **Use linguagem imperativa**: Comece frases com verbos de ação (analise, explique, compare, liste).
- **Mantenha o escopo limitado**: Cada habilidade deve focar em uma área específica de conhecimento ou tipo de tarefa.
- **Teste iterativamente**: Refine suas habilidades baseado em como o modelo responde na prática.
- **Evite redundância**: Não repita informações já presentes nas instruções base do sistema.

### Exemplo de habilidade
- Nome: Análise de Performance de Código
- Descrição: Use quando o usuário pedir análise de performance, otimização ou identificação de gargalos em código.

```markdown
- Analise o código fornecido identificando possíveis gargalos de performance
- Considere complexidade temporal (Big O) e uso de memória
- Sugira otimizações específicas com exemplos de código
- Explique o impacto de cada otimização proposta
- Priorize legibilidade e manutenibilidade junto com performance
```

## Quando usar habilidades?

Habilidades são mais úteis em cenários específicos onde você precisa de comportamento especializado:

### Cenários ideais

**1. Conhecimento especializado de domínio**
- Terminologia técnica específica de uma indústria
- Conformidade com regulamentações ou padrões
- Metodologias específicas (Scrum, ITIL, SOC 2, etc.)

**2. Mudança de tom ou estilo**
- Atendimento formal vs. casual
- Comunicação técnica vs. simplificada
- Diferentes personas ou papéis

**3. Processos complexos e estruturados**
- Fluxos de trabalho multi-etapa
- Análises que seguem frameworks específicos
- Geração de documentos com formatos rigorosos

**4. Tarefas que exigem contexto extenso**
- Quando as instruções são muito longas para incluir sempre
- Conhecimento que só é relevante ocasionalmente
- Múltiplos conjuntos de regras mutuamente exclusivos

### Quando NÃO usar habilidades

- **Instruções permanentes**: Se as instruções devem estar sempre ativas, coloque-as nas instruções de sistema base.
- **Tarefas simples**: Para respostas diretas que não exigem contexto especial.
- **Conhecimento geral**: Informações que o modelo já conhece bem não precisam ser reforçadas via habilidades.
- **Muito poucas ou muitas habilidades**: O ideal é ter entre 3-10 habilidades. Menos que isso, considere usar instruções base. Mais que isso, pode confundir o modelo.

### Comparação: Habilidades vs. Instruções de Sistema

| Aspecto | Habilidades | Instruções de Sistema |
|---------|-------------|----------------------|
| Quando aplicar | Sob demanda, quando relevante | Sempre ativas |
| Tamanho ideal | Podem ser extensas | Devem ser concisas |
| Mudança de contexto | Sim, podem alternar | Não, são fixas |
| Uso de tokens | Econômico (só quando necessário) | Constante |
| Melhor para | Conhecimento especializado | Comportamento base do agente |

### Dicas de implementação

- **Comece pequeno**: Implemente 2-3 habilidades inicialmente e expanda conforme necessário.
- **Monitore o uso**: Verifique se o modelo está ativando as habilidades corretamente.
- **Evite sobreposição**: Habilidades com descrições similares podem confundir o modelo.
- **Teste a transição**: Certifique-se de que o modelo muda de habilidade quando apropriado.

## Comparando Skills, RAG e System Prompt

Para entender melhor quando e como usar habilidades em comparação com outras técnicas como **RAG (Retrieval-Augmented Generation)** e **System Prompt (Instruções de Sistema)**, consulte nosso guia completo:

**[Clique para acessar o guia de comparação.](/docs/concepts-comparison)**

Este guia detalha:
- As diferenças fundamentais entre cada abordagem
- Quando usar cada técnica
- Exemplos práticos e casos de uso
- Como combinar as três técnicas para sistemas robustos
- Árvore de decisão para escolher a abordagem certa

Veja também:
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Building Production-Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents)
- [AI Gateway Documentation](/docs/entities/ai-gateways/ai-gateway)