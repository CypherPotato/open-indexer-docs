# Registros

Os registros dão aos usuários autenticados uma visão curta e limitada à conta de avisos e erros operacionais que a AIVAX registra enquanto os recursos da plataforma são executados. Use esta página quando algo parece errado e você precisa de um sinal rápido antes de abrir uma página mais profunda, como Conversas, Coleções RAG, Lote ou Análises.

Os registros não são um sistema de transcrição completo e não são um livro‑razão de análises. Eles são mais úteis para mensagens operacionais recentes: tentativas de geração falhas, erros de provedor ou ferramenta, avisos de indexação, avisos de tamanho de documento e outras notificações que devem ser visíveis ao proprietário da conta.

## Quando usar Registros

Abra **Registros** quando precisar responder a perguntas como:

- A AIVAX registrou um aviso ou erro recente para esta conta?
- Um trabalho de indexação sinalizou um documento como pequeno demais ou grande demais?
- Um provedor, gateway ou caminho de ferramenta falhou ao processar uma solicitação?
- Um caso de suporte está relacionado ao estado da conta, configuração de recurso ou a um problema mais específico de conversa?

Use [Conversas](/docs/pt-br/platform/conversations) quando precisar do prompt real, resposta, metadados, uso, ferramentas ou detalhes da solicitação para uma inferência. Use [Análises](/docs/pt-br/platform/analytics) quando precisar de totais de uso, tendências de custo ou faturas. Use [Coleções RAG](/docs/pt-br/platform/rag-collections) quando o problema for qualidade de recuperação, estado de indexação ou transações da coleção.

## Entendendo a página de Registros

Abra **Registros** na barra lateral do console. O título da página é **Registros da Conta**.

A tabela mostra os registros mais recentes para a conta ativa:

| Coluna | Significado |
|---|---|
| **Data e hora** | Quando a AIVAX escreveu a entrada de registro. |
| **Nível** | A gravidade. O console pode mostrar o nível como um selo compacto, como `I`, `W` ou `E` para Informação, Aviso ou Erro. |
| **Mensagem** | A mensagem de registro legível por humanos. Mensagens longas podem ser truncadas pela plataforma antes de chegarem à tabela. |
| **Ações** | Ações por linha. A ação atual do console é **Copiar para a área de transferência**. |

Use **Atualizar** para recarregar a lista. O console solicita `/api/v1/information/logs.json`, que devolve as entradas de registro de conta autenticada mais recentes primeiro, limitadas a 300 entradas. A tabela do console pagina esses resultados em páginas de 30 linhas. Esse ponto de extremidade do console é usado pelo console autenticado da AIVAX e não está listado na referência de API publicada.

## Ler níveis de registro

Os níveis de registro ajudam a decidir a próxima ação.

| Nível | O que geralmente significa | O que fazer |
|---|---|---|
| **Informação** | Um evento normal ao nível da conta ou notificação de fundo. | Use como contexto; normalmente nenhuma ação é necessária, a menos que esteja relacionado a uma investigação. |
| **Aviso** | Um recurso funcionou, mas a AIVAX detectou algo que pode reduzir a qualidade ou confiabilidade. | Leia a mensagem e verifique o recurso nomeado. Por exemplo, um aviso de documento grande geralmente significa que você deve dividir esse documento RAG em blocos menores. |
| **Erro** | Uma solicitação, chamada ao provedor, chamada de ferramenta, etapa de indexação ou caminho de integração falhou. | Use a marca de tempo e a mensagem para encontrar o recurso relacionado, então inspecione a página mais profunda para a funcionalidade afetada. |

## Investigar um aviso ou erro

Comece pela mensagem de registro e expanda. Uma linha de registro geralmente fornece uma marca de tempo e uma descrição curta; algumas mensagens também incluem um identificador de recurso.

1. Confirme a conta ativa no menu da conta.  
2. Selecione **Atualizar** para garantir que está visualizando as linhas mais recentes.  
3. Encontre o Aviso ou Erro mais recente próximo ao horário do problema relatado.  
4. Abra o menu **Ações** da linha e selecione **Copiar para a área de transferência** quando precisar colar a mensagem em um ticket interno ou compará‑la com outro recurso.  
5. Abra a página de produto relacionada à mensagem:  
   - Documento ou mensagens de indexação RAG: abra [Coleções RAG](/docs/pt-br/platform/rag-collections).  
   - Mensagens de trabalho ou item em lote: abra [Lote](/docs/pt-br/platform/batch).  
   - Comportamento inesperado do modelo, ferramentas falhas ou problemas a nível de solicitação: abra [Conversas](/docs/pt-br/platform/conversations).  
   - Problemas de custo ou saldo: abra [Análises](/docs/pt-br/platform/analytics) ou [Conta, saldo e múltiplas contas](/docs/pt-br/platform/account-balance).  
