# Lote

Lote executa o mesmo fluxo de trabalho de IA sobre muitas entradas independentes. Use-o quando quiser que AIVAX classifique, extraia, enriqueça, resuma, valide ou gere saída estruturada para uma lista de registros sem manter um chat ou solicitação de inferência aberta.

A área de Lote está organizada em torno de dois objetos:

- **Workflows** são receitas de processamento reutilizáveis. Eles definem a instrução, modelo, esquema de resultado, ferramentas opcionais, validação, tentativas e tratamento de erros.
- **Jobs** são execuções concretas criadas a partir de um workflow. Eles contêm os itens importados, estado de processamento, progresso, eventos, custo, confiança, detalhes do item, tentativas, limpeza e exportações.

Para detalhes de implementação, campos de solicitação e comportamento da API, veja o [Batch developer guide](/docs/pt-br/features/batch).

## Quando usar Lote

Use Lote quando cada item puder ser processado independentemente com a mesma instrução. Bons exemplos incluem classificação de leads, marcação de tickets de suporte, extração de metadados, enriquecimento de URL ou empresa, resumo de documentos curtos, revisão de moderação, avaliação de respostas e geração de JSON para importação posterior em outro sistema.

Não use Lote para chat em tempo real, fluxos de trabalho onde cada resposta depende da resposta anterior, ou bases de conhecimento pesquisáveis. Use [Chat Clients](/docs/pt-br/platform/chat-clients) para conversas voltadas ao usuário, [AI Gateways](/docs/pt-br/platform/ai-gateways) para comportamento de inferência reutilizável, e [RAG Collections](/docs/pt-br/platform/rag-collections) quando o objetivo é indexar conhecimento para recuperação.

## Antes de começar

Prepare uma pequena amostra representativa antes de importar um arquivo grande. Lote pode consumir saldo rapidamente quando um workflow usa um modelo caro, validação, ferramentas web, geração de imagens ou muitas tentativas.

Você precisa:

- Uma conta com saldo disponível e acesso ao modelo ou AI Gateway que pretende usar.
- Uma instrução clara que se aplique a cada item.
- Um esquema de resultado caso a saída alimente uma planilha, banco de dados, automação ou fila de revisão.
- Uma decisão sobre se a validação vale uma segunda passagem de modelo.
- Dados de entrada que sejam seguros para processar com o modelo e ferramentas selecionados.

Evite importar segredos, credenciais, dados pessoais regulados ou dados de cliente que sua conta não tem permissão para processar. As exportações incluem entrada original, saída gerada, metadados, confiança, resultado de validação e campos de temporização, portanto trate o JSONL exportado como dados operacionais sensíveis.

## Teste com uma pequena amostra primeiro

Antes de executar uma carga real, crie um job piloto com 5 a 20 itens representativos. Inicie o job, então inspecione os **Insights**, **Processing list**, detalhes do **View**, confiança, resultado de validação, custo e formato do JSONL exportado.

Use o piloto para responder às seguintes questões:

- A instrução produz a decisão ou extração correta para entradas normais, de borda e de baixa qualidade?
- O esquema de resultado contém os campos que seu processo downstream espera?
- Falhas de validação são úteis ou estão rejeitando resultados aceitáveis?
- A distribuição de confiança é boa o suficiente para seu processo de revisão?
- O custo por item é aceitável antes de multiplicá‑lo pelo conjunto de dados completo?

Ajuste o workflow antes de criar o job de produção. Para cargas importantes, mantenha os jobs piloto e de produção separados para que a exportação de produção contenha apenas os registros desejados.

## Entenda a página de Lote

Abra **Lote** na barra lateral do console.

A aba **Workflows** lista workflows reutilizáveis com seu ID, hora de criação, título, modelo, contagem de jobs e ações. A partir dessa tabela você pode criar um workflow, criar um job a partir de um workflow existente, editar o workflow ou excluí‑lo.

A aba **Jobs** lista jobs recentes entre workflows. Use‑a quando quiser monitorar ou retornar a uma execução de processamento sem abrir primeiro o workflow pai. A lista mostra o ID do job, nome, estado, progresso, tempo de execução, contagem de eventos e uma ação **Manage**.

## Crie um workflow

Crie um workflow quando quiser salvar uma regra de processamento repetível. O workflow deve ler como uma política para cada item, não como um prompt de uso único.

Em **Workflows**, selecione **Create workflow**. Configure as abas:

