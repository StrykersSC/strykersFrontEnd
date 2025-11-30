import React, { useEffect, useMemo, useState } from 'react';
import {
  mostrarMedalhasMembro,
  mostrarMissoesMembro,
} from '../components/membros-utils.js';

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('pt-BR');
  } catch {
    return d;
  }
}

export default function Membros() {
  const [membros, setMembros] = useState([]);
  const [search, setSearch] = useState('');
  const [patenteFilter, setPatenteFilter] = useState('');
  const [situacaoFilter, setSituacaoFilter] = useState('');
  const [sortField, setSortField] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('strykers_membros');
    const data = raw ? JSON.parse(raw) : [];
    setMembros(data);
  }, []);

  const patentes = useMemo(() => {
    const set = new Set(membros.map((m) => m.patente).filter(Boolean));
    return Array.from(set).sort();
  }, [membros]);

  const filtered = useMemo(() => {
    let data = membros.slice();
    if (search) {
      const s = search.toLowerCase();
      data = data.filter((m) => (m.nome || '').toLowerCase().includes(s));
    }
    if (patenteFilter) data = data.filter((m) => m.patente === patenteFilter);
    if (situacaoFilter)
      data = data.filter((m) => m.situacao === situacaoFilter);

    if (sortField) {
      data.sort((a, b) => {
        if (sortField === 'dataRegistro')
          return new Date(a.dataRegistro) - new Date(b.dataRegistro);
        if (typeof a[sortField] === 'number')
          return a[sortField] - b[sortField];
        return (a[sortField] || '')
          .toString()
          .localeCompare((b[sortField] || '').toString());
      });
    }

    return data;
  }, [membros, search, patenteFilter, situacaoFilter, sortField]);

  function clearFilters() {
    setSearch('');
    setPatenteFilter('');
    setSituacaoFilter('');
  }

  function toggleSort(field) {
    setSortField((cur) => (cur === field ? null : field));
  }

  function openDetails(m) {
    setSelected(m);
  }

  function closeDetails() {
    setSelected(null);
  }

  return (
    <div className='relative z-10 container mx-auto px-6 py-16'>
      <div className='mb-8 flex justify-between items-center flex-wrap gap-4'>
        <div>
          <h2 className='text-4xl font-bold text-white mb-2 tracking-wide'>
            MEMBROS
          </h2>
          <p className='text-cyan-400 text-xl' id='total-membros'>
            Total: {membros.length} membros
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowEdit(true)}
            className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-4 py-2'
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          <div className='md:col-span-2'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              id='search-input'
              placeholder='Pesquisar por nome...'
              className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400'
            />
          </div>

          <select
            id='filter-patente'
            value={patenteFilter}
            onChange={(e) => setPatenteFilter(e.target.value)}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400'
          >
            <option value=''>Todas as Patentes</option>
            {patentes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            id='filter-situacao'
            value={situacaoFilter}
            onChange={(e) => setSituacaoFilter(e.target.value)}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400'
          >
            <option value=''>Todas as Situações</option>
            <option value='Ativo'>Ativo</option>
            <option value='Reservista'>Reservista</option>
            <option value='Desertor'>Desertor</option>
          </select>

          <button
            id='clear-filters'
            onClick={clearFilters}
            className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-4 py-2 transition-colors'
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden'>
        <div className='overflow-x-auto max-h-[600px] overflow-y-auto'>
          <table className='w-full'>
            <thead className='bg-slate-900 sticky top-0 z-10'>
              <tr className='text-left text-cyan-400 font-semibold'>
                <th
                  onClick={() => toggleSort('patente')}
                  className='px-6 py-4 cursor-pointer hover:text-cyan-300'
                  data-sort='patente'
                >
                  PATENTE
                </th>
                <th
                  onClick={() => toggleSort('nome')}
                  className='px-6 py-4 cursor-pointer hover:text-cyan-300'
                  data-sort='nome'
                >
                  NOME
                </th>
                <th className='px-6 py-4 text-center'>MEDALHAS</th>
                <th className='px-6 py-4 text-center'>MISSÕES</th>
                <th className='px-6 py-4 text-center'>FORÇA ESPECIAL</th>
                <th
                  onClick={() => toggleSort('dataRegistro')}
                  className='px-6 py-4 cursor-pointer hover:text-cyan-300'
                  data-sort='dataRegistro'
                >
                  DATA REGISTRO
                </th>
                <th
                  onClick={() => toggleSort('situacao')}
                  className='px-6 py-4 cursor-pointer hover:text-cyan-300'
                  data-sort='situacao'
                >
                  SITUAÇÃO
                </th>
                <th className='px-6 py-4 text-center'>DETALHES</th>
              </tr>
            </thead>
            <tbody id='membros-tbody' className='text-gray-300'>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className='text-center py-8 text-gray-400'>
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((m, idx) => {
                  const totalMissoes =
                    (m.eventosParticipados?.length || 0) +
                    (m.valorHistorico || 0);
                  return (
                    <tr
                      key={m.id || idx}
                      className='border-b border-slate-700 hover:bg-slate-700/30 transition-colors'
                    >
                      <td className='px-6 py-4 font-semibold'>{m.patente}</td>
                      <td className='px-6 py-4'>{m.nome}</td>
                      <td className='px-6 py-4 text-center'>
                        {m.medalhas || 0}
                      </td>
                      <td className='px-6 py-4 text-center'>{totalMissoes}</td>
                      <td className='px-6 py-4 text-center'>
                        {m.forcaEspecial || 'Não'}
                      </td>
                      <td className='px-6 py-4'>
                        {formatDate(m.dataRegistro)}
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          m.situacao === 'Ativo'
                            ? 'text-green-400'
                            : m.situacao === 'Reservista'
                            ? 'text-yellow-400'
                            : m.situacao === 'Desertor'
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {m.situacao}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <button
                          onClick={() => openDetails(m)}
                          className='view-details text-cyan-400 hover:text-cyan-300 text-xl'
                        >
                          📋
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar Details */}
      {selected && (
        <aside
          id='member-details-sidebar'
          className='fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 transition-transform z-50 overflow-y-auto'
        >
          <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-2xl font-bold text-cyan-400'>
                DETALHES DO MEMBRO
              </h3>
              <button
                onClick={closeDetails}
                className='text-gray-400 hover:text-white text-2xl'
              >
                ×
              </button>
            </div>
            <div id='member-details-content'>
              <div className='space-y-6'>
                <div className='bg-slate-800 rounded-lg p-4 flex justify-center'>
                  <img
                    src={selected.foto}
                    alt={selected.nome}
                    className='w-32 h-32 rounded-full object-cover border-4 border-cyan-400'
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selected.nome
                      )}&background=0f172a&color=22d3ee&size=150`;
                    }}
                  />
                </div>

                <div className='space-y-4'>
                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>NOME</p>
                    <p className='text-white text-xl font-semibold'>
                      {selected.nome}
                    </p>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>PATENTE</p>
                    <p className='text-cyan-400 text-lg font-semibold'>
                      {selected.patente}
                    </p>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>ATRIBUIÇÃO</p>
                    <p className='text-white text-lg font-semibold'>
                      {selected.atribuicao || 'Não definida'}
                    </p>
                  </div>

                  <div className='grid grid-cols-2 gap-4 border-b border-slate-700 pb-3'>
                    <div
                      className='cursor-pointer hover:bg-slate-800/50 rounded p-2 transition-colors'
                      onClick={() =>
                        mostrarMedalhasMembro &&
                        mostrarMedalhasMembro(selected.id)
                      }
                    >
                      <p className='text-gray-400 text-sm'>MEDALHAS</p>
                      <p className='text-cyan-400 text-lg font-semibold hover:text-cyan-300'>
                        {selected.medalhas || 0} 👁️
                      </p>
                    </div>
                    <div
                      className='cursor-pointer hover:bg-slate-800/50 rounded p-2 transition-colors'
                      onClick={() =>
                        mostrarMissoesMembro &&
                        mostrarMissoesMembro(selected.id)
                      }
                    >
                      <p className='text-gray-400 text-sm'>MISSÕES</p>
                      <p className='text-cyan-400 text-lg font-semibold hover:text-cyan-300'>
                        {(selected.eventosParticipados?.length || 0) +
                          (selected.valorHistorico || 0)}{' '}
                        👁️
                      </p>
                    </div>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>DATA DE REGISTRO</p>
                    <p className='text-white'>
                      {formatDate(selected.dataRegistro)}
                    </p>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>SITUAÇÃO</p>
                    <p className='text-white'>{selected.situacao}</p>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm'>FORÇA ESPECIAL</p>
                    <p className='text-white'>{selected.forcaEspecial}</p>
                  </div>

                  <div className='border-b border-slate-700 pb-3'>
                    <p className='text-gray-400 text-sm mb-2'>OBSERVAÇÕES</p>
                    <p className='text-gray-300 text-sm leading-relaxed'>
                      {selected.observacoes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Overlay for sidebar */}
      {selected && (
        <div
          id='sidebar-overlay'
          onClick={closeDetails}
          className='fixed inset-0 bg-black/50 z-40'
        />
      )}

      {/* Edit/Add sidebar placeholder (not implemented fully yet) */}
      {showEdit && (
        <aside
          id='edit-member-sidebar'
          className='fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 transition-transform z-50 overflow-y-auto'
        >
          <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-2xl font-bold text-cyan-400'>
                ADICIONAR MEMBRO
              </h3>
              <button
                onClick={() => setShowEdit(false)}
                className='text-gray-400 hover:text-white text-2xl'
              >
                ×
              </button>
            </div>
            <p className='text-gray-400'>
              Formulário de criação ainda não implementado nesta etapa.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
