# Serverless Functions

AIVAX's serverless functions allow you to run JavaScript on demand, in a managed environment, to create agentic endpoints without having to maintain servers.

Each request triggers the execution of your script, which reads data from the `req` object and writes the response to the `res` object.

## Execution Flow

- Write an `async function main()`; it is called for each request.
- Use `req` to read method, headers, query, and body.
- Build the response with `res.status()`, `res.header()`, `res.text()` or `res.json()`.
- Optionally, authenticate with `await authenticate()` and apply rate limiting with `rate_limit()`.
- You can call models with `ai.complete(...)` or access internal APIs with `api.get/post/...`.

> [!IMPORTANT]
> No function is authenticated by default. Protect your endpoints by implementing your own logic or using `await authenticate()`.

## API Reference

### Global Functions

Methods available globally in the function scope.

- `async authenticate(): Promise<boolean>`
  - Validates the request by checking the account's API Key. Returns `true` if authenticated, `false` otherwise.
- `sleep(ms: number): void`
  - Pauses execution for the specified time in milliseconds.
  - Limits: Maximum of 3 minutes (180,000 ms). Throws an error if negative or above the limit.
- `rate_limit(threshold: number, seconds: number): void`
  - Applies rate limiting per function and IP.
  - If the limit is exceeded, execution is halted and a 429 error is returned.

### `console` Object

Used for debugging. Messages are displayed in the function's debug terminal.

- `log(...args)` / `info(...args)` / `debug(...args)` / `trace(...args)` / `warn(...args)` / `error(...args)`
  - Writes messages to the log. Objects are automatically serialized.
- `table(data, columns?)`
  - Displays data in a tabular format. Useful for arrays of objects.

### `req` Object (Request)

Provides access to the received HTTP request data.

**Properties (Getters):**
- `headers: object` - Dictionary of request headers.
- `query: object` - Dictionary of query string parameters.
- `cookies: object` - Dictionary of cookies.
- `method: string` - HTTP method (GET, POST, etc.).
- `path: string` - URL path (e.g., `/my-function`).
- `fullPath: string` - Full path including query string.
- `url: string` - Full request URL.

**Methods:**
- `json(): any` - Reads the request body and parses it as JSON.
- `text(): string` - Reads the request body as text.
- `blob(): any` - Reads the request body as binary data (raw).
- `form(): object` - Reads the body as `application/x-www-form-urlencoded`.
- `multipartForm(): object` - Reads the body as `multipart/form-data`.

### `res` Object (Response)

Used to construct and send the HTTP response.

**Methods:**
- `status(code: number): void`
  - Sets the HTTP status code (e.g., 200, 404).
- `header(name: string, value: string): void`
  - Adds a header to the response.
- `text(body: string): void`
  - Sets the response body as plain text.
- `json(data: any): void`
  - Sets the response body as JSON (automatically serialized).
- `send(args: any[], contentType: string): void`
  - Sends a formatted response with the specified Content-Type.
- `echo(...args): void`
  - Sends the arguments as plain text (`text/plain`).
- `sendEvent(content: string, arg?: string): void`
  - Sends an event to streams (`text/event-stream`). The default for `arg` is 'data'.
- `error(message: string, status?: number): never`
  - Sets the status (default 400), returns a JSON `{ error: message }` and terminates execution immediately.

### `fetch` Object

Implementation of the Fetch API to make external HTTP requests.

`fetch(url: string, options?: RequestInit): Promise<Response>`

**Options (`RequestInit`):**
- `method`: HTTP method (default 'GET').
- `headers`: Object with headers.
- `body`: Request body (`string` or `FormData`).
- `timeout`: Timeout in seconds (default 30s, max 300s).
- `redirect`: 'follow' (default) or 'manual'.

**Return (`Response`):**
- `ok`: boolean (status 200-299).
- `status`: number.
- `statusText`: string.
- `url`: string.
- `headers`: object.
- `text()`: Promise<string>.
- `json()`: Promise<any>.

### `FormData` Object

Available for building `multipart/form-data` request bodies.

- `append(name, value)`
- `set(name, value)`
- `delete(name)`
- `get(name)`
- `getAll(name)`
- `has(name)`
- `keys()`
- `values()`
- `entries()`

### `api` Object (Internal)

Optimized and authenticated HTTP client for calling AIVAX internal endpoints.

- `async get(path)`
- `async post(path, body)`
- `put(path, body)`
- `patch(path, body)`
- `delete(path)`

**Notes:**
- `path` must be relative (e.g., `/api/v1/...`).
- `get` and `post` return an extended object with a `.json` getter for convenience.
- Calls automatically inject authentication and tracing headers.

### `ai` Object (Inference)

Helpers for using the platform's AI models.

- `async complete(model, prompt, options?)`
  - Calls the chat completions endpoint. Returns the full JSON response object.
- `async completeText(model, prompt, options?)`
  - Calls the endpoint and returns only the text of the first choice (`choices[0].message.content`).

---

## Limits and Restrictions

The execution environment has the following restrictions to ensure stability and security:

- **Memory:** 32 MB per execution.
- **Script Timeout:** Varies by account plan (30 seconds to 20 minutes).
- **Regex Timeout:** 10 seconds.
- **Execution Stack:** Maximum of 256 calls (stack/recursion depth).
- **Fetch:** Responses limited to 10 MB.

## Pricing

Billing is based on execution time (CPU time).

- **Cost:** $1.00 per hour (billed per millisecond).
- **Minimum:** 20 ms per execution.
- **Free tier:** 10 free minutes per day for all accounts.

> [!NOTE]
> Discounted execution time (e.g., internal inference network calls or API calls to AIVAX) is not billed, but there is a minimum floor of 20ms per invocation.

## Examples

### Hello World

```javascript
async function main() {
    res.text("Hello, world!");
}
```

### Respond JSON with Validation

```javascript
async function main() {
    if (req.method !== 'POST') {
        return res.error("Method not allowed", 405);
    }

    try {
        const body = req.json();
        if (!body.nome) throw new Error("Field 'name' required");
        
        res.json({ 
            mensagem: `Olá, ${body.nome}`,
            timestamp: new Date()
        });
    } catch (e) {
        res.error(e.message);
    }
}
```

### Call AI and Return Text

```javascript
async function main() {
    if (!await authenticate())
        return res.error("Unauthorized", 401);

    const prompt = req.query.p || "Tell a short joke";
    const resposta = await ai.completeText('@metaai/llama-3-8b', prompt);
    
    res.text(resposta);
}
```