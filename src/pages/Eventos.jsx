import React, { useEffect, useMemo, useState } from 'react';
import Calendario from '../components/ui/Calendario.jsx';

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

function carregarEventos() {
  try {
    return JSON.parse(localStorage.getItem('strykers_eventos') || '[]');
  } catch {
    return [];
  }
}

function salvarEventosNoStorage(evts) {
  localStorage.setItem('strykers_eventos', JSON.stringify(evts));
}

export default function Eventos() {
  const [eventos, setEventos] = useState(() => carregarEventos());
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    // Bridge: expose legacy window functions as dispatchers so existing inline onclick attributes keep working
    window.mostrarDetalhesEvento = (id, modo = 'visualizacao') =>
      document.dispatchEvent(
        new CustomEvent('eventos:mostrarDetalhes', { detail: { id, modo } })
      );
    window.excluirEvento = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:excluirEvento', { detail: { id } })
      );
    window.finalizarEvento = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:finalizarEvento', { detail: { id } })
      );
    window.reabrirEvento = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:reabrirEvento', { detail: { id } })
      );
    window.abrirGerenciarParticipantes = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:abrirGerenciarParticipantes', {
          detail: { id },
        })
      );
    window.adicionarParticipante = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:adicionarParticipante', { detail: { id } })
      );
    window.removerParticipante = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:removerParticipante', { detail: { id } })
      );
    window.abrirFormularioEvento = () =>
      document.dispatchEvent(new CustomEvent('eventos:abrirFormulario'));
    window.editarEvento = (id) =>
      document.dispatchEvent(
        new CustomEvent('eventos:editarEvento', { detail: { id } })
      );

    // listeners
    function onMostrarDetalhes(e) {
      const { id } = e.detail || {};
      const found = eventos.find((ev) => ev.id === id);
      if (found) {
        setSelectedEvento(found);
        setShowDetails(true);
        setShowForm(false);
        setShowParticipants(false);
      }
    }

    function onAbrirFormulario() {
      setModoEdicao(false);
      setSelectedEvento(null);
      setShowForm(true);
      setShowDetails(false);
      setShowParticipants(false);
    }

    function onEditarEvento(e) {
      const { id } = e.detail || {};
      const found = eventos.find((ev) => ev.id === id);
      if (found) {
        setModoEdicao(true);
        setSelectedEvento(found);
        setShowForm(true);
        setShowDetails(false);
        setShowParticipants(false);
      }
    }

    function onExcluirEvento(e) {
      const { id } = e.detail || {};
      if (!confirm('⚠️ Tem certeza que deseja excluir este evento?')) return;
      const updated = eventos.filter((ev) => ev.id !== id);
      setEventos(updated);
      salvarEventosNoStorage(updated);
      setShowDetails(false);
      alert('✅ Evento excluído com sucesso!');
    }

    function onFinalizarEvento(e) {
      const { id } = e.detail || {};
      if (
        !confirm(
          '⚠️ Tem certeza que deseja FINALIZAR este evento?\\n\\n✅ As missões serão contabilizadas para os participantes'
        )
      )
        return;
      const updated = eventos.map((ev) => {
        if (ev.id === id) return { ...ev, finalizado: true };
        return ev;
      });
      // update members' eventosParticipados
      const evento = updated.find((ev) => ev.id === id);
      if (evento && evento.participantes && evento.participantes.length > 0) {
        const membrosData = JSON.parse(
          localStorage.getItem('strykers_membros') || '[]'
        );
        evento.participantes.forEach((p) => {
          const idx = membrosData.findIndex((m) => m.id === p.id);
          if (idx !== -1) {
            membrosData[idx].eventosParticipados =
              membrosData[idx].eventosParticipados || [];
            membrosData[idx].eventosParticipados.push({
              eventoId: evento.id,
              nome: evento.nome,
              data: evento.data,
              categoria: evento.categoria,
            });
            membrosData[idx].missoes =
              membrosData[idx].eventosParticipados.length;
          }
        });
        localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
      }
      setEventos(updated);
      salvarEventosNoStorage(updated);
      alert(
        '✅ Evento finalizado! Missões contabilizadas para os participantes.'
      );
    }

    function onReabrirEvento(e) {
      const { id } = e.detail || {};
      if (
        !confirm(
          '⚠️ Tem certeza que deseja REABRIR este evento?\\n\\n❌ As missões contabilizadas serão REMOVIDAS dos participantes'
        )
      )
        return;
      const updated = eventos.map((ev) =>
        ev.id === id ? { ...ev, finalizado: false } : ev
      );
      const evento = eventos.find((ev) => ev.id === id);
      if (evento && evento.participantes && evento.participantes.length > 0) {
        const membrosData = JSON.parse(
          localStorage.getItem('strykers_membros') || '[]'
        );
        evento.participantes.forEach((p) => {
          const idx = membrosData.findIndex((m) => m.id === p.id);
          if (idx !== -1) {
            membrosData[idx].eventosParticipados = (
              membrosData[idx].eventosParticipados || []
            ).filter((e) => e.eventoId !== evento.id);
            membrosData[idx].missoes =
              membrosData[idx].eventosParticipados.length;
          }
        });
        localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
      }
      setEventos(updated);
      salvarEventosNoStorage(updated);
      alert('✅ Evento reaberto! Missões removidas dos participantes.');
    }

    function onAbrirGerenciarParticipantes(e) {
      const { id } = e.detail || {};
      const found = eventos.find((ev) => ev.id === id);
      if (found) {
        setSelectedEvento(found);
        setShowParticipants(true);
        setShowDetails(false);
        setShowForm(false);
      }
    }

    function onAdicionarParticipante(e) {
      const membroId = e.detail?.id || e.detail; // some legacy calls pass id directly
      if (!selectedEvento || !membroId) return;
      const membrosData = JSON.parse(
        localStorage.getItem('strykers_membros') || '[]'
      );
      const membro = membrosData.find(
        (m) => m.id === membroId || m.id === String(membroId)
      );
      if (!membro) return;
      const updatedEventos = eventos.map((ev) => {
        if (ev.id === selectedEvento.id) {
          const participantes = ev.participantes ? [...ev.participantes] : [];
          participantes.push({
            id: membro.id,
            nome: membro.nome,
            foto: membro.foto,
            patente: membro.patente,
          });
          return { ...ev, participantes };
        }
        return ev;
      });
      setEventos(updatedEventos);
      salvarEventosNoStorage(updatedEventos);
      // refresh selectedEvento
      const refreshed = updatedEventos.find(
        (ev) => ev.id === selectedEvento.id
      );
      setSelectedEvento(refreshed);
    }

    function onRemoverParticipante(e) {
      const membroId = e.detail?.id || e.detail;
      if (!selectedEvento || !membroId) return;
      const updatedEventos = eventos.map((ev) => {
        if (ev.id === selectedEvento.id) {
          const participantes = (ev.participantes || []).filter(
            (p) => p.id !== membroId
          );
          return { ...ev, participantes };
        }
        return ev;
      });
      setEventos(updatedEventos);
      salvarEventosNoStorage(updatedEventos);
      const refreshed = updatedEventos.find(
        (ev) => ev.id === selectedEvento.id
      );
      setSelectedEvento(refreshed);
    }

    // Attach
    document.addEventListener('eventos:mostrarDetalhes', onMostrarDetalhes);
    document.addEventListener('eventos:abrirFormulario', onAbrirFormulario);
    document.addEventListener('eventos:editarEvento', onEditarEvento);
    document.addEventListener('eventos:excluirEvento', onExcluirEvento);
    document.addEventListener('eventos:finalizarEvento', onFinalizarEvento);
    document.addEventListener('eventos:reabrirEvento', onReabrirEvento);
    document.addEventListener(
      'eventos:abrirGerenciarParticipantes',
      onAbrirGerenciarParticipantes
    );
    document.addEventListener(
      'eventos:adicionarParticipante',
      onAdicionarParticipante
    );
    document.addEventListener(
      'eventos:removerParticipante',
      onRemoverParticipante
    );

    return () => {
      // cleanup listeners
      document.removeEventListener(
        'eventos:mostrarDetalhes',
        onMostrarDetalhes
      );
      document.removeEventListener(
        'eventos:abrirFormulario',
        onAbrirFormulario
      );
      document.removeEventListener('eventos:editarEvento', onEditarEvento);
      document.removeEventListener('eventos:excluirEvento', onExcluirEvento);
      document.removeEventListener(
        'eventos:finalizarEvento',
        onFinalizarEvento
      );
      document.removeEventListener('eventos:reabrirEvento', onReabrirEvento);
      document.removeEventListener(
        'eventos:abrirGerenciarParticipantes',
        onAbrirGerenciarParticipantes
      );
      document.removeEventListener(
        'eventos:adicionarParticipante',
        onAdicionarParticipante
      );
      document.removeEventListener(
        'eventos:removerParticipante',
        onRemoverParticipante
      );
    };
  }, [eventos, selectedEvento]);

  useEffect(() => {
    // keep events synced if localStorage changed externally
    function onStorage() {
      setEventos(carregarEventos());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const proximoEvento = useMemo(() => {
    const agora = new Date();
    const futuros = eventos
      .filter((e) => new Date(`${e.data}T${e.horario}`) > agora)
      .sort(
        (a, b) =>
          new Date(`${a.data}T${a.horario}`) -
          new Date(`${b.data}T${b.horario}`)
      );
    return futuros[0] || null;
  }, [eventos]);

  function handleSubmitEvento(formData) {
    if (modoEdicao && selectedEvento) {
      const updated = eventos.map((ev) =>
        ev.id === selectedEvento.id ? { ...ev, ...formData } : ev
      );
      setEventos(updated);
      salvarEventosNoStorage(updated);
      setModoEdicao(false);
      setShowForm(false);
      alert('✅ Evento atualizado com sucesso!');
    } else {
      const novo = {
        id: Date.now(),
        participantes: [],
        finalizado: false,
        ...formData,
      };
      const updated = [...eventos, novo];
      setEventos(updated);
      salvarEventosNoStorage(updated);
      setShowForm(false);
      alert('✅ Evento cadastrado com sucesso!');
    }
  }

  // Small subcomponents
  function NextEventCard({ evento }) {
    if (!evento)
      return (
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center'>
          <p className='text-gray-400'>Nenhum evento agendado</p>
        </div>
      );
    const cores = CATEGORIAS_CORES[evento.categoria] || CATEGORIAS_CORES.outro;
    const dataEvento = new Date(evento.data + 'T00:00:00');
    const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const dataHoraEvento = new Date(`${evento.data}T${evento.horario}`);
    const diff = dataHoraEvento - new Date();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let tempoRestante = '';
    if (horas > 24) {
      const dias = Math.floor(horas / 24);
      tempoRestante = `Em ${dias} dia${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) tempoRestante = `Em ${horas}h ${minutos}min`;
    else tempoRestante = `Em ${minutos} minutos`;

    return (
      <div
        className={`bg-slate-800/60 backdrop-blur-sm border-l-4 ${cores.border} border-t border-r border-b border-slate-700 rounded-lg p-6`}
      >
        <div className='flex justify-between items-start mb-4'>
          <div>
            <span
              className={`inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-2`}
            >
              {cores.nome}
            </span>
            <h3 className='text-2xl font-bold text-white'>{evento.nome}</h3>
          </div>
          <span className='bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full'>
            {tempoRestante}
          </span>
        </div>
        <div className='flex items-center gap-6 text-gray-300 mb-3'>
          <div className='flex items-center gap-2'>
            <span className='text-cyan-400'>📅</span>
            <span>{dataFormatada}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-cyan-400'>🕐</span>
            <span>{evento.horario}</span>
          </div>
        </div>
        <p className='text-gray-400 line-clamp-2'>{evento.descricao}</p>
      </div>
    );
  }

  function FormSidebar({ open, onClose, onSubmit, initial }) {
    const [nome, setNome] = useState(initial?.nome || '');
    const [categoria, setCategoria] = useState(initial?.categoria || '');
    const [data, setData] = useState(initial?.data || '');
    const [horario, setHorario] = useState(initial?.horario || '');
    const [descricao, setDescricao] = useState(initial?.descricao || '');

    useEffect(() => {
      setNome(initial?.nome || '');
      setCategoria(initial?.categoria || '');
      setData(initial?.data || '');
      setHorario(initial?.horario || '');
      setDescricao(initial?.descricao || '');
    }, [initial]);

    if (!open) return null;
    return (
      <aside
        id='evento-sidebar'
        className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-0 transition-transform duration-300 z-50 overflow-y-auto'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3
              className='text-2xl font-bold text-cyan-400'
              id='sidebar-titulo'
            >
              {modoEdicao ? 'EDITAR EVENTO' : 'CADASTRAR EVENTO'}
            </h3>
            <button
              id='close-evento-sidebar'
              className='text-gray-400 hover:text-white text-2xl'
              onClick={() => {
                onClose();
              }}
            >
              {'×'}
            </button>
          </div>

          <form
            id='form-evento'
            className='space-y-6'
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({ nome, categoria, data, horario, descricao });
            }}
          >
            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                NOME DO EVENTO *
              </label>
              <input
                type='text'
                id='evento-nome'
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
                placeholder='Ex: Treinamento de Combate CQB'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                CATEGORIA *
              </label>
              <select
                id='evento-categoria'
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value=''>Selecione uma categoria</option>
                <option value='treinamento'>Treinamento</option>
                <option value='missao'>Missão</option>
                <option value='operacao'>Operação</option>
                <option value='mega-operacao'>Mega Operação</option>
                <option value='campanha'>Campanha</option>
                <option value='outro'>Outro</option>
              </select>
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-2'>DATA *</label>
              <input
                type='date'
                id='evento-data'
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                HORÁRIO *
              </label>
              <input
                type='time'
                id='evento-horario'
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                DESCRIÇÃO *
              </label>
              <textarea
                id='evento-descricao'
                required
                rows='6'
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 resize-none'
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <div className='flex gap-4'>
              <button
                type='submit'
                className='flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3'
              >
                {modoEdicao ? '✏️ Atualizar' : '✔ Registrar'}
              </button>
              <button
                type='button'
                id='btn-limpar-form'
                onClick={() => {
                  setNome('');
                  setCategoria('');
                  setData('');
                  setHorario('');
                  setDescricao('');
                }}
                className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3'
              >
                🗑 Limpar
              </button>
            </div>
          </form>
        </div>
      </aside>
    );
  }

  function DetailsSidebar({ open, evento, onClose }) {
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
      <aside
        id='detalhes-evento-sidebar'
        className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 translate-x-0 transition-transform duration-300 z-50 overflow-y-auto'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-cyan-400'>
              DETALHES DO EVENTO
            </h3>
            <button
              id='close-detalhes-sidebar'
              className='text-gray-400 hover:text-white text-2xl'
              onClick={() => onClose()}
            >
              {'×'}
            </button>
          </div>
          <div id='detalhes-evento-content' className='space-y-6'>
            <div>
              <span
                className={`inline-block px-3 py-1 ${cores.bg} text-slate-900 text-sm font-semibold rounded mb-3`}
              >
                {cores.nome}
              </span>
              {evento.finalizado ? (
                <span className='ml-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded'>
                  ✓ FINALIZADO
                </span>
              ) : null}
              <h3 className='text-3xl font-bold text-white'>{evento.nome}</h3>
            </div>
            <div className='border-t border-slate-700 pt-4'>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-cyan-400'>📅</span>
                <span className='text-gray-300 capitalize'>
                  {dataFormatada}
                </span>
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
              <div className='flex justify-between items-center mb-3'>
                <h4 className='text-sm text-gray-400'>
                  PARTICIPANTES ({evento.participantes?.length || 0})
                </h4>
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
            {/* REMOVIDO: Todos os botões de ação (Finalizar, Editar, Excluir, Reabrir, Gerenciar) */}
          </div>
        </div>
      </aside>
    );
  }

  function ParticipantsSidebar({ open, evento, onClose }) {
    const membrosData = JSON.parse(
      localStorage.getItem('strykers_membros') || '[]'
    );
    const membrosAtivos = membrosData.filter((m) => m.situacao === 'Ativo');
    const participantesIds = evento?.participantes?.map((p) => p.id) || [];
    const disponiveis = membrosAtivos.filter(
      (m) => !participantesIds.includes(m.id)
    );

    if (!open || !evento) return null;
    return (
      <aside
        id='participantes-evento-sidebar'
        className='fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 -translate-x-0 transition-transform duration-300 z-50 overflow-y-auto'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-cyan-400'>
              GERENCIAR PARTICIPANTES
            </h3>
            <button
              id='close-participantes-sidebar'
              className='text-gray-400 hover:text-white text-2xl'
              onClick={() => onClose()}
            >
              {'×'}
            </button>
          </div>

          <div className='mb-6'>
            <h4 className='text-sm text-gray-400 mb-3'>
              PARTICIPANTES ADICIONADOS
            </h4>
            <div
              id='lista-participantes-evento'
              className='space-y-2 max-h-60 overflow-y-auto'
            >
              {evento.participantes && evento.participantes.length > 0 ? (
                evento.participantes.map((p) => (
                  <div
                    key={p.id}
                    className='bg-slate-800 rounded px-4 py-3 flex items-center justify-between gap-3'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src={p.foto}
                        alt={p.nome}
                        className='w-10 h-10 rounded-full'
                      />
                      <div>
                        <div className='text-white font-semibold'>{p.nome}</div>
                        <div className='text-gray-400 text-sm'>{p.patente}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => window.removerParticipante(p.id)}
                      className='text-red-400 hover:text-red-300 text-xl'
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-center py-4'>
                  Nenhum participante adicionado
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className='text-sm text-gray-400 mb-3'>ADICIONAR MEMBRO</h4>
            <input
              type='text'
              id='search-membro-participante'
              placeholder='Buscar membro ativo...'
              className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 mb-3'
            />
            <div
              id='lista-membros-disponiveis'
              className='space-y-2 max-h-96 overflow-y-auto'
            >
              {disponiveis.length > 0 ? (
                disponiveis.map((m) => (
                  <div
                    key={m.id}
                    className='membro-item bg-slate-800 hover:bg-slate-700 rounded px-4 py-3 cursor-pointer transition-colors flex items-center gap-3'
                    onClick={() => window.adicionarParticipante(m.id)}
                    data-nome={m.nome.toLowerCase()}
                  >
                    <img
                      src={m.foto}
                      alt={m.nome}
                      className='w-10 h-10 rounded-full'
                    />
                    <div>
                      <div className='text-white font-semibold'>{m.nome}</div>
                      <div className='text-gray-400 text-sm'>{m.patente}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-center py-4'>
                  Todos os membros ativos já foram adicionados
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // main render
  return (
    <main className='relative z-10 container mx-auto px-6 py-16'>
      <div className='mb-8'>
        <h2 className='text-4xl font-bold text-white mb-2 tracking-wide'>
          EVENTOS
        </h2>
        <p className='text-gray-400'>Programação de operações e treinamentos</p>
      </div>

      <div className='mb-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <div className='mb-6 flex justify-between items-center'>
            <h3 className='text-2xl font-bold text-white'>Calendário</h3>
            <button
              id='btn-novo-evento'
              onClick={() => window.abrirFormularioEvento()}
              className='hidden'
            >
              ➕ Cadastrar Evento
            </button>
          </div>

          <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6'>
            <Calendario modo='visualizacao' />
          </div>
        </div>

        <div>
          <div id='proximo-evento-card' className='mb-6'>
            <NextEventCard evento={proximoEvento} />
          </div>
        </div>
      </div>

      <FormSidebar
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitEvento}
        initial={selectedEvento}
      />
      <DetailsSidebar
        open={showDetails}
        evento={selectedEvento}
        onClose={() => setShowDetails(false)}
      />
      <ParticipantsSidebar
        open={showParticipants}
        evento={selectedEvento}
        onClose={() => setShowParticipants(false)}
      />

      <div
        id='eventos-overlay'
        className={`fixed inset-0 bg-black/50 z-40 ${
          showForm || showDetails || showParticipants ? '' : 'hidden'
        }`}
        onClick={() => {
          setShowForm(false);
          setShowDetails(false);
          setShowParticipants(false);
        }}
      />
    </main>
  );
}
