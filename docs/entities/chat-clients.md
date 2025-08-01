# Chat Clients

Um cliente de chat provê uma interface de usuário através de um [AI Gateway](/docs/entities/ai-gateway) que permite o usuário conversar com sua assistente. Um chat client é integrado à inferência do AI gateway e dá suporte para pensamento profundo, pesquisa e conversa por texto. Recursos multi-modais, como envio de imagens e áudio estão em desenvolvimento.

> [!NOTE]
>
> A AIVAX nunca armazena o conteúdo de um chat entre um cliente e o usuário. Você pode usar JavaScript para essa tarefa, mas sob sua responsabilidade de uso e armazenamento.

Você pode personalizar a interface do seu chat client com CSS e JavaScript personalizado, além de poder escolher a linguagem dos recursos do chat.

## Criar uma sessão de chat

Uma sessão de chat é onde você cria uma conversa entre seu chat client e o usuário. Você pode chamar esse endpoint informando contexto adicional para conversa, como o nome do usuário, onde ele está, etc.

Uma sessão de chat expira após algum tempo por segurança do token de acesso gerado. Quando você chama esse endpoint informando uma `tag` você pode chamar o mesmo endpoint várias vezes e obter a sessão de chat que está ativa para a tag informada, ou criar um chat novo se não existir uma sessão em andamento.

Uma sessão de chat também restaura todas as mensagens da conversa da mesma sessão após desconexão. O usuário pode limpar a conversa ao clicar no botão de limpar conversa no canto superior direito do cliente de chat. Essa sessão usa os limites definidos pelo cliente de chat, como máximo de mensagens e tokens na conversa.

Uma sessão é automaticamente renovada por mais 3 dias ao receber uma mensagem do usuário.

> [!IMPORTANT]
>
> Só é possível determinar a quantidade de tokens usados em uma mensagem ao usar um [modelo provido pela AIVAX](/docs/models). Se você usar um modelo externo, a propriedade `limitingParameters.userInputMaxTokens` será ignorada.

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>/sessions
    </span>
</div>

```json
{
    // Opcional. Contexto adicional para a IA sobre o chat.
    "extraContext": "# Contexto adicional\r\n\r\nVocê está falando com Eduardo.",
    
    // Tempo em segundos para o chat expirar. O mínimo é 10 minutos. O máximo é 30 dias.
    "expires": 3600,

    // Opcional (recomendado). Um id externo para identificar a sessão posteriormente e reaproveitá-la sempre que chamar o mesmo endpoint. Pode ser o ID do usuário do seu banco de dados ou uma string que facilite a identificação desse chat posteriormente.
    "tag": "my-user-tag"
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        // ID da sessão de chat criada.
        "sessionId": "01966f0b-172d-7bbc-9393-4273b86667d2",

        // Chave pública de acesso do chat.
        "accessKey": "wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe",

        // A URL pública para conversar com o chat.
        "talkUrl": "https://preview-s01.proj.pw/www/web-chat-clients/wky_gr5uepjsgrhuqcj3aaat1iagrsmozwr9gghusnnu6zjhrsyures5xoe"
    }
}
```