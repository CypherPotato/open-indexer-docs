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

Como todos os documentos são entidades que pertencem à uma [coleção](/entities/collections), sempre tenha em mãos a coleção de onde o documento está/será localizado.

## Enviar documentos em lote

Para enviar uma lista em massa de documentos para uma coleção, estruture-os seguindo o formato [JSONL](https://jsonlines.org/). A estrutura do arquivo de indexação é:

```json
{"docid":"Carros/HondaCivic2015.rmd:1","text":"O Honda Civic 2015 está disponível em [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
{"docid":"Carros/HondaCivic2015.rmd:2","text":"O motor do Honda Civic 2015 é [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
{"docid":"Carros/HondaCivic2015.rmd:3","text":"A cor do Honda Civic 2015 é Amarela [...]","__ref":null,"__tags":["Carros","Honda-Civic-2015"]}
...
```

A estrutura é compsta pelas propriedades:

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

#### Requisição

O envio deve ser feito usando **multipart form data**.

<div class="request-item get">
    <span>POST</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

```text
documents=[documents.jsonl]
```

#### Resposta

```json
{
    "message": null,
    "data": [
        {
            "name": "Institucional/Empresa.rmd:1",
            "documentId": "01965f93-a36b-7fc2-9e6a-c733f4955927"
        },
        {
            "name": "Institucional/Empresa.rmd:2",
            "documentId": "01965f93-a390-79d3-9b3d-338d407f6b64"
        },
        {
            "name": "Institucional/Empresa.rmd:3",
            "documentId": "01965f93-a391-79ef-adcf-737d98303a78"
        },
        {
            "name": "Produtos/Agendamentos.rmd:1",
            "documentId": "01965f93-a391-712e-9292-c4d8e010bf42"
        },
        ...
    ]
}
```

## Criar ou modificar documento

Esse endpoint cria ou modifica um documento a partir do seu nome. Quando um documento é modificado, seus vetores de indexação são resetados, isto é, o documento entrará em fila novamente para ser indexado pelo motor de indexação.

Essa indexação não é isenta de custo. O custo é relativo à quantidade de tokens do conteúdo enviado. O custo somente é gerado quando o documento é de fato alterado. Chamar essa rota com o mesmo conteúdo do documento não gera modificação, portanto, não gera custo.

> [!WARNING]
>
> Atenção: esse endpoint gera custo. O custo é calculado em cima dos tokens do conteúdo do arquivo. O conteúdo do arquivo é tokenizado de acordo com o modelo usado na indexação dos documentos.

#### Requisição

<div class="request-item put">
    <span>PUT</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

```json
{
    // o nome do documento que será modificado
    "name": "document-name",

    // o conteúdo do documento que será criado ou sobreposto caso o nome já exista
    "contents": "Conteúdo do meu documento",
    
    // parâmetros explicados anteriormente
    "reference": null,
    "tags": ["products", "my-product"]
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        "documentId": "0196663c-3a15-72c7-98e6-b496f8e8bb8c",
        
        // o estado da operação indicando o resultado da operação:
        // NotModified - não foi modificado (sem alterações)
        // Modified - houve alterações e o documento foi agendado para indexação
        // Created - documento não existia e foi agendado para indexação
        "state": ["Modified"]
    }
}
```


## Listar documentos

Esse endpoint lista todos os documentos disponíveis em uma coleção. Você pode passar um parâmetro da query adicional `filter` para filtrar documentos por nome, tag ou conteúdo.

Esse filtro suporta expressões que auxiliam a filtrar o que você está procurando:
- `-t "tag"` - filtra documentos que possuem essa tag.
- `-r "reference"` - filtra documentos que possuem esse ID de referência.
- `-c "content"` - filtra documentos que possuem esse trecho em seu conteúdo.
- `-n "name"` - filtra documentos que possuem esse trecho em seu nome.
- `in "id"` - filtra documentos por ID.

#### Requisição

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": {
        "pageInfo": {
            "currentPage": 1,
            "hasMoreItems": true
        },
        "items": [
            {
                "id": "01968452-69f6-7f00-a497-d14c5b906b79",
                "name": "Ajuda/Clientes.rmd:1",
                "reference": null,
                "tags": [
                    "Ajuda",
                    "Clientes"
                ],
                "contentsPreview": "Um cliente é um cadastro na sua platafor...",
                "indexState": ["Indexed"]
            },
            {
                "id": "01968452-6a53-7ce3-adad-fad32d508856",
                "name": "Ajuda/Clientes.rmd:2",
                "reference": null,
                "tags": [
                    "Ajuda",
                    "Clientes"
                ],
                "contentsPreview": "No cadastro do cliente, é possível modif...",
                "indexState": ["Indexed"]
            },
            ...
        ]
    }
}
```

## Ver documento

Vê detalhes sobre um documento específico.

#### Requisição

<div class="request-item get">
    <span>GET</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents/<span>{document-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": null,
    "data": {
        "id": "01965f93-a36b-7fc2-9e6a-c733f4955927",
        "name": "Institucional/Empresa.rmd:1",
        
        // representa a situação de indexação do documento.
        // valores válidos: Queud, Indexed, Cancelled
        "state": ["Indexed"],

        // conteúdo do documento indexado
        "contents": "...",

        // id da referência do documento
        "reference": "institucional-empresa"
    }
}
```

## Excluir documento

Permanentemente exclui um documento através do seu ID.

#### Requisição

<div class="request-item delete">
    <span>DELETE</span>
    <span>
        /api/v1/collections/<span>{collection-id}</span>/documents/<span>{document-id}</span>
    </span>
</div>

#### Resposta

```json
{
    "message": "Document removed.",
    "data": null
}
```