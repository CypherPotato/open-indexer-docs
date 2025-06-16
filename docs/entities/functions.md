# Funções

Funções é uma forma de forçar seu modelo à processamento de informações usando JSON como intermédio de comunicação. Com as funções, você consegue fazer qualquer modelo responder no formato JSON que você quiser.

Pode ser útil para categorizar comentários, aplicar moderação em avaliações ou processar informações com auxílio da IA.

No momento, só é possível usar funções com [modelos providos pela Open Indexer]().

## Chamar uma função

Para chamar uma função de IA, você precisará informar o que a IA deverá responder e fornecer um esquema JSON que ela deverá seguir.

Modelos menos inteligentes tendem a falhar a geração de JSON, gerando um documento inválido ou problemático. Para isso, ajuste seu modelo, a instrução e o parâmetro de tentativas se for necessário.

Você é cobrado por cada tentativa que a IA tentar gerar. Modelos um pouco mais inteligentes tendem a gerar resultados corretos na primeira tentativa. É garantido que um JSON válido será gerado e que esse JSON seguirá o mesmo esquema fornecido na requisição.

Adicionalmente, você pode optar em ativar **pesquisa na internet** para chamada de função. Essa opção pode ser útil para trazer dados relevantes em tempo real ao estruturar sua resposta. Ao usar essa função, um modelo com acesso na internet será usado para obter dados da internet para estruturar sua resposta. Esse modelo também tentará estruturar sua resposta a partir dos dados fornecidos, e se conseguir formular um JSON válido a etapa de chamar o modelo de estruturação é ignorada e a resposta é imediatamente retornada.

Se for o caso do modelo de busca online não conseguir estruturar um JSON válido, o modelo escolhido na requisição ficará responsável por essa tarefa, e irá começar o encadeamento de tentativas de geração. Modelos mais inteligentes acertam a geração nas primeiras tentativas.

Através da propriedade `fetch`, você pode fornecer uma lista de URLs para serem anexadas no contexto da geração. O Open Indexer faz uma requisição GET para acessar os conteúdos fornecidos e renderiza-os no conteúdo da requisição. Somente respostas 2xx ou 3xx são aceitas e o conteúdo da resposta deve ser textual. Respostas em HTML são sanitizadas para incluirem somente o texto da página, sem script e CSS.

O tamanho máximo que pode ser lido de uma URL do fetch é 10 Mb. O máximo de itens para o fetch são 10 URLs.

