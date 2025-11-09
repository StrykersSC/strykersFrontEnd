// Cores das categorias
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
let eventoAtual = null;
let modoEdicao = false; // NOVO

export function initEventos() {
  carregarEventos();
  renderizarProximoEvento();
  renderizarCalendario();
  setupEventListeners();
}

function carregarEventos() {
  const eventosStorage = localStorage.getItem('strykers_eventos');
  if (eventosStorage) eventos = JSON.parse(eventosStorage);
}

function salvarEventos() {
  localStorage.setItem('strykers_eventos', JSON.stringify(eventos));
}

// Utilitários para sidebars
function abrirSidebar(id) {
  if (id === 'participantes-evento-sidebar') {
    document.getElementById(id).classList.remove('-translate-x-full');
  } else {
    document.getElementById(id).classList.remove('translate-x-full');
  }
  document.getElementById('eventos-overlay').classList.remove('hidden');
}

function fecharSidebar(id) {
  if (id === 'participantes-evento-sidebar') {
    document.getElementById(id).classList.add('-translate-x-full');
  } else {
    document.getElementById(id).classList.add('translate-x-full');
  }
}

function fecharSidebars() {
  fecharSidebar('evento-sidebar');
  fecharSidebar('detalhes-evento-sidebar');
  fecharSidebar('participantes-evento-sidebar');
  document.getElementById('eventos-overlay').classList.add('hidden');
}

function setupEventListeners() {
  document
    .getElementById('btn-novo-evento')
    .addEventListener('click', abrirFormularioEvento);
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

  // Handler único!
  document
    .getElementById('form-evento')
    .addEventListener('submit', handleSubmitEvento);

  document
    .getElementById('btn-limpar-form')
    .addEventListener('click', limparFormulario);

  // Fechar sidebars individualmente
  document
    .getElementById('close-evento-sidebar')
    .addEventListener('click', () => {
      fecharSidebar('evento-sidebar');
      document.getElementById('eventos-overlay').classList.add('hidden');
    });
  document
    .getElementById('close-detalhes-sidebar')
    .addEventListener('click', () => {
      fecharSidebar('detalhes-evento-sidebar');
      if (
        document
          .getElementById('participantes-evento-sidebar')
          .classList.contains('-translate-x-full')
      ) {
        document.getElementById('eventos-overlay').classList.add('hidden');
      }
    });
  document
    .getElementById('close-participantes-sidebar')
    .addEventListener('click', () => {
      fecharSidebar('participantes-evento-sidebar');
      if (
        document
          .getElementById('detalhes-evento-sidebar')
          .classList.contains('translate-x-full')
      ) {
        document.getElementById('eventos-overlay').classList.add('hidden');
      }
    });

  // Overlay fecha TODOS os sidebars
  document
    .getElementById('eventos-overlay')
    .addEventListener('click', fecharSidebars);

  // Participantes
  document
    .getElementById('search-membro-participante')
    .addEventListener('input', filtrarMembrosParticipantes);
}

function abrirFormularioEvento() {
  fecharSidebars();
  limparFormulario();
  modoEdicao = false; // Modo cadastro
  eventoAtual = null;
  document.getElementById('sidebar-titulo').textContent = 'CADASTRAR EVENTO';
  abrirSidebar('evento-sidebar');
  document.querySelector('#form-evento button[type="submit"]').textContent =
    '✓ Registrar';
}

function limparFormulario() {
  document.getElementById('evento-nome').value = '';
  document.getElementById('evento-categoria').value = '';
  document.getElementById('evento-data').value = '';
  document.getElementById('evento-horario').value = '';
  document.getElementById('evento-descricao').value = '';
}

