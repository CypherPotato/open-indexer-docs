# Coleções RAG

Use **RAG Collections** para armazenar conhecimento pesquisável que AI Gateways, clientes MCP e chamadas diretas de API RAG podem recuperar posteriormente. Uma coleção é o limite de uma base de conhecimento: ela agrupa documentos, estado de indexação, contexto, tags, testes de busca e histórico de recuperação em um único lugar.

Esta página é para construtores e operadores que gerenciam bases de conhecimento pelo console AIVAX. Para esquemas de API, formato de importação JSONL e comportamento de recuperação mais profundo, veja [Collections and Documents](/docs/pt-br/rag/collections) e [Semantic search](/docs/pt-br/rag/semantic-search).

## Antes de começar

Faça login no [AIVAX console](https://console.aivax.net/) e abra **Dashboard > RAG Collections**. Confirme a conta ativa antes de importar, redefinir, excluir ou reindexar uma coleção.

Antes de mudar uma coleção de produção, identifique:

- Quais AI Gateways, clientes de chat, fluxos de lote, clientes MCP ou aplicações o utilizam.
- Se a mudança afeta documentos fonte, apenas metadados ou vetores gerados.
- Se os usuários estão consultando a coleção no momento.
- Se você precisa de uma exportação JSONL antes de fazer a mudança.
- Se a operação de importação ou reindexação pode gerar custo de indexação.

## Quando usar uma coleção

Use uma coleção quando um assistente ou aplicação precisar de respostas fundamentadas em conhecimento de propriedade da conta, como manuais de produto, políticas, artigos de suporte, cláusulas contratuais, itens de catálogo, procedimentos operacionais ou informações específicas de locatário.

Uma coleção é útil quando o conhecimento deve ser:

- Pesquisável por significado semântico, não apenas por palavras‑chave exatas.
- Reutilizada por mais de um gateway ou integração.
- Mantida separadamente das instruções do gateway.
- Exportada, auditada, reimportada ou testada diretamente.
- Observada por meio de pontuações de recuperação e histórico de transações.

Não coloque todas as fontes em uma única coleção grande por padrão. Prefira coleções separadas quando o conhecimento tem diferentes proprietários, ciclos de vida, idiomas, regras de acesso, ambientes ou expectativas de qualidade.

## Entenda a lista de coleções

A página RAG Collections mostra as coleções pertencentes à conta ativa.

| Coluna ou controle | Uso |
| --- | --- |
| **New collection** | Crie uma coleção vazia antes de adicionar documentos. |
| **Filter columns...** | Pesquise coleções pelo texto visível da tabela. |
| **Id.** | Forma curta de exibição do ID da coleção. Copie o ID completo ao integrar via API ou MCP. |
| **Name** | Nome amigável da coleção exibido no console. |
| **Created at** | Data e hora de criação. |
| **Current state** | Contagens de documentos indexados, em fila e desatualizados como uma barra de status segmentada. |
| **View** | Abra os detalhes da coleção, documentos, transações e configurações. |

Crie uma coleção com um nome que identifique seu propósito e ambiente, como `Help Center - Production` ou `Legal Policies - Internal`. O console requer um nome com pelo menos três caracteres.

## Criar uma coleção

1. Selecione **New collection**.
2. Insira um nome de coleção orientado ao propósito.
3. Confirme o diálogo.
4. Abra a nova coleção com **View**.

Confirme que a nova coleção aparece sob a conta ativa esperada e começa com o estado de documento esperado. Para bases de conhecimento de produção, considere criar coleções de staging e produção separadas para que você possa testar importações, fragmentação e qualidade de recuperação antes de mudar a coleção que os gateways ao usam.

## Navegar pelos documentos

Abra **View** em uma coleção para acessar o espaço de trabalho da coleção. A guia **Browse documents** é a principal superfície de manutenção.

Os cartões de resumo mostram:

| Cartão | Significado |
| --- | --- |
| **Total documents** | Número de documentos atualmente armazenados na coleção. |
| **Query coverage** | Porção das transações RAG registradas que retornaram documentos. Use como um sinal de qualidade, não como garantia completa de relevância. |
| **Avg. Performance** | Tempo médio de processamento de recuperação das transações RAG registradas. |
| **Avg. Score** | Pontuação média das transações RAG registradas. |

A tabela de documentos mostra o ID curto de cada documento, hora de atualização, nome, ID de referência, tags, pré‑visualização de conteúdo, estado de indexação e ações. Use a caixa de pesquisa para nome, ID ou texto do conteúdo. Use **Filter state** para focar em todos, indexados ou em fila. Use **Order by** para ordenar por hora de criação, atualização ou indexação em qualquer direção.

Use esta guia após importações para confirmar que os documentos chegaram, passaram de fila para indexados e parecem fragmentos focados em vez de arquivos fonte inteiros colados em um único documento.

## Adicionar ou editar documentos

Selecione **New document** para criar um documento manualmente, ou **Edit** em uma linha existente para atualizar um documento.

O editor de documentos tem:

| Campo ou controle | Uso |
| --- | --- |
| **Document name** | Nome estável usado para identificar este documento em atualizações posteriores. |
| **Tags** | Rótulos de manutenção para filtragem e organização. |
| **Reference ID** | Identificador compartilhado para fragmentos relacionados da mesma fonte. |
| **Split multiple sections** | Na criação do documento, dividir texto separado por `---` em múltiplos documentos. |
| **Document contents** | O texto que será indexado e recuperado. |
| **Document information** | Contagem aproximada de tokens, custo estimado de indexação, contagem de palavras, caracteres e se. |
| **Edit with AI** | Peça ao AIVAX para propor uma edição ao texto do documento antes de salvar. |

Escreva documentos como fragmentos focados e auto‑contenidos. Um documento recuperado deve conter contexto suficiente para que o modelo o use sem adivinhar o que veio antes ou depois. Se você colar uma página de manual longa, divida-a em seções de tamanho de tópico primeiro. Se editar um documento existente que contém separadores de seção, o console avisa que salvar não o dividirá em múltiplos documentos.

O texto alterado do documento é enfileirado para indexação. Manutenção apenas de metadados pode evitar reindexação desnecessária quando feita via API. Para o comportamento exato de upsert e nomes de campos JSONL, veja [Document fields](/docs/pt-br/rag/collections#document-fields).

## Importar documentos

Use **Options** no espaço de trabalho da coleção quando precisar importar ou exportar dados.

| Ação | Uso |
| --- | --- |
| **Import from files** | Envie imagens, áudio, vídeo ou arquivos PDF para que o AIVAX extraia documentos com um algoritmo de OCR/extrção baseado em LLM. |
| **Import from JSONL** | Envie documentos de texto preparados onde cada linha é um objeto JSON. |
| **Export to JSONL** | Baixe documentos da coleção para backup, migração, revisão ou processamento offline. Trate exportações como dados operacionais sensíveis. |
| **View MCP code** | Configure a coleção como fonte MCP através do endpoint de coleções MCP. |

Escolha **Import from JSONL** quando sua aplicação ou pipeline de pré‑processamento já preparou fragmentos limpos. O diálogo de importação do console aceita um arquivo `.jsonl`, explica que documentos existentes inalterados são ignorados e informa um limite de 10 000 documentos e 50 MB por arquivo. Limites de plano e API ainda podem ser aplicados; veja [Batch import limits](/docs/pt-br/rag/collections#batch-import-limits).

Uma importação JSONL é um upsert. Se `docid` corresponder a um documento existente e `text` mudar, o AIVAX atualiza esse documento e o enfileira para reindexação. Exporte primeiro, teste em uma coleção não‑produção quando possível e verifique colisões de `docid` antes de importar para produção.

Escolha **Import from files** quando precisar que o AIVAX extraia texto de mídia fonte. O diálogo aceita imagens, áudio, vídeo e arquivos PDF, pede um algoritmo de extração e inclui um campo **Context** para orientar a extração. Use o campo de contexto para descrever o que a fonte contém e o que deve ser preservado, não para adicionar instruções não relacionadas.

Faça upload apenas de arquivos que você tem permissão para processar com o AIVAX. O texto extraído torna‑se conteúdo da coleção e pode ser recuperado posteriormente por gateways, clientes MCP ou chamadas de API que usem a coleção.

> [!WARNING]
> As importações e atualizações de vetores podem consumir créditos. Exporte a coleção primeiro quando precisar de uma cópia de reversão e teste importações em uma coleção não‑produção quando o formato da fonte ou a estratégia de fragmentação for nova.

Trate a exportação JSONL da coleção como dados sensíveis: pode conter texto fonte, dados de clientes, procedimentos internos, tags, referências e IDs de documentos. Armazene-a de forma segura e remova informações confidenciais antes de compartilhar fora da equipe que possui a base de conhecimento.

## Usar o playground

Selecione **Playground** no espaço de trabalho da coleção para testar a recuperação antes de anexar a coleção a um gateway de produção.

O playground permite configurar:

| Configuração | Uso |
| --- | --- |
| **Search text** | A consulta que você deseja testar. Use linguagem realista do usuário. |
| **Minimum score** | Menor pontuação aceita para documentos retornados. Valores mais altos reduzem ruído, mas podem ocultar resultados úteis. |
| **Maximum results** | Número de documentos a retornar. Mais resultados podem melhorar a cobertura, mas aumentam o tamanho do contexto. |
| **Reranker** | `none`, `lexical` ou `smart`. Lexical é um reranker sensível a palavras sem custo; smart usa um modelo especializado de reranking e tem preço separado. |
| **Endpoint** | `/query` retorna documentos correspondentes; `/answer` pede ao modelo que responda usando documentos recuperados. |
| **Include chunked references** | Inclui fragmentos relacionados que compartilham referências quando habilitado. |

Use o playground como um portão de qualidade:

1. Teste perguntas comuns de usuários.
2. Confirme que os documentos retornados são relevantes e específicos.
3. Compare `/query` e `/answer` quando precisar tanto da inspeção da fonte quanto do comportamento de resposta.
4. Ajuste pontuação, número de resultados, reranker, fragmentação de documentos ou contexto da coleção.
5. Anexe a coleção a um [AI Gateway](ai-gateways.md) somente depois que a recuperação for consistente.

A ação **View code** gera um exemplo rápido para o endpoint de playground selecionado. Use a referência de API abaixo como fonte canônica de integração, substitua marcadores de posição e mantenha as chaves de API em variáveis de ambiente antes de compartilhar ou confirmar exemplos.

## Configurar configurações da coleção

Abra **Settings** para gerenciar metadados ao nível da coleção.

| Configuração | Uso |
| --- | --- |
| **Collection Name** | Nome amigável usado no console e na conscientização da coleção voltada ao modelo. |
| **Collection Context** | Uma dica que descreve o que a coleção contém para que modelos e operadores entendam seu propósito. |
| **Generate context from documents** | Peça ao AIVAX para propor contexto e tags da coleção a partir de documentos existentes. Isso pode consumir créditos e analisar o conteúdo armazenado dos documentos. Revise o diff proposto em busca de segredos, dados privados e instruções não intencionais voltadas ao modelo antes de salvar. |
| **Collection Tags** | Tags que categorizam a coleção como um todo. |
| **Save changes** | Persistir nome, contexto e tags editados. |

Um bom contexto de coleção informa ao modelo do que a coleção trata e quais tipos de respostas pode suportar. Mantenha‑o factual e conciso. Não coloque segredos, dados privados de clientes, credenciais ou instruções operacionais ocultas no contexto da coleção.

## Usar configurações avançadas com segurança

O menu **Advanced settings** contém ações de manutenção de alto impacto.

| Ação | Efeito | Uso quando |
| --- | --- | --- |
| **Update outdated documents** | Marcar vetores desatualizados para que o trabalho de indexação reconstrua embeddings. O console avisa que isso pode gerar custo. | Quando o comportamento de embedding mudou, documentos mostram estado desatualizado ou a qualidade da recuperação depende de vetores atualizados. |
| **Reset collection** | Exclui todos os documentos pendentes e indexados, mas mantém o registro e a configuração da coleção. | Quando você quer manter a estrutura da coleção mas reconstruir seu conteúdo do zero. |
| **Delete collection** | Exclui a coleção e todos os documentos. Isso não pode ser desfeito pelo console. | Quando a coleção não é mais usada por nenhum gateway, cliente, fluxo de trabalho ou aplicação. |

Antes de redefinir ou excluir:

1. Exporte a coleção para JSONL se precisar dos documentos mais tarde.
2. Verifique AI Gateways e integrações que referenciam a coleção.
3. Confirme que nenhum tráfego de produção depende dela.
4. Prefira testar coleções de substituição antes de mudar coleções de produção.
5. Após a mudança, verifique o comportamento do gateway e as transações da coleção.

## Revisar transações RAG

Use a guia **Transactions** para entender como a coleção está realmente sendo pesquisada.

A guia inclui:

| Controle ou coluna | Significado |
| --- | --- |
| **View** | Alternar entre as visualizações de transação `Recent`, `Low quality` e `High quality`. |
| **Refresh** | Recarregar a visualização de transação selecionada. |
| **Export JSONL** | Baixar a visualização de transação selecionada para revisão offline. |
| **ID** | Identificador da transação. |
| **Moment** | Quando a recuperação ocorreu. |
| **Original score** | Pontuação inicial de recuperação antes do reranking. |
| **Reranker score** | Pontuação atribuída pelo reranker quando usado. |
| **Query** | Consulta de busca registrada para a transação. |
| **Results** | Número de documentos retornados. |
| **Details** | Abre detalhes de tempo, custo, pontuação, reranker e documentos correspondentes. |

Use **Low quality** para encontrar consultas que precisam de documentos melhores, limites de pontuação mais baixos, fragmentação diferente, contexto de coleção mais claro ou um reranker diferente. Use **High quality** para identificar exemplos que valem ser reutilizados como testes de regressão. A visibilidade das transações está sujeita à retenção do plano da conta; revise [Plans and limits](/docs/pt-br/limits) ao planejar monitoramento ou frequência de exportação.

O diálogo de detalhes pode mostrar ID da requisição, texto da consulta, tempo de processamento, custo, pontuação original, pontuação do reranker, pontuação final, nome do reranker, IDs de documentos correspondentes, nomes de documentos, pontuações e pré‑visualizações de conteúdo. Trate as transações exportadas como dados operacionais: remova texto de usuário, dados de clientes e identificadores internos antes de compartilhar fora da sua equipe.

## Usar coleções via MCP

A ação **View MCP code** gera uma configuração MCP para consultar a coleção através de `/v1/mcp/collections`. A configuração gerada inclui cabeçalhos da coleção como ID, nome, top‑k, pontuação mínima e comportamento de referência.

Trechos de código MCP gerados podem incluir a chave de sessão atual do console no cabeçalho `Authorization`. Substitua‑a por `YOUR_AIVAX_API_KEY` ou uma variável de ambiente antes de compartilhar, salvar ou confirmar a configuração. Não compartilhe URLs ou trechos de console que incluam valores de `api-key` ou `Authorization`. Se uma chave real, URL contendo sessão ou trecho contendo sessão foi exposto, gire ou revogue a credencial afetada.

Mantenha o acesso MCP somente leitura por padrão. Não habilite acesso de gravação da coleção para assistentes gerais ou clientes não confiáveis. Ferramentas MCP com gravação podem criar, atualizar ou excluir documentos da coleção. Use uma credencial dedicada com o acesso mínimo necessário e gire‑a se for exposta.

## Solução de problemas

| Sintoma | Verificação | Correção |
| --- | --- | --- |
| A coleção não aparece na lista | Conta ativa, alternador de contas e limite de coleções para o plano atual. | Mude para a conta esperada ou crie a coleção na conta correta. |
| Documentos permanecem na fila | Volume de indexação, saldo da conta, limites diários de inserção RAG, tamanho do documento e tempo de processamento em segundo plano. | Aguarde a indexação, reduza o tamanho da importação, aumente o saldo ou divida as importações em lotes menores. |
| A busca não retorna documentos | Formulação da consulta, estado de indexação, pontuação mínima, ID da coleção e se a coleção correta está selecionada. | Diminua temporariamente a pontuação mínima, teste uma formulação mais ampla, confirme que os documentos estão indexados e inspecione o conteúdo dos documentos. |
| A busca retorna documentos irrelevantes | Tamanho dos fragmentos, contexto do documento, tags, referências, reranker, limite de pontuação e estratégia de consulta no gateway. | Divida documentos amplos, melhore o texto fonte, teste reranking lexical ou smart e aumente deliberadamente a pontuação mínima. |
| A resposta do gateway ignora a coleção | Aba RAG do gateway, IDs de coleções anexadas, estratégia de consulta, máximo de resultados, pontuação mínima e instruções de prompt. | Teste a coleção diretamente no playground, depois teste novamente o mesmo prompt através do gateway. |
| Importação ignora registros | Nomes de documentos existentes com conteúdo inalterado, formato JSONL, campos obrigatórios ausentes ou limites de tamanho/linhas do arquivo. | Valide o arquivo JSONL, altere o texto do documento quando a reindexação for desejada e divida arquivos grandes. |
| Redefinição foi feita por engano | Se existe uma exportação JSONL e se os gateways ainda referenciam a mesma coleção. | Reimporte a exportação mais recente na mesma coleção, aguarde a indexação e teste novamente os gateways afetados. |
| Coleção foi excluída por engano | Se existe uma exportação JSONL e quais gateways, clientes MCP ou chamadores de API referenciaram o ID da coleção excluída. | Recrie a coleção, reimporte a exportação mais recente, aguarde a indexação e atualize todas as integrações que usavam o antigo ID da coleção. |
| Cliente MCP não pode consultar a coleção | Chave de API, cabeçalhos gerados, ID da coleção, pontuação mínima, top‑k e comportamento de referência. | Substitua credenciais de sessão por uma chave de API privada, verifique os cabeçalhos e teste a mesma consulta no playground do console. |

## Referência da API

Crie, inspecione, edite, exporte, redefina, exclua e reindexe coleções através da Collections API:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collections&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Collection%20Details&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Reset%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Update%20Collection%20Vectors&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Revise a atividade de transações RAG através dos endpoints de transação da coleção:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Collection%20RAG%20Transaction&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Gerencie documentos da coleção através da Documents API:

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Teste a recuperação através da RAG API:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Answer%20generation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Documentação relacionada:

- [Collections and Documents](/docs/pt-br/rag/collections): comportamento técnico de coleção e documento.
- [Semantic search](/docs/pt-br/rag/semantic-search): parâmetros de consulta, reranking, referências e geração de respostas.
- [AI Gateways](ai-gateways.md): anexe coleções a configurações de assistente.
- [Account, balance, and multiple accounts](account-balance.md): gerencie saldo, limites e chaves de API.