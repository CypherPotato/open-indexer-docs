# Suporte à Model Context Protocol (MCP)

É possível vincular ferramentas externas do protocolo MCP em seu [AI Gateway](/docs/entities/ai-gateways/ai-gateway). O protocolo define funções que executam do lado do servidor e possibilitam a interação da assistente com serviços em tempo real.

As funções MCP persistem a chamada de ações do lado do servidor da AIVAX, removendo a necessidade de implementação da função do lado do cliente.

<img src="/assets/diagrams/mcp-1.drawio.svg">

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico ao que essa função faz. Evite nomes difíceis de advinhar ou que não remetam ao papel da função, pois a assistente pode se confundir e não chamar a função quando apropriado.

Como um exemplo, vamos pensar em uma função de consultar um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos para considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres impróprios)

Tendo o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando deve ser chamada pela assistente. Essa descrição deve incluir os cenários que a assistente deve considerar chamar ela e quando não deve ser chamada, fornecendo poucos exemplos de chamadas (one-shot) e/ou tornando explícitas as regras da função.

### Definindo servidores MCP

Você pode definir seus servidores MCP no gateway através de um array JSON:

```json
[
    {
        "name": "Meu servidor MCP",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "sk-pv-12nbo..."
        }
    }
]
```

Seu servidor MCP deve estar habilitado para **SSE** ou **Streamable HTTP** para funcionar com AIVAX. Você pode definir cabeçalhos customizados na configuração do seu servidor MCP para configurar autenticação ou demais necessidades.

Chamadas da AIVAX no servidor MCP remoto normalmente enviarão informações de metadata adicionais através do campo `_meta` do MCP:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "New York"
        },
        "_meta": {
            "_aiv_nonce": "$2a$12$ynC9kC2q6iuEjO8SFDQqVeDxvHPUIZ9jTClE91SJo8VYtt/BSJDUG",
            "_aiv_external_user_id": "custom-user-id",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "iiocc6stxgj5jc75ay4y",
            "_aiv_moment": "2025-09-09T16:58:05",
            "custom_metadata_field_1": "foo",
            "something": "bar"
        }
    }
}
```

Dos valores definidos em `_meta`, você tem os parâmetros de metadata da inferência, cliente ou função. Valores prefixados em `_aiv` são reservados para parâmetros da AIVAX.