# Gateway de IA

Um Gateway de IA é uma configuração de inferência persistente. Ele permite que você chame um agente pelo nome do modelo enquanto o AIVAX aplica as configurações do modelo do gateway, instruções, coleções RAG, ferramentas, habilidades, workers, moderação e controles de contexto.

Use um gateway quando o mesmo comportamento precisar ser reutilizado por vários clientes ou alterado sem redeployar a aplicação chamadora.

## Como pensar em um gateway

Uma chamada direta para `/v1/chat/completions` pode chamar um modelo AIVAX integrado diretamente, por exemplo `@openai/gpt-5-mini`. Um gateway armazena as decisões que você não quer repetir em cada solicitação:

- Provedor e nome do modelo.
- Instruções do sistema, fontes de instruções remotas, modelo de prompt do usuário e preenchimento prévio do assistente.
- Coleções RAG, limites de resultados, limiar de pontuação, reordenador, comportamento de referência e estratégia de consulta.
- Ferramentas compatíveis com OpenAI, ferramentas internas do AIVAX, ferramentas MCP, funções de protocolo, habilidades e o ambiente bash opcional.
- Comportamento da janela de contexto, truncamento de mensagens de ferramenta, moderação, workers, roteamento de modelo e tratamento de chamadas de ferramenta.

Isso cria um limite de responsabilidade. A aplicação cliente envia mensagens e sobrescritas de solicitação opcionais. O administrador do gateway controla a política operacional.

Em produção, comece com uma configuração conservadora: instruções claras do sistema, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e apenas as ferramentas realmente necessárias. Adicionar muitas ferramentas, habilidades ou coleções aumenta os tokens de entrada, o custo e a chance de o modelo escolher o caminho errado.

## Modelos e nomes de gateway

Existem três formas comuns de escolher o que o `/v1/chat/completions` usa:

- Usar uma tag de modelo AIVAX integrado, geralmente começando com `@`.
- Usar o ID completo do gateway.
- Usar um slug de gateway no formato `nome:final-id`, como `support:50c3`.

Chaves de API privadas podem resolver um gateway por ID completo ou por slug. Chaves de API públicas são mais restritas: podem usar gateways de IA apenas por ID completo, e apenas um conjunto limitado de parâmetros de solicitação de conclusão de chat é aceito.

Ao escolher um modelo, valide três pontos antes de colocá‑lo em produção:

- O modelo suporta as modalidades de entrada que você pretende enviar, como imagem, áudio, vídeo ou arquivo.
- O modelo suporta chamadas de função se o gateway usar ferramentas, RAG por meio de `QueryFunction`, MCP, funções de protocolo, habilidades ou funções internas.
- O modelo aceita os parâmetros que você configura. Alguns modelos integrados rejeitam preenchimento prévio do assistente, temperatura, sequências de parada ou esforço de raciocínio.

Gateways também podem usar roteamento de modelo. Para o roteador de complexidade, o AIVAX classifica a última solicitação do usuário como baixa, média ou alta complexidade, seleciona o modelo configurado para esse nível e emite `X-Model-Routed-Complexity` na resposta HTTP quando disponível.

## Usando um Gateway de IA

O AIVAX fornece um endpoint de conclusão de chat compatível com OpenAI:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Os valores do gateway podem ser sobrescritos pela solicitação para parâmetros suportados, como `temperature`, `top_p`, `seed`, `reasoning_effort`, `max_completion_tokens`, `stop`, `tools`, `response_schema`, `response_format`, `builtin_tools`, `multimodal_preprocess` e `tool_invocation_explanations`. Para comportamento de inferência direta, incluindo opções de renderização de resposta, veja [Inference](/docs/pt-br/inference/inference).

## Usando SDKs

Como o endpoint segue o formato de conclusão de chat do OpenAI, você pode usar SDKs compatíveis existentes.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="YOUR_AIVAX_API_KEY"
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explain why AI gateways are useful."}
    ]
)

