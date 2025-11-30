import React from 'react';
import Carousel from '../components/ui/Carousel.jsx';

export default function Home() {
  return (
    <main className='relative z-10 container mx-auto px-6 py-16'>
      {/* Hero Section */}
      <section className='text-center mb-16'>
        <h2 className='text-5xl font-bold text-white mb-4 tracking-wide'>
          BEM-VINDO AOS STRYKERS
        </h2>
        <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
          Unidade de elite militar no universo de Star Citizen. Precisão,
          estratégia e honra.
        </p>
      </section>

      {/* Cards de Informação */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
        <article className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <h3 className='text-2xl font-bold text-cyan-400 mb-3'>MISSÃO</h3>
          <p className='text-gray-300'>
            Operações táticas coordenadas com foco em objetivos estratégicos e
            trabalho em equipe.
          </p>
        </article>

        <article className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <h3 className='text-2xl font-bold text-cyan-400 mb-3'>VALORES</h3>
          <p className='text-gray-300'>
            Disciplina, lealdade e excelência operacional em cada missão
            executada.
          </p>
        </article>

        <article className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <h3 className='text-2xl font-bold text-cyan-400 mb-3'>COMUNIDADE</h3>
          <p className='text-gray-300'>
            Grupo unido de jogadores dedicados a construir experiências
            memoráveis juntos.
          </p>
        </article>
      </section>

      {/* Carrossel de Imagens */}
      <section className='mt-20 mb-20'>
        <h2 className='text-3xl font-bold text-white mb-8 text-center tracking-wide'>
          GALERIA DE OPERAÇÕES
        </h2>
        <div className='relative overflow-hidden rounded-lg border border-slate-700'>
          <Carousel />
        </div>
      </section>

      {/* Briefing Section */}
      <section className='mt-20'>
        <div className='bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8'>
          <h2 className='text-4xl font-bold text-cyan-400 mb-6 tracking-wide'>
            BRIEFING: STRYKERS
          </h2>

          <div className='space-y-4 text-gray-300 leading-relaxed'>
            <p>
              A <span className='text-cyan-400 font-semibold'>Strykers</span> é
              uma força paramilitar brasileira organizada, que atua com
              hierarquia, estratégia e cooperação em todos os setores do 'verse.
            </p>

            <p>
              Aqui, você não apenas joga — você se{' '}
              <span className='text-cyan-400 font-semibold'>
                alista, treina, cresce
              </span>{' '}
              e se torna parte de uma tropa onde{' '}
              <span className='text-cyan-400 font-semibold'>
                cada membro tem valor e função.
              </span>
            </p>

            <p>
              Se você busca organização, camaradagem, disciplina e oportunidades
              reais de evolução,{' '}
              <span className='text-cyan-400 font-semibold'>aliste-se</span>.
            </p>
          </div>

          <div className='mt-8 pt-6 border-t border-slate-700'>
            <p className='text-sm text-gray-400 italic'>
              "Disciplina. Ordem. Supremacia."
            </p>
            <p className='text-sm text-cyan-400 font-semibold mt-2'>
              - Lema dos Strykers
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className='mt-20'>
        <div className='bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8'>
          <h2 className='text-4xl font-bold text-cyan-400 mb-6 tracking-wide'>
            MANIFESTO
          </h2>

          <div className='space-y-4 text-gray-300 leading-relaxed'>
            <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
              Nossas Frentes de Atuação:
            </h3>
            <p>
              Infantaria: Tropas terrestres altamente treinadas para incursões,{' '}
              <span className='text-cyan-400 font-semibold'>CQB</span> e
              operações táticas. Força Aérea: Pilotos especializados em
              superioridade aérea, suporte e escolta. Marinha Espacial: Comando
              e tripulação de naves capitais em ações de larga escala.
              Logística: Transporte de tropas, veículos e recursos estratégicos.
              Corpo Médico: Suporte vital com socorristas e médicos de combate.
              Forças Especiais (S.T.O.R.M.): Unidades de elite para missões
              críticas e resgates.
            </p>

            <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
              Nossa Missão:
            </h3>
            <p>
              Criar uma estrutura militar funcional, divertida e acolhedora.
              Cada membro é valorizado e guiado por uma hierarquia clara, com
              foco em treinamentos, missões, campanhas e evolução pessoal.
            </p>

            <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
              Por Que Existimos:
            </h3>
            <p>
              Queremos mais do que jogar: buscamos imersão, identidade e
              propósito dentro do ‘verse. Seja como recruta, instrutor ou
              comandante de uma nave capital, na{' '}
              <span className='text-cyan-400 font-semibold'>STRYKERS</span> você
              sempre terá um caminho para crescer.
            </p>
          </div>
        </div>
      </section>

      {/* Charter */}
      <section className='mt-20'>
        <div className='bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8'>
          <h2 className='text-4xl font-bold text-cyan-400 mb-6 tracking-wide'>
            CHARTER
          </h2>

          <div className='space-y-4 text-gray-300 leading-relaxed'>
            <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
              REGRAS DA STRYKERS
            </h3>
            <p>
              “Disciplina com liberdade. Ordem com respeito. Supremacia com
              camaradagem.”
            </p>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                RESPEITO ACIMA DE TUDO
              </h3>
              <p>
                Respeite todos os membros, independentemente da patente, tempo
                de casa ou estilo de jogo. Não será tolerado nenhum tipo de
                comportamento tóxico, preconceituoso ou ofensivo.
              </p>
            </div>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                CAMARADAGEM É NOSSA BASE
              </h3>
              <p>
                A <span className='text-cyan-400 font-semibold'>STRYKERS</span>{' '}
                é mais do que uma organização militar — somos uma irmandade.
                Ajude, ensine, apoie. Crescemos juntos ou não crescemos.
              </p>
            </div>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                DIVERSÃO É A PRIORIDADE
              </h3>
              <p>
                O Star Citizen é um jogo, e a diversão está sempre em primeiro
                lugar. Missões, treinamentos e campanhas existem para somar, não
                para pressionar.
              </p>
            </div>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                SEU JOGO, SEU RITMO
              </h3>
              <p>
                Não controlamos como você joga. Quer explorar? Minerar? Jogar
                solo? Está tudo bem. Nossa função é apoiar, organizar e oferecer
                caminhos para quem quiser se engajar.
              </p>
            </div>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                HIERARQUIA FUNCIONAL
              </h3>
              <p>
                A estrutura militar da{' '}
                <span className='text-cyan-400 font-semibold'>STRYKERS</span>{' '}
                serve para facilitar a organização e evolução dos membros.
                Hierarquia existe para liderar, não para mandar.
              </p>
            </div>

            <div className='mt-8 pt-6 border-t border-slate-700'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6 tracking-wide'>
                NÃO É OBRIGATÓRIO, MAS É VALORIZADO
              </h3>
              <p>
                Treinamentos, operações e eventos são oportunidades para se
                destacar e subir na hierarquia, mas não são obrigatórios.
                Participe no seu tempo, do seu jeito.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
