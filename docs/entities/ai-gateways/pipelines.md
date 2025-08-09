# Pipelines de IA

A AIVAX fornece vários pipelines para usar em seu gateway de IA.

Você pode usar vários pipelines para executarem no contexto do seu gateway.

## RAG

Através de [coleções](/docs/entities/collections), você pode vincular uma coleção de documentos para seu gateway de IA. Você pode definir os parâmetros de incorporação, como quantidade de documentos, pontuação mínima e estratégia de incorporação.

Cada estratégia de incorporação é mais refinada que a outra. Algumas criam resultados melhores que as demais, mas é importante realizar testes práticos com várias estratégias para entender qual se ajusta melhor no modelo, conversa e tom do usuário.

Talvez seja necessário realizar ajustes no prompt do sistema para informar melhor como a IA deverá considerar os documentos anexados na conversa. Os documentos são anexados como uma mensagem do usuário, limitados aos parâmetros que você define na estratégia de obtenção.

Estratégias com reescrita normalmente geram os melhores resultados à um baixo custo de latência e custo. O modelo de reescrita usado sempre o com menor custo, escolhido normalmente por um pool interno que decide o modelo que está com menor latência no momento.

Estratégias sem custo de reescrita:

- `Plain`: a estratégia padrão. É a menos otimizada e não possui custo de reescrita: a última mensagem do usuário é usada como termo de busca para pesquisar na coleção anexada do gateway.
- `Concatenate`: Concatena em linhas as últimas N mensagens do usuário, e então o resultado da concatenação é usada como termo de busca.

Estratégias com custo de reescrita (os tokens de inferência são cobrados):

- `UserRewrite`: reescreve as últimas N mensagens do usuário usando um modelo menor, criando uma pergunta contextualizada no que o usuário quer dizer.
- `FullRewrite`: reescreve as últimas N*2 mensagens do chat usando um modelo menor. Similar ao `UserRewrite`, mas considera também as mensagens da assistente na formulação da nova pergunta. Geralmente cria as melhores perguntas, com um custo um pouco maior. É a estratégia mais estável e consistente. Funciona com qualquer modelo.

Estratégias de função:

- `QueryFunction`: fornece uma função de pesquisa na coleção integrada para o modelo de IA. Você deverá ajustar nas instruções do sistema os cenários ideais para o modelo chamar essa função quando necessário. Pode não funcionar tão bem em modelos menores.

Ao definir uma coleção de RAG no pipeline de seu gateway, a primeira mensagem do contexto da conversa será o resultado da incorporação do RAG como uma mensagem do usuário (exceto para quando usado como ferramentas onde o resultado da incorporação é anexado como uma resposta de ferramenta).

Definir muitos documentos de resposta do RAG aumenta o consumo de tokens de entrada e pode aumentar o preço final da inferência.

## Fixando instruções

O pipeline de instruções permite prefixar instruções em diversos lugares do modelo, guiando e restrigindo o formato de resposta do modelo.

As formas atuais de definir instruções são:
- **Instruções do sistema**: insire um texto fixo no prompt de sistema do contexto.
- **Template de prompt do usuário**: reformata a pergunta do usuário para seguir um formato específico de pergunta.
- **Inicialização de assistente (prefill)**: inicializa a mensagem da assistente com tokens iniciais de geração.

Esses parâmetros podem ser muito úteis para prompt engineering, no entanto, podem não ser compatível com todos os modelos.

Atenção: prefixando instruções, templates e inicializações podem remover a capacidade de raciocínio, interpretação multi-modalidades e chamadas de ferramentas do modelo.

## Parametrização

O pipeline de parametrização configura os hiper-parâmetros iniciais da inferência, como temperatura, nucleus sampling, presence penalty e demais hiperparâmetros de inferência.

## Truncating

O pipeline de truncating permite definir o tamanho de uma conversa em tokens antes dela ser recortada.

Quando esse pipeline está ativado, antes de toda inferência, é calculado se `num_of_chars / 4` é maior que o máximo de tokens de entrada da conversa. Se o contexto for maior, o pipeline começa a remover mensagens do começo da conversa até que as mensagens caibam no contexto especificado.

Ao menos uma mensagem do usuário (comumente a última mensagem) é mantida na conversa. Todas as demais mensagens são removidas, exceto as instruções do sistema.

Alternativamente, você pode definir que ao atingir o limite um erro é disparado na API ao invés de recortar o contexto.

## Tool message truncating

O pipeline de contagem de mensagens de ferramentas é similar ao de truncating: ele remove a resposta de ferramentas mais antigas e preserva somente as mais novas.

Isso pode ser útil para quando respostas de ferramentas anteriores não sejam mais úteis em mensagens mais recentes e ocupam espaço no contexto, mas pode ser prejudicial ao usar com modelos agênticos que chamam ferramentas em cadeia.

Esse pipeline é configurado em quantidade de mensagens de ferramentas à serem preservadas ao invés de tokens. Quando uma mensagem de ferramenta é considerada antiga, ela não é removida, mas tem seu conteúdo removido.

## Ferramentas do lado do servidor

Esse pipeline permite a execução de ferramentas do lado do servidor da AIVAX, similar ao protocolo MCP.

Leia mais sobre esse pipeline [aqui](/docs/protocol-functions).

## Ferramentas embutidas

Você pode adicionar ferramentas providas pela AIVAX em seu gateway, como pesquisa na internet, geração de imagens e acesso de links. Consulte todas as ferramentas disponíveis [aqui](/docs/builtin-tools).

## Workers

Workers definem o comportamento do seu gateway remotamente, usado para controlar quando certos eventos devem ser abortados ou continuados.

Leia mais sobre esse pipeline [aqui](/docs/entities/ai-gateways/workers).