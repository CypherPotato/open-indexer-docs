# Conceitos básicos da plataforma

Use o console AIVAX quando precisar configurar e monitorar os recursos que alimentam suas aplicações de IA: modelos, Gateways de IA, coleções RAG, clientes de chat, trabalhos em lote, habilidades, logs, conversas, memórias, uso da conta e faturamento.

Esta página é para operadores e construtores de contas que estão acessando o console pela primeira vez ou que precisam de um modelo mental confiável para navegar na plataforma. Se você estiver integrando por código em vez de usar o console, comece com [Getting Started](/docs/pt-br/getting-started) e [Authentication](/docs/pt-br/authentication).

## Antes de começar

Você precisa de uma conta AIVAX e de uma chave de login alfanumérica de 14 caracteres. Uma chave de login autentica você no console. Ela é diferente de uma chave de API: chaves de API autenticam aplicações e integrações, enquanto a chave de login autentica uma pessoa ou operador no navegador.

Mantenha as chaves de login privadas. Não as cole em tickets de suporte, clientes de chat públicos, código‑fonte, capturas de tela ou documentos compartilhados. Se uma chave de API puder ter sido exposta, revogue‑a na gestão de contas. Se uma chave de hook puder ter sido exposta, redefina‑a. Se uma chave de login puder ter sido exposta, faça logout dos navegadores compartilhados e use o processo de recuperação de conta ou suporte suportado; fazer logout não gira a chave de login.

## Entrar

