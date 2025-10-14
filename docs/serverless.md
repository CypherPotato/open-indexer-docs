# Funções serverless

AIVAX fornece funções serverless em JavaScript para executarem operações agênticas usando o servidor da AIVAX, sem a necessidade de hospedagem de servidor ou código.

Com essa ferramenta, você pode hospedar códigos JavaScript que recebem uma requisição e respondem de acordo com seu código fonte.

## API

A API disponível do serverless da AIVAX fornece algumas ferramentas e classes customizadas:

- `console`
    - `log(...args)` para escrever no console de depuração.
    - `error(...args)` para escrever um erro no console de depuração.
    - `warn(...args)` para escrever um aviso no console de depuração.
    - `info(...args)` para escrever uma informação no console de depuração.
    - `table(data, columns)` para escrever uma tabela no console de depuração.
- `fetch(url, options) -> Promise<Response>`
    - `options.body` pode ser uma `string`, um `FormData` ou nulo.
    - `options.method` uma string que representa o método HTTP.
    - `options.headers` um objeto contendo os cabeçalhos HTTP da requisição.
    - `options.timeout` um inteiro representando o timeout da requisição.
    - `options.redirect` uma string que pode ser `follow` ou `manual`.
    Sendo que a resposta é um objeto:
    - `async Response.text()` traz uma `Promise<string>` com o conteúdo.
    - `async Response.json()` traz uma `Promise<object>` com o conteúdo JSON.
    - `Response.ok` um booleano contendo se a resposta é da classe de sucesso.
    - `Response.status` um inteiro contendo o status code da resposta.
    - `Response.statusText` uma string contendo o status reason da resposta. Pode ser nulo.
    - `Response.headers` um objeto contendo os cabeçalhos da resposta.
    - `Response.url` a URL da requisição que produziu essa resposta.

Métodos de leitura de requisição do serverless:

- `req.headers` traz um objeto contendo os cabeçalhos da requisição atual.
- `req.query` traz um objeto contendo os parâmetros da query da requisição.
- `req.cookies` traz um objeto contendo os cookies definidos na requisição.
- `req.path` lê o caminho (sem a query string) da requisição.
- `req.fullPath` lê o caminho (com a query string) da requisição.
- `req.url` lê a URL completa da requisição, contendo o caminho completo da requisição (autoridade, caminho e query).
- `req.method` lê o método da requisição.
- `req.json()` lê o corpo da requisição para um valor JSON.
- `req.text()` lê o corpo da requisição em texto.
- `req.blob()` lê o corpo da requisição em um ArrayBuffer.
- `req.form()` lê o corpo da requisição em um form-data.
- `req.multipartForm()` lê o corpo da requisição em um multipart form-data.

E métodos de escrita para resposta do serverless:

- `res.status(status)` define o status numérico da resposta.
- `res.header(name, value)` adiciona um cabeçalho na resposta.
- `res.text(t)` define o corpo da resposta como um texto.
- `res.json(t)` define o corpo da resposta como um JSON.
- `res.error(message, status)` retorna um erro JSON na resposta com o status informado e encerra imediatamente a execução do script.

E métodos especiais agênticos:

- `async ai.complete(model, prompt, options)` completa o texto informado em prompt. Prompt pode ser uma string ou um array de mensagens. O modelo pode ser um modelo fornecido pela AIVAX ou um Slug ou ID de um AI gateway da sua conta. Opções incluem propriedades que são passadas para a rota de chat/completions, exemplo: `temperature` ou `tools`. A resposta é o JSON da resposta da AIVAX de inferência.
- `async ai.completeText(model, prompt, options)` funciona da mesma forma do método acima, mas ao invés de retornar um JSON com os objetos de resposta da inferência, retorna apenas o texto gerado pela assistente.
- `async api.get(path)` faz uma requisição GET autenticada para algum endpoint da AIVAX.
- `async api.post(path, body)` faz uma requisição POST autenticada com um corpo JSON para algum endpoint da AIVAX.
- `async api.put(path, body)` faz uma requisição PUT autenticada com um corpo JSON para algum endpoint da AIVAX.
- `async api.patch(path, body)` faz uma requisição PATCH autenticada com um corpo JSON para algum endpoint da AIVAX.
- `async api.delete(path)` faz uma requisição DELETE autenticada para algum endpoint da AIVAX.

