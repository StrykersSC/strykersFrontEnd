import {
  mostrarMedalhasMembro,
  fecharMedalhasSidebar,
  getMedalhaInfo,
  mostrarDetalhesMedalha,
  fecharModalMedalha,
  mostrarMissoesMembro,
  fecharMissoesSidebar,
  mostrarHistoricoMembro,
  fecharHistoricoMembro,
  mostrarDetalhesMissaoDoEvento,
  fecharDetalhesMissao,
} from '../components/membros-utils.js';
import { renderCalendario } from '../components/calendario.js';
import { initSidebarsEventos, initEventosGlobais } from '../eventos.js';

export const administracaoPage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-4xl font-bold text-white mb-2 tracking-wide">ADMINISTRAÇÃO</h2>
        </div>
        <button id="btn-novo-evento" class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">➕ Cadastrar Evento</button>
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
            <tbody id="tbody-pendentes" class="text-gray-300"></tbody>
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
            <tbody id="tbody-recusados" class="text-gray-300"></tbody>
          </table>
        </div>
      </div>

      <!-- Membros Registrados -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h3 class="text-2xl font-bold text-green-400 mb-4">✅ MEMBROS REGISTRADOS</h3>
        <!-- Filtros -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <input type="text" id="admin-search" placeholder="Buscar por nome..." class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
          <select id="admin-filter-patente" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2">
            <option value="">Todas Patentes</option>
          </select>
          <select id="admin-filter-situacao" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2">
            <option value="">Todas Situações</option>
            <option value="Ativo">Ativo</option>
            <option value="Reservista">Reservista</option>
            <option value="Desertor">Desertor</option>
          </select>
          <select id="admin-filter-forca" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2">
            <option value="">Todas Forças</option>
            <option value="S.T.O.R.M.">S.T.O.R.M.</option>
            <option value="Não">Não</option>
          </select>
          <input type="date" id="admin-filter-data" placeholder="Data Registro" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
          <button id="admin-clear-filters" class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-4 py-2"> Limpar </button>
        </div>
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
                <th class="px-4 py-3 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody id="tbody-membros" class="text-gray-300"></tbody>
          </table>
        </div>

         <!-- Calendário de Eventos da Administração -->
      <div id="admin-calendario-eventos" class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mt-8"></div>
    </main>

    <!-- Aside para Cadastrar/Editar Evento -->
    <aside id="evento-sidebar" class="fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-[70] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400" id="sidebar-titulo">CADASTRAR EVENTO</h3>
          <button id="close-evento-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        <form id="form-evento" class="space-y-6">
          <!-- Nome do Evento -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">NOME DO EVENTO *</label>
            <input type="text" id="evento-nome" required class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" placeholder="Ex: Treinamento de Combate CQB" />
          </div>
          <!-- Categoria -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">CATEGORIA *</label>
            <select id="evento-categoria" required class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
              <option value="">Selecione uma categoria</option>
              <option value="treinamento">Treinamento</option>
              <option value="missao">Missão</option>
              <option value="operacao">Operação</option>
              <option value="mega-operacao">Mega Operação</option>
              <option value="campanha">Campanha</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <!-- Data -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">DATA *</label>
            <input type="date" id="evento-data" required class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
          </div>
          <!-- Horário -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">HORÁRIO *</label>
            <input type="time" id="evento-horario" required class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
          </div>
          <!-- Descrição -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">DESCRIÇÃO *</label>
            <textarea id="evento-descricao" required rows="6" class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none" placeholder="Descreva os detalhes do evento..."></textarea>
          </div>
          <!-- Botões -->
          <div class="flex gap-4">
            <button type="submit" class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">✓ Registrar</button>
            <button type="button" id="btn-limpar-form" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">🗑 Limpar</button>
          </div>
        </form>
      </div>
    </aside>

    <!-- Aside para Ver Detalhes do Evento -->
    <aside id="detalhes-evento-sidebar" class="fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-[70] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400">DETALHES DO EVENTO</h3>
          <button id="close-detalhes-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        <div id="detalhes-evento-content" class="space-y-6"></div>
      </div>
    </aside>

    <!-- Aside para Gerenciar Participantes -->
    <aside id="participantes-evento-sidebar" class="fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 transform -translate-x-full transition-transform duration-300 z-[70] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400">GERENCIAR PARTICIPANTES</h3>
          <button id="close-participantes-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        <!-- Participantes Adicionados -->
        <div class="mb-6">
          <h4 class="text-sm text-gray-400 mb-3">PARTICIPANTES ADICIONADOS</h4>
          <div id="lista-participantes-evento" class="space-y-2 max-h-60 overflow-y-auto"></div>
        </div>
        <!-- Adicionar Participante -->
        <div>
          <h4 class="text-sm text-gray-400 mb-3">ADICIONAR MEMBRO</h4>
          <input type="text" id="search-membro-participante" placeholder="Buscar membro ativo..." class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 mb-3 focus:outline-none focus:border-cyan-400"/>
          <div id="lista-membros-disponiveis" class="space-y-2 max-h-96 overflow-y-auto"></div>
        </div>
      </div>
    </aside>

    <!-- Overlay para sidebars e eventos -->
    <div id="admin-overlay" class="fixed inset-0 bg-black/50 hidden z-[55]"></div>
    <div id="eventos-overlay" class="fixed inset-0 bg-black/50 hidden z-[65]"></div>
  `;
};

export function initAdministracao() {
  renderizarPendentes();
  renderizarRecusados();
  renderizarMembrosRegistrados();
  setupAdminFilters();
  renderCalendario({ modo: 'edicao', containerId: 'admin-calendario-eventos' });
  initEventosGlobais();
}

let membrosRegistradosFiltrados = [];

function setupAdminFilters() {
  const ids = [
    'admin-search',
    'admin-filter-patente',
    'admin-filter-situacao',
    'admin-filter-forca',
    'admin-filter-data',
    'admin-clear-filters',
    'close-edit-sidebar-admin',
    'admin-overlay',
    'btn-novo-evento',
  ];
  for (const id of ids) {
    if (!document.getElementById(id)) {
      console.error(`Elemento #${id} não encontrado no DOM!`);
      return;
    }
  }

  document
    .getElementById('admin-search')
    .addEventListener('input', aplicarFiltrosAdmin);
  document
    .getElementById('admin-filter-patente')
    .addEventListener('change', aplicarFiltrosAdmin);
  document
    .getElementById('admin-filter-situacao')
    .addEventListener('change', aplicarFiltrosAdmin);
  document
    .getElementById('admin-filter-forca')
    .addEventListener('change', aplicarFiltrosAdmin);
  document
    .getElementById('admin-filter-data')
    .addEventListener('change', aplicarFiltrosAdmin);
  document
    .getElementById('admin-clear-filters')
    .addEventListener('click', limparFiltrosAdmin);
  document
    .getElementById('close-edit-sidebar-admin')
    .addEventListener('click', fecharSidebarAdmin);
  document
    .getElementById('admin-overlay')
    .addEventListener('click', fecharSidebarAdmin);
  document.getElementById('btn-novo-evento').addEventListener('click', () => {
    window.router.navigate('eventos', () => {
      if (window.abrirFormularioEvento) window.abrirFormularioEvento();
    });
  });
}

