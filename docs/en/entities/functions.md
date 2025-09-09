# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with AI assistance.

Currently, functions can only be used with [models provided by AIVAX](/docs/en/models).

## Calling a function

To call an AI function, you need to specify what the AI should respond with and provide a JSON Schema that it must follow.

Less intelligent models tend to fail at generating JSON, producing an invalid or problematic document. To address this, adjust your model, the instruction, and the retry parameter if necessary.

You are charged for each attempt the AI makes to generate. Slightly smarter models tend to produce correct results on the first try. It is guaranteed that a valid JSON will be generated and that this JSON will follow the same schema provided in the request.

Consider using a cache on your application side for data that does not need to be constantly updated, such as weather data, daily statistics, etc. AIVAX does not perform any caching on our side.

#### Request

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    // Required. Specify the name of the integrated model that will be used to perform the action.
    "modelName": "@metaai/llama-3.1-8b",
    
    // Required. Explain what your model should do with the input and how it should produce the response.
    "instructions": "Classify the user's comment, indicating whether it is positive or negative, and whether it contains any relevant information (a number between 0 (not very relevant) and 10 (very relevant))",
    
    // Required. The JSON Schema that the model must follow to generate the response. You can provide generation examples in the instructions field.
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
        "userComment": "Terrible market. There is a guard inside watching you so you don't steal and the butchers ignore you and serve pretty girls in front of you.  But thank God other markets are arriving and the end of this nonsense will come"
    },
    
    // Optional. Defines how many attempts the model should try before the API returns an error. Must be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the timeout in seconds to obtain a valid JSON before the API returns an error. Must be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Defines the temperature for JSON generation. Higher values tend to be more creative, while lower values are more deterministic. Number from 0 to 2.
    "temperature": 0.4,
    
    // Optional. Provides additional context for generation via chat/completions‑style messages. You can also provide multimodal content for compatible models.
    "context": [
        {
            "role": "user",
            "content": "Additional context"
        }
    ],
    
    // Optional. Provides built‑in AIVAX tools for the generation.
    "tools": [
        "WebSearch",
        "Code",
        "OpenUrl",
        "ImageGeneration",
        "XPostsSearch"
    ],
    
    // Optional. Defines tool generation parameters.
    "toolsOptions": {
        "webSearchMode": "Full" | "Summarized",
        "webSearchMaxResults": 10,
        "imageGenerationMaxResults": 2,
        "imageGenerationQuality": "Low" | "Medium" | "High" | "Highest",
        "imageGenerationAllowMatureContent": false
    },
    
    // Optional. Additional function metadata. Not visible to the assistant.
    "metadata": {
        "foo": "bar"
    }
}
```

#### Response

```json
{
  "result": {
    "requiresAttention": true,
    "shortSummary": "Customer threatens cancellation and bad publicity if not contacted today."
  },
  "attempt": 0,
  "elapsedMilliseconds": 1235,
  "warnings": [],
  "context": {
    "generatedUsage": [
      {
        "sku": "inference.functions.json.in",
        "amount": 0.0000123,
        "unitPrice": 1e-7,
        "quantity": 123,
        "description": "JSON function rendering (@google/gemini-2.0-flash)"
      },
      {
        "sku": "inference.functions.json.out",
        "amount": 0.0000116,
        "unitPrice": 4e-7,
        "quantity": 29,
        "description": "JSON function rendering (@google/gemini-2.0-flash)"
      }
    ],
    "runnedFunctions": []
  }
}
```

## JSON Schema Guidelines

The response format must be provided by a JSON Schema.

Behind the scenes, AIVAX guides the model to generate a response with the provided JSON schema. When the model generates something invalid, we tell it to try again and correct the errors until the output conforms to the supplied specification.

The supported JSON Schema directives of AIVAX are:

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
- `array`
    - `items`
    - `uniqueItems`
    - `minItems`
    - `maxItems`
- `object`
    - `properties`
    - `required`
- `bool` and `boolean`
- `null`

Additionally, you can specify one or more values in the `type` of the object, for example:

```json
{
    "type": ["string", "number"]
}
```

> Note: `number` and `integer` are synonyms and `integer` does not guarantee that the number will be an integer.

## Functions in tools

It is possible to use [built‑in tools](/docs/en/builtin-tools) as JSON functions. This will allow the model to call functions to obtain the necessary context to generate the final JSON.

## Examples

Check out examples of AI functions for various everyday tasks:

#### Classify good or bad comments

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-2.0-flash",
    "instructions": "Classify the user's comment by providing a rating for the comment.",
    "inputData": {
        "inputText": "The food is good, but the environment is very noisy and a bit dirty as well."
    },
    "responseSchema": {
        "type": "object",
        "properties": {
            "commentSummary": {
                "type": "string",
                "description": "Summary of what the user meant."
            },
            "score": {
                "type": "integer",
                "min": 1,
                "max": 5,
                "description": "The rating extracted from the evaluation, where 1 is very bad and 5 is very good."
            }
        },
        "required": [
            "commentSummary",
            "score"
        ]
    }
}
```

