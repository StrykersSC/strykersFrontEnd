import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import medalhas from '../constants/medalhas.js';
import {
  mostrarDetalhesMedalhaPublic,
  mostrarDetalhesMissaoDoEvento,
} from '../components/ui/MembrosUtils.jsx';

function getMedalhaInfo(tipo) {
  return (
    medalhas[tipo] || {
      imagem: '',
      nome: 'Medalha Desconhecida',
      descricao: '',
    }
  );
}

function getCoresCategoria(categoria) {
  const CORES = {
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
  return CORES[categoria] || CORES.outro;
}

export default function Perfil() {
  const { usuarioAtual, isLoading } = useAuth();
  const navigate = useNavigate();
  const [membro, setMembro] = useState(null);

  useEffect(() => {
    if (!isLoading && !usuarioAtual) {
      navigate('/');
      return;
    }

    if (usuarioAtual) {
      const membrosData = JSON.parse(
        localStorage.getItem('strykers_membros') || '[]'
      );

      // ✅ Buscar por usuarioId ao invés de nome
      const found = membrosData.find((m) => m.usuarioId === usuarioAtual.id);
      setMembro(found || null);
    }
  }, [usuarioAtual, isLoading, navigate]);

  if (isLoading)
    return (
      <div className='relative z-10 container mx-auto px-6 py-16 text-center'>
        <p className='text-gray-400'>Carregando...</p>
      </div>
    );

  if (!membro) {
    return (
      <main className='relative z-10 container mx-auto px-6 py-16 text-center'>
        <p className='text-gray-400 text-xl mb-4'>
          ⚠️ Você não tem registro de membro na organização ainda.
        </p>
        <p className='text-gray-400 mb-6'>
          Solicite aprovação do administrador acessando a página de
          Recrutamento.
        </p>
      </main>
    );
  }

  const totalMissoes =
    (membro.eventosParticipados?.length || 0) + (membro.valorHistorico || 0);

  return (
    <main className='relative z-10 container mx-auto px-6 py-16'>
      <div className='bg-slate-800/60 backdrop-blur-sm border-l-4 border-cyan-400 rounded-lg p-8 mb-8'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          <img
            src={membro.foto}
            alt={membro.nome}
            className='w-40 h-40 rounded-full object-cover border-4 border-cyan-400 shadow-lg'
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                membro.nome
              )}&background=0f172a&color=22d3ee&size=150`;
            }}
          />
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-5xl font-bold text-white mb-2'>
              {membro.nome}
            </h1>
            <p className='text-3xl text-cyan-400 font-semibold mb-4'>
              {membro.patente}
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
              <div className='bg-slate-900/50 rounded p-3'>
                <p className='text-gray-400 text-xs uppercase'>Atribuição</p>
                <p className='text-white font-semibold'>{membro.atribuicao}</p>
              </div>
              <div className='bg-slate-900/50 rounded p-3'>
                <p className='text-gray-400 text-xs uppercase'>Registro</p>
                <p className='text-white font-semibold'>
                  {new Date(
                    membro.dataRegistro + 'T00:00:00'
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className='bg-slate-900/50 rounded p-3'>
                <p className='text-gray-400 text-xs uppercase'>Situação</p>
                <p className='text-white font-semibold'>{membro.situacao}</p>
              </div>
              <div className='bg-slate-900/50 rounded p-3'>
                <p className='text-gray-400 text-xs uppercase'>
                  Força Especial
                </p>
                <p className='text-white font-semibold'>
                  {membro.forcaEspecial}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {membro.observacoes && (
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold text-cyan-400 mb-4'>
            📋 OBSERVAÇÕES
          </h2>
          <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {membro.observacoes}
          </p>
        </div>
      )}

      {membro.historico && (
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold text-cyan-400 mb-4'>
            📜 HISTÓRICO
          </h2>
          <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {membro.historico}
          </p>
          {membro.valorHistorico > 0 && (
            <div className='mt-4 bg-slate-900/50 rounded p-3 inline-block'>
              <p className='text-gray-400 text-sm'>
                Missões históricas:{' '}
                <span className='text-cyan-400 font-bold text-lg'>
                  {membro.valorHistorico}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-cyan-400 mb-4'>
            📊 ESTATÍSTICAS
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Total de Missões:</span>
              <span className='text-cyan-400 font-bold text-2xl'>
                {totalMissoes}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Medalhas:</span>
              <span className='text-yellow-400 font-bold text-2xl'>
                {membro.medalhas || 0}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-cyan-400 mb-4'>
            ℹ️ INFORMAÇÕES
          </h2>
          <div className='space-y-2 text-gray-300'>
            <p>
              <span className='text-gray-400'>ID do Membro:</span> {membro.id}
            </p>
            <p>
              <span className='text-gray-400'>Data de Registro:</span>{' '}
              {new Date(membro.dataRegistro + 'T00:00:00').toLocaleDateString(
                'pt-BR',
                {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h2 className='text-2xl font-bold text-cyan-400 mb-6'>
          🏅 CONDECORAÇÕES
        </h2>
        {membro.medalhasDetalhadas && membro.medalhasDetalhadas.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {membro.medalhasDetalhadas.map((m) => {
              const medalhaInfo = getMedalhaInfo(m.tipo);
              return (
                <div
                  key={m.id}
                  className='bg-slate-900/50 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-700/50 transition-all transform hover:scale-105'
                  onClick={() =>
                    mostrarDetalhesMedalhaPublic(m.tipo, m.observacoes || '')
                  }
                >
                  <img
                    src={medalhaInfo.imagem}
                    alt={medalhaInfo.nome}
                    className='w-20 h-20 mx-auto mb-3 object-contain'
                  />
                  <h3 className='text-white font-semibold text-sm mb-1'>
                    {medalhaInfo.nome}
                  </h3>
                  <p className='text-gray-400 text-xs'>
                    {new Date(m.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-gray-400 text-center py-8'>
            Nenhuma condecoração ainda
          </p>
        )}
      </div>

      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-cyan-400 mb-6'>
          🎯 MISSÕES PARTICIPADAS
        </h2>
        {membro.eventosParticipados && membro.eventosParticipados.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {membro.eventosParticipados.map((ep) => {
              const cores = getCoresCategoria(ep.categoria);
              const dataFormatada = new Date(
                ep.data + 'T00:00:00'
              ).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <div
                  key={ep.eventoId + '-' + ep.nome}
                  className={`bg-slate-900/50 border-l-4 ${cores.border} rounded p-4 cursor-pointer hover:bg-slate-700/50 transition-all`}
                  onClick={() => mostrarDetalhesMissaoDoEvento(ep.eventoId)}
                >
                  <h3 className='text-white font-semibold mb-2 line-clamp-2'>
                    {ep.nome}
                  </h3>
                  <div className='flex items-center justify-between'>
                    <span className={`text-xs ${cores.text}`}>
                      {cores.nome}
                    </span>
                    <span className='text-gray-400 text-xs'>
                      {dataFormatada}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-gray-400 text-center py-8'>
            Nenhuma missão participada ainda
          </p>
        )}
      </div>
    </main>
  );
}
