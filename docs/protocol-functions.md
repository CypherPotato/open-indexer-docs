# Funções do lado do servidor

As funções de protocolo da AIVAX, ou _server-side functions_, é uma implementação em que a chamada de ferramentas do modelo ocorre do lado do servidor. Similar ao MCP, mas com suporte nativo à autenticação e otimizado para funcionar externamente.

As funções de protocolo permitem a tomada de ações no lado do servidor da AIVAX, removendo a necessidade de implementação da função no lado do cliente e integrando com aplicações e serviços existentes.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

Essas funções esperam um **callback** através de uma URL, e quando o modelo decide chamar a função, o callback é acessado com os parâmetros informados pela própria assistente. A assistente não sabe qual URL ela está chamando, pois a mesma permanece invisível tanto para a assistente quanto para o usuário.

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico ao que essa função faz. Evite nomes difíceis de advinhar ou que não remetam ao papel da função, pois a assistente pode se confundir e não chamar a função quando apropriado.

Como um exemplo, vamos pensar em uma função de consultar um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos para considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (pouco abrangente)
- `query-user-in-database-data` (nome muito grande)
- `pesquisa-usuario` (nome não em inglês)
- `search user` (nome com caracteres impróprios)

Tendo o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função.

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando deve ser chamada pela assistente. Essa descrição deve incluir os cenários que a assistente deve considerar chamar ela e quando não deve ser chamada, fornecendo poucos exemplos de chamadas (one-shot) e/ou tornando explícitas as regras da função.

## Definindo funções de protocolo

Essas funções são definidas no [AI-gateway](/entities/ai-gateway.md), o que permite a criação de agentes inteligentes que realizam ações sem intervenção humana. Elas seguem uma sintaxe simples, esperam o nome da função, uma descrição do que ela faz e os parâmetros de invocação.

Funções de protocolo são definidas no AI gateway seguindo o JSON:

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctions": [
            {
                "name": "list_clients",
                "description": "Use essa ferramenta para listar e procurar pelos clientes do usuário.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": null
            },
            {
                "name": "view_client",
                "description": "Use essa ferramenta para obter detalhes e pedidos de um cliente através do seu ID.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "format": "uuid"
                        }
                    },
                    "required": ["user_id"]
                }
            }
        ]
    }
}
```

No snippet acima, você está fornecendo duas funções para seu modelo de IA: `list_clients` e `view_client`, o qual irá decidir qual será executada durante o seu raciocínio. Você pode fornecer também um formato de conteúdo JSON para qual o modelo irá chamar sua API fornecendo o contéudo informado.

Você também pode definir as lista de funções suportadas através de um endpoint. Toda vez que o modelo receber uma mensagem, ele irá consultar o endpoint fornecido para obter uma lista de funções que ele possa executar.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Defina os endpoints de listagem de funções no seu AI gateway:

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/ai-gateways
    </span>
</div>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctionSources": [
            "https://my-external-api.com/api/scp/listings"
        ]
    }
}
```

Os endpoint de fornecimento de funções deve responder seguindo o formato:

<div class="request-item post">
    <span>GET</span>
    <span>
        https://my-external-api.com/api/scp/listings
    </span>
</div>

```json
{
    "functions": [
        {
            "name": "list_clients",
            "description": "Use essa ferramenta para listar e procurar pelos clientes do usuário.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": null
        },
        {
            "name": "view_client",
            "description": "Use essa ferramenta para obter detalhes e pedidos de um cliente através do seu ID.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "format": "uuid"
                    }
                },
                "required": ["user_id"]
            }
        }
    ]
}
```

Essas funções são armazenadas em cache por 10 minutos antes de uma nova requisição ser feita no endpoint fornecido.

### Lidando com chamada de funções

As funções são invocadas no endpoint fornecido em `callbackUrl` através de uma requisição HTTP POST, com o corpo:

