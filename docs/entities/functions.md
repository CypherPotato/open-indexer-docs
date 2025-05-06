# Funções

Funções é uma forma de forçar seu modelo à processamento de informações usando JSON como intermédio de comunicação. Com as funções, você consegue fazer qualquer modelo responder no formato JSON que você quiser.

Pode ser útil para categorizar comentários, aplicar moderação em avaliações ou processar informações com auxílio da IA.

No momento, só é possível usar funções com [modelos providos pela Open Indexer]().

## Chamar uma função

Para chamar uma função de IA, você precisará informar o que a IA deverá responder e fornecer um esquema JSON que ela deverá seguir.

Modelos menos inteligentes tendem a falhar a geração de JSON, gerando um documento inválido ou problemático. Para isso, ajuste seu modelo, a instrução e o parâmetro de tentativas se for necessário.

Você é cobrado por cada tentativa que a IA tentar gerar. Modelos um pouco mais inteligentes tendem a gerar resultados corretos na primeira tentativa. É garantido que um JSON válido será gerado, mas não é garantido que o modelo seguirá os nomes e tipos fornecidos pelo seu esquema JSON.

Adicionalmente, você pode optar em ativar **pesquisa na internet** para chamada de função. Essa opção pode ser útil para trazer dados relevantes em tempo real ao estruturar sua resposta. Ao ativar essa opção, você é cobrado por cada pesquisa feita na internet, tendo o custo fixo de **$ 0,012** dólares americanos por consulta realizada.

Um modelo interno decide quais pesquisas devem ser feitas a partir das instruções e entrada de dados fornecida, o que também é cobrado por um custo baixo, ou, você pode especificar no parâmetro `searchTerms` os termos de pesquisa manualmente, evitando a chamada do modelo interno para obter os termos de pesquisa.

Especificar menos resultados de pesquisa também é possível e podem ajudar a reduzir a quantia de tokens processados pelo modelo de IA, e, consequentemente, o custo da operação.

Retentativas de geração do conteúdo JSON não pesquisam na internet novamente e nem chamam o modelo interno para criar as perguntas.

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    // Especifique o nome do modelo integrado que será usado para realizar a ação.
    "modelName": "@metaai/llama-3.1-8b",
    
    // Explique o que seu modelo deverá fazer com a entrada e como ele deve trazer a resposta.
    "instructions": "Classifique o comentário do usuário, indicando se é positivo ou negativo, e se possui alguma informação relevante (número entre 0 (pouco relevante) e 10 (muito relevante))",
    
    // O objeto JSON que o modelo deverá gerar. Você pode fornecer exemplos de geração no campo de instruções. Esse objeto deve ser um JSON válido na API.
    // Esse objeto deve ser um objeto, um array ou uma string.
    "responseSchema": {
        "feedbackType": "neutral | positive | negative",
        "informationScore": 5
    },
    
    // Opcional. Define uma entrada JSON para o modelo. Pode ser qualquer tipo de valor JSON.
    "inputData": {
        "userComment": "Pessimo mercado. Tem guarda dentro te vigiando pra vc nao roubar e os acougueiros te ignoram e atendem mocinhas bonitinhas na tua frente.  Mas graças a Deus tem outros mercados chegando e o fim dessa palhaçada vai chegar"
    },
    
    // Opcional. Define quantas tentativas o modelo deve tentar antes da API retornar um erro. Deve ser um número entre 1 e 30.
    "maxAttempts": 10,
    
    // Opcional. Define o tempo limite em segundos para obter um JSON válido antes da API retornar um erro. Deve ser um número entre 1 e 3600 (uma hora).
    "timeout": 300,
    
    // Opcional. Permite que o modelo faça uma busca na internet para aperfeiçoar a construção da resposta.
    "webSearch": {

        // Ativa ou desativa a pesquisa na internet da função.
        "enabled": true,

        // Define os termos de pesquisa que serão realizados para complementar o modelo. Deixe vazio para um modelo interno gerar os termos de pesquisa automaticamente.
        "searchTerms": [],

        // Máximo de resultados por termo de pesquisa que serão anexados no contexto de geração.
        "maxResultsPerTerm": 5
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
        "elapsedMilliseconds": 527
    }
}
```

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

#### Trazer últimas notícias e clima de uma determinada cidade

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-1.5-flash-8b",
    "instructions": "Você é um modelo que pesquisa as últimas cinco notícias para a cidade que o usuário informar. Crie um título curto para cada notícia e detalhes de o que ela aborda. Traga também dados de clima da cidade pesquisada.",
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
            "weatherType": "sunny | cloudy | rain | thunderstorm",
            "willRain": true
        }
    },
    "inputData": {
        "city": "São José do Rio Preto"
    },
    "webSearch": {
        "enabled": true
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
                    "title": "Ajudante preso por disparo contra ex-namorada",
                    "details": "Um ajudante foi preso suspeito de atirar com garrucha contra a ex-namorada e o ex-companheiro dela no bairro Ypê, em Ilha Solteira (SP). A mulher foi socorrida e levada para o Hospital Regional, onde passou por cirurgia.",
                    "link": "https://g1.globo.com/sp/sao-jose-do-rio-preto-aracatuba/"
                },
                {
                    "title": "Médicos rio-pretenses formam sociedade com mentorias",
                    "details": "Médicos de Rio Preto oficializaram uma sociedade com empresas de mentorias.",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Regularização fundiária garante propriedade em Rio Preto",
                    "details": "Projeto de regularização fundiária garante segurança para moradores de Rio Preto.",
                    "link": "https://regional24horas.com.br/rio-preto"
                },
                {
                    "title": "Petrobras reduz preço do diesel",
                    "details": "A Petrobras reduziu o preço do diesel a partir desta terça-feira (6).",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Obras da terceira faixa da Washington Luís iniciam",
                    "details": "As obras da terceira faixa da Washington Luís começam nesta segunda-feira.",
                    "link": "https://www.gazetaderiopreto.com.br/"
                }
            ],
            "weather": {
                "currentTemperature": 26,
                "weatherType": "cloudy",
                "willRain": true
            }
        },
        "attempt": 1,
        "elapsedMilliseconds": 7480,
        "searchedTerms": [
            "clima em são josé do rio preto",
            "notícias são josé do rio preto e região"
        ]
    }
}
```