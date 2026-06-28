# Habilidades

Habilidades são pacotes de instruções reutilizáveis que ajudam um AI Gateway a aplicar comportamento especializado apenas quando for relevante. Use‑as para expertise de domínio, estilo de resposta, procedimentos de revisão, regras de conformidade ou fluxos de trabalho específicos que seriam grandes demais ou muito situacionais para permanecer nas instruções base do gateway.

Uma habilidade tem:

- **Slug:** O identificador está usado por gateways, importações, exportações e chamadas de API.
- **Description:** Uma breve explicação de roteamento que indica ao modelo quando a habilidade deve ser usada.
- **Instructions:** A orientação completa inserida quando a habilidade está ativa.
- **Options:** Configuração de fonte de instrução remota armazenada e associações de nomes de ferramentas.

Para detalhes mais profundos de comportamento e ativação, veja o [Skills developer guide](/docs/pt-br/features/skills).

## Quando usar Habilidades

Use Habilidades quando o assistente precisar de comportamento especializado apenas para algumas tarefas:

- Métodos legais, financeiros, de saúde, suporte, engenharia ou outros específicos de domínio.
- Um tom ou formato de resposta que deve ser aplicado apenas a um fluxo de trabalho específico.
- Uma lista de verificação de revisão, procedimento operacional ou política de escalonamento.
- Um conjunto de instruções longas que desperdiçariam contexto se permanecessem sempre ativas.
- Vários conjuntos de regras distintas que não devem ser aplicados simultaneamente.

Não use Habilidades para instruções que devem ser aplicadas sempre. Coloque comportamento permanente nas instruções do AI Gateway. Não use Habilidades como base de conhecimento pesquisável; use [RAG Collections](/docs/pt-br/platform/rag-collections) quando o assistente precisar recuperar documentos factuais. Não use uma habilidade para expor uma ferramenta a menos que a tarefa realmente necessite dela.

## Entender a página de Habilidades

Abra **Habilidades** na barra lateral do console.

A tabela **My skills** mostra:

- **Id:** O ID único da habilidade.
- **Slug:** O nome estável da habilidade.
- **Description:** Uma pré‑visualização de quando a habilidade deve ser usada.
- **Allowed tools:** O número de nomes de ferramentas armazenados nas opções da habilidade. Zero é normal para habilidades apenas de instrução.
- **Actions:** Editar ou excluir a habilidade.

Use **New skill** para criar uma habilidade. Use **Manage** para importar habilidades de JSONL, exportar todas as habilidades ou excluir todas as habilidades.

## Criar uma habilidade

Selecione **New skill**, depois preencha a aba **Skill editor**.

| Campo | O que inserir | Orientação |
| --- | --- | --- |
| **Slug** | Um nome técnico curto | Use de 1 a 64 letras, números, sublinhados, pontos ou hífens. Palavras em minúsculas separadas por hífens, como `contract-review` ou `support-escalation`, são mais fáceis de ler. Mantenha estável; alterá‑lo pode afetar gateways, importações e referências. |
| **Description** | Quando a habilidade deve ser usada | Escreva como uma regra de roteamento. Uma boa descrição indica a tarefa, o domínio e as condições de disparo. |
| **Instructions** | O comportamento completo a aplicar | Escreva orientações operacionais: o que fazer, o que evitar, o que perguntar quando informações faltarem, formato de saída esperado e quaisquer limites. |

Use **Edit with AI** quando quiser ajuda para melhorar a descrição ou instruções. Revise o diff antes de aceitar; essa ação pode reescrever regras operacionais importantes.

Após salvar, teste a habilidade através de um AI Gateway que tenha acesso a ela. Uma habilidade que parece bem escrita isoladamente ainda pode conflitar com instruções do gateway, ferramentas ou outras habilidades.

## Escrever uma descrição forte

A descrição é como o modelo decide se carrega a habilidade. Deve ser específica o suficiente para separar esta habilidade de habilidades próximas.

