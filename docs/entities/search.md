# Pesquisa

A API de pesquisa, através da query key obtida das coleções, realiza uma busca semântica na mesma, realizando uma comparação inteligente para cada documento indexado em uma coleção.

Após criar uma coleção, você obterá seu ID. Utilize o ID da sua coleção para realizar a busca nos documentos indexados da mesma.

Use os endpoints dessa API para embutir a pesquisa semântica de documentos no seu modelo de IA ou chatbot.

## Pesquisando documentos

Esse endpoint espera uma requisição GET com os parâmetros:

- `term`: **obrigatório.** Especifica o termo de pesquisa que será pesquisado nos documentos.
- `top`: Especifica o máximo de documentos que deverão ser retornados na busca.
- `min`: Especifica o score mínimo para obtenção dos documentos.

> [!WARNING]
>
> Atenção: esse endpoint gera custo. O custo é calculado em cima dos tokens do termo de busca. O termo de busca é tokenizado de acordo com o modelo usado na indexação dos documentos.

Veja a [referência](https://inference.aivax.net/apidocs#QueryCollection) do endpoint da API de consultas nas coleções.

Para o resultado da busca, quanto maior o score, mais semelhante é o documento para o termo da busca. O AIVAX utiliza modelos de embedding que permitem a orientação da tarefa. Para a busca, o termo é vetorizado com uma orientação `DOCUMENT_QUERY`. Para indexação dos documentos, a orientação é `DOCUMENT_RETRIEVAL`, o que fornece uma busca mais otimizada e não para averiguar a similaridade entre documentos.