// Sistema de Autenticação
let usuarioAtual = null;

export function initAuth() {
  carregarUsuarioAtual();
  renderizarBotaoAuth();
}

function carregarUsuarioAtual() {
  const userSession = localStorage.getItem('strykers_user_session');
  if (userSession) {
    usuarioAtual = JSON.parse(userSession);
  }
}

function salvarSessao(usuario) {
  localStorage.setItem('strykers_user_session', JSON.stringify(usuario));
  usuarioAtual = usuario;
}

function limparSessao() {
  localStorage.removeItem('strykers_user_session');
  usuarioAtual = null;
}

export function getUsuarioAtual() {
  return usuarioAtual;
}

export function renderizarBotaoAuth() {
  const menuContainer = document.querySelector('.flex.items-center.space-x-8');
  if (!menuContainer) return;

  const existingAuth = document.getElementById('auth-container');
  if (existingAuth) existingAuth.remove();

  const oldDropdown = document.getElementById('user-dropdown');
  if (oldDropdown) oldDropdown.remove();

  const authContainer = document.createElement('div');
  authContainer.id = 'auth-container';
  authContainer.className = 'ml-auto pl-8 border-l border-slate-700';

  if (usuarioAtual) {
    authContainer.innerHTML = `
      <div class="relative">
        <button id="user-menu-btn" type="button"
          class="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors pb-1 flex items-center gap-2">
          ${usuarioAtual.nome}
          <span class="text-sm">▼</span>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button id="btn-signin" class="text-gray-300 font-semibold hover:text-cyan-400 transition-colors pb-1">
        SIGN IN
      </button>
    `;
  }
  menuContainer.appendChild(authContainer);
  setupAuthEventListeners();
}

function setupAuthEventListeners() {
  const signinBtn = document.getElementById('btn-signin');
  if (signinBtn) signinBtn.addEventListener('click', abrirModalLogin);

  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(userMenuBtn);
    });
  }
}

function toggleDropdown(btn) {
  let dropdown = document.getElementById('user-dropdown');

  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'user-dropdown';
    dropdown.className =
      'absolute bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-[9999] w-48 min-w-[12rem] py-2';
    dropdown.style.display = 'none';
    dropdown.innerHTML = `
      <a href="#perfil" data-page="perfil"
        class="nav-link block px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700">
        👤 Perfil
      </a>
      <button id="btn-configuracoes"
        class="w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700">
        ⚙️ Configurações
      </button>
      <button id="btn-config-conta"
        class="w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700">
        🔐 Configuração de Conta
      </button>
      <button id="btn-logout"
        class="w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-red-400 transition-colors">
        🚪 Sair
      </button>
    `;
    document.body.appendChild(dropdown);

    document
      .getElementById('btn-configuracoes')
      .addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        abrirConfiguracoes();
        fecharDropdownManual();
      });

    document
      .getElementById('btn-config-conta')
      .addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        abrirConfigConta();
        fecharDropdownManual();
      });

    document.getElementById('btn-logout').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      realizarLogout();
    });
  }

  const rect = btn.getBoundingClientRect();
  dropdown.style.position = 'fixed';
  dropdown.style.top = `${rect.bottom + 4}px`;
  dropdown.style.right = `${window.innerWidth - rect.right}px`;
  dropdown.style.left = 'auto';

  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    setTimeout(() => {
      document.addEventListener('click', fecharDropdownAoClicarFora);
    }, 0);
  }
}

function fecharDropdownManual() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
    document.removeEventListener('click', fecharDropdownAoClicarFora);
  }
}

function fecharDropdownAoClicarFora(e) {
  const dropdown = document.getElementById('user-dropdown');
  const menuBtn = document.getElementById('user-menu-btn');
  if (!dropdown || !menuBtn) return;
  if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
    dropdown.style.display = 'none';
    document.removeEventListener('click', fecharDropdownAoClicarFora);
  }
}

function realizarLogout() {
  if (confirm('Deseja realmente sair?')) {
    limparSessao();
    renderizarBotaoAuth();
    if (window.router) window.router.navigate('home');
    alert('✅ Logout realizado com sucesso!');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.remove();
  }
}

