// Cores das categorias
const CATEGORIAS_CORES = {
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

let eventos = [];
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let eventoEditando = null;

export function initEventos() {
  carregarEventos();
  renderizarProximoEvento();
  renderizarCalendario();
  setupEventListeners();
}

function carregarEventos() {
  const eventosStorage = localStorage.getItem('strykers_eventos');
  if (eventosStorage) {
    eventos = JSON.parse(eventosStorage);
  }
}

function salvarEventos() {
  localStorage.setItem('strykers_eventos', JSON.stringify(eventos));
}

function setupEventListeners() {
  // Botão novo evento
  document
    .getElementById('btn-novo-evento')
    .addEventListener('click', abrirFormularioEvento);

  // Navegação do calendário
  document.getElementById('btn-mes-anterior').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
    }
    renderizarCalendario();
  });

  document.getElementById('btn-mes-proximo').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
    renderizarCalendario();
  });

  // Formulário
  document
    .getElementById('form-evento')
    .addEventListener('submit', salvarEvento);
  document
    .getElementById('btn-limpar-form')
    .addEventListener('click', limparFormulario);

  // Fechar sidebars
  document
    .getElementById('close-evento-sidebar')
    .addEventListener('click', fecharSidebars);
  document
    .getElementById('close-detalhes-sidebar')
    .addEventListener('click', fecharSidebars);
  document
    .getElementById('eventos-overlay')
    .addEventListener('click', fecharSidebars);
}

function abrirFormularioEvento() {
  eventoEditando = null;
  limparFormulario();
  document.getElementById('sidebar-titulo').textContent = 'CADASTRAR EVENTO';

  const sidebar = document.getElementById('evento-sidebar');
  const overlay = document.getElementById('eventos-overlay');

  sidebar.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
}

function limparFormulario() {
  document.getElementById('evento-nome').value = '';
  document.getElementById('evento-categoria').value = '';
  document.getElementById('evento-data').value = '';
  document.getElementById('evento-horario').value = '';
  document.getElementById('evento-descricao').value = '';
}

function salvarEvento(e) {
  e.preventDefault();

  const evento = {
    id: Date.now(),
    nome: document.getElementById('evento-nome').value,
    categoria: document.getElementById('evento-categoria').value,
    data: document.getElementById('evento-data').value,
    horario: document.getElementById('evento-horario').value,
    descricao: document.getElementById('evento-descricao').value,
  };

  eventos.push(evento);
  salvarEventos();

  fecharSidebars();
  renderizarCalendario();
  renderizarProximoEvento();

  alert('✅ Evento cadastrado com sucesso!');
}

function fecharSidebars() {
  document.getElementById('evento-sidebar').classList.add('translate-x-full');
  document
    .getElementById('detalhes-evento-sidebar')
    .classList.add('translate-x-full');
  document.getElementById('eventos-overlay').classList.add('hidden');
}

