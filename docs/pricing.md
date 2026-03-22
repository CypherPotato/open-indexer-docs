# Precificação

O modelo de pagamento da AIVAX é **pré-pago**: você adiciona saldo à sua conta e utiliza nossos serviços consumindo esse crédito. A AIVAX utiliza um modelo de [assinatura mensal](/docs/limits) em conjunto com o saldo de utilização dos serviços. Os planos de assinatura (Free, Pro e Max) oferecem diferentes níveis de acesso a recursos, limites de uso e suporte, mas o consumo dos serviços é sempre debitado do saldo da conta.

Ao adicionar créditos, a AIVAX cobra uma pequena taxa (variável por método de pagamento) para cobrir impostos (notas fiscais), tarifas bancárias e custos operacionais.

Alguns planos incluem uma **taxa de comissão** para o uso de saldo, que é uma porcentagem aplicada sobre o valor gasto em inferência (geração de texto). As comissões são atualmente:
- Plano Free: 25% de comissão sobre o valor gasto em inferência.
- Plano Pro: 5% de comissão sobre o valor gasto em inferência.
- Plano Max: sem comissão.

A precificação de inferência (geração de texto) é repassada diretamente dos provedores (como Google e OpenAI). Você paga na AIVAX exatamente o mesmo preço de tabela que pagaria utilizando esses provedores diretamente.

Usamos diferentes [serviços](/docs/builtin-tools) para ajudar você a criar assistentes agênticos. Algumas ferramentas possuem custos específicos que são debitados do seu saldo sem taxas adicionais.

> **Nota:** Todos os custos são calculados em dólares americanos (USD). Pode haver flutuação cambial ao converter da sua moeda local para o dólar no momento da recarga ou do uso.

## Expiração de Créditos

Como não podemos prever qual modelo você utilizará, precisamos alinhar a validade dos créditos com as políticas mais restritivas dos nossos fornecedores.

Atualmente, os créditos expiram **12 meses** após a data de adição. Consulte os detalhes em nossos [termos de uso](/docs/legal/terms-of-service).

## RAG (Coleções e Vetores)

O custo de indexação depende do modelo de incorporação (embedding) escolhido.

**Modelo Padrão:**
* `@google/gemini-embedding-001`: **$ 0,15** / 1 milhão de tokens.

**Modelos Legados/Compatibilidade:**
* `@google/text-embedding-004`: $ 0,10 / 1 milhão de tokens.
* `@baai/bge-m3`: $ 0,012 / 1 milhão de tokens.

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

As [ferramentas nativas](/docs/builtin-tools) da AIVAX possuem preços e limites específicos. Consulte a documentação de cada ferramenta.