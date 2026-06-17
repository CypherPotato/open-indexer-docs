# Batch

Batch é o recurso da AIVAX para executar o mesmo fluxo de IA sobre muitos itens independentes. Ele transforma uma lista de entradas em uma fila processada em segundo plano, com instruções fixas, modelo definido, saída estruturada, validação opcional, métricas de progresso, custo por item, retentativas e exportação dos resultados.

Use Batch quando você tem dezenas, centenas ou milhares de registros que precisam passar pelo mesmo raciocínio: classificar leads, extrair campos em textos, enriquecer cadastros, resumir documentos curtos, avaliar respostas, moderar conteúdo, gerar dados estruturados ou chamar ferramentas embutidas para cada linha de uma lista.

## O que o Batch resolve

Processar muitos itens com IA costuma exigir fila, controle de concorrência, pausa por saldo ou limite, tratamento de erros, retentativa, validação de JSON, rastreamento de custo e exportação do resultado. Batch concentra essas partes na AIVAX.

Na prática, ele resolve principalmente:

- **Processamento repetível:** a mesma instrução, modelo e schema são aplicados a todos os itens.
- **Execução assíncrona:** o trabalho continua em segundo plano, sem manter uma requisição aberta.
- **Saída estruturada:** cada item pode ser obrigado a retornar um objeto compatível com um JSON Schema.
- **Correção e validação:** a AIVAX tenta reprocessar respostas inválidas e pode executar uma segunda etapa de validação.
- **Operação em escala:** jobs podem ser iniciados, pausados, retomados, monitorados, filtrados, limpos, reenviados para retentativa e exportados.
- **Controle operacional:** a tela mostra progresso, falhas, confiança, custo e eventos do job.

## Quando usar

Use Batch quando os itens podem ser processados de forma independente e não precisam compartilhar memória entre si. Bons exemplos são uma linha por cliente, URL, produto, ticket, mensagem, documento curto, trecho de contrato ou registro bruto.

Batch é uma boa escolha quando:

- o mesmo prompt vale para todos os itens;
- você precisa de resultado tabular ou JSON para consumir depois;
- o tempo de resposta pode ser assíncrono;
- você quer acompanhar erros e retentar apenas os itens problemáticos;
- você quer usar ferramentas embutidas, como pesquisa web, para cada item;
- você precisa medir custo, confiança e taxa de sucesso por execução.

Não use Batch para conversas em tempo real, fluxos em que um item depende da resposta do item anterior, indexação de documentos para RAG ou tarefas puramente determinísticas que não precisam de um modelo de IA. Para indexar conhecimento pesquisável, use [coleções de RAG](/docs/pt-br/rag/collections). Para uma única resposta imediata ao usuário, use [inferência](/docs/pt-br/inference/inference).

## Conceitos

### Workflow

O workflow é a receita do processamento. Ele define como os itens futuros serão tratados:

- título;
- instruções de processamento;
- modelo;
- schema esperado do resultado;
- ferramentas embutidas habilitadas;
- esforço de raciocínio, quando o modelo suporta;
- instruções de validação;
- limite de erros consecutivos antes de pausar;
- número máximo de retentativas por item.

Alterar um workflow afeta os próximos jobs e itens processados com aquela configuração. Use workflows separados quando a instrução, o schema, o modelo ou as regras de validação mudarem de forma relevante.

### Job

O job é uma execução concreta criada a partir de um workflow. Ele agrupa os itens de uma carga de trabalho, mantém estado, eventos e métricas.

Um job pode estar:

- `Active`: processando itens pendentes;
- `Paused`: parado manualmente ou pausado por limite, saldo, indisponibilidade temporária ou muitos erros consecutivos;
- `Finished`: concluído porque todos os itens foram processados ou porque foi encerrado.

### Item

O item é uma linha da lista importada. Cada linha vira uma entrada independente enviada ao modelo com as instruções do workflow.

Um item pode terminar como:

- `Finished`: processado com sucesso;
- `Refused`: o modelo recusou a entrada;
- `ExecutionError`: houve erro de execução ou inferência;
- `ValidationError`: a resposta não passou no schema ou na validação;
- `Cancelled`: o item foi cancelado/removido;
- `Pending`: ainda aguarda processamento.

Cada item também pode registrar prioridade, saída, confiança, custo e detalhes de validação.

## Como usar no console

No console da AIVAX, acesse **Batch**.

### Criar um workflow

Em **Workflows**, crie um workflow e configure:

1. **Basic:** defina um título, a instrução do processamento e o JSON Schema do resultado.
2. **Model:** escolha um modelo integrado disponível na conta, o esforço de raciocínio e as ferramentas embutidas que o modelo pode usar.
3. **Validation:** habilite uma segunda passagem de validação quando a resposta precisar ser conferida contra regras de negócio.
4. **Handling:** ajuste o limite de erros consecutivos e o máximo de retentativas por item.

Escreva a instrução como uma regra geral, não como uma pergunta única. O item importado será a entrada variável.

Exemplo de instrução:

```text
Classifique a empresa informada na entrada. Retorne o setor provável, uma justificativa curta e sinais encontrados no texto. Se a entrada não tiver informação suficiente, use setor "Indefinido".
```

Exemplo de schema:

```json
{
  "type": "object",
  "properties": {
    "sector": { "type": "string" },
    "reason": { "type": "string" },
    "signals": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["sector", "reason", "signals"],
  "additionalProperties": false
}
```

### Criar e executar um job

Depois de criar o workflow, crie um job para a carga que deseja processar. Importe uma lista em que cada linha é um item.

As linhas podem ser texto simples, CSV delimitado, URLs, IDs, JSON compacto ou qualquer formato que a instrução saiba interpretar. Para entradas estruturadas, prefira JSONL: um objeto JSON por linha.

Exemplo:

```jsonl
{"name":"Empresa A","description":"Marketplace B2B para autopeças"}
{"name":"Empresa B","description":"Escritório especializado em contratos trabalhistas"}
{"name":"Empresa C","description":"Rede regional de farmácias"}
```

Com os itens importados, inicie o job. A tela do job permite acompanhar:

- visão geral de progresso;
- itens pendentes, concluídos e com falha;
- custo já cobrado e custo previsto;
- confiança média;
- eventos do job;
- últimos itens processados;
- lista completa de itens com filtros por estado e confiança.

### Operar itens com falha

Use os filtros da lista para encontrar itens com erro de execução, erro de validação, recusa ou baixa confiança. Depois, você pode:

- retentar todos os erros;
- retentar apenas erros de execução;
- retentar apenas erros de validação;
- retentar itens concluídos com baixa confiança;
- remover pendentes, concluídos, erros ou todos os itens não em execução;
- abrir um item individual para revisar entrada, saída, estado, confiança e custo.

### Exportar resultados

Quando o job terminar, exporte os resultados em JSONL. Cada linha exportada contém metadados, entrada original e saída. Use essa exportação para importar em uma planilha, banco de dados, pipeline de dados ou etapa manual de revisão.

## Como usar pela API

Use a API quando quiser integrar Batch ao seu sistema interno, pipeline de dados ou automação. A autenticação segue o mesmo padrão da API da AIVAX.

### Criar workflow

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Criar job

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Jobs são criados pausados. Importe os itens antes de iniciar.

### Importar itens

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Linhas vazias são ignoradas. Cada linha não vazia vira um item pendente.

### Iniciar, pausar ou finalizar

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use `Paused` para pausar e `Finished` para encerrar.

### Monitorar

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para listar itens:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Filtros úteis:

- `state=Pending`, `Finished`, `Refused`, `ExecutionError`, `ValidationError` ou `Cancelled`;
- `confidence=high` para confiança maior ou igual a 80%;
- `confidence=low` para confiança menor que 30%;
- `filter=texto` para buscar no input;
- `limit=100` para ajustar o tamanho da lista dentro do limite permitido.

### Retentar e limpar

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Modos de retentativa:

- `errors`;
- `execution-error`;
- `validation-error`;
- `low-confidence`.

Para remover itens não em execução:

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Modos de remoção:

- `pending`;
- `finished`;
- `errors`;
- `all`.

### Exportar

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use `state=all`, `finished`, `errors` ou um estado específico. Também é possível combinar com `confidence=high` ou `confidence=low`.

## Custos, limites e pausas automáticas

Cada item processado gera custo de inferência de acordo com o modelo usado. Se a validação estiver habilitada, a validação executa uma segunda chamada de modelo e também pode gerar custo. Ferramentas embutidas habilitadas no workflow podem gerar custos ou consumir limites próprios.

O job pode pausar automaticamente quando:

- a conta não tem saldo disponível;
- o limite de processamento do plano foi atingido;
- o provedor de inferência está temporariamente indisponível;
- o job acumula muitos erros consecutivos;
- o usuário pausa manualmente o job.

Quando a pausa acontece por indisponibilidade temporária ou limite recuperável, a AIVAX pode retomar o job automaticamente depois. Quando a pausa acontece por falta de saldo, adicione saldo antes de retomar manualmente ou aguarde a retomada automática.

## Boas práticas

- Teste o workflow com poucos itens antes de importar uma lista grande.
- Use schemas restritivos com `required` e `additionalProperties: false` quando a saída será consumida por sistema.
- Inclua exemplos de entrada e saída na instrução quando o formato for ambíguo.
- Prefira uma linha por item; se precisar enviar objetos complexos, use JSONL.
- Mantenha a validação habilitada para tarefas sensíveis, como extração jurídica, financeira ou dados que entram em automações.
- Use `maxRetries` para corrigir falhas ocasionais, mas investigue erros repetidos no prompt ou no schema.
- Use `errorStopThreshold` baixo em workflows novos para evitar gastar em lote com uma configuração errada.
- Retente itens de baixa confiança separadamente; confiança baixa não significa erro, mas indica que a resposta merece revisão.
- Exporte resultados por estado quando houver revisão manual, por exemplo primeiro `finished`, depois `errors`.
