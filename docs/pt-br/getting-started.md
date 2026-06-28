# Começando

Este guia mostra o caminho mais curto de uma conta AIVAX até a primeira conclusão de chat compatível com OpenAI.

## Antes de começar

Você precisa:

- Uma conta AIVAX.
- Uma chave de API privada do painel da conta ou do endpoint de chave de API.
- Saldo suficiente na conta para a operação. Algumas rotas exigem apenas que o saldo não seja negativo, enquanto clientes de chat, integrações, processamento em lote e entradas multimodais podem exigir um saldo estritamente positivo ou mínimo.
- Um nome de modelo hospedado ou um ID de Gateway de IA.

URL base da API de produção:

```text
https://inference.aivax.net
```

URL base do SDK compatível com OpenAI:

```text
https://inference.aivax.net/v1
```

## 1. Crie uma chave de API

Use uma chave de API **privada** para chamadas do lado do servidor. Chaves privadas são geradas com o prefixo `sk-aiv-acc` e podem chamar APIs de conta autenticadas e endpoints de inferência compatíveis com OpenAI.

Chaves públicas usam o prefixo `pk-aiv-`. Elas são destinadas ao uso restrito do lado do cliente em rotas públicas, como rotas públicas de consulta/resposta RAG e conclusões de chat restritas. Elas não podem chamar endpoints de gerenciamento de conta.

Para a maioria das primeiras integrações, comece com uma chave privada de um serviço backend. Ela fornece a superfície completa da conta: listagem de modelos, conclusões de chat, Gateways de IA, coleções RAG, fluxos de trabalho em lote e APIs administrativas. Chaves públicas são úteis mais tarde, quando você expõe intencionalmente uma capacidade restrita a um navegador ou outro ambiente do lado do cliente.

Consulte [Authentication](authentication.md) para tipos de chave, esquemas de autenticação aceitos e validação de hooks. Se a próxima coisa que você deseja construir é um widget de usuário final em vez de uma integração backend, também leia [Chat Clients](features/chat-clients.md), pois sessões de chat resolvem identidade, histórico de conversas, anexos e limites por usuário de forma mais direta que uma chave pública bruta.

## 2. Encontre um modelo ou ID de gateway

Você pode chamar qualquer um dos seguintes:

- Um nome de modelo hospedado retornado pelo endpoint de listagem de modelos.
- Um identificador de gateway da sua conta.

Slugs de gateway são suportados para chaves privadas. Conclusões de chat com chave pública devem usar o UUID completo do gateway e não podem chamar modelos integrados diretamente.

Use um nome de modelo hospedado quando precisar apenas de uma chamada direta ao modelo. Use um AI Gateway quando quiser comportamento reutilizável: instruções, coleções RAG, ferramentas integradas, workers, servidores MCP, funções de protocolo, habilidades, moderação ou configurações de provedor. Um gateway se torna a "configuração de assistente" estável que sua aplicação pode chamar repetidamente sem reconstruir as mesmas opções em cada requisição.

Se ainda estiver explorando, liste os modelos primeiro e faça uma chamada direta. Quando o prompt, ferramentas ou regras de recuperação começarem a fazer parte do produto, mova essa configuração para um [AI Gateway](inference/ai-gateway.md).

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 3. Faça uma requisição de conclusão de chat

Instale o SDK OpenAI para sua linguagem e, em seguida, aponte-o para a AIVAX:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="sk-aiv-acc..."
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ]
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo integrado ou um ID de gateway disponível em sua conta.

Esta requisição é intencionalmente pequena: uma mensagem de usuário, um modelo ou gateway e uma resposta. Depois que funcionar, você pode adicionar os componentes do produto um a um. Para saída JSON estruturada, veja [Structured Responses](inference/structured-responses.md). Para recuperar conhecimento de documentos antes de responder, crie uma [RAG collection](rag/collections.md) e anexe-a a um gateway. Para permitir que o modelo chame sistemas externos, compare [Built-in Tools](tools/builtin-tools.md), [MCP](tools/mcp.md) e [Protocol Functions](tools/protocol-functions.md).

