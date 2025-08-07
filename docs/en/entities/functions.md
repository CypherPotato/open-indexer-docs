# Functions

Functions are a way to force your model to process information using JSON as an intermediate communication medium. With functions, you can make any model respond in the JSON format you want.

It can be useful for categorizing comments, applying moderation to reviews, or processing information with the help of AI.

Currently, it is only possible to use functions with [models provided by AIVAX](/docs/en/models).

## Calling a Function

To call an AI function, you will need to inform what the AI should respond to and provide a JSON Schema that it should follow.

Less intelligent models tend to fail to generate JSON, generating an invalid or problematic document. To fix this, adjust your model, the instruction, and the attempt parameter if necessary.

You are charged for each attempt the AI tries to generate. Slightly more intelligent models tend to generate correct results on the first attempt. It is guaranteed that a valid JSON will be generated and that this JSON will follow the same schema provided in the request.

Consider using a cache on the side of your application for data that does not need to be constantly updated, such as weather data, daily statistics, etc. AIVAX does not perform any caching on our side.

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
    
    // Required. The JSON Schema that the model should follow to generate the response. You can provide examples of generation in the instructions field.
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
        "userComment": "Terrible market. There's a guard inside watching you so you don't steal and the butchers ignore you and serve pretty girls in front of you. But thank God there are other markets coming and the end of this nonsense will come"
    },
    
    // Optional. Defines how many attempts the model should try before the API returns an error. Should be a number between 1 and 30.
    "maxAttempts": 10,
    
    // Optional. Defines the time limit in seconds to obtain a valid JSON before the API returns an error. Should be a number between 1 and 3600 (one hour).
    "timeout": 300,
    
    // Optional. Defines the temperature of JSON generation. Higher values tend to be more creative, while lower values are more deterministic. Number from 0 to 2.
    "temperature": 0.4,
    
    // Optional. Provides additional context for generation through chat/completions messages. You can also provide multi-modal content for compatible models.
    "context": [
        {
            "role": "user",
            "content": "Additional context"
        }
    ],
    
    // Optional. Provides built-in AIVAX tools for JSON generation.
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

Behind the scenes, AIVAX guides the model to generate a response with the provided JSON schema. When the model generates something invalid, we indicate to it to try again and correct the errors until the output conforms to the provided specification.

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

Additionally, it is possible to inform one or more values in the `type` of the object, example:

```json
{
    "type": ["string", "number"]
}
```

> Note: `number` and `integer` are synonyms and `integer` does not guarantee that the number will be an integer.

## Functions in Tools

