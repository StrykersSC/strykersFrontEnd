import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('senha');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirNovaSenha, setRepetirNovaSenha] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [repetirNovoEmail, setRepetirNovoEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const { alterarSenha, alterarEmail } = useAuth();

  const handleAlterarSenha = () => {
    const resultado = alterarSenha(senhaAtual, novaSenha, repetirNovaSenha);
    if (resultado.success) {
      setSucesso(resultado.message);
      setSenhaAtual('');
      setNovaSenha('');
      setRepetirNovaSenha('');
      setErro('');
    } else {
      setErro(resultado.error);
      setSucesso('');
    }
  };

  const handleAlterarEmail = () => {
    const resultado = alterarEmail(novoEmail, repetirNovoEmail);
    if (resultado.success) {
      setSucesso(resultado.message);
      setNovoEmail('');
      setRepetirNovoEmail('');
      setErro('');
    } else {
      setErro(resultado.error);
      setSucesso('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-slate-900 border-2 border-cyan-400 rounded-lg shadow-xl max-w-md w-full mx-4 p-8'>
        <h2 className='text-3xl font-bold mb-6 text-cyan-400'>
          🔐 CONFIGURAÇÃO DE CONTA
        </h2>

        <div className='flex gap-4 mb-6'>
          <button
            onClick={() => {
              setActiveTab('senha');
              setErro('');
              setSucesso('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg transition font-semibold ${
              activeTab === 'senha'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Alterar Senha
          </button>
          <button
            onClick={() => {
              setActiveTab('email');
              setErro('');
              setSucesso('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg transition font-semibold ${
              activeTab === 'email'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Alterar E-mail
          </button>
        </div>

        {activeTab === 'senha' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-gray-400 text-sm font-medium mb-2'>
                Senha Atual
              </label>
              <input
                type='password'
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
              />
            </div>

            <div>
              <label className='block text-gray-400 text-sm font-medium mb-2'>
                Nova Senha
              </label>
              <input
                type='password'
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
              />
            </div>

            <div>
              <label className='block text-gray-400 text-sm font-medium mb-2'>
                Repetir Nova Senha
              </label>
              <input
                type='password'
                value={repetirNovaSenha}
                onChange={(e) => setRepetirNovaSenha(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
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
                onClick={handleAlterarSenha}
                className='flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold'
              >
                ✓ Salvar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-gray-400 text-sm font-medium mb-2'>
                Novo E-mail
              </label>
              <input
                type='email'
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
              />
            </div>

            <div>
              <label className='block text-gray-400 text-sm font-medium mb-2'>
                Repetir E-mail
              </label>
              <input
                type='email'
                value={repetirNovoEmail}
                onChange={(e) => setRepetirNovoEmail(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 transition'
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
                onClick={handleAlterarEmail}
                className='flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-semibold'
              >
                ✓ Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
