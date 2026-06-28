# Clientes de Chat

Use **Clientes de Chat** para conectar um AI Gateway às pessoas através de uma sessão de chat web, bot do Telegram ou integração com WhatsApp. O gateway controla o comportamento do assistente; o cliente de chat controla o canal, identidade da sessão, interface do usuário, limites, integrações, continuações agendadas e pontos de entrada da conversa.

Esta página é para construtores e operadores que gerenciam clientes de chat pelo console AIVAX. Para mecânicas de sessão API e comportamento do canal, veja o [guia de Clientes de Chat para desenvolvedores](/docs/pt-br/features/chat-clients).

## Antes de começar

Faça login no [console AIVAX](https://console.aivax.net/) e abra **Painel > Clientes de chat**. Confirme a conta ativa antes de editar um cliente, copiar links de sessão, alterar integrações ou excluir sessões.

Antes de criar ou alterar um cliente de chat de produção, identifique:

- Qual [AI Gateway](ai-gateways.md) deve responder às mensagens.
- Qual canal você está atendendo: chat web, Telegram, WhatsApp ou uma combinação.
- Qual identidade de usuário deve ser usada como tag da sessão ou ID externo de usuário.
- Quais anexos, ferramentas, áudio, memória, continuações agendadas ou workers o gateway pode usar.
- Quais limites devem proteger o assistente de abuso ou sessões fora de controle.
- Onde os logs de conversa e revisão de suporte devem acontecer.

## Quando usar um cliente de chat

Use um cliente de chat quando um usuário humano precisar de uma interface de conversa gerenciada ao invés de uma chamada de API bruta. Clientes de chat são úteis para:

- Assistentes de sites ou produtos.
- Portais de suporte e help desks internos.
- Bots do Telegram.
- Suporte via WhatsApp através da Evolution API, Kapso ou Z-Api legada.
- Links de demonstração ou conversas de teste controladas.
- Conversas baseadas em sessão que precisam de contexto, expiração, limites de uso e observabilidade.

Use inferência direta quando sua aplicação possui a UI completa, modelo de identidade e estado da conversa.

## Entenda a lista de clientes de chat

A página Clientes de chat mostra cada cliente pertencente à conta ativa.

| Coluna ou controle | Uso |
| --- | --- |
| **Novo cliente de chat** | Crie um cliente e vincule‑o a um AI Gateway. |
| **Filtrar colunas** | Pesquise valores visíveis na lista. |
| **Id.** | Forma curta de exibição do ID do cliente de chat. Copie o ID completo ao integrar via API ou configurar webhooks. |
| **Nome** | Nome amigável do cliente exibido no console. |
| **Gateway associado** | Gateway que recebe mensagens deste cliente. |
| **Sessões ativas** | Número de sessões atualmente listadas para o cliente. |
| **Gerenciar** | Abra o editor do cliente. |
| **Sessões** | Abra o gerenciamento de sessões para o cliente. |
| **Mensagens agendadas** | Abra mensagens agendadas e tarefas recorrentes para o cliente. |

## Crie um cliente de chat

Para criar um cliente:

1. Selecione **Novo cliente de chat**.
2. Defina **Nome do cliente de chat** para um nome de canal e ambiente claros.
3. Selecione o **Gateway associado** que deve responder às mensagens.
4. Escolha o **Idioma da UI** ou deixe em detecção automática.
5. Revise personalização, limites e configurações do canal.
6. Selecione **Criar cliente de chat**.

Confirme que o cliente aparece na lista com o gateway esperado. Para canais públicos ou voltados ao cliente, teste com um gateway não‑produção ou sessão privada antes de publicar links ou webhooks.

## Configure o editor do cliente

Abra **Gerenciar** em um cliente de chat para editá‑lo. Salve alterações somente após revisar todas as abas que afetam o comportamento de produção.

| Aba | Uso |
| --- | --- |
| **Cliente de chat** | Nome do cliente, gateway associado e idioma da interface. |
| **Personalização** | Cor primária, título da página, título/subtítulo da apresentação, logo, botões de sugestão e placeholder de entrada. |
| **Parâmetros** | Máximo de mensagens por hora, mensagens retidas máximas e modos de entrada permitidos como imagem, documento e áudio. |
| **Texto‑para‑fala** | Provedor de síntese de voz, nome da voz, instruções de fala e resumo opcional antes da síntese. |
| **Integrações** | Telegram, Evolution API, Kapso, Z‑Api legada, comportamento de mensagens, continuações agendadas e configurações de integração compartilhadas. |
| **Avançado** | CSS personalizado, JavaScript personalizado, modo de depuração e visibilidade de chamadas de ferramenta. |

Revise primeiro o gateway associado. Se o gateway não suportar os modos de entrada ou ferramentas habilitadas no cliente, os usuários podem conseguir enviar conteúdo que o assistente não trata bem.

## Personalize o chat web

Use **Personalização** para tornar o cliente de chat compreensível aos usuários antes que a primeira mensagem seja enviada.

| Configuração | Uso |
| --- | --- |
| **Cor primária** | Cor de destaque para links, botões e elementos da UI do cliente. |
| **Título da página** | Título da página do navegador. |
| **Título da apresentação** | Cabeçalho de estado vazio exibido antes de iniciar a conversa. |
| **Subtítulo da apresentação** | Texto de apoio de estado vazio. |
| **Imagem do logo** | Logo exibido na abertura do chat. |
| **Botões de sugestão** | Iniciadores de conversa exibidos próximo à entrada. |
| **Placeholder da área de entrada** | Texto placeholder no campo de mensagem. |

Escreva botões de sugestão como prompts iniciais seguros e de alto valor. Evite colocar dados privados do cliente, credenciais, IDs de conta ou procedimentos internos apenas texto UI visível.

## Defina limites e modos de entrada

Use **Parâmetros** para proteger a experiência do usuário, custo e recursos da conta.

| Configuração | Significado |
| --- | --- |
| **Máximo de mensagens por hora** | Limite horário de mensagens por sessão. |
| **Máximo de mensagens** | Número máximo de mensagens permitidas em uma sessão, contando mensagens do usuário e do assistente. Quando uma sessão ultrapassa esse limite, o chat é bloqueado ao invés de cortar silenciosamente mensagens antigas. |
| **Modos de entrada** | Quais tipos de entrada o cliente permite, como imagem, documento e áudio. |

Defina limites antes de expor publicamente um cliente de chat. Se permitir arquivos ou áudio, verifique se o gateway associado e o modelo selecionado podem processar esses insumos e explique o comportamento esperado de anexos aos usuários quando adequado.

## Configure texto‑para‑fala

Use **Texto‑para‑fala** quando a experiência de chat deve produzir respostas em áudio.

| Configuração | Significado |
| --- | --- |
| **Origem da síntese de voz** | Provedor usado para texto‑para‑fala, ou nenhum. |
| **Voz de síntese** | Identificador da voz usado pelo provedor selecionado. |
| **Instruções especiais** | Tom, estilo de fala ou orientação de pronúncia. |
| **Resumir antes da síntese** | Encurta o texto antes da síntese para melhorar a qualidade do áudio e controlar custos. |

Texto‑para‑fala pode acrescentar custo e pode mudar como as respostas são percebidas. Teste com respostas realistas, respostas longas e mensagens de erro antes de habilitar para usuários.

## Configure integrações de mensagens

Abra **Integrações** para conectar o cliente de chat a canais de mensagem.

| Integração | Uso | Campos principais de configuração |
| --- | --- | --- |
| **Telegram** | Conversas de bot do Telegram. | Token do bot e duração da sessão. Use **Hooks de atualização** após salvar alterações no token. |
| **Evolution API** | WhatsApp via instância auto‑hospedada da Evolution API. | Endpoint da instância, nome da instância, token da instância, duração da sessão e URL do webhook gerado. |
| **Kapso** | WhatsApp via Kapso. | Chave de API, ID do número de telefone, chave secreta opcional do webhook, duração da sessão e ID de modelo de mensagem contínua opcional. |
| **Z‑Api** | Integração WhatsApp legada. | ID da instância, token da instância, token de cliente opcional, duração da sessão e URL do webhook gerado. |

Tokens de provedor e segredos de webhook são credenciais. Armazene‑os apenas nas configurações de integração, não cole‑os em documentação, capturas de tela, gravações de navegador ou mensagens de suporte, e rotacione‑os se expostos.

Para integrações WhatsApp, configure o webhook do provedor exatamente como a página de integração instrui. Para Z‑Api, não habilite opções do provedor que notifiquem mensagens enviadas pelo próprio bot; isso pode criar um loop infinito de respostas. Para Evolution API, o console especifica o evento de inserção de mensagem e as configurações de webhook necessárias para operação normal.

Remover uma integração desconecta a configuração do provedor do cliente de chat. Não substitui a configuração da conta do provedor subjacente e pode parar imediatamente usuários desse canal de alcançar o assistente até que a integração seja configurada novamente.

## Rotacione ou altere credenciais do provedor

Trate credenciais do provedor como infraestrutura de produção. Para canais Telegram ou WhatsApp ao vivo:

1. Crie ou use um cliente de chat de teste quando possível.
2. Salve o novo token, chave de API ou segredo de webhook primeiro no cliente de teste.
3. Configure o webhook do provedor com a URL do webhook de teste.
4. Envie uma mensagem de teste simples e confirme a resposta mais logs de conversa.
5. Aplique a nova credencial ao cliente de produção.
6. Atualize hooks ou configurações de webhook do provedor conforme exigido pela página de integração.
7. Confirme logs de produção e então revogue a credencial ou webhook antigo.

Evite excluir a integração antiga até que o caminho de substituição seja testado. Se a entrega parar após a rotação, restaure a configuração anterior do provedor ou desative o webhook do provedor enquanto investiga.

## Configure comportamento de mensagens compartilhado

A aba **Integrações** também inclui configurações de mensagens compartilhadas:

| Configuração | Significado |
| --- | --- |
| **Dividir resposta em blocos de mensagem** | Envia respostas longas como múltiplas mensagens do canal. |
| **Intervalo de debounce da mensagem** | Tempo de espera após o usuário parar de digitar antes de processar. |
| **Carregar arquivos não suportados** | Permite arquivos que não são suportados nativamente pelo modelo sejam carregados e representados para o assistente. |
| **Permitir conversas contínuas** | Permite ao assistente agendar mensagens e ações contínuas. |
| **Tempo máximo ignorado para mensagens contínuas** | Quanto tempo uma continuação agendada pode ser ignorada antes de ser descartada. |

Use continuações agendadas somente quando os usuários concordaram com acompanhamentos posteriores. Verifique o identificador de destino antes de confiar nele, forneça um caminho de exclusão no canal e revise tarefas recorrentes obsoletas antes de alterar integrações, excluir clientes ou reatribuir um número de telefone ou bot.

## Use configurações avançadas com segurança

Use **Avançado** somente quando precisar de personalização ou depuração controlada ao nível do cliente.

CSS e JavaScript personalizados são executados na experiência do cliente de chat. Use código apenas de fontes confiáveis e não carregue scripts de terceiros que possam ler URLs de sessão, conteúdo de mensagens, entrada do usuário ou contexto do provedor.

Mantenha **Depuração** e **Visibilidade de chamadas de ferramenta** desativados para clientes de produção, a menos que esteja reproduzindo um problema em uma sessão de teste privada. Essas configurações podem expor parâmetros de ferramentas, erros internos, detalhes de requisição ou dados de sessão a usuários do navegador ou logs. Desative‑as imediatamente após o teste.

## Use sessões com segurança

Abra **Sessões** a partir da lista de clientes de chat ou menu Gerenciar para inspecionar conversas criadas para aquele cliente.

A lista de sessões mostra:

| Coluna ou ação | Significado |
| --- | --- |
| **Chave da sessão** | Chave de acesso à sessão. Trate como sensível. |
| **Tag/Usuário** | ID externo de usuário ou tag associada à sessão. |
| **Uso** | Contagem de tokens e de mensagens. |
| **Criado em** | Horário de criação da sessão. |
| **Última atividade** | Última atividade do usuário ou assistente. |
| **Contexto** | Pré‑visualização de contexto extra anexado à sessão. |
| **Abrir chat** | Abre o chat web para essa sessão. |
| **Copiar link** | Copia uma URL de sessão. Qualquer pessoa com o link pode acessar a sessão enquanto ela for válida. |
| **Exportar conversa** | Baixa a transcrição da sessão. |
| **Ver logs de conversa** | Abre Conversas filtradas para a sessão. |
| **Limpar conversa** | Limpa as mensagens da conversa mantendo a sessão. Isso não revoga a chave da sessão nem invalida links copiados. |
| **Excluir** | Exclui a sessão e encerra o acesso via sua chave. |

Não compartilhe chaves de sessão ou links de chat publicamente. Um link de sessão é um token de acesso para aquela conversa. Se um link for exposto, exclua a sessão ou crie uma nova sessão e compartilhe a substituição apenas com o usuário pretendido. Limpar conversa é útil para redefinir conteúdo, mas use **Excluir** quando um link ou chave de sessão puder ter sido exposto.

Trate conversas exportadas e logs como dados sensíveis. Armazene‑os apenas em locais aprovados, evite enviar exportações brutas ao suporte e redacte credenciais, chaves de sessão, números de telefone, dados pessoais e contexto interno ao compartilhar exemplos.

## Crie uma sessão

Use **Nova sessão** quando precisar de um link de chat web controlado ou de uma conversa de teste.

| Campo | Uso |
| --- | --- |
| **Tag** | ID externo estável para o usuário, conta ou conversa da aplicação. Use uma tag única por usuário real ou conversa. Se já existir uma sessão ativa com a mesma tag, criar uma sessão atualiza e retorna essa sessão, o que pode expor contexto prévio se dois usuários compartilharem a tag por acidente. |
| **Expiração** | Tempo que a sessão permanece válida. O console impõe o intervalo suportado de 10 minutos a 90 dias. |
| **Contexto** | Contexto adicional visível ao modelo para esta sessão. |

Mantenha tags estáveis mas não sensíveis. A tag é identidade pesquisável para restauração de sessões, não um local para metadados privados. Não use identificadores pessoais crus, credenciais ou segredos como tags. Coloque apenas informações em **Contexto** que o assistente tem permissão para ver. Metadados da sessão são repassados através do contexto de inferência; não armazene segredos ou credenciais.

## Revise tarefas agendadas

Abra **Mensagens agendadas** para monitorar acompanhamentos criados para um cliente de chat.

A página inclui:

| Seção | Uso |
| --- | --- |
| **Filtrar por usuário** | Filtra agendas e tarefas recorrentes por ID externo de usuário. |
| **Mensagens agendadas** | Mensagens únicas agendadas para entrega futura. |
| **Tarefas recorrentes** | Tarefas baseadas em cron que ativam repetidamente. |
| **Detalhes** | Inspeciona alvo, identificador de alvo, horário, motivo, contexto, resultado da execução, expressão cron e histórico de ativações. |
| **Cancelar** | Cancela uma agenda única ou tarefa recorrente. Isso não pode ser desfeito pelo console. |

Use esta página quando usuários relatarem acompanhamentos inesperados, lembretes faltantes ou mensagens repetidas. Verifique o ID externo de usuário, alvo, horário agendado, status, próxima ativação, contagem de execuções e logs de conversa relacionados.

Antes de excluir ou recriar uma sessão, verifique se mensagens agendadas ou tarefas recorrentes usam o mesmo ID externo de usuário. Excluir a sessão não prova automaticamente que um acompanhamento futuro do provedor ou da agenda não é mais relevante.

## Exclua ou desconecte com segurança

Antes de excluir um cliente de chat ou integração:

1. Revise sessões ativas.
2. Verifique mensagens agendadas e tarefas recorrentes.
3. Abra logs de conversa para atividade recente.
4. Identifique sites, bots, webhooks de provedor ou aplicações que usam o ID do cliente ou URLs de sessão.
5. Exporte conversas se requisitos de retenção ou auditoria exigirem.
6. Desative webhooks externos de provedor se o provedor deve parar de enviar mensagens ao AIVAX.

Excluir um cliente de chat também exclui suas sessões. Remover uma integração apenas remove aquela configuração de provedor do cliente.

## Solução de problemas

Ao escalar um problema, compartilhe o ID do cliente de chat, nome do provedor, timestamp, usuário ou tag mascarados e texto de erro relevante. Não compartilhe tokens de bot, chaves de API, segredos de webhook, URLs completas de sessão, chaves de sessão ou transcrições não redactadas.

| Sintoma | Verificação | Correção |
| --- | --- | --- |
| Usuário não consegue abrir link de chat web | Chave da sessão, horário de expiração, sessão excluída, URL copiada e conta/cliente ativo. | Crie uma nova sessão e compartilhe o novo link apenas com o usuário pretendido. |
| Bot recebe mensagens mas não responde | Gateway associado, saldo da conta, limites de mensagem, credenciais de integração, URL do webhook do provedor e logs de conversa. | Teste o gateway diretamente, verifique configurações do provedor, então envie uma mensagem simples somente texto. |
| Bot WhatsApp entra em loop ou responde a si mesmo | Opções de webhook do provedor e se mensagens enviadas pelo bot são encaminhadas de volta ao AIVAX. | Desative opções do provedor que notifiquem mensagens enviadas pelo bot e teste novamente com uma mensagem. |
| Anexos falham ou produzem respostas ruins | Modos de entrada, suporte de modalidade do modelo, configurações multimodais do gateway, configuração de arquivo não suportado e suporte de mídia do provedor. | Habilite apenas modos de entrada suportados ou troque para um gateway/modelo que suporte o conteúdo do canal. |
| Usuários atingem limites muito rápido | Máximo de mensagens por hora, máximo de mensagens, duração da sessão de integração e comportamento de tentativas repetidas. | Aumente limites deliberadamente, distribua usuários entre sessões quando apropriado ou reduza tentativas automáticas. |
| Acompanhamento agendado não enviou | Permitir conversas contínuas, status da tarefa agendada, identificador de alvo, ID externo de usuário, próxima ativação, credenciais do provedor e saldo da conta. | Inspecione detalhes da tarefa agendada, corrija problemas do provedor/gateway e recrie a agenda se necessário. |
| Erros de ferramenta estão ocultos | Configurações de depuração e visibilidade de chamadas de ferramenta. | Habilite depuração temporariamente em um cliente de teste controlado, reproduza, inspecione logs e depois desative depuração para usuários de produção. |
| Qualidade da conversa difere por canal | Instruções do gateway, formatação do canal, divisão de mensagens, anexos e contexto da sessão. | Teste a mesma tarefa de usuário no chat web e na integração de mensagem, então ajuste configurações específicas do canal. |

## Referência de API

Gerencie clientes de chat através da API Web Chat:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Web%20Chat%20Clients&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Web%20Chat%20Client%20Integrations&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Client%20Integration&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Client&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Crie e gerencie sessões através da API Web Chat Sessions:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Web%20Chat%20Sessions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use essas ações públicas de sessão a partir de uma sessão de chat válida:

**Limpar conversa** está disponível no menu de sessão do console. Sua ação de redefinição subjacente não está atualmente exposta como referência de API pública incorporada, então use o console quando precisar limpar uma sessão sem excluí‑la.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Session%20Info&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Send%20Prompt&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Last%20Message&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Download%20Session%20Transcript&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Monitore acompanhamentos agendados e recorrentes através de Schedules de Hook:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Hook%20Schedules&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Schedule&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Recurring%20Task&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Cancel%20Schedule&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Cancel%20Recurring%20Task&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Documentação relacionada:

- [Guia de Clientes de Chat para desenvolvedores](/docs/pt-br/features/chat-clients): comportamento de sessão e integração técnica.
- [AI Gateways](ai-gateways.md): configure o assistente por trás do cliente.
- Conversas: inspecione logs de conversa e exportações pelo console.
- [Conta, saldo e múltiplas contas](account-balance.md): gerencie saldo, limites e chaves de API.