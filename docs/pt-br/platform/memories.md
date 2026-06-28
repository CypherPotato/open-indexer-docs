# Memórias

Memórias são fatos persistentes específicos do usuário que a AIVAX pode transportar entre conversas quando um gateway ou cliente de chat usa ferramentas conscientes de memória. Use a página **Memórias** para inspecionar o que a plataforma armazenou para um usuário externo, verificar se uma memória é compartilhada ou com escopo de gateway, e excluir memórias que já não são apropriadas.

Memórias não são uma base de conhecimento. Use [RAG Collections](/docs/pt-br/platform/rag-collections) para manuais de produtos, políticas, documentos e outros materiais fonte que devem ser pesquisados como conhecimento. Use Memórias para pequenos trechos de contexto do usuário, como preferências, notas de continuidade ou lembretes vinculados a um usuário identificado.

## Quando usar Memórias

Abra **Memórias** quando precisar:

- Revisar o que um assistente lembrou para um usuário.
- Verificar se uma memória pertence a todos os gateways ou a um gateway específico.
- Encontrar memórias por ID, conteúdo, ID de usuário externo, formato ou gateway.
- Remover uma memória incorreta.
- Remover todas as memórias de um formato para um usuário.
- Preparar um prompt de migração para um usuário antes de mover seu contexto armazenado.

Use [Conversations](/docs/pt-br/platform/conversations) quando precisar entender como uma memória foi criada durante uma conversa específica. Use [Chat Clients](/docs/pt-br/platform/chat-clients) quando precisar verificar se sessões estão usando um `tag` estável, pois a memória depende de uma referência de usuário identificável.

## Antes de começar

Memórias são limitadas à conta e visíveis para usuários autenticados do console que podem acessar a conta ativa. Como detalhes de memória e prompts de migração podem expor contexto específico do usuário, limite o acesso operacional às pessoas autorizadas a revisar, migrar ou excluir dados de usuário dessa conta.

A memória depende de três condições:

- O assistente deve ser executado em um contexto com um usuário identificável, como um `tag` de sessão de cliente de chat ou um valor `user` em uma requisição de conclusão de chat.
- O AI Gateway ou runtime relevante deve ter a ferramenta de Memória habilitada quando precisar salvar, pesquisar, atualizar ou remover memórias de texto.
- Lembretes baseados em data são armazenados através da ferramenta Calendar e aparecem em Memórias com o formato `DateReminder`.

Sem uma referência de usuário, as ferramentas de memória não podem armazenar ou pesquisar informações específicas do usuário. A AIVAX instrui o modelo a não salvar dados sensíveis ou pessoais, mas o comportamento do modelo não é um limite de conformidade. Projete as instruções do seu gateway e o processo de revisão para que o assistente não armazene segredos, dados de pagamento, credenciais, detalhes médicos ou informações pessoais desnecessárias.

Antes de visualizar detalhes, gerar um prompt de migração ou excluir registros, confirme a conta ativa, o ID de usuário externo, o formato e a origem do gateway. Se a ação fizer parte de um processo de privacidade, conformidade ou suporte, confirme que seu sistema de destino está aprovado para esses dados.

## Entender a página de Memórias

Abra **Memórias** a partir da barra lateral do console.

Os filtros superiores controlam a lista:

| Filtro | O que faz |
| --- | --- |
| **Search** | Pesquisa ID da memória, conteúdo e ID de usuário externo. O console aguarda brevemente enquanto você digita antes de atualizar. |
| **Format** | Filtra por `Text`, `DateReminder` ou todos os formatos. |
| **Gateway** | Mostra todos os gateways, apenas memórias sem link de gateway, ou memórias vinculadas a um gateway selecionado. |
| **Refresh** | Recarrega a lista atual usando os filtros selecionados. |

A tabela **Persisted memories** mostra:

| Coluna | Significado |
| --- | --- |
| **ID** | O identificador da memória. A tabela mostra um rótulo de ID curto copiável, enquanto o valor copiado é o ID completo. |
| **External user ID** | A referência de usuário que possui a memória. Normalmente vem do `tag` da sessão do cliente de chat ou do `user` de inferência. |
| **Content preview** | Uma pré-visualização encurtada do conteúdo da memória armazenada. A listagem da API trunca o conteúdo para 120 caracteres, e a tabela do console encurta novamente para 72 caracteres. Abra os detalhes para recuperar o conteúdo completo. |
| **Format** | `Text` para memória geral ou `DateReminder` para dados de calendário/lembrete. |
| **Source** | O gateway vinculado, ou **No gateway** quando a memória é memória compartilhada da conta. |
| **Actions** | Detalhes, Prompt de migração, Excluir memória e Excluir todas as memórias do usuário. |

A tabela pagina em páginas de 25 linhas. A listagem retorna apenas memórias ativas e não expiradas para a conta autenticada, as mais recentes primeiro.

## Encontrar memórias para um usuário