| Aba | O que configurar | Orientação |
| --- | --- | --- |
| **Basic** | Título do workflow, instruções do workflow, esquema de resultado | Use o título para operadores. Coloque as regras da tarefa na instrução. Use um JSON Schema quando sistemas downstream esperam campos estáveis. |
| **Model** | Modelo, esforço de raciocínio, ferramentas habilitadas, opções de ferramentas | Escolha um modelo que se ajuste ao trade‑off de qualidade, velocidade e custo. Habilite ferramentas somente quando cada item realmente precisar delas. |
| **Validation** | Habilitar validação e instruções de validação | Habilite quando os resultados precisarem de uma verificação adicional de modelo contra regras de negócio, regras de segurança ou qualidade de saída. |
| **Handling** | Limiar de parada de erro e máximo de tentativas por item | Use um limiar baixo durante testes para que um prompt ou esquema ruim pause cedo. Aumente apenas depois que o workflow for comprovado. |

O novo rascunho de workflow começa com uma instrução vazia, um esquema de objeto permissivo, sem ferramentas, validação desativada, limiar de parada de erro de `5` e máximo de tentativas de `2`. Workflows salvos exigem uma instrução não vazia, um objeto de esquema de resultado e um modelo ou AI Gateway disponível. A API aceita `errorStopThreshold` de `1` a `100` e `maxRetries` de `0` a `10`.

Use **Edit with AI** para ajudar a refinar a instrução, esquema e instrução de validação. Revise o diff antes de aceitá‑lo, especialmente se o workflow lidar com decisões reguladas ou de alto impacto.

## Habilite ferramentas com segurança

Ferramentas habilitadas ficam disponíveis ao modelo para cada item processado. Elas podem melhorar resultados, mas também podem aumentar custos, expor conteúdo do item a caminhos de recuperação externos, criar efeitos colaterais persistentes ou dificultar a reprodução das execuções.

| Ferramenta | Quando usar | Orientação de segurança |
| --- | --- | --- |
| **Open URLs** | Cada item inclui uma URL que deve ser lida diretamente | Importe apenas URLs que a conta tem permissão para processar. Espere falhas para páginas bloqueadas, privadas ou instáveis. |
| **Web search** | O modelo precisa de informações públicas atuais | A busca pode adicionar latência e custo. Não dependa dela para fatos privados ou registros que devem permanecer internos. |
| **X posts search** | Posts públicos do X fazem parte da evidência | Trate resultados sociais como barulhentos e sensíveis ao tempo. Valide saídas antes de agir sobre elas. |
| **Advanced web usage** | Uma tarefa requer comportamento de navegação mais profunda | Use somente para workflows onde a interação com página externa é necessária. Teste com um job pequeno porque falhas podem ser específicas do site. |
| **Code execution** | Cada item precisa de computação ou parsing que o modelo pode expressar como código | Não alimente segredos ou instruções de código não confiáveis. Revise as saídas cuidadosamente antes de usá‑las em automações. |
| **Image generation** | O resultado esperado inclui imagens geradas | Isso pode aumentar materialmente o custo e gerar conteúdo que precisa de revisão humana antes da publicação. |
| **Memory** | O workflow intencionalmente precisa de contexto lembrado | Evite usá‑lo para jobs isolados e auditáveis onde cada item deve ser processado apenas a partir de sua entrada e instrução do workflow. |

Se um resultado incluir contexto externo ou lembrado inesperado, pause o job, desative a ferramenta relacionada, revise a instrução e teste com um novo job piloto.

## Use a validação com cuidado

A validação executa uma segunda passagem de modelo para checar a saída. É útil quando o resultado deve seguir regras de negócio, requisitos de segurança ou um esquema rígido antes de ser confiável downstream.

Escreva instruções de validação como checagens concretas. Por exemplo, peça ao validador para confirmar que campos obrigatórios estão presentes, que a justificativa cita evidência da entrada, ou que o rótulo escolhido pertence a uma lista permitida. Evite instruções vagas como “garanta que a resposta seja boa”; elas podem gerar resultados inconsistentes de `ValidationError`.

A validação pode adicionar custo e transformar saídas geradas em itens falhados. Quando erros de validação aparecerem, abra detalhes do item e revise o motivo antes de tentar novamente. Se o motivo indicar um problema de prompt ou esquema, corrija o workflow e execute um job piloto em vez de tentar novamente toda a carga.

## Crie um job

Crie um job quando tiver uma carga concreta para processar através de um workflow. A partir de uma linha de workflow, abra o menu de ações e selecione **Create job**. Dê ao job um nome que descreva o conjunto de dados, período, cliente ou rodada de revisão.

Novos jobs são criados pausados. Isso é intencional: importe e inspecione a lista de itens antes de iniciar o processamento.

## Importe itens

Abra o job e vá para **Processing list**. Use **Insert data** para adicionar itens.

