import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function AuthModal({
  isOpen,
  onClose,
  onSignupSuccess,
  onShowEmailConfirmation,
}) {
  const { login, cadastro } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' ou 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state para login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Form state para signup
  const [signupNome, setSignupNome] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupEmailConfirm, setSignupEmailConfirm] = useState('');
  const [signupSenha, setSignupSenha] = useState('');
  const [signupSenhaConfirm, setSignupSenhaConfirm] = useState('');
  const [signupWhatsapp, setSignupWhatsapp] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(loginEmail, loginSenha);
      if (result.success) {
        setLoginEmail('');
        setLoginSenha('');
        // Recarregar a página para garantir que tudo seja atualizado
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setError(result.error);
        // If the backend indicates the user still needs to confirm their email,
        // open the confirmation modal and provide the user object so the
        // confirmation component can show the code and the input.
        if (result.needsConfirmation && onShowEmailConfirmation) {
          onShowEmailConfirmation(result.user);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = cadastro(
      signupEmail,
      signupEmailConfirm,
      signupSenha,
      signupSenhaConfirm,
      signupNome,
      signupWhatsapp
    );

    if (result.success) {
      setSignupNome('');
      setSignupEmail('');
      setSignupEmailConfirm('');
      setSignupSenha('');
      setSignupSenhaConfirm('');
      setSignupWhatsapp('');
      if (onSignupSuccess) {
        onSignupSuccess(result.user);
      }
      if (onShowEmailConfirmation) {
        onShowEmailConfirmation(result.user);
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-slate-900 border border-slate-700 rounded-lg p-8 w-full max-w-md shadow-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-cyan-400'>
            {mode === 'login' ? 'ENTRAR' : 'CADASTRO'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white text-2xl transition-colors'
          >
            ×
          </button>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm'>
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>E-mail</label>
              <input
                type='email'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='seu@email.com'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>Senha</label>
              <input
                type='password'
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='••••••••'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 text-white font-semibold rounded px-4 py-2 transition-colors'
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
            <button
              type='button'
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className='w-full text-cyan-400 hover:text-cyan-300 text-sm transition-colors mt-4'
            >
              Não tem conta? Cadastre-se
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className='space-y-4'>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>Nome</label>
              <input
                type='text'
                value={signupNome}
                onChange={(e) => setSignupNome(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='Seu nome'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>E-mail</label>
              <input
                type='email'
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='seu@email.com'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                Repetir E-mail
              </label>
              <input
                type='email'
                value={signupEmailConfirm}
                onChange={(e) => setSignupEmailConfirm(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='seu@email.com'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                WhatsApp
              </label>
              <input
                type='tel'
                value={signupWhatsapp}
                onChange={(e) => setSignupWhatsapp(e.target.value)}
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='(11) 99999-9999'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>Senha</label>
              <input
                type='password'
                value={signupSenha}
                onChange={(e) => setSignupSenha(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='••••••••'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                Repetir Senha
              </label>
              <input
                type='password'
                value={signupSenhaConfirm}
                onChange={(e) => setSignupSenhaConfirm(e.target.value)}
                required
                className='w-full bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='••••••••'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 text-white font-semibold rounded px-4 py-2 transition-colors'
            >
              {loading ? 'Cadastrando...' : 'CADASTRAR'}
            </button>
            <button
              type='button'
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className='w-full text-cyan-400 hover:text-cyan-300 text-sm transition-colors mt-4'
            >
              Já tem conta? Faça login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
