# Agentes Sentinel

Os agentes de chat Sentinel são modelos com parâmetros otimizados para conversação de chat em tempo real, com instruções que aprimoram a atenção do modelo para determinadas tarefas e permite o uso de pesquisação na internet em tempo real.

Esses modelos são constantemente atualizados para utilizar as últimas tecnologias e recursos disponíveis por IA generativas, portanto, os modelos internos usados pelos modelos Sentinel podem ser constantemente atualizados.

Atualmente, os modelos Sentinel estão disponíveis em três categorias:

- **sentinel**: sempre usa um modelo altamente inteligente, com recursos de pensamento profundo, para responder as perguntas do usuário. Recomendado para conversas que exijam raciocínio sobre situações complexas e com detalhes que precisam ser levados em conta.
- **sentinel-mini**: usa um modelo com pensamento profundo, mas configurado para pensar menos que o `/sentinel`, para manter um equilíbrio entre inteligência e resolução de tarefas complexas.
- **sentinel-core**: não possui pensamento profundo, mas possui os demais recursos de conversação, pesquisa na internet e entendimento avançado do problema do usuário.

Sempre que um modelo Sentinel for ter seu preço alterado, uma notificação é enviada para todos os usuários que utilizam o modelo e uma notificação é adicionada na página de notificações.

Estes modelos devem ser utilizados para conversação com o usuário final e não são recomendados para demais tarefas como uso de funções, respostas estruturadas e etc.

## Principais recursos

O diferencial dos modelos Sentinel são os recursos providos "out-of-the-box" por ele, dentre eles:

- **Otimizado para chat**: os modelos Sentinel possuem instruções claras que faz o modelo adaptar o tom de conversa ao mesmo do usuário, indicativos de humor e objetivo.
- **Pesquisa na internet**: os modelos Sentinel conseguem naturalmente pesquisar na internet para complementar sua resposta em diferentes cenários, como obter notícias locais, dados meteorológicos ou dados sobre um assunto ou nicho específico.
- **Acessar links**: os modelos Sentinel conseguem acessar arquivos e páginas fornecidas pelo usuário. Ele consegue acessar páginas HTML, vários arquivos textuais, até mesmo documentos do Word e PDF.
- **Execução de código**: os modelos Sentinel conseguem executar código para realizarem cálculos matemáticos, financeiros ou até mesmo ajudar o usuário com diversas tarefas.
- **Memória persistente**: os modelos Sentinel conseguem identificar fatos relevantes ao usuário que devem ser persistidos durante várias conversas, até mesmo após a conversa atual ser limpada ou renovada.

Além disso, todos os modelos Sentinel possuem uma cadeia de execução das funções. Por exemplo, você pode pedir para um modelo Sentinel acessar a temperatura de uma cidade, converter para JSON e chamar uma URL externa com a resposta.

## Sentinel Router

Você também pode usar o modelo de roteamento **sentinel-router** que funciona como um modelo de roteador entre os três modelos. Um roteador automaticamente escolhe qual o melhor modelo para resolver o problema do usuário de acordo com a complexidade de seu problema.

Como funciona? Um modelo menor analisa o contexto da pergunta e avalia o grau de complexidade que o usuário está enfrentando, e esse modelo responde com o indicador de qual modelo é melhor para responder aquela pergunta. O roteador decide qual é o melhor modelo por mensagem e não por conversa.

Um modelo de roteador pode ajudar à reduzir custos e manter a qualidade da conversação, usando recursos de pensamento profundo somente quando necessário.