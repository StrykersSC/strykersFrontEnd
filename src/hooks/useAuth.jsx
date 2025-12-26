import { useState, useEffect, createContext, useContext } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioLogado = localStorage.getItem('strykers_usuario_logado');
    if (usuarioLogado) {
      try {
        const usuario = JSON.parse(usuarioLogado);
        setUsuarioAtual(usuario);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('strykers_usuario_logado');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Função de login
   */
  function login(email, senha) {
    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );

    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    if (usuario.senha !== senha) {
      return { success: false, error: 'Senha incorreta' };
    }

    if (!usuario.emailConfirmado) {
      return {
        success: false,
        error: 'Por favor, confirme seu e-mail antes de fazer login',
        needsConfirmation: true,
        user: usuario,
      };
    }

    if (usuario.status === 'recusado') {
      return {
        success: false,
        error:
          'Seu alistamento foi recusado. Entre em contato com a administração.',
      };
    }

    if (usuario.status === 'aguardando_aprovacao') {
      return {
        success: false,
        error: 'Seu alistamento está aguardando aprovação.',
      };
    }

    // ✅ Login bem-sucedido
    const usuarioLogado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role || ROLES.USER, // ✅ Adiciona role padrão
      status: usuario.status,
    };

    localStorage.setItem(
      'strykers_usuario_logado',
      JSON.stringify(usuarioLogado)
    );
    setUsuarioAtual(usuarioLogado);

    return { success: true, user: usuarioLogado };
  }

  /**
   * Função de cadastro
   */
  function cadastro(
    email,
    emailConfirm,
    senha,
    senhaConfirm,
    nome,
    whatsapp = ''
  ) {
    // Validações
    if (!email || !senha || !nome) {
      return { success: false, error: 'Preencha todos os campos obrigatórios' };
    }

    if (email !== emailConfirm) {
      return { success: false, error: 'Os e-mails não coincidem' };
    }

    if (senha !== senhaConfirm) {
      return { success: false, error: 'As senhas não coincidem' };
    }

    if (senha.length < 6) {
      return {
        success: false,
        error: 'A senha deve ter no mínimo 6 caracteres',
      };
    }

    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );

    // Verificar se e-mail já existe
    if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Este e-mail já está cadastrado' };
    }

    // Gerar código de confirmação
    const codigoConfirmacao = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Criar novo usuário
    const novoUsuario = {
      id: 'user-' + Date.now(),
      nome,
      email: email.toLowerCase(),
      senha,
      whatsapp,
      role: ROLES.USER, // ✅ Role padrão para novos usuários
      status: 'aguardando_aprovacao',
      emailConfirmado: false,
      codigoConfirmacao,
      dataSolicitacao: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

    // Adicionar à lista de pendentes
    const pendentes = JSON.parse(
      localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
    );
    pendentes.push({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      whatsapp: novoUsuario.whatsapp,
      dataSolicitacao: novoUsuario.dataSolicitacao,
    });
    localStorage.setItem(
      'strykers_alistamentos_pendentes',
      JSON.stringify(pendentes)
    );

    console.log('🔐 Código de confirmação:', codigoConfirmacao);

    return { success: true, user: novoUsuario };
  }

  /**
   * Função de logout
   */
  function logout() {
    localStorage.removeItem('strykers_usuario_logado');
    setUsuarioAtual(null);
  }

  /**
   * Confirmar e-mail
   */
  function confirmarEmail(usuarioId, codigo) {
    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );

    const index = usuarios.findIndex((u) => u.id === usuarioId);
    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    if (usuarios[index].codigoConfirmacao !== codigo) {
      return { success: false, error: 'Código inválido' };
    }

    usuarios[index].emailConfirmado = true;
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

    return { success: true };
  }

  /**
   * Atualizar role de um usuário (apenas SUPER_ADMIN)
   */
  function updateUserRole(userId, newRole) {
    if (!usuarioAtual || usuarioAtual.role !== ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Sem permissão para alterar roles' };
    }

    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );

    const index = usuarios.findIndex((u) => u.id === userId);
    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    usuarios[index].role = newRole;
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

    // Se for o próprio usuário, atualizar estado
    if (userId === usuarioAtual.id) {
      const updatedUser = { ...usuarioAtual, role: newRole };
      setUsuarioAtual(updatedUser);
      localStorage.setItem(
        'strykers_usuario_logado',
        JSON.stringify(updatedUser)
      );
    }

    return { success: true };
  }

  const value = {
    usuarioAtual,
    loading,
    login,
    logout,
    cadastro,
    confirmarEmail,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
