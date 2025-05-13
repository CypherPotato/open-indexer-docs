# Limites da API

Limites de taxa ("rate limiters") regulam o número de requisições que você pode enviar em uma janela de tempo. Esses limites ajudam a Open Indexer a prevenir abuso e fornecer uma API estável à todos.

Os limites da API abaixo são os mesmos para todos os modelos embutidos da Open Indexer. Esses limites são categorizados por operações feitas pela API.

- **Pesquisação de documentos**: ocorre quando você pesquisa documentos em uma coleção através do endpoint `/v1/collections/<collection-id>/query`.
    
    - Limitado à **300** requisições à cada **1 minuto**.

- **Inserção de documentos**: ocorre sempre que um documento individual é inserido ou atualizado.

    - Limitado à **1.000** requisições à cada **6 horas**.

- **Inferência**: ocorre sempre que você utiliza a inferência dos modelos embutidos pela Open Indexer, seja pela API OpenAI, inferência direta ou web chat client. Não considera chamadas de função.

    - Limitado à **75** requisições à cada **1 minuto**.

- **Chamada de função**: ocorre sempre que você chama uma chamada de função.

    - Limitado à **30** requisições à cada **1 minuto**; e
    - Limitado à **300** requisições à cada **1 hora**.

- **Chamadas de função conectadas**: ocorre sempre que você chama uma função que realiza pesquisas na internet (não através do fetch).

    - Limitado à **5** requisições à cada **1 minuto**; e
    - Limitado à **50** requisições à cada **1 hora**.

## Aumentar limites de uso

No momento, esses limites são aplicados para todas as contas. Se você precisa de um limite maior, entre em contato conosco.