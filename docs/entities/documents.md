# Documentos

Um documento representa um pedaço de um conhecimento. É um trecho limitado, autosuficiente e que faça sentido de forma isolada. Um documento é o componente que é indexado pelo modelo interno para ser recuperado posteriormente através de um termo de busca semântico.

Considere um manual sobre um carro: ele não é um documento mas sim vários documentos. Cada um destes documentos fala, de forma isolada, sobre um determinado assunto sobre esse carro, de forma que esse documento não dependa de um contexto ou informação externa para fazer sentido.

Cada documento deste manual irá falar de um assunto: um irá falar sobre como ligar o carro, outro de como desligá-lo, outro de como sua pintura é feita e outro de como trocar o óleo periodicamente. Não é uma boa ideia reservar um documento para falar de várias coisas ao mesmo tempo, pois isso irá reduzir a objetividade e escopo da inferência e reduzir a qualidade de obtenção.

Exemplos de criação de documentos:

### ❌ Não faça

- Não crie documentos muito curtos (com 10 ou menos palavras).
- Não crie documentos muito grandes (com 700) ou mais palavras.
- Não fale sobre mais de uma coisa em um documento.
- Não misture linguas diferentes em documentos.
- Não seja implícito em documentos.
- Nâo escreva documentos usando linguagem técnica, como códigos ou estruturas como JSON.

### ✅ Faça

- Seja explícito sobre o objetivo do seu documento.
- Foque documentos em assuntos individuais, que resumam o que deve ser feito ou explicado.
- Sempre repita termos que são palavras-chave para a busca do documento. Exemplo: prefira usar "A cor do Honda Civic 2015 é amarela" ao invés de "a cor do carro é amarelo".
- Restrinja o conteúdo do documento para falar de apenas um tópico ou assunto.
- Use uma linguagem humana, simples e fácil de entender.

## Uso da API

Como todos os documentos são entidades que pertencem à uma [coleção](collections.md), sempre tenha em mãos a coleção de onde o documento está/será localizado.

Para informações detalhadas sobre os endpoints da API de documentos, consulte a [documentação oficial da API](https://inference.aivax.net/apidocs#Documents).

## Enviar documentos em lote

Para enviar uma lista em massa de documentos para uma coleção, estruture-os seguindo o formato [JSONL](https://jsonlines.org/). A estrutura é composta pelas propriedades:

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `docid` | `string` | Especifica o nome do documento. Útil para depuração e identificação. |
| `text`  | `string` | O conteúdo "cru" do documento que será indexado. |
| `__ref` | `string` | Opcional. Especifica um ID de referência do documento. |
| `__tags` | `string[]` | Opcional. Especifica um array de tags do documento. Útil para gestão de documentos. |

A referência de um documento é um ID que pode ser especificado em vários documentos que precisam estar vinculados em uma busca quando um dos mesmos for correspondido em uma busca de similaridade. Por exemplo, se uma busca encontrar um documento que possui um ID de referência, todos os outros documentos da mesma coleção que compartilham o mesmo ID de referência do documento correspondido também serão incluídos na resposta da busca.

O uso de referências pode ser útil para quando um documento depende de outro ou mais documentos para fazer sentido. Não há exigência de formato para o ID de referência: qualquer formato é aceito.

Você pode enviar até **10.000** linhas de documentos por requisição. Se precisar enviar mais documentos, separe o envio em mais requisições. Se você enviar um documento com mais de 1.000 linhas, as linhas seguintes serão ignoradas.

Vale notar que documentos muito longos, que excede a quantidade de tokens permitida no modelo de embedding interno, terão seu conteúdo **truncado** e a qualidade de indexação poderá ser gravemente afetada. Para evitar esse problema, envie documentos que contenham entre 20 e 700 palavras.

> [!WARNING]
>
> Atenção: esse endpoint gera custo. O custo é calculado em cima dos tokens do conteúdo de cada documento. O conteúdo de cada documento é tokenizado de acordo com o modelo usado na indexação dos documentos.

Para detalhes sobre como enviar documentos em lote, consulte o endpoint [Index Documents (JSONL)](https://inference.aivax.net/apidocs#IndexDocumentsJSONL).

## Criar ou modificar documento

Esse endpoint cria ou modifica um documento a partir do seu nome. Quando um documento é modificado, seus vetores de indexação são resetados, isto é, o documento entrará em fila novamente para ser indexado pelo motor de indexação.

Essa indexação não é isenta de custo. O custo é relativo à quantidade de tokens do conteúdo enviado. O custo somente é gerado quando o documento é de fato alterado. Chamar essa rota com o mesmo conteúdo do documento não gera modificação, portanto, não gera custo.

> [!WARNING]
>
> Atenção: esse endpoint gera custo. O custo é calculado em cima dos tokens do conteúdo do arquivo. O conteúdo do arquivo é tokenizado de acordo com o modelo usado na indexação dos documentos.

Para detalhes sobre como criar ou modificar documentos, consulte o endpoint [Create or Update Document](https://inference.aivax.net/apidocs#CreateorUpdateDocument).


## Listar documentos

Esse endpoint lista todos os documentos disponíveis em uma coleção. Você pode passar um parâmetro da query adicional `filter` para filtrar documentos por nome, tag ou conteúdo.

Esse filtro suporta expressões que auxiliam a filtrar o que você está procurando:
- `-t "tag"` - filtra documentos que possuem essa tag.
- `-r "reference"` - filtra documentos que possuem esse ID de referência.
- `-c "content"` - filtra documentos que possuem esse trecho em seu conteúdo.
- `-n "name"` - filtra documentos que possuem esse trecho em seu nome.
- `in "id"` - filtra documentos por ID.

Para detalhes sobre como listar documentos, consulte o endpoint [Browse Documents](https://inference.aivax.net/apidocs#BrowseDocuments).

## Ver documento

Vê detalhes sobre um documento específico.

Para detalhes sobre como visualizar um documento, consulte o endpoint [Get Document](https://inference.aivax.net/apidocs#GetDocument).

## Excluir documento

Permanentemente exclui um documento através do seu ID.

Para detalhes sobre como excluir um documento, consulte o endpoint [Delete Document](https://inference.aivax.net/apidocs#DeleteDocument).