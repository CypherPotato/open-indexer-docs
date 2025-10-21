# Ferramentas embutidas

A AIVAX fornece uma lista de ferramentas embutidas para você habilitar em seu modelo. Essas ferramentas podem ser usadas em conjunto com as [funções do lado do servidor](/docs/protocol-functions).

Algumas funções possuem custo. Esse custo é aplicado em modelos usados pela AIVAX e os que você fornece através do BYOK (bring-your-own-key), portanto, é importante adicionar saldo se você pretende usar essas ferramentas.

Note que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer as regras de chamadas.

## Pesquisa na internet

Essa função habilita a pesquisa na internet no seu modelo. Com isso, o modelo pode consultar por informações específicas ou em tempo real, como dados meteorológicos, notícias, resultados de jogos, etc.

A pesquisa na internet é feita por vários provedores, escolhido conforme disponibilidade de rede e latência. Os provedores atuais usados pela AIVAX é [linkup](https://www.linkup.so/) e [Exa](https://exa.ai/).

A AIVAX fornece dois tipos de pesquisa configuráveis pelo seu dashboard:

- **Full**: a pesquisa realizada é completa, inserindo no contexto da conversa o conteúdo inteiro de cada resultado encontrado.
- **Summarized**: a pesquisa realizada é resumida, inserindo no contexto da conversa um resumo feito por IA pelo próprio provedor de pesquisa.

O custo dos dois modos é de **$5** à cada **1.000** pesquisas realizadas. O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode proporcionar resultados mais precisos.

## Pesquisa avançada na internet

Essa função permite que o modelo tenha um navegador da internet e consiga realizar automação, como pesquisas, navegar em sites, preencher formulários e clicar em botões.

No momento não há parametrização dessa função.

O custo dessa função é de **$2** por hora de automação, tendo também uma quantia fixa de **$11,10** à cada **1.000** chamadas dessa função.

## Execução de código

Essa função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com isso, o modelo consegue avaliar através de algoritmos resultados de expressões matemáticas e outras situações que são melhores representadas através de código.

O código é executado em um ambiente protegido com pouquíssimas funções disponíveis. O modelo não conseguirá acessar I/O, acesso à internet ou importar scripts por essa ferramenta.

Essa função não tem custo.

## Contexto de URL

Essa função permite que o modelo acesse conteúdo externo em URLs e links providos pelo usuário. Com essa função, o modelo consegue acessar links e avaliar seu conteúdo.

Note que, alguns destinos podem identificar o acesso como bot e barrar o acesso, desde que essa função não é um crawling e sim um simples GET feito no destino.

O modelo consegue acessar até 5 links de uma vez. Somente os primeiros 10MB dos links são lidos. Ao obter o conteúdo do link, o sistema verifica o conteúdo de retorno e lida com eles de acordo com cada tipo:

- Conteúdos de HTML são renderizados: as tags HTML, scripts, CSS e "ruídos" são removidos do resultado do acesso, mantendo somente o texto puro do link.
- Outros conteúdos textuais: o conteúdo é lido diretamente e nenhuma transformação é realizada.
- Conteúdos não textuais: quando o link responde com um conteúdo não textual e a resposta indica um nome de arquivo (seja pelo caminho ou pelo cabeçalho `Content-Disposition`), o sistema tenta converter o arquivo baixado para uma versão textual.

Essa função não tem custo.

## Memória

Essa função permite que o modelo armazene conteúdo relevante para ser usado por várias conversas.

> No momento, essa função só está disponível quando usada em [chat clients](/docs/entities/chat-clients) e quando a sessão está identificada por uma `tag`.

Através da `tag` da sessão, o modelo armazena um dado relevante da conversa, como preferência de nomes, lembretes ou ações que a assistente deve realizar.

A instrução dessa memória instrui o modelo à não salvar dados sensíveis ou pessoais, no entanto, não é garantido que o modelo sempre irá seguir essa regra.

Os dados são armazenados por um ano nos bancos de dados da AIVAX e podem ser excluídos à qualquer momento pela plataforma. Para toda conversa por um chat client, esses dados são obtidos e anexados na conversa.

Essa função não tem custo.

## Geração de imagens

Essa função permite que o modelo crie imagens de IA.

As imagens geradas por IA são anexadas no contexto da conversa, mas não são visíveis diretamente para a assistente.

Atualmente, existem quatro categorias de imagens geradas:

![Image quality](/assets/img/imgquality.png)

- **Qualidade baixa**: gera imagens rapidamente com um custo baixo, no entanto, pode gerar bastante artefato, como dedos à mais, olhos distorcidos, braços fora do lugar.
- **Qualidade média**: equilíbrio entre boa qualidade e velocidade, mas ainda pode gerar artefatos.
- **Qualidade alta**: maior qualidade nas imagens e menor chance de existir artefatos na imagem.
- **Qualidade altíssima**: a maior qualidade na geração de imagens. Após a geração, um modelo de upscaling realiza o reajuste na imagem criada.

Essa função possui custo. O custo varia do tempo de processamento de cada imagem, o que é interferido com o consumo do processamento, tamanho da fila de processamento, modelos usados, etc. A geração de imagens ocorre em um provedor externo, o que o custo pode mudar conforme vários fatores.

A imagem de exemplo acima mostra uma previsão do preço de cada qualidade de imagem.

Você também pode ativar a geração de imagens explícitas e adultas na geração de imagem. Ao ativar esse recurso, o modelo será permitido gerar material adulto. Para isso ocorrer, o modelo também deve "concordar" em gerar esse conteúdo. Certos modelos possuem um filtro de segurança menor que outros. Por exemplo, os modelos Gemini são os com o menor filtro de segurança, sendo uma opção viável para role-play e geração desse tipo de material.

Você é sempre responsável pelo [material que gera](/docs/legal/terms-of-service.md) e o material gerado deve ser compatível com nossos termos de serviço.

Imagens geradas são armazenadas nos servidores da AIVAX por alguns meses antes de serem permanentemente removidas.

## Pesquisa de posts no X

Essa função permite o modelo pesquisar por posts no X (antigo Twitter).

É uma alternativa direta ao `web_search`, pois pode ser usada para procurar por informações atualizadas em tempo real, como notícias, informações, resultados de jogos, etc. Essa ferramenta traz resultados muito mais recentes que a ferramenta de pesquisa na internet convencional.

Não é recomendado usar as duas funções em conjunto pois elas possuem o mesmo objetivo.

No momento, os últimos 20 posts de um determinado assunto é inserido no contexto da conversa, contendo link e autor.

No momento, não é possível acessar posts de perfis específicos.

O custo dessa função é de **$5** à cada **1.000** pesquisas realizadas.

## Geração de documentos

Essa função permite que o modelo possa criar PDFs a partir de textos em HTML.

Os arquivos criados são hospedados nos servidores da AIVAX e disponibilizados pelo assistente.

O conteúdo é hospedado por alguns meses antes de ser permanentemente excluído.

Essa função não tem custo.

## Geração de páginas da web

Essa função permite que o modelo possa hospedar páginas HTML em servidores da AIVAX.

Isso permite que o modelo possa hospedar relatórios, landing-pages e outros infográficos em HTML.

O conteúdo é hospedado por alguns meses antes de ser permanentemente excluído.

Essa função não tem custo.