function renderizarProximoEvento() {
  const container = document.getElementById('proximo-evento-card');
  const agora = new Date();

  // Filtra eventos futuros considerando data E horário
  const eventosFuturos = eventos
    .filter((e) => {
      const dataHoraEvento = new Date(`${e.data}T${e.horario}`);
      return dataHoraEvento > agora;
    })
    .sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario}`);
      const dataB = new Date(`${b.data}T${b.horario}`);
      return dataA - dataB;
    });

  if (eventosFuturos.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
        <p class="text-gray-400">Nenhum evento agendado</p>
      </div>
    `;
    return;
  }

  const proximo = eventosFuturos[0];
  const cores = CATEGORIAS_CORES[proximo.categoria];
  const dataEvento = new Date(proximo.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Calcula tempo restante
  const dataHoraEvento = new Date(`${proximo.data}T${proximo.horario}`);
  const diff = dataHoraEvento - agora;
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let tempoRestante = '';
  if (horas > 24) {
    const dias = Math.floor(horas / 24);
    tempoRestante = `Em ${dias} dia${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    tempoRestante = `Em ${horas}h ${minutos}min`;
  } else {
    tempoRestante = `Em ${minutos} minutos`;
  }

  container.innerHTML = `
    <div class="bg-slate-800/60 backdrop-blur-sm border-l-4 ${cores.border} border-t border-r border-b border-slate-700 rounded-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-2">
            ${cores.nome}
          </span>
          <h3 class="text-2xl font-bold text-white">${proximo.nome}</h3>
        </div>
        <span class="bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ${tempoRestante}
        </span>
      </div>
      <div class="flex items-center gap-6 text-gray-300 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-cyan-400">📅</span>
          <span>${dataFormatada}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-cyan-400">🕐</span>
          <span>${proximo.horario}</span>
        </div>
      </div>
      <p class="text-gray-400 line-clamp-2">${proximo.descricao}</p>
    </div>
  `;
}

function renderizarCalendario() {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  document.getElementById(
    'calendario-titulo'
  ).textContent = `${meses[mesAtual]} ${anoAtual}`;

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const container = document.getElementById('calendario-dias');
  container.innerHTML = '';

  // Dias vazios antes do primeiro dia
  for (let i = 0; i < primeiroDia; i++) {
    const diaVazio = document.createElement('div');
    diaVazio.className = 'min-h-[120px] bg-slate-700/30 rounded-lg';
    container.appendChild(diaVazio);
  }

  // Dias do mês
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const dataCompleta = `${anoAtual}-${String(mesAtual + 1).padStart(
      2,
      '0'
    )}-${String(dia).padStart(2, '0')}`;
    const eventosNoDia = eventos.filter((e) => e.data === dataCompleta);
    const hoje = new Date();
    const diaAtual =
      hoje.getDate() === dia &&
      hoje.getMonth() === mesAtual &&
      hoje.getFullYear() === anoAtual;

    const diaElement = document.createElement('div');
    diaElement.className = `min-h-[120px] bg-slate-800/60 border ${
      diaAtual ? 'border-cyan-400' : 'border-slate-700'
    } rounded-lg p-2 hover:bg-slate-700/60 transition-colors cursor-pointer`;

    let html = `<div class="font-bold ${
      diaAtual ? 'text-cyan-400' : 'text-white'
    } mb-2">${dia}</div>`;

    // Renderiza eventos do dia
    if (eventosNoDia.length > 0) {
      html += '<div class="space-y-1">';
      eventosNoDia.forEach((evento) => {
        const cores = CATEGORIAS_CORES[evento.categoria];
        html += `
          <div class="text-xs ${cores.text} bg-slate-900/50 px-2 py-1 rounded border-l-2 ${cores.border} cursor-pointer hover:bg-slate-900 transition-colors" onclick="window.mostrarDetalhesEvento(${evento.id})">
            <div class="font-semibold truncate">${evento.horario}</div>
            <div class="truncate">${evento.nome}</div>
          </div>
        `;
      });
      html += '</div>';
    }

    diaElement.innerHTML = html;
    container.appendChild(diaElement);
  }
}

function mostrarDetalhesEvento(eventoId) {
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;

  const cores = CATEGORIAS_CORES[evento.categoria];
  const dataEvento = new Date(evento.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const content = document.getElementById('detalhes-evento-content');
  content.innerHTML = `
    <div class="space-y-6">
      <div>
        <span class="inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-3">
          ${cores.nome}
        </span>
        <h3 class="text-3xl font-bold text-white">${evento.nome}</h3>
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
        <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${evento.descricao}</p>
      </div>

      <button
        onclick="window.excluirEvento(${evento.id})"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors"
      >
        🗑 Excluir Evento
      </button>
    </div>
  `;

  document
    .getElementById('detalhes-evento-sidebar')
    .classList.remove('translate-x-full');
  document.getElementById('eventos-overlay').classList.remove('hidden');
}

function excluirEvento(eventoId) {
  if (!confirm('⚠️ Tem certeza que deseja excluir este evento?')) {
    return;
  }

  eventos = eventos.filter((e) => e.id !== eventoId);
  salvarEventos();

  fecharSidebars();
  renderizarCalendario();
  renderizarProximoEvento();

  alert('✅ Evento excluído com sucesso!');
}

// Expõe funções globalmente para uso no HTML
window.mostrarDetalhesEvento = mostrarDetalhesEvento;
window.excluirEvento = excluirEvento;
