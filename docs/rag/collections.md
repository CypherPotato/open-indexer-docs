# Coleções e Documentos

A AIVAX fornece um serviço autônomo de RAG (Retrieval-Augmented Generation) que permite usar documentos em conversas de chat. As coleções são grupos de documentos que possuem informações que serão obtidas posteriormente, armazenados de forma persistente em um banco de dados de similaridade.

## Coleções

As coleções permitem você enviar, salvar, gerenciar e consultar semanticamente por documentos armazenadas nela. Você pode associar uma coleção à um gateway de IA ou consultar diretamente nela através da API.

Pela interface da AIVAX, é possível enviar lotes de documentos e criar documentos com chunking, e associá-los como um documento só no resultado da incorporação.

### Custos e limites

Não há um limite de quantos documentos podem ser indexados em coleções. Preços de consulta e [armazenamento](/docs/pricing) podem ocorrer na conta.

O custo de pesquisa e indexação é calculado em cima dos tokens do conteúdo de cada documento quando ele é indexado ou modificado. O conteúdo é tokenizado de acordo com o modelo usado na indexação.

## Documentos

Um documento representa um pedaço de um conhecimento. É um trecho limitado, autosuficiente e que faça sentido de forma isolada. Um documento é o componente que é indexado pelo modelo interno para ser recuperado posteriormente através de um termo de busca semântico.

Considere um manual sobre um carro: ele não é um documento mas sim vários documentos. Cada um destes documentos fala, de forma isolada, sobre um determinado assunto sobre esse carro, de forma que esse documento não dependa de um contexto ou informação externa para fazer sentido.

### Enviar documentos em lote

Para enviar uma lista em massa de documentos para uma coleção, estruture-os seguindo o formato [JSONL](https://jsonlines.org/). A estrutura é composta pelas propriedades:

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `docid` | `string` | Especifica o nome do documento. Útil para depuração e identificação. |
| `text`  | `string` | O conteúdo "cru" do documento que será indexado. |
| `__ref` | `string` | Opcional. Especifica um ID de referência do documento. |
| `__tags` | `string[]` | Opcional. Especifica um array de tags do documento. Útil para gestão de documentos. |

A **referência** de um documento é um ID que pode ser especificado em vários documentos que precisam estar vinculados em uma busca quando um dos mesmos for correspondido em uma busca de similaridade. Por exemplo, se uma busca encontrar um documento que possui um ID de referência, todos os outros documentos da mesma coleção que compartilham o mesmo ID de referência do documento correspondido também serão incluídos na resposta da busca.

Você pode enviar até **50.000** linhas de documentos por requisição. Se precisar enviar mais documentos, separe o envio em mais requisições.

> [!WARNING]
> Esse endpoint gera custo calculado em cima dos tokens do conteúdo de cada documento.

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Gerenciamento de Documentos

#### Criar ou modificar documento

Esse endpoint cria ou modifica um documento a partir do seu nome. Quando um documento é modificado, seus vetores de indexação são resetados e o documento entra na fila para ser reindexado. O custo é gerado apenas quando o documento é de fato alterado.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs%23CreateorUpdateDocument"></script>

#### Listar documentos

Lista todos os documentos disponíveis em uma coleção. Suporta filtro por nome, tag, referência ou conteúdo.

Filtros suportados:
- `-t "tag"`: filtra documentos que possuem essa tag.
- `-r "reference"`: filtra documentos que possuem esse ID de referência.
- `-c "content"`: filtra documentos que possuem esse trecho em seu conteúdo.
- `-n "name"`: filtra documentos que possuem esse trecho em seu nome.
- `in "id"`: filtra documentos por ID.

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>