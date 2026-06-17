# AI Gateway

AI Gateway é o serviço da AIVAX para criar um túnel de inferência entre um modelo de LLM e uma base de conhecimento. Nele é possível:

- Criar um modelo com instruções personalizadas
- Usar um modelo provido por você através de um endpoint OpenAI compatível, ou usar um modelo disponibilizado pela AIVAX
- Personalizar parâmetros de inferência, como temperatura, top_p, prefill
- Usar uma coleção de conhecimento como fundação de respostas para IA

Dentre outros recursos. Com o AI Gateway, você cria um modelo pronto para uso, parametrizado e fundamentado nas instruções que você definir.

## Como pensar em um gateway

Pense no AI Gateway como a configuração permanente de um agente. Uma chamada direta para `/v1/chat/completions` resolve uma inferência isolada, mas um gateway guarda as decisões que você não quer repetir a cada requisição: qual modelo usar, quais instruções base definem a personalidade e as regras da assistente, quais coleções de RAG entram no contexto, quais ferramentas ficam disponíveis, quais skills podem ser ativadas, como o contexto será truncado, como as ferramentas serão interpretadas e quais workers externos podem intervir no fluxo. Essa separação é útil porque a aplicação cliente passa a enviar apenas a conversa e, opcionalmente, alguns overrides controlados, enquanto a configuração operacional do agente permanece centralizada no console ou na API da AIVAX.

Um gateway também funciona como uma fronteira de responsabilidade. O sistema que chama a AIVAX não precisa conhecer todos os detalhes internos de RAG, MCP, funções de protocolo, ferramentas embutidas ou moderação; ele só precisa chamar um modelo pelo nome do gateway. Por outro lado, quem administra o gateway consegue trocar o modelo, ajustar instruções, habilitar ferramentas e alterar estratégias sem republicar a aplicação cliente. Em ambientes de produção, isso evita que regras de negócio, chaves de integração e decisões de prompt fiquem espalhadas em vários serviços.

As principais decisões de configuração são agrupadas em alguns blocos. O bloco de **modelo** define se o gateway usa um modelo integrado da AIVAX ou um modelo BYOK compatível com OpenAI, além de parâmetros como `temperature`, `top_p`, `reasoning_effort` e prefill da assistente. O bloco de **contexto** define instruções de sistema, templates, skills, instruções remotas e truncamento. O bloco de **conhecimento** define coleções de RAG e a estratégia de busca. O bloco de **ferramentas** inclui ferramentas OpenAI fornecidas diretamente, ferramentas embutidas da AIVAX, MCP externo e funções de protocolo. O bloco de **controle** inclui moderação, workers e tool handlers para modelos que precisam de ajuda para chamar funções.

Em produção, comece com uma configuração conservadora: uma instrução de sistema clara, um modelo que suporte as modalidades e ferramentas necessárias, uma única coleção de RAG bem preparada e poucas ferramentas realmente úteis. Depois de observar conversas reais, aumente a sofisticação. Adicionar muitas ferramentas, muitas skills ou muitos documentos sem critério aumenta tokens de entrada, custo e chance de o modelo escolher o caminho errado. Um gateway bom costuma ser mais parecido com uma operação bem delimitada do que com um catálogo de todas as capacidades possíveis.

## Modelos

Você pode trazer um modelo de IA compatível com a interface OpenAI para o gateway de IA. Se você trazer seu modelo de IA, iremos cobrar apenas pela pesquisa de documentos anexada na IA. Você também pode usar um dos modelos abaixo que já estão prontos para começar com o AIVAX.

Ao usar um modelo, você perceberá que alguns são mais inteligentes que outros para determinadas tarefas. Alguns modelos são melhores com certas estratégias de obtenção de dados do que outros. Realize testes para encontrar o melhor modelo.

Você pode identificar um gateway por seu ID completo ou pelo formato `nome:final-do-id`, como `suporte:50c3`. Esse formato é útil porque permite trocar o ID completo por uma referência curta, mas ainda evita ambiguidade quando há gateways com nomes parecidos. Modelos integrados da AIVAX usam tags próprias, geralmente iniciadas por `@`, e podem ser chamados diretamente quando você não precisa de uma configuração permanente de gateway.

Ao escolher um modelo, valide três pontos antes de colocá-lo em produção. Primeiro, confirme se ele suporta as entradas que você pretende enviar, como imagem, áudio, vídeo ou arquivos. Segundo, confirme se ele suporta chamadas de função caso o gateway use ferramentas, RAG por `QueryFunction`, MCP, funções de protocolo ou skills. Terceiro, confira se o modelo aceita os parâmetros que você quer usar; alguns modelos não aceitam temperatura, prefill de assistente ou esforço de raciocínio, e nesses casos o gateway precisa ser configurado de forma compatível.

## Usar um gateway de IA

A AIVAX provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela AIVAX com aplicações e SDKs existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para orientações sobre renderização de streaming, raciocínio, ferramentas e respostas contínuas, consulte [Tratamento de chat](/docs/pt-br/inference/chat-handling).

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

## Configuração recomendada para produção

Uma configuração de produção deve ser escrita de forma que o modelo entenda sua função, suas fontes de verdade e seus limites. Nas instruções de sistema, descreva o papel da assistente, o público que ela atende, o que ela pode ou não prometer, quando deve usar RAG, quando deve usar ferramentas e como responder quando a informação não estiver disponível. Evite colocar no prompt regras operacionais que já existem em outros lugares do gateway, como limites de truncamento ou lista de ferramentas, porque isso duplica manutenção e aumenta o risco de contradição.

Para RAG, prefira vincular coleções com documentos curtos, autossuficientes e bem nomeados. Se a assistente precisa responder com base em uma base específica, diga nas instruções que a coleção é a fonte preferencial e que a assistente deve avisar quando não encontrar informação suficiente. Escolha a estratégia de busca conforme o tipo de conversa: `Plain` funciona bem para perguntas diretas; `Concatenate` ajuda quando a pergunta depende das últimas mensagens do usuário; `UserRewrite` e `FullRewrite` são melhores quando o usuário faz perguntas fragmentadas ou anafóricas, como “e nesse caso?”; `QueryFunction` é útil quando o modelo deve decidir se precisa pesquisar ou não antes de responder.

Para ferramentas, habilite apenas as que têm um papel claro. Ferramentas embutidas resolvem tarefas comuns como pesquisa web, abertura de URL, execução de código, geração de imagens, documentos e páginas. MCP externo é melhor quando você já tem um servidor MCP com ferramentas de negócio. Funções de protocolo são úteis quando você quer expor callbacks HTTP específicos para o modelo sem instalar um servidor MCP completo. Quando o modelo não chama ferramentas de forma confiável, configure um tool handler; quando ele chama ferramentas demais, torne as descrições mais restritivas e remova ferramentas redundantes.

Para observabilidade e controle, use workers quando precisar de uma decisão externa em tempo de execução. Um worker pode bloquear uma mensagem, enriquecer contexto, substituir uma chamada de ferramenta ou registrar uma ação em um sistema próprio. Como o worker é chamado durante o fluxo de inferência, ele deve responder rápido e de forma determinística. Use workers para regras que precisam consultar sistemas externos ou políticas atualizadas; use instruções de sistema para regras estáveis que o modelo só precisa seguir.

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

Este MCP compartilha os [limites de taxa de inferência](/docs/pt-br/limits) para evitar abusos e garantir a estabilidade do serviço. Se os limites de taxa forem excedidos, a ferramenta retornará um erro indicando que o limite foi atingido.
