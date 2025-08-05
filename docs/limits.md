# Limites da API

Limites de taxa ("rate limiters") regulam o número de requisições que você pode enviar em uma janela de tempo. Esses limites ajudam a AIVAX a prevenir abuso e fornecer uma API estável à todos.

Os limites da API abaixo são os mesmos para todos os modelos embutidos da AIVAX. Esses limites são categorizados por operações feitas pela API. Cada conta possui um tier que define quais limites são aplicados à conta. Tiers mudam de acordo com o total investido na AIVAX e o tempo que a conta existe.

- **Tier zero:** conta nova que nunca adicionou créditos ou que possui créditos de teste.
- **Tier 1**: conta criada há pelo menos 48 horas e que já adicionou qualquer valor em créditos.
- **Tier 2**: conta criada há pelo menos 1 mês e que já adicionou pelo menos $ 100 em créditos.
- **Tier 3**: conta criada há pelo menos 3 meses e que já adicionou pelo menos $ 1.000 em créditos.

A medição é pela **adição de créditos** e não pelo seu consumo. Por exemplo, você não precisa consumir $ 100 em créditos para avançar ao Tier 2.

Legendas dos limites:

- **RPM**: requisições por minuto.
- **RPD**: requisições por dia (24 horas).

# [Conta nova](#tab/free)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 50 | - |
| Inserção de documentos | - | 100 |
| Inferência | 5 | 300 |
| Ferramentas (compartilhado) | - | 100 |
| Ferramenta `web_search` | - | 20 |
| Ferramenta `x_posts_search` | - | 20 |
| Ferramenta `generate_image` | - | 5 |

# [Tier 1](#tab/tier1)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 150 | - |
| Inserção de documentos | - | 3.000 |
| Inferência | 75 | 10.000 |
| Ferramentas (compartilhado) | - | 1.000 |
| Ferramenta `web_search` | - | 300 |
| Ferramenta `x_posts_search` | - | 300 |
| Ferramenta `generate_image` | - | 30 |

# [Tier 2](#tab/tier2)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 300 | - |
| Inserção de documentos | - | 10.000 |
| Inferência | 200 | - |
| Ferramentas (compartilhado) | - | 10.000 |
| Ferramenta `web_search` | - | 1.000 |
| Ferramenta `x_posts_search` | - | 1.000 |
| Ferramenta `generate_image` | - | 300 |

# [Tier 3](#tab/tier3)

| Operação | RPM | RPD |
| --- | --- | --- |
| Pesquisa de documentos | 1.000 | - |
| Inserção de documentos | - | 30.000 |
| Inferência | 1.000 | - |
| Ferramentas (compartilhado) | - | 50.000 |
| Ferramenta `web_search` | - | 10.000 |
| Ferramenta `x_posts_search` | - | 10.000 |
| Ferramenta `generate_image` | - | 1.000 |

---

- **Pesquisa de documentos**: inclui pesquisa semântica de documentos em uma coleção pelo endpoint de pesquisa `../collections/{id}/query`.
- **Inserção de documentos**: inclui criação e modificação de documentos em uma coleção.
- **Inferência**: toda chamada de inferência ou função, seja por chat client ou API.
- **Ferramentas (compartilhado)**: toda [ferramenta integrada](/docs/builtin-tools) invocada pela assistente. Esse limite é compartilhado para todas as ferramentas providas pela AIVAX e não é usado para ferramentas definidas por você ou suas APIs.
- **Ferramenta (nome da ferramenta)**: todo uso da ferramenta mencionada.

## Limites para BYOK (Bring-your-own-key)

Para modelos providos por você, o limite aplicado é de **3.600** requisições por minuto.