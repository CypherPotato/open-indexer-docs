# Funções

Funções é uma forma de forçar seu modelo ao processamento de informações usando JSON como intermédio de comunicação. Com as funções, você consegue fazer qualquer modelo responder no formato JSON que você quiser.

Pode ser útil para categorizar comentários, aplicar moderação em avaliações ou processar informações com auxílio da IA.

No momento, só é possível usar funções com [modelos providos pela AIVAX](/docs/models).

## Chamar uma função

Para chamar uma função de IA, você precisará informar o que a IA deverá responder e fornecer um JSON Schema que ela deverá seguir.

Modelos menos inteligentes tendem a falhar a geração de JSON, gerando um documento inválido ou problemático. Para isso, ajuste seu modelo, a instrução e o parâmetro de tentativas se for necessário.

Você é cobrado por cada tentativa que a IA tentar gerar. Modelos um pouco mais inteligentes tendem a gerar resultados corretos na primeira tentativa. É garantido que um JSON válido será gerado e que esse JSON seguirá o mesmo esquema fornecido na requisição.

Considere usar um cache do lado da sua aplicação para dados que não precisam ser constantementes atualizados, como dados meteorológicos, estatísticas diárias, etc. A AIVAX não realiza nenhum cache pelo nosso lado.

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
    
    // Obrigatório. O JSON Schema que o modelo deverá seguir para gerar a resposta. Você pode fornecer exemplos de geração no campo de instruções.
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
    
    // Opcional. Define uma entrada JSON para o modelo. Pode ser qualquer tipo de valor JSON.
    "inputData": {
        "userComment": "Pessimo mercado. Tem guarda dentro te vigiando pra vc nao roubar e os acougueiros te ignoram e atendem mocinhas bonitinhas na tua frente.  Mas graças a Deus tem outros mercados chegando e o fim dessa palhaçada vai chegar"
    },
    
    // Opcional. Define quantas tentativas o modelo deve tentar antes da API retornar um erro. Deve ser um número entre 1 e 30.
    "maxAttempts": 10,
    
    // Opcional. Define o tempo limite em segundos para obter um JSON válido antes da API retornar um erro. Deve ser um número entre 1 e 3600 (uma hora).
    "timeout": 300,
    
    // Opcional. Define a temperatura de geração do JSON. Valores maiores tendem a serem mais criativos, enquanto menores mais determinísticos. Número de 0 à 2.
    "temperature": 0.4,
    
    // Opcional. Fornece contexto adicional para a geração através de mensagens no formato chat/completions. Você pode fornecer conteúdo multi-modalidades também para modelos compatíveis.
    "context": [
        {
            "role": "user",
            "content": "Additional context"
        }
    ],
    
    // Opcional. Fornece funções embutidas da AIVAX para a geração da ferramenta.
    "tools": [
        "WebSearch",
        "Code",
        "OpenUrl",
        "ImageGeneration",
        "XPostsSearch"
    ],
    
    // Opcional. Define parâmetros de geração de ferramentas.
    "toolsOptions": {
        "webSearchMode": "Full" | "Summarized",
        "webSearchMaxResults": 10,
        "imageGenerationMaxResults": 2,
        "imageGenerationQuality": "Low" | "Medium" | "High" | "Highest",
        "imageGenerationAllowMatureContent": false
    }
}
```

#### Resposta

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

## Diretrizes do JSON Schema

O formato de resposta deve ser fornecido por um JSON Schema.

Por trás dos panos, a AIVAX guia o modelo para gerar uma resposta com o esquema JSON fornecido. Quando o modelo gera algo inválido, indicamos à ele tentar novamente e corrigir os erros até que a saída esteja conforme a especificação fornecida.

As diretrizes suportadas do JSON Schema da AIVAX são:

- `string`:
    - `minLength`
    - `maxLength`
    - `pattern`
    - `format`
        - Pode ser `date-time`, `email`, `time`, `duration`, `uri`, `url`, `ipv4`, `ipv6`, `uuid` ou `guid`.
    - `enum`
- `number` e `integer`:
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
- `bool` e `boolean`
- `null`

Além disso, é possível informar um ou mais valores no `type` do objeto, exemplo:

```json
{
    "type": ["string", "number"]
}
```

> Nota: `number` e `integer` são sinônimos e `integer` não garante que o número será um inteiro.

## Funções em ferramentas

É possível usar [ferramentas embutidas](/docs/builtin-tools) as funções JSON. Isso irá permitir que o modelo chame funções para obter contexto necessário para gerar o JSON final.

## Exemplos

Confira exemplos de funções de IA para várias tarefas cotidianas:

#### Classificar comentários bons ou ruins

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
    "modelName": "@google/gemini-2.0-flash",
    "instructions": "Classifique o comentário do usuário fornecendo uma nota para seu comentário.",
    "inputData": {
        "inputText": "A comida é boa, mas o ambiente é muito barulhento e um pouco sujo também."
    },
    "responseSchema": {
        "type": "object",
        "properties": {
            "commentSummary": {
                "type": "string",
                "description": "Resumo do que o usuário quis dizer."
            },
            "score": {
                "type": "integer",
                "min": 1,
                "max": 5,
                "description": "A nota extraída da avaliação, sendo 1 muito ruim e 5 muito bom."
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

#### Avaliar uma expressão matemática

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

#### Trazer últimas notícias e clima de uma determinada cidade

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

#### Trazer artistas em alta por gênero musical

<div class="request-item post">
    <span>POST</span>
    <span>
        /api/v1/functions/json
    </span>
</div>

```json
{
            "modelName": "@openai/gpt-4.1-mini",
            "instructions": "A função deve pesquisar, usando os últimos posts do X, as plataformas de streaming musical (como Spotify, Apple Music etc.) e identificar os 10 artistas mais tocados no gênero informado pelo usuário. Em seguida, deve formatar um objeto contendo uma lista ordenada de 10 artistas, incluindo posição (1–10), nome e número estimado de streams.",
            "inputData": {
                "genre": "dubstep"
            },
            "responseSchema": {
                "type": "object",
                "properties": {
                    "artists": {
                        "type": "array",
                        "description": "Lista dos 10 artistas mais tocados no gênero especificado",
                        "items": {
                            "type": "object",
                            "properties": {
                                "rank": {
                                    "type": "integer",
                                    "description": "Posição no Top 10",
                                    "minimum": 1,
                                    "maximum": 10
                                },
                                "name": {
                                    "type": "string",
                                    "description": "Nome do artista"
                                },
                                "monthlyStreams": {
                                    "type": "string",
                                    "description": "Número aproximado de streams mensais, formatado, ex: \"150M\""
                                },
                                "source": {
                                    "type": "string",
                                    "description": "Plataforma ou fonte de dados"
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
              "url": "https://x.com/runthismusic/status/1853150149788209234",
              "text": "What if 'Sticky' by @tylerthecreator was Dubstep? \nOUT NOW ON SC + FREE DL 💚💿\n@skybreakedm https://t.co/OjaU8um8GC",
              "authorUserName": "runthismusic",
              "createdAt": "2024-11-03T19:00:00"
            },
            {
              "url": "https://x.com/BTStreamingID/status/1953425910612320348",
              "text": "Party start 🎉\n\nPlaylist 🎶\n\nSpotify : \n1.Premium: https://t.co/qJwpckiSlS\n2. Free: https://t.co/NqIV40psvp\nApple music: https://t.co/dblVEdcd1q\nYouTube: https://t.co/gmCR3oyfze  \nYouTube Music: https://t.co/xhxF2rt90o\n\n#BTS #방탄소년단 #PTD_ON_STAGE_LIVE\n#BangtanPlaylistID",
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
              "text": "Good Morning 🌞 \n\nEspecially, Electronic Music Artists\n\nUse any of these?\n—Laptop \n——MIDI Keyboard\n———Software\n\nHow about these?\n—Spotify\n——Soundcloud\n———Apple Music\n\nMaking sounds like these?\n—House\n——Techno\n———Trance\n————DnB? ...Dubstep??\n\nIf you answered yes to anything above and you are staying consistent\n\nIf you are incessantly networking and improving your use of the above, particularly for live\n\nThen you may well be taking home your slice of a $25 Bn dollar industry\n\nExcited? Well are you? Keep making sounds on your computer 🤝\n\nCan't wait to hear your next track!\n\nP.",
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
              "text": "This new dirt monkey album is another\nbeautiful example of dubstep artists \nbranching out to other genres and sounds and creating something gorgeous and unique\n\nIt's so common now. So much good music is coming out I'm so pleased \n\nhttps://t.co/BJBXGa1Llz",
              "authorUserName": "ballsackious",
              "createdAt": "2023-10-19T04:03:55"
            },
            {
              "url": "https://x.com/karmiclink/status/1951358837828509849",
              "text": "Our full karmic discography is LIVE in all major digital streaming platforms (Deezer, Spotify, Youtube, Apple Music, Amazon Music, TikTok, Tidal, Facebook &amp; Instagram for your stories &amp; reels)! ☯ #karmiclink #cult #dark #metal #project #rock #athens ☯ @TuneCore https://t.co/WWlVrUTVOc",
              "authorUserName": "karmiclink",
              "createdAt": "2025-08-01T19:06:16"
            },
            {
              "url": "https://x.com/OneRougeWave/status/1953444705204588608",
              "text": "Oh yeah.. almost forgot😅.. \nStream my music 🎶…\n\nhttps://t.co/mUNJL5AAGf\n\nhttps://t.co/aFqbVnuzZV\n\n#wavyboss https://t.co/c8mnh9mw3d",
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