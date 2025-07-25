# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication medium. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with the help of AI.

Currently, it is only possible to use functions with [models provided by AIVAX]().

## Calling a Function

To call an AI function, you will need to inform what the AI should respond with and provide a JSON Schema that it should follow.

Less intelligent models tend to fail JSON generation, generating an invalid or problematic document. To fix this, adjust your model, instruction, and attempt parameter if necessary.

You are charged for each attempt the AI tries to generate. Slightly more intelligent models tend to generate correct results on the first attempt. It is guaranteed that a valid JSON will be generated and that this JSON will follow the same schema provided in the request.

Additionally, you can opt to activate **internet search** for function calls. This option can be useful for bringing relevant data in real-time when structuring your response. When using this function, a model with internet access will be used to obtain data from the internet to structure your response. This model will also try to structure your response based on the provided data, and if it can formulate a valid JSON, the step of calling the structuring model is ignored and the response is immediately returned.

If the online search model cannot structure a valid JSON, the model chosen in the request will be responsible for this task and will start the attempt chain to generate. More intelligent models hit the generation on the first attempts.

Through the `fetch` property, you can provide a list of URLs to be attached to the generation context. AIVAX makes a GET request to access the provided content and renders it in the request content. Only 2xx or 3xx responses are accepted, and the response content must be textual. HTML responses are sanitized to include only the page text, without scripts and CSS.

The maximum size that can be read from a fetch URL is 10 Mb. The maximum number of items for fetch is 10 URLs.