// ==================== CONFIGURAÇÃO DE CONTA ====================
function abrirConfigConta() {
  if (!usuarioAtual) {
    alert('⚠️ Você precisa estar logado!');
    return;
  }

  let modal = document.getElementById('modal-config-conta');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-config-conta';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/70" onclick="window.fecharConfigConta()"></div>
    <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <button onclick="window.fecharConfigConta()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
      <h2 class="text-3xl font-bold text-cyan-400 mb-6 text-center">🔐 CONFIGURAÇÃO DE CONTA</h2>
      
      <div class="mb-6 pb-6 border-b border-slate-700">
        <h3 class="text-xl font-bold text-white mb-4">Alterar Senha</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm mb-2">SENHA ATUAL</label>
            <input type="password" id="senha-atual-config"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="••••••••" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">NOVA SENHA</label>
            <input type="password" id="nova-senha-config"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">REPETIR NOVA SENHA</label>
            <input type="password" id="repetir-nova-senha-config"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="••••••••" />
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold text-white mb-4">Alterar E-mail</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm mb-2">E-MAIL ATUAL</label>
            <input type="email" disabled value="${usuarioAtual.email}"
              class="w-full bg-slate-800 text-gray-500 border border-slate-700 rounded px-4 py-2" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">NOVO E-MAIL</label>
            <input type="email" id="novo-email-config"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="novo@email.com" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">REPETIR NOVO E-MAIL</label>
            <input type="email" id="repetir-novo-email-config"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="novo@email.com" />
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <button onclick="window.confirmarAlteracoes()" type="button"
          class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
          ✓ CONFIRMAR
        </button>
        <button onclick="window.fecharConfigConta()" type="button"
          class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">
          ✕ CANCELAR
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function confirmarAlteracoes() {
  const senhaAtual = document.getElementById('senha-atual-config')?.value || '';
  const novaSenha = document.getElementById('nova-senha-config')?.value || '';
  const repetirNovaSenha =
    document.getElementById('repetir-nova-senha-config')?.value || '';

  const novoEmail =
    document.getElementById('novo-email-config')?.value.trim().toLowerCase() ||
    '';
  const repetirNovoEmail =
    document
      .getElementById('repetir-novo-email-config')
      ?.value.trim()
      .toLowerCase() || '';

  let alteracoes = [];

  if (senhaAtual || novaSenha || repetirNovaSenha) {
    if (!senhaAtual) {
      alert('⚠️ Digite a senha atual!');
      return;
    }
    if (!novaSenha || !repetirNovaSenha) {
      alert('⚠️ Preencha todos os campos de senha!');
      return;
    }
    if (novaSenha !== repetirNovaSenha) {
      alert('⚠️ As senhas não conferem!');
      return;
    }
    if (novaSenha.length < 6) {
      alert('⚠️ A nova senha deve ter no mínimo 6 caracteres!');
      return;
    }
    alteracoes.push('senha');
  }

  if (novoEmail || repetirNovoEmail) {
    if (!novoEmail || !repetirNovoEmail) {
      alert('⚠️ Preencha todos os campos de e-mail!');
      return;
    }
    if (novoEmail !== repetirNovoEmail) {
      alert('⚠️ Os e-mails não conferem!');
      return;
    }
    if (novoEmail === usuarioAtual.email) {
      alert('⚠️ O novo e-mail não pode ser igual ao atual!');
      return;
    }
    alteracoes.push('email');
  }

  if (alteracoes.length === 0) {
    alert('⚠️ Nenhuma alteração foi detectada!');
    return;
  }

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const usuarioIndex = usuarios.findIndex((u) => u.id === usuarioAtual.id);

  if (usuarioIndex === -1) {
    alert('❌ Erro: Usuário não encontrado!');
    return;
  }

  if (alteracoes.includes('senha')) {
    if (usuarios[usuarioIndex].senha !== senhaAtual) {
      alert('⚠️ Senha atual incorreta!');
      return;
    }
    if (novaSenha === senhaAtual) {
      alert('⚠️ A nova senha não pode ser igual à atual!');
      return;
    }
  }

  if (alteracoes.includes('email')) {
    const emailExistente = usuarios.find(
      (u) => u.email === novoEmail && u.id !== usuarioAtual.id
    );
    if (emailExistente) {
      alert('⚠️ Este e-mail já está em uso!');
      return;
    }
  }

  if (alteracoes.includes('senha')) {
    usuarios[usuarioIndex].senha = novaSenha;
    usuarios[usuarioIndex].dataAlteracaoSenha = new Date().toISOString();
    alert(
      '✅ Senha alterada com sucesso!\n\n📧 E-mail de confirmação enviado para ' +
        usuarioAtual.email
    );
  }

  if (alteracoes.includes('email')) {
    const emailAntigo = usuarios[usuarioIndex].email;
    usuarios[usuarioIndex].email = novoEmail;
    usuarios[usuarioIndex].dataAlteracaoEmail = new Date().toISOString();

    usuarioAtual.email = novoEmail;
    salvarSessao(usuarioAtual);

    alert(
      '✅ E-mail alterado com sucesso!\n\n📧 E-mail de confirmação enviado para ' +
        emailAntigo
    );
  }

  localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  fecharConfigConta();
}

function fecharConfigConta() {
  const modal = document.getElementById('modal-config-conta');
  if (modal) modal.style.display = 'none';
}

// ==================== MODAL DE LOGIN ====================
function abrirModalLogin() {
  let modal = document.getElementById('modal-login');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-login';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/70" onclick="window.fecharModalLogin()"></div>
      <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4">
        <button onclick="window.fecharModalLogin()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
        
        <h2 class="text-3xl font-bold text-cyan-400 mb-6 text-center">SIGN IN</h2>
        
        <form id="form-login" class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm mb-2">E-MAIL</label>
            <input type="email" id="login-email" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">SENHA</label>
            <input type="password" id="login-senha" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="••••••••" />
          </div>
          <button type="submit"
            class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
            ENTRAR
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            Ainda não tem uma conta? 
            <button onclick="window.abrirModalCadastro()" class="text-cyan-400 hover:text-cyan-300 font-semibold">
              Cadastre-se aqui
            </button>
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document
      .getElementById('form-login')
      .addEventListener('submit', realizarLogin);
  }
  modal.classList.remove('hidden');
}

