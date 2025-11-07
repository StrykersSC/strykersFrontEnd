export const administracaoPage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <div class="mb-8">
        <h2 class="text-4xl font-bold text-white mb-2 tracking-wide">ADMINISTRAÇÃO</h2>
        <p class="text-gray-400">Gerenciamento de alistamentos e membros</p>
      </div>

      <!-- Alistamentos Pendentes -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
        <h3 class="text-2xl font-bold text-yellow-400 mb-4">⏳ ALISTAMENTOS PENDENTES</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-900">
              <tr class="text-left text-cyan-400 font-semibold">
                <th class="px-4 py-3">SOLICITANTE</th>
                <th class="px-4 py-3">E-MAIL</th>
                <th class="px-4 py-3">WHATSAPP</th>
                <th class="px-4 py-3">DATA SOLICITAÇÃO</th>
                <th class="px-4 py-3 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody id="tbody-pendentes" class="text-gray-300">
              <!-- Preenchido dinamicamente -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Alistamentos Recusados -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
        <h3 class="text-2xl font-bold text-red-400 mb-4">❌ ALISTAMENTOS RECUSADOS</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-900">
              <tr class="text-left text-cyan-400 font-semibold">
                <th class="px-4 py-3">SOLICITANTE</th>
                <th class="px-4 py-3">E-MAIL</th>
                <th class="px-4 py-3">WHATSAPP</th>
                <th class="px-4 py-3">DATA SOLICITAÇÃO</th>
                <th class="px-4 py-3 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody id="tbody-recusados" class="text-gray-300">
              <!-- Preenchido dinamicamente -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Membros Registrados -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h3 class="text-2xl font-bold text-green-400 mb-4">✅ MEMBROS REGISTRADOS</h3>
        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table class="w-full">
            <thead class="bg-slate-900 sticky top-0">
              <tr class="text-left text-cyan-400 font-semibold">
                <th class="px-4 py-3">NOME</th>
                <th class="px-4 py-3">PATENTE</th>
                <th class="px-4 py-3">ATRIBUIÇÃO</th>
                <th class="px-4 py-3">DATA REGISTRO</th>
                <th class="px-4 py-3">SITUAÇÃO</th>
                <th class="px-4 py-3">FORÇA ESPECIAL</th>
                <th class="px-4 py-3 text-center">MEDALHAS</th>
                <th class="px-4 py-3 text-center">MISSÕES</th>
                <th class="px-4 py-3">E-MAIL</th>
                <th class="px-4 py-3">WHATSAPP</th>
                <th class="px-4 py-3 text-center">OBS</th>
                <th class="px-4 py-3 text-center">HIST</th>
              </tr>
            </thead>
            <tbody id="tbody-membros" class="text-gray-300">
              <!-- Preenchido dinamicamente -->
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
};

export function initAdministracao() {
  renderizarPendentes();
  renderizarRecusados();
  renderizarMembrosRegistrados();
}

function renderizarPendentes() {
  const tbody = document.getElementById('tbody-pendentes');
  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );

  if (pendentes.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center py-8 text-gray-400">Nenhum alistamento pendente</td></tr>';
    return;
  }

  tbody.innerHTML = pendentes
    .map((p) => {
      const data = new Date(p.dataSolicitacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return `
      <tr class="border-b border-slate-700 hover:bg-slate-700/30">
        <td class="px-4 py-3 font-semibold">${p.nome}</td>
        <td class="px-4 py-3">${p.email}</td>
        <td class="px-4 py-3">${p.whatsapp || '-'}</td>
        <td class="px-4 py-3">${data}</td>
        <td class="px-4 py-3 text-center">
          <button 
            onclick="window.aprovarAlistamento('${p.id}')"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2 transition-colors"
            title="Aprovar"
          >✓</button>
          <button 
            onclick="window.recusarAlistamento('${p.id}')"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            title="Recusar"
          >✕</button>
        </td>
      </tr>
    `;
    })
    .join('');
}

