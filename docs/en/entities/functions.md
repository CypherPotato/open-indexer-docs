# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication method. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with the help of AI.

Currently, it is only possible to use functions with [models provided by Open Indexer]().

## Calling a Function

To call an AI function, you will need to specify what the AI should respond with and provide a JSON schema that it should follow.

Less intelligent models tend to fail at generating JSON, resulting in an invalid or problematic document. To fix this, adjust your model, instruction, and attempt parameter if necessary.

You are charged for each attempt the AI makes to generate a response. Slightly more intelligent models tend to generate correct results on the first attempt. It is guaranteed that a valid JSON will be generated and that this JSON will follow the same schema provided in the request.

Additionally, you can choose to activate **internet search** for the function call. This option can be useful for bringing in relevant data in real-time when structuring your response. When using this function, a model with internet access will be used to obtain data from the internet to structure your response. This model will also attempt to structure your response based on the provided data, and if it can formulate a valid JSON, the step of calling the structuring model is ignored and the response is immediately returned.

If the online search model is unable to structure a valid JSON, the model chosen in the request will be responsible for this task and will start the attempt chain to generate a response. More intelligent models get it right on the first attempts.

Through the `fetch` property, you can provide a list of URLs to be attached to the generation context. Open Indexer makes a GET request to access the provided content and renders it in the request content. Only 2xx or 3xx responses are accepted, and the response content must be textual. HTML responses are sanitized to include only the page text, without scripts and CSS.

The maximum size that can be read from a fetch URL is 10 Mb. The maximum number of items for fetch is 10 URLs.

Retries for generating JSON content do not search the internet again or call the fetch content.

Requests that search the internet bring good results and dispense with crawlers, scrapers, or the need to pay for a specific API, but can be expensive and relatively slow to obtain. Consider using a cache on the side of your application for data that does not need to be constantly updated, such as weather data, daily statistics, etc. Open Indexer does not perform any caching on our side.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    // Required. Specify the name of the integrated model to be used to perform the action.
    "modelName": "@metaai/llama-3.1-8b",
    
    // Required. Explain what your model should do with the input and how it should bring the response.
    "instructions": "Classify the user's comment, indicating whether it is positive or negative, and if it has any relevant information (number between 0 (not very relevant) and 10 (very relevant))",
    
    // Required. The JSON object that the model should generate. You can provide generation examples in the instructions field. This object must be a valid JSON in the API.
    // This object must be an object, an array, or a string.
    "responseSchema": {
        "feedbackType": "{neutral|positive|negative}",
        "informationScore": 5
    },
    
    // Optional. Specifies a list of JSON paths that the AI must generate content for and that this field cannot be null. For arrays, specify with [*].
    "requiredFields": [
        "$.feedbackType",
        "$.informationScore"
    ],
    
    // Optional. Defines a JSON input for the model. Can be any type of JSON value.
    "inputData": {
        "userComment": "Terrible market. Has a guard inside watching you so you don't steal and the butchers ignore you and serve pretty girls in front of you. But thank God there are other markets coming and the end of this nonsense will come"
    },
    
    // Optional. Defines how many attempts the model should try before the API returns an error. Must be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the time limit in seconds to obtain a valid JSON before the API returns an error. Must be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Allows the model to perform an internet search to improve the construction of the response.
    "webSearch": {
        
        // Required. Activates or deactivates the internet search of the function.
        "enabled": true
    },
    
    // Optional. Adds external resources to complement the generation of the response.
    "fetch": {

        // Required. Provides the list of URLs that Open Indexer will access. The maximum is 10 URLs.
        "urls": [
            "https://url1...",
            "https://url2...",
        ],
    
        // Optional. Defines the behavior of the fetch for errors when trying to access the site. Errors include responses that are not 2xx or 3xx, timeouts, certificate errors, etc.
        //      fail    -> returns an error in the function response (default)
        //      warn    -> adds a warning to the function response and does not include the error in the AI generation
        //      ignore  -> ignores the error and adds the error to the AI generation
        "fetchFailAction": "fail" | "warn" | "ignore",
        
        // Optional. Defines the timeout in seconds for the maximum response time and reading the contents. The maximum is 120 seconds (two minutes).
        "timeout": 10,
        
        // Optional. Defines the maximum content size in character quantity that can be included in the AI generation before being truncated.
        "pageMaxLength": 2048
    }
}
```

#### Response

```json
{
    "message": null,
    "data": {
        // the result contains the object defined in "responseSchema", with the fields filled in by the AI
        "result": {
            "feedbackType": "negative",
            "informationScore": 8
        },
        
        // in which attempt the AI was able to generate a valid JSON
        "attempt": 1,
        
        // the time in milliseconds to obtain a valid JSON
        "elapsedMilliseconds": 527,
        
        // warnings produced by the generation
        "warnings": []
    }
}
```

## Considerations about the JSON Schema

- Specify enumerated values with `"{value1|value2|value3}"`. In this way, the model should choose one of the values presented in the generation of the JSON.
- All values are placeholders for the model generation.
- Indicate what a field is or what it should receive as a value with a hint in its own placeholder or indicate directly in the function instructions.
- All values can be null, unless you specify directly to the model that they cannot.
- The output structure of the model is the same as informed in `responseSchema`.
- The input structure is irrelevant.

## Examples

Check out examples of AI functions for various everyday tasks:

#### Summarize order and classify if it requires attention or not

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@metaai/llama-4-scout-17b",
    "instructions": "Summarize the user's comment, creating a short description, with a maximum of 10 words indicating what they want to do. Also, indicate if this comment requires attention or not.",
    "responseSchema": {
        "shortSummary": "...",
        "requiresAttention": false
    },
    "inputData": "The customer Fernando de Castro has been trying to contact support since Friday and says he will cancel if he doesn't speak to someone today. He also said he is a friend of Rebecca from the commercial and is threatening to speak badly about the company on TikTok. Please, can someone attend to this guy??"
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "shortSummary": "Customer wants contact with support to avoid cancellation and threatens",
            "requiresAttention": true
        },
        "attempt": 1,
        "elapsedMilliseconds": 639
    }
}
```

