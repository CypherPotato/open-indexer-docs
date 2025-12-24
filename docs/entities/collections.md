# Coleções

Uma coleção é uma biblioteca de conhecimento: ela abriga vários documentos de conhecimento.

- Use coleções para agrupar documentos por finalidade, como documentar um produto, uma empresa, um serviço ou fluxo.
- Coleções não produzem custo. Não há limite de coleções por conta.

> [!TIP]
>
> Coleções implementam a técnica **RAG (Retrieval-Augmented Generation)**. Para entender quando usar RAG em comparação com Skills e System Prompt, consulte nosso [guia completo de comparação](/docs/concepts-comparison).

## Criar uma coleção

Para criar uma coleção vazia, informe apenas o nome dela.

Para detalhes sobre como criar uma coleção, consulte o endpoint [Create Collection](https://inference.aivax.net/apidocs#CreateCollection).

## Listar coleções

Lista as coleções disponíveis na sua conta.

Para detalhes sobre como listar coleções, consulte o endpoint [List Collections](https://inference.aivax.net/apidocs#ListCollections).

## Ver uma coleção

Obtém detalhes de uma coleção, como seu progresso de indexação e informações como data de criação.

Para detalhes sobre como visualizar uma coleção, consulte o endpoint [Get Collection Details](https://inference.aivax.net/apidocs#GetCollectionDetails).

## Excluir uma coleção

Exclui uma coleção e todos os documentos nela. Essa ação é irreversível.

Para detalhes sobre como excluir uma coleção, consulte o endpoint [Delete Collection](https://inference.aivax.net/apidocs#DeleteCollection).


## Limpar uma coleção

Diferente da exclusão de coleção, essa operação remove todos os documentos da coleção, incluindo os indexados e os em fila.

Para detalhes sobre como limpar uma coleção, consulte o endpoint [Reset Collection](https://inference.aivax.net/apidocs#ResetCollection).