function renderizarRecusados() {
  const tbody = document.getElementById('tbody-recusados');
  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );

  if (recusados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center py-8 text-gray-400">Nenhum alistamento recusado</td></tr>';
    return;
  }

  tbody.innerHTML = recusados
    .map((r) => {
      const data = new Date(r.dataSolicitacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return `
      <tr class="border-b border-slate-700 hover:bg-slate-700/30">
        <td class="px-4 py-3 font-semibold">${r.nome}</td>
        <td class="px-4 py-3">${r.email}</td>
        <td class="px-4 py-3">${r.whatsapp || '-'}</td>
        <td class="px-4 py-3">${data}</td>
        <td class="px-4 py-3 text-center">
          <button 
            onclick="window.realistarUsuario('${r.id}')"
            class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2 transition-colors text-sm"
          >🔄 Realistar</button>
          <button 
            onclick="window.excluirAlistamento('${r.id}')"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm"
          >🗑️ Excluir</button>
        </td>
      </tr>
    `;
    })
    .join('');
}

function renderizarMembrosRegistrados() {
  const tbody = document.getElementById('tbody-membros');
  const membros = JSON.parse(localStorage.getItem('strykers_membros') || '[]');
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );

  if (membros.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="12" class="text-center py-8 text-gray-400">Nenhum membro registrado</td></tr>';
    return;
  }

  tbody.innerHTML = membros
    .map((m) => {
      // Buscar dados do usuário correspondente
      const usuario = usuarios.find(
        (u) => u.nome === m.nome && u.status === 'aprovado'
      );
      const totalMissoes =
        (m.eventosParticipados?.length || 0) + (m.valorHistorico || 0);

      return `
      <tr class="border-b border-slate-700 hover:bg-slate-700/30 text-sm">
        <td class="px-4 py-3 font-semibold">${m.nome}</td>
        <td class="px-4 py-3">${m.patente}</td>
        <td class="px-4 py-3">${m.atribuicao}</td>
        <td class="px-4 py-3">${m.dataRegistro}</td>
        <td class="px-4 py-3">${m.situacao}</td>
        <td class="px-4 py-3">${m.forcaEspecial || 'Não'}</td>
        <td class="px-4 py-3 text-center">
          <button 
            onclick="window.mostrarMedalhasMembro('${m.id}')"
            class="text-yellow-400 hover:text-yellow-300 cursor-pointer"
          >${m.medalhas || 0} 👁️</button>
        </td>
        <td class="px-4 py-3 text-center">
          <button 
            onclick="window.mostrarMissoesMembro('${m.id}')"
            class="text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >${totalMissoes} 👁️</button>
        </td>
        <td class="px-4 py-3">${usuario?.email || '-'}</td>
        <td class="px-4 py-3">${usuario?.whatsapp || '-'}</td>
        <td class="px-4 py-3 text-center">
          ${
            m.observacoes
              ? `<button onclick="window.mostrarTexto('Observações', \`${m.observacoes
                  .replace(/`/g, '\\`')
                  .replace(
                    /\n/g,
                    '\\n'
                  )}\`)" class="text-cyan-400 hover:text-cyan-300">📋</button>`
              : '-'
          }
        </td>
        <td class="px-4 py-3 text-center">
          ${
            m.historico
              ? `<button onclick="window.mostrarTexto('Histórico', \`${m.historico
                  .replace(/`/g, '\\`')
                  .replace(
                    /\n/g,
                    '\\n'
                  )}\`)" class="text-cyan-400 hover:text-cyan-300">📋</button>`
              : '-'
          }
        </td>
      </tr>
    `;
    })
    .join('');
}

// ==================== FUNÇÕES DE APROVAÇÃO/RECUSA ====================
function aprovarAlistamento(id) {
  if (!confirm('✅ Confirma a aprovação deste alistamento?')) return;

  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );
  const index = pendentes.findIndex((p) => p.id === id);

  if (index === -1) return;

  const alistamento = pendentes[index];

  // Criar membro
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );

  const novoMembro = {
    id: gerarIdMembro(alistamento.nome),
    nome: alistamento.nome,
    foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      alistamento.nome
    )}&background=0f172a&color=22d3ee&size=150`,
    patente: 'Recruta',
    atribuicao: 'Infantaria',
    medalhas: 0,
    dataRegistro: new Date().toISOString().split('T')[0],
    situacao: 'Ativo',
    missoes: 0,
    forcaEspecial: 'Não',
    observacoes: '',
    eventosParticipados: [],
    historico: '',
    valorHistorico: 0,
    medalhasDetalhadas: [],
  };

  membrosData.push(novoMembro);
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));

  // Atualizar status do usuário
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'aprovado';
    usuarios[userIndex].dataAprovacao = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

  // Remover dos pendentes
  pendentes.splice(index, 1);
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
  );

  alert('✅ Alistamento aprovado! Membro adicionado ao sistema.');
  renderizarPendentes();
  renderizarMembrosRegistrados();
}

