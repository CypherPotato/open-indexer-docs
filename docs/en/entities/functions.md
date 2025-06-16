# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication medium. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with the help of AI.

Currently, it is only possible to use functions with models provided by Open Indexer.

## Calling a Function

To call an AI function, you will need to inform what the AI should respond to and provide a JSON schema that it should follow.

Less intelligent models tend to fail JSON generation, generating an invalid or problematic document. To fix this, adjust your model, the instruction, and the attempt parameter if necessary.

You are charged for each attempt the AI tries to generate. Slightly more intelligent models tend to generate correct results on the first attempt. It is guaranteed that a valid JSON will be generated, and this JSON will follow the same schema provided in the request.

Additionally, you can opt to activate **internet search** for function calls. This option can be useful for bringing relevant data in real-time when structuring your response. When using this function, a model with internet access will be used to obtain data from the internet to structure your response. This model will also try to structure your response based on the provided data, and if it can formulate a valid JSON, the step of calling the structuring model is ignored, and the response is immediately returned.

If the online search model cannot structure a valid JSON, the model chosen in the request will be responsible for this task and will start the attempt chain to generate. More intelligent models get it right on the first attempts.

Through the `fetch` property, you can provide a list of URLs to be attached to the generation context. Open Indexer makes a GET request to access the provided content and renders it in the request content. Only 2xx or 3xx responses are accepted, and the response content must be textual. HTML responses are sanitized to include only the page text, without scripts and CSS.

The maximum size that can be read from a fetch URL is 10 Mb. The maximum number of items for fetch is 10 URLs.

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
    "instructions": "Classify the user's comment, indicating whether it is positive or negative, and if it has any relevant information (number between 0 (not relevant) and 10 (very relevant))",
    
    // Required. The JSON object that the model should generate. You can provide generation examples in the instruction field. This object must be a valid JSON in the API.
    // This object must be an object, an array, or a string.
    "responseSchema": {
        "feedbackType": "{neutral|positive|negative}",
        "informationScore": 5
    },
    
    // Optional. Specifies a list of JSON paths that the AI should always generate content for and that this field cannot be null. For arrays, specify with [*].
    "requiredFields": [
        "$.feedbackType",
        "$.informationScore"
    ],
    
    // Optional. Defines a JSON input for the model. Can be any type of JSON value.
    "inputData": {
        "userComment": "Terrible market. Has a guard inside watching you so you don't steal and the butchers ignore you and serve pretty girls in front of you. But thank God there are other markets coming and the end of this circus will arrive"
    },
    
    // Optional. Defines how many attempts the model should try before the API returns an error. Must be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the time limit in seconds to obtain a valid JSON before the API returns an error. Must be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Adds external resources to complement the response generation.
    "fetch": {

        // Required. Provides the list of URLs that Open Indexer will access. The maximum is 10 URLs.
        "urls": [
            "https://url1...",
            "https://url2...",
        ],
    
        // Optional. Defines the fetch behavior for errors when trying to access the site. Errors include responses that are not 2xx or 3xx, timeouts, certificate errors, etc.
        //      fail    -> returns an error in the function response (default)
        //      warn    -> adds a warning to the function response and does not include the error in the AI generation
        //      ignore  -> ignores the error and adds the error to the AI generation
        "fetchFailAction": "fail" | "warn" | "ignore",
        
        // Optional. Defines the timeout in seconds for the maximum response time and reading the content. The maximum is 120 seconds (two minutes).
        "timeout": 10,
        
        // Optional. Defines the maximum content size in the number of characters that can be included in the AI generation before being truncated.
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

- Specify enumerated values with `"{value1|value2|value3}"`. In this way, the model should choose one of the values presented in the JSON generation.
- All values are placeholders for the model generation.
- Indicate what a field is or what value it should receive with a hint in its own placeholder or indicate directly in the function instructions.
- All values can be null, unless you specify directly to the model that they cannot.
- The output structure of the model is the same as informed in `responseSchema`.
- The input structure is irrelevant.

## Real-time Functions with Sentinel Models

You can use Sentinel agents to execute intelligent functions that involve internet search, code execution, mathematical problem-solving, and all other functionalities that Sentinel agents can provide.

Sentinel agents are connected to the internet by default, so it is natural that they search for something on the internet to complement their response. When using a function call with a model that searches the internet, such as a Sentinel agent, the consumption limit is Live Function.

## Examples

Check out examples of AI functions for various everyday tasks:

#### Summarize Order and Classify if it Requires Attention or Not

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

#### Evaluate a Mathematical Expression

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Evaluate the given math problem and provide the result.",
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

#### Bring Latest News and Weather for a Given City

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Search for the 5 latest news and weather data for the given city.",
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
                    "title": "Paralympic Festival at the Lucy Montoro Institute",
                    "details": "Family members and patients of the Lucy Montoro Rehabilitation Institute in Rio Preto (SP) participated on Saturday (14) in the Paralympic Festival.",
                    "link": "https://g1.globo.com/sp/sao-jose-do-rio-preto-aracatuba/cidade/sao-jose-do-rio-preto/"
                },
                {
                    "title": "Real estate investment in the east zone of Rio Preto",
                    "details": "Residential developments mark the largest real estate investment in the east zone of Rio Preto.",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Accident on Washington Luís",
                    "details": "Motorcyclist is hospitalized after being involved in an accident on Washington Luís, in Rio Preto.",
                    "link": "https://www.diariodaregiao.com.br/cidades"
                },
                {
                    "title": "Free course for artists",
                    "details": "Free course teaches artists from Rio Preto and the region to write projects for cultural notices.",
                    "link": "https://www.diariodaregiao.com.br/"
                },
                {
                    "title": "Automatic PIX",
                    "details": "Modality allows paying recurring bills, such as energy, phone, schools, gyms, among others, automatically through PIX.",
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

#### Bring COVID-19 Statistics in Real-time

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
    "instructions": "Bring the count of cases and deaths from COVID-19.",
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

#### Bring Artists on the Rise by Music Genre

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@aivax/sentinel-mini",
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