import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  mostrarMedalhasMembro,
  mostrarMissoesMembro,
} from '../components/ui/MembrosUtils.jsx';
import Calendario from '../components/ui/Calendario.jsx';
import {
  medalhas as MEDALHAS_DISPONIVEIS,
  patentes as PATENTES,
  forcasEspeciais as FORCAS_ESPECIAIS,
} from '../constants';

// Modal para exibir texto (observações/histórico)
function ModalTexto({ isOpen, titulo, conteudo, onClose }) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/70' onClick={onClose} />
      <div className='relative bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-white text-2xl'
        >
          ×
        </button>
        <h2 className='text-2xl font-bold text-cyan-400 mb-4'>{titulo}</h2>
        <div className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
          {conteudo}
        </div>
      </div>
    </div>
  );
}

function DetailsSidebarAdmin({ open, evento, onClose }) {
  if (!open || !evento) return null;

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
            onClick={() => onClose()}
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
            <div className='flex justify-between items-center mb-3'>
              <h4 className='text-sm text-gray-400'>
                PARTICIPANTES ({evento.participantes?.length || 0})
              </h4>
              {!evento.finalizado ? (
                <button
                  onClick={() => window.abrirGerenciarParticipantes(evento.id)}
                  className='bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded px-3 py-1'
                >
                  + Gerenciar
                </button>
              ) : null}
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
          <div className='pt-4'>
            <div className='space-y-2'>
              {!evento.finalizado ? (
                <>
                  <button
                    onClick={() => window.finalizarEvento(evento.id)}
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                  >
                    ✓ Finalizar Evento
                  </button>
                  <button
                    onClick={() => window.editarEvento(evento.id)}
                    className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded px-6 py-3 transition-colors'
                  >
                    ✏️ Editar Evento
                  </button>
                  <button
                    onClick={() => window.excluirEvento(evento.id)}
                    className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                  >
                    🗑 Excluir Evento
                  </button>
                </>
              ) : (
                <button
                  onClick={() => window.reabrirEvento(evento.id)}
                  className='w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                >
                  🔓 Reabrir Evento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const ATRIBUICOES = ['Infantaria', 'Força Aérea', 'Marinha'];

export default function Administracao() {
  const [pendentes, setPendentes] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_alistamentos_pendentes') || '[]')
  );
  const [recusados, setRecusados] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_alistamentos_recusados') || '[]')
  );
  const [membros, setMembros] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_membros') || '[]')
  );
  const [usuarios, setUsuarios] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_usuarios') || '[]')
  );

  const [filters, setFilters] = useState({
    search: '',
    patente: '',
    situacao: '',
    forca: '',
    data: '',
  });
  const [filteredMembros, setFilteredMembros] = useState(membros);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const [editingMember, setEditingMember] = useState(null);
  const [openCondecorar, setOpenCondecorar] = useState(null);
  const [condecorarTipo, setCondecorarTipo] = useState('');
  const [condecorarObs, setCondecorarObs] = useState('');
  const [modalTexto, setModalTexto] = useState({
    isOpen: false,
    titulo: '',
    conteudo: '',
  });
  const [removeCondecoracaoMembro, setRemoveCondecoracaoMembro] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      'strykers_alistamentos_pendentes',
      JSON.stringify(pendentes)
    );
  }, [pendentes]);

  useEffect(() => {
    localStorage.setItem(
      'strykers_alistamentos_recusados',
      JSON.stringify(recusados)
    );
  }, [recusados]);

  useEffect(() => {
    localStorage.setItem('strykers_membros', JSON.stringify(membros));
  }, [membros]);

  useEffect(() => {
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    const result = membros.filter((m) => {
      const s = filters.search.trim().toLowerCase();
      const matchNome = !s || (m.nome || '').toLowerCase().includes(s);
      const matchPatente = !filters.patente || m.patente === filters.patente;
      const matchSituacao =
        !filters.situacao || m.situacao === filters.situacao;
      const matchForca = !filters.forca || m.forcaEspecial === filters.forca;
      const matchData = !filters.data || m.dataRegistro === filters.data;
      return (
        matchNome && matchPatente && matchSituacao && matchForca && matchData
      );
    });
    setFilteredMembros(result);
  }, [membros, filters]);

  useEffect(() => {
    // Registrar funções globais para eventos
    window.finalizarEvento = (id) => {
      if (
        !confirm(
          '⚠️ Tem certeza que deseja FINALIZAR este evento?\n\n✅ As missões serão contabilizadas para os participantes'
        )
      )
        return;

      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const updated = eventos.map((ev) => {
        if (ev.id === id) return { ...ev, finalizado: true };
        return ev;
      });

      // Atualizar membros
      const evento = updated.find((ev) => ev.id === id);
      if (evento && evento.participantes && evento.participantes.length > 0) {
        setMembros((prevMembros) => {
          const novosMembros = [...prevMembros];
          evento.participantes.forEach((p) => {
            const idx = novosMembros.findIndex((m) => m.id === p.id);
            if (idx !== -1) {
              novosMembros[idx].eventosParticipados =
                novosMembros[idx].eventosParticipados || [];
              novosMembros[idx].eventosParticipados.push({
                eventoId: evento.id,
                nome: evento.nome,
                data: evento.data,
                categoria: evento.categoria,
              });
              novosMembros[idx].missoes =
                novosMembros[idx].eventosParticipados.length +
                (novosMembros[idx].valorHistorico || 0);
            }
          });
          return novosMembros;
        });
      }

      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      setSelectedEvento(updated.find((ev) => ev.id === id));
      alert(
        '✅ Evento finalizado! Missões contabilizadas para os participantes.'
      );
    };

    window.reabrirEvento = (id) => {
      if (
        !confirm(
          '⚠️ Tem certeza que deseja REABRIR este evento?\n\n❌ As missões contabilizadas serão REMOVIDAS dos participantes'
        )
      )
        return;

      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const evento = eventos.find((ev) => ev.id === id);
      const updated = eventos.map((ev) =>
        ev.id === id ? { ...ev, finalizado: false } : ev
      );

      if (evento && evento.participantes && evento.participantes.length > 0) {
        setMembros((prevMembros) => {
          const novosMembros = [...prevMembros];
          evento.participantes.forEach((p) => {
            const idx = novosMembros.findIndex((m) => m.id === p.id);
            if (idx !== -1) {
              novosMembros[idx].eventosParticipados = (
                novosMembros[idx].eventosParticipados || []
              ).filter((e) => e.eventoId !== evento.id);
              novosMembros[idx].missoes =
                novosMembros[idx].eventosParticipados.length +
                (novosMembros[idx].valorHistorico || 0);
            }
          });
          return novosMembros;
        });
      }

      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      setSelectedEvento(updated.find((ev) => ev.id === id));
      alert('✅ Evento reaberto! Missões removidas dos participantes.');
    };

    window.editarEvento = (id) => {
      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const evento = eventos.find((ev) => ev.id === id);
      if (!evento) return;

      // Preencher o formulário
      document.getElementById('evento-nome').value = evento.nome;
      document.getElementById('evento-categoria').value = evento.categoria;
      document.getElementById('evento-data').value = evento.data;
      document.getElementById('evento-horario').value = evento.horario;
      document.getElementById('evento-descricao').value = evento.descricao;

      // Atualizar título
      document.getElementById('sidebar-titulo').textContent = 'EDITAR EVENTO';

      // Modificar o form para modo edição
      const form = document.getElementById('form-evento');
      form.dataset.editId = id;

      // Abrir sidebar
      document
        .getElementById('evento-sidebar')
        .classList.remove('translate-x-full');
      setShowEventDetails(false);
    };

    window.excluirEvento = (id) => {
      if (!confirm('⚠️ Tem certeza que deseja excluir este evento?')) return;

      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const updated = eventos.filter((ev) => ev.id !== id);
      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      setShowEventDetails(false);
      alert('✅ Evento excluído com sucesso!');
    };

    window.abrirGerenciarParticipantes = (id) => {
      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const evento = eventos.find((ev) => ev.id === id);
      if (!evento) return;

      // Abrir sidebar de participantes
      const sidebar = document.getElementById(
        'participantes-evento-sidebar-admin'
      );
      if (sidebar) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.dataset.eventoId = id;

        // Atualizar lista de participantes
        atualizarListaParticipantes(evento);
      }
    };

    function atualizarListaParticipantes(evento) {
      const listaParticipantes = document.getElementById(
        'lista-participantes-evento-admin'
      );
      const listaMembros = document.getElementById(
        'lista-membros-disponiveis-admin'
      );

      if (!listaParticipantes || !listaMembros) return;

      // Renderizar participantes
      if (evento.participantes && evento.participantes.length > 0) {
        listaParticipantes.innerHTML = evento.participantes
          .map(
            (p) => `
        <div class="bg-slate-800 rounded px-4 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${p.foto}" alt="${p.nome}" class="w-10 h-10 rounded-full" />
            <div>
              <div class="text-white font-semibold">${p.nome}</div>
              <div class="text-gray-400 text-sm">${p.patente}</div>
            </div>
          </div>
          <button onclick="removerParticipanteAdmin('${p.id}')" class="text-red-400 hover:text-red-300 text-xl">×</button>
        </div>
      `
          )
          .join('');
      } else {
        listaParticipantes.innerHTML =
          '<p class="text-gray-500 text-center py-4">Nenhum participante adicionado</p>';
      }

      // Renderizar membros disponíveis
      const participantesIds = evento.participantes?.map((p) => p.id) || [];
      const membrosAtivos = membros.filter(
        (m) => m.situacao === 'Ativo' && !participantesIds.includes(m.id)
      );

      if (membrosAtivos.length > 0) {
        listaMembros.innerHTML = membrosAtivos
          .map(
            (m) => `
        <div class="membro-item bg-slate-800 hover:bg-slate-700 rounded px-4 py-3 cursor-pointer transition-colors flex items-center gap-3"
             onclick="adicionarParticipanteAdmin('${m.id}')"
             data-nome="${m.nome.toLowerCase()}">
          <img src="${m.foto}" alt="${m.nome}" class="w-10 h-10 rounded-full" />
          <div>
            <div class="text-white font-semibold">${m.nome}</div>
            <div class="text-gray-400 text-sm">${m.patente}</div>
          </div>
        </div>
      `
          )
          .join('');
      } else {
        listaMembros.innerHTML =
          '<p class="text-gray-500 text-center py-4">Todos os membros ativos já foram adicionados</p>';
      }
    }

    window.adicionarParticipanteAdmin = (membroId) => {
      const sidebar = document.getElementById(
        'participantes-evento-sidebar-admin'
      );
      const eventoId = parseInt(sidebar?.dataset.eventoId);
      if (!eventoId) return;

      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const membro = membros.find((m) => m.id === membroId);
      if (!membro) return;

      const updated = eventos.map((ev) => {
        if (ev.id === eventoId) {
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

      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      const eventoAtualizado = updated.find((ev) => ev.id === eventoId);
      atualizarListaParticipantes(eventoAtualizado);
    };

    window.removerParticipanteAdmin = (membroId) => {
      const sidebar = document.getElementById(
        'participantes-evento-sidebar-admin'
      );
      const eventoId = parseInt(sidebar?.dataset.eventoId);
      if (!eventoId) return;

      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const updated = eventos.map((ev) => {
        if (ev.id === eventoId) {
          const participantes = (ev.participantes || []).filter(
            (p) => p.id !== membroId
          );
          return { ...ev, participantes };
        }
        return ev;
      });

      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      const eventoAtualizado = updated.find((ev) => ev.id === eventoId);
      atualizarListaParticipantes(eventoAtualizado);
    };

    // Cleanup
    return () => {
      delete window.finalizarEvento;
      delete window.reabrirEvento;
      delete window.editarEvento;
      delete window.excluirEvento;
      delete window.abrirGerenciarParticipantes;
      delete window.adicionarParticipanteAdmin;
      delete window.removerParticipanteAdmin;
    };
  }, [membros, setMembros]);

  function aplicarFiltros(changes) {
    setFilters((f) => ({ ...f, ...changes }));
  }

  function limparFiltros() {
    setFilters({ search: '', patente: '', situacao: '', forca: '', data: '' });
  }

  function aprovarAlistamento(id) {
    if (!confirm('✅ Confirma a aprovação deste alistamento?')) return;
    const index = pendentes.findIndex((p) => p.id === id);
    if (index === -1) return;
    const alistamento = pendentes[index];
    const novoMembro = {
      id: alistamento.id + '-' + Date.now(),
      nome: alistamento.nome,
      foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        alistamento.nome
      )}&background=0f172a&color=22d3ee&size=150`,
      patente: 'Recruta',
      atribuicao: 'Infantaria',
      medalhas: 0,
      dataRegistro: new Date().toISOString().split('T')[0],
      situacao: 'Ativo',
      missoes: 0,
      forcaEspecial: 'Não',
      observacoes: '',
      eventosParticipados: [],
      historico: '',
      valorHistorico: 0,
      medalhasDetalhadas: [],
    };
    setMembros((prev) => [...prev, novoMembro]);
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id)
          return {
            ...u,
            status: 'aprovado',
            dataAprovacao: new Date().toISOString(),
          };
        return u;
      })
    );
    setPendentes((prev) => prev.filter((p) => p.id !== id));
    alert('✅ Alistamento aprovado! Membro adicionado ao sistema.');
  }

  function recusarAlistamento(id) {
    if (!confirm('❌ Confirma a recusa deste alistamento?')) return;
    const index = pendentes.findIndex((p) => p.id === id);
    if (index === -1) return;
    const alistamento = pendentes[index];
    const recus = { ...alistamento, dataRecusa: new Date().toISOString() };
    setRecusados((prev) => [...prev, recus]);
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id)
          return {
            ...u,
            status: 'recusado',
            dataRecusa: new Date().toISOString(),
          };
        return u;
      })
    );
    setPendentes((prev) => prev.filter((p) => p.id !== id));
    alert('❌ Alistamento recusado!');
  }

  function realistarUsuario(id) {
    if (
      !confirm(
        '🔄 Confirma que deseja dar uma segunda chance a este alistamento?'
      )
    )
      return;
    const index = recusados.findIndex((r) => r.id === id);
    if (index === -1) return;
    const alist = {
      ...recusados[index],
      dataSolicitacao: new Date().toISOString(),
    };
    setPendentes((prev) => [...prev, alist]);
    setRecusados((prev) => prev.filter((r) => r.id !== id));
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) return { ...u, status: 'aguardando_aprovacao' };
        return u;
      })
    );
    alert('✅ Alistamento devolvido para lista de pendentes!');
  }

  function excluirAlistamento(id) {
    if (
      !confirm(
        '⚠️ ATENÇÃO! Esta ação irá EXCLUIR PERMANENTEMENTE. Deseja continuar?'
      )
    )
      return;
    setRecusados((prev) => prev.filter((r) => r.id !== id));
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    alert('✅ Alistamento excluído permanentemente!');
  }

  function abrirEditarMembro(membroId) {
    const m = membros.find((mm) => mm.id === membroId);
    if (!m) return;
    setEditingMember({ ...m });
  }

  function salvarMembroEdicao(e) {
    e.preventDefault();
    if (!editingMember) return;

    // Atualizar membro em strykers_membros
    setMembros((prev) =>
      prev.map((m) => (m.id === editingMember.id ? editingMember : m))
    );

    // Atualizar usuário em strykers_usuarios se o nome foi alterado
    const membroAnterior = membros.find((m) => m.id === editingMember.id);
    if (membroAnterior && membroAnterior.nome !== editingMember.nome) {
      setUsuarios((prev) =>
        prev.map((u) => {
          if (u.nome === membroAnterior.nome && u.status === 'aprovado') {
            return { ...u, nome: editingMember.nome };
          }
          return u;
        })
      );
    }

    setEditingMember(null);
    alert('✅ Membro atualizado com sucesso!');
  }

  function excluirMembro(membroId) {
    if (!confirm('⚠️ Tem certeza que deseja remover este membro?')) return;
    const m = membros.find((mm) => mm.id === membroId);
    if (!m) return;
    const usuario = usuarios.find((u) => u.nome === m.nome);
    const rec = {
      id: usuario?.id || m.id,
      nome: m.nome,
      email: usuario?.email || '',
      whatsapp: usuario?.whatsapp || '',
      dataSolicitacao: m.dataRegistro,
      dataRecusa: new Date().toISOString(),
      usuarioCompleto: usuario,
    };
    setRecusados((prev) => [...prev, rec]);
    setMembros((prev) => prev.filter((x) => x.id !== membroId));

    // Atualizar status do usuário para 'recusado'
    if (usuario) {
      setUsuarios((prev) =>
        prev.map((u) => {
          if (u.id === usuario.id) {
            return {
              ...u,
              status: 'recusado',
              dataRecusa: new Date().toISOString(),
            };
          }
          return u;
        })
      );
    }

    alert('✅ Membro removido e movido para alistamentos recusados!');
  }

  function abrirCondecorar(membroId) {
    setOpenCondecorar(membroId);
    setCondecorarTipo('');
    setCondecorarObs('');
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  function salvarCondecoracao(e) {
    e.preventDefault();
    if (isSubmitting) return; // previne duplo submit
    setIsSubmitting(true);

    if (!openCondecorar || !condecorarTipo) {
      setIsSubmitting(false);
      return alert('Selecione uma medalha');
    }
    setMembros((prev) =>
      prev.map((m) => {
        if (m.id !== openCondecorar) return m;
        const nova = { ...m };
        if (!nova.medalhasDetalhadas) nova.medalhasDetalhadas = [];
        // Evita duplicidade exata
        const jaExiste = nova.medalhasDetalhadas.some(
          (md) =>
            md.tipo === condecorarTipo &&
            md.observacoes === condecorarObs &&
            md.data === new Date().toISOString().split('T')[0]
        );
        if (!jaExiste) {
          nova.medalhasDetalhadas.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            tipo: condecorarTipo,
            data: new Date().toISOString().split('T')[0],
            observacoes: condecorarObs,
          });
        }
        // Sempre atualiza o número de medalhas
        nova.medalhas = nova.medalhasDetalhadas.length;
        return nova;
      })
    );
    setOpenCondecorar(null);
    setIsSubmitting(false);
    alert('✅ Condecoração aplicada!');
  }

  function removerMedalha(membroId, medalhaId) {
    if (!confirm('⚠️ Confirma a remoção desta medalha?')) return;
    setMembros((prev) =>
      prev.map((m) => {
        if (m.id !== membroId) return m;
        const nova = { ...m };
        if (nova.medalhasDetalhadas) {
          nova.medalhasDetalhadas = nova.medalhasDetalhadas.filter(
            (md) => md.id !== medalhaId
          );
          nova.medalhas = nova.medalhasDetalhadas.length;
        }
        return nova;
      })
    );
    setRemoveCondecoracaoMembro(null);
    alert('✅ Medalha removida!');
  }

  const patentes = useMemo(
    () => [...new Set(membros.map((m) => m.patente).filter(Boolean))].sort(),
    [membros]
  );
  const forcas = useMemo(
    () =>
      [...new Set(membros.map((m) => m.forcaEspecial).filter(Boolean))].sort(),
    [membros]
  );

  useEffect(() => {
    function handleMostrarDetalhes(e) {
      const { id } = e.detail || {};
      const eventos = JSON.parse(
        localStorage.getItem('strykers_eventos') || '[]'
      );
      const found = eventos.find((ev) => ev.id === id);
      if (found) {
        setSelectedEvento(found);
        setShowEventDetails(true);
      }
    }

    document.addEventListener('eventos:mostrarDetalhes', handleMostrarDetalhes);
    return () =>
      document.removeEventListener(
        'eventos:mostrarDetalhes',
        handleMostrarDetalhes
      );
  }, []);

  return (
    <div className='relative z-10 container mx-auto px-6 py-16'>
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h2 className='text-4xl font-bold text-white mb-2 tracking-wide'>
            ADMINISTRAÇÃO
          </h2>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('evento-sidebar');
            if (el) el.classList.remove('translate-x-full');
          }}
          className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors'
        >
          ➕ Cadastrar Evento
        </button>
      </div>

      {/* ALISTAMENTOS PENDENTES */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h3 className='text-2xl font-bold text-yellow-400 mb-4'>
          ⏳ ALISTAMENTOS PENDENTES
        </h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-900'>
              <tr className='text-left text-cyan-400 font-semibold'>
                <th className='px-4 py-3'>SOLICITANTE</th>
                <th className='px-4 py-3'>E-MAIL</th>
                <th className='px-4 py-3'>WHATSAPP</th>
                <th className='px-4 py-3'>DATA SOLICITAÇÃO</th>
                <th className='px-4 py-3 text-center'>AÇÕES</th>
              </tr>
            </thead>
            <tbody className='text-gray-300'>
              {pendentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className='text-center py-8 text-gray-400'>
                    Nenhum alistamento pendente
                  </td>
                </tr>
              ) : (
                pendentes.map((p) => (
                  <tr
                    key={p.id}
                    className='border-b border-slate-700 hover:bg-slate-700/30'
                  >
                    <td className='px-4 py-3 font-semibold'>{p.nome}</td>
                    <td className='px-4 py-3'>{p.email}</td>
                    <td className='px-4 py-3'>{p.whatsapp || '-'}</td>
                    <td className='px-4 py-3'>
                      {new Date(p.dataSolicitacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <button
                        onClick={() => aprovarAlistamento(p.id)}
                        className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2 transition-colors'
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => recusarAlistamento(p.id)}
                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors'
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALISTAMENTOS RECUSADOS */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h3 className='text-2xl font-bold text-red-400 mb-4'>
          ❌ ALISTAMENTOS RECUSADOS
        </h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-900'>
              <tr className='text-left text-cyan-400 font-semibold'>
                <th className='px-4 py-3'>SOLICITANTE</th>
                <th className='px-4 py-3'>E-MAIL</th>
                <th className='px-4 py-3'>WHATSAPP</th>
                <th className='px-4 py-3'>DATA SOLICITAÇÃO</th>
                <th className='px-4 py-3 text-center'>AÇÕES</th>
              </tr>
            </thead>
            <tbody className='text-gray-300'>
              {recusados.length === 0 ? (
                <tr>
                  <td colSpan={5} className='text-center py-8 text-gray-400'>
                    Nenhum alistamento recusado
                  </td>
                </tr>
              ) : (
                recusados.map((r) => (
                  <tr
                    key={r.id}
                    className='border-b border-slate-700 hover:bg-slate-700/30'
                  >
                    <td className='px-4 py-3 font-semibold'>{r.nome}</td>
                    <td className='px-4 py-3'>{r.email}</td>
                    <td className='px-4 py-3'>{r.whatsapp || '-'}</td>
                    <td className='px-4 py-3'>
                      {new Date(r.dataSolicitacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <button
                        onClick={() => realistarUsuario(r.id)}
                        className='bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2 text-sm transition-colors'
                      >
                        🔄 Realistar
                      </button>
                      <button
                        onClick={() => excluirAlistamento(r.id)}
                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors'
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MEMBROS REGISTRADOS */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h3 className='text-2xl font-bold text-green-400 mb-4'>
          ✅ MEMBROS REGISTRADOS
        </h3>

        {/* Filtros */}
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4 mb-6'>
          <input
            type='text'
            value={filters.search}
            onChange={(e) => aplicarFiltros({ search: e.target.value })}
            placeholder='Buscar por nome...'
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400'
          />
          <select
            value={filters.patente}
            onChange={(e) => aplicarFiltros({ patente: e.target.value })}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2'
          >
            <option value=''>Todas Patentes</option>
            {patentes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={filters.situacao}
            onChange={(e) => aplicarFiltros({ situacao: e.target.value })}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2'
          >
            <option value=''>Todas Situações</option>
            <option value='Ativo'>Ativo</option>
            <option value='Reservista'>Reservista</option>
            <option value='Desertor'>Desertor</option>
          </select>
          <select
            value={filters.forca}
            onChange={(e) => aplicarFiltros({ forca: e.target.value })}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2'
          >
            <option value=''>Todas Forças</option>
            {forcas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type='date'
            value={filters.data}
            onChange={(e) => aplicarFiltros({ data: e.target.value })}
            className='bg-slate-900 text-white border border-slate-700 rounded px-4 py-2'
          />
          <button
            onClick={limparFiltros}
            className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-4 py-2 transition-colors'
          >
            Limpar
          </button>
        </div>

        {/* Tabela */}
        <div className='overflow-x-auto max-h-[600px] overflow-y-auto'>
          <table className='w-full'>
            <thead className='bg-slate-900 sticky top-0'>
              <tr className='text-left text-cyan-400 font-semibold text-sm'>
                <th className='px-4 py-3'>NOME</th>
                <th className='px-4 py-3'>PATENTE</th>
                <th className='px-4 py-3'>ATRIBUIÇÃO</th>
                <th className='px-4 py-3'>DATA REGISTRO</th>
                <th className='px-4 py-3'>SITUAÇÃO</th>
                <th className='px-4 py-3'>FORÇA ESPECIAL</th>
                <th className='px-4 py-3 text-center'>MEDALHAS</th>
                <th className='px-4 py-3 text-center'>MISSÕES</th>
                <th className='px-4 py-3'>E-MAIL</th>
                <th className='px-4 py-3'>WHATSAPP</th>
                <th className='px-4 py-3 text-center'>OBS</th>
                <th className='px-4 py-3 text-center'>HIST</th>
                <th className='px-4 py-3 text-center'>AÇÕES</th>
              </tr>
            </thead>
            <tbody className='text-gray-300 text-sm'>
              {filteredMembros.length === 0 ? (
                <tr>
                  <td colSpan={13} className='text-center py-8 text-gray-400'>
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                filteredMembros.map((m) => {
                  const usuario = usuarios.find(
                    (u) => u.nome === m.nome && u.status === 'aprovado'
                  );
                  const totalMissoes =
                    (m.eventosParticipados?.length || 0) +
                    (m.valorHistorico || 0);
                  return (
                    <tr
                      key={m.id}
                      className='border-b border-slate-700 hover:bg-slate-700/30'
                    >
                      <td className='px-4 py-3 font-semibold'>{m.nome}</td>
                      <td className='px-4 py-3'>{m.patente}</td>
                      <td className='px-4 py-3'>{m.atribuicao}</td>
                      <td className='px-4 py-3'>{m.dataRegistro}</td>
                      <td className='px-4 py-3'>{m.situacao}</td>
                      <td className='px-4 py-3'>{m.forcaEspecial || 'Não'}</td>
                      <td className='px-4 py-3 text-center'>
                        <button
                          className='text-yellow-400 hover:text-yellow-300'
                          onClick={() => mostrarMedalhasMembro(m.id)}
                        >
                          {m.medalhas || 0} 👁️
                        </button>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <button
                          className='text-cyan-400 hover:text-cyan-300'
                          onClick={() => mostrarMissoesMembro(m.id)}
                        >
                          {totalMissoes} 👁️
                        </button>
                      </td>
                      <td className='px-4 py-3'>{usuario?.email || '-'}</td>
                      <td className='px-4 py-3'>{usuario?.whatsapp || '-'}</td>
                      <td className='px-4 py-3 text-center'>
                        {m.observacoes ? (
                          <button
                            onClick={() =>
                              setModalTexto({
                                isOpen: true,
                                titulo: 'Observações',
                                conteudo: m.observacoes,
                              })
                            }
                            className='text-cyan-400 hover:text-cyan-300'
                          >
                            📋
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        {m.historico ? (
                          <button
                            onClick={() =>
                              setModalTexto({
                                isOpen: true,
                                titulo: 'Histórico',
                                conteudo: m.historico,
                              })
                            }
                            className='text-cyan-400 hover:text-cyan-300'
                          >
                            📋
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <button
                          onClick={() => abrirEditarMembro(m.id)}
                          className='text-blue-400 hover:text-blue-300 mr-2'
                          title='Editar'
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => abrirCondecorar(m.id)}
                          className='text-yellow-400 hover:text-yellow-300 mr-2'
                          title='Condecorar'
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => excluirMembro(m.id)}
                          className='text-red-400 hover:text-red-300'
                          title='Excluir'
                        >
                          🗑️
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

      {/* CALENDÁRIO DE EVENTOS */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8'>
        <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
          📅 CALENDÁRIO DE EVENTOS (ADMINISTRAÇÃO)
        </h3>
        <Calendario admin={true} modo='edicao' />
      </div>

      {/* Modal de Texto */}
      <ModalTexto
        isOpen={modalTexto.isOpen}
        titulo={modalTexto.titulo}
        conteudo={modalTexto.conteudo}
        onClose={() =>
          setModalTexto({ isOpen: false, titulo: '', conteudo: '' })
        }
      />

      {/* Drawer Editar Membro */}
      {editingMember && (
        <aside className='fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 z-80 overflow-y-auto p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-cyan-400'>EDITAR MEMBRO</h3>
            <button
              onClick={() => setEditingMember(null)}
              className='text-gray-400 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>
          <EditarMembroForm
            membro={editingMember}
            onChange={setEditingMember}
            onSave={salvarMembroEdicao}
            onCancel={() => setEditingMember(null)}
          />
        </aside>
      )}

      {/* Drawer Condecorar */}
      {openCondecorar && (
        <aside className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 z-60 overflow-y-auto p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-cyan-400'>CONDECORAR</h3>
            <button
              onClick={() => setOpenCondecorar(null)}
              className='text-gray-400 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>

          {/* Form Condecoração */}
          <form onSubmit={salvarCondecoracao} className='space-y-6 mb-6'>
            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                MEDALHA *
              </label>
              <select
                value={condecorarTipo}
                onChange={(e) => setCondecorarTipo(e.target.value)}
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
              >
                <option value=''>Selecione uma medalha</option>
                {Object.entries(MEDALHAS_DISPONIVEIS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.emoji} {v.nome}
                  </option>
                ))}
              </select>
            </div>

            {condecorarTipo && (
              <div className='bg-slate-800/50 border border-slate-700 rounded-lg p-4'>
                <h4 className='text-sm text-gray-400 mb-2 uppercase tracking-wide'>
                  Descrição
                </h4>
                <p className='text-gray-300 text-sm leading-relaxed'>
                  {MEDALHAS_DISPONIVEIS[condecorarTipo]?.descricao}
                </p>
              </div>
            )}

            <div>
              <label className='block text-gray-400 text-sm mb-2'>
                OBSERVAÇÕES
              </label>
              <textarea
                value={condecorarObs}
                onChange={(e) => setCondecorarObs(e.target.value)}
                rows={4}
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
                placeholder='Detalhes sobre a condecoração (opcional)...'
              />
            </div>

            <div className='flex gap-4'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-3 transition-colors'
              >
                ⭐ Condecorar
              </button>
              <button
                type='button'
                onClick={() => {
                  setCondecorarTipo('');
                  setCondecorarObs('');
                }}
                className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors'
              >
                🗑️ Limpar
              </button>
            </div>
          </form>

          {/* Remover Medalha */}
          {membros.find((m) => m.id === openCondecorar)?.medalhasDetalhadas
            ?.length > 0 && (
            <>
              <div className='border-t border-slate-700 pt-6'>
                <button
                  onClick={() => setRemoveCondecoracaoMembro(openCondecorar)}
                  className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-6 py-3 transition-colors'
                >
                  🗑️ Remover Condecoração
                </button>
              </div>
            </>
          )}
        </aside>
      )}

      {/* Drawer Remover Medalha */}
      {removeCondecoracaoMembro && (
        <aside className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 z-70 overflow-y-auto p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-red-400'>
              REMOVER CONDECORAÇÃO
            </h3>
            <button
              onClick={() => setRemoveCondecoracaoMembro(null)}
              className='text-gray-400 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>

          <p className='text-gray-400 mb-4'>
            Selecione a medalha que deseja remover:
          </p>

          <div className='space-y-2'>
            {membros
              .find((m) => m.id === removeCondecoracaoMembro)
              ?.medalhasDetalhadas?.map((medal) => {
                const medalhaInfo = MEDALHAS_DISPONIVEIS[medal.tipo];
                return (
                  <div
                    key={medal.id}
                    onClick={() =>
                      removerMedalha(removeCondecoracaoMembro, medal.id)
                    }
                    className='bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500 rounded-lg p-4 cursor-pointer transition-all'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='text-4xl'>{medalhaInfo.emoji}</div>
                      <div className='flex-1'>
                        <div className='text-white font-semibold'>
                          {medalhaInfo.nome}
                        </div>
                        <div className='text-gray-400 text-sm'>
                          {new Date(
                            medal.data + 'T00:00:00'
                          ).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        {medal.observacoes && (
                          <div className='text-gray-500 text-xs mt-1'>
                            {medal.observacoes}
                          </div>
                        )}
                      </div>
                      <div className='text-red-400 text-xl'>×</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </aside>
      )}

      {/* Sidebar de Eventos */}
      <aside
        id='evento-sidebar'
        className='fixed top-0 right-0 h-full w-[500px] bg-slate-900 border-l border-slate-700 transform translate-x-full transition-transform duration-300 z-[70] overflow-y-auto'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3
              className='text-2xl font-bold text-cyan-400'
              id='sidebar-titulo'
            >
              CADASTRAR EVENTO
            </h3>
            <button
              id='close-evento-sidebar'
              onClick={() => {
                document
                  .getElementById('evento-sidebar')
                  .classList.add('translate-x-full');
              }}
              className='text-gray-400 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>
          <EventForm />
        </div>
      </aside>
      <DetailsSidebarAdmin
        open={showEventDetails}
        evento={selectedEvento}
        onClose={() => setShowEventDetails(false)}
      />

      {showEventDetails && (
        <div
          className='fixed inset-0 bg-black/50 z-[70]'
          onClick={() => setShowEventDetails(false)}
        />
      )}
      <aside
        id='participantes-evento-sidebar-admin'
        className='fixed top-0 left-0 h-full w-[500px] bg-slate-900 border-r border-slate-700 -translate-x-full transition-transform duration-300 z-[70] overflow-y-auto'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-cyan-400'>
              GERENCIAR PARTICIPANTES
            </h3>
            <button
              onClick={() => {
                document
                  .getElementById('participantes-evento-sidebar-admin')
                  .classList.add('-translate-x-full');
              }}
              className='text-gray-400 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>

          <div className='mb-6'>
            <h4 className='text-sm text-gray-400 mb-3'>
              PARTICIPANTES ADICIONADOS
            </h4>
            <div
              id='lista-participantes-evento-admin'
              className='space-y-2 max-h-60 overflow-y-auto'
            />
          </div>

          <div>
            <h4 className='text-sm text-gray-400 mb-3'>ADICIONAR MEMBRO</h4>
            <input
              type='text'
              id='search-membro-participante-admin'
              placeholder='Buscar membro ativo...'
              className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 mb-3'
              onInput={(e) => {
                const search = e.target.value.toLowerCase();
                const items = document.querySelectorAll(
                  '#lista-membros-disponiveis-admin .membro-item'
                );
                items.forEach((item) => {
                  const nome = item.dataset.nome;
                  item.style.display = nome.includes(search) ? 'flex' : 'none';
                });
              }}
            />
            <div
              id='lista-membros-disponiveis-admin'
              className='space-y-2 max-h-96 overflow-y-auto'
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function EditarMembroForm({ membro, onChange, onSave, onCancel }) {
  return (
    <form onSubmit={onSave} className='space-y-4'>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>NOME *</label>
        <input
          type='text'
          value={membro.nome}
          onChange={(e) => onChange({ ...membro, nome: e.target.value })}
          required
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>FOTO (URL)</label>
        <input
          type='text'
          value={membro.foto || ''}
          onChange={(e) => onChange({ ...membro, foto: e.target.value })}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>PATENTE *</label>
        <select
          value={membro.patente || ''}
          onChange={(e) => onChange({ ...membro, patente: e.target.value })}
          required
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        >
          {PATENTES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>ATRIBUIÇÃO *</label>
        <select
          value={membro.atribuicao || ''}
          onChange={(e) => onChange({ ...membro, atribuicao: e.target.value })}
          required
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        >
          {ATRIBUICOES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>
          DATA DE REGISTRO
        </label>
        <input
          type='date'
          value={membro.dataRegistro || ''}
          onChange={(e) =>
            onChange({ ...membro, dataRegistro: e.target.value })
          }
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>SITUAÇÃO</label>
        <select
          value={membro.situacao || ''}
          onChange={(e) => onChange({ ...membro, situacao: e.target.value })}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        >
          <option value='Ativo'>Ativo</option>
          <option value='Reservista'>Reservista</option>
          <option value='Desertor'>Desertor</option>
        </select>
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>
          FORÇA ESPECIAL
        </label>
        <select
          value={membro.forcaEspecial || 'Não'}
          onChange={(e) =>
            onChange({ ...membro, forcaEspecial: e.target.value })
          }
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        >
          <option value='Não'>Não</option>
          {FORCAS_ESPECIAIS.map((f) => (
            <option key={f.id} value={f.nome}>
              {f.nome}
            </option>
          ))}
          <option value='Outro'>Outro</option>
        </select>
      </div>

      <div>
        <label className='block text-gray-400 text-sm mb-2'>OBSERVAÇÕES</label>
        <textarea
          value={membro.observacoes || ''}
          onChange={(e) => onChange({ ...membro, observacoes: e.target.value })}
          rows={4}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>

      <div className='border-t border-slate-700 pt-4'>
        <h4 className='text-cyan-400 font-semibold mb-3'>
          📜 HISTÓRICO DE MISSÕES ANTIGAS
        </h4>
        <p className='text-gray-500 text-xs mb-3'>
          Use esta seção para registrar missões realizadas antes da criação
          deste sistema.
        </p>
        <div>
          <label className='block text-gray-400 text-sm mb-2'>HISTÓRICO</label>
          <textarea
            value={membro.historico || ''}
            onChange={(e) => onChange({ ...membro, historico: e.target.value })}
            rows={6}
            placeholder='Descreva aqui as missões antigas...'
            className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
          />
        </div>
        <div className='mt-4'>
          <label className='block text-gray-400 text-sm mb-2'>
            VALOR HISTÓRICO (Quantidade de Missões)
          </label>
          <input
            type='number'
            min='0'
            value={membro.valorHistorico || 0}
            onChange={(e) =>
              onChange({
                ...membro,
                valorHistorico: parseInt(e.target.value) || 0,
              })
            }
            className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
          />
          <p className='text-gray-500 text-xs mt-1'>
            Este número será somado ao total de missões do membro.
          </p>
        </div>
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          className='flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors'
        >
          ✓ Salvar
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors'
        >
          ✕ Cancelar
        </button>
      </div>
    </form>
  );
}

function EventForm() {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('treinamento');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('20:00');
  const [descricao, setDescricao] = useState('');

  function salvar(e) {
    e.preventDefault();
    const eventos = JSON.parse(
      localStorage.getItem('strykers_eventos') || '[]'
    );

    const editId = e.target.dataset.editId;

    if (editId) {
      // Modo edição
      const updated = eventos.map((ev) => {
        if (ev.id === parseInt(editId)) {
          return {
            ...ev,
            nome,
            categoria,
            data,
            horario,
            descricao,
          };
        }
        return ev;
      });
      localStorage.setItem('strykers_eventos', JSON.stringify(updated));
      delete e.target.dataset.editId;
      document.getElementById('sidebar-titulo').textContent =
        'CADASTRAR EVENTO';
      alert('✅ Evento atualizado com sucesso!');
    } else {
      // Modo criação
      const novo = {
        id: Date.now(),
        nome,
        categoria,
        data,
        horario,
        descricao,
        participantes: [],
        finalizado: false,
      };
      eventos.push(novo);
      localStorage.setItem('strykers_eventos', JSON.stringify(eventos));
      alert('✅ Evento cadastrado com sucesso!');
    }

    setNome('');
    setDescricao('');
    setData('');
    setHorario('20:00');
    setCategoria('treinamento');
    document.getElementById('evento-sidebar').classList.add('translate-x-full');
  }

  return (
    <form id='form-evento' onSubmit={salvar} className='space-y-4'>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>
          NOME DO EVENTO *
        </label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>CATEGORIA</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        >
          <option value='treinamento'>Treinamento</option>
          <option value='missao'>Missão</option>
          <option value='operacao'>Operação</option>
          <option value='mega-operacao'>Mega Operação</option>
          <option value='campanha'>Campanha</option>
          <option value='outro'>Outro</option>
        </select>
      </div>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>DATA</label>
        <input
          type='date'
          value={data}
          onChange={(e) => setData(e.target.value)}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>HORÁRIO</label>
        <input
          type='time'
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>
      <div>
        <label className='block text-gray-400 text-sm mb-2'>DESCRIÇÃO</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={6}
          className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2'
        />
      </div>
      <div className='flex gap-4'>
        <button
          type='submit'
          className='flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors'
        >
          ✓ Registrar
        </button>
        <button
          type='button'
          id='btn-limpar-form'
          onClick={() => {
            setNome('');
            setDescricao('');
            setData('');
            setHorario('20:00');
          }}
          className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors'
        >
          🗑 Limpar
        </button>
      </div>
    </form>
  );
}