### Inferência de longa duração

Para requisições normais, continue usando `https://inference.aivax.net/v1`.

Se uma chamada de inferência pode durar mais que o tempo limite do proxy Cloudflare, ou se seu cliente receber erros HTTP `524` enquanto aguarda conclusões longas, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

Este host expõe apenas os caminhos de inferência compatíveis com OpenAI necessários para listagem de modelos e conclusões de chat. Use a mesma chave de API, valor do modelo, corpo da requisição e configuração do SDK, mudando apenas a URL base:

```python
client = OpenAI(
    base_url="https://direct.inference.aivax.net/v1",
    api_key="sk-aiv-acc..."
)
```

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 4. Confirme faturamento e limites

Após uma requisição bem-sucedida, o uso é registrado contra a conta autenticada e o recurso da chave de API. O uso de modelo integrado é cobrado do saldo da conta, a menos que esteja coberto por uma janela de reserva de modelo de assinatura.

Verificar o saldo após a primeira chamada é um bom passo de validação porque confirma que a autenticação, acesso ao modelo, rastreamento de uso e faturamento foram resolvidos sob a conta esperada. O endpoint de saldo também retorna informações de plano e limites, o que é útil antes de habilitar recursos de maior volume, como importações RAG, clientes de chat ou processamento em lote.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Formatos de erro

AIVAX usa dois formatos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI com `message`, `type`, `param` e `code`.
- Endpoints administrativos retornam `{"error": "...", "details": null}` para erros e `{"message": "...", "data": ...}` para resultados bem-sucedidos de `JsonResponse`.

Falhas comuns:

| Status | Causa provável |
| --- | --- |
| `401 Unauthorized` | Falta, formato, expirada ou chave de API desconhecida. |
| `403 Forbidden` | Uma chave pública tentou chamar uma rota não pública, ou o recurso não é permitido. |
| `402 Payment Required` | Saldo insuficiente ou a conta excedeu a cota de armazenamento. |
| `429 Too Many Requests` | Um limite de taxa foi atingido. |
| `400 Bad Request` | Corpo da requisição inválido, parâmetro não suportado, modelo ausente, esquema inválido ou configuração de ferramenta inválida. |

Para conclusões de chat em streaming, trate blocos SSE normais, blocos opcionais `servertool`, metadados de uso finais, `[DONE]` e blocos de erro de streaming.

## Lista de verificação de solução de problemas

Quando uma requisição falha, verifique na seguinte ordem:

1. A URL base é `https://inference.aivax.net/v1` para chamadas do SDK OpenAI.
2. A chave é enviada como `Authorization: Bearer <KEY>`, autenticação Basic ou como parâmetro de consulta `api-key`.
3. A conta tem saldo e cota de armazenamento suficientes.
4. O ID do modelo ou gateway existe e é permitido pelo plano atual.
5. A requisição está dentro dos limites de requisições, tokens, RAG, ferramentas ou lote do plano.
6. Chamadas com chave pública usam apenas parâmetros de conclusão de chat permitidos e UUIDs completos de gateway.
7. Configuração de ferramenta, RAG, worker ou esquema está isolada testando o mesmo prompt sem esse recurso.

## Próximos passos

- [Authentication](authentication.md): entenda chaves privadas, chaves públicas e validação reversa de hooks.
- [Plans and limits](limits.md): verifique limites de requisições, limites de contexto, limites RAG, limites de ferramentas e limites de lote antes de abrir um fluxo de trabalho para usuários.
- [Pricing](pricing.md): entenda como funcionam créditos, uso, armazenamento e verificações de saldo mínimo.
- [AI Gateways](inference/ai-gateway.md): passe de uma chamada direta ao modelo para uma configuração de assistente reutilizável.
- [RAG collections](rag/collections.md): armazene documentos e recupere-os durante a inferência.
- [Batch](features/batch.md): execute o mesmo fluxo de trabalho de IA em muitos registros independentes.