Abra o [AIVAX console](https://console.aivax.net/) e insira sua chave de login na página de Login. O formulário de login aceita a chave como um valor de 14 caracteres e autentica você automaticamente quando a chave está completa.

Se ainda não tem uma conta, use **Register** na página de Login. O registro solicita nome completo e endereço de email, então envia um email de verificação contendo a chave de login. Use um endereço de email que possa receber mensagens operacionais da conta, pois ele pode ser usado posteriormente para avisos relacionados à conta.

Após entrar, o AIVAX abre o painel. Se você foi redirecionado para a página de login ao tentar abrir uma URL protegida do console, o console o devolve à página desejada após a autenticação.

## Entender o painel

O painel é a página inicial do console. Ele ajuda a responder duas perguntas iniciais:

- Esta é a conta correta?
- A conta está pronta para fazer requisições?

A área superior contém links para o guia de introdução e mostra requisições de exemplo para fluxos de trabalho comuns, como consulta RAG, conclusões de chat e saída JSON estruturada. Considere esses trechos como pontos de partida: substitua valores específicos da conta antes de compartilhá‑los e evite copiar capturas de tela que revelem identificadores de chave mascarados, nomes de modelo ou gateway, IDs de coleções ou outros valores específicos da conta.

Os cartões de resumo exibem sinais ao nível da conta, como saldo, gasto recente, uso de tokens e volume de requisições. Use‑os como uma verificação rápida de saúde antes de depurar um problema de produto. Por exemplo, se um cliente de chat parar de responder, confirme que a conta tem saldo utilizável antes de investigar o gateway, modelo, RAG ou configuração de integração.

A visualização de uso mostra atividade recente ao longo do tempo. Use‑a para notar picos incomuns, períodos de silêncio ou mudanças após um deployment. Para análises mais profundas, abra Analytics ou uso da conta pelo menu da conta.

## Navegar no console

A navegação à esquerda está dividida em áreas de produto:

| Área | Para que serve |
| --- | --- |
| **Home** | Revisar prontidão da conta, exemplos, resumo de uso e links rápidos. |
| **Models** | Comparar modelos hospedados e roteados disponíveis antes de escolher um diretamente ou via gateway. |
| **AI Gateways** | Configurar runtimes de assistente reutilizáveis com configurações de modelo, instruções, ferramentas, RAG, workers, habilidades e comportamento de saída. |
| **RAG Collections** | Armazenar e indexar documentos que podem ser pesquisados diretamente ou anexados a gateways. |
| **Chat clients** | Conectar um gateway a sessões de chat de usuário final e integrações de canal. |
| **Batch** | Executar um fluxo de trabalho de IA sobre muitos registros independentes de forma assíncrona. |
| **Analytics** | Inspecionar uso por recurso, modelo, rota ou dimensão da conta. |
| **Conversations** | Revisar histórico de conversas armazenado e atividade de mensagens relacionadas. |
| **Skills** | Gerenciar pacotes de instruções reutilizáveis que os gateways podem carregar durante a inferência. |
| **Instruction Store** | Navegar por ativos de instrução disponíveis para a conta, quando habilitado. |
| **Logs** | Inspecionar eventos operacionais e falhas. |
| **Memories** | Revisar registros de memória persistente criados por ferramentas ou sessões habilitadas para memória. |

Contas com acesso administrativo também podem ver **Admin**. Se uma página não estiver visível, sua conta pode não ter a função, plano ou acesso a recursos necessários.

A navegação inferior também inclui **Avi Assistant**, que abre o assistente dentro do console, e **Documentation**, que abre o site público de documentação da AIVAX.

## Usar o menu da conta

O menu da conta aparece na parte inferior da navegação à esquerda. Ele mostra o nome da conta atual e o selo do plano, então abre ações da conta:

| Ação | Quando usar |
| --- | --- |
| **Add account** | Entrar em outra conta AIVAX inserindo a chave de login de 14 caracteres dessa conta. |
| **Usage** | Abrir uso detalhado da conta e atividade de faturamento. |
| **Top up account** | Adicionar crédito pré‑pago quando a conta precisar de mais saldo. |
| **Manage account** | Atualizar perfil e configurações da conta, gerenciar chaves de API e redefinir configuração de hook‑key onde disponível. |
| **Logout** | Fazer logout da conta atual. Se outra conta salva existir no navegador, o AIVAX pode mudar para ela; caso contrário, retorna à página de entrada pública. |

Use várias contas salvas quando operar contas de cliente, staging, produção ou pessoais separadas no mesmo navegador. Antes de mudar um gateway, coleção, chave ou configuração de faturamento, confirme o nome da conta e o selo do plano no menu. Isso é especialmente importante quando contas de produção e teste têm nomes de recursos semelhantes.

Contas salvas são armazenadas no armazenamento local do navegador junto com dados de sessão. Use esse recurso apenas em navegadores privados confiáveis. Fazer logout remove a conta salva atual localmente, mas não gira chaves de login, revoga chaves de API ou invalida credenciais que já foram expostas em outro lugar.

## Abrir páginas de ajuda e status

A navegação inferior inclui **Documentation**, que abre o site público de documentação da AIVAX. O rodapé também contém links para a página de destino, documentação, política de privacidade, termos de uso e página de status do serviço.

Use links de documentação quando precisar de orientação de produto, incorporações de referência de API ou detalhes de implementação. Use a página de status quando um recurso que normalmente funciona começa a falhar em vários recursos não relacionados.

## Manter informações da conta seguras

O console pode exibir dados operacionais sensíveis, incluindo nomes de conta, chaves de API, trechos com credenciais, IDs de coleções, IDs de recursos, valores de uso e conteúdo de conversas. Antes de compartilhar uma captura de tela ou trecho copiado:

1. Remova chaves de API e chaves de login.
2. Redija IDs de recursos, nomes de clientes, conteúdo de conversas e valores privados da conta.
3. Confirme que a captura de tela não mostra outra conta salva no menu da conta.
4. Prefira linkar para a página de documentação relevante em vez de compartilhar uma captura de tela do console quando o leitor precisar apenas de instruções.

Para gerenciamento de chaves de API, veja [Create and list keys](/docs/pt-br/authentication#create-and-list-keys). Para validação de hook, veja [Hook authentication](/docs/pt-br/authentication#hook-authentication). Para verificações de saldo, limites de plano e restrições de uso, veja [Plans and limits](/docs/pt-br/limits) e [Pricing](/docs/pt-br/pricing).

## FAQ

### Uma chave de login é a mesma que uma chave de API?

Não. Uma chave de login é usada para entrar no console. Chaves de API são usadas por aplicações, SDKs, clientes MCP e integrações de backend. Mantenha ambas privadas, mas não substitua uma pela outra.

### Por que vejo páginas diferentes de outro colega?

Páginas visíveis podem variar por função, plano, disponibilidade de recursos e estado da conta. Confirme que está na mesma conta e plano antes de comparar telas.

### O que devo verificar primeiro quando algo falha?

Comece pelos fundamentos da conta e do recurso: conta atual, saldo, limites do plano, modelo ou gateway selecionado, logs recentes e se o recurso afetado existe na conta esperada. Isso geralmente separa problemas de estado da conta de questões de modelo, ferramenta, RAG ou integração.

### O que fazer se o login não funcionar?

Verifique se a chave de login tem 14 caracteres alfanuméricos e nenhum espaço antes ou depois. Se estiver se registrando, verifique a caixa de entrada e a pasta de spam do email para a mensagem de verificação. Se tentativas repetidas falharem, aguarde antes de tentar novamente e peça ao proprietário da conta ou à equipe de suporte que confirmem o caminho correto de recuperação.

### Posso compartilhar os trechos de exemplo do painel?

Apenas após remover valores específicos da conta. Os trechos do painel podem incluir identificadores de chave mascarados, nomes de modelo ou gateway e identificadores de coleção da conta ativa.

## Documentação relacionada

- [Getting Started](/docs/pt-br/getting-started): faça a primeira requisição compatível com OpenAI.
- [Authentication](/docs/pt-br/authentication): entenda a autenticação independente de login, tipos de chave e validação de hook.
- [Pricing](/docs/pt-br/pricing): entenda saldo pré‑pago e cobranças de uso.
- [Plans and limits](/docs/pt-br/limits): reveja plano, taxa, armazenamento, RAG, cliente de chat e limites de lote.
- [AI Gateways](/docs/pt-br/inference/ai-gateway): configure comportamento reutilizável de assistente.
- [RAG Collections](/docs/pt-br/rag/collections): armazene e indexe documentos para recuperação.