Fraca:

```text
Legal skill.
```

Melhor:

```text
Use quando o usuário solicitar revisão, explicação ou comparação de cláusulas contratuais em linguagem simples, especialmente obrigações, rescisão, responsabilidade, confidencialidade ou termos de resolução de disputas.
```

Evite descrições sobrepostas entre muitas habilidades. Se duas habilidades afirmam a mesma tarefa, o modelo pode carregar a errada ou carregar muitas.

## Escrever instruções úteis

Instruções devem dizer ao modelo como executar a tarefa após a habilidade estar ativa.

Instruções boas geralmente incluem:

- O objetivo da habilidade.
- A estrutura de resposta esperada.
- Regras ou listas de verificação de domínio.
- Perguntas a fazer quando informações necessárias estiverem ausentes.
- Limites, avisos ou regras de escalonamento.
- Orientação de uso de ferramentas, se ferramentas forem permitidas.
- Exemplos apenas quando reduzirem ambiguidades.

Mantenha segredos sensíveis, chaves de API, credenciais, dados privados de clientes, detalhes de casos únicos, contatos de escalonamento, limiares de políticas, controles defensivos, posições legais e procedimentos de incidentes fora de habilidades reutilizáveis, a menos que a habilidade realmente os exija. Habilidades podem ser exportadas, reutilizadas e habilitadas em gateways, portanto trate‑as como configuração operacional de nível de conta.

## Configurar Opções

Abra a aba **Options** para configurar comportamento adicional.

### Fontes de instrução remotas

Fontes de instrução remotas armazenam configuração externa de fonte de instrução com a habilidade. São úteis como metadados de configuração, mas a ativação atual da habilidade injeta de forma confiável o campo **Instructions** embutido. Não dependa de fontes de instrução remotas para comportamento de tempo de execução obrigatório, a menos que sua integração tenha verificado esse caminho.

Antes de adicionar uma fonte remota, confirme:

- A fonte é estável, versionada ou fixada e controlada pela sua organização.
- O conteúdo é revisado antes do uso em produção e revisado novamente quando mudar.
- A fonte não expõe segredos ou dados privados de clientes.
- A fonte não é controlada por terceiros, editável publicamente ou editável por usuários sem revisão.
- Você testou o comportamento do gateway/tempo de execução que se espera usar a configuração de fonte armazenada.

Se o assistente precisar confiar em um corpo mutável de conteúdo factual, prefira RAG Collections a incorporar esse conhecimento diretamente em uma habilidade.

### Ferramentas visíveis da habilidade

**Skill visible tools** armazena nomes de ferramentas destinados a serem associados à habilidade. Use essa configuração com cuidado e verifique o comportamento no gateway exato onde a habilidade será executada. A forma confiável de manter ferramentas compartilhadas visíveis quando um AI Gateway oculta ferramentas sem uma habilidade é a configuração geral de ferramentas sempre visíveis do gateway.

Exposeja apenas as ferramentas que a tarefa realmente necessita. O acesso a ferramentas pode mudar custo, privacidade, exposição de dados externos e confiabilidade da saída.

| Categoria de ferramenta | Risco principal | Prática mais segura |
| --- | --- | --- |
| Ferramentas externas de web, navegador ou busca | O assistente pode enviar contexto da tarefa fora do AIVAX | Permitir apenas quando o fluxo de trabalho exigir informação externa atual e indicar o que pode ser buscado. |
| Ferramentas de conta, banco de dados ou operação interna | O assistente pode agir sobre dados empresariais sensíveis | Restringir a habilidades revisadas e testar primeiro com prompts não‑produção. |
| Ferramentas de escrita, envio, exclusão ou publicação | O assistente pode criar efeitos colaterais | Exigir confirmação explícita do usuário nas instruções da habilidade. |
| Ferramentas de geração cara | O assistente pode aumentar o custo de uso | Descrever quando a ferramenta é permitida e como parar após a produção de saída suficiente. |