6. Use a marca de tempo, modelo, gateway, ID do recurso, ID da coleção, ID do trabalho em lote ou conversa relacionada para restringir a investigação. Nunca cole chaves de API brutas em tickets ou notas compartilhadas.

Quando um registro aponta para um problema de tamanho de documento, trate-o como um sinal de qualidade. Blocos superdimensionados podem tornar a recuperação menos precisa, enquanto blocos muito pequenos podem carecer de contexto suficiente. Ajuste a estratégia de fragmentação de documentos, reimporte ou reindexe os documentos afetados e teste a recuperação antes de usar a coleção em produção.

## Compartilhar informações de registro com segurança

Mensagens de registro são dados operacionais da conta. Elas podem conter IDs de recurso, nomes de provedor, nomes de ferramenta, nomes de documento ou fragmentos de contexto operacional. Normalmente não devem conter segredos, mas não presuma que toda mensagem copiada seja segura para compartilhar.

Antes de compartilhar uma mensagem de registro, remova:

- Chaves de API, chaves de sessão, chaves de login, segredos de webhook ou tokens de portador.  
- Dados pessoais ou identificadores de cliente.  
- URLs internos, IDs de solicitação, IDs de conta e detalhes de infraestrutura, a menos que o destinatário precise deles.  
- Prompts privados, argumentos de ferramenta ou detalhes de processos de negócio.

Não compartilhe registros de rede do navegador do console. Capturas de rede podem incluir cabeçalhos de autorização ou cabeçalhos de resposta autenticados que não fazem parte da tabela de registro visível.

## Limites e retenção

Os registros são intencionalmente de curta duração e focados no recente:

- Os registros são limitados à conta autenticada.  
- A listagem devolve primeiro os registros de conta mais recentes.  
- A resposta da API é limitada a 300 entradas, e o console pagina esses resultados 30 linhas por vez.  
- Mensagens com mais de 5 000 caracteres são truncadas antes do armazenamento.  
- Limpeza em segundo plano remove entradas de registro com mais de 7 dias, portanto os Registros não devem ser tratados como armazenamento de auditoria permanente.

Se precisar de evidência de investigação durável, copie a mensagem relevante para seu próprio sistema de suporte ou incidente aprovado enquanto a entrada ainda estiver disponível. Para evidência completa de conversa, use a exportação de Conversas em vez de depender dos Registros.

## O que os Registros não mostram

Os Registros são um sinal operacional de alto nível. Eles não substituem:

- Transcrições de conversa, chamadas de ferramenta, metadados de solicitação ou hashes de mensagem.  
- Payloads completos de requisição e resposta da API.  
- Rastreios completos de provedor ou logs de infraestrutura.  
- Livros‑razão de faturamento ou detalhamentos de uso.  
- Pontuação de transações RAG e detalhes de documentos correspondentes.

Use os Registros para decidir onde procurar a seguir, depois vá para a página específica do produto que contém o detalhe completo.

## Solução de problemas

| Problema | Causa provável | O que fazer |
|---|---|---|
| Um problema conhecido não aparece nos Registros | O problema não gerou uma entrada de registro de conta, a entrada é mais antiga que a janela de retenção ou você está visualizando a conta errada. | Confirme a conta ativa, atualize e então verifique Conversas, Lote, Coleções RAG ou Análises para evidências específicas da funcionalidade. |
| A tabela mostra apenas linhas antigas | Nenhuma nova entrada de registro a nível de conta foi escrita ou a página não foi atualizada. | Selecione **Atualizar** e reproduza o problema em um teste controlado se precisar de um novo sinal. |
| Um aviso menciona um documento grande | O documento RAG pode ser grande demais para recuperação precisa. | Divida o documento em blocos menores, reimporte ou reindexe e teste a coleção antes do uso em produção. |
| Uma mensagem de erro é muito genérica | Os Registros resumem intencionalmente falhas a nível de conta. | Use a marca de tempo, ID do recurso, gateway, chave de API ou conversa relacionada para abrir a página de diagnóstico mais profunda. |
| Você precisa compartilhar evidência com outra equipe | A mensagem bruta pode conter contexto operacional. | Copie apenas a linha relevante, remova dados sensíveis e evite compartilhar capturas de rede do console ou screenshots que incluam segredos. |