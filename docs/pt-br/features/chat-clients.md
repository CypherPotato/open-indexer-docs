# Chat Clients

Um cliente de chat provê uma interface de usuário através de um [AI Gateway](/docs/pt-br/inference/ai-gateway) que permite o usuário conversar com sua assistente. Um chat client é integrado à inferência do AI gateway e dá suporte para pensamento profundo, pesquisa, conversa por texto e envio de imagens. Recursos de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do seu chat client com CSS e JavaScript personalizado, além de poder escolher a linguagem dos recursos do chat.

## Como o chat client funciona

Um chat client é uma camada de sessão em cima de um AI Gateway. O gateway define o comportamento da assistente; o chat client define como um usuário final conversa com ela, como a sessão é identificada, quanto tempo ela dura, quais limites são aplicados, quais recursos visuais aparecem e como mensagens entram e saem por canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, em um widget web, no Telegram e no WhatsApp, mas cada canal terá regras próprias de identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém histórico de mensagens, contexto adicional, metadados, token de conversa e uma identificação externa opcional. Quando você cria uma sessão com `tag`, a AIVAX tenta reutilizar a sessão ativa daquela tag em vez de criar uma conversa nova. Isso permite que um usuário volte ao widget ou envie outra mensagem pelo mesmo canal sem perder o contexto imediatamente. Quando a sessão não tem `tag`, ela funciona como uma conversa avulsa controlada pelo token de acesso gerado na criação.

A `tag` também é o ponto de conexão entre chat client, memória, calendário, workers e integrações. Ferramentas como memória precisam de um identificador estável para saber a quem pertence uma preferência ou informação persistente. Workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. Integrações de WhatsApp e Telegram usam a identificação da conversa, telefone ou usuário para recuperar a sessão correta. Por isso, escolha uma `tag` estável, não sensível e única por usuário ou conversa.

## Criar uma sessão de chat

Uma sessão de chat é onde você cria uma conversa entre seu chat client e o usuário. Você pode chamar esse endpoint informando contexto adicional para conversa, como o nome do usuário, onde ele está, etc.

Uma sessão de chat expira após algum tempo por segurança do token de acesso gerado. Quando você chama esse endpoint informando uma `tag` você pode chamar o mesmo endpoint várias vezes e obter a sessão de chat que está ativa para a tag informada, ou criar um chat novo se não existir uma sessão em andamento.

Quando uma sessão é encontrada no cliente de chat através da `tag` informada, a sessão é renovada pelo período informado e o contexto é atualizado.

Uma sessão de chat também restaura todas as mensagens da conversa da mesma sessão após desconexão. O usuário pode limpar a conversa ao clicar no botão de limpar conversa no canto superior direito do cliente de chat. Essa sessão usa os limites definidos pelo cliente de chat, como máximo de mensagens e tokens na conversa.

Se uma sessão estiver próxima de expirar, ela é renovada por mais 20 minutos na próxima mensagem do usuário.

Para detalhes sobre como criar uma sessão de chat, consulte o endpoint [Create Web Chat Session](https://inference.aivax.net/apidocs#CreateWebChatSession).

Ao criar uma sessão, use o contexto adicional para informações que ajudam a assistente naquela conversa, mas que não devem virar memória permanente: nome exibido, plano do cliente, idioma preferido, página de origem, produto que o usuário está vendo, número do pedido ou estado atual de um fluxo. Não use esse campo para segredos, tokens internos ou dados que o modelo não deveria ver. O contexto adicional entra na inferência e pode influenciar respostas, ferramentas e workers.

O chat web aceita mensagens de texto e anexos. Imagens são encaminhadas como conteúdo multimodal quando o modelo ou o pipeline suporta. Áudio pode ser enviado como entrada multimodal em clientes compatíveis e também pode ser sintetizado como resposta quando a configuração de síntese de áudio do chat client está ativa. Arquivos e vídeos dependem do tipo de cliente, do modelo escolhido e do processamento multimodal configurado no gateway. Quando o canal não suporta um anexo, a integração deve transformar o evento em uma mensagem textual informando que o usuário enviou um conteúdo não suportado, para que a assistente responda de maneira clara.

## Sessões de integrações

A AIVAX fornece integrações para clientes de chat por Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa ou número de telefone do usuário.

Essas sessões obedecem as regras do chat client original. Além disso, sessões de chat nessas integrações possuem dois comandos especiais:

- `/reset`: limpa o contexto atual da sessão.
- `/usage`: quando `debug` está ativo no chat client, exibe o uso atual do chat em tokens.

As integrações tratam o canal como origem de mensagens, mas a inferência continua sendo executada pelo AI Gateway associado ao chat client. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor possui detalhes próprios de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para chegar ao mesmo objetivo operacional. Em todos os casos, mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com a inferência e a resposta da assistente é enviada de volta pelo mensageiro da integração.

Use Telegram quando você precisa de um bot simples, com usuários identificáveis por chat e comandos fáceis de testar. Use WhatsApp quando o canal principal de atendimento do usuário já é o telefone e quando a conversa precisa acontecer em um aplicativo cotidiano. Use o widget web quando você quer incorporar a assistente em um site, produto, central de suporte ou painel. A escolha do canal não deve mudar o conteúdo essencial do gateway, mas pode exigir ajustes de tom, tamanho de resposta, formatação e tolerância a anexos.

Para produção, configure limites no chat client antes de liberar o canal ao público. Limites de mensagens por hora, máximo de mensagens no histórico e tempo de sessão ajudam a controlar custo, abuso e crescimento de contexto. Ative comandos de debug apenas para testes internos. Se a assistente usa memória, explique ao usuário quando informações podem ser lembradas e evite salvar dados sensíveis. Se usa workers, use o `externalUserId` para aplicar bloqueios, regras de assinatura, enriquecimento de perfil ou auditoria sem colocar essa lógica nas instruções do modelo.

Quando uma integração não responde como esperado, diagnostique em ordem: confirme se o chat client está associado ao gateway correto, verifique se a integração está salva com os parâmetros certos, envie uma mensagem simples sem anexo, confirme se a sessão foi criada ou reutilizada pela tag, veja se há limite de mensagens por hora, confira saldo da conta e só então investigue modelo, ferramentas e RAG. Essa ordem reduz confusão porque separa problemas de canal, sessão, cobrança e inferência.
