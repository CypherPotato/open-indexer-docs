# Ferramentas embutidas

A AIVAX fornece uma lista de ferramentas embutidas para você habilitar em seu modelo. Essas ferramentas podem ser usadas em conjunto com as [funções do lado do servidor](/docs/tools/protocol-functions).

Algumas funções possuem custo. Esse custo é aplicado em modelos usados pela AIVAX e os que você fornece através do BYOK (bring-your-own-key), portanto, é importante adicionar saldo se você pretende usar essas ferramentas.

Note que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer as regras de chamadas.

## Como escolher e combinar ferramentas

Ferramentas embutidas devem ser habilitadas como capacidades de trabalho, não como decoração do agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando deve usá-la, montar argumentos válidos, aguardar o resultado e continuar a resposta. Quanto mais ferramentas parecidas estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha ruim. Comece com o menor conjunto que resolve o caso de uso e escreva instruções claras sobre quando usar cada uma.

Use `WebSearch` quando a resposta depende de informação pública, recente ou variável. Use `OpenUrl` quando o usuário já forneceu uma URL e quer que a assistente analise aquele conteúdo específico. Use `AdvancedWebUsage` quando a tarefa exige navegação, interação ou páginas que não podem ser resolvidas por uma simples busca. Use `Code` para cálculo, transformação de dados e raciocínio algorítmico pequeno. Use `Request` quando o modelo precisa chamar uma API HTTP com método, cabeçalhos ou corpo customizado. Use `Remember` e `Calendar` apenas em chat clients ou chamadas com usuário identificável, porque essas ferramentas dependem de contexto persistente por usuário.

Ferramentas de geração, como imagem, documento e página web, devem ser tratadas como ações de saída. Elas não servem apenas para “responder melhor”; elas criam artefatos hospedados ou anexados à conversa. Por isso, instrua o modelo sobre quando gerar um artefato e quando responder em texto. Em atendimento, por exemplo, gerar documento pode ser útil para um orçamento, proposta ou resumo formal; gerar página web pode ser útil para relatório visual; gerar imagem pode ser útil para ideação criativa. Se o usuário só pediu uma explicação, normalmente texto é suficiente.

Quando ferramentas estão disponíveis via `builtin_tools` em uma chamada direta, a aplicação que faz a requisição decide a lista a cada inferência. Quando estão configuradas no AI Gateway, a lista fica centralizada e pode ser combinada com skills, workers, MCP e funções de protocolo. Em produção, prefira gateway para políticas permanentes, porque isso evita que diferentes clientes habilitem ferramentas diferentes sem controle. Use chamada direta para testes, rotinas internas e fluxos em que a aplicação realmente precisa escolher ferramentas dinamicamente.

## Pesquisa na internet

Essa função habilita a pesquisa na internet no seu modelo. Com isso, o modelo pode consultar por informações específicas ou em tempo real, como dados meteorológicos, notícias, resultados de jogos, etc.

A pesquisa na internet é feita por vários provedores, escolhido conforme disponibilidade de rede e latência. A AIVAX utiliza uma mistura de provedores para realizar pesquisas na internet.

A AIVAX fornece dois tipos de pesquisa configuráveis pelo seu dashboard:

- **Full**: a pesquisa realizada é completa, inserindo no contexto da conversa o conteúdo inteiro de cada resultado encontrado.
- **Summarized**: a pesquisa realizada é resumida, inserindo no contexto da conversa um resumo feito por IA pelo próprio provedor de pesquisa.

O custo dos dois modos é de **$5** à cada **1.000** pesquisas realizadas. O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode proporcionar resultados mais precisos.