#### Bring latest news and weather for a given city

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-2.0-flash-lite",
    "instructions": "Search for the 5 latest news and weather data for the informed city.",
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
                    "title": "GCM arrests trio for drug trafficking in Rio Preto's Calçadão",
                    "details": "The Municipal Guard (GCM) of São José do Rio Preto arrested, on Tuesday night (6), three people suspected of drug trafficking in the Calçadão [4, 9].",
                    "link": "https://dhoje.com.br/gcm-prende-trio-por-trafico-de-drogas-no-calcadao-de-rio-preto/"
                },
                {
                    "title": "Job Supported makes selection for people with disabilities",
                    "details": "A beverage distributor in Rio Preto makes a selection this Thursday, 8/5, from 9 am to 11 am [4, 9].",
                    "link": "https://dhoje.com.br/emprego-apoiado-faz-selecao-para-pessoas-com-deficiencia/"
                },
                {
                    "title": "Social Fund distributes Love Kit to pregnant women in Rio Preto",
                    "details": "The Social Fund's campaign mobilizes volunteers and the population to support mothers in Rio Preto [4].",
                    "link": "https://dhoje.com.br/fundo-social-distribui-enxoval-do-amor-para-gestantes-em-rio-preto/"
                },
                {
                    "title": "PM opens 2,200 vacancies for police officers to work",
                    "details": "The São Paulo Military Police published, on Tuesday, 6, an edict for the hiring of 2,200 military police officers from the reserve to work [4].",
                    "link": "https://dhoje.com.br/pm-abre-22-mil-vagas-para-policiais-da-reserva-atuarem/"
                },
                {
                    "title": "Rio Preto may receive R$ 63.8 million from the State of São Paulo for improvement works",
                    "details": "The mayor is seeking R$ 63.8 million to make a package of works viable [4].",
                    "link": "https://dhoje.com.br/infraestrutura-prefeito-busca-r-638-milhoes-para-viabilizar-pacotaco-de-obras/"
                }
            ],
            "weather": {
                "currentTemperature": 18,
                "currentWeather": "sunny",
                "forecast": "sunny"
            }
        },
        "attempt": 1,
        "elapsedMilliseconds": 4187
    }
}
```

#### Bring COVID-19 statistics in real-time

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-1.5-flash-8b",
    "instructions": "Bring the count of cases and deaths by COVID-19.",
    "responseSchema": {
        "deathsWorld": 0,
        "deathsBrazil": 0,
        "casesWorld": 0,
        "casesBrazil": 0
    },
    "inputData": null,
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

#### Bring top artists by music genre

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-1.5-flash-8b",
    "instructions": "Search and format a list of 10 artists in the TOP 10 of music streaming by genre.",
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
    "inputData": null,
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
            "edm": [
                "David Guetta",
                "Calvin Harris",
                "The Chainsmokers",
                "Marshmello",
                "Avicii",
                "Kygo",
                "Tiesto",
                "DJ Snake",
                "Daft Punk",
                "Skrillex"
            ],
            "rap": [
                "Drake",
                "Eminem",
                "Kanye West",
                "Juice WRLD",
                "Travis Scott",
                "XXXTENTACION",
                "Kendrick Lamar",
                "Future",
                "J. Cole",
                "Nicki Minaj"
            ],
            "pop": [
                "Taylor Swift",
                "Drake",
                "Bad Bunny",
                "The Weeknd",
                "Ed Sheeran",
                "Ariana Grande",
                "Justin Bieber",
                "Billie Eilish",
                "Rihanna",
                "Bruno Mars"
            ]
        },
        "attempt": 1,
        "elapsedMilliseconds": 8370
    }
}
```