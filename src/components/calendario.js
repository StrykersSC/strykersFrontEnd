import { mostrarDetalhesEvento } from '../eventos.js';

const MESES = [
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

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

export function renderCalendario({
  modo = 'visualizacao',
  containerId = null,
} = {}) {
  const eventos = JSON.parse(localStorage.getItem('strykers_eventos') || '[]');
  let calendarioContainer;

  // 1. Seleciona o container correto
  if (containerId) {
    // Administração
    const adminDiv = document.getElementById(containerId);
    // Só injeta o HTML se ainda não existir
    if (!adminDiv.querySelector('.grid.grid-cols-7')) {
      adminDiv.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-6">
            <button id="btn-mes-anterior-admin" class="text-white hover:text-cyan-400 text-2xl transition-colors">◀</button>
            <h3 id="calendario-titulo-admin" class="text-2xl font-bold text-white"></h3>
            <button id="btn-mes-proximo-admin" class="text-white hover:text-cyan-400 text-2xl transition-colors">▶</button>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div class="text-center text-cyan-400 font-semibold py-2">DOM</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SEG</div>
            <div class="text-center text-cyan-400 font-semibold py-2">TER</div>
            <div class="text-center text-cyan-400 font-semibold py-2">QUA</div>
            <div class="text-center text-cyan-400 font-semibold py-2">QUI</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SEX</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SÁB</div>
            <div id="calendario-dias-admin" class="col-span-7 grid grid-cols-7 gap-2"></div>
          </div>
        </div>
      `;
    }
    calendarioContainer = document.getElementById('calendario-dias-admin');
    // Botões e título
    document.getElementById(
      'calendario-titulo-admin'
    ).textContent = `${MESES[mesAtual]} ${anoAtual}`;
    document.getElementById('btn-mes-anterior-admin').onclick = () => {
      mesAtual--;
      if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
      }
      renderCalendario({ modo, containerId });
    };
    document.getElementById('btn-mes-proximo-admin').onclick = () => {
      mesAtual++;
      if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
      }
      renderCalendario({ modo, containerId });
    };
  } else {
    // Página de eventos
    calendarioContainer = document.getElementById('calendario-dias');
    const titulo = document.getElementById('calendario-titulo');
    if (titulo) titulo.textContent = `${MESES[mesAtual]} ${anoAtual}`;
  }

  // 2. Renderiza os dias no container correto
  calendarioContainer.innerHTML = '';
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const diaVazio = document.createElement('div');
    diaVazio.className = 'min-h-[120px] bg-slate-700/30 rounded-lg';
    calendarioContainer.appendChild(diaVazio);
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
    } rounded-lg p-2 hover:bg-slate-700/60 transition-colors`;
    let html = `<div class="font-bold ${
      diaAtual ? 'text-cyan-400' : 'text-white'
    } mb-2">${dia}</div>`;
    if (eventosNoDia.length > 0) {
      html += '<div class="space-y-1">';
      eventosNoDia.forEach((evento) => {
        const cores =
          CATEGORIAS_CORES[evento.categoria] || CATEGORIAS_CORES['outro'];
        const finalizadoStyle = evento.finalizado
          ? 'line-through opacity-75'
          : '';
        const finalizadoBadge = evento.finalizado
          ? '<span class="text-[10px] bg-green-600 px-1 rounded ml-1">✓</span>'
          : '';
        html += `
          <div class="text-xs ${cores.text} bg-slate-900/50 px-2 py-1 rounded border-l-2 ${cores.border} cursor-pointer hover:bg-slate-900 transition-colors ${finalizadoStyle}" data-evento-id="${evento.id}">
            <div class="font-semibold truncate">${evento.horario} ${finalizadoBadge}</div>
            <div class="truncate">${evento.nome}</div>
          </div>
        `;
      });
      html += '</div>';
    }
    diaElement.innerHTML = html;
    if (eventosNoDia.length > 0) {
      setTimeout(() => {
        eventosNoDia.forEach((evento) => {
          const selector = `[data-evento-id="${evento.id}"]`;
          const elEvento = diaElement.querySelector(selector);
          if (elEvento) {
            elEvento.onclick = (e) => {
              e.stopPropagation();
              mostrarDetalhesEvento(evento.id, modo);
            };
          }
        });
      }, 0);
    }
    calendarioContainer.appendChild(diaElement);
  }
}