Requisições que pesquisam na internet trazem bons resultados e dispensam crawlers, scrappers ou a necessidade de pagar por uma API específica, mas podem ser custosas e relativamente lentas para serem obtidas. Considere usar um cache do lado da sua aplicação para dados que não precisam ser constantementes atualizados, como dados meteorológicos, estatísticas diárias, etc. A Open Indexer não realiza nenhum cache pelo nosso lado.

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    // Obrigatório. Especifique o nome do modelo integrado que será usado para realizar a ação.
    "modelName": "@metaai/llama-3.1-8b",
    
    // Obrigatório. Explique o que seu modelo deverá fazer com a entrada e como ele deve trazer a resposta.
    "instructions": "Classifique o comentário do usuário, indicando se é positivo ou negativo, e se possui alguma informação relevante (número entre 0 (pouco relevante) e 10 (muito relevante))",
    
    // Obrigatório. O objeto JSON que o modelo deverá gerar. Você pode fornecer exemplos de geração no campo de instruções. Esse objeto deve ser um JSON válido na API.
    // Esse objeto deve ser um objeto, um array ou uma string.
    "responseSchema": {
        "feedbackType": "{neutral|positive|negative}",
        "informationScore": 5
    },
    
    // Opcional. Especifica uma lista de caminhos JSON que a IA deve gerar conteúdo sempre e que esse campo não pode ser nulo. Para arrays, especifique com [*].
    "requiredFields": [
        "$.feedbackType",
        "$.informationScore"
    ],
    
    // Opcional. Define uma entrada JSON para o modelo. Pode ser qualquer tipo de valor JSON.
    "inputData": {
        "userComment": "Pessimo mercado. Tem guarda dentro te vigiando pra vc nao roubar e os acougueiros te ignoram e atendem mocinhas bonitinhas na tua frente.  Mas graças a Deus tem outros mercados chegando e o fim dessa palhaçada vai chegar"
    },
    
    // Opcional. Define quantas tentativas o modelo deve tentar antes da API retornar um erro. Deve ser um número entre 1 e 30.
    "maxAttempts": 10,
    
    // Opcional. Define o tempo limite em segundos para obter um JSON válido antes da API retornar um erro. Deve ser um número entre 1 e 3600 (uma hora).
    "timeout": 300,
    
    // Opcional. Adiciona recursos externos para complementar a geração da resposta.
    "fetch": {

        // Obrigatório. Fornece a lista de URLS que o Open Indexer irá acessar. O máximo são 10 URLs.
        "urls": [
            "https://url1...",
            "https://url2...",
        ],
    
        // Opcional. Define o comportamento do fetch para erros ao tentar acessar o site. Erros incluem respostas que não são 2xx ou 3xx, timeouts, erros de certificados, etc.
        //      fail    -> retorna um erro na resposta da função (padrão)
        //      warn    -> adiciona um aviso na resposta da função e não inclui o erro na geração da IA
        //      ignore  -> ignora o erro e adiciona o erro na geração da IA
        "fetchFailAction": "fail" | "warn" | "ignore",
        
        // Opcional. Define o timeout em segundos para o tempo maximo da resposta responder e ler os conteúdos. O máximo é 120 segundos (dois minutos).
        "timeout": 10,
        
        // Opcional. Define o tamanho máximo do conteúdo em quantidade de caracteres que podem ser incluídos na geração da IA antes de serem truncados.
        "pageMaxLength": 2048
    }
}
```

#### Resposta

```json
{
    "message": null,
    "data": {
        // o resultado contém o objeto definido em "responseSchema", com os campos preenchidos pela IA
        "result": {
            "feedbackType": "negative",
            "informationScore": 8
        },
        
        // em qual tentativa a IA conseguiu um JSON válido
        "attempt": 1,
        
        // o tempo em milissegundos para obter um JSON válido
        "elapsedMilliseconds": 527,
        
        // avisos produzidos pela geração
        "warnings": []
    }
}
```

## Considerações sobre o esquema JSON

- Especifique valores enumerados com `"{valor1|valor2|valor3}"`. Dessa forma, o modelo deverá escolher um dos valores apresentados na geração do JSON.
- Todos os valores são placeholders para a geração do modelo.
- Indique o que um campo é ou o que deve receber de valor com um hint em seu próprio placeholder ou indique diretamente nas instruções da função.
- Todos os valores podem ser nulos, à menos que você especifique diretamente para o modelo que não podem.
- A estrutura de saída do modelo é a mesma que informada em `responseSchema`.
- A estrutura de entrada é indiferente.

## Funções em tempo real com modelos Sentinel

Você pode usar os agentes Sentinel para executar funções inteligentes que envolvam pesquisa na internet, execução de código, resolução de contas matemáticas e todas as outras funcionalidades que agentes Sentinel consigam fornecer.

Agentes Sentinel são conectados à internet por padrão, portanto, é natural que ele pesquise algo na internet para complementar sua resposta. Ao usar chamar uma função com um modelo que pesquisa na internet, como um agente Sentinel, o limite de consumo contabilizado é de Live Function.

## Exemplos

Confira exemplos de funções de IA para várias tarefas cotidianas:

#### Resumir pedido e classificar se requer atenção ou não

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@metaai/llama-4-scout-17b",
    "instructions": "Resuma o comentário do usuário, criando uma descrição curta, com no máximo de 10 palavras indicando o que ele quer fazer. Indique também se esse comentário requer atenção ou não.",
    "responseSchema": {
        "shortSummary": "...",
        "requiresAttention": false
    },
    "inputData": "O cliente fernando de castro está tentando entrar em contato com o suporte desde sexta-feira e diz q vai cancelar se nao falar com alguém hoje. ele tbm disse que é amigo da rebeca do comercial e está ameaçando falar mal da empresa no tiktok. por favor alguém atende esse cara??"
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "shortSummary": "Cliente quer contato com suporte para evitar cancelamento e ameaça",
            "requiresAttention": true
        },
        "attempt": 1,
        "elapsedMilliseconds": 639
    }
}
```

