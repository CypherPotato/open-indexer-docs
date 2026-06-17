# Pesquisa Semântica

A API de pesquisa realiza busca semântica nas coleções informadas, fazendo uma comparação inteligente entre os termos enviados e cada documento indexado.

Após criar uma coleção, você obterá seu ID. Utilize o ID da sua coleção para realizar a busca nos documentos indexados da mesma.

O AIVAX utiliza modelos de embedding que permitem a orientação da tarefa. Para a busca, o termo é vetorizado com uma orientação `DOCUMENT_QUERY`. Para indexação dos documentos, a orientação é `DOCUMENT_RETRIEVAL`, o que fornece uma busca mais otimizada.

> [!WARNING]
> Esse endpoint gera custo. O custo é calculado em cima dos tokens do termo de busca.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Ranqueamento

A AIVAX pode aplicar reranking depois da busca vetorial. A primeira etapa encontra documentos semanticamente próximos aos termos consultados. Em seguida, o reranker reavalia os candidatos encontrados e ajusta a ordem final dos resultados.

Esse processo é útil quando vários documentos são parecidos entre si. A busca semântica pode encontrar o conjunto certo de candidatos, mas ainda assim deixar o documento mais útil abaixo de outros documentos relacionados. O reranking funciona como uma segunda etapa de precisão.

Por exemplo: em uma coleção de suporte técnico, buscar por "como cancelar assinatura anual sem multa" pode retornar documentos sobre "cancelamento de assinatura", "multa contratual", "assinatura mensal" e "reembolsos". O reranker reordena esses candidatos para favorecer o documento que responde melhor à consulta completa.

Rerankers disponíveis:

| Algoritmo | Custo | Descrição |
| --------- | ----- | --------- |
| `none` | Sem custo | Desativa o reranking. Os resultados finais usam apenas a pontuação semântica da busca vetorial. |
| `lexical` | Sem custo | Aplica um pequeno ajuste local de score com base em correspondência lexical, correspondência aproximada e proximidade dos termos no nome e no conteúdo do documento. |
| `smart` | $0,005/mtokens | Usa um modelo de reranking para reavaliar os documentos candidatos com a consulta completa e substituir a pontuação final pela pontuação do modelo. |

Na API de pesquisa semântica, o reranker padrão é `lexical`. Para desativar o reranking, envie `none` no parâmetro `reranker`. Para usar o reranker baseado em modelo, envie `smart`.

> [!NOTE]
> O reranking não amplia a busca para documentos que ficaram fora dos candidatos iniciais. Ele atua sobre os candidatos retornados pela busca vetorial e melhora a ordenação final.

## Busca por termos

A busca por vários termos funciona como uma união ranqueada por melhor correspondência. Ela não faz interseção obrigatória entre termos e não exige que cada resultado combine com todos os termos fornecidos.

Para vários termos, cada documento é comparado com todos os termos fornecidos. A pontuação semântica do documento usa a melhor correspondência encontrada entre esses termos. Na prática, um documento pode aparecer bem posicionado por combinar muito bem com apenas um dos termos.

Para várias coleções, a busca percorre as coleções configuradas, agrega os melhores candidatos de cada uma e ordena tudo em uma única lista final. O resultado não é separado por coleção e também não é uma interseção entre coleções.

Exemplo: ao buscar os termos `cancelamento`, `multa` e `reembolso` nas coleções `suporte` e `contratos`, a resposta será equivalente a:

> *melhores documentos de suporte ou contratos que combinem bem com cancelamento ou multa ou reembolso*

Ela não significa:

> *documentos que combinem com cancelamento e multa e reembolso ao mesmo tempo*

nem:

> *documentos presentes simultaneamente em suporte e contratos*

Se a intenção for buscar uma ideia composta, prefira enviar essa ideia como um termo completo, por exemplo `cancelamento de assinatura anual sem multa`, em vez de quebrar a consulta em muitas palavras isoladas. Use vários termos quando quiser cobrir formas diferentes de expressar a mesma necessidade ou quando aceitar resultados relevantes para qualquer uma das variações.

## Projeto de busca e qualidade dos resultados

A qualidade da busca semântica depende tanto da consulta quanto da forma como os documentos foram preparados. Quando um usuário pergunta algo específico, a melhor consulta costuma ser uma frase completa com intenção clara, não uma lista de palavras-chave soltas. Por exemplo, `como cancelar assinatura anual sem multa` tende a recuperar documentos melhores que `cancelamento`, `assinatura`, `multa`, porque preserva a relação entre os termos. Use múltiplos termos quando você quer cobrir sinônimos ou formulações alternativas, como `cancelar assinatura`, `encerrar contrato` e `rescindir plano`; nesse caso, a busca funciona como uma união de possibilidades e não como uma exigência de que todas apareçam ao mesmo tempo.

O parâmetro `top` controla quantos documentos entram na resposta, enquanto `minScore` controla o corte mínimo de relevância. Valores baixos de `minScore` aumentam a chance de recuperar algum conteúdo, mas também aumentam ruído. Valores altos reduzem ruído, mas podem retornar poucos resultados quando a coleção é pequena, quando os documentos estão mal segmentados ou quando a pergunta usa uma linguagem diferente dos documentos. Em assistentes com RAG no gateway, comece com poucos documentos e uma pontuação mínima moderada; depois aumente `top` apenas quando a resposta precisa comparar políticas, procedimentos ou trechos de fontes diferentes.

