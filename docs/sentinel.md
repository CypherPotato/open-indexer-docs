# Agentes Sentinel

Os agentes de chat Sentinel são modelos com parâmetros otimizados para conversação de chat em tempo real, com instruções que aprimoram a atenção do modelo para determinadas tarefas e permite o uso de pesquisação na internet em tempo real.

Esses modelos são constantemente atualizados para utilizar as últimas tecnologias e recursos disponíveis por IA generativas, portanto, os modelos internos usados pelos modelos Sentinel podem ser constantemente atualizados.

Atualmente, os modelos Sentinel estão disponíveis em três categorias:

- **sentinel**: altamente inteligente. Faz uso do pensamento profundo do próprio modelo para complementar a resposta.
- **sentinel-mini**: inteligente e capaz para a maioria das tarefas complexas de chat.
- **sentinel-core**: modelo otimizado para custo, com menor capacidade de conversação, mas com raciocínio Sentinel.

Sempre que um modelo Sentinel for ter seu preço alterado, uma notificação é enviada para todos os usuários que utilizam o modelo e uma notificação é adicionada na página de notificações.

Estes modelos devem ser utilizados para conversação com o usuário final e não são recomendados para demais tarefas como uso de funções, respostas estruturadas e etc.

## Principais recursos

O diferencial dos modelos Sentinel são os recursos providos "out-of-the-box" por ele, dentre eles:

- **Otimizado para chat**: os modelos Sentinel possuem instruções claras que faz o modelo adaptar o tom de conversa ao mesmo do usuário, indicativos de humor e objetivo.
- **Raciocínio**: todos os modelos Sentinel possuem um mecanismo pensamento profundo personalizado, otimizado para raciocinar com base em suas funções fornecidas, inclusive [funções de protocolo](/docs/protocol-functions), para fornecer uma resposta detalhada ao usuário.
- **Pesquisa na internet**: os modelos Sentinel conseguem naturalmente pesquisar na internet para complementar sua resposta em diferentes cenários, como obter notícias locais, dados meteorológicos ou dados sobre um assunto ou nicho específico.
- **Acessar links**: os modelos Sentinel conseguem acessar arquivos e páginas fornecidas pelo usuário. Ele consegue acessar páginas HTML, vários arquivos textuais, até mesmo documentos do Word e PDF.
- **Execução de código**: os modelos Sentinel conseguem executar código para realizarem cálculos matemáticos, financeiros ou até mesmo ajudar o usuário com diversas tarefas.
- **Memória persistente**: os modelos Sentinel conseguem identificar fatos relevantes ao usuário que devem ser persistidos durante várias conversas, até mesmo após a conversa atual ser limpada ou renovada.

Além disso, todos os modelos Sentinel possuem uma cadeia de execução das funções. Por exemplo, você pode pedir para um modelo Sentinel acessar a temperatura de uma cidade, converter para JSON e chamar uma URL externa com a resposta.

> [!NOTE]
>
> Importante: o contexto do Sentinel inclui uma descrição detalhada de seu comportamento e suas funções e ocupa aproximadamente **~1.300** tokens que serão anexados em todas as mensagens enviadas pelo usuário.

## Sentinel Router

Você também pode usar o modelo de roteamento **sentinel-router** que funciona como um modelo de roteador entre os modelos Sentinel. Um roteador automaticamente escolhe qual o melhor modelo para resolver o problema do usuário de acordo com a complexidade de seu problema.

Como funciona? Um modelo menor analisa o contexto da pergunta e avalia o grau de complexidade que o usuário está enfrentando, e esse modelo responde com o indicador de qual modelo é melhor para responder aquela pergunta. O roteador decide qual é o melhor modelo por mensagem e não por conversa.

Um modelo de roteador pode ajudar à reduzir custos e manter a qualidade da conversação, usando recursos de pensamento profundo somente quando necessário.

## Sentinel Lambda

O agente `sentinel-lambda` é otimizado para uso em [funções JSON](/entities/functions), sendo capaz de pesquisar na internet, executar código e acessar links, o que melhora ainda mais a precisão da execução das funções inteligentes.

## Sentinel Reasoning

O mecanismo de pensamento profundo do Sentinel é um motor de raciocínio plug-and-play que fornece todo o contexto necessário para o modelo Sentinel responder a pergunta do usuário. Durante o processo de pensamento, Sentinel chama funções, realiza cálculos e executa código, visando fornecer uma resposta elaborada e precisa para o usuário, mesmo usado com modelos menores e menos inteligentes.

A precificação do reasoning do Sentinel e os tokens do Sentinel são separadas: você perceberá que ao usar o modelo Sentinel, verá lançamentos do roteamento, raciocínio e inferência. Essa divisão é feita para fornecer transparência sobre o uso do Sentinel.

Como o raciocínio Sentinel é feito por partes, você poderá ter várias incidências de raciocínio para uma só pergunta. Isso ocorre por quê, quando o Sentinel entender que deve chamar uma função, ele irá pensar novamente quando tiver o resultado da função. A partir disso, ele pode chamar outras funções em cadeia, até ter informação suficiente para resolver o problema do usuário.

Internamente, dois modelos de pensamento são usados. Um mais completo com CoT (chain-of-thought) é usado, e outro menor é usado para sumarizar o conteúdo do pensamento. A sumarização reduz a quantia de tokens enviadas ao modelo maior para reduzir custos e manter a mesma linha de raciocínio.

O agente `sentinel` pensa muito mais que o `sentinel-mini`, o que leva o modelo à criar uma resposta mais precisa para situações complexas. Ao usar o roteador sentinel, o agente Sentinel mais inteligente é escolhido somente em situações altamente complexas e difíceis.