function aplicarFiltrosAdmin() {
  const search = document.getElementById('admin-search').value.toLowerCase();
  const patente = document.getElementById('admin-filter-patente').value;
  const situacao = document.getElementById('admin-filter-situacao').value;
  const forca = document.getElementById('admin-filter-forca').value;
  const data = document.getElementById('admin-filter-data').value;

  const membros = JSON.parse(localStorage.getItem('strykers_membros') || '[]');

  membrosRegistradosFiltrados = membros.filter((m) => {
    const matchNome = !search || m.nome.toLowerCase().includes(search);
    const matchPatente = !patente || m.patente === patente;
    const matchSituacao = !situacao || m.situacao === situacao;
    const matchForca = !forca || m.forcaEspecial === forca;
    const matchData = !data || m.dataRegistro === data;
    return (
      matchNome && matchPatente && matchSituacao && matchForca && matchData
    );
  });

  renderizarMembrosRegistradosFiltrados();
}

function limparFiltrosAdmin() {
  document.getElementById('admin-search').value = '';
  document.getElementById('admin-filter-patente').value = '';
  document.getElementById('admin-filter-situacao').value = '';
  document.getElementById('admin-filter-forca').value = '';
  document.getElementById('admin-filter-data').value = '';
  aplicarFiltrosAdmin();
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
          <button onclick="window.aprovarAlistamento('${p.id}')"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2 transition-colors">✓</button>
          <button onclick="window.recusarAlistamento('${p.id}')"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors">✕</button>
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
          <button onclick="window.realistarUsuario('${r.id}')"
            class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2 transition-colors text-sm">🔄 Realistar</button>
          <button onclick="window.excluirAlistamento('${r.id}')"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm">🗑️ Excluir</button>
        </td>
      </tr>
    `;
    })
    .join('');
}

function renderizarMembrosRegistrados() {
  const membros = JSON.parse(localStorage.getItem('strykers_membros') || '[]');
  membrosRegistradosFiltrados = membros;

  // Popular select de patentes
  const patentes = [...new Set(membros.map((m) => m.patente))].sort();
  const selectPatente = document.getElementById('admin-filter-patente');
  selectPatente.innerHTML = '<option value="">Todas Patentes</option>';
  patentes.forEach((patente) => {
    const option = document.createElement('option');
    option.value = patente;
    option.textContent = patente;
    selectPatente.appendChild(option);
  });

  renderizarMembrosRegistradosFiltrados();
}

function renderizarMembrosRegistradosFiltrados() {
  const tbody = document.getElementById('tbody-membros');
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );

  if (membrosRegistradosFiltrados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="13" class="text-center py-8 text-gray-400">Nenhum membro encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = membrosRegistradosFiltrados
    .map((m) => {
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
          <button onclick="window.mostrarMedalhasMembro('${
            m.id
          }')" class="text-yellow-400 hover:text-yellow-300">
            ${m.medalhas || 0} 👁️
          </button>
        </td>
        <td class="px-4 py-3 text-center">
          <button onclick="window.mostrarMissoesMembro('${
            m.id
          }')" class="text-cyan-400 hover:text-cyan-300">
            ${totalMissoes} 👁️
          </button>
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
        <td class="px-4 py-3 text-center">
          <button onclick="window.editarMembroAdmin('${
            m.id
          }')" class="text-blue-400 hover:text-blue-300 mr-2" title="Editar">✏️</button>
          <button onclick="window.condecorarMembroAdmin('${
            m.id
          }')" class="text-yellow-400 hover:text-yellow-300 mr-2" title="Condecorar">⭐</button>
          <button onclick="window.excluirMembroAdmin('${
            m.id
          }')" class="text-red-400 hover:text-red-300" title="Excluir">🗑️</button>
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

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'aprovado';
    usuarios[userIndex].dataAprovacao = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

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
  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  recusados.push({ ...alistamento, dataRecusa: new Date().toISOString() });
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(recusados)
  );

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'recusado';
    usuarios[userIndex].dataRecusa = new Date().toISOString();
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

  pendentes.splice(index, 1);
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
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
  const pendentes = JSON.parse(
    localStorage.getItem('strykers_alistamentos_pendentes') || '[]'
  );
  pendentes.push({ ...alistamento, dataSolicitacao: new Date().toISOString() });
  localStorage.setItem(
    'strykers_alistamentos_pendentes',
    JSON.stringify(pendentes)
  );

  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const userIndex = usuarios.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    usuarios[userIndex].status = 'aguardando_aprovacao';
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }

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

  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  const newRecusados = recusados.filter((r) => r.id !== id);
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(newRecusados)
  );

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

// ==================== EDIÇÃO DE MEMBROS ====================
function editarMembroAdmin(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  const formHtml = `
    <input type="hidden" id="admin-membro-id" value="${membro.id}" />
    <div>
      <label class="block text-gray-400 text-sm mb-2">NOME *</label>
      <input type="text" id="admin-membro-nome" value="${membro.nome}" required
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">FOTO (URL)</label>
      <input type="text" id="admin-membro-foto" value="${membro.foto || ''}"
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
        placeholder="https://..." />
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">PATENTE *</label>
      <select id="admin-membro-patente" required
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
        <option value="Recruta" ${
          membro.patente === 'Recruta' ? 'selected' : ''
        }>Recruta</option>
        <option value="Soldado" ${
          membro.patente === 'Soldado' ? 'selected' : ''
        }>Soldado</option>
        <option value="Cabo" ${
          membro.patente === 'Cabo' ? 'selected' : ''
        }>Cabo</option>
        <option value="Terceiro-Sargento" ${
          membro.patente === 'Terceiro-Sargento' ? 'selected' : ''
        }>Terceiro-Sargento</option>
        <option value="Segundo-Sargento" ${
          membro.patente === 'Segundo-Sargento' ? 'selected' : ''
        }>Segundo-Sargento</option>
        <option value="Primeiro-Sargento" ${
          membro.patente === 'Primeiro-Sargento' ? 'selected' : ''
        }>Primeiro-Sargento</option>
        <option value="Sargento-Mor" ${
          membro.patente === 'Sargento-Mor' ? 'selected' : ''
        }>Sargento-Mor</option>
        <option value="Subtenente" ${
          membro.patente === 'Subtenente' ? 'selected' : ''
        }>Subtenente</option>
        <option value="Tenente" ${
          membro.patente === 'Tenente' ? 'selected' : ''
        }>Tenente</option>
        <option value="Capitão" ${
          membro.patente === 'Capitão' ? 'selected' : ''
        }>Capitão</option>
        <option value="Major" ${
          membro.patente === 'Major' ? 'selected' : ''
        }>Major</option>
        <option value="Tenente-Coronel" ${
          membro.patente === 'Tenente-Coronel' ? 'selected' : ''
        }>Tenente-Coronel</option>
        <option value="Coronel" ${
          membro.patente === 'Coronel' ? 'selected' : ''
        }>Coronel</option>
        <option value="Brigadeiro" ${
          membro.patente === 'Brigadeiro' ? 'selected' : ''
        }>Brigadeiro</option>
        <option value="General" ${
          membro.patente === 'General' ? 'selected' : ''
        }>General</option>
        <option value="Marechal" ${
          membro.patente === 'Marechal' ? 'selected' : ''
        }>Marechal</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">ATRIBUIÇÃO *</label>
      <select id="admin-membro-atribuicao" required
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
        <option value="Infantaria" ${
          membro.atribuicao === 'Infantaria' ? 'selected' : ''
        }>Infantaria</option>
        <option value="Força Aérea" ${
          membro.atribuicao === 'Força Aérea' ? 'selected' : ''
        }>Força Aérea</option>
        <option value="Marinha" ${
          membro.atribuicao === 'Marinha' ? 'selected' : ''
        }>Marinha</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">DATA DE REGISTRO</label>
      <input type="date" id="admin-membro-dataRegistro" value="${
        membro.dataRegistro
      }"
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">SITUAÇÃO</label>
      <select id="admin-membro-situacao"
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
        <option value="Ativo" ${
          membro.situacao === 'Ativo' ? 'selected' : ''
        }>Ativo</option>
        <option value="Reservista" ${
          membro.situacao === 'Reservista' ? 'selected' : ''
        }>Reservista</option>
        <option value="Desertor" ${
          membro.situacao === 'Desertor' ? 'selected' : ''
        }>Desertor</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">FORÇA ESPECIAL</label>
      <input type="text" id="admin-membro-forcaEspecial" value="${
        membro.forcaEspecial || ''
      }"
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
        placeholder="S.T.O.R.M. ou deixe 'Não'" />
    </div>
    <div>
      <label class="block text-gray-400 text-sm mb-2">OBSERVAÇÕES</label>
      <textarea id="admin-membro-observacoes" rows="4"
        class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none">${
          membro.observacoes || ''
        }</textarea>
    </div>
    <div class="border-t border-slate-700 pt-4">
      <h4 class="text-cyan-400 font-semibold mb-3">📜 HISTÓRICO DE MISSÕES ANTIGAS</h4>
      <p class="text-gray-500 text-xs mb-3">Use esta seção para registrar missões realizadas antes da criação deste sistema.</p>
      <div>
        <label class="block text-gray-400 text-sm mb-2">HISTÓRICO</label>
        <textarea id="admin-membro-historico" rows="6"
          class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
          placeholder="Descreva aqui as missões antigas e eventos relevantes...">${
            membro.historico || ''
          }</textarea>
      </div>
      <div class="mt-4">
        <label class="block text-gray-400 text-sm mb-2">VALOR HISTÓRICO (Quantidade de Missões)</label>
        <input type="number" id="admin-membro-valorHistorico" min="0" value="${
          membro.valorHistorico || 0
        }"
          class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400" />
        <p class="text-gray-500 text-xs mt-1">Este número será somado ao total de missões do membro.</p>
      </div>
    </div>
    <div class="flex gap-4 pt-4">
      <button type="submit"
        class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
        ✓ Salvar
      </button>
      <button type="button" onclick="window.fecharSidebarAdmin()"
        class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">
        ✕ Cancelar
      </button>
    </div>
  `;

  document.getElementById('form-membro-admin').innerHTML = formHtml;
  document
    .getElementById('form-membro-admin')
    .addEventListener('submit', salvarMembroAdmin);

  document
    .getElementById('edit-member-sidebar-admin')
    .classList.remove('-translate-x-full');
  document.getElementById('admin-overlay').classList.remove('hidden');
}

function salvarMembroAdmin(e) {
  e.preventDefault();

  const id = document.getElementById('admin-membro-id').value;
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const index = membrosData.findIndex((m) => m.id === id);

  if (index === -1) return;

  const foto = document.getElementById('admin-membro-foto').value.trim();

  membrosData[index].nome = document
    .getElementById('admin-membro-nome')
    .value.trim();
  if (foto) membrosData[index].foto = foto;
  membrosData[index].patente = document.getElementById(
    'admin-membro-patente'
  ).value;
  membrosData[index].atribuicao = document.getElementById(
    'admin-membro-atribuicao'
  ).value;
  membrosData[index].dataRegistro = document.getElementById(
    'admin-membro-dataRegistro'
  ).value;
  membrosData[index].situacao = document.getElementById(
    'admin-membro-situacao'
  ).value;
  membrosData[index].forcaEspecial =
    document.getElementById('admin-membro-forcaEspecial').value.trim() || 'Não';
  membrosData[index].observacoes = document
    .getElementById('admin-membro-observacoes')
    .value.trim();
  membrosData[index].historico = document
    .getElementById('admin-membro-historico')
    .value.trim();
  membrosData[index].valorHistorico =
    parseInt(document.getElementById('admin-membro-valorHistorico').value) || 0;

  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));

  fecharSidebarAdmin();
  aplicarFiltrosAdmin();
  alert('✅ Membro atualizado com sucesso!');
}

function excluirMembroAdmin(membroId) {
  if (
    !confirm(
      '⚠️ Tem certeza que deseja remover este membro?\n\nEle será movido para a lista de alistamentos recusados.'
    )
  )
    return;

  // Buscar membro
  let membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  // Buscar usuário correspondente
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );
  const usuario = usuarios.find((u) => u.nome === membro.nome);

  // Adicionar à lista de recusados
  const recusados = JSON.parse(
    localStorage.getItem('strykers_alistamentos_recusados') || '[]'
  );
  recusados.push({
    id: usuario?.id || membro.id,
    nome: membro.nome,
    email: usuario?.email || '',
    whatsapp: usuario?.whatsapp || '',
    dataSolicitacao: membro.dataRegistro,
    dataRecusa: new Date().toISOString(),
    usuarioCompleto: usuario,
  });
  localStorage.setItem(
    'strykers_alistamentos_recusados',
    JSON.stringify(recusados)
  );

  // Atualizar status do usuário
  if (usuario) {
    const userIndex = usuarios.findIndex((u) => u.id === usuario.id);
    if (userIndex !== -1) {
      usuarios[userIndex].status = 'recusado';
      usuarios[userIndex].dataRecusa = new Date().toISOString();
      localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
    }
  }

  // Remover da lista de membros
  membrosData = membrosData.filter((m) => m.id !== membroId);
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));

  aplicarFiltrosAdmin();
  renderizarRecusados();
  alert('âœ… Membro removido e movido para alistamentos recusados!');
}

function fecharSidebarAdmin() {
  document
    .getElementById('edit-member-sidebar-admin')
    .classList.add('-translate-x-full');

  const condecoraSidebar = document.getElementById('condecorar-sidebar-admin');
  if (condecoraSidebar) {
    condecoraSidebar.classList.add('translate-x-full');
  }

  const removerMedalhaSidebar = document.getElementById(
    'remover-medalha-sidebar-admin'
  );
  if (removerMedalhaSidebar) {
    removerMedalhaSidebar.classList.add('translate-x-full');
  }

  document.getElementById('admin-overlay').classList.add('hidden');
}

// ==================== SISTEMA DE CONDECORAÇÕES ====================

const MEDALHAS_DISPONIVEIS = {
  'merito-operacional': {
    imagem: '/imgMedalhas/medalha_merito_operacional.png',
    emoji: '🎖️',
    nome: 'Medalha de Mérito Operacional',
    descricao:
      'Concedida a membros que demonstraram excelência em incursões táticas e operações hostis com sucesso.',
  },
  'defesa-avancada': {
    imagem: '/imgMedalhas/medalha_defesa_avancada.png',
    emoji: '🛡️',
    nome: 'Medalha de Defesa Avançada',
    descricao:
      'Reconhecimento por atuações destacadas na proteção de VIPs, comboios e zonas estratégicas sob ameaça.',
  },
  'elite-aerea': {
    imagem: '/imgMedalhas/medalha_elite_aerea.png',
    emoji: '🥇',
    nome: 'Medalha de Elite Aérea',
    descricao:
      'Premiação para pilotos que demonstraram superioridade aérea, manobras avançadas e domínio total em combate espacial.',
  },
  'infantaria-pesada': {
    imagem: '/imgMedalhas/medalha_infantaria_pesada.png',
    emoji: '🥈',
    nome: 'Medalha de Infantaria Pesada',
    descricao:
      'Concedida a soldados de chão que atuaram com coragem, disciplina e precisão em combates terrestres e manobras com veículos.',
  },
  'aguia-dourada': {
    imagem: '/imgMedalhas/medalha_insignia_aguia_dourada.png',
    emoji: '🦅',
    nome: 'Insígnia da Águia Dourada',
    descricao:
      'Honraria rara, concedida apenas aos que lideraram operações completas com sucesso total, mostrando comando, estratégia e disciplina.',
  },
  'honra-logistica': {
    imagem: '/imgMedalhas/medalha_distintivo_honra_logistica.png',
    emoji: '🪙',
    nome: 'Distintivo de Honra Logística',
    descricao:
      'Entregue a operadores de logística e transporte que garantiram o sucesso de missões com eficiência e organização impecável.',
  },
};

function condecorarMembroAdmin(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  let sidebar = document.getElementById('condecorar-sidebar-admin');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'condecorar-sidebar-admin';
    sidebar.className =
      'fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-cyan-400">CONDECORAR ${
          membro.nome
        }</h3>
        <button onclick="window.fecharCondecoracao()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <form id="form-condecorar-admin" class="space-y-6">
        <input type="hidden" id="condecorar-membro-id-admin" value="${
          membro.id
        }" />

        <div>
          <label class="block text-gray-400 text-sm mb-2">MEDALHA *</label>
          <select id="condecorar-medalha-admin" required
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            onchange="window.atualizarDescricaoMedalhaAdmin()">
            <option value="">Selecione uma medalha</option>
            ${Object.entries(MEDALHAS_DISPONIVEIS)
              .map(
                ([key, medalha]) =>
                  `<option value="${key}">${medalha.emoji} ${medalha.nome}</option>`
              )
              .join('')}
          </select>
        </div>

        <div id="descricao-medalha-container-admin" class="hidden bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h4 class="text-sm text-gray-400 mb-2 uppercase tracking-wide">Descrição</h4>
          <p id="descricao-medalha-texto-admin" class="text-gray-300 text-sm leading-relaxed"></p>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">OBSERVAÇÕES</label>
          <textarea id="condecorar-observacoes-admin" rows="4"
            class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="Detalhes sobre a condecoração (opcional)..."></textarea>
        </div>

        <div class="flex gap-4">
          <button type="submit"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors">
            ⭐ Condecorar
          </button>
          <button type="button" onclick="window.limparFormCondecorarAdmin()"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors">
            🗑️ Limpar
          </button>
        </div>
      </form>

      ${
        membro.medalhasDetalhadas && membro.medalhasDetalhadas.length > 0
          ? `
        <div class="mt-6 pt-6 border-t border-slate-700">
          <button onclick="window.abrirRemoverMedalhaAdmin('${membro.id}')"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors">
            🗑️ Remover Condecoração
          </button>
        </div>
      `
          : ''
      }
    </div>
  `;

  sidebar.classList.remove('translate-x-full');
  document.getElementById('admin-overlay').classList.remove('hidden');

  document
    .getElementById('form-condecorar-admin')
    .addEventListener('submit', salvarCondecoracaoAdmin);
}

