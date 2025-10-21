
# Limites da API

Os limites de taxa regulam o número de requisições que você pode enviar em uma janela de tempo. Eles ajudam a prevenir abuso e garantir estabilidade para todos os usuários.

Os limites abaixo são aplicados conforme o tier da sua conta:

- **Tier zero:** conta nova que nunca adicionou créditos ou que possui créditos de teste.
- **Tier 1:** conta criada há pelo menos 48 horas e que já adicionou qualquer valor em créditos.
- **Tier 2:** conta criada há pelo menos 1 mês e que já adicionou pelo menos $100 em créditos.
- **Tier 3:** conta criada há pelo menos 3 meses e que já adicionou pelo menos $1.000 em créditos.

A medição é pela **adição de créditos** e não pelo consumo. Exemplo: não é necessário consumir $100 para avançar ao Tier 2, basta adicionar esse valor.

**Legendas:**
- **RPM**: requisições por minuto
- **RPD**: requisições por dia (24h)
- **TPM**: tokens de entrada por minuto

## [Conta nova](#tab/free)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 10 | - | - |
| Inserção de documentos | - | 30 | - |
| Inferência (requisições) | 5 | 30 | - |
| Inferência (tokens de entrada) | - | - | 50.000 |
| Inferência (tokens de entrada - high-end) | 0 | - | 0 |
| Execução serverless | 5 | 100 | - |
| Ferramentas (compartilhado) | - | 100 | - |
| Ferramenta `web_search` | - | 15 | - |
| Ferramenta `x_posts_search` | - | 10 | - |
| Ferramenta `generate_image` | - | 3 | - |

## [Tier 1](#tab/tier1)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 150 | - | - |
| Inserção de documentos | - | 3.000 | - |
| Inferência (requisições) | 75 | 10.000 | - |
| Inferência (tokens de entrada) | - | - | 1.000.000 |
| Inferência (tokens de entrada - high-end) | - | - | 200.000 |
| Execução serverless | 30 | - | - |
| Ferramentas (compartilhado) | - | 1.000 | - |
| Ferramenta `web_search` | - | 300 | - |
| Ferramenta `x_posts_search` | - | 100 | - |
| Ferramenta `generate_image` | - | 30 | - |

## [Tier 2](#tab/tier2)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 300 | - | - |
| Inserção de documentos | - | 10.000 | - |
| Inferência (requisições) | 200 | - | - |
| Inferência (tokens de entrada) | - | - | 4.000.000 |
| Inferência (tokens de entrada - high-end) | - | - | 1.000.000 |
| Execução serverless | 100 | - | - |
| Ferramentas (compartilhado) | - | 10.000 | - |
| Ferramenta `web_search` | - | 1.000 | - |
| Ferramenta `x_posts_search` | - | 500 | - |
| Ferramenta `generate_image` | - | 300 | - |

## [Tier 3](#tab/tier3)

| Operação | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| Pesquisa de documentos | 1.000 | - | - |
| Inserção de documentos | - | 30.000 | - |
| Inferência (requisições) | 1.000 | - | - |
| Inferência (tokens de entrada) | - | - | 10.000.000 |
| Inferência (tokens de entrada - high-end) | - | - | 4.000.000 |
| Execução serverless | 500 | - | - |
| Ferramentas (compartilhado) | - | 50.000 | - |
| Ferramenta `web_search` | - | 10.000 | - |
| Ferramenta `x_posts_search` | - | 5.000 | - |
| Ferramenta `generate_image` | - | 1.000 | - |

---

**Descrição das operações:**
- **Pesquisa de documentos:** inclui pesquisa semântica de documentos em uma coleção.
- **Inserção de documentos:** criação e modificação de documentos em uma coleção.
- **Inferência (requisições):** número de chamadas de inferência ou função (API ou chat client).
- **Inferência (tokens de entrada):** tokens de entrada usados em inferência.
- **Inferência (tokens de entrada - high-end):** tokens de entrada para modelos high-end (Tier 1+).
- **Execução serverless:** chamadas de [função serverless](/docs/serverless).
- **Ferramentas (compartilhado):** uso de [ferramentas integradas](/docs/builtin-tools) providas pela AIVAX (não inclui ferramentas customizadas).
- **Ferramenta (nome):** uso individual de cada ferramenta integrada.

## Grupos de modelos

Certos modelos possuem multiplicadores de taxa:
- **Comum:** 1x
- **Descontados:** 0,5x
- **Baixa-latência:** 0,3x
- **Grátis:** 0,1x

Exemplo: se usar um modelo "descontado", os limites de taxa serão 50% menores (ex: 75 req/min → 37 req/min).

## Limites para BYOK (Bring-your-own-key)

Para modelos providos por você, o limite é **1.500 requisições por minuto** (separado do limite de inferência integrada).