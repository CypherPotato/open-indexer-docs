# Funções de protocolo

As funções de protocolo da AIVAX, ou _server-side functions_, é uma implementação customizada de chamadas de função criada pela AIVAX que permite que o modelo siga estritamente um contexto de função que não é baseada em documentos JSON. Esse recurso é disponível para modelos com [raciocínio Sentinel](/docs/sentinel).

As funções de protocolo permitem a tomada de ações no lado do servidor da AIVAX, removendo a necessidade de implementação da função no lado do cliente e integrando com aplicações e serviços existentes.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

Essas funções esperam um **callback** através de uma URL, e quando o modelo decide chamar a função, o callback é acessado com os parâmetros informados pela própria assistente. A assistente não sabe qual URL ela está chamando, pois a mesma permanece invisível tanto para a assistente quanto para o usuário.

## Definindo funções de protocolo

Essas funções são definidas no [AI-gateway](/entities/ai-gateway.md), o que permite a criação de agentes inteligentes que realizam ações sem intervenção humana. Elas seguem uma sintaxe simples, esperam o nome da função, uma descrição do que ela faz e os parâmetros de invocação.

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico ao que essa função faz. Evite nomes difíceis de advinhar ou que não remetam ao papel da função, pois a assistente pode se confundir e não chamar a função quando apropriado.

Como um exemplo, vamos pensar em uma função de consultar um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos para considerar para a chamada:

- `search-user`
- `query-user`
- `search_user`

Nomes ruins incluem:

- `search` (pouco abrangente)
- `query-user-in-database-data` (nome muito grande)
- `pesquisa-usuario` (nome não em inglês)
- `search user` (nome com caracteres impróprios)

Tendo o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função.

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando deve ser chamada pela assistente. Essa descrição deve incluir os cenários que a assistente deve considerar chamar ela e quando não deve ser chamada, fornecendo poucos exemplos de chamadas (one-shot) e/ou tornando explícitas as regras da função.

### Criando o endpoint que a função chamará



### Criando a definição da função