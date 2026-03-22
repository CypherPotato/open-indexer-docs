# Shell

A AIVAX oferece um ambiente de shell virtual que pode ser utilizado por assistentes agênticos para executar comandos de terminal. Este recurso é especialmente útil para tarefas como automação, gerenciamento de sistemas, execução de scripts e outras operações que exigem interação com o sistema operacional.

O ambiente de shell possibilita mover ferramentas usadas pelo agente para o lado do shell, transformando-as em uma ferramenta de CLI. Isso é vantajoso para quando você possui centenas de ferramentas e não quer sobrecarregar o contexto do modelo, ou para quando as ferramentas possuem uma interface de linha de comando mais complexa que seria difícil de ser chamada diretamente pelo modelo.

## Adaptando ferramentas para shell

Na interface virtual do shell, ferramentas de manipulação padrão do sistema operacional estão disponíveis, como `grep`, `awk`, `sed`, `curl`, `wget`, entre outras. Dessa forma, você pode adaptar suas ferramentas para retornarem saídas brutas ou longas, e o modelo usar as ferramentas de manipulação de texto do shell para extrair as informações relevantes, exemplo:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

Na linha acima, `get-users` é uma ferramenta personalizada que retorna uma lista de usuários em formato CSV. O comando `grep` filtra os resultados para encontrar "John Doe", e o `awk` extrai e formata as colunas desejadas. Essa ferramenta pode ter sido definida por [MCP](/docs/tools/mcp), [ferramentas embutidas](/docs/builtin-tools) ou ser uma [ferramenta de protocolo](/docs/protocol-functions).

Não é possível virtualizar ferramentas que executam no lado do cliente no ambiente bash. Ao tentar fazer isso, um erro será retornado na API. Defina ferramentas em white-list ou black-list da shell para controlar quais ferramentas estão disponíveis para serem usadas no ambiente de shell.

## Persistência de dados

É possível definir persistência de dados para o ambiente da shell. Quando ativado, o usuário de inferência (através do parâmetro `$.user` ou `$.tag` do cliente de chat) terá um ambiente de shell virtual exclusivo, o que pode ser acessado em diferentes conversas e sessões. Isso é útil para quando o agente precisa manter um estado entre sessões, como arquivos temporários, logs ou outros dados que precisam ser persistidos.

Se essa persistência estiver desativada, o ambiente de shell é descartado após uma iteração de inferência.

## Emulação

O ambiente de shell é emulado em um ambiente sandbox e não é conectado ao sistema operacional real. Isso significa que certas ferramentas como `apt-get` não estarão disponíveis para o modelo. O ambiente é projetado para ser seguro e isolado, evitando qualquer impacto no sistema real. Ele é ideal para tarefas de processamento de texto, manipulação de dados e outras operações que não exigem acesso direto ao sistema operacional.

O ambiente de shell é capaz de:
- Executar comandos de I/O básicos, como leitura e escrita de arquivos, manipulação de texto e execução de scripts.
- Acessar à internet para fazer requisições HTTP usando ferramentas como `curl` ou `wget`.
- Compactar e descompactar arquivos usando ferramentas como `tar` e `zip`.
- Ler conteúdo de diversos formatos de arquivo para markdown.
- Executar scripts bash.