```json
{
    "function": {
        "name": "view_client",
        "content": {
            "user_id": "3e5a2823-98fa-49a1-831a-0c4c5d33450e"
        }
    },
    "context": {
        "externalUserId": "...",
        "moment": "2025-05-18T03:36:27"
    }
}
```

A resposta dessa ação deve responder sempre com um status HTTP OK (2xx ou 3xx), até mesmo para erros que a assistente possa ter cometido. Uma resposta não OK irá indicar para a assistente que não foi possível chamar a função e ela não irá continuar com o que estava planejando fazer.

#### Formato das respostas

As respostas bem sucedidas devem ser textuais e serão anexadas como resposta da função do jeito que for respondida pelo endpoint. Não há formato JSON ou estrutura para essa resposta, mas é aconselhável que dê uma resposta simples, humanamente legível, para que a assistente consiga ler o resultado da ação.

Erros podem ser comuns, como não encontrar um cliente pelo ID ou algum campo não estiver no formato desejado. Nestes casos, responda com um status OK e no corpo da resposta inclua uma descrição humana do erro e como a assistente pode contornar ele.

**É garantido** que a requisição irá seguir estritamente o JSON Schema do conteúdo fornecido pela definição da função. Funções que não esperam argumentos não devem especificar um formato de conteúdo para essa função.

> [!IMPORTANT]
>
> Quanto mais funções você definir, mais de entrada tokens você irá consumir no processo de raciocínio. A definição da função, bem como o formato dela, consome tokens do processo de raciocínio.

#### Autenticação

A autenticação das requisições são feitas pelo cabeçalho `X-Aivax-Nonce` enviado em todas as requisições de protocolo das funções, até mesmo as de listagem.

Veja o manual de [autenticação](/docs/authentication) para entender como autenticar requisições reversas do AIVAX.

#### Autenticação de usuário

As chamadas de função enviam um campo `$.context.externalUserId` contendo a tag de usuário criada em uma [sessão de chat](/docs/entities/chat-clients). Essa tag pode ser usada para autenticar o usuário que chamou essa função.

#### Considerações de segurança

Para o modelo de IA, somente é visível o nome, descrição e formato da função. Ela não é capaz de ver o endpoint para onde essa função aponta. Além disso, ela não possui acesso à tag do usuário que está autenticado em um [cliente de chat](/docs/entities/chat-clients).

## Funções especialistas

Além das [funções embutidas](/docs/builtin-tools), você pode definir funções especialistas, que executam tarefas específicas na sua conta da AIVAX.

Você define funções especialistas pelo esquema de URL `aivax://`, seguindo o exemplo abaixo:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        ...
        "protocolFunctions": [
            {
                "name": "search_disease",
                "description": "Use essa ferramenta para pesquisar por doenças, tratamentos e sintomas.",
                "callbackUrl": "aivax://query-collection?collection-id=0196f5ef-9334-742b-a988-f913bb3be5ba&top=5&min=0.4",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Nome da doença, tratamento ou sintomas."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            }
        ]
    }
}
```

A função acima cria uma ferramenta para IA consultar em uma [coleção de documentos](/docs/entities/collections) específica, guiando a assistente do que ela deve pesquisar nessa coleção e o que esperar de uma resposta. Dessa forma, você pode vincular várias coleções de RAG para uma assistente poder buscar conteúdo especialista.

Você pode personalizar a descrição das propriedades do JSON Schema de funções especialistas mas não sua estrutura, pois nosso backend espera um formato específico para chamar as funções. Os parâmetros de funções especialistas são fornecidos na URL através de parâmetros da query.

Atualmente, apenas uma função especialista existe:
- `query-collection`: executa uma pesquisa RAG em uma coleção informada.
    Parâmetros da query:
    - `collection-id`: o UUID da coleção que será pesquisada.
    - `top`: um número indicando quantos documentos devem ser retornados na pesquisa.
    - `min`: um decimal indicando qual a pontuação mínima de similaridade da busca.

    Formato JSON da função:
    ```json
    {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Conteúdo da pesquisa."
            }
        },
        "required": [
            "query"
        ]
    }
    ```