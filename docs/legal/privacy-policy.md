# Política de Privacidade

Versão: 1.1  
Data de vigência: 05 de outubro de 2025
Última atualização anterior: 30 de julho de 2025

---

Bem-vindo à AIVAX. Esta Política de Privacidade descreve como a AIVAX coleta, utiliza, armazena, compartilha e protege informações em seus serviços de inferência de IA. Nosso compromisso é com transparência, segurança e conformidade com a Lei Geral de Proteção de Dados (LGPD) e o Marco Civil da Internet.

Ao utilizar os serviços da AIVAX, o Gestor da Conta reconhece e concorda com os termos desta política. Esta política não constitui aconselhamento jurídico; recomendamos avaliação pelo departamento jurídico do Gestor.

### 1. Definições

- **AIVAX:** Empresa provedora da plataforma e dos serviços de orquestração de modelos de IA.
- **Gestor da Conta AIVAX ("Gestor")**: Pessoa física ou jurídica que cria e administra a conta e integra a API.
- **Usuário Final:** Indivíduo que interage com a aplicação do Gestor que consome a API AIVAX.
- **Dados de Conta:** Dados cadastrais e administrativos (ex.: nome, e-mail, empresa, cargo, identificadores internos, preferências, configurações de chave de API).
- **Dados de Faturamento:** Dados necessários a cobrança e notas (ex.: CNPJ/CPF, razão social, endereço, meios de pagamento através de processador terceirizado).
- **Dados de Inferência:** Entradas (prompts, texto, instruções, metadados) enviadas aos modelos e as saídas/inferências resultantes. (Equivalente aos termos "Conteúdo de Entrada" + "Conteúdo Gerado" definidos nos Termos de Uso.)
- **Conversas:** Conjunto estruturado de interações de Inferência (entrada + resposta + metadados de contexto).
- **Metadados Técnicos:** Logs de requisições, IP, timestamp, latência, identificadores de sessão, uso de tokens, códigos de resposta, assinaturas de segurança.
- **Operadora:** AIVAX quando processa dados segundo instruções do Gestor (dados de inferência/conversas).
- **Controladora:** AIVAX quando define finalidades para dados de conta, faturamento, segurança e compliance.
- **Subprocessador:** Terceiro contratado pela AIVAX para apoiar processamento (infraestrutura, monitoramento, billing, e-mail, provedores de modelo, etc.).

---

### 2. Papéis de Tratamento

| Tipo de Dado | Papel da AIVAX | Papel do Gestor |
|--------------|----------------|-----------------|
| Dados de Conta | Controladora | Titular/Controlador de sua própria relação interna |
| Dados de Faturamento | Controladora (cumprimento legal e contratual) | Fornece/verifica |
| Dados de Inferência / Conversas | Operadora | Controlador (define conteúdo e finalidade) |
| Metadados Técnicos | Controladora (segurança / melhoria) e Operadora (execução técnica) | Controlador (origem) |

Quando atuar como Operadora, a AIVAX seguirá estritamente as instruções do Gestor, conforme chamadas de API e configurações de painel.

Para coerência contratual, em caso de divergência terminológica entre esta política e os Termos de Uso, prevalecerá a equivalência: Dados de Inferência = Conteúdo de Entrada + Conteúdo Gerado.

---

### 3. Categorias de Dados Coletados

1. **Fornecidos diretamente pelo Gestor:** Dados de Conta, credenciais (hash ou tokens), preferências, configurações de uso, organização, chaves de API geradas.  
2. **Gerados pelo uso:** Metadados técnicos (logs, estatísticas agregadas, contagem de tokens, latências, uso por modelo).  
3. **Dados de Inferência e Conversas:** Conteúdo textual e demais formatos enviados aos modelos e retornos.  
4. **Suporte e Comunicação:** Mensagens em tickets, e-mails enviados ao suporte ou canais de contato.  
5. **Faturamento:** Dados fiscais e de pagamento (processados em parte por terceiros especializados).  
6. **Dados Agregados/Anonimizados:** Métricas derivadas que não identificam o Gestor ou usuários finais.  

Não coletamos deliberadamente categorias especiais de dados pessoais sensíveis (art. 5º, II, LGPD) salvo se o Gestor optar por enviar nos Dados de Inferência. Nesse caso, o Gestor declara possuir base legal adequada e consentimento quando exigido.

---

### 4. Finalidades, Bases Legais e Retenção

