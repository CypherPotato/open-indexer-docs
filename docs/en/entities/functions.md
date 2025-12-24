# Functions (structured responses)

Functions are an implementation of structured responses that works with **any LLM**, even those that do not natively support structured outputs. AIVAX analyzes the provided `responseSchema` and manually validates whether the model responded as expected. When the model fails, AIVAX automatically notifies the errors until it generates a valid JSON.

This process continues until the `maxAttempts` parameter is reached or a valid JSON is generated. AIVAX interprets JSONs in markdown blocks, preceded or followed by text, and automatically extracts the final response.

You can use JSON functions with models that have reasoning without breaking the reasoning phase to generate the JSON. Additionally, you can use [built‑in tools](/docs/en/builtin-tools) during generation, such as web search, document generation, and opening links.

> **Note:** Functions (JSON) are different from [Hosted Functions](/docs/en/serverless), which are serverless JavaScript code executed on AIVAX infrastructure for agentic tasks.

## How it works

When calling a function, you define **what the model should do** via instructions and **how it should respond** via a JSON Schema.

AIVAX validates the model's response in real time. If the generated JSON is invalid or does not follow the schema, the model receives automatic feedback about the errors and tries again. This cycle continues until:
- A valid JSON is generated (success on the first try or after corrections)
- The `maxAttempts` limit is reached

**Billing:** You are charged for each generation attempt. Smarter models usually get it right on the first try, while smaller models may need multiple attempts.

**Performance tip:** Use caching on your application side for data that does not change frequently (weather, daily statistics, etc). AIVAX does not perform automatic caching.