Requests that search the internet bring good results and dispense with crawlers, scrapers, or the need to pay for a specific API, but can be costly and relatively slow to obtain. Consider using a cache on the side of your application for data that does not need to be constantly updated, such as weather data, daily statistics, etc. AIVAX does not perform any caching on our side.

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
    "instructions": "Classify the user's comment, indicating whether it is positive or negative, and if it has any relevant information (number between 0 (little relevant) and 10 (very relevant))",
    
    // Required. The JSON Schema that the model should follow to generate the response. You can provide generation examples in the instruction field.
    "responseSchema": {
        "type": "object",
        "properties": {
            "feedbackType": {
                "type": "string",
                "enum": ["neutral", "positive", "negative"]
            },
            "informationScore": {
                "type": "integer",
                "minimum": 0,
                "maximum": 10
            }
        },
        "required": ["feedbackType", "informationScore"]
    },
    
    // Optional. Defines a JSON input for the model. Can be any type of JSON value.
    "inputData": {
        "userComment": "Pessimo mercado. Tem guarda dentro te vigiando pra vc nao roubar e os acougueiros te ignoram e atendem mocinhas bonitinhas na tua frente.  Mas graças a Deus tem outros mercados chegando e o fim dessa palhaçada vai chegar"
    },
    
    // Optional. Defines how many attempts the model should try before the API returns an error. Should be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the time limit in seconds to obtain a valid JSON before the API returns an error. Should be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Defines the temperature of JSON generation. Higher values tend to be more creative, while lower values are more deterministic. Number from 0 to 2.
    "temperature": 0.4,
    
    // Optional. Adds external resources to complement the response generation.
    "fetch": {
        
        // Required. Provides the list of URLs that AIVAX will access to complement the response generation. The maximum is 10 URLs.
        "urls": [
            "https://url1...",
            "https://url2...",
        ],
    
        // Optional. Defines the fetch behavior for errors when trying to access the site. Errors include responses that are not 2xx or 3xx, timeouts, certificate errors, etc.
        //      fail    -> returns an error in the function response (default)
        //      ignore  -> ignores the error and adds the error to the AI generation
        "fetchFailAction": "fail" | "ignore",
        
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
        // the result contains the object generated by the AI, following the "responseSchema"
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

## JSON Schema Guidelines

The response format must be provided by a JSON Schema.

Behind the scenes, AIVAX guides the model to generate a response with the provided JSON Schema. When the model generates something invalid, we indicate to it to try again and correct the errors until the output is according to the provided specification.

The supported JSON Schema guidelines from AIVAX are:

- `string`:
    - `minLength`
    - `maxLength`
    - `pattern`
    - `format`
        - Can be `date-time`, `email`, `time`, `duration`, `uri`, `url`, `ipv4`, `ipv6`, `uuid` or `guid`.
    - `enum`
- `number` and `integer`:
    - `minimum`
    - `maximum`
    - `exclusiveMinimum`
    - `exclusiveMaximum`
    - `multipleOf`
- `array`:
    - `items`
    - `uniqueItems`
    - `minItems`
    - `maxItems`
- `object`:
    - `properties`
    - `required`
- `bool` and `boolean`
- `null`

Additionally, it is possible to inform one or more values in the `type` of the object, example:

```json
{
    "type": ["string", "number"]
}
```

> Note: `number` and `integer` are synonymous, and `integer` does not guarantee that the number will be an integer. If necessary, truncate the returned number.

## Real-time Functions with Sentinel Models

You can use the `@aivax/fn-1` and `@aivax/fn-1-mini` agents to execute intelligent functions that involve internet search, code execution, and/or mathematical problem-solving.

These agents are connected to the internet by default, so it is natural that they search for something on the internet to complement their response.

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
        "type": "object",
        "properties": {
            "shortSummary": {
                "type": "string",
                "description": "A brief description of what the user wants to do, with a maximum of 10 words."
            },
            "requiresAttention": {
                "type": "boolean",
                "description": "Indicates if the comment requires immediate attention (true) or not (false)."
            }
        },
        "required": ["shortSummary", "requiresAttention"]
    },
    "inputData": "The client Fernando de Castro has been trying to contact support since Friday and says he will cancel if he doesn't speak to someone today. He also said he is a friend of Rebeca from the commercial and is threatening to speak badly about the company on TikTok. Please, can someone attend to this guy??"
}
```

```json
{
    "message": null,
    "data": {
        "result": {
            "shortSummary": "Client wants contact with support to avoid cancellation and threat",
            "requiresAttention": true
        },
        "attempt": 1,
        "elapsedMilliseconds": 639
    }
}
```

#### Evaluate a mathematical expression

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/fn-1",
    "instructions": "Evaluate the given mathematical problem and provide the result.",
    "responseSchema": {
        "type": "object",
        "properties": {
            "result": {
                "type": ["string", "number"],
                "description": "The result of the mathematical expression evaluation."
            }
        },
        "required": ["result"]
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

#### Bring latest news and weather for a given city

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/fn-1",
    "instructions": "Search for the 5 latest news and weather data for the given city.",
    "responseSchema": {
        "type": "object",
        "properties": {
            "latestNews": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": { "type": "string" },
                        "details": { "type": "string" },
                        "link": { "type": "string", "format": "uri" }
                    },
                    "required": ["title", "details", "link"]
                }
            },
            "weather": {
                "type": "object",
                "properties": {
                    "currentTemperature": { "type": "number" },
                    "currentWeather": {
                        "type": "string",
                        "enum": ["sunny", "cloudy", "rain", "thunderstorm", "partly cloudy", "clear"]
                    },
                    "forecast": {
                        "type": "string",
                        "enum": ["sunny", "cloudy", "rain", "thunderstorm", "partly cloudy", "clear"]
                    }
                },
                "required": ["currentTemperature", "currentWeather", "forecast"]
            }
        },
        "required": ["latestNews", "weather"]
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

#### Bring COVID-19 statistics in real-time

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/fn-1",
    "instructions": "Bring the count of cases and deaths by COVID-19.",
    "responseSchema": {
        "type": "object",
        "properties": {
            "deathsWorld": { "type": "integer", "description": "Total number of deaths by COVID-19 in the world." },
            "deathsBrazil": { "type": "integer", "description": "Total number of deaths by COVID-19 in Brazil." },
            "casesWorld": { "type": "integer", "description": "Total number of cases of COVID-19 in the world." },
            "casesBrazil": { "type": "integer", "description": "Total number of cases of COVID-19 in Brazil." }
        },
        "required": ["deathsWorld", "deathsBrazil", "casesWorld", "casesBrazil"]
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
    "modelName": "@aivax/fn-1",
    "instructions": "Search and format a list of 10 artists in the TOP 10 of music streaming by genre.",
    "responseSchema": {
        "type": "object",
        "properties": {
            "edm": {
                "type": "array",
                "items": { "type": "string", "description": "Name of a top EDM artist." },
                "minItems": 10,
                "maxItems": 10
            },
            "rap": {
                "type": "array",
                "items": { "type": "string", "description": "Name of a top Rap artist." },
                "minItems": 10,
                "maxItems": 10
            },
            "pop": {
                "type": "array",
                "items": { "type": "string", "description": "Name of a top Pop artist." },
                "minItems": 10,
                "maxItems": 10
            }
        },
        "required": ["edm", "rap", "pop"]
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