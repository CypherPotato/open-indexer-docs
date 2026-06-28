# Modelos

Use **Modelos** para descobrir os modelos integrados disponíveis na sua conta AIVAX e decidir se chama um modelo diretamente ou o usa como modelo base para um AI Gateway.

Esta página é para desenvolvedores que escolhem um modelo para um fluxo de trabalho de produto. Ela explica como ler o catálogo de modelos, comparar opções, abrir exemplos de integração e criar um gateway a partir de um modelo. Para a listagem de modelos ao nível de API e o comportamento de inferência direta, veja [Getting Started](/docs/pt-br/getting-started) e [Inference](/docs/pt-br/inference/inference).

## Antes de começar

Faça login no [console AIVAX](https://console.aivax.net/) e abra **Dashboard > Modelos**. Confirme que está usando a conta e o plano desejados antes de testar os modelos, pois acesso ao modelo, saldo, reservas de assinatura, limites de requisição, status do modelo e configuração do gateway podem afetar se um modelo visível pode ser usado com sucesso.

Para exemplos de API, crie ou escolha uma chave de API privada para uma integração de backend. Não use navegadores compartilhados para testar modelos e não faça commit de chaves ou URLs de playground gerados no controle de versão.

## Quando usar Modelos

Abra **Modelos** quando precisar:

- Encontrar o nome exato do modelo para usar em uma requisição compatível com OpenAI.
- Comparar velocidade, inteligência, tamanho de contexto, preço, estabilidade e capacidades do modelo.
- Verificar se um modelo está incluído no uso de reserva de assinatura.
- Escolher um modelo que suporte uma capacidade necessária, como entrada de imagem, áudio, vídeo, raciocínio, chamada de ferramenta, execução de código, busca na web ou roteamento de modelo.
- Criar um novo AI Gateway a partir de um modelo.
- Copiar código de integração inicial para Python, JavaScript ou curl.

Use uma chamada direta ao modelo para testes simples, protótipos, rotinas internas ou caminhos de código onde sua aplicação controla todas as opções de requisição. Use um [AI Gateway](/docs/pt-br/inference/ai-gateway) quando o comportamento precisar ser reutilizável, gerenciado centralmente, auditável ou compartilhado por clientes de chat, fluxos RAG, habilidades, ferramentas, workers ou múltiplas aplicações.

## Pesquisar e filtrar o catálogo

A página Modelos exibe o catálogo de modelos integrados e a contagem atual de modelos. Um modelo que aparece no catálogo não garante que todas as contas possam usá‑lo em todo fluxo de trabalho. Acesso ao plano, saldo da conta, reservas de assinatura, limites de requisição, status do modelo e configuração do gateway ainda podem afetar o comportamento em tempo de execução.

Use a caixa de pesquisa para buscar pelo nome do modelo. A pesquisa tolera espaços e pontuação, portanto buscar por um provedor ou família de modelo pode reduzir a lista mesmo quando o nome completo do modelo contém símbolos como `@`, `/`, `-` ou `:`.

Use filtros quando já souber o trade‑off desejado:

| Filtro | Use quando |
| --- | --- |
| **Velocidade** | Você precisa de menor latência para chat, suporte, roteamento, extração ou fluxos voltados ao usuário. |
| **Inteligência** | Você precisa de raciocínio mais forte, codificação, seguimento de instruções ou trabalho de longo horizonte. |
| **Preço** | Você precisa controlar o custo de saída ou comparar modelos mais baratos e mais caros. |
| **Assinatura** | Você quer identificar modelos com uso incluído nos planos de assinatura. |

Os filtros podem gerar uma lista vazia. Se isso acontecer, limpe o termo de pesquisa primeiro, depois relaxe um filtro de cada vez. Por exemplo, se nenhum modelo corresponder a um nome de provedor mais **Ultra rápido** mais **Incluído**, remova o filtro de assinatura ou escolha **Rápido**.

## Ler um cartão de modelo

Cada cartão de modelo combina sinais de produto e faturamento:

| Campo | O que significa |
| --- | --- |
| **Nome do modelo** | O valor exato usado em `model`, como `@provider/model-name`. Copie esse valor ao chamar o modelo diretamente. |
| **Descrição** | Um resumo curto dos pontos fortes pretendidos do modelo e do posicionamento do provedor. |
| **Provedor e data de lançamento** | Ajuda a distinguir famílias de modelos e entender a atualidade. |
| **Janela de contexto** | O tamanho máximo de contexto exposto para o modelo. Contexto longo ajuda com documentos grandes e prompts em escala de projeto, mas pode aumentar custo e latência. |
| **Estabilidade** | Indica se o modelo está estável, instável ou offline. |
| **Precificação** | Mostra preços de entrada, entrada em cache, entrada de áudio quando disponível e preços de saída por milhão de tokens. Alguns modelos exibem preços diferentes por nível de contexto. |
| **Velocidade** | Uma classificação relativa de velocidade, de mais lenta a ultra rápida. |
| **Inteligência** | Uma classificação relativa de capacidade, da mais baixa à mais alta. |
| **Capacidades** | Ícones para recursos suportados pelo modelo, como imagem, áudio, vídeo, busca na web, raciocínio, chamada de ferramenta, execução de código, links externos, memória, funções JSON, comportamento sem censura, roteamento de modelo ou difusão. |
| **Emblemas** | Rótulos de status importantes, como incluído na assinatura, novo, pré‑visualização, depreciado, com desconto, gratuito ou outras flags de conta/modelo quando exibidos. |

Não escolha com base em um único sinal. Um modelo barato pode se tornar caro se precisar de muitas tentativas, gerar respostas longas ou faltar uma capacidade necessária. Um modelo de alta inteligência pode ser a escolha errada para extração de alto volume se um modelo mais rápido e barato puder atender ao padrão de qualidade.

## Escolher um modelo para um fluxo de trabalho

Comece com os requisitos rígidos do fluxo de trabalho:

1. **Tipo de entrada:** texto apenas, imagem, áudio, vídeo, arquivo ou conteúdo misto.  
2. **Formato de saída:** texto simples, JSON estruturado, chamadas de ferramenta, execução de código ou mídia gerada.  
3. **Latência:** chat interativo, tarefa em segundo plano, processamento em lote ou análise de longa duração.  
4. **Tamanho do contexto:** prompt curto, histórico de conversa, documentos grandes ou contexto em escala de projeto.  
5. **Perfil de custo:** tokens de entrada esperados, tokens de saída, entrada em cache e taxa de tentativas.  
6. **Risco operacional:** uso estável em produção, teste de pré‑visualização, migração de modelo depreciado ou comportamento de roteador de modelo.

Em seguida, use os filtros do catálogo para encontrar candidatos e teste‑os com um prompt representativo pequeno. Para produção, prefira modelos estáveis que suportem diretamente as capacidades necessárias. Use modelos de pré‑visualização, depreciados, gratuitos, sem censura ou roteadores apenas quando seus trade‑offs forem intencionais e documentados para sua equipe.

Se o modelo for usado com RAG, ferramentas, habilidades, workers, clientes de chat públicos ou integrações de canal, crie um AI Gateway em vez de codificar o nome do modelo integrado em cada cliente. O gateway mantém a seleção de modelo, instruções, recuperação, ferramentas e configurações de segurança em um único lugar.

## Usar ações de modelo

Abra o menu de ações em um cartão de modelo para usar o modelo selecionado.

| Ação | O que faz |
| --- | --- |
| **Copiar nome do modelo** | Copia o identificador exato do modelo para chamadas de API diretas ou documentação. |
| **Criar gateway** | Abre um formulário para nome do gateway e cria um AI Gateway usando o modelo integrado selecionado. |
| **Abrir playground** | Abre o playground AIVAX com o modelo selecionado e o contexto da sessão atual. Use para testes rápidos no navegador antes de confirmar uma configuração. |
| **Ver código de integração** | Abre exemplos iniciais em Python, JavaScript e curl usando a variável de ambiente `AIVAX_API_KEY`. |

Criar um gateway a partir de um modelo define o gateway para usar o modelo integrado através do AIVAX. Após a criação do gateway, revise suas instruções, coleções RAG, ferramentas, habilidades, workers e configurações de saída antes de usá‑lo em produção. Veja [AI Gateways](/docs/pt-br/inference/ai-gateway) para o fluxo completo de gateway.

Testes no playground e chamadas de API podem consumir saldo da conta ou reservas de assinatura. Use prompts de teste curtos primeiro e verifique [Uso](account-balance.md#check-balance-and-usage) se estiver comparando vários modelos.

Não compartilhe URLs de playground gerados. O console pode incluir informações da sessão no link do playground para que o teste seja executado. Para integrações duráveis, use uma chave de API privada armazenada em `AIVAX_API_KEY` ou em um gerenciador de segredos, em vez de depender de uma sessão de navegador.

## Usar exemplos de integração com segurança

A caixa de diálogo **Ver código de integração** mostra exemplos para Python, JavaScript e curl. Os exemplos usam uma variável de ambiente para a chave de API em vez de imprimir uma chave real no bloco de código. O console pode exibir o alias do endpoint `/api/v1`; para configuração de SDK, a URL base canônica compatível com OpenAI é `https://inference.aivax.net/v1`.

Antes de executar um exemplo:

1. Crie ou escolha uma chave de API privada para a integração.  
2. Armazene-a em uma variável de ambiente ou gerenciador de segredos como `AIVAX_API_KEY`.  
3. Confirme que o nome do modelo corresponde ao modelo selecionado.  
4. Comece com um prompt pequeno.  
5. Mova o comportamento reutilizável para um AI Gateway quando o prompt, modelo, ferramentas, RAG ou regras de saída se tornarem configuração de produto.

Não cole chaves de API nos exemplos de código nem as faça commit no controle de versão. Para orientações sobre chaves de API, veja [Gerenciar chaves de API](account-balance.md#manage-api-keys) e [Autenticação](/docs/pt-br/authentication).

## Decisões comuns

### Modelo direto ou AI Gateway?

Use um modelo direto quando a requisição for simples e totalmente controlada pela sua aplicação. Use um AI Gateway quando quiser reutilizar instruções, anexar coleções RAG, habilitar ferramentas, impor comportamento de saída, conectar clientes de chat, expor uma ferramenta MCP ou mudar configurações de modelo sem redeployar sua aplicação.

### Modelo rápido ou modelo de alta inteligência?

Use um modelo mais rápido para suporte interativo, classificação, roteamento, extração e tarefas de alto volume com critérios de sucesso claros. Use um modelo de alta inteligência para análises ambíguas, codificação, contexto longo, raciocínio em múltiplas etapas e tarefas onde a qualidade da resposta importa mais que a latência.

### Modelo mais barato ou modelo incluído na assinatura?

Use o filtro de preço quando o fluxo de trabalho for cobrado por token e o custo for principalmente impulsionado pelo volume de saída. Use o filtro de assinatura quando seu plano incluir uso de reserva e o multiplicador de uso do modelo selecionado se adequar à carga de trabalho. Sempre valide com prompts reais, pois tentativas e saídas longas podem alterar o custo efetivo.

### Modelo estável, de pré‑visualização, depreciado ou roteador?

Use modelos estáveis para produção. Use modelos de pré‑visualização para avaliação e experimentos controlados. Trate modelos depreciados como alvos de migração: encontre um substituto e atualize gateways ou aplicações antes da remoção. Modelos roteadores podem ser úteis quando quiser que o AIVAX roteie dentro de uma família de modelos, mas valide o comportamento com seus próprios prompts antes de depender deles.

## Solução de problemas

### A lista de modelos está vazia

Limpe o campo de pesquisa e redefina os filtros para **Todas as velocidades**, **Todas as inteligências**, **Todos os preços** e **Todos os modelos**. Se a lista ainda estiver vazia, atualize a página e confirme que a conta está autenticada.

### Um modelo não funciona com meu prompt

Verifique primeiro as capacidades do modelo. Se a requisição incluir imagens, áudio, vídeo, arquivos, ferramentas, funções JSON ou contexto longo, o modelo selecionado deve suportar esse requisito ou o gateway deve usar pré‑processamento AIVAX ou outro caminho de modelo que o faça.

### Um modelo está disponível no catálogo mas falha em produção

Verifique, na ordem: saldo da conta, acesso ao plano, limites de requisição, tamanho de contexto, capacidades necessárias, estabilidade ou status de deção do modelo, validade da chave de API e configurações do gateway. Em seguida, teste um prompt direto simples com o mesmo modelo. Se o mesmo prompt direto funcionar mas o gateway falhar, revise o nome do modelo do gateway, endereço base, coleções RAG, ferramentas, workers e configurações de saída.

### Um modelo foi depreciado

Abra Modelos, procure pelo provedor ou família de modelo e escolha um substituto com capacidades comparáveis, tamanho de contexto, velocidade e preço. Atualize primeiro os AI Gateways e depois as integrações diretas. Se as notificações de modelo depreciado estiverem habilitadas, a conta pode enviar e‑mail quando modelos usados recentemente forem depreciados.

## Referência

Referência da API de listagem de modelos compatível com OpenAI:

A referência abaixo documenta a superfície de listagem de modelos da API usada por integrações. Não é o mesmo payload rico de catálogo renderizado pela página Modelos do dashboard, que inclui metadados orientados à UI, como níveis de preço, flags, velocidade relativa, inteligência relativa e menus de ação.

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Documentação relacionada:

- [Inference](/docs/pt-br/inference/inference): chame modelos através da API de complementos de chat compatível com OpenAI.  
- [AI Gateways](/docs/pt-br/inference/ai-gateway): transforme a seleção de modelo em configuração reutilizável de assistente.  
- [Plans and limits](/docs/pt-br/limits): entenda acesso ao plano, limites de taxa, limites de contexto e reservas de assinatura.  
- [Pricing](/docs/pt-br/pricing): entenda uso de modelo, saldo e faturamento de armazenamento.