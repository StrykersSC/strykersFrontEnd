import React, { useState, useEffect } from 'react';
import Calendario from '../components/ui/Calendario.jsx';
import EventDetailsSidebar from '../components/ui/EventDetailsSidebar.jsx';

export default function Eventos() {
  const [eventos, setEventos] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_eventos') || '[]')
  );
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Sincronizar eventos do localStorage
  useEffect(() => {
    const syncEventos = () => {
      const stored = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      setEventos(stored);

      // ✅ Atualizar evento selecionado se estiver aberto
      if (selectedEvento) {
        const updated = stored.find((ev) => ev.id === selectedEvento.id);
        if (updated) {
          setSelectedEvento(updated);
        }
      }
    };

    syncEventos();
    window.addEventListener('storage', syncEventos);
    document.addEventListener('eventos:updated', syncEventos);

    return () => {
      window.removeEventListener('storage', syncEventos);
      document.removeEventListener('eventos:updated', syncEventos);
    };
  }, [selectedEvento]);

  // ✅ Listener para abrir detalhes do evento
  useEffect(() => {
    function handleMostrarDetalhes(e) {
      console.log('🟢 Eventos.jsx recebeu evento:', e.detail);

      const { id } = e.detail || {};
      if (!id) {
        console.error('❌ ID do evento não encontrado');
        return;
      }

      // Buscar evento atualizado do localStorage
      const eventosAtuais = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );

      const found = eventosAtuais.find((ev) => ev.id === id);

      if (found) {
        console.log('✅ Evento encontrado:', found);
        setSelectedEvento(found);
        setShowDetails(true);
      } else {
        console.error('❌ Evento não encontrado no localStorage:', id);
      }
    }

    document.addEventListener('eventos:mostrarDetalhes', handleMostrarDetalhes);

    return () => {
      document.removeEventListener(
        'eventos:mostrarDetalhes',
        handleMostrarDetalhes
      );
    };
  }, []);

  return (
    <div className='relative z-10 container mx-auto px-6 py-16'>
      <div className='mb-8'>
        <h2 className='text-4xl font-bold text-white mb-2 tracking-wide'>
          EVENTOS
        </h2>
        <p className='text-gray-400'>
          Acompanhe os próximos treinamentos, missões e operações
        </p>
      </div>

      {/* CALENDÁRIO */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
          📅 CALENDÁRIO DE EVENTOS
        </h3>
        <Calendario admin={false} modo='visualizacao' />
      </div>

      {/* LISTA DE EVENTOS */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6'>
        <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
          📋 PRÓXIMOS EVENTOS
        </h3>
        {eventos.length === 0 ? (
          <p className='text-gray-400 text-center py-8'>
            Nenhum evento cadastrado
          </p>
        ) : (
          <div className='space-y-4'>
            {eventos
              .sort((a, b) => new Date(a.data) - new Date(b.data))
              .map((evento) => {
                const dataEvento = new Date(evento.data + 'T00:00:00');
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const isPast = dataEvento < hoje;

                const CORES = {
                  treinamento: 'border-green-500',
                  missao: 'border-yellow-500',
                  operacao: 'border-orange-500',
                  'mega-operacao': 'border-red-500',
                  campanha: 'border-purple-500',
                  outro: 'border-blue-500',
                };

                return (
                  <div
                    key={evento.id}
                    className={`bg-slate-900 border-l-4 ${
                      CORES[evento.categoria] || CORES.outro
                    } rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer ${
                      isPast ? 'opacity-60' : ''
                    }`}
                    onClick={() => {
                      console.log('🔵 Clicou no evento da lista:', evento.id);
                      setSelectedEvento(evento);
                      setShowDetails(true);
                    }}
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex-1'>
                        <h4 className='text-xl font-bold text-white mb-2'>
                          {evento.nome}
                        </h4>
                        <div className='flex items-center gap-4 text-gray-400 text-sm'>
                          <span>
                            📅{' '}
                            {dataEvento.toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span>🕐 {evento.horario}</span>
                          <span>
                            👥 {evento.participantes?.length || 0} participantes
                          </span>
                        </div>
                      </div>
                      {evento.finalizado && (
                        <span className='bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded'>
                          ✓ FINALIZADO
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Sidebar de Detalhes */}
      <EventDetailsSidebar
        open={showDetails}
        evento={selectedEvento}
        onClose={() => {
          console.log('🔴 Fechando sidebar');
          setShowDetails(false);
          setSelectedEvento(null);
        }}
        adminMode={false}
      />

      {/* Overlay */}
      {showDetails && (
        <div
          className='fixed inset-0 bg-black/50 z-[60]'
          onClick={() => {
            setShowDetails(false);
            setSelectedEvento(null);
          }}
        />
      )}
    </div>
  );
}
