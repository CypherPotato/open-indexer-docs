# Conta, saldo e várias contas

Use **Minha conta** e **Uso** para gerenciar as configurações de nível de conta que afetam todos os recursos AIVAX: plano, saldo, notificações, chaves de API, autenticação de hook, uso de armazenamento, uso de reserva de modelo e contas de navegador salvas.

Esta página é para proprietários de conta, operadores e desenvolvedores que precisam manter uma conta AIVAX utilizável e segura. Se você só precisa fazer sua primeira chamada de API, comece com [Começando](/docs/pt-br/getting-started). Se precisar das regras de autenticação da API, veja [Autenticação](/docs/pt-br/authentication).

## Antes de começar

Você precisa estar conectado ao [console AIVAX](https://console.aivax.net/). Algumas ações podem afetar sistemas de produção, faturamento ou integrações, portanto confirme o nome da conta e o selo do plano no menu de conta inferior esquerdo antes de fazer qualquer alteração.

Não execute ações de conta, chave, chave de hook ou faturamento a partir de um navegador compartilhado ou não confiável. Contas salvas e sessões de login são armazenadas localmente pelo navegador.

## Escolha a página de conta correta

AIVAX separa a administração de contas em algumas superfícies relacionadas:

| Superfície | Quando usar |
| --- | --- |
| **Minha conta** | Atualize as configurações do perfil da conta, preferências de notificação, chaves de API, chave de hook, registro de conversas, correção automática de JSON e comportamento de logout. |
| **Uso** | Verifique o plano atual, saldo, uso de armazenamento, uso de reserva de modelo por assinatura e detalhamento de reservas quando disponível. |
| **Nível da conta** | Compare as capacidades dos planos Free, Pro e Max e os limites de produção. |
| **Menu da conta** | Altere ou adicione contas salvas, abra o uso, recarregue o saldo, gerencie as configurações da conta ou faça logout. |

Use **Minha conta** para configuração. Use **Uso** para estado operacional. Use **Nível da conta** ao decidir se um plano suporta o fluxo de trabalho que você deseja executar.

## Gerenciar informações da conta

Abra **Minha conta > Informações da conta** para revisar e atualizar as configurações globais da conta.

Você pode:

- Abra a comparação de plano a partir de **Plano da conta**.
- Edite o nome da conta exibido no console.
- Revise o endereço de e‑mail da conta.
- Ative ou desative o registro de conteúdo de conversas.
- Ative ou desative a correção automática de JSON.
- Abra o Gravatar para alterar a foto do perfil da conta.
- Faça logout da conta atual.

O nome da conta é visível na plataforma, portanto escolha um nome que permita aos operadores distinguir contas de produção, teste, cliente e pessoais. O endereço de e‑mail da conta está atualmente somente leitura no console. Se precisar ser alterado, use a recuperação de conta suportada ou o caminho de suporte.

Ative o **registro de conversas** quando sua equipe precisar de conteúdo de conversas armazenado para depuração, análise, revisão ou fluxos de auditoria. Desative quando a conta deve evitar reter conteúdo de conversas além do necessário para o fluxo de trabalho ativo. Antes de mudar essa configuração, coordene com quem depende de Conversas, Análises ou fluxos de solução de problemas.

Ative a **correção automática de JSON** quando as aplicações esperam JSON estruturado e você deseja que a AIVAX tente reparar a saída de modelo malformada. Para detalhes de implementação e comportamento de esquema, veja [Respostas Estruturadas](/docs/pt-br/inference/structured-responses).

## Configurar notificações

Abra **Minha conta > Notificações** para controlar os e‑mails da conta.

As notificações são atualmente enviadas para o endereço de e‑mail da conta. As configurações de notificação incluem:

| Notificação | O que faz | Controle de tempo |
| --- | --- | --- |
| **Baixo saldo** | Envia um e‑mail quando o saldo da conta cai abaixo do limite configurado. | No máximo uma vez a cada 3 dias. |
| **Modelos descontinuados** | Envia um e‑mail quando um modelo usado recentemente se torna descontinuado. | Apenas modelos usados nos últimos 30 dias são considerados; e‑mails são enviados no máximo uma vez a cada 7 dias. |

Use notificações de baixo saldo para contas de produção e fluxos de trabalho com lotes intensivos. Defina o limite alto o suficiente para que a equipe possa recarregar antes que clientes de chat, integrações, chamadas multimodais ou jobs em lote parem por saldo insuficiente.

Use notificações de modelos descontinuados quando gateways ou integrações diretas dependem de nomes de modelos específicos. Após receber uma notificação, revise o gateway ou aplicação afetada antes que o modelo seja removido ou se torne inadequado para produção.

## Verificar saldo e uso

Abra **Uso** a partir do menu de conta.

Uso mostra:

- Plano atual.
- Saldo da conta.
- Uma ação de **Recarregar conta**.
- Uso de armazenamento em relação à cota de armazenamento incluída.
- Janelas de uso de modelo por assinatura, quando o plano inclui reservas de modelo por assinatura.
- Detalhamento semanal da reserva de modelo por assinatura, quando o plano inclui reservas e há uso no período atual.

O saldo é consumido por inferência, RAG, assinaturas e outros serviços AIVAX. Alguns fluxos de trabalho exigem saldo positivo ou um mínimo específico de rota antes de iniciar, e rotas faturáveis podem retornar `402 Payment Required` quando o saldo ou a cota de armazenamento são insuficientes. Veja [Preços](/docs/pt-br/pricing#balance-requirements), [Créditos e faturas](/docs/pt-br/pricing#credits-and-invoices) e [Planos e limites](/docs/pt-br/limits#how-limits-are-enforced) para as regras técnicas.

Se um fluxo de trabalho falhar inesperadamente, verifique o Uso antes de depurar o modelo ou a configuração de recursos. Baixo saldo, janelas de reserva esgotadas ou armazenamento acima da cota podem fazer com que gateways, coleções, clientes de chat e jobs em lote saudáveis pareçam quebrados.

## Recargarregar conta da conta

Use **Recarregar conta** a partir do menu de conta ou da página de Uso quando o saldo pré‑pago estiver muito baixo.

A caixa de diálogo de crédito solicita o valor do crédito e mostra o método de pagamento, taxa do processador, taxa de serviço e total antes de criar o link de pagamento. Confirme somente depois que o total corresponder ao que você pretende adicionar. A AIVAX então abre o link do provedor de pagamento em uma nova aba do navegador. Para saber como créditos e faturas afetam o saldo, veja [Créditos e faturas](/docs/pt-br/pricing#credits-and-invoices).

Não use o botão de voltar do navegador ou abas duplicadas para criar múltiplos links de pagamento a menos que queira múltiplos pagamentos intencionalmente. Após o pagamento, retorne ao Uso ou ao painel para confirmar que o saldo mudou.

## Gerenciar chaves de API

Abra **Minha conta > Chaves de API** para criar, inspecionar e revogar chaves de API.

Chaves de API autenticam aplicações, SDKs, clientes MCP e serviços de backend. Elas são diferentes das chaves de login. Crie chaves de API separadas para aplicações distintas para que você possa revogar uma integração sem quebrar todos os sistemas na conta.

Ao criar uma chave, escolha:

| Campo | Orientação |
| --- | --- |
| **Nome da chave** | Use um proprietário e propósito, como `production support bot` ou `staging batch importer`. |
| **Tipo da chave** | Use **Private** para integrações do lado do servidor e APIs de gerenciamento de conta. Use **Public (beta)** somente para rotas restritas de navegador/cliente projetadas para chaves públicas. |
| **Expiração da chave** | Escolha 7, 30 ou 90 dias para trabalho temporário; escolha **Never** somente quando você tem um processo externo de rotação. |

A AIVAX exibe uma nova chave de API gerada apenas uma vez. Copie-a diretamente para o gerenciador de segredos ou ambiente de implantação de destino. Não a armazene em código‑fonte, rastreadores de issues, capturas de tela, notas compartilhadas ou transcrições de chat.

A tabela de chaves de API mostra a chave mascarada, tipo, rótulo, expiração, horário da última utilização e ações. Use **View conversation logs** para abrir conversas filtradas por essa chave ao investigar uma integração específica. Use **Delete** para revogar uma chave. Excluir uma chave pode quebrar imediatamente todos os serviços que a utilizam, portanto rotacione os chamadores para uma chave de substituição antes da exclusão quando a disponibilidade for importante.

Para tipos de chave e esquemas de autenticação de API aceitos, veja [Autenticação](/docs/pt-br/authentication#api-key-types) e [Criar e listar chaves](/docs/pt-br/authentication#create-and-list-keys).

## Gerenciar a chave de hook

Abra **Minha conta > Chave de hook** para gerenciar o segredo usado para chamadas reversas da AIVAX aos seus serviços, como workers e callbacks de funções de protocolo do lado do servidor.

Use **Reset hook key** quando a chave de hook pode ter sido exposta ou quando você rotaciona intencionalmente o material de verificação de webhook. Resetá‑la significa que todo serviço que valida chamadas reversas da AIVAX deve ser atualizado com o novo segredo. Planeje isso como uma rotação de credenciais, especialmente para workers ou integrações de produção.

Use **Copy** somente quando estiver pronto para colar a chave de hook em um armazenamento de segredos confiável. Não a cole em logs ou código do lado do cliente.

Para detalhes de validação, veja [Autenticação de hook](/docs/pt-br/authentication#hook-authentication).

## Usar várias contas salvas

O menu de conta permite adicionar outra conta inserindo a chave de login de 14 caracteres dessa conta. Depois que uma conta é salva, ela aparece no menu de conta e pode ser selecionada sem retornar à página de login.

Para adicionar e alternar contas:

1. Abra o menu de conta inferior esquerdo.
2. Selecione **Add account**.
3. Insira a chave de login de 14 caracteres da outra conta.
4. Confirme o formulário. A AIVAX autentica com essa chave e troca o console para essa conta.
5. Confirme o nome da conta e o selo do plano antes de fazer alterações.

Para voltar depois, abra o menu de conta e selecione a conta salva. Para remover acesso local temporário, faça logout dessa conta. Se outra conta salva existir, a AIVAX pode mudar para ela automaticamente.

Várias contas salvas são úteis quando você opera contas de produção, teste, cliente ou pessoais separadas a partir do mesmo navegador. Elas também são uma fonte comum de erros. Antes de editar uma chave, gateway, coleção, notificação ou configuração de saldo, verifique o nome da conta ativa e o selo do plano.

Chaves de login de contas salvas e dados de sessão são armazenados no armazenamento local do navegador. Use esse recurso apenas em um dispositivo privado confiável e perfil de navegador. Não adicione contas enquanto compartilha a tela, pois o campo de chave de login fica visível enquanto você digita ou cola. Fazer logout remove a conta salva atual localmente e pode mudar para outra conta salva, mas não rotaciona chaves de login expostas, revoga chaves de API ou invalida credenciais armazenadas em outro lugar.

## Solução de problemas

### Uma solicitação falha com `402 Payment Required`

Abra o Uso e verifique o saldo e o uso de armazenamento. A conta pode ter saldo insuficiente, um requisito de saldo mínimo para o tipo de entrada ou uso de armazenamento acima da cota do plano. Veja [Preços](/docs/pt-br/pricing#balance-requirements).

### O saldo não foi atualizado após recarregar

Confirme que o link de pagamento abriu em uma nova aba e que o pagamento foi concluído. Se o navegador bloqueou a nova aba, crie um novo link de pagamento a partir da caixa de diálogo de crédito. Evite criar links duplicados a menos que pretenda fazer múltiplos pagamentos. A confirmação do pagamento pode não ser instantânea; verifique o painel ou o Uso novamente após o provedor confirmar o pagamento. Se precisar de confirmação a nível de fatura, abra o Analytics e revise faturas ou atividade de faturamento quando disponível.

### Um serviço parou após mudança de chave de API

Verifique se a chave foi excluída, expirou ou foi substituída sem atualizar o serviço. Crie uma chave privada de substituição, atualize o segredo do serviço, teste-a e então exclua a chave antiga.

### Um worker ou callback de função do lado do servidor é rejeitado

Verifique se a chave de hook foi redefinida. Atualize o serviço receptor para validar contra a chave de hook atual e o esquema de validação `X-Request-Nonce` atual, então tente novamente uma solicitação controlada. Se o receptor ou worker foi provisionado com configurações de callback mais antigas, reimplante ou reprovisione o serviço afetado antes de testar novamente. Veja [Autenticação de hook](/docs/pt-br/authentication#hook-authentication).

### Mudei de conta e não consigo encontrar um recurso

Confirme o nome da conta no menu de conta inferior esquerdo. Recursos como gateways, coleções, chaves, logs, conversas e memórias pertencem à conta ativa.

### E‑mails de notificação estão ausentes ou atrasados

Verifique se a notificação está habilitada e se o limiar ou condição de evento foi realmente atendido. As notificações são enviadas para o endereço de e‑mail da conta, então verifique a caixa de entrada e a pasta de spam. Notificações de baixo saldo são enviadas no máximo uma vez a cada 3 dias. Notificações de modelos descontinuados são enviadas no máximo uma vez a cada 7 dias e consideram apenas modelos usados nos últimos 30 dias.

## Documentação relacionada

- [Platform basics](basics.md): faça login e navegue no console.
- [Authentication](/docs/pt-br/authentication): famílias de chaves de API, esquemas de autenticação aceitos e validação de hook.
- [Pricing](/docs/pt-br/pricing): saldo pré‑pago, cobranças de uso, faturamento de armazenamento e requisitos de saldo.
- [Plans and limits](/docs/pt-br/limits): cotas de plano, limites de taxa, limites de armazenamento e disponibilidade de recursos.
- [Structured Responses](/docs/pt-br/inference/structured-responses): saída de esquema JSON e comportamento de correção de JSON.