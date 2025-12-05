import { useState, useCallback, useEffect } from 'react';

export function useAuth() {
  const [usuarioAtual, setUsuarioAtual] = useState(() => {
    const userSession = localStorage.getItem('strykers_user_session');
    if (userSession) {
      try {
        return JSON.parse(userSession);
      } catch (err) {
        console.error('Erro ao carregar sessão:', err);
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Função para salvar sessão (definida primeiro para evitar problemas de dependência)
  const salvarSessao = useCallback((usuario) => {
    localStorage.setItem('strykers_user_session', JSON.stringify(usuario));
    setUsuarioAtual(usuario);
  }, []);

  const limparSessao = useCallback(() => {
    localStorage.removeItem('strykers_user_session');
    setUsuarioAtual(null);
  }, []);

  // Sincronizar com mudanças no localStorage de outras abas/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const userSession = localStorage.getItem('strykers_user_session');
      if (userSession) {
        try {
          setUsuarioAtual(JSON.parse(userSession));
        } catch (err) {
          console.error('Erro ao carregar sessão:', err);
          setUsuarioAtual(null);
        }
      } else {
        setUsuarioAtual(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sincronizar nome do usuário se for alterado na tabela de usuários
  useEffect(() => {
    if (!usuarioAtual) return;

    const interval = setInterval(() => {
      const usuarios = JSON.parse(
        localStorage.getItem('strykers_usuarios') || '[]'
      );
      const usuarioAtualizado = usuarios.find((u) => u.id === usuarioAtual.id);

      if (usuarioAtualizado && usuarioAtualizado.nome !== usuarioAtual.nome) {
        const sessaoAtualizada = {
          ...usuarioAtual,
          nome: usuarioAtualizado.nome,
        };
        localStorage.setItem(
          'strykers_user_session',
          JSON.stringify(sessaoAtualizada)
        );
        setUsuarioAtual(sessaoAtualizada);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [usuarioAtual]); // Removido salvarSessao das dependências

  const login = useCallback(
    (email, senha) => {
      const usuarios = JSON.parse(
        localStorage.getItem('strykers_usuarios') || '[]'
      );
      const usuario = usuarios.find((u) => u.email === email);

      if (!usuario) {
        return { success: false, error: '⚠️ E-mail não cadastrado!' };
      }

      // Check password first (so confirmation modal only shows if email AND password match)
      if (usuario.senha !== senha) {
        return { success: false, error: '⚠️ Senha incorreta!' };
      }

      if (usuario.status === 'aguardando_confirmacao') {
        return {
          success: false,
          error: '⚠️ Você precisa confirmar seu e-mail antes de fazer login.',
          needsConfirmation: true,
          user: usuario,
        };
      }

      if (usuario.status === 'aguardando_aprovacao') {
        return {
          success: false,
          error:
            '⏳ Seu cadastro está aguardando aprovação. Por favor, aguarde.',
        };
      }

      if (usuario.status === 'recusado') {
        return {
          success: false,
          error:
            '❌ Seu cadastro foi recusado. Se não concorda com a decisão, entre em contato via Discord com os responsáveis.',
        };
      }

      const sessionUser = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      };

      salvarSessao(sessionUser);
      return { success: true, user: sessionUser };
    },
    [salvarSessao]
  );

  const cadastro = useCallback(
    (email, emailConfirm, senha, senhaConfirm, nome, whatsapp) => {
      if (email !== emailConfirm) {
        return { success: false, error: '⚠️ Os e-mails não conferem!' };
      }
      if (senha !== senhaConfirm) {
        return { success: false, error: '⚠️ As senhas não conferem!' };
      }
      if (senha.length < 6) {
        return {
          success: false,
          error: '⚠️ A senha deve ter no mínimo 6 caracteres!',
        };
      }

      const usuarios = JSON.parse(
        localStorage.getItem('strykers_usuarios') || '[]'
      );
      const emailExistente = usuarios.find((u) => u.email === email);

      if (emailExistente) {
        if (emailExistente.status === 'aguardando_confirmacao') {
          return {
            success: false,
            error: '⚠️ Este e-mail está aguardando confirmação!',
          };
        }
        if (emailExistente.status === 'aguardando_aprovacao') {
          return {
            success: false,
            error:
              '⏳ Seu cadastro está aguardando aprovação. Por favor, aguarde.',
          };
        }
        if (emailExistente.status === 'recusado') {
          return {
            success: false,
            error:
              '❌ Seu cadastro foi recusado. Se não concorda com a decisão, entre em contato via Discord com os responsáveis.',
          };
        }
        if (emailExistente.status === 'aprovado') {
          return {
            success: false,
            error: '⚠️ Este e-mail já está cadastrado!',
          };
        }
      }

      const codigoConfirmacao = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const novoUsuario = {
        id: Date.now().toString(),
        email,
        senha,
        nome,
        whatsapp: whatsapp || '',
        status: 'aguardando_confirmacao',
        dataCadastro: new Date().toISOString(),
        codigoConfirmacao,
      };

      usuarios.push(novoUsuario);
      localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

      return { success: true, user: novoUsuario };
    },
    []
  );

  const confirmarEmail = useCallback((usuarioId, codigoDigitado) => {
    const usuarios = JSON.parse(
      localStorage.getItem('strykers_usuarios') || '[]'
    );
    const index = usuarios.findIndex((u) => u.id === usuarioId);

    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado!' };
    }

    if (usuarios[index].codigoConfirmacao !== codigoDigitado) {
      return { success: false, error: '⚠️ Código incorreto!' };
    }

    usuarios[index].status = 'aguardando_aprovacao';
    usuarios[index].dataConfirmacao = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

    // Adicionar a lista de alistamentos pendentes
    const pendentes = JSON.parse(
      localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
    );
    pendentes.push({
      id: usuarios[index].id,
      nome: usuarios[index].nome,
      email: usuarios[index].email,
      whatsapp: usuarios[index].whatsapp,
      dataSolicitacao: usuarios[index].dataConfirmacao,
      usuarioCompleto: usuarios[index],
    });
    localStorage.setItem(
      'strykers_alistamentos_pendentes',
      JSON.stringify(pendentes)
    );

    return { success: true };
  }, []);

  const alterarSenha = useCallback(
    (senhaAtual, novaSenha, repetirNovaSenha) => {
      if (!usuarioAtual) {
        return { success: false, error: 'Nenhum usuário logado!' };
      }

      if (!senhaAtual || !novaSenha || !repetirNovaSenha) {
        return {
          success: false,
          error: '⚠️ Preencha todos os campos de senha!',
        };
      }

      if (novaSenha !== repetirNovaSenha) {
        return { success: false, error: '⚠️ As senhas não conferem!' };
      }

      if (novaSenha.length < 6) {
        return {
          success: false,
          error: '⚠️ A nova senha deve ter no mínimo 6 caracteres!',
        };
      }

      const usuarios = JSON.parse(
        localStorage.getItem('strykers_usuarios') || '[]'
      );
      const usuarioIndex = usuarios.findIndex((u) => u.id === usuarioAtual.id);

      if (usuarioIndex === -1) {
        return { success: false, error: '❌ Erro: Usuário não encontrado!' };
      }

      if (usuarios[usuarioIndex].senha !== senhaAtual) {
        return { success: false, error: '⚠️ Senha atual incorreta!' };
      }

      if (novaSenha === senhaAtual) {
        return {
          success: false,
          error: '⚠️ A nova senha não pode ser igual à atual!',
        };
      }

      usuarios[usuarioIndex].senha = novaSenha;
      usuarios[usuarioIndex].dataAlteracaoSenha = new Date().toISOString();
      localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

      return {
        success: true,
        message: `✅ Senha alterada com sucesso!\n\n📧 E-mail de confirmação enviado para ${usuarioAtual.email}`,
      };
    },
    [usuarioAtual]
  );

  const alterarEmail = useCallback(
    (novoEmail, repetirNovoEmail) => {
      if (!usuarioAtual) {
        return { success: false, error: 'Nenhum usuário logado!' };
      }

      if (!novoEmail || !repetirNovoEmail) {
        return {
          success: false,
          error: '⚠️ Preencha todos os campos de e-mail!',
        };
      }

      if (novoEmail !== repetirNovoEmail) {
        return { success: false, error: '⚠️ Os e-mails não conferem!' };
      }

      if (novoEmail === usuarioAtual.email) {
        return {
          success: false,
          error: '⚠️ O novo e-mail não pode ser igual ao atual!',
        };
      }

      const usuarios = JSON.parse(
        localStorage.getItem('strykers_usuarios') || '[]'
      );
      const usuarioIndex = usuarios.findIndex((u) => u.id === usuarioAtual.id);

      if (usuarioIndex === -1) {
        return { success: false, error: '❌ Erro: Usuário não encontrado!' };
      }

      const emailExistente = usuarios.find(
        (u) => u.email === novoEmail && u.id !== usuarioAtual.id
      );
      if (emailExistente) {
        return { success: false, error: '⚠️ Este e-mail já está em uso!' };
      }

      const emailAntigo = usuarios[usuarioIndex].email;
      usuarios[usuarioIndex].email = novoEmail;
      usuarios[usuarioIndex].dataAlteracaoEmail = new Date().toISOString();

      const sessionUser = { ...usuarioAtual, email: novoEmail };
      salvarSessao(sessionUser);

      localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

      return {
        success: true,
        message: `✅ E-mail alterado com sucesso!\n\n📧 E-mail de confirmação enviado para ${emailAntigo}`,
      };
    },
    [usuarioAtual, salvarSessao]
  );

  const salvarConfiguracoes = useCallback(
    (foto, forcaEspecial, atribuicao, observacoes, historico) => {
      if (!usuarioAtual) {
        return { success: false, error: 'Nenhum usuário logado!' };
      }

      const membrosData = JSON.parse(
        localStorage.getItem('strykers_membros') || '[]'
      );
      const index = membrosData.findIndex((m) => m.nome === usuarioAtual.nome);

      if (index !== -1) {
        if (foto) membrosData[index].foto = foto;
        membrosData[index].forcaEspecial = forcaEspecial || 'Não';
        membrosData[index].atribuicao = atribuicao || '';
        membrosData[index].observacoes = observacoes;
        membrosData[index].historico = historico;
        localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
      }

      return { success: true };
    },
    [usuarioAtual]
  );

  const logout = useCallback(() => {
    limparSessao();
  }, [limparSessao]);

  return {
    usuarioAtual,
    isLoading,
    login,
    cadastro,
    confirmarEmail,
    alterarSenha,
    alterarEmail,
    salvarConfiguracoes,
    logout,
  };
}
