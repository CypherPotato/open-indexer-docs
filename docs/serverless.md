# Funções serverless

As funções serverless da AIVAX permitem executar JavaScript sob demanda, em um ambiente gerenciado, para criar endpoints agênticos sem precisar manter servidores.

Cada requisição dispara a execução do seu script, que lê dados do objeto `req` e escreve a resposta no objeto `res`.

## Fluxo de execução em 30 segundos

- Escreva uma função `async function main()`; ela é chamada a cada requisição.
- Use `req` para ler método, headers, query e corpo.
- Construa a resposta com `res.status()`, `res.header()`, `res.text()` ou `res.json()`.
- Opcionalmente, autentique com `await authenticate()` e aplique limitação com `rate_limit()`.
- Você pode chamar modelos com `ai.complete(...)` ou acessar APIs internas com `api.get/post/...`.

> [!IMPORTANT]
> Nenhuma função é autenticada por padrão. Proteja seus endpoints implementando lógica própria ou usando `await authenticate()`.

## Objetos globais suportados

A seguir, a referência dos objetos e métodos disponíveis no ambiente, conforme implementados pela engine.

### console

- `log(...args)`/ `error(...args)` / `warn(...args)` / `info(...args)`
    - Escreve no console de depuração.
    - Strings/objetos são serializados (objetos via `JSON.stringify`).
- `table(data, columns?)`
    - Arrays: imprime uma linha de cabeçalho com `(index)` + colunas. Se `columns` não for informado, as colunas são inferidas pela união das chaves dos objetos no array. Arrays vazios imprimem `(empty array)`.
    - Objetos: lista `key: value` por linha.
    - Demais tipos: imprime diretamente com `log`.

Notas

- Para múltiplos argumentos, `log` concatena com espaço. Objetos são serializados com `JSON.stringify`.

### fetch(url, options?) -> Promise<Response>

- `options.body`: `string`, `FormData` ou `null`.
- `options.method`: método HTTP.
- `options.headers`: objeto com cabeçalhos.
- `options.timeout`: inteiro (ms) de timeout da requisição.
- `options.redirect`: `follow` | `manual`.

Objeto Response:

- `async text(): Promise<string>`
- `async json(): Promise<object>`
- `ok: boolean`
- `status: number`
- `statusText: string | null`
- `headers: object`
- `url: string`

Erros e notas

- `Response.json()` lança se o corpo não for um JSON válido.
- O corpo não é stream; leia com `text()` ou `json()`.

### req (leitura da requisição)

- `headers: object` - cabeçalhos da requisição.
- `query: object` - parâmetros da query string.
- `cookies: object` - cookies presentes.
- `method: string` - método HTTP.
- `path: string` - caminho sem query.
- `fullPath: string` - caminho com query.
- `url: string` - URL completa.
- `json(): any` - corpo como JSON.
- `text(): string` - corpo como texto.
- `blob(): ArrayBuffer` - corpo binário.
- `form(): object` - form-data simples.
- `multipartForm(): object` - multipart form-data.

Erros e notas

- `req.json()` lança se o corpo não for um JSON válido.

### res (escrita da resposta)

- `status(code: number): void` - define status HTTP.
- `header(name: string, value: string): void` - adiciona cabeçalho.
- `text(body: string): void` - define o corpo da resposta como texto.
- `json(data: any): void` - define o corpo da resposta como JSON.
- `error(message: string, status = 400): never` - define status e corpo `{ error: message }` e encerra imediatamente a execução do script.

Notas

- Apenas `res.error(...)` interrompe a execução. Após `res.text(...)` ou `res.json(...)`, retorne da função (`return`) se quiser evitar processamento adicional.

### ai (inferência)

- `async complete(model, prompt, options?)`
    - Entrada
        - `model: string` - nome/slug/ID do modelo ou gateway da conta.
        - `prompt: string | any[]` - texto ou array de mensagens (encaminhado como `prompt`).
        - `options?: object` - propriedades adicionais encaminhadas ao endpoint, mescladas ao corpo com `stream: false`.
    - Retorno: objeto JSON da resposta do endpoint de chat/completions.
