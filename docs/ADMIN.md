# 👨‍💼 Painel Administrativo

Documentação completa do painel de administração da Strykers.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Alistamentos Pendentes](#alistamentos-pendentes)
- [Alistamentos Recusados](#alistamentos-recusados)
- [Membros Registrados](#membros-registrados)
- [Gerenciamento de Eventos](#gerenciamento-de-eventos)
- [Sistema de Condecorações](#sistema-de-condecorações)
- [Filtros Avançados](#filtros-avançados)
- [Boas Práticas](#boas-práticas)

## 🎯 Visão Geral

O painel administrativo centraliza todas as operações de gestão da organização. Disponível apenas para usuários com permissões administrativas.

### Acesso

Menu > **ADMINISTRAÇÃO**

### Seções Principais

1. **Alistamentos Pendentes** - Aprovação de novos membros
2. **Alistamentos Recusados** - Histórico de recusas
3. **Membros Registrados** - Gerenciamento completo
4. **Calendário de Eventos** - Gestão de eventos e missões

## ⏳ Alistamentos Pendentes

### Visão Geral

Lista todos os usuários que:

- Confirmaram e-mail
- Aguardam aprovação administrativa
- Status: `aguardando_aprovacao`

### Informações Exibidas

Para cada alistamento:

- **Nome/Nick** do solicitante
- **E-mail** de cadastro
- **WhatsApp** (se fornecido)
- **Data da Solicitação**
- **Ações** disponíveis

### Aprovar Alistamento

#### Como Fazer

1. **Localize o alistamento**

   - Na tabela de pendentes

2. **Clique no botão verde "✓"**

   - Confirmação será solicitada

3. **Confirme a aprovação**
   - ⚠️ Esta ação cria um novo membro

#### O Que Acontece

1. **Membro criado automaticamente**:

   ```javascript
   {
     nome: "Nome do usuário",
     patente: "Recruta",
     atribuicao: "Infantaria",
     medalhas: 0,
     dataRegistro: "Data atual",
     situacao: "Ativo",
     missoes: 0,
     forcaEspecial: "Não",
     observacoes: "",
     eventosParticipados: [],
     historico: "",
     valorHistorico: 0,
     medalhasDetalhadas: []
   }
   ```

2. **Status do usuário atualizado**:

   - De: `aguardando_aprovacao`
   - Para: `aprovado`

3. **Removido de pendentes**:

   - Some da lista de alistamentos pendentes

4. **Aparece em membros**:

   - Adicionado à lista de membros registrados

5. **Usuário pode fazer login**:
   - Acesso liberado imediatamente

#### Notificação (Manual)

⚠️ **IMPORTANTE**: O sistema não envia e-mails automaticamente.

Recomenda-se:

1. Copiar e-mail do alistamento
2. Enviar mensagem manual:

   ```
   Assunto: Alistamento Aprovado - Strykers

   Olá [NOME],

   Seu alistamento na Strykers foi APROVADO!

   Você já pode fazer login no sistema com suas credenciais.
   Sua patente inicial é Recruta.

   Bem-vindo(a) à organização!

   Disciplina. Ordem. Supremacia.

   - Comando Strykers
   ```

### Recusar Alistamento

#### Como Fazer

1. **Localize o alistamento**

   - Na tabela de pendentes

2. **Clique no botão vermelho "✕"**

   - Confirmação será solicitada

3. **Confirme a recusa**
   - ⚠️ Usuário será notificado

#### O Que Acontece

1. **Status do usuário atualizado**:

   - De: `aguardando_aprovacao`
   - Para: `recusado`

2. **Movido para recusados**:

   - Aparece na lista de alistamentos recusados

3. **Não pode fazer login**:

   - Acesso bloqueado

4. **Mensagem ao tentar login**:
   ```
   ❌ Seu cadastro foi recusado.
   Se não concorda com a decisão, entre em
   contato via Discord com os responsáveis.
   ```

#### Notificação (Manual)

Recomenda-se enviar e-mail:

```
Assunto: Alistamento - Strykers

Olá [NOME],

Infelizmente, seu alistamento na Strykers
não foi aprovado neste momento.

Motivo: [EXPLICAR RAZÃO]

Se tiver dúvidas, entre em contato conosco
via Discord: [LINK DO DISCORD]

Atenciosamente,
Comando Strykers
```

#### Motivos Comuns de Recusa

- Nome não corresponde ao RSI
- Histórico problemático conhecido
- Requisitos mínimos não atendidos
- Informações falsas ou incompletas
- Comportamento inadequado conhecido

## ❌ Alistamentos Recusados

### Visão Geral

Histórico de todos os alistamentos recusados.

### Informações Exibidas

- Nome do solicitante
- E-mail
- WhatsApp
- Data de solicitação
- Ações disponíveis

### Realistar Usuário

Dar segunda chance a alistamento recusado.

#### Como Fazer

1. **Localize na tabela de recusados**

2. **Clique em "🔄 Realistar"**

3. **Confirme a ação**

#### O Que Acontece

1. **Status atualizado**:

   - De: `recusado`
   - Para: `aguardando_aprovacao`

2. **Movido para pendentes**:

   - Aparece na lista de alistamentos pendentes

3. **Pode ser aprovado novamente**:
   - Processo normal de aprovação

### Excluir Alistamento

Remoção permanente do sistema.

#### ⚠️ ATENÇÃO

Esta ação é **IRREVERSÍVEL** e **PERMANENTE**.

#### Como Fazer

1. **Localize na tabela de recusados**

2. **Clique em "🗑️ Excluir"**

3. **Confirme exclusão permanente**

#### O Que Acontece

1. **Dados deletados permanentemente**:

   - Removido de alistamentos recusados
   - Removido de usuários
   - Sem possibilidade de recuperação

2. **E-mail liberado**:
   - Pode ser usado em novo cadastro

#### Quando Usar

- Dados duplicados
- Testes administrativos
- Solicitação do usuário
- Limpeza de registros antigos

## 👥 Membros Registrados

### Visão Geral

Tabela completa de todos os membros aprovados da organização.

### Informações Exibidas

Cada membro mostra:

- Nome
- Patente
- Atribuição
- Data de Registro
- Situação (Ativo/Reservista/Desertor)
- Força Especial
- Medalhas (com visualização 👁️)
- Missões (com visualização 👁️)
- E-mail
- WhatsApp
- Observações (ícone 📋)
- Histórico (ícone 📋)
- Ações (Editar ✏️, Condecorar ⭐, Excluir 🗑️)

### Editar Membro

Ver detalhes em [MEMBERS.md](MEMBERS.md)

**Campos editáveis:**

- Nome
- Foto
- Patente
- Atribuição
- Data de Registro
- Situação
- Força Especial
- Observações
- Histórico
- Valor Histórico

### Condecorar Membro

Ver documentação completa em [MEDALS.md](MEDALS.md)

**Processo:**

1. Clique em ⭐
2. Selecione medalha
3. Adicione observações
4. Confirme condecoração

### Excluir Membro

Remove membro da lista ativa.

#### Como Fazer

1. **Clique em 🗑️**

2. **Confirme a ação**

#### O Que Acontece

1. **Membro removido**:

   - Some da lista de membros registrados

2. **Movido para recusados**:

   - Aparece em alistamentos recusados
   - Mantém dados para histórico

3. **Usuário atualizado**:

   - Status: `recusado`
   - Não pode mais fazer login

4. **Pode ser realistado**:
   - Admin pode reverter depois

⚠️ **NOTA**: Não é exclusão permanente, é remoção reversível.

### Visualizar Observações e Histórico

#### Ícone 📋

Ao clicar:

- Modal abre com texto completo
- Observações ou Histórico
- Apenas leitura (edite pelo ✏️)

## 📅 Gerenciamento de Eventos

Ver documentação completa em [EVENTS.md](EVENTS.md)

### Calendário Administrativo

Localizado na parte inferior do painel admin.

### Diferenças da Visão Pública

**Modo Admin:**

- Criar eventos
- Editar eventos
- Excluir eventos (não finalizados)
- Gerenciar participantes
- Finalizar eventos
- Reabrir eventos

**Modo Público:**

- Apenas visualizar
- Ver detalhes
- Ver participantes

### Criar Novo Evento

1. **Botão "➕ Cadastrar Evento"**

   - No topo do painel

2. **Preencher formulário**:

   - Nome do Evento
   - Categoria
   - Data
   - Horário
   - Descrição

3. **Clicar em "✓ Registrar"**

### Editar Evento

1. **Clique no evento no calendário**

2. **Clique em "✏️ Editar Evento"**

3. **Modifique campos**

4. **Salve alterações**

⚠️ **Limitação**: Apenas eventos não finalizados

### Gerenciar Participantes

1. **Abra detalhes do evento**

2. **Clique em "+ Gerenciar"**

3. **Adicione/Remova participantes**

⚠️ **Limitação**: Apenas eventos não finalizados

### Finalizar Evento

Ver detalhes em [EVENTS.md](EVENTS.md)

**Processo:**

1. Clique em "✔ Finalizar Evento"
2. Confirme ação
3. Missões contabilizadas automaticamente
4. Evento bloqueado para edição

### Excluir Evento

1. **Abra detalhes do evento**

2. **Clique em "🗑 Excluir Evento"**

3. **Confirme exclusão**

⚠️ **Limitação**: Apenas eventos não finalizados

## 🎖️ Sistema de Condecorações

Ver documentação completa em [MEDALS.md](MEDALS.md)

### Condecorar

**Acesso:**

- Tabela de membros > ⭐

**Medalhas disponíveis:**

1. Medalha de Mérito Operacional
2. Medalha de Defesa Avançada
3. Medalha de Elite Aérea
4. Medalha de Infantaria Pesada
5. Insígnia da Águia Dourada
6. Distintivo de Honra Logística

### Remover Condecoração

**Acesso:**

- Painel de condecoração > "🗑️ Remover Condecoração"

**Processo:**

1. Selecione medalha a remover
2. Confirme remoção
3. Medalha deletada permanentemente

## 🔍 Filtros Avançados

### Filtros Disponíveis

1. **Pesquisa por Nome**

   - Busca em tempo real
   - Case insensitive

2. **Filtro de Patente**

   - Dropdown com todas as patentes
   - Mostra apenas da patente selecionada

3. **Filtro de Situação**

   - Ativo
   - Reservista
   - Desertor

4. **Filtro de Força Especial**

   - S.T.O.R.M.
   - G.H.O.S.T.
   - Não

5. **Filtro de Data**
   - Selecione data específica
   - Mostra registrados naquela data

### Combinar Filtros

Você pode aplicar múltiplos filtros simultaneamente:

**Exemplo 1: Membros S.T.O.R.M. ativos**

```
Situação: Ativo
Força Especial: S.T.O.R.M.
```

**Exemplo 2: Capitães da Força Aérea**

```
Patente: Capitão
(busque na tabela por atribuição)
```

**Exemplo 3: Registrados em data específica**

```
Data: 15/01/2024
```

### Limpar Filtros

Botão "Limpar" remove todos os filtros aplicados.

## 💡 Boas Práticas

### Aprovação de Alistamentos

1. **Verifique informações**

   - Nome condiz com RSI?
   - E-mail válido?
   - WhatsApp fornecido?

2. **Pesquise histórico**

   - Verifique se é conhecido
   - Busque referências
   - Consulte outros membros

3. **Responda rapidamente**

   - Não deixe acumular pendentes
   - Máximo 48-72h de espera

4. **Comunique decisões**
   - Sempre notifique aprovações
   - Explique recusas quando apropriado

### Gerenciamento de Membros

1. **Mantenha dados atualizados**

   - Revise perfis periodicamente
   - Corrija informações
   - Atualize situações

2. **Use observações**

   - Registre informações importantes
   - Notas de comportamento
   - Avisos administrativos

3. **Preencha histórico**

   - Para membros veteranos
   - Reconhece contribuições passadas

4. **Promova com critério**
   - Base-se em mérito
   - Tempo de serviço
   - Participação ativa

### Gerenciamento de Eventos

1. **Planeje com antecedência**

   - Crie eventos com dias de antecedência
   - Descrições detalhadas
   - Requisitos claros

2. **Atualize participantes**

   - Adicione confirmados
   - Remova ausentes

3. **Finalize no mesmo dia**
   - Não deixe eventos antigos abertos
   - Contabilize missões rapidamente

### Sistema de Condecorações

1. **Seja criterioso**

   - Mantenha valor das medalhas
   - Não banalizar condecorações

2. **Documente razões**

   - Sempre adicione observações
   - Seja específico

3. **Distribua com justiça**
   - Reconheça todas especialidades
   - Não favoreça grupos

## 📊 Relatórios e Análises

### Métricas Importantes

**Membros:**

- Total de membros ativos
- Distribuição por patente
- Membros por atribuição
- Taxa de retenção

**Eventos:**

- Eventos por mês
- Participação média
- Tipos mais frequentes

**Alistamentos:**

- Taxa de aprovação
- Tempo médio de resposta
- Motivos de recusa

### Como Analisar

Use os filtros para gerar insights:

**Análise de Atividade:**

```
1. Filtre "Situação: Ativo"
2. Conte total
3. Compare com mês anterior
```

**Análise de Hierarquia:**

```
1. Filtre cada patente
2. Conte membros
3. Verifique distribuição
```

**Análise de Especialização:**

```
1. Filtre "S.T.O.R.M."
2. Conte membros
3. Verifique se há vagas
```

## 🔒 Segurança e Responsabilidade

### Responsabilidades do Admin

1. **Proteção de dados**

   - Não compartilhe informações pessoais
   - Respeite privacidade dos membros

2. **Decisões justas**

   - Imparcialidade em aprovações
   - Tratamento igual para todos

3. **Transparência**

   - Comunique decisões importantes
   - Explique mudanças

4. **Integridade do sistema**
   - Não abuse de poder
   - Não manipule dados indevidamente

### O Que NÃO Fazer

- ❌ Aprovar amigos sem critério
- ❌ Recusar por motivos pessoais
- ❌ Condecorar sem mérito
- ❌ Excluir membros arbitrariamente
- ❌ Compartilhar dados pessoais
- ❌ Editar patentes sem motivo

## 🐛 Solução de Problemas

### Problema: Botão de ação não funciona

**Soluções:**

1. Recarregue a página (F5)
2. Verifique console (F12)
3. Limpe cache do navegador

### Problema: Filtros não funcionam

**Soluções:**

1. Clique em "Limpar"
2. Reaplique filtros
3. Recarregue a página

### Problema: Membro não aparece após aprovação

**Soluções:**

1. Recarregue a página
2. Limpe filtros
3. Procure em membros registrados

### Problema: Não consigo editar evento finalizado

**Causa:** Eventos finalizados são bloqueados

**Solução:**

1. Reabra o evento
2. Faça alterações
3. Finalize novamente

## 📝 Checklist Diário do Admin

- [ ] Verificar alistamentos pendentes
- [ ] Responder solicitações (max 48-72h)
- [ ] Revisar eventos próximos
- [ ] Finalizar eventos realizados
- [ ] Verificar relatórios de membros
- [ ] Atualizar informações desatualizadas
- [ ] Responder dúvidas no Discord

## 📝 Checklist Semanal do Admin

- [ ] Revisar membros inativos
- [ ] Atualizar situações (ativo/reservista)
- [ ] Analisar participação em eventos
- [ ] Identificar candidatos a promoção
- [ ] Planejar eventos da próxima semana
- [ ] Revisar condecorações concedidas
- [ ] Backup de dados importantes

---

**Disciplina. Ordem. Supremacia.**
