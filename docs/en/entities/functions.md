# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication medium. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with the help of AI.

Currently, it is only possible to use functions with models provided by Open Indexer.

## Calling a Function

To call an AI function, you will need to inform what the AI should respond with and provide a JSON schema that it should follow.

Less intelligent models tend to fail to generate JSON, resulting in an invalid or problematic document. To fix this, adjust your model, instruction, and attempt parameter if necessary.

You are charged for each attempt the AI makes to generate a response. Slightly more intelligent models tend to generate correct results on the first attempt. It is guaranteed that a valid JSON will be generated, but it is not guaranteed that the model will follow the names and types provided by your JSON schema.

Additionally, you can opt to activate **internet search** for function calls. This option can be useful for bringing relevant data in real-time to structure your response. When activating this option, you are charged for each internet search, with a fixed cost of **$0.012** American dollars per query.

An internal model decides which searches should be performed based on the instructions and input data provided, which is also charged at a low cost. Alternatively, you can specify the `searchTerms` parameter manually to avoid calling the internal model to obtain the search terms.

Specifying fewer search results is also possible and can help reduce the number of tokens processed by the AI model, and consequently, the cost of the operation.

Retry attempts to generate the JSON content do not search the internet again and do not call the internal model to create the questions.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    // Specify the name of the integrated model to be used for the action.
    "modelName": "@metaai/llama-3.1-8b",
    
    // Explain what your model should do with the input and how it should provide the response.
    "instructions": "Classify the user's comment, indicating whether it is positive or negative, and if it contains any relevant information (a number between 0 (not relevant) and 10 (very relevant))",
    
    // The JSON object that the model should generate. You can provide generation examples in the instructions field. This object must be a valid JSON in the API.
    // This object must be an object, an array, or a string.
    "responseSchema": {
        "feedbackType": "neutral | positive | negative",
        "informationScore": 5
    },
    
    // Optional. Defines a JSON input for the model. Can be any type of JSON value.
    "inputData": {
        "userComment": "Terrible market. There's a guard inside watching you so you don't steal and the butchers ignore you and serve pretty girls in front of you. But thank God there are other markets coming and the end of this circus will arrive"
    },
    
    // Optional. Defines how many attempts the model should make before the API returns an error. Must be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the time limit in seconds to obtain a valid JSON before the API returns an error. Must be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Allows the model to perform an internet search to improve the response construction.
    "webSearch": {

        // Enables or disables internet search for the function.
        "enabled": true,

        // Defines the search terms that will be performed to complement the model. Leave empty for an internal model to automatically generate the search terms.
        "searchTerms": [],

        // Maximum number of results per search term that will be attached to the generation context.
        "maxResultsPerTerm": 5
    }
}
```

#### Response

```json
{
    "message": null,
    "data": {
        // The result contains the object defined in "responseSchema", with the fields filled in by the AI
        "result": {
            "feedbackType": "negative",
            "informationScore": 8
        },
        
        // Which attempt the AI was able to generate a valid JSON
        "attempt": 1,
        
        // The time in milliseconds to obtain a valid JSON
        "elapsedMilliseconds": 527
    }
}
```

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
    "instructions": "Summarize the user's comment, creating a short description with a maximum of 10 words indicating what they want to do. Also, indicate whether this comment requires attention or not.",
    "responseSchema": {
        "shortSummary": "...",
        "requiresAttention": false
    },
    "inputData": "The customer Fernando de Castro has been trying to contact support since Friday and says he will cancel if he doesn't speak to someone today. He also said he is a friend of Rebeca from the commercial and is threatening to speak badly about the company on TikTok. Please, can someone attend to this guy??"
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

#### Bring latest news and weather for a specific city

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-1.5-flash-8b",
    "instructions": "You are a model that searches for the last five news for the city the user informs. Create a short title for each news and details of what it covers. Also, bring weather data for the searched city.",
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
                    "title": "Aid arrested for shooting at ex-girlfriend",
                    "details": "An aid was arrested suspected of shooting with a shotgun at his ex-girlfriend and her ex-partner in the Ypê neighborhood, in Ilha Solteira (SP). The woman was rescued and taken to the Regional Hospital, where she underwent surgery.",
                    "link": "https://g1.globo.com/sp/sao-jose-do-rio-preto-aracatuba/"
                },
                {
                    "title": "Rio Preto doctors form society with mentorships",
                    "details": "Doctors from Rio Preto officially formed a society with mentorship companies.",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Land regularization guarantees property in Rio Preto",
                    "details": "A land regularization project guarantees security for Rio Preto residents.",
                    "link": "https://regional24horas.com.br/rio-preto"
                },
                {
                    "title": "Petrobras reduces diesel price",
                    "details": "Petrobras reduced the diesel price starting this Tuesday (6).",
                    "link": "https://www.gazetaderiopreto.com.br/"
                },
                {
                    "title": "Third lane construction on Washington Luís begins",
                    "details": "The construction of the third lane on Washington Luís begins this Monday.",
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
            "weather in São José do Rio Preto",
            "news São José do Rio Preto and region"
        ]
    }
}
```