- `async completeText(model, prompt, options?)`
    - Retorno: `string` com o conteúdo de `choices[0].message.content` do resultado de `complete`.

### api (HTTP interno autenticado)

- `async get(path)`
    - Retorno: objeto de resposta com `text` (string) e propriedade `.json` (getter) que parseia `text` via `JSON.parse`.
- `async post(path, body)`
    - Corpo é serializado com `JSON.stringify(body)`.
    - Retorno: igual ao `get`, com `.text` e getter `.json`.
- `put(path, body)` / `patch(path, body)` / `delete(path)`
    - Retorno: promessa para o resultado bruto interno (sem o getter `.json`).

Notas

- `path` é relativo à API interna da AIVAX.
- O getter `.json` lança se `text` não contiver JSON válido.

### Helpers

- `async authenticate(): Promise<boolean>` - valida a requisição com a API key da sua conta.
- `sleep(ms: number): void` - aguarda o tempo informado em milissegundos (limitado a 3 minutos).
- `rate_limit(threshold: number, seconds: number): void` - aplica rate-limit por função e IP no período indicado.

---

## Exemplos práticos

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

### 2) Autenticação + rate limit + query param

```js
async function main() {
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    rate_limit(10, 60); // até 10 requisições por IP a cada 60s

    if (req.method !== 'GET') {
        res.status(405);
        return;
    }

    const city = req.query.q || res.error("'q' é obrigatório");
    res.json({ city });
}
```

### 3) Corpo JSON com tratamento de erro

```js
async function main() {
    let data;
    try {
        data = req.json();
    } catch {
        res.error('JSON inválido', 400);
    }

    // uso do payload
    res.json({ received: data });
}
```

### 4) Chamada de IA (texto direto)

```js
async function main() {
    if (!await authenticate()) {
        res.status(403);
        return;
    }

    const prompt = req.query.p || 'Diga olá de forma breve.';
    const text = await ai.completeText('@metaai/llama-4-scout-17b-16e', prompt, { temperature: 0.7 });
    res.text(text);
}
```

### 5) Exemplo completo (função JSON)

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

    const cityName = req.query.q || res.error("'q' é obrigatório");

    const weather = await api.post('/api/v1/functions/json', {
        modelName: '@x-ai/grok-4-fast',
        prompt: 'Pesquise dados de clima para a cidade informada.',
        responseSchema: {
            type: 'object',
            properties: {
                temperature: { type: 'number', description: 'Temperatura em °C' },
                forecast: { type: 'string', enum: ['rainy', 'thunder', 'clear'] }
            },
            required: ['temperature', 'forecast']
        },
        inputData: { cityName }
    });

    res.json(weather.json.data.result);
}
```

### 6) Sleep (espera controlada)

```js
async function main() {
    // aguarda 200 ms
    sleep(200);
    res.text('ok');
}
```

## Limitações da engine

As funções executam em um container JavaScript isolado com as seguintes restrições:

- Memória máxima por execução: 32 MB.
- Tempo máximo de execução por script: 5 minutos.
- Tempo máximo de avaliação de expressões RegExp: 10 segundos.
- Tamanho máximo de resposta lida por `fetch`: 10 MB (exceto chamadas internas da AIVAX).

> [!TIP]
> Trate entradas do usuário, valide métodos/headers e use `res.error()` para respostas de erro coerentes. Prefira `rate_limit()` em endpoints públicos.

## Precificação

A cobrança é feita por hora de execução. Cada chamada acumula milissegundos apenas do tempo de execução do script (não inclui compilação). Ex.: se o script levar 20 segundos, serão contabilizados 20.000 ms. O débito mínimo por execução é de 20 ms.

O custo de processamento serverless é de **$1/hora**.

> [!NOTE]
> Todas as contas possuem **10 minutos** grátis por dia. Ao ultrapassar, inicia-se a cobrança. Se a conta ficar negativa, a execução da função é interrompida.

## Limites de taxa

Os limites de taxa globais para funções serverless estão descritos em [limites de taxa](/docs/limits).