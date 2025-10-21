# Precificação

O modelo de pagamento da AIVAX é **pré-pago**, ou seja, você usa nossos serviços com o saldo que adiciona em sua conta. Não enviamos faturas no começo do mês pelo seu uso. Dessa forma, fica previsível saber quanto você irá gastar usando nossos serviços de inferência e criação de agentes.

A AIVAX cobra uma pequena taxa (variável por método de pagamento) no momento da adição de créditos para encobrir impostos, taxas do provedor de pagamentos e nossa taxa de serviço. A precificação dos modelos e de inferência é fornecida diretamente pelos provedores de inferência e de seus modelos, como a Google e a OpenAI. Não há nenhuma taxa ou adição em cima destes preços. Você paga o mesmo valor que pagaria para esses provedores diretamente.

Usamos diferentes [serviços](/docs/builtin-tools) para ajudar você à criar assistentes agênticos. Algumas ferramentas e serviços possuem custo, e estes custos são repassados para sua conta sem nenhuma taxa adicional.

A inferência é cobrada em dólares americanos (USD), portanto, pode existir flutuação de moeda ao converter da sua moeda local para o dólar americano.

## Expiração

Alguns providers possuem prazo de validade para créditos adicionados. Como não sabemos qual modelo ou serviço você irá usar com o saldo adicionado, temos que considerar o menor prazo de validade para também definir o nosso prazo de validade para os créditos adicionados.

Atualmente, créditos expiram após **12 meses** de sua adição. Leia mais sobre reembolsos, expiração e saldo nos [termos de uso](/docs/legal/terms-of-service).

## Bring-your-own-key (BYOK)

Você pode trazer sua própria chave de API compatível com OpenAI para usar diretamente na AIVAX. Como não sabemos qual modelo você estará usando, não cobramos nada em cima da inferência que você usar em seus modelos. Além disso, ao usar seu próprio modelo com a AIVAX, os limites de taxa são aumentados para **1.500 requisições por minuto**, sem limitação ao peso de tokens, que é o equivalente à 60 requisições por segundo.

Note que, você ainda é cobrado para serviços que usar com seus próprios modelos, como [RAG](/docs/entities/collections.md), pesquisa na internet, geração de imagens, etc. Se sua conta ficar com saldo negativo, você não conseguirá usar nenhum serviço, incluindo inferência para suas próprias API-keys, até que adicione saldo novamente.

## RAG (coleções)

Atualmente, o modelo padrão usado para incorporação de coleções é o [Gemini Embedding](https://ai.google.dev/gemini-api/docs/pricing#gemini-embedding), o qual é precificado em **$ 0,15** para 1 milhão de tokens de entrada.

Outros documentos podem ser vetorizados usando outros modelos de incorporação depreciados no sistema, mas ativos por compatibilidade:

- `@google/gemini-embedding-001`, $ 0,15 por milhão de tokens. (padrão)
- `@google/text-embedding-004`, $ 0,10 por milhão de tokens. (depreciado)
- `@baai/bge-m3`, $0,012 por milhão de tokens. (depreciado)

No momento, não cobramos taxa de computação e/ou armazenamento de vetores.

Para a cobrança ocorrer, precisamos calcular quantos tokens foram processados da entrada, e nem todos os provedores de incorporação retornam a quantia de tokens indexados. Portanto, usamos uma aproximação para calcular a quantia de tokens processados:

    tokens = ceil(utf8_bytes_count / 4)

O resultado dessa aproximação é o que cobramos de você.

## Ferramentas

Ferramentas fornecidas pela AIVAX ([ferramentas embutidas](/docs/builtin-tools)) possuem precificações e limites distintos de uma para outra.

Para funções que você define para sua API, não há nenhuma cobrança.