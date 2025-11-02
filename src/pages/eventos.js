export const eventosPage = () => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <!-- Título -->
      <div class="mb-8">
        <h2 class="text-4xl font-bold text-white mb-2 tracking-wide">EVENTOS</h2>
        <p class="text-gray-400">Programação de operações e treinamentos</p>
      </div>

      <!-- Card do Próximo Evento -->
      <div id="proximo-evento-card" class="mb-8">
        <!-- Será preenchido dinamicamente -->
      </div>

      <!-- Botão Cadastrar Evento -->
      <div class="mb-6 flex justify-between items-center">
        <h3 class="text-2xl font-bold text-white">Calendário</h3>
        <button id="btn-novo-evento" class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors">
          ➕ Cadastrar Evento
        </button>
      </div>

      <!-- Calendário -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <!-- Navegação do Calendário -->
        <div class="flex justify-between items-center mb-6">
          <button id="btn-mes-anterior" class="text-white hover:text-cyan-400 text-2xl transition-colors">
            ◀
          </button>
          <h3 id="calendario-titulo" class="text-2xl font-bold text-white">
            <!-- Mês/Ano será preenchido -->
          </h3>
          <button id="btn-mes-proximo" class="text-white hover:text-cyan-400 text-2xl transition-colors">
            ▶
          </button>
        </div>

        <!-- Grade do Calendário -->
        <div class="grid grid-cols-7 gap-2">
          <!-- Cabeçalho dos dias da semana -->
          <div class="text-center text-cyan-400 font-semibold py-2">DOM</div>
          <div class="text-center text-cyan-400 font-semibold py-2">SEG</div>
          <div class="text-center text-cyan-400 font-semibold py-2">TER</div>
          <div class="text-center text-cyan-400 font-semibold py-2">QUA</div>
          <div class="text-center text-cyan-400 font-semibold py-2">QUI</div>
          <div class="text-center text-cyan-400 font-semibold py-2">SEX</div>
          <div class="text-center text-cyan-400 font-semibold py-2">SÁB</div>
          
          <!-- Dias do mês serão preenchidos dinamicamente -->
          <div id="calendario-dias" class="col-span-7 grid grid-cols-7 gap-2">
            <!-- Preenchido pelo JS -->
          </div>
        </div>
      </div>
    </main>

    <!-- Aside para Cadastrar/Editar Evento -->
    <aside id="evento-sidebar" class="fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400" id="sidebar-titulo">CADASTRAR EVENTO</h3>
          <button id="close-evento-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <form id="form-evento" class="space-y-6">
          <!-- Nome do Evento -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">NOME DO EVENTO *</label>
            <input
              type="text"
              id="evento-nome"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Ex: Treinamento de Combate CQB"
            />
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">CATEGORIA *</label>
            <select
              id="evento-categoria"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            >
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
            <input
              type="date"
              id="evento-data"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <!-- Horário -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">HORÁRIO *</label>
            <input
              type="time"
              id="evento-horario"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">DESCRIÇÃO *</label>
            <textarea
              id="evento-descricao"
              required
              rows="6"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="Descreva os detalhes do evento..."
            ></textarea>
          </div>

          <!-- Botões -->
          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors"
            >
              ✓ Registrar
            </button>
            <button
              type="button"
              id="btn-limpar-form"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors"
            >
              🗑 Limpar
            </button>
          </div>
        </form>
      </div>
    </aside>

    <!-- Aside para Ver Detalhes do Evento -->
    <aside id="detalhes-evento-sidebar" class="fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400">DETALHES DO EVENTO</h3>
          <button id="close-detalhes-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div id="detalhes-evento-content" class="space-y-6">
          <!-- Será preenchido dinamicamente -->
        </div>
      </div>
    </aside>

    <!-- Overlay -->
    <div id="eventos-overlay" class="fixed inset-0 bg-black/50 hidden z-40"></div>
  `;
};