| Categoria | Finalidade Principal | Base Legal (LGPD) | Prazo Indicativo de Retenção* |
|-----------|---------------------|-------------------|-------------------------------|
| Dados de Conta | Criação, gestão da conta, autenticação, comunicações operacionais | Execução de contrato (art. 7º, V) | Enquanto a conta estiver ativa + até 6 meses após encerramento (auditoria) |
| Dados de Faturamento | Cobrança, emissão fiscal, prevenção a fraudes (inclui regras de créditos, expiração e reembolsos – ver Termos de Uso) | Obrigações legais (art. 7º, II) / Execução de contrato | 5 a 10 anos (exigências fiscais) |
| Metadados Técnicos | Segurança, prevenção a abuso, monitoramento de desempenho | Legítimo interesse (art. 7º, IX) + Execução de contrato | 180 dias (logs principais) / até 1 ano (segurança estendida) |
| Dados de Inferência | Execução da inferência solicitada | Execução de contrato | Tempo operacional (padrão: até 30 dias) |
| Conversas | Histórico para monitoramento, auditoria técnica, depuração | Legítimo interesse (balanceado) + Execução de contrato | Até 30 dias (padrão) ou menor se configurado; exportáveis e excluíveis |
| Suporte | Resolver dúvidas, incidentes, compliance | Execução de contrato / Legítimo interesse | Até 12 meses após resolução |
| Dados Agregados/Anonimizados | Métricas de capacidade, melhoria de confiabilidade | Fora do escopo da LGPD (dados anonimizados) | Indeterminado (enquanto irreversivelmente anonimizados) |

*Os prazos podem ser encurtados mediante solicitação, exceto onde houver obrigação legal ou necessidade de defesa de direitos. Backups cifrados podem reter dados por até 90 dias adicionais até rotação completa; dados expurgados não retornam a produção após restauração, aplicando-se reprocessamento de exclusões.

---

### 5. Não Utilização para Treinamento Próprio

A AIVAX **não** utiliza Dados de Inferência ou Conversas para treinar modelos proprietários, criar perfis de uso individualizados ou monetizar dados. Uso restrito à prestação do serviço contratado.

---

### 6. Armazenamento e Exclusão de Conversas

O Gestor pode: (i) ajustar retenção (quando a funcionalidade existir), (ii) excluir conversas individualmente ou em lote, (iii) solicitar purga total. Exclusão é definitiva e irreversível em produção; registros podem persistir temporariamente em backups até a janela de retenção técnica.

---

### 7. Direitos dos Titulares (Art. 18, LGPD)

Quando a AIVAX atuar como Controladora (ex.: dados de conta), os titulares podem exercer: confirmação de tratamento; acesso; correção; anonimização, bloqueio ou eliminação; portabilidade; informação sobre compartilhamentos; revogação de consentimento (se aplicável); oposição a tratamento baseado em legítimo interesse; revisão de decisões automatizadas.  
Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado). Prazo padrão de resposta: até 15 dias. Poderemos solicitar comprovação de identidade. Para dados em que atuamos como Operadora, direcionaremos o titular ao Gestor Controlador.

---

### 8. Encarregado (DPO)

Encarregado pelo Tratamento (Art. 41): **(Identidade anonimizada)** – Contato: **wm@aivax.net**.  
Funções: canal de comunicação com titulares e ANPD, orientação interna de conformidade, suporte a avaliações de impacto.

---

### 9. Subprocessadores

Utilizamos subprocessadores para: infraestrutura em nuvem, balanceamento, monitoramento de desempenho, e-mail transacional, faturamento, provedores de modelo, detecção de abuso.  
Publicaremos (ou já publicamos) lista atualizada em página dedicada: (link a adicionar). Notificaremos alterações materiais antes de entrada em vigor sempre que exigido contratualmente; o uso continuado após prazo de objeção razoável constitui aceitação.

---

### 10. Provedores de Modelos de Terceiros

Ao selecionar um modelo específico, o Gestor também se sujeita às políticas do respectivo provedor. Alguns provedores podem usar dados de inferência para melhoria ou treinamento. O Gestor deve validar a adequação antes de enviar dados pessoais ou sensíveis. A AIVAX não controla políticas de terceiros e recomenda a leitura prévia.

---

### 11. Transferências Internacionais de Dados

Dados podem ser processados ou armazenados em datacenters fora do Brasil (ex.: EUA, UE), utilizando provedores que adotam padrões de segurança alinhados às melhores práticas internacionais. Aplicamos: (i) contratos com cláusulas de proteção; (ii) criptografia; (iii) minimização; (iv) segregação lógica. Caso a transferência se enquadre em hipóteses específicas do art. 33, adotaremos salvaguardas contratuais e técnicas apropriadas.

---

### 12. Segurança da Informação (Camadas)

Medidas principais (sem divulgação de segredos operacionais):
- Criptografia em trânsito (TLS 1.2+ / 1.3) e em repouso (AES-256 ou equivalente).
- Controle de acesso baseado em papéis e princípio de mínimo privilégio.
- Segregação de ambientes (desenvolvimento, staging, produção) e pipeline com revisões.
- Logs de auditoria para ações administrativas e acessos a dados delicados.
- Monitoramento de integridade, alertas de anomalia e limitações automáticas de taxa (rate limiting).
- Testes periódicos de vulnerabilidade e correções priorizadas por criticidade.
- Hardening de infraestrutura e rotação de credenciais seguras.
- Pseudonimização ou truncamento de campos sensíveis em logs técnicos.