print(response.choices[0].message.content)
```

A implementação atual de inferência compatível com OpenAI é `chat/completions`. O repositório não expõe uma implementação `/v1/responses` neste checkout.

## Configuração recomendada para produção

Escreva as instruções do sistema para que o modelo entenda seu papel, público, fontes de verdade e limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando a informação não estiver disponível. Evite repetir configurações operacionais que já existem no gateway, como limites de truncamento ou listas de ferramentas.

Para RAG, vincule coleções com documentos curtos, auto‑contidos e bem nomeados. Escolha a estratégia de consulta com base no tipo de conversa:

- `Plain`: Usa a última mensagem do usuário como termo de busca.
- `Concatenate`: Junta o número configurado de últimas mensagens do usuário linha a linha.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente usando um modelo resolvedor.
- `QueryFunction`: Expõe uma função de busca ao modelo em vez de injetar um resultado de busca antes da inferência.

Para ferramentas, habilite apenas aquelas com um papel claro. Ferramentas internas cobrem capacidades comuns como busca na web, abertura de URLs, execução de código, geração de imagens, geração de documentos, geração de páginas, ações de calendário, memória, requisições HTTP e busca de postagens X. MCP externo é melhor quando você já tem um servidor MCP com ferramentas de negócio. Funções de protocolo são úteis quando você quer expor callbacks HTTP específicos ao modelo sem instalar um servidor MCP completo.

Use um manipulador de ferramenta apenas quando o modelo selecionado precisar de ajuda para produzir chamadas de ferramenta. Neste checkout, o manipulador habilitado é `react.v1.selfcall`; `native` ou nenhum valor usa a chamada nativa de ferramenta do modelo.

Use workers quando um sistema externo precisar decidir algo durante o fluxo de inferência. Um worker pode bloquear uma mensagem, reescrever o contexto, adicionar ferramentas ou substituir o resultado de uma ferramenta do lado do servidor. Como o worker é chamado no caminho crítico, mantenha‑o rápido e determinístico.

## Usando com MCP

Você pode expor um Gateway de IA como uma ferramenta MCP. Isso permite que outro cliente ou modelo compatível com MCP chame o gateway como um sub‑agente.

Configure a URL do servidor MCP como:

```text
https://inference.aivax.net/v1/mcp/inference
```

Defina esses cabeçalhos HTTP:

| Cabeçalho | Descrição | Obrigatório |
|---|---|---|
| `Authorization` | Token Bearer para sua chave de API AIVAX. | Sim |
| `X-Mcp-Model-Name` | Tag de modelo integrado, ID completo do gateway ou slug do gateway. | Sim |
| `X-Mcp-Tool-Name` | Nome base da ferramenta. O AIVAX o converte para formato de identificador e expõe `invoke_{tool_name}`. | Não, o padrão é `ai_model` |
| `X-Mcp-Tool-Description` | Descrição mostrada ao cliente MCP. | Não |
| `X-Mcp-Tool-Title` | Título amigável mostrado ao cliente MCP. | Não |
| `X-Mcp-User` | ID de usuário externo armazenado no contexto de inferência. | Não |

### Exemplo de configuração

```json
{
    "servers": {
        "my-ai-gateway-mcp": {
            "type": "http",
            "url": "https://inference.aivax.net/v1/mcp/inference",
            "headers": {
                "Authorization": "Bearer YOUR_AIVAX_API_KEY",
                "X-Mcp-Model-Name": "my-gateway:50c3",
                "X-Mcp-Tool-Name": "data_assistant",
                "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis.",
                "X-Mcp-Tool-Title": "Data Analysis Assistant"
            }
        }
    }
}
```

A ferramenta MCP gerada aceita um argumento:

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `prompt` | string | Prompt enviado ao modelo ou gateway configurado. |

A ferramenta MCP devolve a resposta do gateway como texto e compartilha o mesmo caminho de faturamento e limite de taxa da inferência subjacente de conclusão de chat.