// Handler único para submit do formulário!
function handleSubmitEvento(e) {
  e.preventDefault();

  if (modoEdicao && eventoAtual) {
    // Atualizar evento existente
    eventoAtual.nome = document.getElementById('evento-nome').value;
    eventoAtual.categoria = document.getElementById('evento-categoria').value;
    eventoAtual.data = document.getElementById('evento-data').value;
    eventoAtual.horario = document.getElementById('evento-horario').value;
    eventoAtual.descricao = document.getElementById('evento-descricao').value;

    const index = eventos.findIndex((e) => e.id === eventoAtual.id);
    if (index !== -1) eventos[index] = eventoAtual;

    salvarEventos();
    fecharSidebars();
    renderizarCalendario();
    renderizarProximoEvento();
    alert('✅ Evento atualizado com sucesso!');
  } else {
    // Criar novo evento
    const evento = {
      id: Date.now(),
      nome: document.getElementById('evento-nome').value,
      categoria: document.getElementById('evento-categoria').value,
      data: document.getElementById('evento-data').value,
      horario: document.getElementById('evento-horario').value,
      descricao: document.getElementById('evento-descricao').value,
      participantes: [],
      finalizado: false,
    };
    eventos.push(evento);
    salvarEventos();
    fecharSidebars();
    renderizarCalendario();
    renderizarProximoEvento();
    alert('✅ Evento cadastrado com sucesso!');
  }

  // Sempre volta para modo cadastro
  modoEdicao = false;
  eventoAtual = null;
  document.getElementById('sidebar-titulo').textContent = 'CADASTRAR EVENTO';
  document.querySelector('#form-evento button[type="submit"]').textContent =
    '✓ Registrar';
}

