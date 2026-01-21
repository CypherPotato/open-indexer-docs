# Chat Clients

Um cliente de chat provê uma interface de usuário através de um [AI Gateway](/docs/entities/ai-gateway) que permite o usuário conversar com sua assistente. Um chat client é integrado à inferência do AI gateway e dá suporte para pensamento profundo, pesquisa e conversa por texto. Recursos multi-modais, como envio de imagens e áudio estão em desenvolvimento.

Você pode personalizar a interface do seu chat client com CSS e JavaScript personalizado, além de poder escolher a linguagem dos recursos do chat.

## Criar uma sessão de chat

Uma sessão de chat é onde você cria uma conversa entre seu chat client e o usuário. Você pode chamar esse endpoint informando contexto adicional para conversa, como o nome do usuário, onde ele está, etc.

Uma sessão de chat expira após algum tempo por segurança do token de acesso gerado. Quando você chama esse endpoint informando uma `tag` você pode chamar o mesmo endpoint várias vezes e obter a sessão de chat que está ativa para a tag informada, ou criar um chat novo se não existir uma sessão em andamento.

Quando uma sessão é encontrada no cliente de chat através da `tag` informada, a sessão é renovada pelo período informado e o contexto é atualizado.

Uma sessão de chat também restaura todas as mensagens da conversa da mesma sessão após desconexão. O usuário pode limpar a conversa ao clicar no botão de limpar conversa no canto superior direito do cliente de chat. Essa sessão usa os limites definidos pelo cliente de chat, como máximo de mensagens e tokens na conversa.

Se uma sessão estiver próxima de expirar, ela é renovada por mais 20 minutos na próxima mensagem do usuário.

Para detalhes sobre como criar uma sessão de chat, consulte o endpoint [Create Web Chat Session](https://inference.aivax.net/apidocs#CreateWebChatSession).

## Sessões de integrações

A AIVAX fornece duas integrações para clientes de chat: Telegram e WhatsApp (através do [Z-Api](https://www.z-api.io/)). Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa ou número de telefone do usuário.

Essas sessões obedecem as regras do chat client original. Além disso, sessões de chat nessas integrações possuem dois comandos especiais:

- `/reset`: limpa o contexto atual da sessão.
- `/usage`: quando `debug` está ativo no chat client, exibe o uso atual do chat em tokens.