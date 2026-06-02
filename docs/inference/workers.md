# Workers de IA

Os workers do gateway de IA são hooks que permitem controlar o comportamento de seus recursos remotamente através de eventos.

Com um controlador externo configurado, eventos são enviados para ele, e a resposta do seu controlador define se aquela ação deve continuar, ser abortada ou configurada.

Quando um evento é acionado no lado da AIVAX, uma requisição POST é disparada ao worker configurado com informações do evento disparado. Com base em sua resposta, a ação pode ser anulada ou configurada. Não há nenhum cache - a requisição é feita em todos os eventos que ocorrem no seu gateway de IA. 

O tempo de processamento da resposta acrescenta uma latência entre toda ação do gateway, no entanto, adiciona uma camada de controle e moderação que você pode controlar à qualquer momento.

Use workers quando uma regra precisa ser decidida fora do prompt. Exemplos comuns são validar se um usuário tem assinatura ativa, anexar dados de CRM antes da inferência, remover informações que não devem chegar ao modelo, trocar uma mensagem por uma versão normalizada, impedir ferramentas em certos horários, substituir o resultado de uma ferramenta por dados de um sistema interno ou registrar auditoria em um sistema próprio. Se a regra é estável e textual, prefira instrução de sistema; se ela depende de banco de dados, política dinâmica, identidade externa ou decisão determinística, use worker.

O worker deve ser tratado como parte do caminho crítico da inferência. Cada evento enviado a ele adiciona uma requisição HTTP antes de a conversa continuar, então o endpoint precisa responder rápido, com timeout previsível e sem operações desnecessárias. Evite fazer pipelines longos, chamadas lentas ou dependências frágeis dentro do worker. Quando precisar consultar sistemas externos, prefira respostas objetivas e cache próprio no seu lado. Uma resposta 2xx deixa o fluxo continuar; uma resposta não OK interrompe o evento; uma resposta com `Content-Type: application/json+worker-action` permite alterar o contexto ou substituir resultados.

## Segurança, autenticação e operação

Quando a conta possui uma chave de hook configurada, a AIVAX envia `X-Request-Nonce` nas requisições ao worker. Esse cabeçalho contém um hash BCrypt derivado da chave de hook da conta. O worker deve validar esse hash antes de confiar no corpo recebido, principalmente se ele executa ações sensíveis, como consultar dados de clientes, alterar contexto com informações privadas ou liberar ferramentas. Consulte [Autenticação](/docs/authentication) para exemplos de validação em C#, Python e JavaScript.

O corpo do evento inclui `gatewayId`, `moment`, `event.name` e `event.data`. Sempre confira o `gatewayId` quando o mesmo endpoint atende mais de um gateway, porque isso evita aplicar regras de um agente em outro. Use `externalUserId` para decisões por usuário ou por canal, mas não presuma que ele sempre existe; chamadas diretas por API podem não ter uma tag de usuário. Use `metadata` para dados auxiliares do canal ou da sessão, e trate qualquer dado vindo do usuário como não confiável.

Para falhas, escolha um comportamento explícito. Se o worker não conseguir consultar seu sistema, ele pode responder 2xx e deixar a inferência continuar sem enriquecimento, ou pode responder não OK e bloquear a ação. A primeira opção é melhor para recursos auxiliares; a segunda é melhor para autorização, compliance e regras que não podem falhar abertas. Em ambos os casos, registre logs no seu endpoint com `gatewayId`, `event.name`, `externalUserId`, tempo de execução e decisão tomada.

## Funcionamento

Quando um evento é acionado, uma requisição POST é disparada ao seu worker seguindo o formato abaixo:

```json
{
    "gatewayId": "019a6afb-5a03-7b83-a1a2-760bd1ecd11c",
    "moment": "2025-12-29T17:04:39",
    "event": {
        "name": "message.received",
        "data": {
            "messages": [
                {
                    "role": "system",
                    "content": "User local date is Monday, December 29, 2025 (timezone is America/Sao_Paulo)"
                },
                {
                    "role": "user",
                    "content": "bom dia"
                },
                {
                    "role": "assistant",
                    "content": "Bom dia! 😊 Como posso te ajudar hoje?"
                },
                {
                    "role": "user",
                    "content": "tudo bem?"
                }
            ],
            "origin": [
                "SessionsApi"
            ],
            "externalUserId": "mini-app-session@hse075q0q5gftm6jmitvi5",
            "metadata": {}
        }
    }
}
```

