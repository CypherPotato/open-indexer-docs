# Pipelines de IA

Os pipelines do Gateway de IA são as etapas de processamento que a AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar entrada, direcionar modelos, truncar conversas e chamar workers externos.

A maioria dos pipelines é configurada nos parâmetros do gateway. Opções ao nível de requisição podem sobrescrever alguns parâmetros de inferência em chamadas diretas de `chat/completions`.

## RAG

RAG vincula [collections](/docs/pt-br/rag/collections) a um Gateway de IA. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reranker.
- Se referências de fragmentos são incluídas.
- Estratégia de consulta.

Quando um gateway tem coleções de conhecimento e a última mensagem do usuário contém texto, a AIVAX pode recuperar documentos correspondentes antes da chamada ao modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário como um bloco interno de contexto RAG. Se uma coleção vinculada tem seu próprio texto de contexto, esse contexto de coleção é adicionado às instruções do sistema.

Estratégias de consulta:

- `Plain`: Usa a última mensagem do usuário como a consulta de busca.
- `Concatenate`: Junta o número configurado mais recente de mensagens do usuário linha a linha e busca com o texto combinado.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente em uma ou mais consultas de busca usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando buscar nas coleções vinculadas, e os resultados da busca são retornados como respostas de ferramenta.

Estratégias de reescrita adicionam custo e latência do modelo resolvedor. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como "e quanto a este caso?", pois o resolvedor pode transformar a conversa recente em uma consulta de busca mais clara.

Definir muitos resultados RAG aumenta o uso de tokens de entrada e pode aumentar o custo final da inferência. Comece com uma contagem pequena de resultados e aumente somente quando o modelo não tem evidência suficiente.

## Instruções

Configurações de instruções moldam o prompt voltado ao provedor:

- **Instruções de sistema**: Adicionadas ao conjunto de instruções do sistema.
- **Fontes remotas de instruções de sistema**: Obtidas a partir de URLs configuradas e adicionadas ao conjunto de instruções do sistema.
- **Modelo de prompt do usuário**: Substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá-lo ao modelo.
- **Preenchimento do assistente**: Adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta preenchimento.

Fontes remotas de instruções são obtidas como texto com tamanho máximo de resposta de 10 MB. Sua duração de cache é configurável; o padrão é 600 segundos.

Alguns modelos não suportam preenchimento do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação integrada de modelo rejeita configurações incompatíveis do gateway quando essas limitações são conhecidas.

## Habilidades

Habilidades são pacotes de instruções sob demanda disponíveis para o modelo. Quando um gateway habilita habilidades, a AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções internas relacionadas a habilidades.

Saiba mais sobre [skills](/docs/pt-br/features/skills).

## Pré-processamento multimodal

O pré-processamento multimodal converte o conteúdo de mídia selecionado em texto antes da chamada ao modelo principal. As flags disponíveis são `Image`, `Audio`, `Video`, `File`, `OtherFiles` e `All`.

Use pré-processamento quando o modelo principal for texto‑first ou quando você quiser que a AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré‑processamento para que o modelo possa inspecioná‑la diretamente.

Descrições de mídia são armazenadas em cache por hash de conteúdo para reutilização.

## Parametrização

O pipeline de parametrização configura opções de requisição do modelo, como:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Valores ao nível de requisição podem sobrescrever valores do gateway quando o endpoint suporta o parâmetro. Alguns modelos integrados rejeitam parâmetros específicos, e provedores BYOK podem ter suas próprias restrições.

## Truncamento de contexto

O pipeline de truncamento de contexto usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` está definido e a conversa excede o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro em vez de chamar o modelo.
- `Truncate`: Remove mensagens não‑sistema mais antigas até que a conversa caiba.

O truncamento preserva mensagens de sistema e mantém pelo menos uma mensagem do usuário quando possível. Se a mensagem do usuário restante ainda exceder o limite, a requisição falha com um erro de tamanho de mensagem.

No plano gratuito, o contexto de entrada efetivo é limitado a 65 536 tokens mesmo quando um contexto maior está configurado.

## Truncamento de mensagens de ferramenta

`ToolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido para um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isso pode reduzir o uso de contexto em conversas agentes longas. Também pode prejudicar cadeias onde um resultado antigo de ferramenta permanece importante, portanto use apenas quando o modelo puder chamar a ferramenta novamente com segurança.

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pela AIVAX durante a inferência. Elas podem vir de:

- Ferramentas internas.
- Funções de protocolo.
- Fontes remotas de funções de protocolo.
- Fontes MCP.
- RAG QueryFunction.
- Habilidades.
- Ambiente bash opcional.

Eventos de ferramentas do lado do servidor podem ser transmitidos aos clientes como atualizações `servertool`.

## Ferramentas internas

Ferramentas internas podem ser configuradas em um gateway ou fornecidas por requisição com `builtin_tools`. As flags de ferramentas internas disponíveis incluem:

- `WebSearch`
- `AdvancedWebUsage`
- `OpenUrl`
- `Code`
- `Request`
- `Calendar`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Ferramentas internas](/docs/pt-br/tools/builtin-tools).

## MCP e funções de protocolo

Fontes MCP são convertidas em funções internas listando as ferramentas MCP remotas e envolvendo seus esquemas como funções chamáveis pelo modelo. Resultados de ferramentas MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportado.

Funções de protocolo expõem callbacks HTTP ou URLs de callback da AIVAX como ferramentas chamáveis pelo modelo. Fontes remotas de funções de protocolo são obtidas e armazenadas em cache, depois convertidas em funções internas.

Veja [Funções de protocolo](/docs/pt-br/tools/protocol-functions) e [MCP](/docs/pt-br/tools/mcp).

## Interpretador de funções

Um manipulador de ferramenta pode adicionar comportamento de chamada de ferramenta para modelos que não produzem chamadas nativas de ferramenta de forma confiável. Neste checkout, os valores configurados ativos são:

- `native` ou `null`: Usa chamada de ferramenta nativa do modelo.
- `react.v1.selfcall`: Usa o manipulador de auto‑chamada estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falha no tempo de inferência.

## Moderação

A moderação executa um modelo resolvedor sobre a conversa e pontua categorias para violência, conteúdo sexualmente explícito, conteúdo político, conteúdo perigoso e tentativas de jailbreak. Se os limites configurados forem excedidos, a AIVAX marca as mensagens originais da conversa como não encaminhadas e pede ao modelo que responda que não pode interagir com esse conteúdo.

Use moderação para política de segurança ampla. Use workers quando a decisão depende de identidade externa, estado da conta ou política específica de negócio.

## Workers

Workers são hooks HTTP externos chamados durante a execução do gateway. Eles podem parar um evento, deixá‑lo continuar, reescrever o contexto da mensagem, adicionar ferramentas, adicionar instruções de sistema ou substituir um resultado de ferramenta do lado do servidor.

Saiba mais sobre [AI Workers](/docs/pt-br/inference/workers).