# Bem-vindo

Boas vindas ao Open Indexer. Nosso serviço torna mais fácil o desenvolvimento de modelos de IA inteligentes que usam uma base de conhecimento providenciada por você para conversar com o usuário, responder perguntas, fornecer informações em tempo real e mais.

Para começar, todos os endpoints devem ser feitos na URL de produção da AIVAX:

```text
https://inference.aivax.net/
```

## Conceitos e definições

Entenda os conceitos usados pela API abaixo:

- **Conta:** representa uma conta do usuário, que possui um token de autenticação.
    - **Coleção:** representa uma coleção de documentos de conhecimento. Um usuário pode ter várias coleções de documentos.
        - **Documento:** representa um fato, um único conhecimento e um item de uma coleção. Uma coleção pode ter vários documentos.
    - **AI Gateway:** representa um gateway de IA que se beneficia ou não de uma coleção de conhecimento, como um middleware de conhecimento *plug-and-play* para um modelo.
        - **Modelo embutido:** representa um modelo de IA que o Open Indexer provê para o usuário.
        - **Chat client:** representa uma interface de usuário que disponibiliza o AI gateway através de um chat interagível online.
            - **Sessão de chat**: abriga uma conversa e contexto de um cliente de chat.

## Lidando com erros

Todos os erros da API retornam uma resposta HTTP com um status não OK (nunca 2xx ou 3xx), e sempre seguindo o formato JSON:

```json
{
    "error": "Uma mensagem explicando o erro",
    "details": {} // um objeto contendo informações relevantes sobre o erro. Na maioria das vezes é nulo
}
```