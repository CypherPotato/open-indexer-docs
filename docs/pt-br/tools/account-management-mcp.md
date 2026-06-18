# Gerenciamento de conta MCP

O MCP de gerenciamento de conta expõe operações selecionadas da conta AIVAX para um cliente compatível com MCP, como uma IDE, assistente de desktop, agente interno ou ambiente de automação. Ele foi projetado para operadores confiáveis e fluxos de trabalho de back‑end que precisam inspecionar as capacidades da conta, descobrir documentação ou chamar rotas autenticadas da API AIVAX sem sair do cliente MCP.

Esse ponto de extremidade é diferente de configurar uma fonte externa de MCP dentro de um [AI Gateway](/docs/pt-br/tools/mcp). Nesse fluxo, a AIVAX é o cliente MCP e seu gateway chama outro servidor durante a inferência. Com o MCP de gerenciamento de conta, a AIVAX é o servidor MCP. Seu cliente MCP se conecta à AIVAX e recebe ferramentas para operar a conta autenticada.

Use este MCP quando um agente precisar de contexto relacionado à conta antes de agir: quais modelos estão disponíveis no plano atual, como um recurso está documentado, o que uma rota de API retorna ou se um recurso da conta pode ser criado, atualizado ou inspecionado através da API AIVAX existente. Ele é especialmente útil para assistentes de suporte interno, ambientes de desenvolvimento, copilotos de administração de conta e agentes de implementação que precisam combinar consulta de documentação com chamadas reais de API.

Como o MCP pode invocar funções autenticadas da AIVAX, conecte‑o apenas a partir de clientes confiáveis e use uma chave de API privada. Não exponha este servidor a usuários finais ou aplicações no lado do navegador.

> [!NOTE]
> Não configure o MCP de gerenciamento de conta junto com o [documentation MCP](/docs/pt-br/tools/documentation-mcp) no mesmo cliente, a menos que tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de conta já inclui funções de busca de documentação, portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

A solicitação deve ser autenticada com uma chave de API da conta. Use uma chave privada no cabeçalho `Authorization`:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](/docs/pt-br/authentication).

## Exemplo de configuração

A forma exata da configuração do MCP depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP transmitível, configure o ponto de extremidade da AIVAX e envie a chave privada como cabeçalho.

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

Depois que o cliente se conectar, ele pode listar as ferramentas expostas pelo servidor de gerenciamento de conta. Os nomes das ferramentas são estáveis e intencionalmente prefixados com `aivax_` para que permaneçam claros quando misturados com ferramentas de outros servidores MCP.

## O que você pode usar para

O MCP de gerenciamento de conta é útil quando o assistente precisa raciocinar sobre a própria conta, não apenas responder a um prompt do usuário final. Ele oferece ao cliente MCP um modo controlado de combinar documentação AIVAX, metadados de modelo e chamadas autenticadas da API da conta. Isso o torna adequado para agentes operacionais, copilotos de implementação e assistentes internos que precisam inspecionar como um workspace AIVAX está configurado antes de recomendar ou alterar algo.

### Criar e manter agentes

Um agente de desenvolvimento interno pode usar o MCP para ajudar a criar, revisar e ajustar [AI Gateways](/docs/pt-br/inference/ai-gateway). Antes de alterar um gateway, o agente pode buscar no manual da AIVAX o recurso relevante, listar os modelos disponíveis para a conta atual, comparar capacidades de modelo e disponibilidade de plano, e então invocar a rota de API de conta adequada.

Isso é útil quando equipes criam assistentes para diferentes departamentos, locatários ou produtos com frequência. O MCP permite que o operador peça um agente em termos de produto, como “criar um assistente de suporte para políticas de reembolso com o CRM MCP habilitado”, enquanto o assistente de implementação verifica quais modelos, ferramentas, coleções RAG e opções de gateway estão disponíveis na conta.

Para fluxos de trabalho de produção, mantenha uma etapa de aprovação humana antes de escrever. O MCP pode ajudar a preparar a configuração, explicar os trade‑offs e mostrar a ação de API que pretende executar antes de modificar o estado da conta.

### Monitorar custos e escolhas de modelo

O MCP pode ajudar um assistente de operações a investigar padrões de custo e seleção de modelo. Listando modelos e invocando rotas de API de conta para uso, faturamento, gateway ou informações de chave, o assistente pode explicar quais modelos são caros, quais rotas estão usando um multiplicador de assinatura e se um modelo mais barato poderia lidar com parte da carga de trabalho.

Isso é especialmente útil quando uma equipe possui muitos gateways ou jobs em lote e deseja entender por que o gasto mudou. Em vez de observar apenas os totais, um assistente pode conectar uso a metadados de modelo, disponibilidade de plano, configuração de gateway e escolhas de recursos como RAG, ferramentas, lote ou entrada multimodal.

Use isso para verificações recorrentes, como “quais gateways provavelmente gerarão custo esta semana?”, “quais famílias de modelos estão sendo mais usadas?” ou “podemos mover este fluxo de trabalho de baixo risco para um modelo menor sem perder capacidades necessárias?”

### Entender erros e melhorar observabilidade

