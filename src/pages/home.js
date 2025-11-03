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
      <!-- Manifesto -->
      <div class="mt-20">
        <div
          class="bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8"
        >
          <h2 class="text-4xl font-bold text-cyan-400 mb-6 tracking-wide">
            MANIFESTO
          </h2>
          
          <div class="space-y-4 text-gray-300 leading-relaxed">
          <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
            Nossas Frentes de Atuação:
          </h3>
            <p>
              Infantaria: Tropas terrestres altamente treinadas para incursões,
              <span class="text-cyan-400 font-semibold">CQB</span> e operações
              táticas. Força Aérea: Pilotos especializados em superioridade
              aérea, suporte e escolta. Marinha Espacial: Comando e tripulação
              de naves capitais em ações de larga escala. Logística: Transporte
              de tropas, veículos e recursos estratégicos. Corpo Médico: Suporte
              vital com socorristas e médicos de combate. Forças Especiais
              (S.T.O.R.M.): Unidades de elite para missões críticas e resgates.
            </p>

            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              Nossa Missão:
            </h3>

            <p>
              Criar uma estrutura militar funcional, divertida e acolhedora.
              Cada membro é valorizado e guiado por uma hierarquia clara, com
              foco em treinamentos, missões, campanhas e evolução pessoal.
            </p>

            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              Por Que Existimos:
            </h3>
            <p>
              Queremos mais do que jogar: buscamos imersão, identidade e
              propósito dentro do ‘verse. Seja como recruta, instrutor ou
              comandante de uma nave capital, na
              <span class="text-cyan-400 font-semibold">STRYKERS</span> você
              sempre terá um caminho para crescer.
            </p>
        </div>
      </div>

      <!-- Charter -->
      <div class="mt-20">
        <div
          class="bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8"
        >
          <h2 class="text-4xl font-bold text-cyan-400 mb-6 tracking-wide">
            CHARTER
          </h2>
          
          <div class="space-y-4 text-gray-300 leading-relaxed">
            
          <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
            REGRAS DA STRYKERS
          </h3>
            <p>
              “Disciplina com liberdade. Ordem com respeito. Supremacia com camaradagem.”
            </p>

            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              RESPEITO ACIMA DE TUDO
            </h3>
            <p>
              Respeite todos os membros, independentemente da patente, tempo de casa ou estilo de jogo. Não será tolerado nenhum tipo de comportamento tóxico, preconceituoso ou ofensivo.
            </p>
            </div>
            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              CAMARADAGEM É NOSSA BASE
            </h3>
            <p>
              A <span class="text-cyan-400 font-semibold">STRYKERS</span> é mais do que uma organização militar — somos uma irmandade. Ajude, ensine, apoie. Crescemos juntos ou não crescemos.
            </p>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              DIVERSÃO É A PRIORIDADE
            </h3>
            <p>O Star Citizen é um jogo, e a diversão está sempre em primeiro lugar. Missões, treinamentos e campanhas existem para somar, não para pressionar.</p>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              SEU JOGO, SEU RITMO
            </h3>
            <p>Não controlamos como você joga. Quer explorar? Minerar? Jogar solo? Está tudo bem. Nossa função é apoiar, organizar e oferecer caminhos para quem quiser se engajar.</p>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              HIERARQUIA FUNCIONAL
            </h3>
            <p>A estrutura militar da <span class="text-cyan-400 font-semibold">STRYKERS</span> serve para facilitar a organização e evolução dos membros. Hierarquia existe para liderar, não para mandar.</p>
            </div>
            
            <div class="mt-8 pt-6 border-t border-slate-700">
            <h3 class="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
              NÃO É OBRIGATÓRIO, MAS É VALORIZADO
            </h3>
            <p>Treinamentos, operações e eventos são oportunidades para se destacar e subir na hierarquia, mas não são obrigatórios. Participe no seu tempo, do seu jeito.</p>
            </div> 
        </div>
      </div>
    </main>
  `;
};