O exemplo acima ilustra uma mensagem do evento `message.received` com os seus argumentos do evento.

## Tipos de resposta

Após o envio da requisição, a AIVAX aguarda a resposta do seu worker. Existem três tipos de resposta possíveis:

| Resposta | Comportamento |
|----------|---------------|
| **Resposta OK (2xx)** | Continua e prossegue com a execução normal do evento. |
| **Outras respostas** | Aborta e interrompe a execução do evento. |
| **Content-Type `application/json+worker-action`** | Executa as ações especificadas na resposta e continua com a execução. |

## Eventos

Atualmente, os eventos que podem ser enviados para seu worker são:

### `message.received`

Enviado quando uma mensagem é recebida pelo gateway. Esse evento é acionado com todo o histórico de mensagens da conversa.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": ["SessionsApi"],
        "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1",
        "metadata": {}
    }
}
```

#### Ações disponíveis

Para executar ações no evento `message.received`, retorne uma resposta com o header `Content-Type: application/json+worker-action` e o corpo no formato:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            // lista de ações
        ]
    }
}
```

As ações disponíveis para o campo `rewrites` são:

| Ação | Descrição | Parâmetros |
|------|-----------|------------|
| `clear` | Remove todas as entidades especificadas do contexto. | `argument`: a entidade que será removida. Pode ser `messages`, `meta`, `system`, `tools`, `skills` ou `all`. Padrão para `all` quando nulo. |
| `add-message` | Adiciona uma mensagem ao contexto. | `message`: objeto de mensagem OpenAI-compatível (ex: `role` e `content`) |
| `remove-message` | Remove uma mensagem do contexto pelo índice. | `index`: índice da mensagem a ser removida |
| `add-system` | Adiciona uma instrução de sistema. | `message`: texto da instrução |
| `add-tool` | Adiciona uma ferramenta ao contexto. | `tool`: objeto JSON da ferramenta |
| `add-protocol-tool` | Adiciona uma definição de [protocol function](/docs/tools/protocol-functions) ao contexto. | `tool`: objeto definição da protocol function|

##### Exemplos de ações

**Limpar e adicionar mensagem:**

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "clear"
            },
            {
                "type": "add-message",
                "message": {
                    "role": "user",
                    "content": "Mensagem substituída pelo worker."
                }
            }
        ]
    }
}
```

**Adicionar instrução de sistema:**

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-system",
                "message": "Responda sempre em português formal."
            }
        ]
    }
}
```

