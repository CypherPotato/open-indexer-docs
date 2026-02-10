# AI Gateway

Os gateways de AI é um serviço que a AIVAX fornece para criar um túnel de inferência entre um modelo de LLM e uma base de conhecimento. Nele é possível:

- Criar um modelo com instruções personalizadas
- Usar um modelo provido por você através de um endpoint OpenAI compatível, ou usar um modelo disponibilizado pela AIVAX
- Personalizar parâmetros de inferência, como temperatura, top_p, prefill
- Usar uma coleção de conhecimento como fundação de respostas para IA

Dentre outros recursos. Com o AI Gateway, você cria um modelo pronto para uso, parametrizado e fundamentado nas instruções que você definir.

## Modelos

Você pode trazer um modelo de IA compatível com a interface OpenAI para o gateway de IA. Se você trazer seu modelo de IA, iremos cobrar apenas pela pesquisa de documentos anexada na IA. Você também pode usar um dos modelos abaixo que já estão prontos para começar com o AIVAX.

Ao usar um modelo, você perceberá que alguns são mais inteligentes que outros para determinadas tarefas. Alguns modelos são melhores com certas estratégias de obtenção de dados do que outros. Realize testes para encontrar o melhor modelo.

Você pode ver os modelos disponíveis na [página de modelos](/docs/models).

## Usar um gateway de IA

A AIVAX provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela AIVAX com aplicações e SDKs existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Uso com SDKs

Por prover endpoints compatíveis com a interface OpenAI, a AIVAX é totalmente compatível com SDKs existentes, facilitando a integração plug-and-play.

Veja o exemplo abaixo:

```python
from openai import OpenAI
 
client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="oky_gr5u...oqbfd3d9y"
)
 
response = client.chat.completions.create(
    model="my-gateway:50c3", # you can also provide your ai-gateway full ID here
    messages=[
        {"role": "user", "content": "Explain why AI-gateways are useful."}
    ]
)
 
print(response.choices[0].message.content)
```

No momento, a AIVAX só suporta o formato `chat/completions`. No futuro, pretendemos criar suporte para a API Responses.

## Uso com MCP

É possível expor seus AI Gateways através de funções MCP (Model Context Protocol). Isso permite que modelos de IA invoquem outros modelos (sub-agentes) de forma nativa através do protocolo MCP.

Para configurar um AI Gateway como servidor MCP, utilize o endpoint `https://inference.aivax.net/v1/mcp/inference` e configure os seguintes cabeçalhos HTTP:

| Cabeçalho | Descrição | Obrigatório |
|-----------|-----------|-------------|
| `Authorization` | Bearer token da sua API key | Sim |
| `X-Mcp-Model-Name` | Tag do modelo ou ID do gateway. Pode ser o ID completo do gateway ou o formato slug `nome:id-parcial` | Sim |
| `X-Mcp-Tool-Name` | Nome da ferramenta MCP. Será convertido para formato de identificador | Não (padrão: `ai_model`) |
| `X-Mcp-Tool-Description` | Descrição da ferramenta para o modelo entender quando usá-la | Não |
| `X-Mcp-Tool-Title` | Título amigável da ferramenta | Não |
| `X-Mcp-User` | ID do usuário externo para rastreamento | Não |

### Identificação do Gateway

Existem três formas de identificar o gateway através do cabeçalho `X-Mcp-Model-Name`:

1. **ID completo do gateway**: `550e8400-e29b-41d4-a716-446655440000`
2. **Formato slug**: `meugateway:50c3` (nome do gateway + parte final do ID)
3. **Tag de modelo integrado**: Nome direto de um modelo disponível na AIVAX

### Exemplo de configuração

Visual Studio Code:

```json
{
    "servers": {
        "my-ai-gateway-mcp": {
            "type": "http",
            "url": "https://inference.aivax.net/v1/mcp/inference",
            "headers": {
                "Authorization": "Bearer {your_api_key}",
                "X-Mcp-Model-Name": "meugateway:50c3",
                "X-Mcp-Tool-Name": "my_assistant",
                "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis",
                "X-Mcp-Tool-Title": "Data Analysis Assistant"
            }
        }
    }
}
```

AIVAX Gateway MCP:

```json
[
    {
        "name": "Search sub agent",
        "url": "https://inference.aivax.net/v1/mcp/inference",
        "headers": {
            "Authorization": "Bearer {your_api_key}",
            "X-Mcp-Model-Name": "meugateway:50c3",
            "X-Mcp-Tool-Name": "my_assistant",
            "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis",
            "X-Mcp-Tool-Title": "Data Analysis Assistant"
        }
    }
]
```

### Ferramenta gerada

O servidor MCP criará automaticamente uma ferramenta com o nome `invoke_{tool_name}` que aceita o parâmetro:

- **prompt** (string): O prompt a ser enviado ao modelo

A ferramenta executará uma inferência no AI Gateway configurado e retornará a resposta do modelo.

Este MCP compartilha os [limites de taxa de inferência](/docs/limits) para evitar abusos e garantir a estabilidade do serviço. Se os limites de taxa forem excedidos, a ferramenta retornará um erro indicando que o limite foi atingido.