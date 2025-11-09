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
} from './components/membros-utils.js';

let membrosData = [];
let filteredData = [];

export async function initMembros() {
  await loadMembros();
  setupEventListeners();
  renderTable(membrosData);
}

async function loadMembros() {
  try {
    showLoading();
    const localData = localStorage.getItem('strykers_membros');
    if (localData) {
      membrosData = JSON.parse(localData);
    }
    filteredData = [...membrosData];
    document.getElementById(
      'total-membros'
    ).textContent = `Total: ${membrosData.length} membros`;

    const patentes = [...new Set(membrosData.map((m) => m.patente))].sort();
    const selectPatente = document.getElementById('filter-patente');
    selectPatente.innerHTML = '<option value="">Todas as Patentes</option>';
    patentes.forEach((patente) => {
      const option = document.createElement('option');
      option.value = patente;
      option.textContent = patente;
      selectPatente.appendChild(option);
    });
    hideLoading();
  } catch (error) {
    console.error('Erro ao carregar membros:', error);
    showError('Erro ao carregar membros.');
    hideLoading();
  }
}

function showLoading() {
  const tbody = document.getElementById('membros-tbody');
  tbody.innerHTML =
    '<tr><td colspan="6" class="text-center py-8 text-gray-400">⏳ Carregando membros...</td></tr>';
}

function hideLoading() {}

function showError(message) {
  const tbody = document.getElementById('membros-tbody');
  tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-red-400">${message}</td></tr>`;
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    applyFilters();
    if (filteredData.length === 1) {
      showMemberDetails(filteredData[0]);
    }
  });

  document
    .getElementById('filter-patente')
    .addEventListener('change', applyFilters);
  document
    .getElementById('filter-situacao')
    .addEventListener('change', applyFilters);
  document
    .getElementById('clear-filters')
    .addEventListener('click', clearFilters);

  document.querySelectorAll('[data-sort]').forEach((th) => {
    th.addEventListener('click', () => sortTable(th.dataset.sort));
  });

  document
    .getElementById('close-sidebar')
    .addEventListener('click', closeSidebar);
  document
    .getElementById('sidebar-overlay')
    .addEventListener('click', closeSidebar);
}

function applyFilters() {
  const searchTerm = document
    .getElementById('search-input')
    .value.toLowerCase();
  const patenteFilter = document.getElementById('filter-patente').value;
  const situacaoFilter = document.getElementById('filter-situacao').value;

  filteredData = membrosData.filter((membro) => {
    const matchSearch = membro.nome.toLowerCase().includes(searchTerm);
    const matchPatente = !patenteFilter || membro.patente === patenteFilter;
    const matchSituacao = !situacaoFilter || membro.situacao === situacaoFilter;
    return matchSearch && matchPatente && matchSituacao;
  });

  renderTable(filteredData);
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-patente').value = '';
  document.getElementById('filter-situacao').value = '';
  applyFilters();
}

function sortTable(field) {
  filteredData.sort((a, b) => {
    if (field === 'dataRegistro') {
      return new Date(a[field]) - new Date(b[field]);
    }
    if (typeof a[field] === 'number') {
      return a[field] - b[field];
    }
    return a[field] > b[field] ? 1 : -1;
  });
  renderTable(filteredData);
}

