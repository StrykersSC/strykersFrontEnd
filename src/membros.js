let membrosData = [];
let filteredData = [];

export async function initMembros() {
  await loadMembros();
  setupEventListeners();
  renderTable(membrosData);
}

async function loadMembros() {
  try {
    const response = await fetch('/membros.txt');
    const text = await response.text();
    membrosData = parseMembrosData(text);
    filteredData = [...membrosData];

    // Atualiza total
    document.getElementById(
      'total-membros'
    ).textContent = `Total: ${membrosData.length} membros`;

    // Popula filtro de patentes
    const patentes = [...new Set(membrosData.map((m) => m.patente))].sort();
    const selectPatente = document.getElementById('filter-patente');
    patentes.forEach((patente) => {
      const option = document.createElement('option');
      option.value = patente;
      option.textContent = patente;
      selectPatente.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar membros:', error);
    membrosData = [];
  }
}

function parseMembrosData(text) {
  const lines = text.trim().split('\n');
  return lines.map((line) => {
    const [
      nome,
      patente,
      medalhas,
      dataRegistro,
      situacao,
      missoes,
      forcaEspecial,
      observacoes,
    ] = line.split('|');
    return {
      nome: nome?.trim() || '',
      patente: patente?.trim() || '',
      medalhas: parseInt(medalhas?.trim()) || 0,
      dataRegistro: dataRegistro?.trim() || '',
      situacao: situacao?.trim() || '',
      missoes: parseInt(missoes?.trim()) || 0,
      forcaEspecial: forcaEspecial?.trim() || 'Não',
      observacoes: observacoes?.trim() || 'Sem observações',
    };
  });
}

function setupEventListeners() {
  // Pesquisa
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters();

    // Se encontrar apenas um resultado, abre automaticamente
    if (filteredData.length === 1) {
      showMemberDetails(filteredData[0]);
    }
  });

  // Filtros
  document
    .getElementById('filter-patente')
    .addEventListener('change', applyFilters);
  document
    .getElementById('filter-situacao')
    .addEventListener('change', applyFilters);

  // Limpar filtros
  document
    .getElementById('clear-filters')
    .addEventListener('click', clearFilters);

  // Ordenação
  document.querySelectorAll('[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      sortTable(field);
    });
  });

  // Sidebar
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
    return a[field] > b[field] ? 1 : -1;
  });
  renderTable(filteredData);
}

function renderTable(data) {
  const tbody = document.getElementById('membros-tbody');
  tbody.innerHTML = '';

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
      <td class="px-6 py-4 ${situacaoColor[membro.situacao]}">${
      membro.situacao
    }</td>
      <td class="px-6 py-4 text-center">
        <button class="view-details text-cyan-400 hover:text-cyan-300 text-xl" data-index="${index}">
          📋
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Adiciona listeners nos botões de detalhes
  document.querySelectorAll('.view-details').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      showMemberDetails(filteredData[index]);
    });
  });
}

function showMemberDetails(membro) {
  const content = document.getElementById('member-details-content');
  content.innerHTML = `
    <div class="space-y-6">
      <div class="bg-slate-800 rounded-lg p-4 flex justify-center">
        <div class="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center text-4xl text-cyan-400">
          ${membro.nome.charAt(0)}
        </div>
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

        <div class="grid grid-cols-2 gap-4 border-b border-slate-700 pb-3">
          <div>
            <p class="text-gray-400 text-sm">MEDALHAS</p>
            <p class="text-white text-lg font-semibold">${membro.medalhas}</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">MISSÕES</p>
            <p class="text-white text-lg font-semibold">${membro.missoes}</p>
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

        <div>
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
  const sidebar = document.getElementById('member-details-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  sidebar.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
}

function closeSidebar() {
  const sidebar = document.getElementById('member-details-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  sidebar.classList.add('translate-x-full');
  overlay.classList.add('hidden');
}