#### Avaliar uma expressão matemática

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Avalie a conta matemática informada e forneça o resultado.",
    "responseSchema": {
        "result": "..."
    },
    "inputData": {
        "mathProblem": "12 + (42 / pi) ^ 20"
    }
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "result": "3.3265063290400284e+22"
        },
        "attempt": 0,
        "elapsedMilliseconds": 3869,
        "warnings": []
    }
}
```

#### Trazer últimas notícias e clima de uma determinada cidade

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Pesquise as 5 últimas notícias e dados meteorológicos para a cidade informada.",
    "responseSchema": {
        "latestNews": [
            {
                "title": "...",
                "details": "...",
                "link": "https://..."
            }
        ],
        "weather": {
            "currentTemperature": 0,
            "currentWeather": "{sunny|cloudy|rain|thunderstorm}",
            "forecast": "{sunny|cloudy|rain|thunderstorm}"
        }
    },
    "inputData": {
        "city": "São José do Rio Preto"
    }
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "latestNews": [
                {
                    "title": "Festival Paralímpico no Instituto Lucy Montoro",
                    "details": "Familiares e pacientes do Instituto de Reabilitação Lucy Montoro de Rio Preto (SP) participaram neste sábado (14) do Festival Paralímpico.",
                    "link": "https://g1.globo.com/sp/sao-jose-do-rio-preto-aracatuba/cidade/sao-jose-do-rio-preto/"
                },
                {
                    "title": "Investimento imobiliário na zona Leste de Rio Preto",
                    "details": "Empreendimentos residenciais marcam o maior investimento imobiliário na zona Leste de Rio Preto.",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Acidente na Washington Luís",
                    "details": "Motociclista é hospitalizado após se envolver em acidente na Washington Luís, em Rio Preto.",
                    "link": "https://www.diariodaregiao.com.br/cidades"
                },
                {
                    "title": "Curso gratuito para artistas",
                    "details": "Curso gratuito ensina artistas de Rio Preto e região a escrever projetos para editais culturais.",
                    "link": "https://www.diariodaregiao.com.br/"
                },
                {
                    "title": "PIX automático",
                    "details": "Modalidade permite pagar contas recorrentes, como de energia, telefone, escolas, academias, entre outras, de forma automática pelo PIX.",
                    "link": "https://g1.globo.com/sp/sao-jose-do-rio-preto-aracatuba/"
                }
            ],
            "weather": {
                "currentTemperature": 23,
                "currentWeather": "sunny",
                "forecast": "sunny"
            }
        },
        "attempt": 0,
        "elapsedMilliseconds": 10990,
        "warnings": []
    }
}
```

#### Trazer estatísticas da COVID-19 em tempo real

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Traga a contagem de casos e mortes por COVID-19.",
    "responseSchema": {
        "deathsWorld": 0,
        "deathsBrazil": 0,
        "casesWorld": 0,
        "casesBrazil": 0
    }
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "deathsWorld": 7010681,
            "deathsBrazil": 711380,
            "casesWorld": 704753890,
            "casesBrazil": 38743918
        },
        "attempt": 1,
        "elapsedMilliseconds": 1620
    }
}
```

#### Trazer artistas em alta por gênero musical

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Pesquise e formate uma lista de 10 artistas no TOP 10 do streaming musical por gênero.",
    "responseSchema": {
        "edm": [
            "artist name",
            "artist name",
            "..."
        ],
        "rap": [
            "artist name",
            "artist name",
            "..."
        ],
        "pop": [
            "artist name",
            "artist name",
            "..."
        ]
    },
    "inputData": null
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "edm": [
                "Marshmello",
                "Swedish House Mafia",
                "Skrillex",
                "Illenium",
                "John Summit",
                "Kaskade",
                "Daft Punk",
                "Deadmau5",
                "Avicii",
                "Calvin Harris"
            ],
            "rap": [
                "Drake",
                "Kendrick Lamar",
                "Eminem",
                "Travis Scott",
                "J. Cole",
                "Nicki Minaj",
                "21 Savage",
                "Metro Boomin",
                "Lil Wayne",
                "Bad Bunny"
            ],
            "pop": [
                "Taylor Swift",
                "Bruno Mars",
                "The Weeknd",
                "Lady Gaga",
                "Billie Eilish",
                "Sabrina Carpenter",
                "Ariana Grande",
                "Ed Sheeran",
                "Post Malone",
                "Doja Cat"
            ]
        },
        "attempt": 0,
        "elapsedMilliseconds": 14961,
        "warnings": []
    }
}
```