export const membrosPage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <div class="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 class="text-4xl font-bold text-white mb-2 tracking-wide">MEMBROS</h2>
          <p class="text-cyan-400 text-xl" id="total-membros">Total: 0 membros</p>
        </div>
        <button id="add-membro-btn" class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors flex items-center gap-2">
          ➕ Adicionar Membro
        </button>
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

    <!-- Sidebar de Detalhes (Direita) -->
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

    <!-- Sidebar de Edição (Esquerda) -->
    <aside id="edit-member-sidebar" class="fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 transform -translate-x-full transition-transform duration-300 z-50 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-cyan-400" id="edit-sidebar-title">EDITAR MEMBRO</h3>
          <button id="close-edit-sidebar" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <form id="form-membro" class="space-y-4">
          <input type="hidden" id="membro-id" />

          <div>
            <label class="block text-gray-400 text-sm mb-2">NOME *</label>
            <input
              type="text"
              id="membro-nome"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">FOTO (URL)</label>
            <input
              type="text"
              id="membro-foto"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="https://..."
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">PATENTE *</label>
            <select
              id="membro-patente"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="Recruta">Recruta</option>
              <option value="Soldado">Soldado</option>
              <option value="Cabo">Cabo</option>
              <option value="Terceiro-Sargento">Terceiro-Sargento</option>
              <option value="Segundo-Sargento">Segundo-Sargento</option>
              <option value="Primeiro-Sargento">Primeiro-Sargento</option>
              <option value="Sargento-Mor">Sargento-Mor</option>
              <option value="Subtenente">Subtenente</option>
              <option value="Tenente">Tenente</option>
              <option value="Capitão">Capitão</option>
              <option value="Major">Major</option>
              <option value="Tenente-Coronel">Tenente-Coronel</option>
              <option value="Coronel">Coronel</option>
              <option value="Brigadeiro">Brigadeiro</option>
              <option value="General">General</option>
              <option value="Marechal">Marechal</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">ATRIBUIÇÃO *</label>
            <select
              id="membro-atribuicao"
              required
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="Infantaria">Infantaria</option>
              <option value="Força Aérea">Força Aérea</option>
              <option value="Marinha">Marinha</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">DATA DE REGISTRO</label>
            <input
              type="date"
              id="membro-dataRegistro"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">SITUAÇÃO</label>
            <select
              id="membro-situacao"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="Ativo">Ativo</option>
              <option value="Reservista">Reservista</option>
              <option value="Desertor">Desertor</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">FORÇA ESPECIAL</label>
            <input
              type="text"
              id="membro-forcaEspecial"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="S.T.O.R.M. ou deixe 'Não'"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">OBSERVAÇÕES</label>
            <textarea
              id="membro-observacoes"
              rows="4"
              class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
            ></textarea>
          </div>

          <div class="border-t border-slate-700 pt-4">
            <h4 class="text-cyan-400 font-semibold mb-3">📜 HISTÓRICO DE MISSÕES ANTIGAS</h4>
            <p class="text-gray-500 text-xs mb-3">Use esta seção para registrar missões realizadas antes da criação deste sistema.</p>
            
            <div>
              <label class="block text-gray-400 text-sm mb-2">HISTÓRICO</label>
              <textarea
                id="membro-historico"
                rows="6"
                class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Descreva aqui as missões antigas e eventos relevantes..."
              ></textarea>
            </div>

            <div class="mt-4">
              <label class="block text-gray-400 text-sm mb-2">VALOR HISTÓRICO (Quantidade de Missões)</label>
              <input
                type="number"
                id="membro-valorHistorico"
                min="0"
                value="0"
                class="w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400"
              />
              <p class="text-gray-500 text-xs mt-1">Este número será somado ao total de missões do membro.</p>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors"
            >
              ✓ Salvar
            </button>
            <button
              type="button"
              id="btn-cancelar-edit"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors"
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      </div>
    </aside>

    <!-- Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 hidden z-40"></div>
  `;
};