```json
{
  "result": {
    "commentSummary": "The food is good, but the environment is noisy and a bit dirty.",
    "score": 3
  },
  "attempt": 0,
  "elapsedMilliseconds": 788,
  "warnings": [],
  "context": {
    "generatedUsage": [
      {
        "sku": "inference.functions.json.in",
        "amount": 0.0000083,
        "unitPrice": 1e-7,
        "quantity": 83,
        "description": "JSON function rendering (@google/gemini-2.0-flash)"
      },
      {
        "sku": "inference.functions.json.out",
        "amount": 0.0000128,
        "unitPrice": 4e-7,
        "quantity": 32,
        "description": "JSON function rendering (@google/gemini-2.0-flash)"
      }
    ],
    "runnedFunctions": []
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
    "modelName": "@qwen/qwen3-32b",
    "instructions": "Evaluate the given math problem and provide the result step-by-step.",
    "inputData": {
        "inputText": "what is two plus two minus pi ?"
    },
    "responseSchema": {
        "type": "object",
        "properties": {
            "steps": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "stepDescription": {
                            "type": "string",
                            "description": "Current math step description."
                        },
                        "carry": {
                            "type": "number",
                            "description": "The current result."
                        }
                    },
                    "required": [
                        "stepDescription",
                        "carry"
                    ]
                },
                "minItems": 1
            },
            "finalResult": {
                "type": "number",
                "description": "The math operation final result."
            }
        },
        "required": [
            "steps",
            "finalResult"
        ]
    },
    "tools": [
        "Code"
    ]
}
```

```json
{
  "result": {
    "steps": [
      {
        "stepDescription": "Add 2 and 2",
        "carry": 4
      },
      {
        "stepDescription": "Subtract pi (π) from the result",
        "carry": 0.858407346410207
      }
    ],
    "finalResult": 0.858407346410207
  },
  "attempt": 0,
  "elapsedMilliseconds": 5775,
  "warnings": [],
  "context": {
    "generatedUsage": [
      {
        "sku": "inference.functions.json.in",
        "amount": 0.00031001,
        "unitPrice": 2.9e-7,
        "quantity": 1069,
        "description": "JSON function rendering (@qwen/qwen3-32b)"
      },
      {
        "sku": "inference.functions.json.out",
        "amount": 0.00054162,
        "unitPrice": 5.9e-7,
        "quantity": 918,
        "description": "JSON function rendering (@qwen/qwen3-32b)"
      }
    ],
    "runnedFunctions": [
      {
        "functionName": "evaluate_code",
        "success": true,
        "context": {
          "arguments": "console.log(2 + 2 - Math.PI);",
          "result": {
            "evaluatedCode": "console.log(2 + 2 - Math.PI);",
            "result": "0.8584073464102069\nScript evaluation result: undefined\n"
          }
        }
      }
    ]
  }
}
```