**Remover mensagem por índice:**

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "remove-message",
                "index": 0
            }
        ]
    }
}
```

### `tool.called`

Enviado quando uma ferramenta interna do servidor está prestes a ser executada.

```json
{
  "name": "tool.called",
  "data": {
    "toolName": "memory_search",
    "toolArguments": {
      "query": "preferências do usuário"
    },
    "origin": "SessionsApi",
    "externalUserId": "mini-app-session@lot1xc9k03g2my3j4w2y1",
    "metadata": {}
  }
}
```

#### Ações disponíveis

Para executar ações no evento `tool.called`, retorne uma resposta com o header `Content-Type: application/json+worker-action` e o corpo no formato:

```json
{
  "type": "tool.called.response",
  "data": {
    "result": "Resultado textual da ferramenta.",
    "messages": []
  }
}
```

Campos de `data`:

| Campo | Descrição |
|-------|-----------|
| `result` | Conteúdo textual injetado como resultado da ferramenta. |
| `messages` | Lista opcional de mensagens adicionais no formato OpenAI anexadas ao contexto da conversa. |

Quando `tool.called.response` é retornado, o resultado fornecido pelo worker é usado no lugar da execução padrão da ferramenta.

## Exemplos de uso

Os exemplos abaixo mostram padrões comuns. Eles devem ser adaptados para seu sistema de autenticação, sua estrutura de usuários e seu canal. O ponto mais importante é separar claramente a decisão: responder não OK quando a ação deve parar, responder 2xx vazio quando ela deve continuar sem alterações, ou responder `application/json+worker-action` quando o contexto deve ser modificado.

### Bloqueando usuários não autorizados

O exemplo abaixo ilustra um [Cloudflare Worker](https://workers.cloudflare.com/) que autentica uma conversa no Telegram com base no nome de usuário:

```js
export default {
  async fetch(request, env, ctx) {
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";
    const ALLOWED_USERNAMES = ["myusername"];

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      if (gatewayId === CHECKING_GATEWAY_ID &&
        event.name == "message.received" &&
        event.data.externalUserId?.startsWith("zp_telegram:")) {
        
        const telegramUsername = event.data.externalUserId.split(':')[0].split('@')[0];

        if (!ALLOWED_USERNAMES.includes(telegramUsername)) {
          return new Response("User is not authed", { status: 400 });
        }
      }
    }

    return new Response();
  }
};
```

### Interceptando e modificando mensagens

O exemplo abaixo demonstra como interceptar uma mensagem e substituí-la por outra quando o usuário não está autorizado:

```js
export default {
  async fetch(request, env, ctx) {
    const CHECKING_GATEWAY_ID = "0197dda5-985f-7c76-96e5-0d0451c596e5";

    if (request.method == "POST") {
      const requestData = await request.json();
      const { event, gatewayId } = requestData;

      if (gatewayId === CHECKING_GATEWAY_ID && event.name == "message.received") {
        const userIsPaid = await checkUserSubscription(event.data.externalUserId);

        if (!userIsPaid) {
          return new Response(JSON.stringify({
            type: "message.received.response",
            data: {
              rewrites: [
                { type: "clear" },
                {
                  type: "add-message",
                  message: {
                    role: "user",
                    content: "O usuário enviou uma mensagem mas ela foi excluída pelo sistema. Informe ao usuário que ele não pagou sua assinatura mensal para continuar."
                  }
                }
              ]
            }
          }), {
            headers: { "Content-Type": "application/json+worker-action" }
          });
        }
      }
    }

    return new Response();
  }
};

async function checkUserSubscription(externalUserId) {
  // Implemente sua lógica de verificação de assinatura aqui
  return true;
}
```

### Substituindo uma ferramenta por um sistema interno

O evento `tool.called` é útil quando você quer que o modelo continue acreditando que chamou uma ferramenta, mas o resultado real venha de um sistema controlado por você. Por exemplo, um gateway pode ter uma ferramenta chamada `memory_search`, `check_order` ou `lookup_customer`; antes da AIVAX executar o comportamento padrão, seu worker pode reconhecer o nome da ferramenta, consultar sua API interna e devolver um resultado textual para ser anexado à conversa.

```js
export default {
  async fetch(request, env) {
    const body = await request.json();

    if (body.event?.name !== "tool.called") {
      return new Response();
    }

    const { toolName, toolArguments, externalUserId } = body.event.data;

    if (toolName !== "check_order") {
      return new Response();
    }

    const orderId = toolArguments?.order_id;
    const order = await fetch(`${env.INTERNAL_API}/orders/${orderId}`, {
      headers: { "Authorization": `Bearer ${env.INTERNAL_API_TOKEN}` }
    });

    if (!order.ok) {
      return new Response(JSON.stringify({
        type: "tool.called.response",
        data: {
          result: `Não foi possível consultar o pedido ${orderId} para o usuário ${externalUserId}. Oriente o usuário a conferir o número do pedido.`
        }
      }), {
        headers: { "Content-Type": "application/json+worker-action" }
      });
    }

    const orderJson = await order.json();

    return new Response(JSON.stringify({
      type: "tool.called.response",
      data: {
        result: `Pedido ${orderJson.id}: status ${orderJson.status}, previsão ${orderJson.eta}.`
      }
    }), {
      headers: { "Content-Type": "application/json+worker-action" }
    });
  }
};
```

Esse padrão evita expor diretamente a API interna ao modelo. O modelo vê apenas o nome da ferramenta, os parâmetros e o resultado textual. O worker continua sendo responsável por autenticar a requisição, validar o usuário, chamar o sistema interno e decidir quanto dado pode voltar para o contexto.
