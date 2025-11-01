export const membrosPage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <div class="mb-8">
        <h2 class="text-4xl font-bold text-white mb-2 tracking-wide">MEMBROS</h2>
        <p class="text-cyan-400 text-xl" id="total-membros">Total: 0 membros</p>
      </div>

      <!-- Barra de Pesquisa e Filtros -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <input
              type="text"
              id="search-input"
              placeholder="Pesquisar por nome..."
              class="w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <select id="filter-patente" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
            <option value="">Todas as Patentes</option>
          </select>
          <select id="filter-situacao" class="bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400">
            <option value="">Todas as Situações</option>
            <option value="Ativo">Ativo</option>
            <option value="Reservista">Reservista</option>
            <option value="Desertor">Desertor</option>
          </select>
          <button id="clear-filters" class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-4 py-2 transition-colors">
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Tabela de Membros -->
      <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table class="w-full">
            <thead class="bg-slate-900 sticky top-0 z-10">
              <tr class="text-left text-cyan-400 font-semibold">
                <th class="px-6 py-4 cursor-pointer hover:text-cyan-300" data-sort="patente">PATENTE</th>
                <th class="px-6 py-4 cursor-pointer hover:text-cyan-300" data-sort="nome">NOME</th>
                <th class="px-6 py-4 text-center">MEDALHAS</th>
                <th class="px-6 py-4 cursor-pointer hover:text-cyan-300" data-sort="dataRegistro">DATA REGISTRO</th>
                <th class="px-6 py-4 cursor-pointer hover:text-cyan-300" data-sort="situacao">SITUAÇÃO</th>
                <th class="px-6 py-4 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody id="membros-tbody" class="text-gray-300">
              <!-- Linhas serão geradas dinamicamente -->
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Sidebar de Detalhes (Aside) -->
    <aside id="member-details-sidebar" class="fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400">DETALHES DO MEMBRO</h3>
          <button id="close-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        <div id="member-details-content">
          <!-- Conteúdo será preenchido dinamicamente -->
        </div>
      </div>
    </aside>

    <!-- Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 hidden z-40"></div>
  `;
};
