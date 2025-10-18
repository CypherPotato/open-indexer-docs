# Serverless Functions

AIVAX's serverless functions allow you to run JavaScript on demand, in a managed environment, to create agentic endpoints without having to maintain servers.

Each request triggers the execution of your script, which reads data from the `req` object and writes the response to the `res` object.

## Execution flow in 30 seconds

- Write an `async function main()`; it is called on each request.
- Use `req` to read method, headers, query, and body.
- Build the response with `res.status()`, `res.header()`, `res.text()` or `res.json()`.
- Optionally, authenticate with `await authenticate()` and apply rate limiting with `rate_limit()`.
- You can call models with `ai.complete(...)` or access internal APIs with `api.get/post/...`.

> [!IMPORTANT]
> No function is authenticated by default. Protect your endpoints by implementing your own logic or using `await authenticate()`.

## Supported global objects

Below is the reference of objects and methods available in the environment, as implemented by the engine.

### console

- `log(...args)`/ `error(...args)` / `warn(...args)` / `info(...args)`
    - Writes to the debug console.
    - Strings/objects are serialized (objects via `JSON.stringify`).
- `table(data, columns?)`
    - Arrays: prints a header row with `(index)` + columns. If `columns` is not provided, columns are inferred from the union of object keys in the array. Empty arrays print `(empty array)`.
    - Objects: lists `key: value` per line.
    - Other types: prints directly with `log`.

Notes

- For multiple arguments, `log` concatenates with a space. Objects are serialized with `JSON.stringify`.

### fetch(url, options?) -> Promise<Response>

- `options.body`: `string`, `FormData` or `null`.
- `options.method`: HTTP method.
- `options.headers`: object with headers.
- `options.timeout`: integer (ms) request timeout.
- `options.redirect`: `follow` | `manual`.

Response object:

- `async text(): Promise<string>`
- `async json(): Promise<object>`
- `ok: boolean`
- `status: number`
- `statusText: string | null`
- `headers: object`
- `url: string`

Errors and notes

- `Response.json()` throws if the body is not valid JSON.
- The body is not a stream; read it with `text()` or `json()`.

### req (request reading)

- `headers: object` - request headers.
- `query: object` - query string parameters.
- `cookies: object` - present cookies.
- `method: string` - HTTP method.
- `path: string` - path without query.
- `fullPath: string` - path with query.
- `url: string` - full URL.
- `json(): any` - body as JSON.
- `text(): string` - body as text.
- `blob(): ArrayBuffer` - binary body.
- `form(): object` - simple form-data.
- `multipartForm(): object` - multipart form-data.

Errors and notes

- `req.json()` throws if the body is not valid JSON.

### res (response writing)

- `status(code: number): void` - sets HTTP status.
- `header(name: string, value: string): void` - adds a header.
- `text(body: string): void` - sets the response body as text.
- `json(data: any): void` - sets the response body as JSON.
- `error(message: string, status = 400): never` - sets status and body `{ error: message }` and immediately terminates script execution.

Notes

- Only `res.error(...)` interrupts execution. After `res.text(...)` or `res.json(...)`, return from the function (`return`) if you want to avoid further processing.

### ai (inference)

- `async complete(model, prompt, options?)`
    - Input
        - `model: string` - name/slug/ID of the model or account gateway.
        - `prompt: string | any[]` - text or array of messages (forwarded as `prompt`).
        - `options?: object` - additional properties forwarded to the endpoint, merged into the body with `stream: false`.
    - Return: JSON object of the response from the chat/completions endpoint.
- `async completeText(model, prompt, options?)`
    - Return: `string` with the content of `choices[0].message.content` from the result of `complete`.

### api (authenticated internal HTTP)

- `async get(path)`
    - Return: response object with `text` (string) and `.json` property (getter) that parses `text` via `JSON.parse`.
- `async post(path, body)`
    - Body is serialized with `JSON.stringify(body)`.
    - Return: same as `get`, with `.text` and getter `.json`.
- `put(path, body)` / `patch(path, body)` / `delete(path)`
    - Return: promise for the raw internal result (without the `.json` getter).

Notes

- `path` is relative to AIVAX's internal API.
- The `.json` getter throws if `text` does not contain valid JSON.

### Helpers

- `async authenticate(): Promise<boolean>` - validates the request with your account's API key.
- `sleep(ms: number): void` - waits the specified time in milliseconds (limited to 3 minutes).
- `rate_limit(threshold: number, seconds: number): void` - applies rate limiting per function and IP over the indicated period.

---

## Practical examples

### 1) Hello World

```js
async function main() {
    if (req.method !== 'GET') {
        res.status(405);
        return;
    }
    res.text('hello world');
}
```

### 2) Authentication + rate limit + query param

```js
async function main() {
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    rate_limit(10, 60); // up to 10 requests per IP every 60s

    if (req.method !== 'GET') {
        res.status(405);
        return;
    }

    const city = req.query.q || res.error("'q' is required");
    res.json({ city });
}
```

### 3) JSON body with error handling

```js
async function main() {
    let data;
    try {
        data = req.json();
    } catch {
        res.error('Invalid JSON', 400);
    }

    // use the payload
    res.json({ received: data });
}
```

### 4) AI call (direct text)

```js
async function main() {
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    const prompt = req.query.p || 'Say hello briefly.';
    const text = await ai.completeText('@metaai/llama-4-scout-17b-16e', prompt, { temperature: 0.7 });
    res.text(text);
}
```

### 5) Full example (JSON function)

```js
async function main() {
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    rate_limit(10, 60);

    if (req.method !== 'GET') {
        res.status(405);
        return;
    }

    const cityName = req.query.q || res.error("'q' is required");

    const weather = await api.post('/api/v1/functions/json', {
        modelName: '@x-ai/grok-4-fast',
        prompt: 'Search weather data for the given city.',
        responseSchema: {
            type: 'object',
            properties: {
                temperature: { type: 'number', description: 'Temperature in °C' },
                forecast: { type: 'string', enum: ['rainy', 'thunder', 'clear'] }
            },
            required: ['temperature', 'forecast']
        },
        inputData: { cityName }
    });

    res.json(weather.json.data.result);
}
```

### 6) Sleep (controlled wait)

```js
async function main() {
    // wait 200 ms
    sleep(200);
    res.text('ok');
}
```

## Engine limitations

Functions run in an isolated JavaScript container with the following restrictions:

- Maximum memory per execution: 32 MB.
- Maximum execution time per script: 5 minutes.
- Maximum evaluation time for RegExp expressions: 10 seconds.
- Maximum response size read by `fetch`: 10 MB (except internal AIVAX calls).

> [!TIP]
> Handle user input, validate methods/headers and use `res.error()` for consistent error responses. Prefer `rate_limit()` on public endpoints.

## Pricing

Billing is done per execution hour. Each call accumulates milliseconds only from the script's execution time (does not include compilation). E.g., if the script takes 20 seconds, 20,000 ms will be counted. The minimum charge per execution is 20 ms.

The serverless processing cost is **$1/hour**.

> [!NOTE]
> All accounts have **10 minutes** free per day. Once exceeded, billing starts. If the account goes negative, function execution is halted.

## Rate limits

The global rate limits for serverless functions are described in [rate limits](/docs/en/limits).