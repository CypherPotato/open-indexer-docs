# Portais de IA

Use **Portais de IA** para transformar um modelo em uma configuração de assistente reutilizável. Um portal armazena o modelo, a conexão do provedor, instruções, coleções RAG, habilidades, ferramentas, fontes MCP, moderação, trabalhadores, controles de contexto e parâmetros de ajuste que o AIVAX aplica sempre que o portal é chamado.

Esta página é para construtores e operadores que gerenciam o comportamento do assistente a partir do console. Para o modelo técnico do portal e comportamento da API, veja [Portal de IA](/docs/pt-br/inference/ai-gateway).

## Antes de começar

Faça login no [console AIVAX](https://console.aivax.net/) e abra **Dashboard > Portais de IA**. Confirme a conta ativa antes de editar um portal. Alterações no portal podem afetar imediatamente aplicações, clientes de chat, clientes MCP, fluxos de trabalho em lote e integrações que chamam o portal por slug ou ID.

Antes de alterar um portal de produção, identifique:

- Qual aplicativo, cliente de chat, fluxo de trabalho ou cliente MCP o chama.
- Se os chamadores usam o slug do portal ou o ID completo do portal.
- Quais capacidades do modelo são necessárias, como ferramentas, entrada de imagem, RAG, saída estruturada ou contexto longo.
- Se o portal atualmente tem conversas ativas ou tráfego de produção.

## Quando usar um portal

Use um portal quando o comportamento deve ser estável e gerenciado centralmente. Um portal é o lugar certo para decisões que não devem ser repetidas em cada requisição de API:

- Nome do modelo e conexão do provedor.
- Instruções do sistema e modelo de prompt.
- Coleções RAG e estratégia de recuperação.
- Habilidades e visibilidade de ferramentas.
- Ferramentas integradas, fontes MCP, funções de protocolo, definições de ferramentas brutas e configurações Bash.
- Amostragem, raciocínio, verbosidade e controles de contexto.
- Limiares de moderação e webhooks de trabalhadores.

Use uma chamada direta ao modelo quando precisar apenas de um prompt simples ou de um teste interno onde a aplicação controla todas as opções.

## Encontrar e abrir um portal

A lista de Portais de IA mostra cada portal com:

| Coluna | Significado |
| --- | --- |
| **Id.** | Forma curta de exibição do ID do portal. Copie o ID completo quando precisar de um identificador estável. |
| **Nome** | Nome amigável exibido no console. |
| **Modelo base** | O modelo configurado para o portal. |
| **Endereço base** | Inferência integrada ou o endpoint externo compatível com OpenAI. |
| **Slug** | Valor de modelo legível por humanos que chamadores com chave privada podem usar em completaões de chat. |
| **Ações** | Abre o editor do portal. |

Use a caixa de filtro para pesquisar nas colunas do portal. Abra **Visualizar** para inspecionar ou editar o portal.

## Criar um portal

Você pode criar um portal a partir da página Portais de IA com **Novo portal IA**, ou a partir de um cartão de modelo em **Modelos > Criar portal**.

No mínimo, configure:

1. **Nome do portal:** Um nome claro que identifique o propósito e o ambiente.
2. **Nome do modelo do portal:** O modelo integrado ou o valor do modelo roteado.
3. **Endereço base:** Use inferência integrada para modelos hospedados pelo AIVAX, ou uma URL base compatível com OpenAI para provedores externos.
4. **Chave de API:** Necessária apenas quando o portal chama um provedor externo que requer uma.
5. **Instruções:** O papel do assistente, limites, fonte da verdade e estilo de resposta.

Selecione **Criar portal IA** ou **Salvar alterações** somente após revisar a pré-visualização do pipeline. Para produção, comece com a configuração funcional mais simples, teste-a e depois adicione RAG, ferramentas, habilidades, moderação e trabalhadores deliberadamente.

## Escolher inferência integrada ou externa

A aba **Inferência** controla como o portal alcança o modelo.

| Opção | Use quando | Endereço base | Chave de API |
| --- | --- | --- | --- |
| **Inferência integrada** | Você quer que o AIVAX chame um modelo integrado do catálogo. | Inferência integrada, representada internamente como `@integrated`. | Não necessária para o provedor do modelo. |
| **Provedor externo compatível com OpenAI** | Você fornece seu próprio endpoint ou modelo de provedor. | URL base do provedor compatível com a interface de chat-completions do OpenAI. | Necessária quando o provedor requer autenticação. |
| **Roteador de modelo** | Você deseja que o portal roteie por complexidade da requisição. | Modelo de roteamento integrado. | Configure modelos de baixa, média e alta complexidade e esforço de raciocínio onde suportado. |

Antes de salvar, verifique se o modelo selecionado suporta o comportamento exigido pelo portal. Portais com muitas ferramentas precisam de chamadas de ferramentas confiáveis. Portais multimodais precisam da modalidade de entrada requerida ou de um plano de pré-processamento. Portais de saída estruturada precisam de comportamento de esquema compatível. Portais RAG precisam de contexto suficiente para documentos recuperados mais a conversa do usuário.

## Entender as abas do editor

O editor do portal está organizado por área de configuração:

| Aba | Use para |
| --- | --- |
| **Portal** | Nome e estrutura de pipeline de alto nível. |
| **Inferência** | Nome do modelo, conexão integrada ou externa do provedor, chave de API e parâmetros do roteador de modelo. |
| **RAG** | Coleções, estratégia de consulta, reordenador, contagem de resultados, pontuação mínima, janelas de reescrita e apresentação de metadados. |
| **Habilidades** | Habilidades vinculadas ao portal, se ferramentas estão ocultas a menos que selecionadas por uma habilidade, e ferramentas que devem permanecer visíveis. |
| **Instruções** | Instruções do sistema, fontes de instrução remotas, modelo de prompt do usuário, pré-preenchimento do assistente, texto de parada e comportamento de pré-preenchimento. |
| **Parâmetros + Ajuste** | Temperatura, top-p, penalidades, esforço de raciocínio, verbosidade, máximo de tokens, tamanho do contexto, pré-processamento multimodal e limites de mensagens de ferramenta. |
| **Ferramentas + MCP** | Fontes MCP, funções de protocolo, ferramentas brutas, ferramentas integradas, ambiente Bash, busca na web, memória, geração de imagens e configurações avançadas de JSON. |
| **Moderação** | Limiares para violência/ódio, conteúdo sexual, política, conteúdo perigoso e tentativas de jailbreak. |
| **Trabalhadores** | URL de trabalhador externo que pode controlar eventos do portal antes que a ação final ocorra. |

Use **Ocultar etapas desativadas** quando quiser focar nas partes habilitadas do pipeline. Deixe desativado quando estiver auditando um portal e precisar ver quais capacidades estão intencionalmente desativadas.

## Revisar configurações de alto impacto

Antes de salvar um portal de produção, revise:

- Nome do modelo, endereço base e chave de API do provedor.
- Coleções RAG, estratégia de consulta, contagem de resultados, pontuação mínima e reordenador.
- Instruções do sistema, modelo de prompt, pré-preenchimento do assistente e texto de parada.
- Ferramentas, MCP, funções de protocolo, ferramentas brutas e exposição Bash, especialmente ferramentas que podem gravar.
- Habilidades, ferramentas ocultas e ferramentas sempre visíveis.
- Tamanho do contexto, máximo de tokens, esforço de raciocínio, verbosidade e limites de mensagens de ferramenta.
- Pré-processamento multimodal e tipos de mídia selecionados.
- Limiares de moderação e URL de trabalhador.
- Trechos de integração, MCP e playground gerados antes de compartilhá-los.
- Logs de conversas após os testes.

## Configurar RAG cuidadosamente

Anexe coleções RAG quando o assistente precisar responder a partir de documentos de propriedade da conta. Escolha a estratégia de consulta com base na conversa:

- **Plain:** Usa a mensagem mais recente do usuário como consulta de busca.
- **Concatenate:** Junta as mensagens recentes na consulta.
- **User rewrite:** Reescreve as mensagens recentes do usuário antes da busca.
- **Full rewrite:** Reescreve o contexto recente do usuário e do assistente antes da busca.
- **Query function:** Fornece ao modelo uma ferramenta de busca ao invés de injetar resultados automaticamente.

Ajuste **Resultados máximos** e **Pontuação mínima** juntos. Mais resultados podem melhorar a cobertura, mas aumentam o uso de tokens e o ruído. Pontuações mínimas mais altas reduzem contexto irrelevante, mas podem ocultar documentos úteis se a qualidade da coleção for desigual. Teste a recuperação antes de usar o portal em produção.

## Configurar ferramentas e MCP deliberadamente

Ferramentas de portal podem permitir que o modelo busque na web, abra URLs, execute código, chame endpoints HTTP, gere imagens ou documentos, memorize informações, use memória estilo calendário, chame servidores MCP ou funções de protocolo.

Habilite apenas ferramentas que tenham um papel claro no assistente. Cada ferramenta extra aumenta o tamanho do prompt, o custo e a chance de uma chamada de ferramenta errada. Se a seleção de ferramentas se tornar pouco confiável, use habilidades, ferramentas sempre visíveis ou oculte ferramentas sem habilidades para restringir o que o modelo pode ver.

Trate ferramentas externas e fontes MCP como integrações. Valide autenticação, autorização e argumentos esperados no lado receptor. Não exponha ferramentas que podem gravar a usuários não confiáveis sem regras de aprovação ao nível da aplicação. Para comportamento de ferramentas integradas, veja [Ferramentas integradas](/docs/pt-br/tools/builtin-tools).

## Usar opções com segurança

Código gerado e links de playground podem conter credenciais. **Ver código de integração** espera que você forneça `AIVAX_API_KEY` a partir de uma variável de ambiente. **Ver código MCP** pode incluir a chave de sessão atual no cabeçalho `Authorization` gerado. **Executar no playground** pode colocar material de chave na URL do playground gerada. Substitua valores reais por `YOUR_AIVAX_API_KEY` ou uma variável de ambiente antes de compartilhar, confirmar ou colar trechos em ferramentas de suporte. Se uma chave real ou URL contendo sessão foi exposta, rotacione ou revogue a credencial afetada.

O menu **Opções** inclui:

| Ação | Use para |
| --- | --- |
| **Ver código de integração** | Copiar exemplos em Python, JavaScript ou curl para `/v1/chat/completions` usando o slug ou ID do portal. |
| **Ver código MCP** | Configurar o portal como uma ferramenta MCP através de `/v1/mcp/inference`. |
| **Executar no playground** | Testar o portal interativamente no playground AIVAX. |
| **Copiar slug do modelo** | Copiar o slug do portal para chamadores com chave privada. |
| **Copiar ID** | Copiar o ID completo do portal. |
| **Importar de JSON** | Substituir os campos atuais do portal no editor por uma configuração JSON. Revise e salve para persistir. |
| **Exportar para JSON** | Copiar a configuração atual do portal para backup, revisão ou migração. |
| **Ver logs de conversas** | Abrir logs de conversas filtrados para este portal. |
| **Excluir portal** | Remover o portal. Isso pode quebrar chamadores que usam seu slug ou ID. |

Antes de importar ou excluir um portal de produção:

1. Exporte o JSON atual do portal.
2. Copie o ID e o slug do portal.
3. Revise os logs de conversas para atividade recente.
4. Identifique chamadores que usam o slug ou ID completo.
5. Teste a substituição ou configuração importada em um portal separado quando possível.
6. Salve ou exclua somente após entender os chamadores e o rollback.

Importar JSON altera o estado do editor primeiro. Não é persistido até que você salve. Após a importação, revise campos sensíveis, URLs externas, definições de ferramentas, trabalhadores e chaves de provedor antes de salvar.

## Testar antes da produção

Antes de usar um portal em produção:

1. Envie uma mensagem direta simples através do portal.
2. Teste a tarefa principal do usuário com entrada realista.
3. Se o RAG estiver habilitado, teste a qualidade da recuperação e referências com [Busca semântica](/docs/pt-br/rag/semantic-search).
4. Se as ferramentas estiverem habilitadas, verifique se o modelo escolhe a ferramenta correta e se o receptor valida as requisições.
5. Se a moderação ou trabalhadores estiverem habilitados, teste exemplos permitidos e bloqueados. Para comportamento de trabalhador, veja [Trabalhadores IA](/docs/pt-br/inference/workers).
6. Verifique [Uso](account-balance.md#check-balance-and-usage), Analytics, Logs e Conversas para erros, custos e comportamentos inesperados.

## Solução de problemas

| Sintoma | Verificar | Correção |
| --- | --- | --- |
| A chamada ao portal retorna `401` ou `403` | Chave de API, tipo de chave pública/privada, permissões do chamador e se o chamador usa um slug de portal que chaves públicas não podem resolver. | Use uma chave privada válida para chamadas administrativas ou baseadas em slug, ou use o ID completo do portal quando necessário. |
| A chamada ao portal retorna `402` | Saldo da conta, cota de armazenamento e mínimos específicos de rota em Uso. | Reabasteça o saldo, reduza o armazenamento ou diminua o uso de modelo/ferramenta de baixo custo. |
| A chamada ao portal retorna `429` | Plano da conta, limites de taxa do modelo, limites de ferramentas e volume de cliente de lote/chat. | Reduza a taxa de requisições, escolha um caminho de modelo diferente ou faça upgrade do plano. |
| Falha na chamada ao provedor externo | Endereço base, chave de API do provedor, nome do modelo, limites de taxa do provedor e erros de resposta do provedor. | Teste as credenciais do provedor separadamente, depois atualize as configurações de inferência do portal. |
| Respostas RAG ausentes ou irrelevantes | Coleções anexadas, estado de indexação, estratégia de consulta, reordenador, resultados máximos, pontuação mínima, referências e instruções do sistema. | Teste a coleção diretamente, compare `Plain` com estratégias de reescrita, ajuste limites de pontuação/resultado deliberadamente e depois reteste através do portal. |
| Chamadas de ferramenta erradas ou ruidosas | Ferramentas habilitadas, fontes MCP, ferramentas brutas, habilidades, ferramentas sempre visíveis e instruções de ferramenta. | Reduza o conjunto de ferramentas, use habilidades para limitar ferramentas visíveis e documente quando cada ferramenta deve ser usada. |
| Trabalhador ou callback rejeita AIVAX | Chave de hook da conta, validação `X-Request-Nonce`, URL de callback, implantação do trabalhador e comportamento de timeout. | Atualize o receptor para validar a chave de hook atual, reimplante ou reprovisione os trabalhadores afetados e reenvie uma requisição controlada. Veja [Autenticação de hook](/docs/pt-br/authentication#hook-authentication). |
| Usuários ainda utilizam uma configuração antiga | Valor do modelo do chamador, slug do portal, ID completo, URL de playground copiada, configuração de cliente em cache e chamadas diretas ao modelo que contornam o portal. | Atualize todos os chamadores que contornam ou fixam o valor antigo do portal. |

## Chamar um Portal

Chamadas de conclusão de chat do portal usam o endpoint padrão de inferência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Documentação relacionada:

- [Portal de IA](/docs/pt-br/inference/ai-gateway): comportamento técnico do portal e configuração MCP.
- [Modelos](models.md): escolha o modelo base para um portal.
- [Coleções RAG](/docs/pt-br/rag/collections): prepare coleções antes de anexá-las.
- [Habilidades](/docs/pt-br/features/skills): crie pacotes de instruções reutilizáveis.
- [Funções MCP](/docs/pt-br/tools/mcp): conecte ferramentas MCP externas.
- [Funções de protocolo](/docs/pt-br/tools/protocol-functions): exponha funções HTTP do lado do servidor.