function fecharModalLogin() {
  const modal = document.getElementById('modal-login');
  if (modal) modal.classList.add('hidden');
}

async function realizarLogin(e) {
  e.preventDefault();
  const email = document
    .getElementById('login-email')
    .value.trim()
    .toLowerCase();
  const senha = document.getElementById('login-senha').value;
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    alert('⚠️ E-mail não cadastrado!');
    return;
  }

  if (usuario.status === 'aguardando_confirmacao') {
    mostrarMensagemEmailPendente();
    return;
  }

  if (usuario.status === 'aguardando_aprovacao') {
    alert('⏳ Seu cadastro está aguardando aprovação. Por favor, aguarde.');
    return;
  }

  if (usuario.status === 'recusado') {
    alert(
      '❌ Seu cadastro foi recusado. Se não concorda com a decisão, entre em contato via Discord com os responsáveis.'
    );
    return;
  }

  if (usuario.senha !== senha) {
    alert('⚠️ Senha incorreta!');
    return;
  }

  salvarSessao({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  fecharModalLogin();
  renderizarBotaoAuth();
  alert('✅ Login realizado com sucesso!');
}

function mostrarMensagemEmailPendente() {
  if (
    confirm(
      '⚠️ Você precisa confirmar seu e-mail antes de fazer login.\n\nDeseja reenviar o e-mail de confirmação?'
    )
  ) {
    alert(
      '✉️ E-mail de confirmação reenviado! Verifique sua caixa de entrada.'
    );
  }
}

// ==================== MODAL DE CADASTRO ====================
function abrirModalCadastro() {
  fecharModalLogin();
  let modal = document.getElementById('modal-cadastro');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-cadastro';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden overflow-y-auto';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/70" onclick="window.fecharModalCadastro()"></div>
      <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 my-8">
        <button onclick="window.fecharModalCadastro()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
        <h2 class="text-3xl font-bold text-cyan-400 mb-6 text-center">CADASTRO</h2>
        <form id="form-cadastro" class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm mb-2">E-MAIL *</label>
            <input type="email" id="cadastro-email" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">CONFIRMAR E-MAIL *</label>
            <input type="email" id="cadastro-email-confirm" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">SENHA *</label>
            <input type="password" id="cadastro-senha" required minlength="6"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">CONFIRMAR SENHA *</label>
            <input type="password" id="cadastro-senha-confirm" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="••••••••" />
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">NOME/NICK *</label>
            <input type="text" id="cadastro-nome" required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Seu nome no Star Citizen" />
            <p class="text-yellow-400 text-xs mt-1">⚠️ Use o mesmo nome registrado no Star Citizen (RSI)</p>
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">WHATSAPP (opcional)</label>
            <input type="tel" id="cadastro-whatsapp"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="(00) 00000-0000" />
          </div>
          <div class="flex gap-4 pt-4">
            <button type="submit"
              class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
              CONFIRMAR
            </button>
            <button type="button" onclick="window.fecharModalCadastro()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    document
      .getElementById('form-cadastro')
      .addEventListener('submit', realizarCadastro);
  }
  modal.classList.remove('hidden');
}