Quando uma integração falha, o MCP de gerenciamento de conta pode ajudar um assistente a passar de um erro genérico para um diagnóstico útil. O assistente pode buscar documentação para a rota ou recurso que falhou, inspecionar recursos da conta através de chamadas de API e comparar a resposta observada com o comportamento esperado.

Por exemplo, um assistente de suporte pode investigar se uma falha foi causada por uma chave de API expirada, saldo insuficiente, restrições de plano, coleção ausente, rota de provedor desativada, configuração de gateway inválida ou problema de esquema de ferramenta. O resultado é uma explicação mais clara: o que falhou, onde provavelmente falhou, quais evidências sustentam essa conclusão e o que o operador deve verificar a seguir.

Esse tipo de observabilidade é mais valioso quando o assistente tem permissão para ler o estado relevante da conta, mas não alterá‑lo automaticamente. Conceda acesso de escrita apenas a fluxos de trabalho de manutenção confiáveis.

### Meta‑prompting e revisão de conversas

O MCP pode suportar fluxos de trabalho de meta‑prompting onde um assistente revisa conversas anteriores, comportamento de gateway e documentação para sugerir melhorias. O objetivo não é responder novamente ao usuário original; é inspecionar como o agente se comportou e identificar o que pode ser melhorado em prompts, instruções, ferramentas, escolha de modelo ou configuração RAG.

Um agente de revisão pode procurar padrões como respostas muito longas, perguntas ausentes, seleção errada de ferramenta, loops de clarificação repetidos, suposições inseguras ou respostas que ignoram o contexto recuperado. Em seguida, pode propor mudanças concretas: uma instrução de sistema melhor, descrição de ferramenta mais restrita, esquema de saída estruturada mais forte, modelo diferente ou fonte de recuperação adicional.

Isso é útil para equipes que tratam assistentes como produtos. Em vez de afinar prompts apenas por intuição, elas podem revisar interações reais e transformar as descobertas em mudanças menores de gateway ou de base de conhecimento.

### Identificar por que modelos falham em situações específicas

Algumas falhas de modelo não são causadas apenas pelo modelo. Uma resposta errada pode vir de contexto ausente, prompt fraco, resultado de recuperação ruim, ferramenta indisponível, capacidade de modelo incompatível ou esquema que permite ao modelo produzir saída ambígua.

Com o contexto da conta disponível através do MCP, um assistente pode investigar essas camadas em conjunto. Ele pode verificar qual modelo foi selecionado, se esse modelo suporta a capacidade necessária, qual configuração de gateway estava ativa, se a coleção RAG relevante existe e qual documentação explica o comportamento esperado.

Isso ajuda a responder perguntas como “por que o assistente falha quando usuários perguntam sobre reembolsos?”, “por que este modelo ignora uma ferramenta?” ou “por que as respostas degradam quando a solicitação inclui um arquivo?”. O resultado deve ser uma explicação baseada em evidências e uma correção focada, como mudar o modelo, melhorar a descrição da ferramenta, adicionar material de recuperação ou reescrever a instrução do gateway.

### Melhorar a qualidade do RAG

O MCP de gerenciamento de conta também é útil para manter sistemas RAG. Um assistente pode inspecionar o comportamento da API relacionado a coleções, buscar na documentação da AIVAX orientações de recuperação e ajudar a comparar a configuração do gateway com o fluxo de recuperação pretendido.

Use-o para investigar recuperação fraca, citações ausentes, trechos irrelevantes, buscas demasiado amplas, documentos de baixa qualidade ou casos em que um gateway deveria usar uma coleção mas não o faz. Um assistente de manutenção de RAG pode sugerir melhor formulação de consultas, mudanças de chunking, organização de coleções, ajustes de reranker, ajustes de `top` e `minScore`, ou quando expor uma coleção através do [collection MCP](/docs/pt-br/rag/semantic-search#mcp).

O melhor fluxo de trabalho é iterativo: inspecionar uma resposta falha, identificar qual contexto deveria ter sido recuperado, testar ou revisar o caminho de recuperação, atualizar documentos ou configurações do gateway e, em seguida, reavaliar o mesmo padrão de conversa.

## Orientações de segurança

Trate este servidor MCP como uma integração administrativa. Uma chave privada conectada a ele pode ler ou modificar recursos da conta dependendo das rotas que o agente invoca.

Use uma chave de API dedicada para cada cliente ou automação MCP. Rotule-a claramente, defina uma expiração quando possível e rotacione‑a se o cliente for compartilhado, comprometido ou não for mais necessário. Armazene a chave no mecanismo de segredos do cliente MCP ou em um armazenamento de configuração local, não no controle de versão.

Não conecte o MCP de gerenciamento de conta a agentes não confiáveis, clientes de chat públicos ou sessões de navegador controladas pelo usuário. Se um fluxo de trabalho precisar apenas de recuperação de uma coleção RAG, use o [collection MCP](/docs/pt-br/rag/semantic-search#mcp) com configuração somente leitura. Se um gateway precisar chamar suas ferramentas externas durante a inferência, configure [MCP functions](/docs/pt-br/tools/mcp) ou [server‑side functions](/docs/pt-br/tools/protocol-functions) em vez disso.