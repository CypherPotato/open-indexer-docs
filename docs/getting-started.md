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