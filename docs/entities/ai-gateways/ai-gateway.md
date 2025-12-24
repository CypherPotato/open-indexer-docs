# AI Gateway

Os gateways de AI é um serviço que a AIVAX fornece para criar um túnel de inferência entre um modelo de LLM e uma base de conhecimento. Nele é possível:

- Criar um modelo com instruções personalizadas
- Usar um modelo provido por você através de um endpoint OpenAI compatível, ou usar um modelo disponibilizado pela AIVAX
- Personalizar parâmetros de inferência, como temperatura, top_p, prefill
- Usar uma coleção de conhecimento como fundação de respostas para IA

Dentre outros recursos. Com o AI Gateway, você cria um modelo pronto para uso, parametrizado e fundamentado nas instruções que você definir.

## Modelos

Você pode trazer um modelo de IA compatível com a interface OpenAI para o gateway de IA. Se você trazer seu modelo de IA, iremos cobrar apenas pela pesquisa de documentos anexada na IA. Você também pode usar um dos modelos abaixo que já estão prontos para começar com o AIVAX.

Ao usar um modelo, você perceberá que alguns são mais inteligentes que outros para determinadas tarefas. Alguns modelos são melhores com certas estratégias de obtenção de dados do que outros. Realize testes para encontrar o melhor modelo.

Você pode ver os modelos disponíveis na [página de modelos](/docs/models).

## Usar um gateway de IA

A AIVAX provê um endpoint compatível com a interface OpenAI através de um AI-gateway, o que facilita a integração do modelo criado pela AIVAX com aplicações e SDKs existentes. Vale ressaltar que somente algumas propriedades são suportadas.

Em um gateway de IA, você já configura os parâmetros do modelo, como System Prompt, temperatura e nome do modelo. Ao usar esse endpoint, alguns valores do gateway podem ser sobrescritos pela requisição.

> [!TIP]
>
> Para entender melhor como usar System Prompt em comparação com Skills e RAG, consulte nosso [guia completo de comparação](/docs/concepts-comparison).

#### Requisição

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat-completions
    </span>
</div>

```json
{
    "model": "0198683a-2b6d-7066-9598-6ea119c219f2",
    "messages": [
        {
            "role": "user",
            "content": "Qual a capital da França?"
        }
    ],
    "stream": false,
    "metadata": {
        "foo": "bar"
    }
}
```

Para melhor detalhamento da referência da API, consulte a [referência da API](https://inference.aivax.net/apidocs#ChatCompletions).

## Uso com SDKs

Por prover endpoints compatíveis com a interface OpenAI, a AIVAX é totalmente compatível com SDKs existentes, facilitando a integração plug-and-play.

Veja o exemplo abaixo:

```python
from openai import OpenAI
 
client = OpenAI(
    base_url="https://inference.aivax.net/api/v1",
    api_key="oky_gr5u...oqbfd3d9y"
)
 
response = client.chat.completions.create(
    model="my-gateway:50c3", # you can also provide your ai-gateway full ID here
    messages=[
        {"role": "user", "content": "Explain why AI-gateways are useful."}
    ]
)
 
print(response.choices[0].message.content)
```

No momento, a AIVAX só suporta o formato `chat/completions`. No futuro, pretendemos criar suporte para a API Responses.