function renderizarProximoEvento() {
  const container = document.getElementById('proximo-evento-card');
  const agora = new Date();
  const eventosFuturos = eventos
    .filter((e) => new Date(`${e.data}T${e.horario}`) > agora)
    .sort(
      (a, b) =>
        new Date(`${a.data}T${a.horario}`) - new Date(`${b.data}T${b.horario}`)
    );
  if (eventosFuturos.length === 0) {
    container.innerHTML = `<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center"><p class="text-gray-400">Nenhum evento agendado</p></div>`;
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
       <span class="inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-2">${cores.nome}</span>
       <h3 class="text-2xl font-bold text-white">${proximo.nome}</h3>
     </div>
     <span class="bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full">${tempoRestante}</span>
   </div>
   <div class="flex items-center gap-6 text-gray-300 mb-3">
     <div class="flex items-center gap-2"><span class="text-cyan-400">📅</span><span>${dataFormatada}</span></div>
     <div class="flex items-center gap-2"><span class="text-cyan-400">🕐</span><span>${proximo.horario}</span></div>
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

  for (let i = 0; i < primeiroDia; i++) {
    const diaVazio = document.createElement('div');
    diaVazio.className = 'min-h-[120px] bg-slate-700/30 rounded-lg';
    container.appendChild(diaVazio);
  }

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

    if (eventosNoDia.length > 0) {
      html += '<div class="space-y-1">';
      eventosNoDia.forEach((evento) => {
        const cores = CATEGORIAS_CORES[evento.categoria];
        const finalizadoStyle = evento.finalizado
          ? 'line-through opacity-75'
          : '';
        const finalizadoBadge = evento.finalizado
          ? '<span class="text-[10px] bg-green-600 px-1 rounded ml-1">✓</span>'
          : '';
        html += `
          <div class="text-xs ${cores.text} bg-slate-900/50 px-2 py-1 rounded border-l-2 ${cores.border} cursor-pointer hover:bg-slate-900 transition-colors" onclick="window.mostrarDetalhesEvento(${evento.id})">
            <div class="font-semibold truncate ${finalizadoStyle}">${evento.horario} ${finalizadoBadge}</div>
            <div class="truncate ${finalizadoStyle}">${evento.nome}</div>
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

  eventoAtual = evento;

  const cores = CATEGORIAS_CORES[evento.categoria];

  const dataEvento = new Date(evento.data + 'T00:00:00');

  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const content = document.getElementById('detalhes-evento-content');

  content.innerHTML = `<div class="space-y-6">
<div>
<span class="inline-block px-3 py-1 ${
    cores.bg
  } text-slate-900 text-sm font-semibold rounded mb-3">${cores.nome}</span>
${
  evento.finalizado
    ? '<span class="ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded">✓ FINALIZADO</span>'
    : ''
}
<h3 class="text-3xl font-bold text-white">${evento.nome}</h3>
</div>
<div class="border-t border-slate-700 pt-4">
<div class="flex items-center gap-2 mb-2"><span class="text-cyan-400">📅</span><span class="text-gray-300 capitalize">${dataFormatada}</span></div>
<div class="flex items-center gap-2"><span class="text-cyan-400">🕐</span><span class="text-gray-300">${
    evento.horario
  }</span></div>
</div>
<div class="border-t border-slate-700 pt-4">
<h4 class="text-sm text-gray-400 mb-2">DESCRIÇÃO</h4>
<p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${
    evento.descricao
  }</p>
</div>
<div class="border-t border-slate-700 pt-4">
<div class="flex justify-between items-center mb-3">
<h4 class="text-sm text-gray-400">PARTICIPANTES (${
    evento.participantes?.length || 0
  })</h4>
${
  !evento.finalizado
    ? `<button onclick="window.abrirGerenciarParticipantes(${evento.id})" class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded px-3 py-1 transition-colors">+ Gerenciar</button>`
    : ''
}
</div>
<div class="space-y-2 max-h-40 overflow-y-auto">
${
  evento.participantes && evento.participantes.length > 0
    ? evento.participantes
        .map(
          (p) =>
            `<div class="bg-slate-800 rounded px-3 py-2 text-gray-300 text-sm">${p.nome}</div>`
        )
        .join('')
    : '<p class="text-gray-500 text-sm">Nenhum participante registrado</p>'
}
</div>
</div>
${
  !evento.finalizado
    ? `<button onclick="window.finalizarEvento(${evento.id})" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors">✓ Finalizar Evento</button>
<button onclick="window.editarEvento(${evento.id})" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-6 py-3 transition-colors mb-2">✏️ Editar Evento</button>
<button onclick="window.excluirEvento(${evento.id})" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors">🗑 Excluir Evento</button>`
    : `<button onclick="window.reabrirEvento(${evento.id})" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded px-6 py-3 transition-colors">🔓 Reabrir Evento</button>`
}
</div>`;
  fecharSidebars();
  abrirSidebar('detalhes-evento-sidebar');
}

function abrirGerenciarParticipantes(eventoId) {
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;
  eventoAtual = evento;
  renderizarParticipantes();
  fecharSidebar('evento-sidebar');
  fecharSidebar('detalhes-evento-sidebar');
  abrirSidebar('participantes-evento-sidebar');
}

function editarEvento(eventoId) {
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;
  eventoAtual = evento;
  modoEdicao = true;

  // Preenche os campos do formulário com os dados do evento
  document.getElementById('evento-nome').value = evento.nome;
  document.getElementById('evento-categoria').value = evento.categoria;
  document.getElementById('evento-data').value = evento.data;
  document.getElementById('evento-horario').value = evento.horario;
  document.getElementById('evento-descricao').value = evento.descricao;

  // Muda o título e o botão do formulário
  document.getElementById('sidebar-titulo').textContent = 'EDITAR EVENTO';
  document.querySelector('#form-evento button[type="submit"]').textContent =
    '✏️ Atualizar';

  fecharSidebars();
  abrirSidebar('evento-sidebar');
}

function renderizarParticipantes() {
  if (!eventoAtual) return;
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membrosAtivos = membrosData.filter((m) => m.situacao === 'Ativo');
  const participantesIds = eventoAtual.participantes?.map((p) => p.id) || [];
  const membrosDisponiveis = membrosAtivos.filter(
    (m) => !participantesIds.includes(m.id)
  );
  // Lista de membros disponíveis
  const listaMembros = document.getElementById('lista-membros-disponiveis');
  listaMembros.innerHTML =
    membrosDisponiveis
      .map(
        (membro) => `
      <div class="membro-item bg-slate-800 hover:bg-slate-700 rounded px-4 py-3 cursor-pointer transition-colors flex items-center gap-3" onclick="window.adicionarParticipante('${
        membro.id
      }')" data-nome="${membro.nome.toLowerCase()}">
        <img src="${membro.foto}" alt="${
          membro.nome
        }" class="w-10 h-10 rounded-full" />
        <div>
          <div class="text-white font-semibold">${membro.nome}</div>
          <div class="text-gray-400 text-sm">${membro.patente}</div>
        </div>
      </div>
    `
      )
      .join('') ||
    '<p class="text-gray-500 text-center py-4">Todos os membros ativos já foram adicionados</p>';
  // Lista de participantes
  const listaParticipantes = document.getElementById(
    'lista-participantes-evento'
  );
  listaParticipantes.innerHTML =
    eventoAtual.participantes && eventoAtual.participantes.length > 0
      ? eventoAtual.participantes
          .map(
            (p) => `
        <div class="bg-slate-800 rounded px-4 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${p.foto}" alt="${p.nome}" class="w-10 h-10 rounded-full" />
            <div>
              <div class="text-white font-semibold">${p.nome}</div>
              <div class="text-gray-400 text-sm">${p.patente}</div>
            </div>
          </div>
          <button onclick="window.removerParticipante('${p.id}')" class="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      `
          )
          .join('')
      : '<p class="text-gray-500 text-center py-4">Nenhum participante adicionado</p>';
}

