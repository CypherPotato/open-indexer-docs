# Planos e limites

## Planos

A AIVAX oferece três planos de assinatura: **Free**, **Pro** e **Max**. Para comparar diferenças comerciais, recursos inclusos e preços atualizados entre os planos, consulte a [página de preços da AIVAX](https://aivax.net/pricing). Esta página mantém apenas limites técnicos úteis para integração e operação.

Todos os planos são renovados mensalmente e não exigem compromisso de longo prazo. Ao assinar um plano, o valor da assinatura é deduzido automaticamente do saldo da conta. No dia 1 de todo mês, o valor da assinatura é renovado novamente se existir saldo suficiente em conta para a mensalidade atual. Ao assinar um plano após o primeiro dia do mês, o valor proporcional é cobrado para o período restante do mês, e a renovação completa ocorrerá no próximo ciclo mensal.

Nenhum plano inclui créditos de uso, e os limites de uso são aplicados independentemente do saldo da conta, independente do saldo disponível em conta. Os planos implicam melhor em planos e recursos que são fornecidos no AIVAX, além da facilidade em concentrar o saldo para vários serviços diferentes em uma única carteira.

É importante ressaltar que a utilização de recursos que envolvem custos é imediatamente interrompida quando o saldo da conta é zero ou negativo, independentemente do plano de assinatura. Portanto, é fundamental manter um saldo positivo para garantir a continuidade do acesso aos recursos e evitar interrupções no serviço.

## Limites

Os limites de uso regulam o número de requisições e recursos disponíveis conforme o plano de assinatura da sua conta.

Limites aparecem de formas diferentes conforme o recurso. Em inferência, eles podem limitar requisições por minuto, tokens por minuto ou acesso a grupos de modelos. Em BYOK, eles limitam a quantidade de chamadas que passam pela infraestrutura da AIVAX mesmo quando o custo do provedor externo é seu. Em RAG, eles controlam quantidade de coleções, pesquisas por minuto, inserções por dia e tamanho de lotes JSONL. Em ferramentas embutidas, eles controlam quantas vezes uma ação de serviço pode ser executada por dia ou por período. Em Batch, eles controlam quantos itens podem ser processados em segundo plano conforme o plano.

Quando um limite é atingido, o comportamento esperado é interromper, pausar ou retornar erro, dependendo do recurso. Uma chamada de inferência direta tende a retornar erro imediatamente. Um job de Batch pode ser pausado e retomado depois, porque ele é assíncrono. Uma ferramenta embutida pode falhar dentro da conversa e o modelo deve explicar a limitação ao usuário. Uma inserção de RAG acima do limite do plano deve ser dividida em lotes menores ou feita após ajuste de plano. Para diferenças comerciais, preços e recursos inclusos, use a [página de preços da AIVAX](https://aivax.net/pricing); esta página serve para orientar integração e operação.

## [Free](#tab/free)

| Recurso | Valor |
| --- | --- |
| Acesso a modelos | Modelos básicos |
| Comissão sobre inferência | 25% |
| BYOK (Bring your own key) | Limitado |
| JSON Healing | Sim |
| Stability routing | Sim |
| Complexity routing | Não |
| Rate limits | Considerável |
| Contexto máximo | 64K tokens |
| **RAG** |  |
| Coleções | Até 5 coleções de RAG |
| Pesquisas | Baixo limite — 20 pesquisas/minuto |
| Inserções | Baixo limite — 500 inserções/dia |
| Processamento composto | Não disponível |
| **Ferramentas embutidas** |  |
| Pesquisa na internet | 15/dia |
| Pesquisa no Twitter/X | Não disponível |
| Deep search | Não disponível |
| Geração de documentos e páginas web | 5/dia |
| Geração e edição de imagens | 5/dia |
| Execução de código e requisições avançadas | 30/dia |
| Memória e calendário | Sim |
| **Conta** |  |
| Armazenamento incluso | 30 MB (limite fixo) |
| Retenção de conversas | 2 horas |
| Suporte | Por e-mail |

## [Pro](#tab/pro)

| Recurso | Valor |
| --- | --- |
| Acesso a modelos | Modelos avançados |
| Comissão sobre inferência | 5% |
| BYOK (Bring your own key) | Sim |
| JSON Healing | Sim |
| Stability routing | Sim |
| Complexity routing | Sim |
| Rate limits | Alto |
| Contexto máximo | Ilimitado |
| **RAG** |  |
| Coleções | Ilimitado |
| Pesquisas | Alto limite — 500 pesquisas/minuto |
| Inserções | Alto limite — 10.000 inserções/dia |
| Processamento composto | Até 3 arquivos/dia |
| **Ferramentas embutidas** |  |
| Pesquisa na internet | 1.000/dia |
| Pesquisa no Twitter/X | 1.000/dia |
| Deep search | 100/dia |
| Geração de documentos e páginas web | 1.000/dia |
| Geração e edição de imagens | 500/dia |
| Execução de código e requisições avançadas | 5.000/dia |
| Memória e calendário | Sim |
| **Conta** |  |
| Armazenamento incluso | 2 GB (excedente: $0,50/GB/mês) |
| Retenção de conversas | 2 dias |
| Suporte | Prioritário |

## [Max](#tab/max)

| Recurso | Valor |
| --- | --- |
| Acesso a modelos | Todos os modelos |
| Comissão sobre inferência | Nenhuma |
| BYOK (Bring your own key) | Sim |
| JSON Healing | Sim |
| Stability routing | Sim |
| Complexity routing | Sim |
| Rate limits | Mais alto |
| Contexto máximo | Ilimitado |
| **RAG** |  |
| Coleções | Ilimitado |
| Pesquisas | Limite elevado — 3.000 pesquisas/minuto |
| Inserções | Ilimitado |
| Processamento composto | Até 10 arquivos/dia |
| **Ferramentas embutidas** |  |
| Pesquisa na internet | 10.000/dia |
| Pesquisa no Twitter/X | 10.000/dia |
| Deep search | 1.000/dia |
| Geração de documentos e páginas web | 50.000/dia |
| Geração e edição de imagens | 5.000/dia |
| Execução de código e requisições avançadas | 100.000/dia |
| Memória e calendário | Sim |
| **Conta** |  |
| Armazenamento incluso | 20 GB (excedente: $0,20/GB/mês) |
| Retenção de conversas | 30 dias |
| Suporte | Dedicado |

---

## Grupos de modelos

Certos modelos possuem multiplicadores de taxa:
- **Comum:** 1x
- **Descontados:** 0,5x
- **Baixa-latência:** 0,3x
- **Grátis:** 0,1x

Exemplo: se usar um modelo "descontado", os limites de taxa serão 50% menores (ex: 75 req/min → 37 req/min).

## Limites para BYOK (Bring-your-own-key)

Não há custo para utilizar sua própria api-key. O plano Free possui limites mais restritos, o plano Pro possui limite maior e o plano Max não possui limite de requisições BYOK. Para comparar diferenças entre planos, consulte a [página de preços da AIVAX](https://aivax.net/pricing).

## Detalhes de rate limits

Esta seção detalha os limites aplicados por operação para cada plano.

### Inferência integrada

- **Free:** 20 req/min, 500 req/dia, 1.000.000 tokens/min
- **Pro:** 200 req/min, 20.000.000 tokens/min
- **Max:** Ilimitado

### BYOK (Bring your own key)

- **Free:** 30 req/min, sem limite de input tokens
- **Pro:** 200 req/min, sem limite de input tokens
- **Max:** Ilimitado

### Bash (execução de código)

Os limites de Bash referem-se ao número de comandos executados por hora dentro de containers.

- **Free:** 
    - 30 comandos por hora
    - 2 instâncias concorrentes
    - timeout de comando de 15 segundos
    - limite de 32 MB de memória por instância
    - 1 processador virtual por instância
    - expira imediatamente após fim do loop agêntico
    - permite armazenamento persistente
- **Pro:**
    - 1.500 comandos por hora
    - 10 instâncias concorrentes
    - timeout de comando de 30 segundos
    - limite de 128 MB de memória por instância
    - 2 processadores virtuais por instância
    - sessões persistentes expiram após 15 minutos
    - permite armazenamento persistente
- **Max:**
    - 10.000 comandos por hora
    - 50 instâncias concorrentes
    - timeout de comando de 60 segundos
    - limite de 256 MB de memória por instância
    - 4 processadores virtuais por instância
    - sessões persistentes expiram após 30 minutos
    - permite armazenamento persistente
