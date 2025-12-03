import React, { useEffect, useMemo, useState } from 'react';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

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

export default function Calendario({
  mesInicial,
  anoInicial,
  modo = 'visualizacao',
  onChangeMonth,
  admin = false,
}) {
  const [mes, setMes] = useState(
    typeof mesInicial === 'number' ? mesInicial : new Date().getMonth()
  );
  const [ano, setAno] = useState(
    typeof anoInicial === 'number' ? anoInicial : new Date().getFullYear()
  );
  const [eventos, setEventos] = useState(() =>
    JSON.parse(localStorage.getItem('strykers_eventos') || '[]')
  );

  // ✅ Sincronizar eventos do localStorage
  useEffect(() => {
    const onStorage = () =>
      setEventos(JSON.parse(localStorage.getItem('strykers_eventos') || '[]'));

    window.addEventListener('storage', onStorage);
    document.addEventListener('eventos:updated', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('eventos:updated', onStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof onChangeMonth === 'function') onChangeMonth(mes, ano);
  }, [mes, ano, onChangeMonth]);

  const primeiroDia = useMemo(() => new Date(ano, mes, 1).getDay(), [mes, ano]);
  const ultimoDia = useMemo(
    () => new Date(ano, mes + 1, 0).getDate(),
    [mes, ano]
  );

  const tituloId = admin ? 'calendario-titulo-admin' : 'calendario-titulo';
  const diasId = admin ? 'calendario-dias-admin' : 'calendario-dias';
  const btnAnteriorId = admin ? 'btn-mes-anterior-admin' : 'btn-mes-anterior';
  const btnProximoId = admin ? 'btn-mes-proximo-admin' : 'btn-mes-proximo';

  function goPrev() {
    setMes((m) => {
      if (m - 1 < 0) {
        setAno((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function goNext() {
    setMes((m) => {
      if (m + 1 > 11) {
        setAno((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  // ✅ Função para abrir detalhes do evento
  function abrirDetalhesEvento(eventoId) {
    console.log('🔵 Abrindo detalhes do evento:', eventoId);

    const event = new CustomEvent('eventos:mostrarDetalhes', {
      detail: { id: eventoId },
      bubbles: true,
      composed: true,
    });

    document.dispatchEvent(event);
    console.log('✅ Evento disparado:', event);
  }

  const dias = [];
  for (let i = 0; i < primeiroDia; i++) dias.push(null);
  for (let d = 1; d <= ultimoDia; d++) dias.push(d);

  const hoje = new Date();

  return (
    <div>
      {/* CABEÇALHO DO CALENDÁRIO */}
      <div className='flex justify-between items-center mb-6'>
        <button
          id={btnAnteriorId}
          onClick={goPrev}
          className='text-white hover:text-cyan-400 text-2xl transition-colors'
        >
          ◀
        </button>
        <h3 id={tituloId} className='text-2xl font-bold text-white'>
          {MESES[mes]} {ano}
        </h3>
        <button
          id={btnProximoId}
          onClick={goNext}
          className='text-white hover:text-cyan-400 text-2xl transition-colors'
        >
          ▶
        </button>
      </div>

      {/* GRID DO CALENDÁRIO */}
      <div className='grid grid-cols-7 gap-2'>
        {/* DIAS DA SEMANA */}
        <div className='text-center text-cyan-400 font-semibold py-2'>DOM</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>SEG</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>TER</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>QUA</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>QUI</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>SEX</div>
        <div className='text-center text-cyan-400 font-semibold py-2'>SÁB</div>

        {/* DIAS DO MÊS */}
        <div id={diasId} className='col-span-7 grid grid-cols-7 gap-2'>
          {dias.map((dia, idx) => {
            if (dia === null)
              return (
                <div
                  key={idx}
                  className='min-h-[120px] bg-slate-700/30 rounded-lg'
                />
              );

            const dataCompleta = `${ano}-${String(mes + 1).padStart(
              2,
              '0'
            )}-${String(dia).padStart(2, '0')}`;
            const eventosNoDia = eventos.filter((e) => e.data === dataCompleta);
            const diaAtual =
              hoje.getDate() === dia &&
              hoje.getMonth() === mes &&
              hoje.getFullYear() === ano;

            return (
              <div
                key={idx}
                className={`min-h-[120px] bg-slate-800/60 border ${
                  diaAtual ? 'border-cyan-400' : 'border-slate-700'
                } rounded-lg p-2 hover:bg-slate-700/60 transition-colors`}
              >
                <div
                  className={`font-bold ${
                    diaAtual ? 'text-cyan-400' : 'text-white'
                  } mb-2`}
                >
                  {dia}
                </div>
                {eventosNoDia.length > 0 && (
                  <div className='space-y-1'>
                    {eventosNoDia
                      .sort((a, b) => {
                        // ✅ Ordenar por horário (mais cedo primeiro)
                        const horarioA = a.horario || '00:00';
                        const horarioB = b.horario || '00:00';
                        return horarioA.localeCompare(horarioB);
                      })
                      .map((evento) => {
                        const cores =
                          CATEGORIAS_CORES[evento.categoria] ||
                          CATEGORIAS_CORES.outro;
                        const finalizadoStyle = evento.finalizado
                          ? 'line-through opacity-75'
                          : '';
                        return (
                          <div
                            key={evento.id}
                            className={`text-xs ${cores.text} bg-slate-900/50 px-2 py-1 rounded border-l-2 ${cores.border} cursor-pointer hover:bg-slate-900 transition-colors ${finalizadoStyle}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirDetalhesEvento(evento.id);
                            }}
                          >
                            <div className='font-semibold truncate'>
                              {evento.horario}{' '}
                              {evento.finalizado ? (
                                <span className='text-[10px] bg-green-600 px-1 rounded ml-1'>
                                  ✓
                                </span>
                              ) : null}
                            </div>
                            <div className='truncate'>{evento.nome}</div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ LEGENDA */}
      <div className='mt-6 pt-6 border-t border-slate-700'>
        <h4 className='text-sm text-gray-400 mb-3 font-semibold'>LEGENDA</h4>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {Object.entries(CATEGORIAS_CORES).map(([key, value]) => (
            <div key={key} className='flex items-center gap-2'>
              <div className={`w-4 h-4 ${value.bg} rounded`} />
              <span className='text-sm text-gray-300'>{value.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