| Modo | Quando usar | O que se torna um item |
| --- | --- | --- |
| **From text file** | Você já tem um arquivo com muitos registros | Cada linha não vazia |
| **From files** | Cada arquivo fonte é um registro | Cada arquivo de texto simples enviado |
| **From zip** | Você quer enviar muitos arquivos de texto juntos | Cada entrada de ZIP de texto simples |
| **Type text** | Você quer adicionar um item de teste manual | O campo de texto enviado |

Para entradas estruturadas baseadas em linhas, JSONL costuma ser o formato mais seguro: um objeto JSON compacto por linha. A instrução do workflow deve explicar como interpretar cada objeto.

Exemplo JSONL:

```jsonl
{"company":"Northwind Parts","description":"Regional distributor of industrial replacement parts"}
{"company":"Contoso Legal","description":"Law firm focused on employment contracts"}
```

Inclua apenas os campos que o workflow necessita. Identificadores extras, dados pessoais ou notas internas podem aparecer depois nas exportações.

Para importações `files` e `zip`, os limites atuais são 1.000 arquivos ou entradas ZIP por solicitação, 10 MB por arquivo ou entrada ZIP, e 100 MB de conteúdo importado total por solicitação. Importações ZIP também verificam comportamento de compressão inválido. No modo `lines`, AIVAX importa cada linha não vazia do arquivo enviado; linhas vazias são ignoradas.

## Inicie, pause e finalize

Use **Start job** somente depois que os itens importados parecerem corretos. Iniciar um job o move para `Active` e permite que os trabalhadores processem itens pendentes. O processamento pode gerar custos de modelo, validação e ferramentas.

Use **Pause job** quando precisar parar o novo processamento enquanto investiga erros, revisa custos, altera temporização operacional ou aguarda mais saldo. Um item em execução pode terminar mesmo após um pedido de pausa; pausar interrompe novos processamentos mas não interrompe uma inferência já em execução.

Jobs finalizam automaticamente quando todos os itens são processados. O console expõe principalmente controles de iniciar e pausar. Use a API para definir um job como `Finished` somente quando uma automação deve encerrar a execução ao invés de deixá‑lo retomável.

## Monitore um job

A página do job tem três abas principais:

- **Insights** mostra progresso, conclusão, taxa de sucesso, taxa de recusa, confiança média, custo cobrado, custo previsto, tempo decorrido, ETA e últimos itens processados.
- **Processing list** mostra cada item listado com estado, prioridade, pré‑visualização da entrada, confiança, custo, filtros, tentativas, ações de remoção e detalhes do item.
- **Events** mostra histórico operacional como criação de job, início, pausa, finalização e mudanças automáticas de estado.

Abra **View** em um item para inspecionar metadados, conteúdo da entrada, saída, custo, confiança, status de validação e motivo da validação. Use isso antes de mudar prompts, tentar novamente itens ou confiar em saída de baixa confiança.

## Trabalhe com estados de item e confiança

Itens podem ser:

- `Pending`: aguardando processamento.
- `Finished`: processado com sucesso.
- `Refused`: o modelo recusou o item.
- `ExecutionError`: inferência ou execução falhou.
- `ValidationError`: a resposta não passou no esquema ou validação.
- `Cancelled`: um possível estado terminal retornado pelo sistema.

A lista de Processamento pode filtrar por estado, alta confiança e baixa confiança. Alta confiança significa ao menos 80 %. Baixa confiança significa abaixo de 30 %. Baixa confiança não é automaticamente falha, mas é um forte sinal para revisão manual ou nova tentativa.

A prioridade do item afeta a ordem de processamento junto com a prioridade do plano da conta e a ordem de inserção. Itens pendentes, não em execução, podem ser movidos para cima, para baixo ou removidos da lista de processamento com **Cancel**. A ação atual de cancelamento é destrutiva para aquele item e não interrompe uma inferência já em execução, portanto exporte tudo que precisar primeiro.

## Tente novamente com segurança

Use **Retry** depois de entender o padrão de falha.

Opções de tentativa:

- **All failed**
- **Low confidence**
- **Execution error**
- **Validation error**

Retry move os itens não em execução correspondentes de volta para `Pending`. Se ao menos um item for tentado novamente e o job ainda não estiver ativo, AIVAX inicia o job automaticamente. Isso pode gerar novo custo, então verifique a instrução, esquema, regra de validação e modelo antes de tentar novamente muitos itens.

## Remova ou exclua dados

Use **Remove** na lista de Processamento para remover grupos de itens não em execução:

- Itens pendentes
- Itens bem‑sucedidos
- Itens falhados
- Todos os itens não em execução

A remoção é destrutiva para os itens selecionados. Exporte tudo que precisar antes de removê‑los.

