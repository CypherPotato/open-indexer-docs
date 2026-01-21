# Boas Práticas de RAG

Para obter os melhores resultados com a indexação e busca semântica, a qualidade dos seus documentos é fundamental. A forma como você estrutura e escreve seus documentos impacta diretamente na capacidade do modelo de recuperar a informação correta.

## Estrutura e Tamanho

Um documento deve representar um trecho limitado e autossuficiente de conhecimento.

- **Tamanho ideal**: Mantenha documentos entre 20 e 700 palavras.
    - **Muito curto (< 20 palavras)**: Pode não ter contexto suficiente para ser encontrado semanticamente.
    - **Muito longo (> 700 palavras)**: Pode ter seu conteúdo truncado, afetando a qualidade da indexação, ou misturar muitos tópicos diferentes, confundindo a busca.

## O que Fazer e O que Evitar

### ❌ Não faça

- **Documentos muito curtos ou vazios**: Evite criar documentos com 10 ou menos palavras.
- **Documentos gigantes**: Não envie documentos com milhares de palavras; quebre-os em partes menores.
- **Mistura de assuntos**: Não fale sobre múltiplas coisas desconexas em um mesmo documento (ex: "Como ligar o carro" e "Preço da gasolina" no mesmo texto).
- **Mistura de idiomas**: Mantenha o documento em uma única língua para melhor performance do embedding.
- **Linguagem implícita**: Evite textos onde o sujeito ou contexto não está claro (ex: "Ele é azul" - quem é ele?).
- **Linguagem excessivamente técnica**: Evite indexar JSONs puros ou logs de código sem explicação textual.

### ✅ Faça

- **Seja explícito**: O documento deve fazer sentido sozinho.
- **Foco único**: Cada documento deve cobrir um único tópico ou conceito.
- **Repetição de palavras-chave**: Use termos importantes explicitamente.
    - *Exemplo*: Prefira "A cor do Honda Civic 2015 é amarela" ao invés de "a cor do carro é amarelo".
- **Linguagem natural**: Escreva como um humano falaria ou explicaria o assunto.
- **Use Tags**: Utilize tags para categorizar seus documentos e facilitar filtros.

## Dicas Adicionais

- **Independência de Contexto**: Imagine que o documento será lido fora de ordem. Ele ainda faz sentido? Se a resposta for não, reescreva-o para ser independente.
- **Metadados**: Use o campo de metadados para armazenar informações estruturadas (fonte, autor, data) que não precisam ser pesquisadas semanticamente mas são úteis para referência.
- **Chunks**: Se você tem um PDF grande, faça o "chunking" (divisão) dele em parágrafos ou seções lógicas antes de indexar.

Seguir essas diretrizes garantirá que o sistema RAG recupere as informações mais relevantes para seus usuários.