function fecharModalCadastro() {
  const modal = document.getElementById('modal-cadastro');
  if (modal) modal.classList.add('hidden');
}

async function realizarCadastro(e) {
  e.preventDefault();
  const email = document
    .getElementById('cadastro-email')
    .value.trim()
    .toLowerCase();
  const emailConfirm = document
    .getElementById('cadastro-email-confirm')
    .value.trim()
    .toLowerCase();
  const senha = document.getElementById('cadastro-senha').value;
  const senhaConfirm = document.getElementById('cadastro-senha-confirm').value;
  const nome = document.getElementById('cadastro-nome').value.trim();
  const whatsapp = document.getElementById('cadastro-whatsapp').value.trim();

  if (email !== emailConfirm) {
    alert('⚠️ Os e-mails não conferem!');
    return;
  }
  if (senha !== senhaConfirm) {
    alert('⚠️ As senhas não conferem!');
    return;
  }
  if (senha.length < 6) {
    alert('⚠️ A senha deve ter no mínimo 6 caracteres!');
    return;
  }

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const emailExistente = usuarios.find((u) => u.email === email);

  if (emailExistente) {
    if (emailExistente.status === 'aguardando_confirmacao') {
      mostrarMensagemEmailPendente();
      return;
    }
    if (emailExistente.status === 'aguardando_aprovacao') {
      alert('⏳ Seu cadastro está aguardando aprovação. Por favor, aguarde.');
      return;
    }
    if (emailExistente.status === 'recusado') {
      alert(
        '❌ Seu cadastro foi recusado. Se não concorda com a decisão, entre em contato via Discord com os responsáveis.'
      );
      return;
    }
    if (emailExistente.status === 'aprovado') {
      alert('⚠️ Este e-mail já está cadastrado!');
      return;
    }
  }

  const novoUsuario = {
    id: Date.now().toString(),
    email,
    senha,
    nome,
    whatsapp,
    status: 'aguardando_confirmacao',
    dataCadastro: new Date().toISOString(),
    codigoConfirmacao: Math.floor(100000 + Math.random() * 900000).toString(),
  };

  usuarios.push(novoUsuario);
  localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  fecharModalCadastro();
  mostrarModalConfirmacaoEmail(novoUsuario);
}

