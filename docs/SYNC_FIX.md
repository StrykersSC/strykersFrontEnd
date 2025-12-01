# Sincronização de Dados - Documentação

## Problema Identificado

Quando um administrador alterava o nome de um membro registrado via página de administração, ocorria a seguinte situação:
- ✅ O membro conseguia fazer login (pois a validação ocorre contra `strykers_usuarios`)
- ❌ O membro NÃO conseguia acessar seu perfil (exibia "Você não tem registro de membro na organização ainda")
- ❌ O nome no dropdown do Sign In não era atualizado

**Causa raiz**: A alteração do nome era feita apenas em `strykers_membros`, mas não sincronizava com `strykers_usuarios` ou a sessão do usuário.

## Solução Implementada

### 1. Administracao.jsx - `salvarMembroEdicao()`

**Antes**: Apenas atualizava `strykers_membros`

**Depois**: Também atualiza `strykers_usuarios` se o nome foi alterado

```jsx
function salvarMembroEdicao(e) {
  // Atualizar membro em strykers_membros
  setMembros((prev) =>
    prev.map((m) => (m.id === editingMember.id ? editingMember : m))
  );

  // Atualizar usuário em strykers_usuarios se o nome foi alterado
  const membroAnterior = membros.find((m) => m.id === editingMember.id);
  if (membroAnterior && membroAnterior.nome !== editingMember.nome) {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.nome === membroAnterior.nome && u.status === 'aprovado') {
          return { ...u, nome: editingMember.nome };
        }
        return u;
      })
    );
  }
  
  setEditingMember(null);
  alert('✅ Membro atualizado com sucesso!');
}
```

### 2. Administracao.jsx - `excluirMembro()`

**Adicionado**: Atualização do status do usuário quando membro é deletado

```jsx
// Atualizar status do usuário para 'recusado'
if (usuario) {
  setUsuarios((prev) =>
    prev.map((u) => {
      if (u.id === usuario.id) {
        return {
          ...u,
          status: 'recusado',
          dataRecusa: new Date().toISOString(),
        };
      }
      return u;
    })
  );
}
```

### 3. useAuth.js - Sincronização de Sessão

**Adicionado**: Um `useEffect` que monitora mudanças no nome do usuário em `strykers_usuarios` e sincroniza com a sessão do usuário ativo.

```javascript
// Sincronizar nome do usuário se for alterado na tabela de usuários
useEffect(() => {
  if (!usuarioAtual) return;

  const interval = setInterval(() => {
    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );
    const usuarioAtualizado = usuarios.find(
      (u) => u.id === usuarioAtual.id
    );

    if (usuarioAtualizado && usuarioAtualizado.nome !== usuarioAtual.nome) {
      const sessaoAtualizada = {
        ...usuarioAtual,
        nome: usuarioAtualizado.nome,
      };
      salvarSessao(sessaoAtualizada);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [usuarioAtual, salvarSessao]);
```

**Como funciona**:
1. Verifica a cada 1 segundo se há alterações no nome do usuário em `strykers_usuarios`
2. Se houver, atualiza a sessão do usuário (`strykers_user_session`)
3. Isso causa re-renderização do componente `App.jsx` que exibe o nome no dropdown
4. O `Perfil.jsx` também se beneficia porque busca o membro pelo nome de `usuarioAtual`

## Fluxo Correto Após Alteração

```
1. Admin edita nome em Administracao.jsx
   ↓
2. salvarMembroEdicao() atualiza:
   - strykers_membros (nome do membro)
   - strykers_usuarios (nome do usuário)
   ↓
3. useAuth.js detecta mudança em strykers_usuarios
   ↓
4. useAuth.js atualiza strykers_user_session
   ↓
5. Componentes React re-renderizam:
   - Dropdown mostra novo nome
   - Perfil.jsx consegue encontrar o membro
```

## Testes

### Teste Unitário: `tests/testNameSync.cjs`

Executa com:
```bash
node tests/testNameSync.cjs
```

**Resultado**:
```
✅ SUCCESS: Profile can find member with new name
   Member found: João Silva Atualizado
```

### Teste E2E: `tests/e2e/syncNameFlow.spec.cjs`

Valida o fluxo completo via Playwright (requer servidor rodando).

## Impacto

✅ **Resolvido**: Acesso ao perfil após alteração de nome  
✅ **Resolvido**: Dropdown mostra nome atualizado  
✅ **Resolvido**: Sincronização entre `strykers_usuarios` e `strykers_membros`  
✅ **Resolvido**: Status do usuário atualizado quando membro é deletado  

## Requisitos de Compatibilidade

- React 18.2.0 (usa `useEffect`, `useCallback`, `useState`)
- localStorage (browser)
- Interval de 1 segundo para sincronização (ajustável em `useAuth.js`)

## Possíveis Melhorias Futuras

1. Usar `MutationObserver` em vez de `setInterval` para detecção de mudanças (mais eficiente)
2. Usar `localStorage.setItem` como trigger em vez de polling
3. Implementar sincronização via CustomEvent em vez de polling
4. Adicionar logging de sincronização para debugging