See the [API reference](https://inference.aivax.net/apidocs#ExecuteJSONFunction) to learn more about the functions/output schemas API.

## Supported JSON Schema

AIVAX guides the model to generate a response according to the provided JSON Schema. When the model generates something invalid, it receives feedback about the errors and tries again until the output conforms to the specification.

### Supported types and validations

- **string**:
    - `minLength`, `maxLength`
    - `pattern` (regex)
    - `format`: `date-time`, `email`, `time`, `duration`, `uri`, `url`, `ipv4`, `ipv6`, `uuid`, `guid`
    - `enum`
- **number** and **integer**:
    - `minimum`, `maximum`
    - `exclusiveMinimum`, `exclusiveMaximum`
    - `multipleOf`
- **array**:
    - `items`
    - `uniqueItems`
    - `minItems`, `maxItems`
- **object**:
    - `properties`
    - `required`
- **bool**, **boolean**
- **null**

**Multiple types:** You can specify multiple types in a field:

```json
{
    "type": ["string", "number"]
}
```

> **Note:** `number` and `integer` are synonyms. The `integer` type does not guarantee that the value will be an integer.

## Built‑in tools

You can use [built‑in tools](/docs/en/builtin-tools) during JSON generation, allowing the model to:
- Search the internet for up‑to‑date information
- Execute code for complex calculations
- Open and analyze URLs
- Generate images
- Fetch social media posts

These tools are especially useful for functions that need real‑time data or additional processing before generating the structured response.

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
    "instructions": "Classify the user's comment by providing a rating for their comment.",
    "inputData": {
        "inputText": "The food is good, but the environment is very noisy and also a bit dirty."
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

#### Fetch top artists by musical genre

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
            "modelName": "@openai/gpt-4.1-mini",
            "instructions": "The function should search, using the latest X posts, music streaming platforms (like Spotify, Apple Music etc.) and identify the 10 most played artists in the genre provided by the user. Then, it should format an object containing an ordered list of 10 artists, including position (1–10), name and estimated number of streams.",
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
              "text": "MOST STREAMED ARTISTS ON THESE STREAMING PLATFORMS 🇳🇬\n\nApple Music — WIZKID\nSpotify — WIZKID\nYouTube — BURNA BOY\nPandora — WIZKID\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nSoundCloud — BURNA BOY\nShazam — WIZKID https://t.co/Nm2jO5R5P6",
              "authorUserName": "yobrxxzy",
              "createdAt": "2024-02-06T09:35:10"
            },
            {
              "url": "https://x.com/yobrxxzy/status/1922763266549301642",
              "text": "MOST STREAMED ARTISTS ON THESE DSP:\n\nApple Music — WIZKID\nSpotify — WIZKID\nPandora — WIZKID\nYouTube — BURNA BOY\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nDeezer — WIZKID\nAnghami — REMA\nSoundCloud — BURNA BOY\nShazam — WIZKID\n\n🐐 https://t.co/3aUCGbYiEO",
              "authorUserName": "yobrxxzy",
              "createdAt": "2025-05-14T21:17:40"
            },
            {
              "url": "https://x.com/yobrxxzy/status/1856816512524587343",
              "text": "MOST STREAMED ARTISTS ON THESE DSP:\n\nApple Music — WIZKID\nSpotify — WIZKID\nYouTube — BURNA BOY\nPandora — WIZKID\nTidal  — WIZKID\nLine Music — WIZKID\nAudiomack — ASAKE\nDeezer — WIZKID\nBoomplay — BURNA BOY\nDeezer — WIZKID\nAnghami — REMA\nSoundCloud — BURNA BOY\nShazam — WIZKID\n\n🐐 https://t.co/yL2tmJJpHM",
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
              "url": "https://x.com/yobrxxzy/status/1653723618944090112",
              "text": "MOST STREAMED ARTISTS ON THESE STREAMING PLATFORMS:\n\nApple Music — WIZKID\nSpotify — WIZKID\nYouTube — BURNA BOY\nPandora — WIZKID\nTidal  — WIZKID\nAudiomack — BURNA BOY\nDeezer — WIZKID\nBoomplay — BURNA BOY\nSoundCloud — WIZKID\nShazam — WIZKID\n\nWhere is @davido ? https://t.co/JOcwJZ2HUU",
              "authorUserName": "yobrxxzy",
              "createdAt": "2023-05-03T11:30:10"
            },
            {
              "url": "https://x.com/EyelanderMusic/status/1882525103482872115",
              "text": "YO IF YOU THINK DUBSTEP IS GETTING “STALE” \n\nGET THE HELL OFF OF SPOTIFY AND ON TO SOUNDCLOUD \n\nTHERE IS SOOO MUCH INSANE UNDERGROUND TALENT THAT RELEASE MOSTLY JUST TO SOUNDCLOUD. \n\n(Plus that’s usually where all showcases, remixes and flips are for copyright purposes)",
              "authorUserName": "EyelanderMusic",
              "createdAt": "2025-01-23T20:25:34"
            },
            {
              "url": "https://x.com/thisiscyclops/status/1815084003050791422",
              "text": "i like that more dubstep artists are doing albums this year. like i know it’s not the best release move in 2024 but that kinda lets you know that they’re doing it out of love for the music rather than like the Best Spotify Strategy 👍",
              "authorUserName": "thisiscyclops",
              "createdAt": "2024-07-21T17:58:43"
            },
            {
              "url": "https://x.com/mewaolix/status/1886435921895235989",
              "text": "Stays, we can easily reach #3 if we push a little 🥹\n\n(DSP counts Spotify, Apple Music, Amazon Music, Deezer, YT Music, Anghami, Gaana, Joox, Melon, JioSaavn, Boomplay, etc) https://t.co/P2hFoSmbtT",
              "authorUserName": "mewaolix",
              "createdAt": "2025-02-03T15:25:46"
            },
            {
              "url": "https://x.com/bhadext/status/1951588819561546145",
              "text": "Listen to my songs on Apple music, 🙏\nBhadext \n\nHere: https://t.co/3u79BQvHAZ https://t.co/lmMjN7m2oR",
              "authorUserName": "bhadext",
              "createdAt": "2025-08-02T10:20:08"
            },
            {