function atualizarDescricaoMedalhaAdmin() {
  const select = document.getElementById('condecorar-medalha-admin');
  const container = document.getElementById(
    'descricao-medalha-container-admin'
  );
  const texto = document.getElementById('descricao-medalha-texto-admin');

  if (select.value) {
    const medalha = MEDALHAS_DISPONIVEIS[select.value];
    texto.textContent = medalha.descricao;
    container.classList.remove('hidden');
  } else {
    container.classList.add('hidden');
  }
}

function limparFormCondecorarAdmin() {
  document.getElementById('condecorar-medalha-admin').value = '';
  document.getElementById('condecorar-observacoes-admin').value = '';
  document
    .getElementById('descricao-medalha-container-admin')
    .classList.add('hidden');
}

function salvarCondecoracaoAdmin(e) {
  e.preventDefault();

  const membroId = document.getElementById('condecorar-membro-id-admin').value;
  const tipoMedalha = document.getElementById('condecorar-medalha-admin').value;
  const observacoes = document.getElementById(
    'condecorar-observacoes-admin'
  ).value;

  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  if (!membro.medalhasDetalhadas) {
    membro.medalhasDetalhadas = [];
  }

  const novaMedalha = {
    id: Date.now(),
    tipo: tipoMedalha,
    data: new Date().toISOString().split('T')[0],
    observacoes: observacoes,
  };

  membro.medalhasDetalhadas.push(novaMedalha);
  membro.medalhas = membro.medalhasDetalhadas.length;

  const index = membrosData.findIndex((m) => m.id === membroId);
  if (index !== -1) {
    membrosData[index] = membro;
  }

  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  fecharCondecoracao();

  const medalhaInfo = MEDALHAS_DISPONIVEIS[tipoMedalha];
  alert(`✅ ${membro.nome} recebeu a ${medalhaInfo.nome}!`);
  aplicarFiltrosAdmin();
}

