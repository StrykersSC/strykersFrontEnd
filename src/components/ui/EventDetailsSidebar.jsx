import React from 'react';

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
  if (!open || !evento) return null;

  const cores = CATEGORIAS_CORES[evento.categoria] || CATEGORIAS_CORES.outro;
  const dataEvento = new Date(evento.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

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
            {evento.finalizado && (
              <span className='ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded'>
                ✓ FINALIZADO
              </span>
            )}
            <h3 className='text-3xl font-bold text-white break-words'>
              {evento.nome}
            </h3>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-cyan-400'>📅</span>
              <span className='text-gray-300 capitalize'>{dataFormatada}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-cyan-400'>🕐</span>
              <span className='text-gray-300'>{evento.horario}</span>
            </div>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <h4 className='text-sm text-gray-400 mb-2'>DESCRIÇÃO</h4>
            <p className='text-gray-300 leading-relaxed whitespace-pre-wrap break-words'>
              {evento.descricao}
            </p>
          </div>

          <div className='border-t border-slate-700 pt-4'>
            <div className='flex justify-between items-center mb-3'>
              <h4 className='text-sm text-gray-400'>
                PARTICIPANTES ({evento.participantes?.length || 0})
              </h4>
              {adminMode && !evento.finalizado && (
                <button
                  onClick={() => {
                    window.abrirGerenciarParticipantes?.(evento.id);
                    onClose();
                  }}
                  className='bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded px-3 py-1'
                >
                  + Gerenciar
                </button>
              )}
            </div>
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              {evento.participantes && evento.participantes.length > 0 ? (
                evento.participantes.map((p) => (
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

          {adminMode && (
            <div className='pt-4'>
              <div className='space-y-2'>
                {!evento.finalizado ? (
                  <>
                    <button
                      onClick={() => window.finalizarEvento?.(evento.id)}
                      className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      ✓ Finalizar Evento
                    </button>
                    <button
                      onClick={() => onEdit?.(evento)}
                      className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      ✏️ Editar Evento
                    </button>
                    <button
                      onClick={() => window.excluirEvento?.(evento.id)}
                      className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                    >
                      🗑 Excluir Evento
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => window.reabrirEvento?.(evento.id)}
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
