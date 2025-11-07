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

// ==================== VISUALIZAÇÃO DE MEDALHAS E MISSÕES ====================

function mostrarMedalhasMembro(membroId) {
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  const medalhas = membro.medalhasDetalhadas || [];

  let html = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-cyan-400">MEDALHAS DE ${
          membro.nome
        }</h3>
        <button onclick="window.fecharMedalhasSidebar()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="mb-4">
        <p class="text-gray-400">Total de medalhas: <span class="text-cyan-400 font-bold text-xl">${
          medalhas.length
        }</span></p>
      </div>

      ${
        medalhas.length > 0
          ? `
        <div class="mb-6">
          <h4 class="text-sm text-gray-400 mb-3 uppercase tracking-wide">Condecorações</h4>
          <div class="grid grid-cols-2 gap-4">
            ${medalhas
              .map((m) => {
                const medalhaInfo = getMedalhaInfo(m.tipo);
                return `
                <div 
                  class="bg-slate-800 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-700 transition-colors"
                  onclick="window.mostrarDetalhesMedalha('${membro.id}', ${
                  m.id
                })"
                >
                  <img src="${medalhaInfo.imagem}" alt="${
                  medalhaInfo.nome
                }" class="w-16 h-16 mx-auto mb-2 object-contain" />
                  <div class="text-white text-sm font-semibold">${medalhaInfo.nome
                    .split(' ')
                    .slice(0, 3)
                    .join(' ')}</div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      `
          : '<p class="text-gray-500 text-center py-8">Nenhuma medalha ainda</p>'
      }
    </div>
  `;

  let sidebar = document.getElementById('medalhas-membro-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'medalhas-membro-sidebar';
    sidebar.className =
      'fixed top-0 left-0 h-full w-96 bg-slate-900 border-r border-slate-700 transform -translate-x-full transition-transform duration-300 z-50 overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = html;
  sidebar.classList.remove('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}

function fecharMedalhasSidebar() {
  const sidebar = document.getElementById('medalhas-membro-sidebar');
  if (sidebar) {
    sidebar.classList.add('-translate-x-full');
  }
  const detailsSidebar = document.getElementById('member-details-sidebar');
  if (detailsSidebar.classList.contains('translate-x-full')) {
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }
}

function getMedalhaInfo(tipo) {
  const MEDALHAS = {
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

  return (
    MEDALHAS[tipo] || {
      imagem: '',
      nome: 'Medalha Desconhecida',
      descricao: '',
    }
  );
}

function mostrarDetalhesMedalha(membroId, medalhaId) {
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro || !membro.medalhasDetalhadas) return;

  const medalhaDetalhada = membro.medalhasDetalhadas.find(
    (m) => m.id === medalhaId
  );
  if (!medalhaDetalhada) return;

  const medalha = getMedalhaInfo(medalhaDetalhada.tipo);
  if (!medalha) return;

  let observacoesHtml = '';
  if (
    medalhaDetalhada.observacoes &&
    medalhaDetalhada.observacoes.trim() !== ''
  ) {
    observacoesHtml = `
      <hr class="my-4 border-slate-700" />
      <div class="text-left">
        <h4 class="text-xs text-gray-500 mb-1 font-semibold">Observação da condecoração</h4>
        <p class="text-gray-400 text-sm whitespace-pre-line">${medalhaDetalhada.observacoes}</p>
      </div>
    `;
  }

  let modal = document.getElementById('modal-medalha');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-medalha';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/70" onclick="window.fecharModalMedalha()"></div>
      <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md mx-4 transform transition-all">
        <button onclick="window.fecharModalMedalha()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
        <div id="modal-medalha-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modal-medalha-content').innerHTML = `
    <div class="text-center">
      <img src="${medalha.imagem}" alt="${medalha.nome}" class="w-28 h-28 mx-auto mb-4 object-contain" />
      <h3 class="text-2xl font-bold text-cyan-400 mb-4">${medalha.nome}</h3>
      <p class="text-gray-300 leading-relaxed">${medalha.descricao}</p>
      ${observacoesHtml}
    </div>
  `;

  modal.classList.remove('hidden');
}

function fecharModalMedalha() {
  const modal = document.getElementById('modal-medalha');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function mostrarMissoesMembro(membroId) {
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;

  const eventosParticipados = membro.eventosParticipados || [];
  const stats = {
    treinamento: 0,
    missao: 0,
    operacao: 0,
    'mega-operacao': 0,
    campanha: 0,
    outro: 0,
  };

  eventosParticipados.forEach((ep) => {
    if (stats.hasOwnProperty(ep.categoria)) {
      stats[ep.categoria]++;
    }
  });

  const totalMissoes =
    eventosParticipados.length + (membro.valorHistorico || 0);

  let html = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-cyan-400">MISSÕES DE ${membro.nome}</h3>
        <button onclick="window.fecharMissoesSidebar()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <div class="text-green-400 font-bold text-lg">TR: ${stats.treinamento}</div>
            <div class="text-gray-500 text-xs">Treinamento</div>
          </div>
          <div class="text-center">
            <div class="text-yellow-400 font-bold text-lg">MI: ${stats.missao}</div>
            <div class="text-gray-500 text-xs">Missão</div>
          </div>
          <div class="text-center">
            <div class="text-orange-400 font-bold text-lg">OP: ${stats.operacao}</div>
            <div class="text-gray-500 text-xs">Operação</div>
          </div>
          <div class="text-center">
            <div class="text-red-400 font-bold text-lg">MO: ${stats['mega-operacao']}</div>
            <div class="text-gray-500 text-xs">Mega Op.</div>
          </div>
          <div class="text-center">
            <div class="text-purple-400 font-bold text-lg">CA: ${stats.campanha}</div>
            <div class="text-gray-500 text-xs">Campanha</div>
          </div>
          <div class="text-center">
            <div class="text-blue-400 font-bold text-lg">OU: ${stats.outro}</div>
            <div class="text-gray-500 text-xs">Outro</div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-gray-400">Total de missões: <span class="text-cyan-400 font-bold text-xl">${totalMissoes}</span></p>
      </div>

      <div class="space-y-3">
  `;

  if (membro.historico && membro.historico.trim() !== '') {
    html += `
      <div 
        class="bg-slate-800 border-l-4 border-gray-500 text-gray-400 rounded p-4 cursor-pointer hover:bg-slate-700 transition-colors"
        onclick="window.mostrarHistoricoMembro('${membro.id}')"
      >
        <div class="font-semibold text-white mb-1">📜 Histórico</div>
        <div class="text-sm text-gray-400">Registros anteriores</div>
      </div>
    `;
  }

  if (
    eventosParticipados.length === 0 &&
    (!membro.historico || membro.historico.trim() === '')
  ) {
    html +=
      '<p class="text-gray-500 text-center py-8">Nenhuma missão registrada</p>';
  } else if (eventosParticipados.length > 0) {
    eventosParticipados.forEach((ep) => {
      const dataFormatada = new Date(ep.data + 'T00:00:00').toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

      const cores = {
        treinamento: 'border-green-500 text-green-400',
        missao: 'border-yellow-500 text-yellow-400',
        operacao: 'border-orange-500 text-orange-400',
        'mega-operacao': 'border-red-500 text-red-400',
        campanha: 'border-purple-500 text-purple-400',
        outro: 'border-blue-500 text-blue-400',
      };

      const cor = cores[ep.categoria] || 'border-gray-500 text-gray-400';

      html += `
        <div 
          class="bg-slate-800 border-l-4 ${cor} rounded p-4 cursor-pointer hover:bg-slate-700 transition-colors"
          onclick="window.mostrarDetalhesMissaoDoEvento(${ep.eventoId})"
        >
          <div class="font-semibold text-white mb-1">${ep.nome}</div>
          <div class="text-sm text-gray-400">${dataFormatada}</div>
        </div>
      `;
    });
  }

  html += '</div></div>';

  let sidebar = document.getElementById('missoes-membro-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'missoes-membro-sidebar';
    sidebar.className =
      'fixed top-0 left-0 h-full w-96 bg-slate-900 border-r border-slate-700 transform -translate-x-full transition-transform duration-300 z-50 overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = html;
  sidebar.classList.remove('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}

function fecharMissoesSidebar() {
  const sidebar = document.getElementById('missoes-membro-sidebar');
  if (sidebar) {
    sidebar.classList.add('-translate-x-full');
  }
  const detailsSidebar = document.getElementById('member-details-sidebar');
  if (detailsSidebar.classList.contains('translate-x-full')) {
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }
}

function mostrarHistoricoMembro(membroId) {
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro || !membro.historico) return;

  const html = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-gray-400">📜 HISTÓRICO</h3>
        <button onclick="window.fecharHistoricoMembro()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-800 rounded-lg p-4 border border-gray-500">
          <h4 class="text-sm text-gray-400 mb-3">REGISTROS ANTERIORES</h4>
          <div class="text-gray-300 leading-relaxed whitespace-pre-wrap">${
            membro.historico
          }</div>
        </div>

        ${
          membro.valorHistorico > 0
            ? `
          <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p class="text-gray-400 text-sm">Missões históricas registradas:</p>
            <p class="text-cyan-400 font-bold text-2xl">${membro.valorHistorico}</p>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;

  let sidebar = document.getElementById('historico-membro-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'historico-membro-sidebar';
    sidebar.className =
      'fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = html;
  sidebar.classList.remove('translate-x-full');
}

function fecharHistoricoMembro() {
  const sidebar = document.getElementById('historico-membro-sidebar');
  if (sidebar) {
    sidebar.classList.add('translate-x-full');
  }
}

function mostrarDetalhesMissaoDoEvento(eventoId) {
  const eventos = JSON.parse(localStorage.getItem('strykers_eventos') || '[]');
  const evento = eventos.find((e) => e.id === eventoId);

  if (!evento) {
    alert('Evento não encontrado');
    return;
  }

  const cores = {
    treinamento: {
      bg: 'bg-green-500',
      text: 'text-green-400',
      border: 'border-green-500',
      nome: 'Treinamento',
    },
    missao: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-400',
      border: 'border-yellow-500',
      nome: 'Missão',
    },
    operacao: {
      bg: 'bg-orange-500',
      text: 'text-orange-400',
      border: 'border-orange-500',
      nome: 'Operação',
    },
    'mega-operacao': {
      bg: 'bg-red-500',
      text: 'text-red-400',
      border: 'border-red-500',
      nome: 'Mega Operação',
    },
    campanha: {
      bg: 'bg-purple-500',
      text: 'text-purple-400',
      border: 'border-purple-500',
      nome: 'Campanha',
    },
    outro: {
      bg: 'bg-blue-500',
      text: 'text-blue-400',
      border: 'border-blue-500',
      nome: 'Outro',
    },
  };

  const cor = cores[evento.categoria];
  const dataEvento = new Date(evento.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const html = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-cyan-400">DETALHES DA MISSÃO</h3>
        <button onclick="window.fecharDetalhesMissao()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="space-y-6">
        <div>
          <span class="inline-block px-3 py-1 ${
            cor.bg
          } text-slate-900 text-sm font-semibold rounded mb-3">${
    cor.nome
  }</span>
          ${
            evento.finalizado
              ? '<span class="ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded">✓ FINALIZADO</span>'
              : ''
          }
          <h3 class="text-2xl font-bold text-white">${evento.nome}</h3>
        </div>

        <div class="border-t border-slate-700 pt-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-cyan-400">📅</span>
            <span class="text-gray-300 capitalize">${dataFormatada}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-cyan-400">🕐</span>
            <span class="text-gray-300">${evento.horario}</span>
          </div>
        </div>

        <div class="border-t border-slate-700 pt-4">
          <h4 class="text-sm text-gray-400 mb-2">DESCRIÇÃO</h4>
          <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${
            evento.descricao
          }</p>
        </div>

        <div class="border-t border-slate-700 pt-4">
          <h4 class="text-sm text-gray-400 mb-3">PARTICIPANTES (${
            evento.participantes?.length || 0
          })</h4>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            ${
              evento.participantes && evento.participantes.length > 0
                ? evento.participantes
                    .map(
                      (p) => `
                  <div class="bg-slate-800 rounded px-3 py-2 text-gray-300 text-sm flex items-center gap-2">
                    <img src="${p.foto}" alt="${p.nome}" class="w-8 h-8 rounded-full" />
                    <span>${p.nome}</span>
                  </div>
                `
                    )
                    .join('')
                : '<p class="text-gray-500 text-sm">Nenhum participante registrado</p>'
            }
          </div>
        </div>
      </div>
    </div>
  `;

  let sidebar = document.getElementById('detalhes-missao-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'detalhes-missao-sidebar';
    sidebar.className =
      'fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto';
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = html;
  sidebar.classList.remove('translate-x-full');
}

function fecharDetalhesMissao() {
  const sidebar = document.getElementById('detalhes-missao-sidebar');
  if (sidebar) {
    sidebar.classList.add('translate-x-full');
  }
}

// Expor funções globalmente
window.mostrarMissoesMembro = mostrarMissoesMembro;
window.fecharMissoesSidebar = fecharMissoesSidebar;
window.mostrarDetalhesMissaoDoEvento = mostrarDetalhesMissaoDoEvento;
window.fecharDetalhesMissao = fecharDetalhesMissao;
window.mostrarMedalhasMembro = mostrarMedalhasMembro;
window.fecharMedalhasSidebar = fecharMedalhasSidebar;
window.mostrarDetalhesMedalha = mostrarDetalhesMedalha;
window.fecharModalMedalha = fecharModalMedalha;
window.mostrarHistoricoMembro = mostrarHistoricoMembro;
window.fecharHistoricoMembro = fecharHistoricoMembro;