#### Fetch latest news and weather for a given city

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@openai/gpt-4o-mini",
    "instructions": "Search for the 5 latest news and weather data for the given city.",
    "inputData": {
        "city": "Tokyo"
    },
    "responseSchema": {
        "type": "object",
        "properties": {
            "latestNews": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string"
                        },
                        "details": {
                            "type": "string"
                        },
                        "link": {
                            "type": "string",
                            "format": "uri"
                        }
                    },
                    "required": [
                        "title",
                        "details",
                        "link"
                    ],
                    "additionalProperties": false
                }
            },
            "weather": {
                "type": "object",
                "properties": {
                    "currentTemperature": {
                        "type": "number"
                    },
                    "currentWeather": {
                        "type": "string",
                        "enum": [
                            "sunny",
                            "cloudy",
                            "rain",
                            "thunderstorm"
                        ]
                    },
                    "forecast": {
                        "type": "string",
                        "enum": [
                            "sunny",
                            "cloudy",
                            "rain",
                            "thunderstorm"
                        ]
                    }
                },
                "required": [
                    "currentTemperature",
                    "currentWeather",
                    "forecast"
                ],
                "additionalProperties": false
            },
            "assistantSummary": {
                "type": "string"
            }
        },
        "required": [
            "latestNews",
            "weather",
            "assistantSummary"
        ],
        "additionalProperties": false
    },
    "tools": [
        "XPostsSearch",
        "WebSearch"
    ]
}
```

```json
{
  "result": {
    "latestNews": [
      {
        "title": "Indian Ambassador to Japan Expands Cooperation",
        "details": "Indian Ambassador to Japan Sibi George expressed eagerness to expand cooperation between India and Japan in business, technology, and security.",
        "link": "https://japannews.yomiuri.co.jp/"
      },
      {
        "title": "Emperor Emeritus Akihito Discharged from Hospital",
        "details": "Japan’s Emperor Emeritus Akihito was discharged from the University hospital.",
        "link": "https://www.japantimes.co.jp/"
      },
      {
        "title": "Tokyo Stocks Climb Following Wall Street Gains",
        "details": "Tokyo stocks climbed in the morning following Wall Street gains.",
        "link": "https://www.independent.co.uk/topic/tokyo"
      },
      {
        "title": "Tightening of Business Manager Visa Requirements",
        "details": "Tokyo is tightening requirements for popular business manager visas.",
        "link": "https://www.japantimes.co.jp/latest-news/"
      },
      {
        "title": "ANA Plans Affordable Flying Taxi Service",
        "details": "ANA plans to launch an affordable flying taxi service in Japan by 2027.",
        "link": "https://www.japantimes.co.jp/"
      }
    ],
    "weather": {
      "currentTemperature": 31,
      "currentWeather": "cloudy",
      "forecast": "rain"
    },
    "assistantSummary": "The latest news from Tokyo includes diplomatic and economic updates, while the current weather is partly cloudy with a temperature of 31°C."
  },
  "attempt": 0,
  "elapsedMilliseconds": 19772,
  "warnings": [],
  "context": {
    "generatedUsage": [
      {
        "sku": "serviceusage.web_search",
        "amount": 0.005,
        "unitPrice": 0.005,
        "quantity": 1,
        "description": "Web Search request"
      },
      {
        "sku": "serviceusage.web_search",
        "amount": 0.005,
        "unitPrice": 0.005,
        "quantity": 1,
        "description": "Web Search request"
      },
      {
        "sku": "inference.functions.json.in",
        "amount": 0.000453,
        "unitPrice": 1.5e-7,
        "quantity": 3020,
        "description": "JSON function rendering (@openai/gpt-4o-mini)"
      },
      {
        "sku": "inference.functions.json.out",
        "amount": 0.0002406,
        "unitPrice": 6e-7,
        "quantity": 401,
        "description": "JSON function rendering (@openai/gpt-4o-mini)"
      }
    ],
    "runnedFunctions": [
      {
        "functionName": "web_search",
        "success": true,
        "context": {
          "arguments": {
            "search_term": "Tokyo weather"
          },
          "result": {
            "results": [
              {
                "title": "Search results",
                "url": ""
              }
            ]
          }
        }
      },
      {
        "functionName": "web_search",
        "success": true,
        "context": {
          "arguments": {
            "search_term": "latest news in Tokyo"
          },
          "result": {
            "results": [
              {
                "title": "Search results",
                "url": ""
              }
            ]
          }
        }
      }
    ]
  }
}
```

#### Fetch trending artists by musical genre

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
            "modelName": "@openai/gpt-4.1-mini",
            "instructions": "The function should search, using the latest X posts, the music streaming platforms (like Spotify, Apple Music etc.) and identify the 10 most played artists in the genre provided by the user. Then, it should format an object containing an ordered list of 10 artists, including position (1–10), name and estimated number of streams.",
            "inputData": {
                "genre": "dubstep"
            },
            "responseSchema": {
                "type": "object",
                "properties": {
                    "artists": {
                        "type": "array",
                        "description": "List of the 10 most played artists in the specified genre",
                        "items": {
                            "type": "object",
                            "properties": {
                                "rank": {
                                    "type": "integer",
                                    "description": "Position in the Top 10",
                                    "minimum": 1,
                                    "maximum": 10
                                },
                                "name": {
                                    "type": "string",
                                    "description": "Artist name"
                                },
                                "monthlyStreams": {
                                    "type": "string",
                                    "description": "Approximate number of monthly streams, formatted, e.g., \"150M\""
                                },
                                "source": {
                                    "type": "string",
                                    "description": "Platform or data source"
                                }
                            },
                            "required": [
                                "rank",
                                "name",
                                "monthlyStreams",
                                "source"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "artists"
                ],
                "additionalProperties": false
            },
            "maxAttempts": 4,
            "temperature": 1,
            "tools": [
                "XPostsSearch",
                "WebSearch"
            ],
            "toolsOptions": {}
        }
```