> [!NOTE] 
>
> **Importante:** nem sempre a pesquisa `Full` está disponível.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "WebSearch"
    ],
    "options": {
        // maximum number of results returned by web search operations.
        "web_search_max_results": 10, // between 1-25

        // level of detail returned by web search operations.
        "web_search_mode": "full" // full, summarized
    }
}
```

## Diagnóstico de ferramentas

Quando uma ferramenta não é chamada, primeiro confirme se ela está habilitada no gateway ou no campo `builtin_tools` da requisição. Depois, verifique se o modelo escolhido suporta chamadas de função ou se existe um tool handler configurado para modelos sem suporte nativo. Em seguida, revise a instrução: se ela não diz quando pesquisar, abrir URL, gerar imagem ou consultar memória, o modelo pode responder apenas com conhecimento próprio. Por fim, teste uma pergunta direta que obviamente exige a ferramenta, como pedir uma notícia recente para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

Quando uma ferramenta é chamada demais, reduza ambiguidade. Ferramentas como `WebSearch` e `XPostsSearch` competem por informação recente; `OpenUrl` e `Request` podem parecer parecidas quando o usuário envia um link; `Remember` e `Calendar` podem se sobrepor quando o usuário fala de preferências e datas. Remova ferramentas que não são necessárias, deixe descrições mais restritivas nas instruções do gateway e, quando possível, use workers para bloquear ou substituir chamadas em cenários específicos.

Quando uma ferramenta falha, trate como parte normal da experiência. Buscas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, geração de imagem pode recusar conteúdo e execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação de forma objetiva e oferecer o próximo passo, como pedir outro link, tentar uma consulta mais específica, solicitar autorização ou responder com base apenas no contexto disponível. Não dependa de uma ferramenta externa como única forma de concluir uma conversa crítica sem fallback de experiência.

## Pesquisa avançada na internet

Essa função permite que o modelo tenha um navegador da internet e consiga realizar automação, como pesquisas, navegar em sites, preencher formulários e clicar em botões.

No momento não há parametrização dessa função.

O custo dessa função é de **$2** por hora de automação, tendo também uma quantia fixa de **$11,10** à cada **1.000** chamadas dessa função.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "AdvancedWebUsage"
    ],
    "options": {
    }
}
```

## Execução de código

Essa função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com isso, o modelo consegue avaliar através de algoritmos resultados de expressões matemáticas e outras situações que são melhores representadas através de código.

O código é executado em um ambiente protegido com pouquíssimas funções disponíveis. O modelo não conseguirá acessar I/O, acesso à internet ou importar scripts por essa ferramenta.

Essa função não tem custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "Code"
    ],
    "options": {
    }
}
```

## Contexto de URL

Essa função permite que o modelo acesse conteúdo externo em URLs e links providos pelo usuário. Com essa função, o modelo consegue acessar links e avaliar seu conteúdo.

Note que, alguns destinos podem identificar o acesso como bot e barrar o acesso, desde que essa função não é um crawling e sim um simples GET feito no destino.

O modelo consegue acessar até 5 links de uma vez. Somente os primeiros 10MB dos links são lidos. Ao obter o conteúdo do link, o sistema verifica o conteúdo de retorno e lida com eles de acordo com cada tipo:

- Conteúdos de HTML são renderizados: as tags HTML, scripts, CSS e "ruídos" são removidos do resultado do acesso, mantendo somente o texto puro do link.
- Outros conteúdos textuais: o conteúdo é lido diretamente e nenhuma transformação é realizada.
- Conteúdos não textuais: quando o link responde com um conteúdo não textual e a resposta indica um nome de arquivo (seja pelo caminho ou pelo cabeçalho `Content-Disposition`), o sistema tenta converter o arquivo baixado para uma versão textual.

Essa função não tem custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "OpenUrl"
    ],
    "options": {
    }
}
```

## Memória

Essa função permite que o modelo armazene conteúdo relevante para ser usado por várias conversas.

> No momento, essa função só está disponível quando usada em [chat clients](/docs/features/chat-clients) e quando a sessão está identificada por uma `tag`.

Através da `tag` da sessão, o modelo armazena um dado relevante da conversa, como preferência de nomes, lembretes ou ações que a assistente deve realizar.

A instrução dessa memória instrui o modelo à não salvar dados sensíveis ou pessoais, no entanto, não é garantido que o modelo sempre irá seguir essa regra.

Os dados são armazenados por um ano nos bancos de dados da AIVAX e podem ser excluídos à qualquer momento pela plataforma. Para toda conversa por um chat client, esses dados são obtidos e anexados na conversa.

> Nota: em requisições de chat/completions, a `tag` é especificada no parâmetro `$.user`.