function fecharCondecoracao() {
  const sidebar = document.getElementById('condecorar-sidebar-admin');
  if (sidebar) {
    sidebar.classList.add('translate-x-full');
  }
  document.getElementById('admin-overlay').classList.add('hidden');
}

function abrirRemoverMedalhaAdmin(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);

  if (
    !membro ||
    !membro.medalhasDetalhadas ||
    membro.medalhasDetalhadas.length === 0
  )
    return;

  let sidebar = document.getElementById('remover-medalha-sidebar-admin');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'remover-medalha-sidebar-admin';
    sidebar.className =
      'fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-[60] overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-red-400">REMOVER CONDECORAÇÃO</h3>
        <button onclick="window.fecharRemoverMedalhaAdmin()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <p class="text-gray-400 mb-4">Selecione a medalha que deseja remover:</p>

      <div class="space-y-2">
        ${membro.medalhasDetalhadas
          .map((m) => {
            const medalhaInfo = MEDALHAS_DISPONIVEIS[m.tipo];
            const dataFormatada = new Date(
              m.data + 'T00:00:00'
            ).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return `
            <div 
              class="bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500 rounded-lg p-4 cursor-pointer transition-all"
              onclick="window.confirmarRemocaoMedalhaAdmin('${membro.id}', ${
              m.id
            })">
              <div class="flex items-center gap-3">
                <div class="text-4xl">${medalhaInfo.emoji}</div>
                <div class="flex-1">
                  <div class="text-white font-semibold">${
                    medalhaInfo.nome
                  }</div>
                  <div class="text-gray-400 text-sm">${dataFormatada}</div>
                  ${
                    m.observacoes
                      ? `<div class="text-gray-500 text-xs mt-1">${m.observacoes}</div>`
                      : ''
                  }
                </div>
                <div class="text-red-400 text-xl">×</div>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;

  sidebar.classList.remove('translate-x-full');
}

function fecharRemoverMedalhaAdmin() {
  const sidebar = document.getElementById('remover-medalha-sidebar-admin');
  if (sidebar) {
    sidebar.classList.add('translate-x-full');
  }
}

function confirmarRemocaoMedalhaAdmin(membroId, medalhaId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  const medalha = membro.medalhasDetalhadas.find((m) => m.id === medalhaId);
  if (!medalha) return;

  const medalhaInfo = MEDALHAS_DISPONIVEIS[medalha.tipo];

  if (!confirm(`⚠️ Confirma a remoção da ${medalhaInfo.nome}?`)) {
    return;
  }

  membro.medalhasDetalhadas = membro.medalhasDetalhadas.filter(
    (m) => m.id !== medalhaId
  );
  membro.medalhas = membro.medalhasDetalhadas.length;

  const index = membrosData.findIndex((m) => m.id === membroId);
  if (index !== -1) {
    membrosData[index] = membro;
  }

  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  fecharRemoverMedalhaAdmin();
  fecharCondecoracao();
  aplicarFiltrosAdmin();

  alert(`✅ ${medalhaInfo.nome} removida com sucesso!`);
}

// Expor funções globalmente
window.aprovarAlistamento = aprovarAlistamento;
window.recusarAlistamento = recusarAlistamento;
window.realistarUsuario = realistarUsuario;
window.excluirAlistamento = excluirAlistamento;
window.mostrarTexto = mostrarTexto;
window.fecharModalTextoAdmin = fecharModalTextoAdmin;
window.editarMembroAdmin = editarMembroAdmin;
window.excluirMembroAdmin = excluirMembroAdmin;
window.condecorarMembroAdmin = condecorarMembroAdmin;
window.fecharSidebarAdmin = fecharSidebarAdmin;
window.atualizarDescricaoMedalhaAdmin = atualizarDescricaoMedalhaAdmin;
window.limparFormCondecorarAdmin = limparFormCondecorarAdmin;
window.fecharCondecoracao = fecharCondecoracao;
window.abrirRemoverMedalhaAdmin = abrirRemoverMedalhaAdmin;
window.fecharRemoverMedalhaAdmin = fecharRemoverMedalhaAdmin;
window.confirmarRemocaoMedalhaAdmin = confirmarRemocaoMedalhaAdmin;