```json
{
  "result": {
    "artists": [
      {
        "rank": 1,
        "name": "Skrillex",
        "monthlyStreams": "31M",
        "source": "Spotify"
      },
      {
        "rank": 2,
        "name": "Virtual Riot",
        "monthlyStreams": "12M",
        "source": "Spotify"
      },
      {
        "rank": 3,
        "name": "Excision",
        "monthlyStreams": "11M",
        "source": "Spotify"
      },
      {
        "rank": 4,
        "name": "Zeds Dead",
        "monthlyStreams": "10M",
        "source": "Spotify"
      },
      {
        "rank": 5,
        "name": "Flux Pavilion",
        "monthlyStreams": "9M",
        "source": "Spotify"
      },
      {
        "rank": 6,
        "name": "Illenium",
        "monthlyStreams": "8.5M",
        "source": "Spotify"
      },
      {
        "rank": 7,
        "name": "Rusko",
        "monthlyStreams": "7M",
        "source": "Spotify"
      },
      {
        "rank": 8,
        "name": "Bassnectar",
        "monthlyStreams": "6M",
        "source": "Spotify"
      },
      {
        "rank": 9,
        "name": "Seven Lions",
        "monthlyStreams": "5.5M",
        "source": "Spotify"
      },
      {
        "rank": 10,
        "name": "Getter",
        "monthlyStreams": "5M",
        "source": "Spotify"
      }
    ]
  },
  "attempt": 0,
  "elapsedMilliseconds": 11243,
  "warnings": [],
  "context": {
    "generatedUsage": [
      {
        "sku": "serviceusage.x_api.search",
        "amount": 0.005,
        "unitPrice": 0.005,
        "quantity": 1,
        "description": "X Posts search"
      },
      {
        "sku": "inference.functions.json.in",
        "amount": 0.0016448,
        "unitPrice": 4e-7,
        "quantity": 4112,
        "description": "JSON function rendering (@openai/gpt-4.1-mini)"
      },
      {
        "sku": "inference.functions.json.out",
        "amount": 0.0006272,
        "unitPrice": 0.0000016,
        "quantity": 392,
        "description": "JSON function rendering (@openai/gpt-4.1-mini)"
      }
    ],
    "runnedFunctions": [
      {
        "functionName": "x_posts_search",
        "success": true,
        "context": {
          "arguments": {
            "search_query": "dubstep artists Spotify OR Apple Music OR streaming"
          },
          "result": [
            {
              "url": "https://