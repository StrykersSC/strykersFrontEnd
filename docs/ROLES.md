# 🔐 Sistema de Roles e Permissões

Documentação completa do sistema de controle de acesso baseado em roles (papéis) e permissões.

## 📋 Sumário

- [Visão Geral](https://ai.stackspot.com/home#vis%C3%A3o-geral)
- [Tipos de Roles](https://ai.stackspot.com/home#tipos-de-roles)
- [Hierarquia de Permissões](https://ai.stackspot.com/home#hierarquia-de-permiss%C3%B5es)
- [Permissões Detalhadas](https://ai.stackspot.com/home#permiss%C3%B5es-detalhadas)
- [Gerenciamento de Roles](https://ai.stackspot.com/home#gerenciamento-de-roles)
- [Proteção de Rotas](https://ai.stackspot.com/home#prote%C3%A7%C3%A3o-de-rotas)
- [Badges Visuais](https://ai.stackspot.com/home#badges-visuais)
- [Implementação Técnica](https://ai.stackspot.com/home#implementa%C3%A7%C3%A3o-t%C3%A9cnica)
- [Boas Práticas](https://ai.stackspot.com/home#boas-pr%C3%A1ticas)

## 🎯 Visão Geral

O sistema de roles controla o acesso às funcionalidades da plataforma através de três níveis hierárquicos de permissões.

### Conceitos Básicos

- **Role**: Papel/função do usuário no sistema
- **Permissão**: Ação específica que um role pode executar
- **Hierarquia**: Roles superiores herdam permissões dos inferiores

### Fluxo de Acesso

`Usuário → Role Atribuído → Permissões → Acesso a Recursos`

## 👥 Tipos de Roles

### 1\. 👤 USER (Usuário)

**Nível**: 1 (Básico)

**Descrição**: Role padrão para todos os membros aprovados da organização.

**Atribuição**: Automática após aprovação do alistamento

**Características**:

- Acesso básico ao sistema
- Visualização de conteúdo público
- Gerenciamento do próprio perfil
- Participação em eventos

**Badge Visual**:

`👤 Usuário Cor: Cinza (bg-slate-600)`

### 2\. ⚜️ ADMIN (Administrador)

**Nível**: 2 (Intermediário)

**Descrição**: Gerentes operacionais da organização.

**Atribuição**: Manual pelo Super Admin

**Características**:

- Todas permissões de USER
- Acesso ao painel administrativo
- Gerenciamento de membros
- Gerenciamento de eventos
- Aprovação de alistamentos
- Condecoração de membros

**Badge Visual**:

`⚜️ Administrador Cor: Ciano (bg-cyan-600)`

### 3\. 👑 SUPER_ADMIN (Super Administrador)

**Nível**: 3 (Máximo)

**Descrição**: Controle total do sistema.

**Atribuição**: Manual via console ou script

**Características**:

- Todas permissões de ADMIN
- Gerenciamento de roles
- Alteração de permissões
- Acesso a todas funcionalidades
- Controle total do sistema

**Badge Visual**:

`👑 Super Administrador Cor: Vermelho (bg-red-600)`

## 📊 Hierarquia de Permissões

### Estrutura Hierárquica

`SUPER_ADMIN (Nível 3) ↓ Herda tudo de ADMIN ADMIN (Nível 2) ↓ Herda tudo de USER USER (Nível 1)`

### Tabela de Herança

| Permissão            | USER | ADMIN | SUPER_ADMIN |
| -------------------- | ---- | ----- | ----------- |
| Ver Perfil           | ✅   | ✅    | ✅          |
| Editar Perfil        | ✅   | ✅    | ✅          |
| Ver Membros          | ✅   | ✅    | ✅          |
| Ver Eventos          | ✅   | ✅    | ✅          |
| Painel Admin         | ❌   | ✅    | ✅          |
| Gerenciar Membros    | ❌   | ✅    | ✅          |
| Gerenciar Eventos    | ❌   | ✅    | ✅          |
| Aprovar Alistamentos | ❌   | ✅    | ✅          |
| Condecorar           | ❌   | ✅    | ✅          |
| Gerenciar Roles      | ❌   | ❌    | ✅          |

## 🔑 Permissões Detalhadas

### Permissões de Usuário (USER)

#### VIEW_PROFILE

`

javascript

`Roles:  [USER,  ADMIN,  SUPER_ADMIN]`

`

- Visualizar próprio perfil
- Ver estatísticas pessoais
- Acessar histórico de missões
- Ver condecorações recebidas

#### EDIT_OWN_PROFILE

`

javascript

`Roles:  [USER,  ADMIN,  SUPER_ADMIN]`

`

- Editar informações pessoais
- Atualizar foto de perfil
- Modificar observações
- Atualizar histórico pessoal

#### VIEW_MEMBERS

`

javascript

`Roles:  [USER,  ADMIN,  SUPER_ADMIN]`

`

- Acessar página de membros
- Ver lista completa de membros
- Visualizar perfis públicos
- Usar filtros de busca

#### VIEW_EVENTS

`

javascript

`Roles:  [USER,  ADMIN,  SUPER_ADMIN]`

`

- Acessar página de eventos
- Ver calendário de eventos
- Visualizar detalhes de eventos
- Ver lista de participantes

### Permissões de Administração (ADMIN)

#### VIEW_ADMIN_PANEL

`

javascript

`Roles:  [ADMIN,  SUPER_ADMIN]`

`

- Acessar painel administrativo
- Ver alistamentos pendentes
- Acessar ferramentas de gestão
- Ver relatórios administrativos

#### APPROVE_ENLISTMENTS

`

javascript

`Roles:  [ADMIN,  SUPER_ADMIN]`

`

- Aprovar alistamentos
- Recusar alistamentos
- Realistar usuários
- Gerenciar fila de aprovação

#### MANAGE_MEMBERS

`

javascript

`Roles:  [ADMIN,  SUPER_ADMIN]`

`

- Editar dados de membros
- Alterar patentes
- Modificar atribuições
- Atualizar situações
- Excluir membros

#### MANAGE_EVENTS

`

javascript

`Roles:  [ADMIN,  SUPER_ADMIN]`

`

- Criar eventos
- Editar eventos
- Excluir eventos
- Gerenciar participantes
- Finalizar eventos

#### AWARD_MEDALS

`

javascript

`Roles:  [ADMIN,  SUPER_ADMIN]`

`

- Condecorar membros
- Remover condecorações
- Gerenciar medalhas
- Adicionar observações

### Permissões de Super Admin (SUPER_ADMIN)

#### MANAGE_USERS

`

javascript

`Roles:  [SUPER_ADMIN]`

`

- Gerenciar todos usuários
- Excluir usuários permanentemente
- Resetar senhas
- Modificar dados de login

#### MANAGE_ROLES

`

javascript

`Roles:  [SUPER_ADMIN]`

`

- Alterar roles de usuários
- Promover a ADMIN
- Rebaixar de ADMIN
- Criar novos SUPER_ADMIN

## 🛡️ Gerenciamento de Roles

### Visualizar Role Atual

**Localização**: Menu superior (após login)

**Exibição**:

`[Ícone] Nome do Usuário ▼ └─ Badge do Role`

**Exemplo**:

`👑 João Silva ▼ └─ 👑 Super Administrador`

### Alterar Role de Usuário

**Requisito**: Ser SUPER_ADMIN

**Acesso**: Painel Admin → Gerenciamento de Roles

#### Processo

1.  **Localizar seção**

    `👑 GERENCIAMENTO DE ROLES`

2.  **Encontrar usuário**

    - Tabela com todos usuários aprovados
    - Mostra role atual

3.  **Selecionar novo role**

    - Dropdown com opções:
      - 👤 Usuário
      - ⚜️ Administrador
      - 👑 Super Administrador

4.  **Confirmar alteração**

    - Popup de confirmação
    - Alteração imediata

#### Exemplo de Uso

**Promover usuário a ADMIN:**

`1\. Localize "Maria Santos" na tabela 2. Role atual: 👤 Usuário 3. Selecione: ⚜️ Administrador 4. Confirme: "Alterar role de Maria Santos para Administrador?" 5. ✅ Role atualizado com sucesso!`

### Criar Super Admin Inicial

**Situação**: Primeiro acesso ao sistema

**Método**: Console do navegador (F12)

#### Script de Criação

`

javascript

`const usuarios =  JSON.parse(localStorage.getItem('strykers_usuarios')  ||  '[]');  usuarios.push({  id:  'user-superadmin-'  +  Date.now(),  nome:  'Super Admin',  email:  'admin@strykers.com',  senha:  'admin123',  role:  'super_admin',  status:  'aprovado',  emailConfirmado:  true,  dataSolicitacao:  new  Date().toISOString(),  });  localStorage.setItem('strykers_usuarios',  JSON.stringify(usuarios));  console.log('✅ Super Admin criado!');`

`

#### Credenciais Padrão

`Email: admin@strykers.com Senha: admin123`

⚠️ **IMPORTANTE**: Altere a senha imediatamente após primeiro login!

## 🚪 Proteção de Rotas

### Rotas Públicas

**Sem autenticação necessária:**

- `/` - Home
- `/recrutamento` - Recrutamento
- `/forcasespeciais` - Forças Especiais

### Rotas Protegidas (USER)

**Requer**: Estar logado + Role USER ou superior

`

javascript

`// Perfil  <Route path='/perfil' element={  <ProtectedRoute permission='VIEW_PROFILE'>  <Perfil  />  </ProtectedRoute>  }  />  // Membros  <Route path='/membros' element={  <ProtectedRoute permission='VIEW_MEMBERS'>  <Membros  />  </ProtectedRoute>  }  />  // Eventos  <Route path='/eventos' element={  <ProtectedRoute permission='VIEW_EVENTS'>  <Eventos  />  </ProtectedRoute>  }  />`

`

### Rotas Protegidas (ADMIN)

**Requer**: Role ADMIN ou SUPER_ADMIN

`

javascript

`// Administração  <Route path='/administracao' element={  <ProtectedRoute permission='VIEW_ADMIN_PANEL'>  <Administracao  />  </ProtectedRoute>  }  />`

`

### Comportamento de Acesso Negado

**Quando usuário sem permissão tenta acessar:**

1.  **Redirecionamento automático**

    - Para página inicial (`/`)

2.  **Tela de Acesso Negado**

    `🚫 Acesso Negado Você não tem permissão para acessar esta página. [Botão: Voltar]`

3.  **Links ocultos no menu**

    - Usuários não veem links que não podem acessar
    - Menu adapta-se ao role

## 🎨 Badges Visuais

### Estrutura de Badge

`

javascript

`{  bg:  'bg-[cor]-600',  // Cor de fundo  text:  'text-white',  // Cor do texto  border:  'border-[cor]-700',  // Cor da borda  icon:  '[emoji]',  // Ícone representativo  }`

`

### Badges por Role

#### USER

`

javascript

`{  bg:  'bg-slate-600',  text:  'text-white',  border:  'border-slate-700',  icon:  '👤',  }`

`

#### ADMIN

`

javascript

`{  bg:  'bg-cyan-600',  text:  'text-white',  border:  'border-cyan-700',  icon:  '⚜️',  }`

`

#### SUPER_ADMIN

`

javascript

`{  bg:  'bg-red-600',  text:  'text-white',  border:  'border-red-700',  icon:  '👑',  }`

`

### Locais de Exibição

1.  **Menu Superior**

    - Ao lado do nome do usuário
    - Visível após login

2.  **Dropdown de Usuário**

    - Abaixo do nome e e-mail
    - Badge completo com label

3.  **Tabela de Gerenciamento**

    - Coluna "Role Atual"
    - Badge inline

## 💻 Implementação Técnica

### Arquivo de Constantes

**Localização**: `src/constants/roles.js`

`

javascript

`// Definição de roles  export  const  ROLES  =  {  SUPER_ADMIN:  'super_admin',  ADMIN:  'admin',  USER:  'user',  };  // Hierarquia  export  const  ROLE_HIERARCHY  =  {  [ROLES.SUPER_ADMIN]:  3,  [ROLES.ADMIN]:  2,  [ROLES.USER]:  1,  };  // Permissões  export  const  PERMISSIONS  =  {  VIEW_ADMIN_PANEL:  [ROLES.SUPER_ADMIN,  ROLES.ADMIN],  MANAGE_ROLES:  [ROLES.SUPER_ADMIN],  // ... outras permissões  };`

`

### Verificação de Permissão

`

javascript

`import  { hasPermission }  from  '../constants/roles';  // Verificar se usuário tem permissão  const canAccess =  hasPermission(usuarioAtual.role,  'VIEW_ADMIN_PANEL');  if  (canAccess)  {  // Permitir acesso  }  else  {  // Negar acesso  }`

`

### Componente ProtectedRoute

`

javascript

`import  ProtectedRoute  from  './components/ProtectedRoute';  <Route path='/admin' element={  <ProtectedRoute permission='VIEW_ADMIN_PANEL'>  <AdminPanel  />  </ProtectedRoute>  }  />`

`

### Hook useAuth

`

javascript

`import  { useAuth }  from  './hooks/useAuth';  function  MyComponent()  {  const  { usuarioAtual, updateUserRole }  =  useAuth();  // Verificar role  if  (usuarioAtual.role  ===  'super_admin')  {  // Lógica para super admin  }  // Alterar role (apenas super admin)  const  promoverUsuario  =  (userId)  =>  {  updateUserRole(userId,  'admin');  };  }`

`

## 📝 Boas Práticas

### Para Super Admins

1.  **Promova com critério**

    - Avalie confiabilidade
    - Verifique experiência
    - Considere necessidade

2.  **Documente alterações**

    - Registre promoções
    - Anote motivos
    - Mantenha histórico

3.  **Revise periodicamente**

    - Verifique roles ativos
    - Remova inativos
    - Atualize conforme necessário

4.  **Proteja conta**

    - Senha forte
    - Não compartilhe
    - Logout ao sair

### Para Admins

1.  **Use permissões com responsabilidade**

    - Não abuse de poder
    - Seja justo e imparcial
    - Documente ações importantes

2.  **Respeite hierarquia**

    - Não tente alterar roles
    - Consulte super admin quando necessário
    - Siga protocolos estabelecidos

3.  **Mantenha integridade**

    - Não manipule dados indevidamente
    - Proteja informações sensíveis
    - Reporte problemas

### Para Users

1.  **Conheça suas permissões**

    - Saiba o que pode fazer
    - Não tente burlar sistema
    - Solicite acesso quando necessário

2.  **Reporte problemas**

    - Bugs de permissão
    - Acessos indevidos
    - Comportamentos suspeitos

## 🔒 Segurança

### ⚠️ Limitações Atuais

**LocalStorage:**

- ❌ Roles armazenados localmente
- ❌ Possível manipulação client-side
- ❌ Sem validação server-side

**Validação:**

- ❌ Apenas front-end
- ❌ Sem proteção contra manipulação
- ❌ Não adequado para produção

### Para Produção

**Implementar:**

1.  **Backend com API**

    `- Validação server-side - JWT com roles no payload - Middleware de autorização`

2.  **Banco de Dados**

    `- Roles persistidos - Auditoria de alterações - Histórico de permissões`

3.  **Segurança Adicional**

    `- Rate limiting - Logs de acesso - Alertas de alterações - 2FA para admins`

## 🐛 Solução de Problemas

### Problema: Não vejo painel admin

**Diagnóstico:**

1.  Qual seu role?
    - USER → Sem acesso
    - ADMIN/SUPER_ADMIN → Deve ver

**Solução:**

- Verifique role no dropdown
- Solicite promoção a super admin
- Recarregue página (F5)

### Problema: Não consigo alterar roles

**Diagnóstico:**

1.  Você é SUPER_ADMIN?
    - Não → Sem permissão
    - Sim → Verifique console (F12)

**Solução:**

- Apenas SUPER_ADMIN pode alterar
- Verifique erros no console
- Tente recarregar página

### Problema: Role não atualiza após alteração

**Solução:**

1.  Recarregue página (F5)
2.  Faça logout e login novamente
3.  Limpe cache do navegador

### Problema: Perdi acesso de super admin

**Solução:**

1.  Use script de criação novamente
2.  Crie novo super admin
3.  Faça login com nova conta

## 📊 Relatórios e Auditoria

### Verificar Distribuição de Roles

**Console do navegador:**

`

javascript

`const usuarios =  JSON.parse(localStorage.getItem('strykers_usuarios')  ||  '[]');  const aprovados = usuarios.filter(u  => u.status  ===  'aprovado');  console.log('Total:', aprovados.length);  console.log('Users:', aprovados.filter(u  => u.role  ===  'user').length);  console.log('Admins:', aprovados.filter(u  => u.role  ===  'admin').length);  console.log('Super Admins:', aprovados.filter(u  => u.role  ===  'super_admin').length);`

`

### Listar Todos Admins

`

javascript

`const usuarios =  JSON.parse(localStorage.getItem('strykers_usuarios')  ||  '[]');  const admins = usuarios.filter(u  =>  u.status  ===  'aprovado'  &&  (u.role  ===  'admin'  || u.role  ===  'super_admin')  );  console.table(admins.map(u  =>  ({  Nome: u.nome,  Email: u.email,  Role: u.role  })));`

`

## 📝 Checklist: Gerenciamento de Roles

### Para Super Admin

- [ ] Revisar roles periodicamente
- [ ] Documentar promoções
- [ ] Verificar admins ativos
- [ ] Remover inativos
- [ ] Manter pelo menos 2 super admins
- [ ] Proteger credenciais
- [ ] Fazer backup de dados

### Para Admin

- [ ] Conhecer suas permissões
- [ ] Usar responsavelmente
- [ ] Reportar problemas
- [ ] Seguir protocolos
- [ ] Documentar ações importantes

### Para User

- [ ] Conhecer limitações
- [ ] Solicitar acesso quando necessário
- [ ] Reportar bugs
- [ ] Respeitar hierarquia

---

**Disciplina. Ordem. Supremacia.**

**\
**