Nenhuma medida de segurança é absoluta; mantemos programa contínuo de aprimoramento.

---

### 13. Gestão de Incidentes

Incidentes relevantes de segurança serão avaliados conforme impacto, natureza dos dados e risco a titulares. Caso exigido, notificaremos Gestores afetados e a ANPD com: (i) descrição do evento; (ii) dados possivelmente envolvidos; (iii) medidas já tomadas e mitigação planejada; (iv) orientações ao Gestor. Mantemos plano de resposta revisto periodicamente.

---

### 14. Decisões Automatizadas

Empregamos automações para detecção de abuso, limitação de requisições e prevenção a fraude de uso. Estas automações podem restringir temporariamente acessos ou chaves. Não realizamos decisões exclusivamente automatizadas que produzam efeitos jurídicos ou signifcativos sobre indivíduos. O Gestor pode solicitar revisão humana via suporte.

---

### 15. Cookies e Tecnologias de Rastreamento

Na interface de painel podemos utilizar cookies estritamente necessários (sessão/autenticação) e possivelmente cookies funcionais para preferências. Não usamos cookies de publicidade comportamental. Caso venhamos a empregar analytics de terceiros, atualizaremos esta seção e forneceremos mecanismo de consentimento quando aplicável. O Gestor pode gerenciar cookies via configurações de navegador; a desativação de cookies estritamente necessários pode limitar funcionalidades.

---

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não se destinam a menores de 18 anos, exceto menores a partir de 16 anos legalmente emancipados nos termos da legislação brasileira. Não coletamos intencionalmente dados pessoais de menores não emancipados. Caso identifiquemos tratamento indevido, adotaremos medidas para remoção rápida e notificação ao Gestor. O Gestor é responsável por implementar verificações quando o uso envolver público potencialmente menor de idade.

---

### 17. Dados Sensíveis

Não exigimos o envio de dados sensíveis. O Gestor deve evitar enviar dados de saúde, biométricos, genéticos, crenças religiosas, opinião política ou outros dados especiais, a menos que possua base legal apropriada e comunique claramente os titulares. AIVAX poderá aplicar filtros ou bloqueios para tipos de conteúdo considerados de alto risco.

---

### 18. Limitações de Uso e Conteúdos Proibidos

É proibido utilizar a plataforma para armazenar ou processar conteúdos ilícitos, violadores de direitos, malware, material difamatório ou que infrinja direitos de terceiros. Podemos suspender ou bloquear chaves mediante suspeita razoável de violação, preservando logs necessários para investigação. Medidas de suspensão e rescisão seguem também o disposto nos Termos de Uso (Seções 2.1 e 5).

---

### 19. Anonimização e Dados Agregados

Podemos gerar estatísticas agregadas (ex.: volume de tokens, taxa de erro, distribuição por modelo) sem identificação direta de indivíduos ou do conteúdo específico das Conversas. Tais dados não retornam à forma identificável.

---

### 20. Exportação e Portabilidade

Fornecemos (ou forneceremos) mecanismos para exportar histórico de Conversas e métricas em formatos estruturados (JSON), limitados por janelas de retenção e segurança. Para dados mantidos enquanto Operadora, solicitações de titulares devem ser encaminhadas ao Gestor Controlador.

---

### 21. Backups e Recuperação de Desastre

Backups cifrados são executados em janelas periódicas e retidos por até 90 dias para continuidade operacional. Após exclusões solicitadas, marcamos registros para expurgo lógico e impedimos reintrodução após restauração mediante reprocessamento de fila de exclusões.

---

### 22. Alterações a esta Política

Alterações materiais serão notificadas por e-mail ao Gestor ou aviso destacado no painel com antecedência razoável (preferencialmente 15 dias), salvo exigência legal ou segurança urgente. A continuidade de uso após a vigência constitui aceitação.

---

### 23. Canal de Contato e Reclamações

Dúvidas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**.  
Se não houver solução satisfatória, o titular pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

---

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Alterações |
|--------|------------------|-----------------------|
| 1.0 | 30/07/2025 | Versão inicial publicada |
| 1.1 | 05/10/2025 | Inclusão de bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança ampliada, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

---

### 25. Contato Geral

Legal / Privacidade: **legal@aivax.net** – Encarregado: **wm@aivax.net**.  
Usar sempre canais oficiais para evitar engenharia social.

---

### 26. Disposições Finais

Caso alguma cláusula desta política seja considerada inválida, as demais permanecem em pleno vigor. Em caso de conflito entre esta política e termos específicos de produto, prevalecerá a disposição mais protetiva aos titulares, salvo obrigação legal diversa.

---

Se restarem dúvidas sobre qualquer ponto desta política, entre em contato. Mantemos compromisso com melhoria contínua de privacidade e segurança.

> Nota: Esta política poderá ser complementada por um Acordo de Processamento de Dados (DPA) específico entre AIVAX e o Gestor, quando aplicável.