# Pesquisa Semântica

A API de pesquisa, através da query key obtida das coleções, realiza uma busca semântica na mesma, realizando uma comparação inteligente para cada documento indexado em uma coleção.

Após criar uma coleção, você obterá seu ID. Utilize o ID da sua coleção para realizar a busca nos documentos indexados da mesma.

O AIVAX utiliza modelos de embedding que permitem a orientação da tarefa. Para a busca, o termo é vetorizado com uma orientação `DOCUMENT_QUERY`. Para indexação dos documentos, a orientação é `DOCUMENT_RETRIEVAL`, o que fornece uma busca mais otimizada.

> [!WARNING]
> Esse endpoint gera custo. O custo é calculado em cima dos tokens do termo de busca.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## MCP

É possível fornecer suas coleções de RAG através de funções MCP (Model Context Protocol). Isso permite que modelos de IA acessem e pesquisem suas coleções de forma nativa através do protocolo MCP.

Para configurar uma coleção como servidor MCP, utilize o endpoint `https://inference.aivax.net/v1/mcp/collections` e configure os seguintes cabeçalhos HTTP:

| Cabeçalho | Descrição | Padrão |
|-----------|-----------|--------|
| `Authorization` | Bearer token da sua API key | - |
| `X-Mcp-Collection-Id` | IDs das coleções a serem expostas (separados por vírgula para múltiplas coleções) | - |
| `X-Mcp-Collection-Name` | Nome da coleção para identificação na ferramenta MCP | `collection` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar | `5` |
| `X-Mcp-Min-Score` | Score mínimo de relevância (0.0 a 1.0) | `0.4` |
| `X-Mcp-Use-References` | Define se deve incluir referências dos chunks. Use `none` para desabilitar | habilitado |

### Exemplo de configuração

Visual Studio Code:

```json
{
  "servers": {
    "my-rag-collection-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/collections",
      "headers": {
        "Authorization": "Bearer {your_api_key}",
        "X-Mcp-Collection-Id": "019b80d5-cee2-7010-ab22-f676271af866",
        "X-Mcp-Collection-Name": "my_collection",
        "X-Mcp-Top-K": "5",
        "X-Mcp-Min-Score": "0.4",
        "X-Mcp-Use-References": "enabled" // or "none"
      }
    }
  }
}
```

### Ferramenta gerada

O servidor MCP criará automaticamente uma ferramenta com o nome `search_{collection_name}` que aceita o parâmetro:

- **search_terms** (string): Termos de busca para obter informações da coleção

A ferramenta executará uma pesquisa semântica na(s) coleção(ões) configurada(s) e retornará os documentos mais relevantes baseados nos parâmetros definidos.

Essa pesquisa limita a quantia de pesquisas que `search_terms` pode realizar para no máximo 5 termos por chamada e ter no máximo 500 caracteres (soma de todos os termos). Se os limites forem excedidos, a ferramenta retornará um erro. Este limite garante que a ferramenta seja utilizada para buscas específicas e relevantes, evitando consultas excessivamente amplas que possam impactar a performance do modelo e gerar custos elevados.

Este MCP compartilha os [limites de taxa de pesquisa semântica](/docs/limits) para evitar abusos e garantir a estabilidade do serviço. Se os limites de taxa forem excedidos, a ferramenta retornará um erro indicando que o limite foi atingido.