import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../constants/roles';

/**
 * Componente para proteger rotas baseado em permissões
 */
export default function ProtectedRoute({
  children,
  permission,
  fallback = '/',
}) {
  const { usuarioAtual, loading } = useAuth();

  // Aguardar carregamento
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <div className='text-cyan-400 text-xl'>Carregando...</div>
      </div>
    );
  }

  // Não autenticado
  if (!usuarioAtual) {
    return <Navigate to={fallback} replace />;
  }

  // Verificar permissão
  if (permission && !hasPermission(usuarioAtual.role, permission)) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <div className='bg-slate-800 border border-red-700 rounded-lg p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>🚫</div>
          <h2 className='text-2xl font-bold text-red-400 mb-2'>
            Acesso Negado
          </h2>
          <p className='text-gray-400 mb-6'>
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-2 transition-colors'
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return children;
}
