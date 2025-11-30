import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function EmailConfirmationModal({ isOpen, onClose, usuario }) {
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const { confirmarEmail } = useAuth();

  const handleConfirmar = () => {
    if (!codigoDigitado) {
      setErro('⚠️ Preencha o código de confirmação!');
      return;
    }

    const resultado = confirmarEmail(usuario.id, codigoDigitado);
    if (resultado.success) {
      setSucesso(
        '✅ E-mail confirmado! Aguardando aprovação do administrador.'
      );
      setErro('');
      setTimeout(() => {
        onClose();
        setCodigoDigitado('');
        setSucesso('');
      }, 2000);
    } else {
      setErro(resultado.error);
      setSucesso('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]'>
      <div className='bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 shadow-xl max-w-md w-full'>
        <h2 className='text-3xl font-bold mb-2 text-cyan-400'>
          ✉️ CONFIRMAR E-MAIL
        </h2>
        <p className='text-gray-400 mb-6'>
          Enviamos um código de 6 dígitos para{' '}
          <span className='text-cyan-300 font-semibold'>{usuario?.email}</span>
        </p>

        <div className='bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 text-center'>
          <p className='text-gray-500 text-sm mb-2'>
            CÓDIGO DE CONFIRMAÇÃO (TESTE):
          </p>
          <p className='text-cyan-300 font-bold text-2xl tracking-widest'>
            {usuario?.codigoConfirmacao}
          </p>
        </div>

        <input
          type='text'
          maxLength='6'
          value={codigoDigitado}
          onChange={(e) => setCodigoDigitado(e.target.value.replace(/\D/g, ''))}
          placeholder='000000'
          className='w-full px-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-lg mb-4 text-center text-2xl tracking-widest focus:outline-none focus:border-cyan-400 transition-colors font-semibold'
        />

        {erro && (
          <p className='text-red-400 text-sm mb-4 font-semibold'>{erro}</p>
        )}
        {sucesso && (
          <p className='text-green-400 text-sm mb-4 font-semibold'>{sucesso}</p>
        )}

        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-400 transition-colors font-semibold'
          >
            ✕ Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className='flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-semibold'
          >
            ✓ Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
