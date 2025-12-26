# RAG

A AIVAX fornece um serviço autônomo de RAG (Retrieval-Augmented Generation) e permite usar esses documentos em conversas de chat com seus [AI gateways](/docs/entities/ai-gateways/ai-gateway). Quando o usuário faz uma pergunta de domínio ou específica, um gateway de IA incorpora automaticamente documentos relevantes para responder aquela pergunta.

Você pode usar RAG diretamente, sem associar à um AI gateway, através de uma coleção. As coleções são grupos de [documentos](/docs/entities/documents) que possuem informações que serão obtidas posteriormente. Esses documentos são armazenados de forma persistente em um banco de dados de similaridade.

## Coleções

As coleções permitem você enviar, salvar, gerenciar e consultar semanticamente por documentos armazenadas nela. Você pode associar uma coleção à um gateway de IA ou consultar diretamente nela através da API.

Pela interface da AIVAX, é possível enviar lotes de documentos e criar documentos com chunking, e associá-los como um documento só no resultado da incorporação.

## Custos e limites

Não há qualquer limite de armazenamento em coleções, apenas os [limites de taxa](/docs/limits) já existentes na conta. Coleções 