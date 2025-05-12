# Chat Clients

Um cliente de chat provê uma interface de usuário através de um [AI Gateway](/docs/entities/ai-gateway) que permite o usuário conversar com sua assistente. Um chat client é integrado à inferência do AI gateway e dá suporte para pensamento profundo, pesquisa e conversa por texto. Recursos multi-modais, como envio de imagens e áudio estão em desenvolvimento.

> [!NOTE]
>
> A Open Indexer nunca armazena o conteúdo de um chat entre um cliente e o usuário. Você pode usar JavaScript para essa tarefa, mas sob sua responsabilidade de uso e armazenamento.

Você pode personalizar a interface do seu chat client com CSS e JavaScript personalizado, além de poder escolher a linguagem dos recursos do chat.

## Criando um chat client

Cria um novo chat client.

<div class="request-item get">
    <span>POST</span>
    <span>
        /api/v1/web-chat-client/
    </span>
</div>

```json
{
    // Especifica o nome público do seu chat client
    "name": "Minha assistente",
    
    // Especifica o ID do gateway de IA que será usado pelo chat
    "aiGatewayId": "01965b64-a8eb-716c-892d-880159a9f12d",

    "clientParameters": {
        
        // Opcional. Especifica o código da linguagem que será usada no chat para maioria dos elementos, como mensagens de erro, botões, etc.
        //      Valores: pt-BR, en
        "languageCode": "pt-BR" | "en",

        // Opcional. Especifica um código JavaScript para executar no chat.
        "customScripts": null,

        // Opcional. Especifica um código CSS para aplicar estilos customizados no chat.
        "customStyles": null,

        // Opcional. Especifica a cor de realce dos elementos do chat client.
        "primaryColor": "#eabe44",

        // Opcional. Especifica o título da página de chat.
        "pageTitle": "Assistente",

        // Opcional. Especifica o título ao entrar no chat pela primeira vez.
        "helloLabel": "É ótimo ver você aqui.",

        // Opcional. Especifica o sub-título ao entrar no chat pela primeira vez.
        "helloSubLabel": "Sou a sua assistente.",
        
        // Opcional. Especifica o placeholder do campo de enviar mensagem.
        "textAreaPlaceholder": "Falar com a assistente",

        // Opcional. Especifica uma imagem/logo para exibir no chat pela primeira vez.
        "logoImageUrl": null,
        
        // Opcional. Ativa recursos de depuração.
        "debug": true,
        
        // Opcional. Especifica quais origens devem ser permitidas para embutir o cliente de chat em um iframe. Se esse campo estiver vazio, qualquer origem será aceita.
        "allowedFrameOrigins": ["https://my-domain.com.br"],
        
        // Opcional. Especifica botões de sugestão de conversa ao iniciar uma nova sessão de chat. Você pode adicionar quantos botões quiser, mas o aconselhável é até 3 botões.
        "suggestionButtons": [
            {
                // Título que será exibido no botão.
                "label": "Como comprar um carro?",
                // Prompt que será enviado para o modelo.
                "prompt": "Onde e como posso comprar um carro na sua loja?"
            },
            ...
        ]
    },
    
    "limitingParameters": {
        
        // Opcional. Especifica quantas mensagens o usuário pode enviar por hora no chat. Essa opção é rastreada pelo userTag da sessão.
        "messagesPerHour": 30,
        
        // Opcional. Especifica o máximo de tokens que uma mensagem do usuário pode conter. Esse campo só é válido quando usado em modelos integrados ao Open Indexer.
        "userInputMaxTokens": 1024,
        
        // Opcional. Especifica o limite de mensagens (para o usuário e IA) que uma sessão pode ter.
        "maxMessages": 300
    }
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        "id": "01965b65-e95e-7795-848c-ff0919ef1436"
    }
}
```

## Editando um chat client

O corpo dessa requisição é exatamente igual ao de criar um chat client.

<div class="request-item get">
    <span>PUT</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": "Web client updated successfully.",
    "data": null
}
```

## Listando os chat clients

Obtém uma lista dos chat clients criados.

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/web-chat-client/
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": [
        {
            "id": "01965b59-daf6-7809-94c8-2a65b7264dba",
            "name": "Meu chat client"
        },
        ...
    ]
}
```

## Vendo um chat client específico

Obtém detalhes de um chat client existente.

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/web-chat-client/<span>{chat-client-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": {
        "name": "Meu chat client",
        "aiGateway": {
            "id": "01965b59-49ff-7753-8327-b3b6a6a871f2",
            "name": "gateway-t1",
            "knowledgeCollection": {
                "id": "01965b54-7fbd-70cd-982b-604de002ac0a",
                "name": "Informações sobre carros"
            }
        },
        "limitingParameters": {
            "messagesPerHour": 30,
            "userInputMaxTokens": 1024,
            "maxMessages": 500
        },
        "clientParameters": {
            "languageCode": "pt-BR",
            "customScripts": null,
            "customStyles": null,
            "primaryColor": "#f011d2",
            "pageTitle": "Lyra",
            "helloLabel": "É ótimo ver você aqui.",
            "helloSubLabel": "Sou sua assistente.",
            "textAreaPlaceholder": "Falar com a assistente",
            "logoImageUrl": null,
            "debug": true,
            "allowedFrameOrigins": []
        }
    }
}
```

## Criar uma sessão de chat

Uma sessão de chat é onde você cria uma conversa entre seu chat client e o usuário. Você pode chamar esse endpoint informando contexto adicional para conversa, como o nome do usuário, onde ele está, etc.

Uma sessão de chat expira após algum tempo por segurança do token de acesso gerado. Quando você chama esse endpoint informando uma `tag` você pode chamar o mesmo endpoint várias vezes e obter a sessão de chat que está ativa para a tag informada, ou criar um chat novo se não existir uma sessão em andamento.

Uma sessão de chat também restaura todas as mensagens da conversa da mesma sessão após desconexão. O usuário pode limpar a conversa ao clicar no botão de limpar conversa no canto superior direito do cliente de chat. Essa sessão usa os limites definidos pelo cliente de chat, como máximo de mensagens e tokens na conversa.

Uma sessão é automaticamente renovada por mais 3 dias ao receber uma mensagem do usuário.

> [!IMPORTANT]
>
> Só é possível determinar a quantidade de tokens usados em uma mensagem ao usar um [modelo provido pela Open Indexer](/docs/models). Se você usar um modelo externo, a propriedade `limitingParameters.userInputMaxTokens` será ignorada.

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