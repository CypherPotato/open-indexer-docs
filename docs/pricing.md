# Precificação

O modelo de pagamento da AIVAX é **pré-pago**: você adiciona saldo à sua conta e utiliza nossos serviços consumindo esse crédito. Não enviamos faturas surpresas no final do mês. Isso garante total previsibilidade sobre seus gastos com inferência e agentes.

Ao adicionar créditos, a AIVAX cobra uma pequena taxa (variável por método de pagamento) para cobrir impostos (notas fiscais), tarifas bancárias e custos operacionais.

A precificação de inferência (geração de texto) é repassada diretamente dos provedores (como Google e OpenAI) **sem markup**. Você paga na AIVAX exatamente o mesmo preço de tabela que pagaria utilizando esses provedores diretamente.

Usamos diferentes [serviços](/docs/builtin-tools) para ajudar você a criar assistentes agênticos. Algumas ferramentas possuem custos específicos que são debitados do seu saldo sem taxas adicionais.

> **Nota:** A inferência é calculada em dólares americanos (USD). Pode haver flutuação cambial ao converter da sua moeda local para o dólar no momento da recarga ou do uso.

## Expiração de Créditos

Como não podemos prever qual modelo você utilizará, precisamos alinhar a validade dos créditos com as políticas mais restritivas dos nossos fornecedores.
Atualmente, os créditos expiram **12 meses** após a data de adição. Consulte os detalhes em nossos [termos de uso](/docs/legal/terms-of-service).

## Bring-your-own-key (BYOK)

Você pode conectar sua própria chave de API (compatível com OpenAI) para usar a infraestrutura da AIVAX.

* **Custo de Inferência:** $0,00 (cobrado diretamente pelo dono da chave).
* **Limites:** Os limites de taxa são aumentados para **1.500 requisições por minuto** (aprox. 25 req/s), sem limitação de tokens.

**Importante:** Mesmo usando sua própria chave, serviços periféricos da AIVAX (como armazenamento de [RAG](/docs/entities/collections.md), pesquisa na web, geração de imagem, etc.) continuam sendo cobrados do seu saldo AIVAX. Se seu saldo ficar negativo, o serviço será interrompido, inclusive para chamadas BYOK.

## RAG (Coleções e Vetores)

O custo de indexação depende do modelo de incorporação (embedding) escolhido.

**Modelo Padrão:**
* `@google/gemini-embedding-001`: **$ 0,15** / 1 milhão de tokens.

**Modelos Legados/Compatibilidade:**
* `@google/text-embedding-004`: $ 0,10 / 1 milhão de tokens.
* `@baai/bge-m3`: $ 0,012 / 1 milhão de tokens.

*No momento, não cobramos taxa computacional para processar a indexação, apenas pelo armazenamento resultante.*

**Cálculo de Tokens**
Como nem todos os provedores retornam a contagem exata de tokens na resposta, utilizamos uma aproximação padrão da indústria para faturamento:
`tokens = ceil(utf8_bytes_count / 4)`

## Armazenamento

Para manter a integridade e disponibilidade dos seus dados, cobramos uma taxa de armazenamento por hora.

* **Preço:** **$0,0015** por GB / hora.
* **Franquia Gratuita:** Os primeiros **100 MB são grátis**.

**Como funciona a cobrança:**
Você paga apenas pelo **excedente** da franquia.
* *Exemplo:* Se você usar 120 MB por uma hora, pagará apenas sobre os 20 MB excedentes.
* *Exemplo:* Se usar 80 MB, o custo é zero.

**O que consome armazenamento:**
1.  Memória de longo prazo dos usuários (chats e inferências salvas);
2.  Cache de descrições de imagens (processamento multi-modal);
3.  Conteúdo de documentos RAG e seus vetores.

Logs de sistema são temporários e não geram custos de armazenamento.

## Ferramentas (Tools)

As [ferramentas nativas](/docs/builtin-tools) da AIVAX possuem preços e limites específicos. Consulte a documentação de cada ferramenta.