Após mudar as associações de ferramentas, teste a habilidade no gateway onde será usada e revise as Conversas para confirmar que o comportamento é o esperado.

## Habilitar habilidades em um AI Gateway

Criar uma habilidade a armazena na conta, mas o assistente só se beneficia dela quando o runtime ou AI Gateway pode usá‑la. Em uma configuração típica de gateway, habilite as habilidades relevantes no AI Gateway e teste um prompt que deveria ativar cada uma.

Quando um gateway tem habilidades disponíveis, o runtime pode expor uma função `read_skill`. O modelo chama `read_skill` com slugs de habilidade correspondentes, e as instruções da habilidade selecionada são inseridas no próximo turno de contexto dentro de blocos ativados por habilidade. Para que isso funcione de forma confiável, o modelo selecionado e o caminho do gateway devem suportar chamadas de função e instruções de sistema, a menos que seu pipeline de gateway forneça um caminho de compensação equivalente.

Para conectar uma habilidade a um gateway:

1. Abra o [AI Gateway](/docs/pt-br/platform/ai-gateways) relevante.
2. Encontre a área do gateway onde habilidades, ferramentas ou comportamento são configurados.
3. Anexe ou habilite a habilidade pelo seu slug ou nome.
4. Salve o gateway.
5. Execute um prompt que corresponda claramente à descrição da habilidade.

Para validar uma habilidade:

1. Salve a habilidade.
2. Anexe ou habilite‑a no AI Gateway relevante.
3. Faça um prompt que corresponda claramente à descrição da habilidade.
4. Faça um prompt próximo que não deveria usar a habilidade.
5. Revise a resposta quanto ao formato, escopo e uso de ferramentas.
6. Verifique [Conversations](/docs/pt-br/platform/conversations) quando precisar de evidência do comportamento do modelo, chamadas de ferramentas, uso ou erros.

Se a habilidade afeta um fluxo de trabalho de produção, valide uma habilidade por vez antes de habilitar um conjunto maior.

## Importar e exportar Habilidades

Use **Manage > Export skills** para baixar todas as habilidades da conta como JSONL. Cada linha contém uma habilidade com `slug`, `description`, `instructions` e `options`.

Use **Manage > Import skills** para enviar um arquivo `.jsonl`. Cada linha deve ser um objeto JSON com pelo menos `slug` e `instructions`.

Exemplo de linha JSONL:

```json
{"slug":"support-escalation","description":"Use when a support answer needs escalation criteria or handoff wording.","instructions":"Classify the issue, state the escalation reason, and ask for missing account or incident context before recommending a handoff."}
```

Comportamento da importação:

- Habilidades existentes são correspondidas por slug sem diferenciação de maiúsculas/minúsculas e atualizadas em vez de duplicadas.
- `instructions` são obrigatórias e substituem as instruções existentes.
- `description` é substituída pelo valor importado e pode ficar vazia se o arquivo a omitir.
- `options` são preservadas quando omitidas e substituídas quando fornecidas.
- Importações grandes podem ser limitadas; compare as contagens de importados e pulados retornadas com o número de linhas JSONL que você esperava processar.

Antes de importar sobre uma conta de produção:

1. Confirme a conta ativa.
2. Exporte as habilidades atuais e verifique o download.
3. Revise o arquivo JSONL no controle de versão ou em um processo de revisão confiável.
4. Importe primeiro um pequeno arquivo piloto, se possível.
5. Teste os AI Gateways afetados após a importação.

Uma importação JSONL pode atualizar muitas habilidades de uma vez, e instruções alteradas podem afetar qualquer gateway que use essas habilidades.

A exportação do console abre uma URL que inclui a chave de sessão atual como parâmetro de consulta `api-key`. Não compartilhe URLs de exportação, histórico do navegador, capturas de tela, logs de proxy ou URLs de requisição copiados que incluam essa string de consulta. O JSONL exportado também pode conter regras operacionais sensíveis, associações de ferramentas e configuração de fonte, portanto armazene‑o como configuração de conta e não como documentação pública.

