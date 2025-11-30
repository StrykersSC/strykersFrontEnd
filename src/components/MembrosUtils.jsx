export * from './ui/MembrosUtils.jsx';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import medalhas from '../constants/medalhas';

function getMedalhaInfo(tipo) {
  return (
    medalhas[tipo] || {
      imagem: '',
      nome: 'Medalha Desconhecida',
      descricao: '',
    }
  );
}

function mountReact(Component, containerId) {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }
  if (!container._reactRoot) container._reactRoot = createRoot(container);
  container._reactRoot.render(React.createElement(Component));
  return container;
}

function unmount(containerId) {
  const container = document.getElementById(containerId);
  if (container && container._reactRoot) {
    container._reactRoot.unmount();
    try {
      container.remove();
    } catch {}
  }
}

function MedalModal({ medalha, observacoes, onClose }) {
  if (!medalha) return null;
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/70' onClick={onClose} />
      <div className='relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md mx-4'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
        <div className='text-center'>
          <img
            src={medalha.imagem}
            alt={medalha.nome}
            className='w-28 h-28 mx-auto mb-4 object-contain'
          />
          <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
            {medalha.nome}
          </h3>
          <p className='text-gray-300 leading-relaxed'>{medalha.descricao}</p>
          {observacoes ? <hr className='my-4 border-slate-700' /> : null}
          {observacoes ? (
            <div className='text-left'>
              <h4 className='text-xs text-gray-500 mb-1 font-semibold'>
                Observação da condecoração
              </h4>
              <p className='text-gray-400 text-sm whitespace-pre-line'>
                {observacoes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MedalSidebar({ membro, onClose, onShowDetalhe }) {
  const medalhas = membro.medalhasDetalhadas || [];
  return (
    <aside className='fixed top-0 left-0 h-full w-96 bg-slate-900 border-r border-slate-700 transform -translate-x-0 transition-transform duration-300 z-50 overflow-y-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-bold text-cyan-400'>
          MEDALHAS DE {membro.nome}
        </h3>
        <button
          onClick={onClose}
          className='text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
      </div>
      <div className='mb-4'>
        <p className='text-gray-400'>
          Total de medalhas:{' '}
          <span className='text-cyan-400 font-bold text-xl'>
            {medalhas.length}
          </span>
        </p>
      </div>
      {medalhas.length > 0 ? (
        <div className='mb-6'>
          <h4 className='text-sm text-gray-400 mb-3 uppercase tracking-wide'>
            Condecorações
          </h4>
          <div className='grid grid-cols-2 gap-4'>
            {medalhas.map((m) => {
              const info = getMedalhaInfo(m.tipo);
              return (
                <div
                  key={m.id}
                  className='bg-slate-800 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-700 transition-colors'
                  onClick={() =>
                    onShowDetalhe(m.id, m.tipo, m.observacoes || '')
                  }
                >
                  <img
                    src={info.imagem}
                    alt={info.nome}
                    className='w-16 h-16 mx-auto mb-2 object-contain'
                  />
                  <div className='text-white text-sm font-semibold'>
                    {info.nome.split(' ').slice(0, 3).join(' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className='text-gray-500 text-center py-8'>Nenhuma medalha ainda</p>
      )}
    </aside>
  );
}

function MissaoSidebar({ membro, onClose, onShowDetalheMissao }) {
  const eventosParticipados = membro.eventosParticipados || [];
  const stats = {
    treinamento: 0,
    missao: 0,
    operacao: 0,
    'mega-operacao': 0,
    campanha: 0,
    outro: 0,
  };
  eventosParticipados.forEach((ep) => {
    if (stats.hasOwnProperty(ep.categoria)) stats[ep.categoria]++;
  });
  const totalMissoes =
    eventosParticipados.length + (membro.valorHistorico || 0);
  return (
    <aside className='fixed top-0 left-0 h-full w-96 bg-slate-900 border-r border-slate-700 transform -translate-x-0 transition-transform duration-300 z-50 overflow-y-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-bold text-cyan-400'>
          MISSÕES DE {membro.nome}
        </h3>
        <button
          onClick={onClose}
          className='text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
      </div>
      <div className='bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4'>
        <div className='grid grid-cols-3 gap-3'>
          <div className='text-center'>
            <div className='text-green-400 font-bold text-lg'>
              TR: {stats.treinamento}
            </div>
            <div className='text-gray-500 text-xs'>Treinamento</div>
          </div>
          <div className='text-center'>
            <div className='text-yellow-400 font-bold text-lg'>
              MI: {stats.missao}
            </div>
            <div className='text-gray-500 text-xs'>Missão</div>
          </div>
          <div className='text-center'>
            <div className='text-orange-400 font-bold text-lg'>
              OP: {stats.operacao}
            </div>
            <div className='text-gray-500 text-xs'>Operação</div>
          </div>
          <div className='text-center'>
            <div className='text-red-400 font-bold text-lg'>
              MO: {stats['mega-operacao']}
            </div>
            <div className='text-gray-500 text-xs'>Mega Op.</div>
          </div>
          <div className='text-center'>
            <div className='text-purple-400 font-bold text-lg'>
              CA: {stats.campanha}
            </div>
            <div className='text-gray-500 text-xs'>Campanha</div>
          </div>
          <div className='text-center'>
            <div className='text-blue-400 font-bold text-lg'>
              OU: {stats.outro}
            </div>
            <div className='text-gray-500 text-xs'>Outro</div>
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <p className='text-gray-400'>
          Total de missões:{' '}
          <span className='text-cyan-400 font-bold text-xl'>
            {totalMissoes}
          </span>
        </p>
      </div>
      {membro.historico && membro.historico.trim() !== '' ? (
        <div
          className='bg-slate-800 border-l-4 border-gray-500 text-gray-400 rounded p-4 cursor-pointer hover:bg-slate-700 transition-colors'
          onClick={() =>
            window.mostrarHistoricoMembro &&
            window.mostrarHistoricoMembro(membro.id)
          }
        >
          <div className='font-semibold text-white mb-1'>📜 Histórico</div>
          <div className='text-sm text-gray-400'>Registros anteriores</div>
        </div>
      ) : null}
      <div className='space-y-3 mt-4'>
        {eventosParticipados.length === 0 &&
        (!membro.historico || membro.historico.trim() === '') ? (
          <p className='text-gray-500 text-center py-8'>
            Nenhuma missão registrada
          </p>
        ) : (
          eventosParticipados.map((ep) => {
            const dataFormatada = new Date(
              ep.data + 'T00:00:00'
            ).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const cores = {
              treinamento: 'border-green-500 text-green-400',
              missao: 'border-yellow-500 text-yellow-400',
              operacao: 'border-orange-500 text-orange-400',
              'mega-operacao': 'border-red-500 text-red-400',
              campanha: 'border-purple-500 text-purple-400',
              outro: 'border-blue-500 text-blue-400',
            };
            const cor = cores[ep.categoria] || 'border-gray-500 text-gray-400';
            return (
              <div
                key={ep.eventoId}
                className={`bg-slate-800 border-l-4 ${cor} rounded p-4 cursor-pointer hover:bg-slate-700 transition-colors`}
                onClick={() => onShowDetalheMissao(ep.eventoId)}
              >
                <div className='font-semibold text-white mb-1'>{ep.nome}</div>
                <div className='text-sm text-gray-400'>{dataFormatada}</div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function HistorySidebar({ membro, onClose }) {
  if (!membro || !membro.historico) return null;
  return (
    <aside className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 translate-x-0 transition-transform duration-300 z-50 overflow-y-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-bold text-gray-400'>📜 HISTÓRICO</h3>
        <button
          onClick={onClose}
          className='text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
      </div>
      <div className='space-y-6'>
        <div className='bg-slate-800 rounded-lg p-4 border border-gray-500'>
          <h4 className='text-sm text-gray-400 mb-3'>REGISTROS ANTERIORES</h4>
          <div className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {membro.historico}
          </div>
        </div>
        {membro.valorHistorico > 0 ? (
          <div className='bg-slate-800/50 border border-slate-700 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>
              Missões históricas registradas:
            </p>
            <p className='text-cyan-400 font-bold text-2xl'>
              {membro.valorHistorico}
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function MissionDetails({ evento, onClose }) {
  if (!evento) return null;
  const cores = {
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
  const cor = cores[evento.categoria] || cores.outro;
  const dataEvento = new Date(evento.data + 'T00:00:00');
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return (
    <aside className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 translate-x-0 transition-transform duration-300 z-50 overflow-y-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-bold text-cyan-400'>DETALHES DA MISSÃO</h3>
        <button
          onClick={onClose}
          className='text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
      </div>
      <div className='space-y-6'>
        <div>
          <span
            className={`inline-block px-3 py-1 ${cor.bg} text-slate-900 text-sm font-semibold rounded mb-3`}
          >
            {cor.nome}
          </span>
          {evento.finalizado ? (
            <span className='ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded'>
              ✓ FINALIZADO
            </span>
          ) : null}
          <h3 className='text-2xl font-bold text-white'>{evento.nome}</h3>
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
          <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {evento.descricao}
          </p>
        </div>
        <div className='border-t border-slate-700 pt-4'>
          <h4 className='text-sm text-gray-400 mb-3'>
            PARTICIPANTES ({evento.participantes?.length || 0})
          </h4>
          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {evento.participantes && evento.participantes.length > 0 ? (
              evento.participantes.map((p) => (
                <div
                  key={p.id}
                  className='bg-slate-800 rounded px-3 py-2 text-gray-300 text-sm flex items-center gap-2'
                >
                  <img
                    src={p.foto}
                    alt={p.nome}
                    className='w-8 h-8 rounded-full'
                  />{' '}
                  <span>{p.nome}</span>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-sm'>
                Nenhum participante registrado
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// Public API functions mounting react components
export function mostrarMedalhasMembro(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;
  mountReact(
    () => (
      <MedalSidebar
        membro={membro}
        onClose={() => fecharMedalhasSidebar()}
        onShowDetalhe={(medalhaId, tipo, obs) => {
          mostrarDetalhesMedalha(membroId, medalhaId, tipo, obs);
        }}
      />
    ),
    'medalhas-membro-root'
  );
}

export function fecharMedalhasSidebar() {
  unmount('medalhas-membro-root');
}

export function mostrarDetalhesMedalha(membroId, medalhaId, tipo, observacoes) {
  // If membroId provided, try to find observation text if not passed
  let obs = observacoes;
  if (!obs && membroId && medalhaId) {
    const membrosData = JSON.parse(
      localStorage.getItem('strykers_membros') || '[]'
    );
    const membro = membrosData.find((m) => m.id === membroId);
    const medalha = membro?.medalhasDetalhadas?.find((x) => x.id === medalhaId);
    obs = medalha?.observacoes || '';
  }
  const tipoToUse =
    tipo ||
    (medalhaId
      ? (function () {
          const membrosData = JSON.parse(
            localStorage.getItem('strykers_membros') || '[]'
          );
          const m = membrosData.find((mm) => mm.id === membroId);
          return m?.medalhasDetalhadas?.find((x) => x.id === medalhaId)?.tipo;
        })()
      : undefined);
  const medalha = getMedalhaInfo(tipoToUse);
  mountReact(
    () => (
      <MedalModal
        medalha={medalha}
        observacoes={obs}
        onClose={() => fecharModalMedalha()}
      />
    ),
    'modal-medalha-root'
  );
}

export function fecharModalMedalha() {
  unmount('modal-medalha-root');
}

export function mostrarMissoesMembro(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;
  mountReact(
    () => (
      <MissaoSidebar
        membro={membro}
        onClose={() => fecharMissoesSidebar()}
        onShowDetalheMissao={(eventoId) =>
          mostrarDetalhesMissaoDoEvento(eventoId)
        }
      />
    ),
    'missoes-membro-root'
  );
}

export function fecharMissoesSidebar() {
  unmount('missoes-membro-root');
}

export function mostrarHistoricoMembro(membroId) {
  const membrosData = JSON.parse(
    localStorage.getItem('strykers_membros') || '[]'
  );
  const membro = membrosData.find((m) => m.id === membroId);
  if (!membro) return;
  mountReact(
    () => (
      <HistorySidebar membro={membro} onClose={() => fecharHistoricoMembro()} />
    ),
    'historico-membro-root'
  );
}

export function fecharHistoricoMembro() {
  unmount('historico-membro-root');
}

export function mostrarDetalhesMissaoDoEvento(eventoId) {
  const eventos = JSON.parse(localStorage.getItem('strykers_eventos') || '[]');
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) {
    alert('Evento não encontrado');
    return;
  }
  mountReact(
    () => (
      <MissionDetails evento={evento} onClose={() => fecharDetalhesMissao()} />
    ),
    'detalhes-missao-root'
  );
}

export function fecharDetalhesMissao() {
  unmount('detalhes-missao-root');
}

export function mostrarDetalhesMedalhaPublic(tipo, observacoes) {
  const medalha = getMedalhaInfo(tipo);
  mountReact(
    () => (
      <MedalModal
        medalha={medalha}
        observacoes={observacoes}
        onClose={() => fecharModalMedalha()}
      />
    ),
    'modal-medalha-perfil-root'
  );
}

export function fecharModalMedalhaPublic() {
  unmount('modal-medalha-perfil-root');
}