Excluir um job exclui o job e todos os seus itens. Excluir um workflow exclui o workflow, todos os seus jobs e todo item enfileirado ou processado sob esses jobs. Use exclusão apenas após atender a requisitos de exportação e auditoria.

## Exporte resultados

Use **Export** na página do job para baixar itens processados como JSONL.

Exportações disponíveis:

- Successful
- High confidence
- Low confidence
- Failed
- All processed

O console também inclui **Copy line schema** como auxiliar de área de transferência. Ele copia o JSON Schema para linhas JSONL exportadas, incluindo metadados, entrada, saída, confiança e campos de validação; não é um modo de exportação JSONL separado.

Itens pendentes não são exportados. Cada linha exportada contém metadados, entrada original, saída, confiança e resultado de validação. Mantenha as exportações em local seguro e evite compartilhá‑las em tickets de suporte a menos que campos sensíveis sejam removidos.

O download de exportação do console abre uma URL que inclui a chave de sessão atual como parâmetro de consulta `api-key`. Não compartilhe URLs de exportação, histórico do navegador, logs de proxy, capturas de tela ou URLs de requisição copiados que incluam essa string de consulta. Masacente os parâmetros de consulta antes de solucionar problemas com outra pessoa.

Use exportações separadas quando seu processo de revisão diferir por resultado. Por exemplo, exporte itens de alta confiança bem‑sucedidos para importação downstream, depois exporte itens de baixa confiança ou falhados para revisão humana.

## Solução de problemas

| Problema | Causa provável | O que fazer |
| --- | --- | --- |
| O job não processa itens | O job está pausado, finalizado, sem saldo, bloqueado por limites ou não tem itens pendentes | Verifique o estado do job, saldo, contagem pendente e eventos. Inicie ou retome apenas após a lista de itens estar correta. |
| Muitas falhas de validação | O esquema é muito rígido, a instrução é ambígua ou regras de validação conflitam com o esquema de resultado | Abra detalhes do item, compare a saída com o esquema, ajuste o workflow e tente novamente um pequeno subconjunto. |
| Muitas falhas de execução | Falhas no provedor, modelo, ferramenta ou requisição | Verifique eventos e detalhes do item. Re‑tente falhas de execução após confirmar que modelo e ferramentas estão disponíveis. |
| Confiança baixa | O item carece de evidência suficiente, a instrução é pouco especificada ou o modelo está incerto | Revise amostras de saída, melhore a instrução ou formato de entrada e re‑tente itens de baixa confiança separadamente. |
| Itens importados parecem errados | O arquivo fonte não tinha um registro por linha, entradas ZIP não eram texto simples ou campos desnecessários foram incluídos | Pause o job antes de processar. Remova itens não em execução, corrija o formato de importação e execute novamente um job piloto. |
| Workflow baseado em ferramenta falha | A ferramenta selecionada não consegue acessar a URL, fonte de busca, página, caminho de código ou requisito de mídia gerada | Abra detalhes do item e eventos, teste com menos itens e desative ferramentas que não são necessárias para a tarefa. |
| Resultados incluem contexto externo ou lembrado inesperado | Uma ferramenta web ou de memória adicionou contexto não intencionado para esta execução isolada | Pause o job, desative a ferramenta relacionada, revise a instrução e crie um novo job piloto. |
| Exportação está faltando registros | Itens pendentes não são exportados ou o filtro de exportação os exclui | Verifique os filtros da lista de Processamento e use **All processed** quando precisar de todos os resultados processados. |
| Custo maior que o esperado | Modelo, passagem de validação, ferramentas, tentativas ou contagem de itens aumentaram o uso | Pause o job, inspecione custo e custo previsto, reduza ferramentas ou validação se adequado e teste com uma amostra menor. |

## Referência da API

Use a API quando Lote fizer parte de um pipeline interno de dados ou automação. A API segue o mesmo fluxo do console: crie um workflow, crie um job pausado, importe itens, inicie o job, monitore itens, re‑tente ou remova registros selecionados e exporte resultados processados.

Ao usar exportações via API, proteja credenciais da mesma forma que protege chaves de API. Não cole URLs de exportação com parâmetros de consulta `api-key` em tickets, mensagens de chat, logs ou capturas de tela.

### Workflows

Crie e mantenha receitas de processamento reutilizáveis.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Workflows&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Jobs

Crie, inicie, pause, monitore e exclua execuções de processamento concretas.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Account%20Batch%20Jobs&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Jobs&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Items and export

Importe itens de carga, inspecione saídas individuais, re‑tente ou limpe grupos e exporte JSONL processado.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Batch%20Job%20Item&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>