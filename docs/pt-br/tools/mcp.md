# Suporte à Model Context Protocol (MCP)

É possível vincular ferramentas externas do protocolo MCP em seu [AI Gateway](/docs/pt-br/inference/ai-gateway). O protocolo define funções que executam do lado do servidor e possibilitam a interação da assistente com serviços em tempo real.

As funções MCP persistem a chamada de ações do lado do servidor da AIVAX, removendo a necessidade de implementação da função do lado do cliente.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar MCP

Use MCP quando você já tem ferramentas externas que precisam ser descobertas e chamadas por modelos de forma padronizada. Um servidor MCP é adequado para catálogos de ferramentas, integrações com sistemas internos, operações com estado próprio, ferramentas compartilhadas entre vários agentes e ambientes onde você quer manter a lógica fora da AIVAX. A AIVAX atua como cliente MCP: ela conecta o AI Gateway ao servidor remoto, lê as ferramentas disponíveis e permite que o modelo chame essas ferramentas durante a inferência.

Não use MCP apenas para substituir uma única chamada HTTP simples. Quando você precisa expor uma função isolada, com callback específico e autenticação por nonce, [funções de protocolo](/docs/pt-br/tools/protocol-functions) costumam ser mais simples. Quando a capacidade já existe na AIVAX, como pesquisa web, abertura de URL, execução de código ou geração de imagem, [ferramentas embutidas](/docs/pt-br/tools/builtin-tools) costumam ser o caminho mais direto. MCP é melhor quando existe um conjunto de ferramentas com schema próprio, quando outro sistema já fala MCP ou quando você quer que o mesmo servidor seja usado por clientes diferentes.

Em produção, trate o servidor MCP como uma API exposta a um agente. As descrições das ferramentas devem ser claras, os schemas devem ser restritivos e a autenticação deve ser configurada nos headers do servidor. O modelo não deve receber ferramentas genéricas demais, como `execute`, `request` ou `search`, sem descrição forte e parâmetros controlados. Ferramentas ambíguas aumentam chamadas erradas; ferramentas específicas, como `lookup_customer_by_email` ou `create_support_ticket`, ajudam o modelo a decidir melhor.

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

Use `_aiv_external_user_id` para aplicar autorização por usuário quando a chamada vem de um chat client ou sessão identificada. Use `_aiv_call_source` para diferenciar chamadas vindas de API, web chat ou integrações. Use `_aiv_conversation_token` quando o servidor MCP precisa manter correlação com uma conversa específica. Use `_aiv_moment` para decisões dependentes de data local. Quando `_aiv_nonce` estiver presente, valide-o da mesma forma que `X-Request-Nonce` em hooks reversos, comparando o hash com a chave de hook configurada na conta.

Quando uma ferramenta MCP não aparece para o modelo, confirme se o servidor remoto está acessível, se usa SSE ou Streamable HTTP, se os headers de autenticação estão corretos e se o gateway realmente está configurado com a fonte MCP. Quando a ferramenta aparece mas não é chamada, revise nome, descrição e schema. Quando é chamada com argumentos ruins, restrinja o JSON Schema e inclua descrições de propriedades. Quando a chamada falha, faça o servidor MCP retornar erros legíveis, porque o modelo precisa entender se deve tentar outro argumento, pedir informação ao usuário ou encerrar a ação.