function filtrarMembrosParticipantes() {
  const termo = document
    .getElementById('search-membro-participante')
    .value.toLowerCase();
  const items = document.querySelectorAll('.membro-item');
  items.forEach((item) => {
    const nome = item.dataset.nome;
    item.style.display = nome.includes(termo) ? 'flex' : 'none';
  });
}

function adicionarParticipante(membroId) {
  if (!eventoAtual) return;
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;
  if (!eventoAtual.participantes) eventoAtual.participantes = [];
  eventoAtual.participantes.push({
    id: membro.id,
    nome: membro.nome,
    foto: membro.foto,
    patente: membro.patente,
  });
  const index = eventos.findIndex((e) => e.id === eventoAtual.id);
  if (index !== -1) eventos[index] = eventoAtual;
  salvarEventos();
  renderizarParticipantes();
  document.getElementById('search-membro-participante').value = '';
}

function removerParticipante(membroId) {
  if (!eventoAtual) return;
  eventoAtual.participantes = eventoAtual.participantes.filter(
    (p) => p.id !== membroId
  );
  const index = eventos.findIndex((e) => e.id === eventoAtual.id);
  if (index !== -1) eventos[index] = eventoAtual;
  salvarEventos();
  renderizarParticipantes();
}

function finalizarEvento(eventoId) {
  if (
    !confirm(
      '⚠️ Tem certeza que deseja FINALIZAR este evento?\n\n✅ As missões serão contabilizadas para os participantes\n❌ Não será possível editar participantes ou excluir o evento'
    )
  )
    return;
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;
  evento.finalizado = true;
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  evento.participantes?.forEach((participante) => {
    const membroIndex = membrosData.findIndex((m) => m.id === participante.id);
    if (membroIndex !== -1) {
      if (!membrosData[membroIndex].eventosParticipados)
        membrosData[membroIndex].eventosParticipados = [];
      membrosData[membroIndex].eventosParticipados.push({
        eventoId: evento.id,
        nome: evento.nome,
        data: evento.data,
        categoria: evento.categoria,
      });
      membrosData[membroIndex].missoes =
        membrosData[membroIndex].eventosParticipados.length;
    }
  });
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  salvarEventos();
  fecharSidebars();
  renderizarCalendario();
  alert('✅ Evento finalizado! Missões contabilizadas para os participantes.');
}

function reabrirEvento(eventoId) {
  if (
    !confirm(
      '⚠️ Tem certeza que deseja REABRIR este evento?\n\n❌ As missões contabilizadas serão REMOVIDAS dos participantes\n✓ Será possível editar novamente'
    )
  )
    return;
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;
  evento.finalizado = false;
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  evento.participantes?.forEach((participante) => {
    const membroIndex = membrosData.findIndex((m) => m.id === participante.id);
    if (membroIndex !== -1) {
      membrosData[membroIndex].eventosParticipados = (
        membrosData[membroIndex].eventosParticipados || []
      ).filter((e) => e.eventoId !== evento.id);
      membrosData[membroIndex].missoes =
        membrosData[membroIndex].eventosParticipados.length;
    }
  });
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  salvarEventos();
  fecharSidebars();
  renderizarCalendario();
  alert('✅ Evento reaberto! Missões removidas dos participantes.');
}

function excluirEvento(eventoId) {
  if (!confirm('⚠️ Tem certeza que deseja excluir este evento?')) return;
  eventos = eventos.filter((e) => e.id !== eventoId);
  salvarEventos();
  fecharSidebars();
  renderizarCalendario();
  renderizarProximoEvento();
  alert('✅ Evento excluído com sucesso!');
}

// Expõe funções globalmente
window.mostrarDetalhesEvento = mostrarDetalhesEvento;
window.excluirEvento = excluirEvento;
window.finalizarEvento = finalizarEvento;
window.reabrirEvento = reabrirEvento;
window.abrirGerenciarParticipantes = abrirGerenciarParticipantes;
window.adicionarParticipante = adicionarParticipante;
window.removerParticipante = removerParticipante;
window.abrirFormularioEvento = abrirFormularioEvento;
window.editarEvento = editarEvento;