## Excluir Habilidades

Use o menu de ação da linha para excluir uma habilidade. Use **Manage > Delete all skills** somente quando quiser remover todas as habilidades na conta ativa.

A exclusão é irreversível pelo console. Antes de excluir:

- Confirme a conta ativa.
- Exporte as habilidades atuais se precisar restaurá‑las.
- Procure AI Gateways pelo slug ou nome da habilidade, documente gateways afetados e remova ou substitua a habilidade antes de excluí‑la.
- Preserve notas de mudança fora do AIVAX se a exclusão fizer parte de um rollout controlado.

Excluir uma habilidade remove o pacote de instruções armazenado. Não reescreve automaticamente instruções do gateway, exclui conversas, desfaz usos anteriores ou remove cópias exportadas.

Excluir todas as habilidades é uma ação de conta inteira para a conta ativa. Evite usá‑la durante tráfego de produção a menos que tenha exportado um backup, verificado o seletor de conta e planejado o comportamento do gateway que deve permanecer após a remoção das habilidades.

## Solução de Problemas

| Problema | Causa provável | O que fazer |
| --- | --- | --- |
| O assistente não usa a habilidade | A habilidade não está habilitada no gateway relevante, o modelo não a selecionou ou a descrição é vaga demais | Confirme que a habilidade está anexada ao gateway, confirme que o caminho do modelo suporta chamadas de função e instruções de sistema, teste com apenas essa habilidade habilitada e então torne a descrição mais específica. |
| A habilidade errada é ativada | Descrições de habilidades se sobrepõem ou usam linguagem ampla | Reescreva as descrições como regras de roteamento distintas e reduza a sobreposição entre habilidades semelhantes. |
| Respostas ignoram as instruções da habilidade | Instruções do gateway, limitações do modelo ou outras habilidades conflitam com a habilidade | Verifique se a ativação ocorreu, teste uma habilidade por vez, simplifique as instruções e revise Conversas ou Logs para evidência. |
| Comportamento da ferramenta inesperado | Associações de ferramentas não correspondem à configuração do gateway, muitas ferramentas estão visíveis ou a habilidade não explica quando usar ferramentas | Revise tanto as opções da habilidade quanto as configurações de visibilidade de ferramentas do AI Gateway, adicione regras de uso de ferramentas às instruções e teste novamente no gateway. |
| Importação altera mais do que o esperado | Habilidades existentes foram correspondidas por slug e sobrescritas | Restaure de um export anterior se necessário, então importe um arquivo JSONL menor e revisado. |
| Exportação contém dados sensíveis | Instruções da habilidade incluem regras operacionais privadas, detalhes de clientes ou segredos | Remova conteúdo sensível das habilidades e rotacione quaisquer segredos expostos fora do AIVAX. |

## Referência de API

Use a API de Habilidades quando gerenciar habilidades a partir de uma ferramenta interna, pipeline de implantação ou fluxo de backup.

O endpoint de atualização aceita alterações parciais de habilidade e mescla superficialmente `options`. A importação JSONL tem semânticas diferentes: faz upsert por slug, substitui campos importados, preserva `options` apenas quando omitidos e substitui `options` quando fornecidos.

### Criar e gerenciar uma habilidade

Crie, inspecione, atualize ou exclua habilidades individuais.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Skills&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Update%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Importar, exportar e limpar

Use importação/exportação JSONL para migração, backups, revisão e pacotes de habilidades versionados. Use limpar somente após exportar e confirmar a conta ativa.

Exportações podem ser solicitadas com uma chave de API. Trate a URL da requisição e o JSONL baixado como configuração sensível de conta, especialmente quando incluírem instruções, associações de ferramentas ou configuração de fonte.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Skills%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Skills%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Clear%20Skills&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>