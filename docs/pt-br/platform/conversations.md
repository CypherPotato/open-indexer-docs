# Conversas

Conversas é a área de observabilidade para interações de modelo armazenadas em sua conta. Use-a para encontrar solicitações recentes, inspecionar o comportamento de prompts e respostas, revisar o uso, conectar uma conversa a um gateway ou sessão, exportar evidências e remover registros de conversa armazenados quando não forem mais necessários.

Os registros de conversa podem conter prompts, respostas de assistente, chamadas de ferramenta, metadados, IDs de usuário externo, IDs de recurso, objetos de uso, esquemas de resposta, erros e informações de tempo. Trate esta página como dados operacionais sensíveis.

## Quando usar Conversas

Use Conversas quando precisar:

- Investigar uma resposta recente da API de Chat Completions, API de Sessions ou API de Functions.
- Encontrar conversas por modelo, usuário externo, chave de API, gateway, cliente de chat ou sessão de chat.
- Revisar o uso de tokens e recursos conectados a uma interação específica.
- Verificar se uma solicitação falhou e ver a mensagem de erro armazenada.
- Exportar conversas para auditoria, revisão offline, suporte ou análise de qualidade.
- Excluir registros de conversa armazenados da conta.

Use [Análises](/docs/pt-br/platform/analytics) quando precisar de consolidações de faturamento e tendências de gastos. Use Logs quando precisar de eventos de runtime ou operacionais de nível inferior.

## Antes de começar

A visibilidade da conversa é limitada pelo período de retenção de conversas do plano da sua conta. A lista e as exportações não podem retornar registros fora do período retido, mesmo que você escolha um intervalo maior.

Confirme que está na conta ativa correta antes de investigar ou excluir dados de conversa. Se seu processo de observabilidade ou auditoria exigir conversas armazenadas, também confirme que o registro de conversas ao nível da conta está habilitado. Quando o registro está desativado, conversas futuras podem não ser armazenadas nesta página.

Antes de compartilhar uma conversa, exportar, fazer captura de tela ou copiar JSON, redija segredos, dados de cliente, chaves de API, chaves de sessão, prompts privados, dados pessoais e metadados não relacionados. URLs de exportação abertas pelo console incluem um parâmetro de consulta `api-key`, portanto não compartilhe URLs do navegador, entradas de histórico, logs de proxy ou capturas de tela que incluam URLs de solicitação de exportação.

## Navegar por conversas

Abra **Conversas** na barra lateral do console. A lista mostra conversas recentes com:

- **Origem:** A interface de API que criou a conversa, como API de Chat Completions, API de Sessions ou API de Functions.
- **Atualizado:** O horário da última atualização.
- **Modelo:** O modelo usado pela conversa.
- **Contagem de tokens:** Total de tokens de entrada e saída, incluindo re-chamadas de ferramenta do lado do servidor quando armazenadas.
- **Primeira mensagem do usuário:** Uma pré-visualização da primeira mensagem do usuário.
- **Última mensagem do assistente:** Uma pré-visualização da resposta mais recente do assistente ou um indicador de erro.
- **Ações:** Abrir a visualização de detalhes ou excluir a conversa.

Alterações de pesquisa e intervalo de tempo atualizam a lista automaticamente. Use **Atualizar** ao aguardar que uma solicitação recente apareça.

## Filtrar a lista

Use **Intervalo de tempo** para escolher a janela de retrocesso:

- Última semana
- Últimas 24 horas
- Últimas 2 horas
- Últimos 5 minutos

A janela solicitada também é limitada pelo período de retenção da conta.

Use **Pesquisa** para filtragem de texto livre ou filtros no estilo de comando. A ajuda interna lista filtros suportados:

| Filtro | Use para encontrar |
| --- | --- |
| `--model` ou `-m` | Conversas que usaram um modelo específico. |
| `--user` ou `-u` | Conversas para um ID de usuário externo específico. |
| `--api-key` | Conversas associadas a um ID de chave de API específico. |
| `--gateway` | Conversas associadas a um ID de AI Gateway específico. |
| `--chat-client` | Conversas associadas a um Cliente de Chat específico. |
| `--chat-session` | Conversas associadas a uma sessão de chat específica. |

Filtros de recurso como `--api-key`, `--gateway`, `--chat-client` e `--chat-session` esperam o UUID completo do recurso, não um nome de exibição, ID curto ou URL. `--model` e `--user` correspondem a valores de string exatos, sem diferenciar maiúsculas de minúsculas.