O reranker deve ser escolhido pelo custo de erro da tarefa. `lexical` é um bom padrão porque melhora a ordenação sem custo adicional, especialmente quando nomes, códigos, títulos ou termos técnicos aparecem no documento. `smart` faz sentido quando os documentos candidatos são muito parecidos entre si e a pergunta exige entender a frase inteira, como suporte técnico, jurídico, financeiro ou documentação longa. `none` só deve ser usado quando você quer a menor latência possível e aceita a ordenação puramente vetorial. O reranking não corrige uma coleção ruim: se documentos relevantes não aparecem entre os candidatos iniciais, melhore chunking, nomes, conteúdo ou estratégia de consulta.

Quando a busca não retorna o que você espera, investigue em camadas. Primeiro, confirme se os documentos estão indexados e se a coleção correta está sendo consultada. Segundo, teste a consulta direta pela API antes de testar dentro de um gateway, porque isso separa problema de busca de problema de prompt. Terceiro, compare uma consulta curta, uma consulta completa e duas ou três variações semânticas. Quarto, revise se os documentos são autossuficientes; documentos que dependem de contexto externo, títulos genéricos ou trechos muito longos tendem a pontuar mal. Por fim, se o gateway usa uma estratégia de reescrita, teste a mesma pergunta com `Plain` para descobrir se o problema está na reescrita ou na coleção.

## MCP

É possível fornecer suas coleções de RAG através de funções MCP (Model Context Protocol). Isso permite que modelos de IA acessem e pesquisem suas coleções de forma nativa através do protocolo MCP.

Para configurar uma coleção como servidor MCP, utilize o endpoint `https://inference.aivax.net/v1/mcp/collections` e configure os seguintes cabeçalhos HTTP:

| Cabeçalho | Descrição | Padrão |
|-----------|-----------|--------|
| `Authorization` | Bearer token da sua API key | - |
| `X-Mcp-Collection-Id` | IDs das coleções a serem expostas (separados por vírgula para múltiplas coleções) | - |
| `X-Mcp-Collection-Name` | Nome da coleção para identificação na ferramenta MCP | `collection` |
| `X-Mcp-Reranker` | Reranker que será usado (`lexical`, `smart` ou `none`). | `lexical` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar | `5` |
| `X-Mcp-Min-Score` | Score mínimo de relevância (0.0 a 1.0) | `0.4` |
| `X-Mcp-Use-References` | Define se deve incluir referências dos chunks. No comportamento atual, envie `none` para incluir referências; omita o cabeçalho para não incluir. | desabilitado |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de criação e remoção de documentos no servidor MCP. | desabilitado |
| `X-Mcp-Naming-Convention` | Convenção de nomes das ferramentas. Use `default` ou `agent`. | `default` |

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
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

### Ferramenta gerada

O servidor MCP criará automaticamente uma ferramenta com o nome `{collection_name}_search` que aceita o parâmetro:

- **search_terms** (`string[]`): Termos de busca para obter informações da coleção

A ferramenta executará uma pesquisa semântica na(s) coleção(ões) configurada(s) e retornará os documentos mais relevantes baseados nos parâmetros definidos.

Essa pesquisa limita a quantia de pesquisas que `search_terms` pode realizar para no máximo 10 termos por chamada e ter no máximo 500 caracteres (soma de todos os termos). Se os limites forem excedidos, a ferramenta retornará um erro. Este limite garante que a ferramenta seja utilizada para buscas específicas e relevantes, evitando consultas excessivamente amplas que possam impactar a performance do modelo e gerar custos elevados.

Quando `X-Mcp-Allow-Write` está desabilitado, o MCP de coleções funciona como uma ferramenta de leitura. Esse é o modo recomendado para assistentes que apenas precisam consultar conhecimento. Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de escrita e remoção de documentos. Esse modo é útil para agentes internos que mantêm uma base viva, por exemplo um assistente que registra novas respostas aprovadas, atualiza uma base de procedimentos ou remove documentos obsoletos. Habilite escrita apenas para clientes confiáveis, porque o modelo poderá alterar a coleção com base na conversa.

A convenção de nomes também muda como o modelo percebe a ferramenta. No modo `default`, a ferramenta de leitura usa o nome `{collection_name}_search`, que funciona bem quando a coleção tem um nome claro, como `manual_suporte_search`. No modo `agent`, as ferramentas usam nomes mais diretos para agentes, como leitura, escrita e remoção associadas ao nome da coleção. A escolha deve considerar o cliente MCP: em um editor de código, nomes explícitos ajudam o modelo a escolher a ferramenta; em um subagente com poucas ferramentas, nomes curtos podem ser suficientes.

O MCP de coleções é melhor quando você quer dar acesso direto à base para outro modelo ou cliente MCP. Para um chat client comum, normalmente é mais simples vincular a coleção no próprio AI Gateway e deixar o pipeline de RAG anexar os documentos automaticamente. Use MCP quando o modelo chamador precisa decidir quando pesquisar, quando você quer expor a mesma coleção para várias ferramentas externas, ou quando a coleção precisa ser acessada por agentes que não estão dentro da AIVAX.

Este MCP compartilha os [limites de taxa de pesquisa semântica](/docs/pt-br/limits) para evitar abusos e garantir a estabilidade do serviço. Se os limites de taxa forem excedidos, a ferramenta retornará um erro indicando que o limite foi atingido.