// ==================== MODAL DE CONFIRMAÇÃO DE EMAIL ====================
function mostrarModalConfirmacaoEmail(usuario) {
  let modal = document.getElementById('modal-confirmacao-email');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-confirmacao-email';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/70"></div>
    <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4">
      <h2 class="text-2xl font-bold text-cyan-400 mb-4 text-center">📧 CONFIRME SEU E-MAIL</h2>
      <p class="text-gray-300 mb-6 text-center">
        Enviamos um código de confirmação para<br/>
        <span class="text-cyan-400 font-semibold">${usuario.email}</span>
      </p>
      <div class="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6">
        <p class="text-yellow-400 text-sm text-center">
          🔐 SIMULAÇÃO DE E-MAIL<br/>
          Código: <span class="font-bold text-xl">${usuario.codigoConfirmacao}</span>
        </p>
      </div>
      <form id="form-confirmar-email" class="space-y-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">DIGITE O CÓDIGO</label>
          <input type="text" id="codigo-confirmacao" required maxlength="6"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 text-center text-2xl tracking-widest focus:outline-none focus:border-cyan-400"
            placeholder="000000" />
        </div>
        <button type="submit"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
          CONFIRMAR
        </button>
      </form>
    </div>
  `;

  document
    .getElementById('form-confirmar-email')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      confirmarEmail(usuario);
    });
}

function confirmarEmail(usuario) {
  const codigoDigitado = document.getElementById('codigo-confirmacao').value;
  if (codigoDigitado !== usuario.codigoConfirmacao) {
    alert('⚠️ Código incorreto!');
    return;
  }

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const index = usuarios.findIndex((u) => u.id === usuario.id);

  if (index !== -1) {
    usuarios[index].status = 'aguardando_aprovacao';
    usuarios[index].dataConfirmacao = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
    adicionarAlistamentoPendente(usuarios[index]);

    const modal = document.getElementById('modal-confirmacao-email');
    if (modal) modal.remove();
    alert(
      '✅ E-mail confirmado com sucesso!\n\nSeu cadastro está aguardando aprovação da administração.'
    );
  }
}

function adicionarAlistamentoPendente(usuario) {
  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );
  pendentes.push({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    whatsapp: usuario.whatsapp,
    dataSolicitacao: usuario.dataConfirmacao,
    usuarioCompleto: usuario,
  });
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
  );
}

// ==================== CONFIGURAÇÕES DO USUÁRIO ====================
function abrirConfiguracoes() {
  if (!usuarioAtual) return;

  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.nome === usuarioAtual.nome);

  if (!membro) {
    alert('⚠️ Dados do membro não encontrados!');
    return;
  }

  let modal = document.getElementById('modal-configuracoes');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-configuracoes';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/70" onclick="window.fecharConfiguracoes()"></div>
    <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <button onclick="window.fecharConfiguracoes()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
      <h2 class="text-3xl font-bold text-cyan-400 mb-6">⚙️ CONFIGURAÇÕES</h2>
      <form id="form-configuracoes" class="space-y-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">FOTO (URL)</label>
          <input type="text" id="config-foto" value="${membro.foto || ''}"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            placeholder="https://..." />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-2">FORÇA ESPECIAL</label>
          <input type="text" id="config-forca-especial" value="${
            membro.forcaEspecial || ''
          }"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            placeholder="S.T.O.R.M. ou deixe vazio" />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-2">OBSERVAÇÕES</label>
          <textarea id="config-observacoes" rows="4"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="Suas observações...">${
              membro.observacoes || ''
            }</textarea>
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-2">HISTÓRICO</label>
          <textarea id="config-historico" rows="6"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="Seu histórico militar...">${
              membro.historico || ''
            }</textarea>
        </div>
        <div class="flex gap-4 pt-4">
          <button type="submit"
            class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
            ✓ CONFIRMAR
          </button>
          <button type="button" onclick="window.fecharConfiguracoes()"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">
            ✕ CANCELAR
          </button>
        </div>
      </form>
    </div>
  `;

  modal.classList.remove('hidden');
  document
    .getElementById('form-configuracoes')
    .addEventListener('submit', salvarConfiguracoes);
}

function fecharConfiguracoes() {
  const modal = document.getElementById('modal-configuracoes');
  if (modal) modal.classList.add('hidden');
}

function salvarConfiguracoes(e) {
  e.preventDefault();
  if (!usuarioAtual) return;

  const foto = document.getElementById('config-foto').value.trim();
  const forcaEspecial = document
    .getElementById('config-forca-especial')
    .value.trim();
  const observacoes = document
    .getElementById('config-observacoes')
    .value.trim();
  const historico = document.getElementById('config-historico').value.trim();

  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const index = membrosData.findIndex((m) => m.nome === usuarioAtual.nome);

  if (index !== -1) {
    if (foto) membrosData[index].foto = foto;
    membrosData[index].forcaEspecial = forcaEspecial || 'Não';
    membrosData[index].observacoes = observacoes;
    membrosData[index].historico = historico;
    localStorage.setItem('strykers_membros', JSON.stringify(membrosData));

    fecharConfiguracoes();
    alert('✅ Configurações salvas com sucesso!');

    if (window.router && window.router.currentPage === 'perfil') {
      window.router.navigate('perfil');
    }
  }
}

// Expor funções globalmente
window.fecharModalLogin = fecharModalLogin;
window.abrirModalCadastro = abrirModalCadastro;
window.fecharModalCadastro = fecharModalCadastro;
window.fecharConfiguracoes = fecharConfiguracoes;
window.fecharConfigConta = fecharConfigConta;
window.confirmarAlteracoes = confirmarAlteracoes;