1. Confirme a conta ativa no menu de conta.
2. Insira o ID de usuário externo, ID da memória ou uma frase de conteúdo em **Search**.
3. Secione **Format** quando precisar apenas de memórias `Text` ou apenas de registros `DateReminder`.
4. Secione **Gateway** quando precisar de memórias de um gateway ou apenas de memórias compartilhadas **No gateway**.
5. Secione **Refresh** após mudar o contexto ou após uma ação de limpeza.

Se um usuário não tem memórias visíveis, limpe os filtros e pesquise novamente pelo ID de usuário externo. A lista mostra apenas registros ativos e não expirados, portanto uma memória expirada pode não aparecer mesmo que dados armazenados mais antigos existam fora da listagem normal.

## Ler uma memória com segurança

Use **Actions > Details** quando a pré-visualização da tabela não for suficiente. Detalhes mostram:

- ID completo da memória.
- ID de usuário externo.
- Formato.
- Link do gateway, quando presente.
- Timestamps de criado em e expira em.
- Conteúdo completo.

Trate a caixa de diálogo Detalhes como sensível. O conteúdo da memória pode incluir preferências do usuário, lembretes, contexto interno de fluxo de trabalho ou dados pessoais que o assistente não deveria ter armazenado. Redija antes de compartilhar capturas de tela ou valores copiados.

## Entender o escopo da memória

O escopo da memória determina qual gateway pode ler ou criar uma memória.

| Fonte na tabela | Significado | Efeito em tempo de execução |
| --- | --- | --- |
| **No gateway** | A memória é memória compartilhada da conta. | Gateways que permitem memória compartilhada podem vê-la para o mesmo usuário externo. |
| Nome do gateway | A memória está vinculada a esse gateway. | O gateway pode ver suas próprias memórias. Outros gateways só podem vê-la quando sua visibilidade de memória permite memória compartilhada. |

Em um AI Gateway, a área de Configuração de Memória controla o comportamento relacionado:

- **Include all memory context:** Quando habilitado, a AIVAX injeta todas as memórias `Text` ativas visíveis ao gateway no contexto do sistema e não expõe `memory_search`. Quando desativado, a AIVAX injeta até 10 memórias `Text` visíveis e, quando a ferramenta de Memória está habilitada, expõe `memory_search` para que o modelo possa pesquisar memórias adicionais.
- **Memory visibility:** Controla se um gateway pode consumir memórias de outros gateways ou apenas suas próprias memórias com escopo de gateway.

Novas memórias criadas enquanto um gateway está em execução são vinculadas a esse gateway. Chamadas fora de um gateway ou contextos sem link de gateway criam memórias compartilhadas.

## Trabalhar com formatos Text e DateReminder

Memórias `Text` são informações persistentes simples do usuário, como preferências ou notas de continuidade. A ferramenta de Memória pode salvar, pesquisar, atualizar, remover e limpar esses registros.

Memórias `DateReminder` são registros de calendário/lembrete armazenados pela ferramenta Calendar. Elas aparecem na mesma página de Memórias para que operadores da conta possam inspecionar e excluir, mas seu conteúdo é dados estruturados de lembrete ao invés de prosa comum.

Ao filtrar por formato, lembre-se de que a exclusão em massa por usuário também requer um formato. Excluir todas as memórias `Text` de um usuário não exclui as memórias `DateReminder` desse usuário, e excluir memórias `DateReminder` não exclui memórias `Text`.

`memory_save` e `memory_update` rejeitam `memoryData` maior que 10 KB. Ambas as ferramentas aceitam `retentionDays` de 1 a 365 dias; quando omitido, a retenção padrão é 30 dias.

## Excluir memórias

A exclusão é permanente a partir do console.

Use **Actions > Delete memory** quando um registro específico está errado, desatualizado ou inseguro de manter. Confirme o flyout para remover aquela memória por ID. Após a exclusão, atualize ou repita a mesma pesquisa; a linha excluída não deve mais aparecer, e abrir detalhes por aquele ID não deve mais ter sucesso.

Use **Actions > Delete all memories from user** somente quando pretender limpar as memórias de um usuário para o formato da linha selecionada. Isto não é uma ação apenas da linha. Pode remover múltiplos registros.

Esta ação exclui por formato e por um prefixo de usuário externo normalizado: a API remove tudo após o primeiro `@` no `externalUserId` fornecido, então exclui registros cujo `ExternalUserId` armazenado começa com esse valor normalizado. Confirme o identificador cuidadosamente antes de prosseguir.

Antes de excluir:

1. Confirme a conta ativa.
2. Confirme o ID de usuário externo.
3. Verifique o formato: `Text` ou `DateReminder`.
4. Abra **Details** para pelo menos uma linha afetada se a pré-visualização for ambígua.
5. Preserve evidência aprovada fora da AIVAX se a exclusão fizer parte de um processo de suporte, privacidade ou conformidade.

Excluir uma memória não reescreve conversas passadas, remove arquivos de conversa exportados, revoga sessões de chat ou altera instruções do gateway. Apenas remove registros de memória persistentes da recuperação de memória futura.