Você pode clicar em um distintivo de modelo na lista para aplicar um filtro de modelo. Ao investigar um relatório de usuário, comece com o intervalo mais estreito útil e o identificador mais específico que possui, como ID de usuário externo, ID de gateway ou ID de sessão de chat.

A lista é otimizada para investigação recente, não para prova completa de auditoria. Contas de alto volume podem atingir limites de lista antes que toda conversa correspondentes em um intervalo amplo esteja visível. Reduza o intervalo de tempo e use o fluxo de exportação/API para revisão mais ampla.

## Inspecionar uma conversa

Selecione **Visualizar** para abrir o inspetor de conversa. O inspetor mantém a transcrição de mensagens visível enquanto o painel lateral mostra detalhes de observabilidade.

O painel lateral pode incluir:

| Aba | O que mostra | Quando usar |
| --- | --- | --- |
| **Dados da conversa** | ID da conversa, ID da solicitação, nome do modelo, ID de usuário externo, origem, timestamps de criação e atualização, contagem de tokens e metadados | Use para passagem de suporte, correlação e verificações de identidade de alto nível. |
| **Uso** | Objeto de uso bruto e recursos relacionados | Use para conectar a conversa ao faturamento, gateways, coleções, sessões ou outros recursos. |
| **Esquema de resposta** | Esquema de resposta armazenado, quando a solicitação usou saída estruturada | Use ao investigar respostas estruturadas malformadas ou inesperadas. |
| **Ferramentas** | Ferramentas disponíveis ou registradas para a conversa | Use ao verificar se uma resposta habilitada por ferramenta usou as capacidades esperadas. |
| **Desempenho** | Cascata de desempenho da solicitação, quando disponível | Use ao diagnosticar respostas lentas ou latência de provedor/ferramenta. |

A área principal de mensagens mostra mensagens de usuário, assistente, ferramenta e informativas. Conversas muito longas podem exibir um marcador de mensagem omitida no meio do inspetor. A visualização de detalhes mantém as primeiras 30 e as últimas 40 mensagens e insere uma contagem omitida quando a lista de mensagens é maior. Use exportação quando o meio da transcrição for importante.

Se a solicitação falhou, o inspetor pode mostrar um bloco de informações **Erro da solicitação** com a mensagem de erro armazenada.

## Exportar conversas

Use **Exportar tudo** na lista para exportar conversas como JSONL. O diálogo inclui:

| Opção | Valores | Orientação |
| --- | --- | --- |
| **Período** | 2 horas, 1 dia, 7 dias, 30 dias | O período de exportação selecionado ainda é limitado pela retenção da conta. |
| **Mídia** | Incluir, Truncar para texto | Use truncamento de texto quando as exportações não devem incluir payloads de mídia multipartes completos. |
| **Pensamento** | Tudo, Apenas visível, Nenhum | Use **Nenhum** para a maioria das passagens de suporte, **Apenas visível** ao revisar raciocínio voltado ao usuário e **Tudo** apenas para depuração interna confiável com armazenamento aprovado. |
| **Truncar** | Limite de tokens, onde `0` desativa o truncamento | Use um limite diferente de zero quando as exportações podem ser grandes ou quando você só precisa de uma amostra de cada conversa. |

Use o menu **Exportar** da página de detalhes para exportar uma conversa como JSON, ou **Copiar para a área de transferência** para copiar o objeto de detalhe carregado atualmente.

**Exportar como JSON** de uma única conversa é um download direto, não o mesmo diálogo configurável de **Exportar tudo**. No comportamento atual do console, ele exporta a conversa armazenada com mídia incluída, todo o raciocínio incluído e sem truncamento. **Copiar para a área de transferência** copia o objeto do inspetor carregado, que pode omitir mensagens do meio em conversas longas.

Tanto **Exportar tudo** quanto **Exportar como JSON** de uma única conversa abrem URLs com um parâmetro de consulta `api-key`. Não compartilhe esses URLs, histórico do navegador, capturas de tela, logs de rede ou URLs de solicitação copiados.

As exportações podem conter prompts, respostas, metadados ocultos, rastros de ferramenta, referências de mídia, conteúdo de raciocínio dependendo da opção selecionada e identificadores de conta. Armazene as exportações com segurança e exclua cópias locais quando não forem mais necessárias.

## Investigar uma conversa

Use este fluxo para respostas ruins, erros, custo inesperado ou tráfego não autorizado suspeito:

