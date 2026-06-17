# Precificação

O modelo de pagamento da AIVAX é **pré-pago**: você adiciona saldo à sua conta e utiliza nossos serviços consumindo esse crédito. A AIVAX utiliza um modelo de assinatura mensal em conjunto com o saldo de utilização dos serviços. Para comparar diferenças entre Free, Pro e Max, consulte a [página de preços da AIVAX](https://aivax.net/pricing), que é a fonte atualizada para planos. O consumo dos serviços é sempre debitado do saldo da conta.

Ao adicionar créditos, a AIVAX cobra uma pequena taxa (variável por método de pagamento) para cobrir impostos (notas fiscais), tarifas bancárias e custos operacionais.

Alguns planos incluem uma **taxa de comissão** para o uso de saldo, que é uma porcentagem aplicada sobre o valor gasto em inferência (geração de texto). Consulte a [página de preços da AIVAX](https://aivax.net/pricing) para ver a comissão atual de cada plano.

A precificação de inferência (geração de texto) é baseada nos custos dos provedores, no modelo utilizado e nas regras comerciais do plano ativo. Para comparar diferenças entre planos, recursos inclusos, assinatura e comissão aplicável, consulte a [página de preços da AIVAX](https://aivax.net/pricing).

Usamos diferentes [serviços](/docs/pt-br/tools/builtin-tools) para ajudar você a criar assistentes agênticos. Algumas ferramentas possuem custos específicos que são debitados do seu saldo sem taxas adicionais.

> **Nota:** Todos os custos são calculados em dólares americanos (USD). Pode haver flutuação cambial ao converter da sua moeda local para o dólar no momento da recarga ou do uso.

## Expiração de Créditos

Como não podemos prever qual modelo você utilizará, precisamos alinhar a validade dos créditos com as políticas mais restritivas dos nossos fornecedores.

Atualmente, os créditos expiram **12 meses** após a data de adição. Consulte os detalhes em nossos [termos de uso](/docs/pt-br/legal/terms-of-service).

## RAG (Coleções e Vetores)

O custo de indexação e incorporação de documentos do RAG na AIVAX é de **$0,025** por milhão de tokens processados.

## Armazenamento

Para manter a integridade e disponibilidade dos seus dados, cobramos uma taxa de armazenamento por hora. O preço varia conforme o plano de assinatura:

- **Plano free**: 30 MB franquia, sem opção de armazenamento adicional.
- **Plano Pro**: 2 GB franquia, $0,50 por GB adicional por mês, cobrado por hora.
- **Plano Max**: 20 GB franquia, $0,20 por GB adicional por mês, cobrado por hora.

**Como funciona a cobrança:**
Você paga apenas pelo **excedente** da franquia.
* *Exemplo:* Se estiver no plano Pro você usar 2,20 GB por uma hora, pagará apenas sobre os 0,20 GB excedentes. Se usar 250 MB, o custo é zero.

**O que consome armazenamento:**
1.  Memória de longo prazo dos usuários (chats e inferências salvas);
2.  Cache de descrições de imagens (processamento multi-modal);
3.  Conteúdo de documentos RAG e seus vetores;
4.  Armazenamento do bash/shell virtual.

Logs de sistema são temporários e não geram custos de armazenamento.

## Ferramentas (Tools)

As [ferramentas nativas](/docs/pt-br/tools/builtin-tools) da AIVAX possuem preços e limites específicos. Consulte a documentação de cada ferramenta.
