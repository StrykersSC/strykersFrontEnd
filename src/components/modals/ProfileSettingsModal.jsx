import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { forcasEspeciais } from '../../constants';

export default function ProfileSettingsModal({ isOpen, onClose, usuario }) {
  const [foto, setFoto] = useState('');
  const [forcaEspecial, setForcaEspecial] = useState('Não');
  const [observacoes, setObservacoes] = useState('');
  const [historico, setHistorico] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const { salvarConfiguracoes } = useAuth();

  // Carregar dados existentes quando modal abrir
  useEffect(() => {
    if (isOpen && usuario) {
      const membros = JSON.parse(
        localStorage.getItem('strykers_membros') || '[]'
      );
      const membro = membros.find((m) => m.nome === usuario.nome);

      if (membro) {
        setFoto(membro.foto || '');
        setForcaEspecial(membro.forcaEspecial || 'Não');
        setObservacoes(membro.observacoes || '');
        setHistorico(membro.historico || '');
      }
    }
  }, [isOpen, usuario]);

  const handleSalvar = () => {
    const resultado = salvarConfiguracoes(
      foto,
      forcaEspecial,
      observacoes,
      historico
    );

    if (resultado.success) {
      setSucesso('✅ Configurações salvas com sucesso!');
      setErro('');
      setTimeout(() => {
        onClose();
        setSucesso('');
      }, 2000);
    } else {
      setErro(resultado.error);
      setSucesso('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-slate-900 border-2 border-cyan-400 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto p-8'>
        <h2 className='text-3xl font-bold mb-6 text-cyan-400'>
          ⚙️ CONFIGURAÇÕES DE PERFIL
        </h2>

        <div className='space-y-4'>
          <div>
            <label className='block text-gray-400 text-sm font-medium mb-2'>
              URL da Foto
            </label>
            <input
              type='text'
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              placeholder='https://example.com/foto.jpg'
              className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
            />
            {foto && (
              <img
                src={foto}
                alt='Preview'
                className='mt-4 h-32 w-32 object-cover rounded-lg border border-slate-700'
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/128';
                }}
              />
            )}
          </div>

          <div>
            <label className='block text-gray-400 text-sm font-medium mb-2'>
              Força Especial
            </label>
            <select
              value={forcaEspecial}
              onChange={(e) => setForcaEspecial(e.target.value)}
              className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
            >
              <option value='Não'>Não</option>
              {forcasEspeciais.map((f) => (
                <option key={f.id} value={f.nome}>
                  {f.nome}
                </option>
              ))}
              <option value='Outro'>Outro</option>
            </select>
          </div>

          <div>
            <label className='block text-gray-400 text-sm font-medium mb-2'>
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder='Deixe suas observações aqui...'
              className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition h-20'
            />
          </div>

          <div>
            <label className='block text-gray-400 text-sm font-medium mb-2'>
              Histórico
            </label>
            <textarea
              value={historico}
              onChange={(e) => setHistorico(e.target.value)}
              placeholder='Descreva seu histórico...'
              className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition h-20'
            />
          </div>

          {erro && <p className='text-red-400 text-sm'>{erro}</p>}
          {sucesso && <p className='text-green-400 text-sm'>{sucesso}</p>}

          <div className='flex gap-4 pt-4'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-3 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 rounded-lg transition'
            >
              ✕ Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className='flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold'
            >
              ✓ Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
