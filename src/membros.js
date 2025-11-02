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

    // Tenta carregar do localStorage primeiro
    const localData = localStorage.getItem('strykers_membros');

    if (localData) {
      membrosData = JSON.parse(localData);
    } else {
      // Se não tem no localStorage, carrega do arquivo .txt (primeira vez)
      await loadFromFile();
    }

    filteredData = [...membrosData];

    document.getElementById(
      'total-membros'
    ).textContent = `Total: ${membrosData.length} membros`;

    // Popula filtros
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

async function loadFromFile() {
  try {
    const response = await fetch('/membros.txt');
    const text = await response.text();
    const lines = text.trim().split('\n');

    membrosData = lines.map((line) => {
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
        id: gerarId(nome?.trim() || ''),
        nome: nome?.trim() || '',
        foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          nome?.trim() || 'User'
        )}&background=0f172a&color=22d3ee&size=150`,
        patente: patente?.trim() || 'Recruta',
        atribuicao: 'Infantaria', // Padrão
        medalhas: parseInt(medalhas?.trim()) || 0,
        dataRegistro:
          dataRegistro?.trim() || new Date().toISOString().split('T')[0],
        situacao: situacao?.trim() || 'Ativo',
        missoes: parseInt(missoes?.trim()) || 0,
        forcaEspecial: forcaEspecial?.trim() || 'Não',
        observacoes: observacoes?.trim() || '',
      };
    });

    // Salva no localStorage
    salvarMembros();
  } catch (error) {
    console.error('Erro ao carregar arquivo:', error);
    membrosData = [];
  }
}

function salvarMembros() {
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  document.getElementById(
    'total-membros'
  ).textContent = `Total: ${membrosData.length} membros`;
}

function gerarId(nome) {
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

function showLoading() {
  const tbody = document.getElementById('membros-tbody');
  tbody.innerHTML =
    '<tr><td colspan="6" class="text-center py-8 text-gray-400">⏳ Carregando membros...</td></tr>';
}

function hideLoading() {
  // Removido ao renderizar
}

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
    .addEventListener('click', closeSidebars);
  document
    .getElementById('close-edit-sidebar')
    .addEventListener('click', closeSidebars);
  document
    .getElementById('sidebar-overlay')
    .addEventListener('click', closeSidebars);

  // Adicionar membro
  document
    .getElementById('add-membro-btn')
    .addEventListener('click', () => abrirFormulario(null));

  // Formulário
  document
    .getElementById('form-membro')
    .addEventListener('submit', salvarMembro);
  document
    .getElementById('btn-cancelar-edit')
    .addEventListener('click', closeSidebars);
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
        <button class="view-details text-cyan-400 hover:text-cyan-300 text-xl" data-index="${index}">
          📋
        </button>
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

        <div class="border-b border-slate-700 pb-3">
          <p class="text-gray-400 text-sm mb-2">OBSERVAÇÕES</p>
          <p class="text-gray-300 text-sm leading-relaxed">${
            membro.observacoes
          }</p>
        </div>

        <div class="flex gap-4 pt-4">
          <button
            onclick="window.editarMembro('${membro.id}')"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-6 py-3 transition-colors"
          >
            ✏️ Editar
          </button>
          <button
            onclick="window.excluirMembro('${membro.id}')"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors"
          >
            🗑 Excluir
          </button>
        </div>
      </div>
    </div>
  `;

  openSidebar('details');
}

function abrirFormulario(membroId) {
  const titulo = document.getElementById('edit-sidebar-title');

  if (membroId) {
    // Modo edição
    const membro = membrosData.find((m) => m.id === membroId);
    if (!membro) return;

    titulo.textContent = 'EDITAR MEMBRO';
    document.getElementById('membro-id').value = membro.id;
    document.getElementById('membro-nome').value = membro.nome;
    document.getElementById('membro-foto').value = membro.foto || '';
    document.getElementById('membro-patente').value = membro.patente;
    document.getElementById('membro-atribuicao').value =
      membro.atribuicao || 'Infantaria';
    document.getElementById('membro-medalhas').value = membro.medalhas;
    document.getElementById('membro-missoes').value = membro.missoes;
    document.getElementById('membro-dataRegistro').value = membro.dataRegistro;
    document.getElementById('membro-situacao').value = membro.situacao;
    document.getElementById('membro-forcaEspecial').value =
      membro.forcaEspecial;
    document.getElementById('membro-observacoes').value = membro.observacoes;
  } else {
    // Modo adicionar
    titulo.textContent = 'ADICIONAR MEMBRO';
    document.getElementById('form-membro').reset();
    document.getElementById('membro-id').value = '';
    document.getElementById('membro-dataRegistro').value = new Date()
      .toISOString()
      .split('T')[0];
  }

  openSidebar('edit');
}

function salvarMembro(e) {
  e.preventDefault();

  const id = document.getElementById('membro-id').value;
  const nome = document.getElementById('membro-nome').value;
  const foto =
    document.getElementById('membro-foto').value ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nome
    )}&background=0f172a&color=22d3ee&size=150`;

  const membroData = {
    id: id || gerarId(nome),
    nome: nome,
    foto: foto,
    patente: document.getElementById('membro-patente').value,
    atribuicao: document.getElementById('membro-atribuicao').value,
    medalhas: parseInt(document.getElementById('membro-medalhas').value) || 0,
    missoes: parseInt(document.getElementById('membro-missoes').value) || 0,
    dataRegistro: document.getElementById('membro-dataRegistro').value,
    situacao: document.getElementById('membro-situacao').value,
    forcaEspecial:
      document.getElementById('membro-forcaEspecial').value || 'Não',
    observacoes: document.getElementById('membro-observacoes').value,
  };

  if (id) {
    // Atualizar
    const index = membrosData.findIndex((m) => m.id === id);
    if (index !== -1) {
      membrosData[index] = membroData;
    }
  } else {
    // Adicionar
    membrosData.push(membroData);
  }

  salvarMembros();
  closeSidebars();
  applyFilters();

  alert(id ? '✅ Membro atualizado!' : '✅ Membro adicionado!');
}

function excluirMembro(membroId) {
  if (!confirm('⚠️ Tem certeza que deseja excluir este membro?')) {
    return;
  }

  membrosData = membrosData.filter((m) => m.id !== membroId);
  salvarMembros();
  closeSidebars();
  applyFilters();

  alert('✅ Membro excluído!');
}

function openSidebar(type) {
  const overlay = document.getElementById('sidebar-overlay');
  overlay.classList.remove('hidden');

  if (type === 'details') {
    document
      .getElementById('member-details-sidebar')
      .classList.remove('translate-x-full');
  } else if (type === 'edit') {
    document
      .getElementById('edit-member-sidebar')
      .classList.remove('-translate-x-full');
  }
}

function closeSidebars() {
  document
    .getElementById('member-details-sidebar')
    .classList.add('translate-x-full');
  document
    .getElementById('edit-member-sidebar')
    .classList.add('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

// Expõe funções globalmente
window.editarMembro = abrirFormulario;
window.excluirMembro = excluirMembro;
