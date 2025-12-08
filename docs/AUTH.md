# 🔐 Sistema de Autenticação

Documentação completa do sistema de autenticação, cadastro e gerenciamento de contas.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Cadastro](#cadastro)
- [Login](#login)
- [Perfil do Usuário](#perfil-do-usuário)
- [Configuração de Conta](#configuração-de-conta)
- [Fluxo de Aprovação](#fluxo-de-aprovação)
- [Segurança](#segurança)

## 🎯 Visão Geral

O sistema de autenticação gerencia o acesso de usuários à plataforma, desde o cadastro inicial até a aprovação administrativa e gerenciamento de conta.

### Status de Usuário

1. **aguardando_confirmacao** - Cadastrado, aguardando confirmar e-mail
2. **aguardando_aprovacao** - E-mail confirmado, aguardando aprovação admin
3. **aprovado** - Aprovado, pode fazer login
4. **recusado** - Alistamento recusado

### Fluxo Básico

```
Cadastro → Confirmação E-mail → Aprovação Admin → Login → Acesso Completo
```

## 📝 Cadastro

### Acessar Formulário

1. Clique em "SIGN IN" no menu
2. Clique em "Cadastre-se aqui"

### Campos do Cadastro

#### E-mail \*

```
Exemplo: soldado@email.com
```

- **Obrigatório**: Sim
- **Validação**: Formato de e-mail válido
- **Único**: Não pode ser duplicado

#### Confirmar E-mail \*

```
Deve ser idêntico ao e-mail acima
```

- **Obrigatório**: Sim
- **Validação**: Deve ser igual ao e-mail

#### Senha \*

```
Mínimo: 6 caracteres
```

- **Obrigatório**: Sim
- **Mínimo**: 6 caracteres
- **Recomendado**: Use letras, números e símbolos

#### Confirmar Senha \*

```
Deve ser idêntica à senha acima
```

- **Obrigatório**: Sim
- **Validação**: Deve ser igual à senha

#### Nome/Nick \*

```
Exemplo: Shadow Wolf
```

- **Obrigatório**: Sim
- **Importante**: ⚠️ Use o mesmo nome registrado no Star Citizen (RSI)
- **Razão**: Facilita identificação e comunicação

#### WhatsApp (opcional)

```
Exemplo: (00) 00000-0000
```

- **Obrigatório**: Não
- **Útil**: Para comunicação rápida

### Validações

O sistema valida:

- ✅ E-mails conferem
- ✅ Senhas conferem
- ✅ Senha tem mínimo 6 caracteres
- ✅ E-mail não está em uso
- ✅ Todos campos obrigatórios preenchidos

### Após o Cadastro

1. **Modal de Confirmação**

   - Abre automaticamente
   - Mostra código de 6 dígitos
   - ⚠️ Em produção, seria enviado por e-mail

2. **Simulação de E-mail**

   ```
   📧 SIMULAÇÃO DE E-MAIL
   Código: 123456
   ```

3. **Digite o código**

   - Insira os 6 dígitos
   - Clique em "CONFIRMAR"

4. **Confirmação bem-sucedida**
   - Status: aguardando_aprovacao
   - Movido para fila de aprovação admin
   - Mensagem de sucesso exibida

## 🔑 Login

### Acessar

1. Clique em "SIGN IN" no menu
2. Formulário de login aparece

### Campos do Login

#### E-mail

```
Use o e-mail cadastrado
```

- Não diferencia maiúsculas/minúsculas

#### Senha

```
Senha definida no cadastro
```

- Diferencia maiúsculas/minúsculas

### Estados Possíveis

#### ✅ Login Bem-sucedido

```
Status: aprovado
Senha: correta
```

- Redirecionado para home
- Nome aparece no menu
- Acesso liberado

#### ⏳ Aguardando Confirmação

```
Status: aguardando_confirmacao
```

- Mensagem: "Você precisa confirmar seu e-mail"
- Opção de reenviar código

#### ⏳ Aguardando Aprovação

```
Status: aguardando_aprovacao
```

- Mensagem: "Seu cadastro está aguardando aprovação"
- Aguarde contato da administração

#### ❌ Recusado

```
Status: recusado
```

- Mensagem: "Seu cadastro foi recusado"
- Orientação para contato via Discord

#### ❌ E-mail Não Cadastrado

```
E-mail não existe no sistema
```

- Mensagem: "E-mail não cadastrado"
- Verifique digitação ou cadastre-se

#### ❌ Senha Incorreta

```
E-mail correto, senha errada
```

- Mensagem: "Senha incorreta"
- Tente novamente

### Após Login

1. **Sessão criada**

   - Armazenada no LocalStorage
   - Mantida até logout

2. **Menu atualizado**

   - Nome do usuário aparece
   - Opção de dropdown disponível

3. **Acesso liberado**
   - Todas páginas públicas
   - Página de perfil
   - Configurações pessoais

## 👤 Perfil do Usuário

### Acessar

1. Clique no seu nome no menu
2. Selecione "👤 Perfil"

### Informações Exibidas

- **Foto** do membro
- **Nome** completo
- **Patente** atual
- **Dados militares**:
  - Atribuição
  - Data de Registro
  - Situação
  - Força Especial
- **Estatísticas**:
  - Total de Missões
  - Total de Medalhas
- **Condecorações** (grid visual)
- **Missões Participadas** (lista completa)
- **Observações** (se houver)
- **Histórico** (se houver)

### Limitações

- ❌ Não pode editar dados militares
- ❌ Não pode condecorar-se
- ❌ Não pode alterar patente
- ✅ Pode ver tudo sobre si mesmo

## ⚙️ Configuração de Conta

### Acessar

1. Clique no seu nome no menu
2. Selecione "🔐 Configuração de Conta"

### Alterar Senha

#### Campos

1. **Senha Atual**

   - Digite sua senha atual
   - Validação de segurança

2. **Nova Senha**

   - Mínimo 6 caracteres
   - Não pode ser igual à atual

3. **Repetir Nova Senha**
   - Deve ser igual à nova senha

#### Processo

1. Preencha os 3 campos
2. Clique em "CONFIRMAR"
3. Sistema valida:
   - Senha atual correta
   - Nova senha diferente da atual
   - Senhas novas conferem
   - Mínimo 6 caracteres
4. Se válido:
   - Senha alterada
   - E-mail de confirmação "enviado"
   - Mensagem de sucesso

### Alterar E-mail

#### Campos

1. **E-mail Atual**

   - Apenas visualização
   - Não editável

2. **Novo E-mail**

   - Digite novo e-mail
   - Não pode ser igual ao atual

3. **Repetir Novo E-mail**
   - Deve ser igual ao novo e-mail

#### Processo

1. Preencha os 2 campos
2. Clique em "CONFIRMAR"
3. Sistema valida:
   - E-mails novos conferem
   - Novo e-mail diferente do atual
   - E-mail não está em uso
4. Se válido:
   - E-mail alterado
   - Sessão atualizada
   - E-mail de confirmação "enviado"
   - Mensagem de sucesso

### Alterar Ambos

Você pode alterar senha e e-mail na mesma operação:

1. Preencha campos de senha
2. Preencha campos de e-mail
3. Clique em "CONFIRMAR"
4. Ambos alterados simultaneamente

### Validações

O sistema verifica:

- ✅ Senha atual correta (se alterando senha)
- ✅ Nova senha diferente da atual
- ✅ Senhas conferem
- ✅ Novo e-mail diferente do atual
- ✅ E-mails conferem
- ✅ E-mail não está em uso
- ✅ Mínimo 6 caracteres na senha

## 🔄 Fluxo de Aprovação

### Perspectiva do Usuário

1. **Cadastro**

   ```
   Preenche formulário → Clica em "CONFIRMAR"
   ```

2. **Confirmação de E-mail**

   ```
   Recebe código → Insere código → Confirma
   ```

3. **Aguardo**

   ```
   Mensagem: "Aguardando aprovação"
   ```

4. **Aprovação ou Recusa**
   ```
   Aprovado: Pode fazer login
   Recusado: Notificação + orientação
   ```

### Perspectiva do Admin

Ver documentação em [ADMIN.md](ADMIN.md)

## 🔒 Segurança

### ⚠️ IMPORTANTE - Limitações

Este é um sistema **demonstrativo** com limitações de segurança:

1. **Senhas em texto simples**

   - ❌ Armazenadas sem hash
   - ❌ Visíveis no LocalStorage
   - ⚠️ **NÃO USE EM PRODUÇÃO**

2. **LocalStorage**

   - ❌ Acessível por JavaScript
   - ❌ Sem proteção contra XSS
   - ⚠️ **Para estudo apenas**

3. **Sem backend**
   - ❌ Sem validação servidor
   - ❌ Sem rate limiting
   - ❌ Sem proteção CSRF

### Para Produção

Implemente:

- ✅ Backend com API segura
- ✅ Hash de senhas (bcrypt, argon2)
- ✅ JWT ou sessões seguras
- ✅ HTTPS obrigatório
- ✅ Rate limiting
- ✅ Validação server-side
- ✅ Proteção CSRF
- ✅ 2FA (autenticação de dois fatores)

### Boas Práticas (Usuário)

1. **Senha segura**

   - Mínimo 8 caracteres
   - Misture letras, números, símbolos
   - Não use senhas óbvias

2. **E-mail válido**

   - Use e-mail que você acessa
   - Mantenha seguro

3. **Não compartilhe**

   - Nunca compartilhe sua senha
   - Nem mesmo com admins

4. **Logout ao sair**
   - Sempre faça logout em PCs públicos
   - Proteja sua sessão

## 🐛 Solução de Problemas

### Problema: Código de confirmação não funciona

**Causas possíveis:**

1. Digitou errado
2. Código expirou (reload da página)

**Solução:**

- Feche e abra o modal novamente
- Novo código será gerado

### Problema: Não consigo fazer login

**Diagnóstico:**

1. E-mail confirmado?
   - Não → Confirme e-mail
2. Aprovado por admin?
   - Não → Aguarde aprovação
3. Senha correta?
   - Não → Verifique digitação
4. Foi recusado?
   - Sim → Contate admins via Discord

### Problema: Esqueci minha senha

**Situação atual:**

- ❌ Sem recuperação automática

**Solução:**

1. Contate administração via Discord
2. Admin pode redefinir

**Em produção:**

- Implementar "Esqueci minha senha"
- Envio de link por e-mail
- Reset seguro

### Problema: Quero trocar e-mail mas está em uso

**Causa:** E-mail já cadastrado por outro usuário

**Solução:**

- Use outro e-mail
- Ou remova conta antiga (via admin)

### Problema: Alteração de e-mail não funcionou

**Diagnóstico:**

1. E-mails conferem?
2. E-mail novo diferente do atual?
3. E-mail não está em uso?

**Solução:**

- Verifique todos os campos
- Tente novamente

## 📝 Checklist: Novo Usuário

- [ ] Cadastro preenchido corretamente
- [ ] E-mail confirmado
- [ ] Aguardando aprovação
- [ ] Verificou status periodicamente
- [ ] Aprovado por admin
- [ ] Primeiro login realizado
- [ ] Perfil visualizado
- [ ] Senha segura definida

## 📝 Checklist: Configuração de Conta

- [ ] Senha atual memorizada
- [ ] Nova senha forte definida
- [ ] Novo e-mail válido (se alterando)
- [ ] Todas validações passadas
- [ ] Alteração confirmada
- [ ] Teste de login realizado
- [ ] Dados atualizados verificados

---

**Disciplina. Ordem. Supremacia.**