function recusarAlistamento(id) {
  if (
    !confirm(
      '❌ Confirma a recusa deste alistamento?\n\nUm e-mail será enviado ao solicitante.'
    )
  )
    return;

  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );
  const index = pendentes.findIndex((p) => p.id === id);

  if (index === -1) return;

  const alistamento = pendentes[index];

  // Adicionar aos recusados
  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  recusados.push({
    ...alistamento,
    dataRecusa: new Date().toISOString(),
  });
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(recusados)
  );

  // Atualizar status do usuário
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'recusado';
    usuarios[userIndex].dataRecusa = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

  // Remover dos pendentes
  pendentes.splice(index, 1);
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
  );

  // Simular envio de e-mail
  console.log(
    `📧 E-mail enviado para ${alistamento.email}: Seu cadastro foi recusado. Se não concorda com a decisão, entre em contato via Discord.`
  );

  alert('❌ Alistamento recusado! E-mail de notificação enviado.');
  renderizarPendentes();
  renderizarRecusados();
}

function realistarUsuario(id) {
  if (
    !confirm(
      '🔄 Confirma que deseja dar uma segunda chance a este alistamento?'
    )
  )
    return;

  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  const index = recusados.findIndex((r) => r.id === id);

  if (index === -1) return;

  const alistamento = recusados[index];

  // Adicionar de volta aos pendentes
  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );
  pendentes.push({
    ...alistamento,
    dataSolicitacao: new Date().toISOString(),
  });
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
  );

  // Atualizar status do usuário
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'aguardando_aprovacao';
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

  // Remover dos recusados
  recusados.splice(index, 1);
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(recusados)
  );

  alert('✅ Alistamento devolvido para lista de pendentes!');
  renderizarRecusados();
  renderizarPendentes();
}

function excluirAlistamento(id) {
  if (
    !confirm(
      '⚠️ ATENÇÃO!\n\nEsta ação irá EXCLUIR PERMANENTEMENTE todos os dados deste usuário.\n\nDeseja continuar?'
    )
  )
    return;

  // Remover dos recusados
  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  const newRecusados = recusados.filter((r) => r.id !== id);
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(newRecusados)
  );

  // Remover usuário
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const newUsuarios = usuarios.filter((u) => u.id !== id);
  localStorage.setItem('strykers_usuarios', JSON.stringify(newUsuarios));

  alert('✅ Alistamento excluído permanentemente!');
  renderizarRecusados();
}

function mostrarTexto(titulo, texto) {
  let modal = document.getElementById('modal-texto-admin');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-texto-admin';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/70" onclick="window.fecharModalTextoAdmin()"></div>
    <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <button onclick="window.fecharModalTextoAdmin()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
      <h2 class="text-2xl font-bold text-cyan-400 mb-4">${titulo}</h2>
      <div class="text-gray-300 leading-relaxed whitespace-pre-wrap">${texto}</div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function fecharModalTextoAdmin() {
  const modal = document.getElementById('modal-texto-admin');
  if (modal) modal.classList.add('hidden');
}

function gerarIdMembro(nome) {
  return (
    nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now()
  );
}

// Expor funções globalmente
window.aprovarAlistamento = aprovarAlistamento;
window.recusarAlistamento = recusarAlistamento;
window.realistarUsuario = realistarUsuario;
window.excluirAlistamento = excluirAlistamento;
window.mostrarTexto = mostrarTexto;
window.fecharModalTextoAdmin = fecharModalTextoAdmin;
