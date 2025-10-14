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
- **TPM**: tokens de entrada por minuto.

# [Conta nova](#tab/free)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 50 | - | - |
| Inserção de documentos | - | 100 | - |
| Inferência | 5 | 300 | 50.000 |
| Inferência (modelos high-end) | - | - | - |
| Execução serverless | 5 | 100 | - |
| Ferramentas (compartilhado) | - | 100 | - |
| Ferramenta `web_search` | - | 20 | - |
| Ferramenta `x_posts_search` | - | 20 | - |
| Ferramenta `generate_image` | - | 5 | - |

# [Tier 1](#tab/tier1)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 150 | - | - |
| Inserção de documentos | - | 3.000 | - |
| Inferência | 75 | 10.000 | 1.000.000 |
| Inferência (modelos high-end) | 75 | 10.000 | 200.000 |
| Execução serverless | 30 | - | - |
| Ferramentas (compartilhado) | - | 1.000 | - |
| Ferramenta `web_search` | - | 300 | - |
| Ferramenta `x_posts_search` | - | 300 | - |
| Ferramenta `generate_image` | - | 30 | - |

# [Tier 2](#tab/tier2)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 300 | - | - |
| Inserção de documentos | - | 10.000 | - |
| Inferência | 200 | - | 4.000.000 |
| Inferência (modelos high-end) | 200 | - | 1.000.000 |
| Execução serverless | 100 | - | - |
| Ferramentas (compartilhado) | - | 10.000 | - |
| Ferramenta `web_search` | - | 1.000 | - |
| Ferramenta `x_posts_search` | - | 1.000 | - |
| Ferramenta `generate_image` | - | 300 | - |

# [Tier 3](#tab/tier3)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 1.000 | - | - |
| Inserção de documentos | - | 30.000 | - |
| Inferência | 1.000 | - | 10.000.000 |
| Inferência (modelos high-end) | 1.000 | - | 4.000.000 |
| Execução serverless | 500 | - | - |
| Ferramentas (compartilhado) | - | 50.000 | - |
| Ferramenta `web_search` | - | 10.000 | - |
| Ferramenta `x_posts_search` | - | 10.000 | - |
| Ferramenta `generate_image` | - | 1.000 | - |

---

- **Pesquisa de documentos**: inclui pesquisa semântica de documentos em uma coleção pelo endpoint de pesquisa `../collections/{id}/query`.
- **Inserção de documentos**: inclui criação e modificação de documentos em uma coleção.
- **Inferência**: toda chamada de inferência ou função, seja por chat client ou API.
    - modelos high-end se referem à modelos que necessitam de Tier 1 para poder ser usado.
- **Serverless**: inclui toda chamada de [função serverless](/docs/serverless).
- **Ferramentas (compartilhado)**: toda [ferramenta integrada](/docs/builtin-tools) invocada pela assistente. Esse limite é compartilhado para todas as ferramentas providas pela AIVAX e não é usado para ferramentas definidas por você ou suas APIs.
- **Ferramenta (nome da ferramenta)**: todo uso da ferramenta mencionada.

## Grupos de modelos

Certos modelos possuem multiplicadores de taxa. Esses multiplicadores são aplicados aos "grupos de limites" à certos modelos, bem como:

- **Comum**: os limites são multiplicados por 1x
- **Descontados**: os limites são multiplicados por 0,5x
- **Baixa-latência**: os limites são multiplicados por 0,3x
- **Grátis**: os limites são multiplicados por 0,1x

Por exemplo, se você usar um modelo com desconto no valor, os limites de taxa serão 50% menores para você, portanto, ao invés de 75 requests por minuto no Tier 1, você terá 37 requests.

## Limites para BYOK (Bring-your-own-key)

Para modelos providos por você, o limite aplicado é de **1.500** requisições por minuto. Esse limite é separado do limite de inferência integrada.