It is possible to use [built-in tools](/docs/en/builtin-tools) with JSON functions. This will allow the model to call functions to obtain the necessary context to generate the final JSON.

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
    "instructions": "Classify the user's comment, providing a note for their comment.",
    "inputData": {
        "inputText": "The food is good, but the environment is very noisy and a bit dirty too."
    },
    "responseSchema": {
        "type": "object",
        "properties": {
            "commentSummary": {
                "type": "string",
                "description": "Summary of what the user meant to say."
            },
            "score": {
                "type": "integer",
                "min": 1,
                "max": 5,
                "description": "The note extracted from the evaluation, being 1 very bad and 5 very good."
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

#### Evaluate a math expression

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

#### Bring the latest news and weather from a specific city

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

#### Bring top artists by music genre

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
            "modelName": "@openai/gpt-4.1-mini",
            "instructions": "The function should search, using the latest posts from X, the music streaming platforms (such as Spotify, Apple Music, etc.) and identify the 10 most played artists in the genre informed by the user. Then, it should format an object containing a list of 10 artists, including position (1-10), name, and estimated number of streams.",
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
              "url": "https://x.com/nathanielblow/status/1867148757466304607",
              "text": "NOW LIVE ON APPLE MUSIC. SPOTIFY. YOUTUBE MUSIC.\n\nEnjoy. https://t.co/apUxnXc7IE",
              "authorUserName": "nathanielblow",
              "createdAt": "2024-12-12T10:05:28"
            },
            {
              "url": "https://x.com/yobrxxzy/status/1754800896041505222",
              "text": "MOST STREAMED ARTISTS ON THESE STREAMING PLATFORMS \n\nApple Music — WIZKID\nSpotify — WIZKID\nYouTube — BURNA BOY\nPandora — WIZKID\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nSoundCloud — BURNA BOY\nShazam — WIZKID https://t.co/Nm2jO5R5P6",
              "authorUserName": "yobrxxzy",
              "createdAt": "2024-02-06T09:35:10"
            },
            {
              "url": "https://x.com/yobrxxzy/status/1922763266549301642",
              "text": "MOST STREAMED ARTISTS ON THESE DSP:\n\nApple Music — WIZKID\nSpotify — WIZKID\nPandora — WIZKID\nYouTube — BURNA BOY\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nDeezer — WIZKID\nAnghami — REMA\nSoundCloud — BURNA BOY\nShazam — WIZKID\n\n https://t.co/3aUCGbYiEO",
              "authorUserName": "yobrxxzy",
              "createdAt": "2025-05-14T21:17:40"
            },
            {
              "url": "https://x.com/yobrxxzy/status/1856816512524587343",
              "text": "MOST STREAMED ARTISTS ON THESE DSP:\n\nApple Music — WIZKID\nSpotify — WIZKID\nYouTube — BURNA BOY\nPandora — WIZKID\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nDeezer — WIZKID\nAnghami — REMA\nSoundCloud — BURNA BOY\nShazam — WIZKID\n\n https://t.co/yL2tmJJpHM",
              "authorUserName": "yobrxxzy",
              "createdAt": "2024-11-13T21:48:49"
            },
            {
              "url": "https://x.com/hourjinnie/status/1858756269902881208",
              "text": "PLAYLISTS! Let’s get to streaming and utilize all our tools! More pl coming tomorrow!!!\n\nSPOTIFY\n\nhttps://t.co/L0HRMpYEQG\n\nhttps://t.co/HmhdB859e5\n\nhttps://t.co/FA4eDmvvkS\n\nhttps://t.co/ZOedbxiKmO\n\nhttps://t.co/DyPs0qpOMQ\n\nDeezer\n\nhttps://t.co/36PY8aXkV7\n\nApple Music \n\nhttps://t.co/wk5MXtzDYC\n\nhttps://t.co/OgovuVtoDq\n\nPandora \n\nhttps://t.co/idkimHTTjp\n\nhttps://t.co/WQ83YKeUOK",
              "authorUserName": "hourjinnie",
              "createdAt": "2024-11-19T06:16:43"
            },
            {
              "url": "https://x.com/runthismusic/status/1853150149788209234",
              "text": "What if 'Sticky' by @tylerthecreator was Dubstep? \nOUT NOW ON SC + FREE DL \n@skybreakedm https://t.co/OjaU8um8GC",
              "authorUserName": "runthismusic",
              "createdAt": "2024-11-03T19:00:00"
            },
            {
              "url": "https://x.com/BTStreamingID/status/1953425910612320348",
              "text": "Party start \n\nPlaylist \n\nSpotify : \n1.Premium: https://t.co/qJwpckiSlS\n2. Free: https://t.co/NqIV40psvp\nApple music: https://t.co/dblVEdcd1q\nYouTube: https://t.co/gmCR3oyfze  \nYouTube Music: https://t.co/xhxF2rt90o\n\n#BTS #방탄소년단 #PTD_ON_STAGE_LIVE\n#BangtanPlaylistID",
              "authorUserName": "BTStreamingID",
              "createdAt": "2025-08-07T12:00:04"
            },
            {
              "url": "https://x.com/NewEDMToday/status/1728069779066392828",
              "text": "@FlatlandFunk_ @FrankieSinn2k @gabybaumusic @Gladez @grislymusik @HELOSPHEREmusic @HUMANSION_music @kausedubs @Kuhlosul_ @LazrusOfficial @SHEISLUTHIEN @LVCiDdubz @MagMag_dubstep @MVSLOTUNES @raddixofficial @RazrDub @ScarexxDub @SmilesOnlyMusic @soulvalient @SpeedShift6 @stvnkfvcemusic @itstoxicmusic @TremorrOfficial @TyphonOfficial @Verosdubz @voyagerdubz @wilco_beats @zovahofficial all been released on: @Emengy \n\ngenre of music: #edm #dubstep\n\nwith 30 tracks\n\n54 artists\n\nhttps://t.co/H9KmeiXJB4",
              "authorUserName": "NewEDMToday",
              "createdAt": "2023-11-24T15:15:15"
            },
            {
              "url": "https://x.com/offsetemusic/status/1729861632308744501",
              "text": "i mostly use my local files to listen to music, but i'll share my spotify wrapped anyway\n\ni'm happy to see @canotodubz here as no. 1, he's one of the most unique dubstep artists i've discovered this year https://t.co/OUBhgtikn9",
              "authorUserName": "offsetemusic",
              "createdAt": "2023-11-29T13:55:27"
            },
            {
              "url": "https://x.com/paulpoint_/status/1882728999962468414",
              "text": "Good Morning \n\nEspecially, Electronic Music Artists\n\nUse any of these?\n—Laptop \n——MIDI Keyboard\n———Software\n\nHow about these?\n—Spotify\n——Soundcloud\n———Apple Music\n\nMaking sounds like these?\n—House\n——Techno\n———Trance\n————DnB? ...Dubstep??\n\nIf you answered yes to anything above and you are staying consistent\n\nIf you are incessantly networking and improving your use of the above, particularly for live\n\nThen you may well be taking home your slice of a $25 Bn dollar industry\n\nExcited? Well are you? Keep making sounds on your computer \n\nCan't wait to hear your next track!\n\nP.",
              "authorUserName": "paulpoint_",
              "createdAt": "2025-01-24T09:55:47"
            },
            {
              "url": "https://x.com/Gunfingers_eu/status/1701277617280663828",
              "text": "Join Kaps on his bass music journey! From listener to passionate player, he's mastered the dubstep genre, sharing stages with many confirmed artists.\nExpect a wealth of experience and skills for your enjoyment!\n\nSC : https://t.co/s5sqmIzrK6\n\nSpotify : https://t.co/o8bmaRXTNU https://t.co/6DVahvcr5D",
              "authorUserName": "Gunfingers_eu",
              "createdAt": "2023-09-11T16:52:46"
            },
            {
              "url": "https://x.com/ballsackious/status/1714854867645149399",
              "text": "i like that more dubstep artists are doing albums this year. like i know it’s not the best release move in 2024 but that kinda lets you know that they’re doing it out of love for the music rather than like the Best Spotify Strategy ",
              "authorUserName": "ballsackious",
              "createdAt": "2023-10-19T04:03:55"
            },
            {
              "url": "https://x.com/mewaolix/status/1886435921895235989",
              "text": "Stays, we can easily reach #3 if we push a little \n\n(DSP counts Spotify, Apple Music, Amazon Music, Deezer, YT Music, Anghami, Gaana, Joox, Melon, JioSaavn, Boomplay, etc) https://t.co/P2hFoSmbtT",
              "authorUserName": "mewaolix",
              "createdAt": "2025-02-03T15:25:46"
            },
            {
              "url": "https://x.com/bhadext/status/1951588819561546145",
              "text": "Listen to my songs on Apple music, \nBhadext \n\nHere: https://t.co/3u79BQvHAZ https://t.co/lmMjN7m2oR",
              "authorUserName": "bhadext",
              "createdAt": "2025-08-02T10:20:08"
            },
            {
              "url": "https://x.com/runthismusic/status/1853150149788209234",
              "text": "What if 'Sticky' by @tylerthecreator was Dubstep? \nOUT NOW ON SC + FREE DL \n@skybreakedm https://t.co/OjaU8um8GC",
              "authorUserName": "runthismusic",
              "createdAt": "2024-11-03T19:00:00"
            },
            {
              "url": "https://x.com/OneRougeWave/status/1953444705204588608",
              "text": "Oh yeah.. almost forgot.. \nStream my music …\n\nhttps://t.co/mUNJL5AAGf\n\nhttps://t.co/aFqbVnuzZV\n\n#wavyboss https://t.co/c8mnh9mw3d",
              "authorUserName": "OneRougeWave",
              "createdAt": "2025-08-07T13:14:45"
            }
          ]
        }
      }
    ]
  }
}
```