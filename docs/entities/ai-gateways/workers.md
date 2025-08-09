# Workers de IA

Os workers do gateway de IA são recursos do [Gateways de IA](/docs/entities/ai-gateways/ai-gateway) que permitem controlar o comportamento de seus recursos remotamente através de eventos.

Com um controlador externo configurado, eventos são enviados para ele, e a resposta do seu controlador define se aquela ação deve continuar, ser abortada ou configurada.

Quando um evento é acionado no lado da AIVAX, uma requisição POST é disparada ao worker configurado com informações do evento disparado. Com base em sua resposta, a ação pode ser anulada ou configurada. Não há nenhum cache - a requisição é feita em todos os eventos que ocorrem no seu gateway de IA. 

O tempo de processamento da resposta acrescenta uma latência entre toda ação do gateway, no entanto, adiciona uma camada de controle e moderação que você pode controlar à qualquer momento.

## Criando um worker de IA

Quando um evento é acionado, uma requisição POST é disparada ao seu worker seguindo o formato abaixo:

```json
{
  "gatewayId": "0197dda5-985f-7d76-96e5-0d0451c539f6",
  "moment": "2025-08-09T00:21:40",
  "event": {
    "name": "message.received",
    "data": {
      "message": {
        "role": "user",
        "content": "Bom dia!"
      },
      "origin": [
        "SessionsApi"
      ],
      "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1"
    }
  }
}
```

O exemplo acima ilustra uma mensagem do evento `message.received` com os seus argumentos do evento.

Após o envio da requisição, a AIVAX aguarda a resposta do seu worker, e com ela:
- Resposta OK (2xx): **continua** e prossegue com a execução normal do evento.
- Outras respostas: **aborta** e interrompe a execução do evento.

## Lista de eventos

Atualmente, os eventos que podem ser enviados para seu worker são:

- `message.received` - enviado quando uma mensagem é recebida pelo gateway. Esse evento é acionado com a última mensagem recebida no contexto, o que pode ser do usuário ou não.

```js
{
    "name": "message.received",
    "data": {
      "message": {}, // chat/completions message entity
      "origin": [
        "SessionsApi" // message origin
      ],
      "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1"
    }
  }
```

## Exemplo

O exemplo abaixo ilustra um [Cloudflare Worker](https://workers.cloudflare.com/) que autentica uma conversa no Telegram com base no nome de usuário da converça:

```js
export default {
  
  async fetch(request, env, ctx) {
    
    // O ID do gateway que estamos esperando lidar
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";
    const ALLOWED_USERNAMES = [
      "myusername"
    ];

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      // Verifica se é um evento de mensagem recebida, se é o gateway que estamos
      // gerenciando no worker e se essa mensagem vem de um chat do Telegram
      if (gatewayId === CHECKING_GATEWAY_ID &&
        event.name == "message.received" &&
        event.data.externalUserId?.startsWith("zp_telegram:")) {
        
        // obtém o username do telegram, que está entre o ':' e o '@' do externalUserId
        const telegramUsername = event.data.externalUserId.split(':')[0].split('@')[0];

        // verifica se o usuário é permitido na integração
        if (!ALLOWED_USERNAMES.includes(telegramUsername)) {

          // o usuário não existe na lista de usernames permitidos, logo, retorna uma resposta não-ok
          // indicando que a mensagem não deve ser enviada
          return new Response("User is not authed", { status: 400 });
        }
      }
    }

    // continua com a execução
    return new Response();
  }
};
```