Essa função não tem custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ],
    "options": {
        // indicates whether all memory contexts should be included in the system instructions.
        "include_all_memory_context": true
    }
}
```

## Geração de imagens

Essa função permite que o modelo crie imagens de IA.

As imagens geradas por IA são anexadas no contexto da conversa, mas não são visíveis diretamente para a assistente.

Essa função possui custo. O custo varia de cada modelo de geração de imagem usado. A geração de imagens ocorre em um provedor externo, o que o custo pode mudar conforme vários fatores.

Você também pode ativar a geração de imagens explícitas e adultas na geração de imagem. Ao ativar esse recurso, o modelo será permitido gerar material adulto. Para isso ocorrer, o modelo também deve "concordar" em gerar esse conteúdo. Certos modelos possuem um filtro de segurança menor que outros. Por exemplo, os modelos Gemini são os com o menor filtro de segurança, sendo uma opção viável para role-play e geração desse tipo de material.

Você é sempre responsável pelo [material que gera](/docs/legal/terms-of-service.md) e o material gerado deve ser compatível com nossos termos de serviço.

Os modelos de geração de imagens disponíveis são:
- `grok-imagine-pro`
- `grok-imagine`
- `seedream-5-lite`
- `seedream-4-5-pro`
- `seedream-4`
- `nanobanana-2`
- `nanobanana-pro`
- `nanobanana`
- `gpt-image-1.5`
- `gpt-image-1-mini`
- `flux-2-klein`
- `flux-schnell`
- `zimage-turbo`

Imagens geradas são armazenadas nos servidores da AIVAX por alguns meses antes de serem permanentemente removidas.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        // sets the generation model to use for image generation.
        "image_generation_model_name": "grok-imagine",

        // indicates whether image generation is allowed to use references (e.g. images from the web or user uploads) as input.
        "image_generation_allow_reference_usage": true,

        // deprecated. sets the quality level for generated images.
        "image_generation_quality": "low|medium|high|highest",

        // sets the maximum number of images that can be generated in a single request.
        "image_generation_max_results": 2, // 1-4

        // indicates whether image generation is allowed to produce mature content.
        "image_generation_allow_mature_content": false
    }
}
```

## Pesquisa de posts no X

Essa função permite o modelo pesquisar por posts no X (antigo Twitter).

É uma alternativa direta ao `web_search`, pois pode ser usada para procurar por informações atualizadas em tempo real, como notícias, informações, resultados de jogos, etc. Essa ferramenta traz resultados muito mais recentes que a ferramenta de pesquisa na internet convencional.

Não é recomendado usar as duas funções em conjunto pois elas possuem o mesmo objetivo.

No momento, os últimos 20 posts de um determinado assunto é inserido no contexto da conversa, contendo link e autor.

No momento, não é possível acessar posts de perfis específicos.

O custo dessa função é de **$5** à cada **1.000** pesquisas realizadas.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "XPostsSearch"
    ],
    "options": {
    }
}
```

## Geração de documentos

Essa função permite que o modelo possa criar PDFs a partir de textos em HTML.

Os arquivos criados são hospedados nos servidores da AIVAX e disponibilizados pelo assistente.

O conteúdo é hospedado por alguns meses antes de ser permanentemente excluído.

Essa função não tem custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "GenerateDocument"
    ],
    "options": {
    }
}
```

## Geração de páginas da web

Essa função permite que o modelo possa hospedar páginas HTML em servidores da AIVAX.

Isso permite que o modelo possa hospedar relatórios, landing-pages e outros infográficos em HTML.

O conteúdo é hospedado por alguns meses antes de ser permanentemente excluído.

Essa função não tem custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "GenerateWebPage"
    ],
    "options": {
    }
}
```

## Requisição avançada

Essa função fornece uma ferramenta de requisições HTTP avançada ao modelo. Com essa função, o modelo consegue definir cabeçalhos, formulários, conteúdos e métodos para realizar requisições HTTP avançadas.

Respostas grandes são automaticamente truncadas e renderizadas no lado do servidor (renderiza HTML, Markdown, etc.).

Essa função não possui custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "Request"
    ],
    "options": {
    }
}
```

## Calendário

Uma função estática quase idêntica à função de memória, com os mesmos parâmetros de armazenamento, mas otimizada para armazenar memória em datas e não como itens soltos.

Não é recomendado ativar essa função junto com a função de memória ou funções de agendamento de mensagens do chat client.

Essa função não possui custo.

Ativação por `builtin_tools`:

```json
{
    "tools": [
        "Calendar"
    ],
    "options": {
    }
}
```
