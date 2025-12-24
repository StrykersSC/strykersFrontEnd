import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

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

export default function EventDetailsSidebar({
  open,
  evento,
  onClose,
  onEdit,
  adminMode = false,
}) {
  const { usuarioAtual } = useAuth();
  const [eventoAtualizado, setEventoAtualizado] = useState(evento);
  const [processando, setProcessando] = useState(false);

  // ✅ Sincronizar evento quando mudar ou quando localStorage atualizar
  useEffect(() => {
    if (!evento) return;

    const syncEvento = () => {
      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const eventoSync = eventos.find((e) => e.id === evento.id);
      if (eventoSync) {
        setEventoAtualizado(eventoSync);
      }
    };

    syncEvento();
    setEventoAtualizado(evento);

    window.addEventListener('storage', syncEvento);
    document.addEventListener('eventos:updated', syncEvento);

    return () => {
      window.removeEventListener('storage', syncEvento);
      document.removeEventListener('eventos:updated', syncEvento);
    };
  }, [evento]);

  if (!open || !eventoAtualizado) return null;

  const cores =
    CATEGORIAS_CORES[eventoAtualizado.categoria] || CATEGORIAS_CORES.outro;
  const dataEvento = new Date(eventoAtualizado.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ✅ Verificar se o usuário logado está participando
  const usuarioParticipando =
    usuarioAtual &&
    eventoAtualizado.participantes?.some((p) => p.nome === usuarioAtual.nome);

  // ✅ Função para participar do evento
  const handleParticipar = () => {
    if (!usuarioAtual) {
      alert('⚠️ Você precisa estar logado para participar de eventos!');
      return;
    }

    if (processando) return;
    setProcessando(true);

    // Buscar dados do membro
    const membros = JSON.parse(
      localStorage.getItem('strykers_membros') || '[]'
    );
    const membro = membros.find((m) => m.nome === usuarioAtual.nome);

    if (!membro) {
      alert(
        '⚠️ Você precisa ser um membro registrado para participar de eventos!'
      );
      setProcessando(false);
      return;
    }

    // Atualizar evento com novo participante
    const eventos = JSON.parse(
      localStorage.getItem('strykers_eventos') || '[]'
    );

    const eventosAtualizados = eventos.map((e) => {
      if (e.id === eventoAtualizado.id) {
        const participantes = e.participantes || [];

        // Verificar duplicata
        if (participantes.some((p) => p.id === membro.id)) {
          return e;
        }

        return {
          ...e,
          participantes: [
            ...participantes,
            {
              id: membro.id,
              nome: membro.nome,
              foto: membro.foto,
              patente: membro.patente,
            },
          ],
        };
      }
      return e;
    });

    localStorage.setItem(
      'strykers_eventos',
      JSON.stringify(eventosAtualizados)
    );

    // Atualizar estado local
    const eventoNovo = eventosAtualizados.find(
      (e) => e.id === eventoAtualizado.id
    );
    setEventoAtualizado(eventoNovo);

    // Disparar evento de atualização
    document.dispatchEvent(new CustomEvent('eventos:updated'));

    setProcessando(false);
    alert('✅ Você agora está participando deste evento!');
  };

  // ✅ Função para abandonar o evento
  const handleAbandonar = () => {
    if (!usuarioAtual) return;

    if (
      !confirm(
        '⚠️ Tem certeza que deseja abandonar este evento?\n\nVocê será removido da lista de participantes.'
      )
    ) {
      return;
    }

    if (processando) return;
    setProcessando(true);

    const eventos = JSON.parse(
      localStorage.getItem('strykers_eventos') || '[]'
    );

    const eventosAtualizados = eventos.map((e) => {
      if (e.id === eventoAtualizado.id) {
        return {
          ...e,
          participantes: (e.participantes || []).filter(
            (p) => p.nome !== usuarioAtual.nome
          ),
        };
      }
      return e;
    });

    localStorage.setItem(
      'strykers_eventos',
      JSON.stringify(eventosAtualizados)
    );

    // Atualizar estado local
    const eventoNovo = eventosAtualizados.find(
      (e) => e.id === eventoAtualizado.id
    );
    setEventoAtualizado(eventoNovo);

    // Disparar evento de atualização
    document.dispatchEvent(new CustomEvent('eventos:updated'));

    setProcessando(false);
    alert('✅ Você abandonou este evento.');
  };

  return (
    <aside className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 z-[80] overflow-y-auto'>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-2xl font-bold text-cyan-400'>
            DETALHES DO EVENTO
          </h3>
          <button
            className='text-gray-400 hover:text-white text-2xl'
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className='space-y-6'>
          <div>
            <span
              className={`inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-3`}
            >
              {cores.nome}
            </span>
            {eventoAtualizado.finalizado && (
              <span className='ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded'>
                ✓ FINALIZADO
              </span>
            )}
            <h3 className='text-3xl font-bold text-white break-words'>
              {eventoAtualizado.nome}
            </h3>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-cyan-400'>📅</span>
              <span className='text-gray-300 capitalize'>{dataFormatada}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-cyan-400'>🕐</span>
              <span className='text-gray-300'>{eventoAtualizado.horario}</span>
            </div>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <h4 className='text-sm text-gray-400 mb-2'>DESCRIÇÃO</h4>
            <p className='text-gray-300 leading-relaxed whitespace-pre-wrap break-words'>
              {eventoAtualizado.descricao}
            </p>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <div className='flex justify-between items-center mb-3'>
              <h4 className='text-sm text-gray-400'>
                PARTICIPANTES ({eventoAtualizado.participantes?.length || 0})
              </h4>
              {adminMode && !eventoAtualizado.finalizado && (
                <button
                  onClick={() => {
                    window.abrirGerenciarParticipantes?.(eventoAtualizado.id);
                    onClose();
                  }}
                  className='bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded px-3 py-1'
                >
                  + Gerenciar
                </button>
              )}
            </div>
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              {eventoAtualizado.participantes &&
              eventoAtualizado.participantes.length > 0 ? (
                eventoAtualizado.participantes.map((p) => (
                  <div
                    key={p.id}
                    className='bg-slate-800 rounded px-3 py-2 text-gray-300 text-sm'
                  >
                    {p.nome}
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-sm'>
                  Nenhum participante registrado
                </p>
              )}
            </div>
          </div>

          {/* ✅ BOTÕES DE PARTICIPAÇÃO (APENAS MODO NÃO-ADMIN) */}
          {!adminMode && usuarioAtual && !eventoAtualizado.finalizado && (
            <div className='pt-4 border-t border-slate-700'>
              {!usuarioParticipando ? (
                <button
                  onClick={handleParticipar}
                  disabled={processando}
                  className='w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-semibold rounded px-6 py-3 transition-colors flex items-center justify-center gap-2'
                >
                  {processando ? (
                    <>
                      <span className='animate-spin'>⏳</span>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Participar do Evento</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleAbandonar}
                  disabled={processando}
                  className='w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded px-6 py-3 transition-colors flex items-center justify-center gap-2'
                >
                  {processando ? (
                    <>
                      <span className='animate-spin'>⏳</span>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      <span>Abandonar Evento</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ✅ AVISO SE NÃO ESTIVER LOGADO */}
          {!adminMode && !usuarioAtual && !eventoAtualizado.finalizado && (
            <div className='pt-4 border-t border-slate-700'>
              <div className='bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center'>
                <p className='text-yellow-400 text-sm font-semibold mb-2'>
                  ⚠️ Faça login para participar
                </p>
                <p className='text-gray-400 text-xs'>
                  Você precisa estar logado para se inscrever em eventos.
                </p>
              </div>
            </div>
          )}

          {adminMode && (
            <div className='pt-4'>
              <div className='space-y-2'>
                {!eventoAtualizado.finalizado ? (
                  <>
                    <button
                      onClick={() =>
                        window.finalizarEvento?.(eventoAtualizado.id)
                      }
                      className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      ✓ Finalizar Evento
                    </button>
                    <button
                      onClick={() => onEdit?.(eventoAtualizado)}
                      className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      ✏️ Editar Evento
                    </button>
                    <button
                      onClick={() =>
                        window.excluirEvento?.(eventoAtualizado.id)
                      }
                      className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      🗑 Excluir Evento
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => window.reabrirEvento?.(eventoAtualizado.id)}
                    className='w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                  >
                    🔓 Reabrir Evento
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
