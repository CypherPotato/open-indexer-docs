# Funções serverless

As funções serverless da AIVAX permitem executar JavaScript sob demanda, em um ambiente gerenciado, para criar endpoints agênticos sem precisar manter servidores.

Cada requisição dispara a execução do seu script, que lê dados do objeto `req` e escreve a resposta no objeto `res`.

## Fluxo de execução

- Escreva uma função `async function main()`; ela é chamada a cada requisição.
- Use `req` para ler método, headers, query e corpo.
- Construa a resposta com `res.status()`, `res.header()`, `res.text()` ou `res.json()`.
- Opcionalmente, autentique com `await authenticate()` e aplique limitação com `rate_limit()`.
- Você pode chamar modelos com `ai.complete(...)` ou acessar APIs internas com `api.get/post/...`.

> [!IMPORTANT]
> Nenhuma função é autenticada por padrão. Proteja seus endpoints implementando lógica própria ou usando `await authenticate()`.

## Referência da API

### Funções Globais

Métodos disponíveis globalmente no escopo da função.

- `async authenticate(): Promise<boolean>`
  - Valida a requisição verificando a API Key da conta. Retorna `true` se autenticado, `false` caso contrário.
- `sleep(ms: number): void`
  - Pausa a execução pelo tempo especificado em milissegundos.
  - Limites: Máximo de 3 minutos (180.000 ms). Lança erro se negativo ou acima do limite.
- `rate_limit(threshold: number, seconds: number): void`
  - Aplica rate-limit por função e IP.
  - Se o limite for excedido, interrompe a execução e retorna erro 429.

### Objeto `console`

Utilizado para depuração. As mensagens são exibidas no terminal de debug da função.

- `log(...args)` / `info(...args)` / `debug(...args)` / `trace(...args)` / `warn(...args)` / `error(...args)`
  - Escreve mensagens no log. Objetos são serializados automaticamente.
- `table(data, columns?)`
  - Exibe dados em formato tabular. Útil para arrays de objetos.

### Objeto `req` (Request)

Fornece acesso aos dados da requisição HTTP recebida.

**Propriedades (Getters):**
- `headers: object` - Dicionário com os cabeçalhos da requisição.
- `query: object` - Dicionário com os parâmetros da query string.
- `cookies: object` - Dicionário com os cookies.
- `method: string` - Método HTTP (GET, POST, etc.).
- `path: string` - Caminho da URL (ex: `/minha-funcao`).
- `fullPath: string` - Caminho completo incluindo query string.
- `url: string` - URL completa da requisição.

**Métodos:**
- `json(): any` - Lê o corpo da requisição e faz o parse como JSON.
- `text(): string` - Lê o corpo da requisição como texto.
- `blob(): any` - Lê o corpo da requisição como dados binários (raw).
- `form(): object` - Lê o corpo como `application/x-www-form-urlencoded`.
- `multipartForm(): object` - Lê o corpo como `multipart/form-data`.

### Objeto `res` (Response)

Utilizado para construir e enviar a resposta HTTP.

**Métodos:**
- `status(code: number): void`
  - Define o código de status HTTP (ex: 200, 404).
- `header(name: string, value: string): void`
  - Adiciona um cabeçalho à resposta.
- `text(body: string): void`
  - Define o corpo da resposta como texto plano.
- `json(data: any): void`
  - Define o corpo da resposta como JSON (serializa automaticamente).
- `send(args: any[], contentType: string): void`
  - Envia uma resposta formatada com o Content-Type especificado.
- `echo(...args): void`
  - Envia os argumentos como texto plano (`text/plain`).
- `sendEvent(content: string, arg?: string): void`
  - Envia um evento para streams (`text/event-stream`). Padrão do `arg` é 'data'.
- `error(message: string, status?: number): never`
  - Define o status (padrão 400), retorna um JSON `{ error: message }` e encerra a execução imediatamente.

### Objeto `fetch`

Implementação da API Fetch para fazer requisições HTTP externas.

`fetch(url: string, options?: RequestInit): Promise<Response>`

**Opções (`RequestInit`):**
- `method`: Método HTTP (padrão 'GET').
- `headers`: Objeto com cabeçalhos.
- `body`: Corpo da requisição (`string` ou `FormData`).
- `timeout`: Timeout em segundos (padrão 30s, máx 300s).
- `redirect`: 'follow' (padrão) ou 'manual'.

**Retorno (`Response`):**
- `ok`: boolean (status 200-299).
- `status`: number.
- `statusText`: string.
- `url`: string.
- `headers`: object.
- `text()`: Promise<string>.
- `json()`: Promise<any>.

### Objeto `FormData`

Disponível para construir corpos de requisição `multipart/form-data`.

- `append(name, value)`
- `set(name, value)`
- `delete(name)`
- `get(name)`
- `getAll(name)`
- `has(name)`
- `keys()`
- `values()`
- `entries()`

### Objeto `api` (Interno)

Cliente HTTP otimizado e autenticado para chamar endpoints internos da AIVAX.

- `async get(path)`
- `async post(path, body)`
- `put(path, body)`
- `patch(path, body)`
- `delete(path)`

**Notas:**
- `path` deve ser relativo (ex: `/api/v1/...`).
- `get` e `post` retornam um objeto estendido com um getter `.json` para conveniência.
- As chamadas injetam automaticamente headers de autenticação e rastreamento.

### Objeto `ai` (Inferência)

Facilitadores para uso dos modelos de IA da plataforma.

- `async complete(model, prompt, options?)`
  - Chama o endpoint de chat completions.
  - Retorna o objeto JSON completo da resposta.
- `async completeText(model, prompt, options?)`
  - Chama o endpoint e retorna apenas o texto da primeira escolha (`choices[0].message.content`).

---

## Limites e Restrições

O ambiente de execução possui as seguintes restrições para garantir estabilidade e segurança:

- **Memória:** 32 MB por execução.
- **Timeout de Script:** Varia conforme o plano da conta (30 segundos a 20 minutos).
- **Timeout de Regex:** 10 segundos.
- **Pilha de Execução:** Máximo de 256 chamadas (stack/recursion depth).
- **Fetch:** Respostas limitadas a 10 MB.

## Precificação

A cobrança é baseada no tempo de execução (CPU time).

- **Custo:** $1.00 / hora (cobrado por milissegundo).
- **Mínimo:** 20 ms por execução.
- **Gratuidade:** 10 minutos diários gratuitos para todas as contas.

> [!NOTE]
> O tempo de execução descontado (ex: chamadas de rede internas de inferência ou chamadas de API para AIVAX) não é cobrado, mas há um piso mínimo de 20ms por invocação.

## Exemplos

### Hello World

```javascript
async function main() {
    res.text("Olá, mundo!");
}
```

### Responder JSON com Validação

```javascript
async function main() {
    if (req.method !== 'POST') {
        return res.error("Método não permitido", 405);
    }

    try {
        const body = req.json();
        if (!body.nome) throw new Error("Campo 'nome' obrigatório");
        
        res.json({ 
            mensagem: `Olá, ${body.nome}`,
            timestamp: new Date()
        });
    } catch (e) {
        res.error(e.message);
    }
}
```

### Chamar IA e Retornar Texto

```javascript
async function main() {
    if (!await authenticate())
        return res.error("Não autorizado", 401);

    const prompt = req.query.p || "Conte uma piada curta";
    const resposta = await ai.completeText('@metaai/llama-3-8b', prompt);
    
    res.text(resposta);
}
```