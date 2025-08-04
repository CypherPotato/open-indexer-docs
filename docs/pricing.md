# Precificação

O modelo de pagamento da AIVAX é **pré-pago**, ou seja, você usa nossos serviços com o saldo que adiciona em sua conta. Não enviamos faturas no começo do mês pelo seu uso. Dessa forma, fica previsível saber quanto você irá gastar usando nossos serviços de inferência e criação de agentes.

A AIVAX cobra uma pequena taxa (variável por método de pagamento) no momento da adição de créditos para encobrir impostos, taxas do provedor de pagamentos e nossa taxa de serviço. A precificação dos modelos e de inferência é fornecida diretamente pelos provedores de inferência e de seus modelos, como a Google e a OpenAI. Não há nenhuma taxa ou adição em cima destes preços. Você paga o mesmo valor que pagaria para esses provedores diretamente.

Usamos diferentes [serviços](/docs/builtin-tools) para ajudar você à criar assistentes agênticos. Algumas ferramentas e serviços possuem custo, e estes custos são repassados para sua conta sem nenhuma taxa adicional.

A inferência é cobrada em dólares americanos (USD), portanto, pode existir flutuação de moeda ao converter da sua moeda local para o dólar americano.

## Bring-your-own-key (BYOK)

Você pode trazer sua própria chave de API compatível com OpenAI para usar diretamente na AIVAX. Como não sabemos qual modelo você estará usando, não cobramos nada em cima da inferência que você usar em seus modelos. Além disso, ao usar seu próprio modelo com a AIVAX, os limites de taxa são aumentados para **3.600 requisições por minuto**, que é o equivalente à 60 requisições por segundo.

Note que, você ainda é cobrado para serviços que usar com seus próprios modelos, como [RAG](/docs/entities/collections.md), pesquisa na internet, geração de imagens, etc. Se sua conta ficar com saldo negativo, você não conseguirá usar nenhum serviço, incluindo inferência para suas próprias API-keys, até que adicione saldo novamente.