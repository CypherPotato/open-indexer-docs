# Bem-vindo

Boas vindas ao AIVAX. Nosso serviço torna mais fácil o desenvolvimento de modelos de IA inteligentes que usam uma base de conhecimento providenciada por você para conversar com o usuário, responder perguntas, fornecer informações em tempo real e mais.

Para começar, todos os endpoints devem ser feitos na URL de produção da AIVAX:

```text
https://inference.aivax.net/
```

## Lidando com erros

Todos os erros da API retornam uma resposta HTTP com um status não OK (nunca 2xx ou 3xx), e sempre seguindo o formato JSON:

```json
{
    "error": "Uma mensagem explicando o erro",
    "details": {} // um objeto contendo informações relevantes sobre o erro. Na maioria das vezes é nulo
}
```

## Diagnóstico operacional

Quando uma chamada falha, comece pelo nível mais externo antes de investigar prompt ou modelo. Confirme se a URL base está correta, se a API key foi enviada com `Authorization: Bearer ...` ou pelo parâmetro `?api-key`, se a conta tem saldo suficiente e se o plano possui limite para a operação. Depois, confirme se o endpoint chamado é o esperado: inferência usa `/v1/chat/completions`, MCP de inferência usa `/v1/mcp/inference`, MCP de coleções usa `/v1/mcp/collections`, e operações administrativas ficam na API versionada da AIVAX. Só depois disso investigue modelo, ferramentas, RAG, schema ou workers.

Erros de autenticação normalmente indicam chave ausente, chave inválida, header mal formatado ou uso de uma chave que não pertence à conta esperada. Erros de saldo aparecem quando a conta não pode pagar pela operação, quando multimodalidade exige saldo mínimo ou quando uma ferramenta com custo é acionada. Erros de limite aparecem quando a operação ultrapassa rate limit, limite diário, número de coleções, inserções de RAG ou processamento batch do plano. Para comparar diferenças comerciais entre planos, use sempre [a página de preços da AIVAX](https://aivax.net/pricing); esta documentação descreve o funcionamento técnico.

Erros de inferência podem vir do provedor do modelo, do formato da mensagem, do tamanho do contexto, de anexos inacessíveis, de JSON Schema inválido ou de ferramenta mal configurada. Se a mesma mensagem funciona sem ferramentas, o problema provavelmente está nas ferramentas. Se funciona sem RAG, revise coleção, estratégia de busca e documentos. Se funciona sem multimodalidade, revise formato, URL, base64, saldo mínimo e suporte do modelo. Se funciona em `stream: false` mas não em streaming, revise o cliente SSE e se ele trata chunks vazios, pings, `[DONE]`, `servertool` e erros no fluxo.

Workers devem ser investigados separadamente porque eles podem interromper eventos. Quando uma conversa para antes do modelo responder, teste temporariamente sem worker ou faça o worker responder 2xx vazio. Se isso resolver, revise validação de `X-Request-Nonce`, `gatewayId`, tempo de resposta, status HTTP retornado e formato `application/json+worker-action`. Para funções de protocolo, lembre que respostas não OK indicam falha para a assistente; quando o erro é esperado, responda 2xx com uma mensagem humana explicando o problema.

## Receitas de implementação

Para criar um assistente de suporte com base de conhecimento, comece criando uma coleção de RAG com documentos curtos e autossuficientes. Depois crie um AI Gateway com instruções de sistema que expliquem o papel da assistente, vincule a coleção, escolha uma estratégia de busca e teste perguntas diretas pela API. Quando a qualidade estiver boa, crie um chat client web ou integração de WhatsApp/Telegram para expor a assistente aos usuários. Se precisar de regras externas, como bloquear usuários sem assinatura ou enriquecer contexto com dados do CRM, adicione um worker ao gateway.

Para expor uma coleção a outro agente por MCP, use o endpoint `/v1/mcp/collections` com `Authorization`, `X-Mcp-Collection-Id`, `X-Mcp-Collection-Name`, `X-Mcp-Top-K`, `X-Mcp-Min-Score` e `X-Mcp-Reranker`. Comece em modo somente leitura. Habilite `X-Mcp-Allow-Write: yes` apenas quando o cliente MCP for confiável e quando o agente puder criar ou remover documentos. Use nomes de coleção descritivos, porque eles viram parte do nome da ferramenta e influenciam quando o modelo decide chamar a busca.

Para gerar JSON confiável, use `response_schema` quando quiser validação e JSON Healing pela AIVAX. Escreva um schema com `required`, tipos claros e `additionalProperties: false` quando a saída será consumida por outro sistema. Se o modelo possui structured outputs nativo e você quer passar o schema diretamente ao provedor, use `response_format` com `json_schema`. Se o consumidor precisa receber apenas o objeto final, use `json_only`, mas lembre que isso remove o envelope de chat completion da resposta.

Para processar muitos registros, use Batch em vez de abrir várias chamadas manuais. Crie um workflow com instrução, modelo, schema e ferramentas; importe itens em texto ou JSONL; inicie o job; acompanhe estados, custos e confiança; retente apenas erros ou itens de baixa confiança; exporte resultados em JSONL. Use Batch para trabalhos independentes, como classificação, extração, enriquecimento e avaliação. Não use Batch para conversas em tempo real ou quando cada item depende do resultado do item anterior.
