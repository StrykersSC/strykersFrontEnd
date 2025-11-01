export const homePage = () => {
  return `
    <main class="relative z-10 container mx-auto px-6 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h2 class="text-5xl font-bold text-white mb-4 tracking-wide">
          BEM-VINDO AOS STRYKERS
        </h2>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Unidade de elite militar no universo de Star Citizen. Precisão,
          estratégia e honra.
        </p>
      </div>

      <!-- Cards de Informação -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
          <h3 class="text-2xl font-bold text-cyan-400 mb-3">MISSÃO</h3>
          <p class="text-gray-300">
            Operações táticas coordenadas com foco em objetivos estratégicos e
            trabalho em equipe.
          </p>
        </div>

        <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
          <h3 class="text-2xl font-bold text-cyan-400 mb-3">VALORES</h3>
          <p class="text-gray-300">
            Disciplina, lealdade e excelência operacional em cada missão
            executada.
          </p>
        </div>

        <div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
          <h3 class="text-2xl font-bold text-cyan-400 mb-3">COMUNIDADE</h3>
          <p class="text-gray-300">
            Grupo unido de jogadores dedicados a construir experiências
            memoráveis juntos.
          </p>
        </div>
      </div>

      <!-- Carrossel de Imagens -->
      <div class="mt-20 mb-20">
        <h2 class="text-3xl font-bold text-white mb-8 text-center tracking-wide">
          GALERIA DE OPERAÇÕES
        </h2>
        <div class="relative overflow-hidden rounded-lg border border-slate-700">
          <div id="carousel" class="flex transition-transform duration-500 ease-in-out">
            <!-- Os slides serão gerados dinamicamente pelo JavaScript -->
          </div>

          <!-- Indicadores -->
          <div id="carousel-indicators" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <!-- Os indicadores serão gerados dinamicamente pelo JavaScript -->
          </div>
        </div>
      </div>

      <!-- Briefing Section -->
      <div class="mt-20">
        <div class="bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8">
          <h2 class="text-4xl font-bold text-cyan-400 mb-6 tracking-wide">
            BRIEFING: STRYKERS
          </h2>

          <div class="space-y-4 text-gray-300 leading-relaxed">
            <p>
              A <span class="text-cyan-400 font-semibold">Strykers</span> é uma
              uma força paramilitar brasileira organizada, que atua com
              hierarquia, estratégia e cooperação em todos os setores do 'verse.
            </p>

            <p>
              Aqui, você não apenas joga — você se
              <span class="text-cyan-400 font-semibold">alista, treina, cresce</span>
              e se torna parte de uma tropa onde
              <span class="text-cyan-400 font-semibold">cada membro tem valor e função.</span>
            </p>

            <p>
              Se você busca organização, camaradagem, disciplina e oportunidades
              reais de evolução,
              <span class="text-cyan-400 font-semibold">aliste-se</span>.
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-700">
            <p class="text-sm text-gray-400 italic">
              "Disciplina. Ordem. Supremacia."
            </p>
            <p class="text-sm text-cyan-400 font-semibold mt-2">
              - Lema dos Strykers
            </p>
          </div>
        </div>
      </div>
    </main>
  `;
};
