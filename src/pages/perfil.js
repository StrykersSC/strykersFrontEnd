export const perfilPage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <div id="perfil-content">
        <!-- Será preenchido dinamicamente -->
      </div>
    </main>
  `;
};

export function initPerfil() {
  const usuarioAtual = JSON.parse(
    localStorage.getItem('strykers_user_session')
  );

  if (!usuarioAtual) {
    document.getElementById('perfil-content').innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-400 text-xl mb-4">⚠️ Você precisa fazer login para acessar seu perfil</p>
        <button onclick="document.getElementById('btn-signin').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
          Fazer Login
        </button>
      </div>
    `;
    return;
  }

  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.nome === usuarioAtual.nome);

  if (!membro) {
    document.getElementById('perfil-content').innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-400 text-xl">⚠️ Dados do perfil não encontrados</p>
      </div>
    `;
    return;
  }

  renderizarPerfil(membro);
}

function renderizarPerfil(membro) {
  const totalMissoes =
    (membro.eventosParticipados?.length || 0) + (membro.valorHistorico || 0);

  const content = `
    <!-- Cabeçalho do Perfil -->
    <div class="bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8 mb-8">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img 
          src="${membro.foto}" 
          alt="${membro.nome}"
          class="w-40 h-40 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
          onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
            membro.nome
          )}&background=0f172a&color=22d3ee&size=150'"
        />
        
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-5xl font-bold text-white mb-2">${membro.nome}</h1>
          <p class="text-3xl text-cyan-400 font-semibold mb-4">${
            membro.patente
          }</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="bg-slate-900/50 rounded p-3">
              <p class="text-gray-400 text-xs uppercase">Atribuição</p>
              <p class="text-white font-semibold">${membro.atribuicao}</p>
            </div>
            <div class="bg-slate-900/50 rounded p-3">
              <p class="text-gray-400 text-xs uppercase">Registro</p>
              <p class="text-white font-semibold">${new Date(
                membro.dataRegistro + 'T00:00:00'
              ).toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="bg-slate-900/50 rounded p-3">
              <p class="text-gray-400 text-xs uppercase">Situação</p>
              <p class="text-white font-semibold">${membro.situacao}</p>
            </div>
            <div class="bg-slate-900/50 rounded p-3">
              <p class="text-gray-400 text-xs uppercase">Força Especial</p>
              <p class="text-white font-semibold">${membro.forcaEspecial}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Observações -->
    ${
      membro.observacoes
        ? `
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">📋 OBSERVAÇÕES</h2>
        <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${membro.observacoes}</p>
      </div>
    `
        : ''
    }

    <!-- Histórico -->
    ${
      membro.historico
        ? `
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">📜 HISTÓRICO</h2>
        <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${
          membro.historico
        }</p>
        ${
          membro.valorHistorico > 0
            ? `
          <div class="mt-4 bg-slate-900/50 rounded p-3 inline-block">
            <p class="text-gray-400 text-sm">Missões históricas: <span class="text-cyan-400 font-bold text-lg">${membro.valorHistorico}</span></p>
          </div>
        `
            : ''
        }
      </div>
    `
        : ''
    }

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">📊 ESTATÍSTICAS</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Total de Missões:</span>
            <span class="text-cyan-400 font-bold text-2xl">${totalMissoes}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Medalhas:</span>
            <span class="text-yellow-400 font-bold text-2xl">${
              membro.medalhas || 0
            }</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">ℹ️ INFORMAÇÕES</h2>
        <div class="space-y-2 text-gray-300">
          <p><span class="text-gray-400">ID:</span> ${membro.id}</p>
          <p><span class="text-gray-400">Data de Registro:</span> ${new Date(
            membro.dataRegistro + 'T00:00:00'
          ).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</p>
        </div>
      </div>
    </div>

    <!-- Medalhas -->
    <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-bold text-cyan-400 mb-6">🏅 CONDECORAÇÕES</h2>
      ${
        membro.medalhasDetalhadas && membro.medalhasDetalhadas.length > 0
          ? `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${membro.medalhasDetalhadas
            .map((m) => {
              const medalhaInfo = getMedalhaInfo(m.tipo);
              return `
              <div 
                class="bg-slate-900/50 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-700/50 transition-all transform hover:scale-105"
                onclick="window.mostrarDetalhesMedalhaNoPerfilPublic('${
                  m.id
                }', '${m.tipo}', '${m.observacoes || ''}')"
              >
                <img src="${medalhaInfo.imagem}" alt="${
                medalhaInfo.nome
              }" class="w-20 h-20 mx-auto mb-3 object-contain" />
                <h3 class="text-white font-semibold text-sm mb-1">${
                  medalhaInfo.nome
                }</h3>
                <p class="text-gray-400 text-xs">${new Date(
                  m.data + 'T00:00:00'
                ).toLocaleDateString('pt-BR')}</p>
              </div>
            `;
            })
            .join('')}
        </div>
      `
          : '<p class="text-gray-400 text-center py-8">Nenhuma condecoração ainda</p>'
      }
    </div>

    <!-- Missões -->
    <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <h2 class="text-2xl font-bold text-cyan-400 mb-6">🎯 MISSÕES PARTICIPADAS</h2>
      ${
        membro.eventosParticipados && membro.eventosParticipados.length > 0
          ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${membro.eventosParticipados
            .map((ep) => {
              const cores = getCoresCategoria(ep.categoria);
              const dataFormatada = new Date(
                ep.data + 'T00:00:00'
              ).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return `
              <div 
                class="bg-slate-900/50 border-l-4 ${cores.border} rounded p-4 cursor-pointer hover:bg-slate-700/50 transition-all"
                onclick="window.mostrarDetalhesMissaoDoEvento(${ep.eventoId})"
              >
                <h3 class="text-white font-semibold mb-2 line-clamp-2">${ep.nome}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-xs ${cores.text}">${cores.nome}</span>
                  <span class="text-gray-400 text-xs">${dataFormatada}</span>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      `
          : '<p class="text-gray-400 text-center py-8">Nenhuma missão participada ainda</p>'
      }
    </div>
  `;

  document.getElementById('perfil-content').innerHTML = content;
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

function getCoresCategoria(categoria) {
  const CORES = {
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

  return CORES[categoria] || CORES.outro;
}

function mostrarDetalhesMedalhaNoPerfilPublic(medalhaId, tipo, observacoes) {
  const medalha = getMedalhaInfo(tipo);

  let modal = document.getElementById('modal-medalha-perfil');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-medalha-perfil';
    modal.className =
      'fixed inset-0 z-[100] flex items-center justify-center hidden';
    document.body.appendChild(modal);
  }

  let observacoesHtml = '';
  if (observacoes && observacoes.trim() !== '' && observacoes !== 'undefined') {
    observacoesHtml = `
      <hr class="my-4 border-slate-700" />
      <div class="text-left">
        <h4 class="text-xs text-gray-500 mb-1 font-semibold">Observação da condecoração</h4>
        <p class="text-gray-400 text-sm whitespace-pre-line">${observacoes}</p>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/70" onclick="window.fecharModalMedalhaPerfil()"></div>
    <div class="relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md mx-4">
      <button onclick="window.fecharModalMedalhaPerfil()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
      <div class="text-center">
        <img src="${medalha.imagem}" alt="${medalha.nome}" class="w-28 h-28 mx-auto mb-4 object-contain" />
        <h3 class="text-2xl font-bold text-cyan-400 mb-4">${medalha.nome}</h3>
        <p class="text-gray-300 leading-relaxed">${medalha.descricao}</p>
        ${observacoesHtml}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function fecharModalMedalhaPerfil() {
  const modal = document.getElementById('modal-medalha-perfil');
  if (modal) modal.classList.add('hidden');
}

// Expor funções globalmente
window.mostrarDetalhesMedalhaNoPerfilPublic =
  mostrarDetalhesMedalhaNoPerfilPublic;
window.fecharModalMedalhaPerfil = fecharModalMedalhaPerfil;
