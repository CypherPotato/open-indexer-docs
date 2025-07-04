# Limites da API

Limites de taxa ("rate limiters") regulam o número de requisições que você pode enviar em uma janela de tempo. Esses limites ajudam a AIVAX a prevenir abuso e fornecer uma API estável à todos.

Os limites da API abaixo são os mesmos para todos os modelos embutidos da AIVAX. Esses limites são categorizados por operações feitas pela API. Cada conta possui um tier que define quais limites são aplicados à conta. Tiers mudam de acordo com o total investido na AIVAX e o tempo que a conta existe.

- **Tier zero (conta grátis):** conta nova que nunca adicionou créditos.
- **Tier 1**: conta criada há pelo menos 48 horas e que já adicionou qualquer valor em créditos.
- **Tier 2**: conta criada há pelo menos 1 mês e que já adicionou pelo menos $ 100 em créditos.
- **Tier 3**: conta criada há pelo menos 3 meses e que já adicionou pelo menos $ 1.000 em créditos.

A medição é pela **adição de créditos** e não pelo seu consumo. Por exemplo, você não consumir $ 100 em créditos para avançar ao Tier 2.

Legendas dos limites:

- **RPM**: requisições por minuto.
- **RPD**: requisições por dia (24 horas).

# [Grátis](#tab/free)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 50 | - |
| Inserção de documentos | - | 100 |
| Inferência | 5 | 300 |
| Função | 5 | 300 |
| Função (Live) | 2 | 30 |

# [Tier 1](#tab/tier1)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 150 | - |
| Inserção de documentos | - | 3.000 |
| Inferência | 75 | 10.000 |
| Função | 60 | 10.000 |
| Função (Live) | 20 | 500 |

# [Tier 2](#tab/tier2)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 300 | - |
| Inserção de documentos | - | 10.000 |
| Inferência | 150 | - |
| Função | 60 | - |
| Função (Live) | 60 | - |

# [Tier 3](#tab/tier3)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 1.000 | - |
| Inserção de documentos | - | 30.000 |
| Inferência | 1.000 | - |
| Função | 500 | - |
| Função (Live) | 200 | - |

---

- **Pesquisa de documentos**: inclui pesquisa semântica de documentos em uma coleção pelo endpoint de pesquisa `../collections/{id}/query`.
- **Inserção de documentos**: inclui criação e modificação de documentos em uma coleção.
- **Inferência**: toda chamada de inferência, seja pela API Open-AI compatível, pela rota `/ai-gateways/{id}/inference` ou por cada mensagem enviada por uma sessão de cliente de chat.
- **Função**: toda chamada de função `/functions`.
- **Função (Live)**: toda chamada de função conectada à internet através de pesquisa na internet (não inclui `fetch`).

Não há nenhum limite para inferência em modelos definidos por você, apenas pelos providos pela AIVAX.