Para confirmar que a limpeza funcionou, atualize a página, pesquise pelo mesmo ID de usuário externo e verifique que a memória excluída ou o formato excluído não aparecem mais. A recuperação de memória futura deve excluir os registros removidos, mas os logs de conversas passadas permanecem inalterados.

## Usar o prompt de migração

Use **Actions > Migration prompt** quando precisar de uma exportação compacta e legível por modelo do contexto armazenado para um ID de usuário externo exato. O prompt inclui todos os registros de memória cujo `ExternalUserId` corresponde exatamente a esse valor, além de dados de mensagens agendadas e recorrentes relacionados ao mesmo valor exato. Ao contrário da lista de Memórias, este prompt não está limitado a registros não expirados e não usa correspondência por prefixo normalizado.

Antes de usar um prompt de migração:

1. Confirme a conta ativa.
2. Confirme o ID de usuário externo exato.
3. Confirme o destino pretendido e a aprovação de manipulação de dados.
4. Decida se os dados de mensagens agendadas ou recorrentes incluídos são apropriados para a migração.
5. Revise e redacte o prompt gerado antes de enviá-lo a qualquer lugar.

O prompt de migração não é anonimizado. Pode conter contexto sensível do usuário ou detalhes operacionais, e destina-se a ser um auxílio de migração funcional ao invés de uma exportação pública. Não cole em ferramentas, tickets ou prompts não relacionados a menos que o destino esteja aprovado para esses dados.

## Privacidade e minimização de dados

Memórias afetam o comportamento futuro do assistente, portanto armazene apenas o que o assistente realmente precisa para personalizar ou continuar o trabalho de um usuário.

Evite armazenar:

- Chaves de API, senhas, tokens, chaves de login, segredos de webhook ou dados de pagamento.
- IDs governamentais, dados de contas financeiras, informações de saúde ou outros dados pessoais de alto risco.
- Detalhes privados do cliente que não são necessários para assistência futura.
- Detalhes temporários de problemas que pertencem a um ticket de suporte ou registro de conversa.
- Documentos grandes, políticas, manuais ou texto de base de conhecimento que pertencem ao RAG.

Use expiração deliberadamente. As chamadas da ferramenta de Memória podem solicitar retenção de 1 a 365 dias, e o padrão é 30 dias quando nenhuma retenção é fornecida. Memórias expiradas são ocultas da listagem e uso normais; registros expirados antigos são removidos posteriormente por limpeza em segundo plano.

## Solução de problemas

| Problema | Causa provável | O que fazer |
| --- | --- | --- |
| Nenhuma memória aparece para um usuário | A sessão não tinha uma referência de usuário estável, a memória expirou, a conta errada está ativa ou os filtros são muito restritos. | Confirme a conta ativa, limpe os filtros, pesquise por ID de usuário externo e verifique o `tag` da sessão do cliente de chat ou o `user` de inferência. |
| O assistente não lembra do contexto anterior | A ferramenta de memória pode não estar habilitada, o gateway pode não ver memória compartilhada ou o usuário da sessão mudou. | Verifique as ferramentas integradas do AI Gateway, Configuração de Memória e a referência de usuário usada pelo cliente. |
| O gateway errado vê uma memória | A visibilidade de memória compartilhada pode estar habilitada ou a memória não tem origem de gateway. | Filtre por Gateway na página de Memórias e revise a configuração de visibilidade de memória do gateway. |
| Uma memória contém dados sensíveis ou incorretos | O assistente salvou conteúdo que não deveria persistir. | Exclua a memória específica, revise as instruções do gateway e inspecione Conversas para entender como foi criada. |
| Exclusão em massa removeu mais do que o esperado | Excluir todas as memórias do usuário exclui por prefixo de usuário externo normalizado e formato, não apenas pela linha selecionada. | Verifique o ID de usuário externo afetado e o formato antes de confirmar; use exclusão de memória única para limpeza precisa. |
| Lembretes de calendário aparecem em Memórias | O Calendar usa o mesmo armazenamento persistente com o formato `DateReminder`. | Filtre por `DateReminder` ao revisar lembretes e exclua apenas esse formato ao limpar dados de calendário. |

## Referência de API

Use o console para revisão manual e limpeza. Use a API de Memórias quando precisar construir um fluxo de trabalho interno auditado, repetível ou em massa em torno de memórias persistentes. A API é autenticada por conta e expõe operações de listagem, detalhe e exclusão.

### Listar memórias

Liste memórias quando precisar encontrar registros persistentes ativos para a conta autenticada. Use `filter`, `format` e `gatewayId` para restringir o resultado antes de excluir ou inspecionar detalhes.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Memories&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Obter detalhes da memória

Obtenha uma memória quando já tem o ID da memória do console, endpoint de listagem ou de um fluxo de revisão.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Memory&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Excluir memórias

Exclua por ID quando precisar de limpeza precisa. Exclua por ID de usuário externo e formato ao atender a solicitação de limpeza a nível de usuário para um tipo de memória.

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Memories&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>