1. Confirme a conta ativa e escolha o intervalo de tempo mais estreito útil.
2. Pesquise pelo identificador mais específico disponível: sessão de chat, usuário externo, gateway, chave de API, cliente de chat ou modelo.
3. Abra a conversa e copie o ID da conversa e o ID da solicitação.
4. Inspecione **Dados da conversa**, **Uso**, **Ferramentas**, **Esquema de resposta**, **Desempenho** e qualquer bloco **Erro da solicitação**.
5. Verifique o faturamento relacionado em [Análises](/docs/pt-br/platform/analytics) e evidências de runtime em Logs.
6. Preserve apenas a evidência mínima necessária para suporte, auditoria ou remediação.
7. Remedeie a origem: atualize o gateway, interrompa o chamador, gire ou revogue uma chave exposta, exclua uma sessão exposta ou corrija os dados de origem.

## Compartilhar evidências de conversa com segurança

Prefira compartilhar o ID da conversa, ID da solicitação, intervalo de tempo aproximado, origem e uma descrição redigida do problema. Evite exportações completas a menos que o destinatário seja confiável e o local de armazenamento seja aprovado.

Antes de enviar evidências, redacte dados de cliente, prompts, saídas de ferramenta, mídia, raciocínio oculto, chaves de API, chaves de sessão, IDs de usuário externo quando não necessários, metadados não relacionados e URLs do navegador com strings de consulta.

## Excluir conversas

Use o menu de ação da linha e selecione **Excluir conversa** para remover uma conversa armazenada. O console pede confirmação e avisa que a ação não pode ser desfeita.

Antes de excluir, verifique a conta ativa, confirme o ID da conversa e o ID da solicitação, e exporte ou copie apenas as evidências que você tem permissão para manter. A exclusão é irreversível a partir do console.

A exclusão remove o registro da conversa armazenada da conta. Não revoga chaves de API, exclui sessões de chat, remove dados de origem, altera faturas ou desfaz uso já registrado. Se uma conversa mostrar atividade não autorizada, exclua somente após preservar as evidências necessárias para a investigação, então gire ou revogue a chave ou sessão relevante separadamente.

## Solução de problemas

| Problema | Causa provável | O que fazer |
| --- | --- | --- |
| Uma conversa recente está ausente | O intervalo de tempo está muito estreito, retenção expirou, registro de conta está desativado, limites de lista ocultam o registro ou a solicitação ainda não foi armazenada | Escolha um intervalo mais amplo dentro da retenção, limpe filtros, confirme as configurações de registro, estreite a pesquisa e atualize. |
| Pesquisa não retorna resultados | O filtro usa o tipo de identificador errado ou um valor não presente nos metadados armazenados | Use um filtro por vez. Tente modelo, ID de usuário externo, ID de gateway, cliente de chat ou sessão de chat separadamente. |
| A visualização de detalhes mostra mensagens omitidas | A conversa é longa e o inspetor mantém o início e o fim enquanto omite o meio | Exporte a conversa se precisar do meio da transcrição e escolha o truncamento de exportação com cuidado. |
| Uma conversa mostra um erro | A solicitação falhou durante inferência, uso de ferramenta, validação ou outra etapa de runtime | Abra a visualização de detalhes, copie o ID da solicitação, inspecione Logs relacionados e revise o gateway, modelo, ferramenta ou sessão envolvida. |
| Exportação é muito grande ou sensível | O período é amplo, mídia está incluída, raciocínio está incluído ou truncamento está desativado | Reduza o período, selecione **Truncar para texto**, escolha **Apenas visível** ou **Nenhum** para Pensamento e defina um limite de truncamento. |
| Você encontrou tráfego não autorizado | Uma chave de API, sessão pública, gateway, cliente de chat ou integração pode estar exposta | Preserve a evidência mínima, interrompa o chamador, gire ou revogue chaves, exclua sessões expostas e revise as Análises para impacto. |

## Referência da API

Use a API de Conversas quando precisar construir sua própria observabilidade, auditoria, exportação ou fluxo de limpeza.

### Listar e exportar

Liste conversas recentes com filtros opcionais ou exporte várias conversas como JSONL.

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Conversations&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Conversations%20%28JSONL%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Inspecionar, exportar ou excluir uma conversa

Use um endpoint de única conversa quando já possuir o ID da conversa da lista, de um caso de suporte, logs ou de um fluxo de correlação interno.

A referência pública para exportação de única conversa pode mostrar opções de consulta também usadas por exportações JSONL. Verifique o comportamento atual antes de confiar em truncamento, mídia ou controles de pensamento para exportações JSON únicas; use exportação JSONL em lote quando for necessária redigir configurável.

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Conversation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Conversation%20%28JSON%29&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Conversation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>