function renderTable(data) {
  const tbody = document.getElementById('membros-tbody');
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center py-8 text-gray-400">Nenhum membro encontrado</td></tr>';
    return;
  }

  data.forEach((membro, index) => {
    const tr = document.createElement('tr');
    tr.className =
      'border-b border-slate-700 hover:bg-slate-700/30 transition-colors';

    const situacaoColor = {
      Ativo: 'text-green-400',
      Reservista: 'text-yellow-400',
      Desertor: 'text-red-400',
    };

    tr.innerHTML = `
      <td class="px-6 py-4 font-semibold">${membro.patente}</td>
      <td class="px-6 py-4">${membro.nome}</td>
      <td class="px-6 py-4 text-center">${membro.medalhas}</td>
      <td class="px-6 py-4">${membro.dataRegistro}</td>
      <td class="px-6 py-4 ${
        situacaoColor[membro.situacao] || 'text-gray-400'
      }">${membro.situacao}</td>
      <td class="px-6 py-4 text-center">
        <button class="view-details text-cyan-400 hover:text-cyan-300 text-xl" data-index="${index}">📋</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll('.view-details').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      showMemberDetails(filteredData[index]);
    });
  });
}

function showMemberDetails(membro) {
  const totalMissoes =
    (membro.eventosParticipados?.length || 0) + (membro.valorHistorico || 0);

  const content = document.getElementById('member-details-content');
  content.innerHTML = `
    <div class="space-y-6">
      <div class="bg-slate-800 rounded-lg p-4 flex justify-center">
        <img 
          src="${membro.foto}" 
          alt="${membro.nome}"
          class="w-32 h-32 rounded-full object-cover border-4 border-cyan-400"
          onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
            membro.nome
          )}&background=0f172a&color=22d3ee&size=150'"
        />
      </div>

      <div class="space-y-4">
        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">NOME</p>
          <p class="text-white text-xl font-semibold">${membro.nome}</p>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">PATENTE</p>
          <p class="text-cyan-400 text-lg font-semibold">${membro.patente}</p>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">ATRIBUIÇÃO</p>
          <p class="text-white text-lg font-semibold">${
            membro.atribuicao || 'Não definida'
          }</p>
        </div>

        <div class="grid grid-cols-2 gap-4 border-b border-slate-700 pb-3">
          <div class="cursor-pointer hover:bg-slate-800/50 rounded p-2 transition-colors" onclick="window.mostrarMedalhasMembro('${
            membro.id
          }')">
            <p class="text-gray-400 text-sm">MEDALHAS</p>
            <p class="text-cyan-400 text-lg font-semibold hover:text-cyan-300">${
              membro.medalhas || 0
            } 👁️</p>
          </div>
          <div class="cursor-pointer hover:bg-slate-800/50 rounded p-2 transition-colors" onclick="window.mostrarMissoesMembro('${
            membro.id
          }')">
            <p class="text-gray-400 text-sm">MISSÕES</p>
            <p class="text-cyan-400 text-lg font-semibold hover:text-cyan-300">${totalMissoes} 👁️</p>
          </div>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">DATA DE REGISTRO</p>
          <p class="text-white">${membro.dataRegistro}</p>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">SITUAÇÃO</p>
          <p class="text-white">${membro.situacao}</p>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm">FORÇA ESPECIAL</p>
          <p class="text-white">${membro.forcaEspecial}</p>
        </div>

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm mb-2">OBSERVAÇÕES</p>
          <p class="text-gray-300 text-sm leading-relaxed">${
            membro.observacoes
          }</p>
        </div>
      </div>
    </div>
  `;

  openSidebar();
}

function openSidebar() {
  const overlay = document.getElementById('sidebar-overlay');
  overlay.classList.remove('hidden');
  document
    .getElementById('member-details-sidebar')
    .classList.remove('translate-x-full');
}

function closeSidebar() {
  document
    .getElementById('member-details-sidebar')
    .classList.add('translate-x-full');

  const missoesSidebar = document.getElementById('missoes-membro-sidebar');
  if (missoesSidebar) {
    missoesSidebar.classList.add('-translate-x-full');
  }

  const medalhasSidebar = document.getElementById('medalhas-membro-sidebar');
  if (medalhasSidebar) {
    medalhasSidebar.classList.add('-translate-x-full');
  }

  const detalhesMissaoSidebar = document.getElementById(
    'detalhes-missao-sidebar'
  );
  if (detalhesMissaoSidebar) {
    detalhesMissaoSidebar.classList.add('translate-x-full');
  }

  const historicoSidebar = document.getElementById('historico-membro-sidebar');
  if (historicoSidebar) {
    historicoSidebar.classList.add('translate-x-full');
  }

  document.getElementById('sidebar-overlay').classList.add('hidden');
}
