# 👥 Sistema de Membros

Documentação completa do sistema de gerenciamento de membros da Strykers.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Hierarquia Militar](#hierarquia-militar)
- [Atribuições](#atribuições)
- [Status](#status)
- [Forças Especiais](#forças-especiais)
- [Perfil do Membro](#perfil-do-membro)
- [Gerenciamento Admin](#gerenciamento-admin)
- [Filtros e Pesquisa](#filtros-e-pesquisa)

## 🎯 Visão Geral

O sistema de membros gerencia todos os integrantes da Strykers, desde recrutas até o comando superior. Controla patentes, atribuições, histórico de missões, condecorações e muito mais.

### Dados Armazenados

Cada membro possui:

- **Identificação**: ID único, Nome, Foto
- **Militar**: Patente, Atribuição, Data de Registro
- **Status**: Situação atual na organização
- **Especialização**: Força Especial (se aplicável)
- **Histórico**: Missões participadas, missões antigas
- **Condecorações**: Medalhas recebidas
- **Observações**: Notas administrativas
- **Histórico**: Descrição de missões anteriores ao sistema

## 🎖️ Hierarquia Militar

### Praças (8 níveis)

#### 1. Recruta

- **Descrição**: Novo membro em treinamento básico
- **Requisitos**: Alistamento aprovado
- **Responsabilidades**: Participar de treinamentos básicos

#### 2. Soldado

- **Descrição**: Membro operacional básico
- **Requisitos**: Completar treinamento básico
- **Responsabilidades**: Executar ordens, participar de missões

#### 3. Cabo

- **Descrição**: Líder de pequenos grupos
- **Requisitos**: Experiência em campo
- **Responsabilidades**: Liderar esquadrões pequenos

#### 4. Terceiro-Sargento

- **Descrição**: Suboficial júnior
- **Requisitos**: Demonstração de liderança
- **Responsabilidades**: Supervisionar cabos e soldados

#### 5. Segundo-Sargento

- **Descrição**: Suboficial intermediário
- **Requisitos**: Experiência operacional
- **Responsabilidades**: Coordenar múltiplos esquadrões

#### 6. Primeiro-Sargento

- **Descrição**: Suboficial sênior
- **Requisitos**: Tempo de serviço e mérito
- **Responsabilidades**: Gestão tática de pelotões

#### 7. Sargento-Mor

- **Descrição**: Mais alto nível de praças
- **Requisitos**: Excelência operacional
- **Responsabilidades**: Assessoria ao comando

#### 8. Subtenente

- **Descrição**: Transição para oficiais
- **Requisitos**: Mérito excepcional
- **Responsabilidades**: Comandar grandes unidades

### Oficiais (8 níveis)

#### 9. Tenente

- **Descrição**: Oficial júnior
- **Requisitos**: Promoção de Subtenente ou curso
- **Responsabilidades**: Comandar pelotões

#### 10. Capitão

- **Descrição**: Oficial intermediário
- **Requisitos**: Experiência de comando
- **Responsabilidades**: Comandar companhias

#### 11. Major

- **Descrição**: Oficial superior júnior
- **Requisitos**: Planejamento estratégico
- **Responsabilidades**: Coordenar múltiplas companhias

#### 12. Tenente-Coronel

- **Descrição**: Oficial superior intermediário
- **Requisitos**: Capacidade de comando amplo
- **Responsabilidades**: Vice-comando de batalhões

#### 13. Coronel

- **Descrição**: Oficial superior sênior
- **Requisitos**: Liderança demonstrada
- **Responsabilidades**: Comandar batalhões

#### 14. Brigadeiro

- **Descrição**: Oficial general júnior
- **Requisitos**: Excelência estratégica
- **Responsabilidades**: Comandar brigadas

#### 15. General

- **Descrição**: Alto comando
- **Requisitos**: Liderança organizacional
- **Responsabilidades**: Planejamento estratégico geral

#### 16. Marechal

- **Descrição**: Comando supremo
- **Requisitos**: Fundador ou mérito excepcional
- **Responsabilidades**: Liderança máxima da organização

## 🎯 Atribuições

### Infantaria

- **Descrição**: Tropas terrestres
- **Especialidades**:
  - CQB (Close Quarters Battle)
  - Assalto
  - Defesa
  - Infantaria Pesada
- **Equipamento**: Armaduras de combate, armas terrestres

### Força Aérea

- **Descrição**: Pilotos e tripulação aérea
- **Especialidades**:
  - Caças
  - Bombardeiros
  - Interceptadores
  - Transporte
- **Equipamento**: Naves de combate aéreo

### Marinha

- **Descrição**: Operadores de naves capitais
- **Especialidades**:
  - Comando de nave capital
  - Tripulação de subcapital
  - Logística espacial
  - Engenharia naval
- **Equipamento**: Naves capitais e subcapitais

## 📊 Status

### Ativo

- **Descrição**: Membro em plena atividade
- **Características**:
  - Participa regularmente
  - Disponível para missões
  - Conta para estatísticas ativas

### Reservista

- **Descrição**: Membro inativo temporariamente
- **Características**:
  - Mantém vínculo com organização
  - Não participa regularmente
  - Pode retornar quando quiser

### Desertor

- **Descrição**: Membro que abandonou a organização
- **Características**:
  - Violou código de conduta
  - Abandonou missão crítica
  - Vínculo rompido

## ⭐ Forças Especiais

### S.T.O.R.M.

**Strykers Tactical Operations & Response Marines**

- **Tipo**: Força Especial Terrestre
- **Especialidade**: Operações críticas de infantaria
- **Requisitos**:
  - Patente mínima: Terceiro-Sargento
  - Kit completo de armadura S.T.O.R.M.
  - Todos os treinamentos de infantaria
  - Vaga disponível

### G.H.O.S.T.

**Group for Hidden Operations & Stealth Tactics**

- **Tipo**: Força Especial Anticapital
- **Especialidade**: Neutralização de naves capitais
- **Requisitos**:
  - Demonstração de competência
  - Treinamentos designados
  - Seleção do comandante
  - Vaga disponível

### Não

- **Descrição**: Membro regular (não pertence a força especial)

## 📱 Perfil do Membro

### Visualização Pública

Todos podem ver:

- Foto
- Nome
- Patente
- Atribuição
- Data de Registro
- Situação
- Força Especial
- Total de Medalhas (com ícone 👁️ para detalhes)
- Total de Missões (com ícone 👁️ para detalhes)

### Visualização de Medalhas

Ao clicar no ícone 👁️ nas medalhas:

- Lista de todas as condecorações
- Data de cada condecoração
- Tipo de medalha com imagem
- Clique na medalha para ver descrição completa

### Visualização de Missões

Ao clicar no ícone 👁️ nas missões:

- **Estatísticas por categoria**:
  - TR: Treinamentos
  - MI: Missões
  - OP: Operações
  - MO: Mega Operações
  - CA: Campanhas
  - OU: Outros
- **Lista de eventos participados**
- **Histórico de missões antigas** (se houver)
- Clique em um evento para ver detalhes completos

### Observações

- Visível apenas para administradores
- Campo livre para notas
- Exemplos:
  - "Excelente líder de esquadrão"
  - "Especialista em pilotagem de caças"
  - "Aguardando treinamento médico"

### Histórico

Campo para registrar missões realizadas antes da implementação do sistema:

```
Exemplo:
====== 2023 ======
- Participou da Operação Alpha (Março)
- Liderou esquadrão na Campanha Beta (Julho)
- Resgate bem-sucedido na Missão Omega (Outubro)

====== 2024 ======
- Treinamento avançado CQB (Janeiro)
- Mega Operação Conquest (Abril)
```

**Valor Histórico**: Número de missões antigas (somado ao total atual)

## 🔧 Gerenciamento Admin

### Aprovar Alistamento

**Fluxo:**

1. Usuário se cadastra no site
2. Confirma e-mail
3. Aparece em "Alistamentos Pendentes"
4. Admin aprova
5. Membro criado automaticamente como "Recruta"

### Editar Membro

**Campos editáveis:**

- Nome
- Foto (URL)
- Patente
- Atribuição
- Data de Registro
- Situação
- Força Especial
- Observações
- Histórico
- Valor Histórico

**Como editar:**

1. Acesse Administração
2. Localize o membro
3. Clique no ícone ✏️
4. Faça as alterações
5. Clique em "Salvar"

### Condecorar Membro

Ver documentação específica em [MEDALS.md](MEDALS.md)

### Remover Membro

**Processo:**

1. Clique no ícone 🗑️
2. Confirme a ação
3. Membro movido para "Alistamentos Recusados"
4. Usuário pode ser realistado depois

⚠️ **Importante**: A remoção não exclui permanentemente

## 🔍 Filtros e Pesquisa

### Barra de Pesquisa

- Digite nome completo ou parcial
- Busca em tempo real
- Não diferencia maiúsculas/minúsculas

**Exemplos:**

```
"Shadow" → encontra "Shadow Wolf"
"wolf" → encontra "Shadow Wolf" e "Wolf Pack"
"pho" → encontra "Phoenix Blade"
```

### Filtro por Patente

- Selecione uma patente específica
- Mostra apenas membros daquela patente
- Útil para análise hierárquica

### Filtro por Situação

- **Ativo**: Membros em atividade
- **Reservista**: Membros inativos
- **Desertor**: Membros excluídos

### Filtro por Força Especial (Admin)

- **S.T.O.R.M.**: Apenas membros S.T.O.R.M.
- **G.H.O.S.T.**: Apenas membros G.H.O.S.T.
- **Não**: Membros regulares

### Filtro por Data (Admin)

- Selecione data específica
- Mostra membros registrados naquele dia

### Combinação de Filtros

Você pode combinar múltiplos filtros:

**Exemplo 1: Ativos com patente Capitão**

```
Situação: Ativo
Patente: Capitão
```

**Exemplo 2: Membros S.T.O.R.M. ativos**

```
Situação: Ativo
Força Especial: S.T.O.R.M.
```

### Limpar Filtros

Botão "Limpar Filtros" remove todos os filtros aplicados.

## 📊 Estatísticas

### Por Membro

- **Medalhas**: Total de condecorações
- **Missões**: Total de participações
  - Eventos do sistema
  - Valor histórico (missões antigas)

### Análise Organizacional (Admin)

Com os filtros, você pode analisar:

- Distribuição por patente
- Membros ativos vs inativos
- Composição das forças especiais
- Média de missões por membro
- Taxa de retenção

## 💡 Boas Práticas

### Para Administradores

1. **Mantenha dados atualizados**

   - Revise perfis periodicamente
   - Atualize situações (ativo/reservista)
   - Corrija informações incorretas

2. **Use observações**

   - Registre informações importantes
   - Facilita tomada de decisões
   - Mantém histórico administrativo

3. **Preencha histórico**

   - Para membros veteranos
   - Reconhece contribuições passadas
   - Mantém registro completo

4. **Promova com critério**

   - Base-se em mérito e tempo
   - Considere participação
   - Mantenha hierarquia coerente

5. **Gerencie forças especiais**
   - Apenas membros qualificados
   - Respeite requisitos
   - Mantenha vagas controladas

### Para Membros

1. **Mantenha perfil atualizado**

   - Foto representativa
   - Informações corretas

2. **Participe ativamente**

   - Missões aumentam progressão
   - Demonstre comprometimento

3. **Aspire crescimento**
   - Busque treinamentos
   - Demonstre liderança
   - Ganhe experiência

## 🐛 Solução de Problemas

### Problema: Não encontro um membro

**Soluções:**

1. Verifique se digitou corretamente
2. Limpe todos os filtros
3. Verifique se o membro está ativo
4. Procure em alistamentos recusados (admin)

### Problema: Total de missões incorreto

**Causa:** Evento não finalizado ou valor histórico incorreto

**Solução:**

1. Verifique eventos participados
2. Confira valor histórico (admin)
3. Finalize eventos pendentes

### Problema: Não consigo editar membro

**Causa:** Sem permissão de administrador

**Solução:** Entre com conta de administrador

### Problema: Medalhas não aparecem

**Causa:** Membro não foi condecorado

**Solução:** Admin deve condecorar o membro (ver MEDALS.md)

## 📝 Checklist: Novo Membro

- [ ] Alistamento aprovado
- [ ] Patente: Recruta
- [ ] Atribuição definida
- [ ] Foto adicionada (se disponível)
- [ ] Status: Ativo
- [ ] Força Especial: Não
- [ ] Observações iniciais (opcional)
- [ ] Histórico preenchido (se veterano)
- [ ] Membro notificado

## 📝 Checklist: Promoção

- [ ] Membro demonstrou mérito
- [ ] Tempo de serviço adequado
- [ ] Participação em missões
- [ ] Avaliação de superiores
- [ ] Patente atualizada no sistema
- [ ] Observação registrada
- [ ] Membro notificado
- [ ] Anúncio público (opcional)

---

**Disciplina. Ordem. Supremacia.**