E algumas funções especiais de middleware:

- `async authenticate()` autentica a requisição com uma API key da sua conta.
- `sleep(ms)` aguarda o tempo especificado em milissegundos antes de continuar, limitado à 3 minutos.
- `rate_limit(threshold, seconds)` aplica um rate-limiter à nível da função e do IP de requisição sobre o threshold e duração em segundos especificada.

## Exemplo

O exemplo abaixo ilustra um código quase completo, que recebe uma requisição, autentica-a, executa uma função para ela e retorna o resultado.

> [!IMPORTANT]
> Atenção: nenhuma função serverless possui autenticação por padrão. Autentique suas funções criando uma lógica especialmente para isso ou usando o método assíncrono `authenticate()`.

```js
async function main() {

    // se não estiver autenticado por uma chave de API válida,
    // sai da função
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    // aplica rate limiter na requisição para evitar sobrecarga
    const RATE_LIMIT_THRESHOLD = 10;
    const RATE_LIMIT_SECONDS = 60;
    rate_limit(RATE_LIMIT_THRESHOLD, RATE_LIMIT_SECONDS);

    // valida se a requisição é GET
    if (req.method != 'GET') {
        res.status(405);
        return;
    }
    
    // obtém o parâmetro da query 'q'
    var cityName = req.query["q"] || res.error("'q' is required");

    // realiza inferência para obter dados de clima para cidade informada
    const weather = await api.post("/api/v1/functions/json", {
        modelName: "@x-ai/grok-4-fast",
        prompt: "Pesquise dados de clima para a cidade informada.",
        responseSchema: {
            type: "object",
            properties: {
                temperature: {
                    type: "number",
                    description: "A temperatura em Celsius do local informado"
                },
                forecast: {
                    type: "string",
                    enum: ["rainy", "thunder", "clear"],
                    description: "A previsão do tempo para o local informado"
                }
            },
            required: ["temperature", "forecast"]
        },
        inputData: {
            cityName
        }
    });

    // retorna o JSON na resposta
    const {
        result
    } = weather.json.data;
    res.json(result);
}
```

O código abaixo é mais simples: ele autentica a requisição com uma API-key sua, recebe o corpo JSON da requisição e retorna a resposta da função:

```js
async function main() {

    if (!await authenticate()) {
        res.status(403);
        return;
    }

    const functionResult = await api.post('/api/v1/functions/json', {
        modelName: "@metaai/llama-4-scout-17b-16e",
        instructions: "Encurte o texto informado pelo usuário.",
        inputData: req.json(),
        responseSchema: {
            type: "object",
            properties: {
                summarizedText: {
                    type: "string"
                }
            }
        }
    });

    res.json(functionResult.json.data.result);
}
```

## Limitações

Essas funções executam em um contâiner JavaScript isolado com certas limitações. Essas limitações são:

- O uso máximo de memória é limitado para 32 MB.
- O tempo de execução de cada script é limitado à 5 minutos.
- O tempo máximo de avaliação de Regex é de 10 segundos.
- O tamanho máximo de resposta lido por chamadas Fetch é de 10 MB (exceto para chamadas pela AIVAX).

## Precificação

O preço do serverless é cobrado por hora de execução. Cada execução acumula uma quantia de milisegundos. Essa temporização contabiliza somente o tempo de execução do script e não sua compilação, portanto, se o seu script demorar 20 segundos para ser executado, 20.000 milissegundos serão contabilizados. O tempo mínimo de execução debitado é de 20 milissegundos.

O custo de processamento serverless é de **$1/hora**.

> [!NOTE]
> Todas as contas possuem **10 minutos** grátis todos os dias. Se você ultrapassar esse limite, você começará a ser debitado pelo valor de processamento. Se sua conta tiver saldo negativo, o processamento da função será cancelado.

## Limites de taxa

Os limites de taxa para funções serverless são descritas nos [limites de taxa](/docs/limits).