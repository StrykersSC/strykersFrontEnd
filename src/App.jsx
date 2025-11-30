import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Membros from './pages/Membros.jsx';
import Eventos from './pages/Eventos.jsx';
import ForcasEspeciais from './pages/ForcasEspeciais.jsx';
import Perfil from './pages/Perfil.jsx';
import Administracao from './pages/Administracao.jsx';
import Recrutamento from './pages/Recrutamento.jsx';
import AuthModal from './components/modals/AuthModal.jsx';
import EmailConfirmationModal from './components/modals/EmailConfirmationModal.jsx';
import AccountSettingsModal from './components/modals/AccountSettingsModal.jsx';
import ProfileSettingsModal from './components/modals/ProfileSettingsModal.jsx';
import { useAuth } from './hooks/useAuth.js';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `font-semibold pb-1 transition-colors ${
          isActive
            ? 'text-cyan-400 border-b-2 border-cyan-400'
            : 'text-gray-300 hover:text-cyan-400'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function AppContent() {
  const { usuarioAtual, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [emailConfirmationModalOpen, setEmailConfirmationModalOpen] =
    useState(false);
  const [accountSettingsModalOpen, setAccountSettingsModalOpen] =
    useState(false);
  const [profileSettingsModalOpen, setProfileSettingsModalOpen] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja fazer logout?')) {
      logout();
      setDropdownOpen(false);
      navigate('/');
    }
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='fixed inset-0 pointer-events-none z-0 flex items-center justify-center'>
        <img
          src='/STRYKERS-Logo.png'
          alt='Logo da Strykers'
          className='opacity-20 w-full h-full object-contain'
        />
      </div>

      <nav className='relative z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-slate-700 rounded flex items-center justify-center'>
                <span className='text-cyan-400 font-bold text-xl'>S</span>
              </div>
              <h1 className='text-2xl font-bold text-white tracking-wider'>
                STRYKERS
              </h1>
            </div>

            <div className='flex items-center space-x-8'>
              <NavItem to='/'>HOME</NavItem>
              <NavItem to='/membros'>MEMBROS</NavItem>
              <NavItem to='/eventos'>EVENTOS</NavItem>
              <NavItem to='/recrutamento'>RECRUTAMENTO</NavItem>
              <NavItem to='/forcasespeciais'>FORÇAS ESPECIAIS</NavItem>
              <NavItem to='/administracao'>ADMINISTRAÇÃO</NavItem>

              <div className='ml-auto pl-8 border-l border-slate-700'>
                {usuarioAtual ? (
                  <div ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className='text-cyan-400 font-semibold hover:text-cyan-300 transition-colors pb-1 flex items-center gap-2'
                    >
                      {usuarioAtual.nome}
                      <span className='text-sm'>▼</span>
                    </button>

                    {dropdownOpen && (
                      <div
                        className='fixed mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 top-16 right-6'
                        style={{ pointerEvents: 'auto' }}
                      >
                        <button
                          onClick={() => {
                            navigate('/perfil');
                            setDropdownOpen(false);
                          }}
                          className='w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700'
                        >
                          👤 Perfil
                        </button>
                        <button
                          onClick={() => {
                            setProfileSettingsModalOpen(true);
                            setDropdownOpen(false);
                          }}
                          className='w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700'
                        >
                          ⚙️ Configurações
                        </button>
                        <button
                          onClick={() => {
                            setAccountSettingsModalOpen(true);
                            setDropdownOpen(false);
                          }}
                          className='w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors border-b border-slate-700'
                        >
                          🔐 Configuração de Conta
                        </button>
                        <button
                          onClick={handleLogout}
                          className='w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-red-400 transition-colors'
                        >
                          🚪 Sair
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className='text-gray-300 font-semibold hover:text-cyan-400 transition-colors pb-1'
                  >
                    SIGN IN
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className='relative z-10 container mx-auto px-6 py-16'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/membros' element={<Membros />} />
          <Route path='/eventos' element={<Eventos />} />
          <Route path='/forcasespeciais' element={<ForcasEspeciais />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/administracao' element={<Administracao />} />
          <Route path='/recrutamento' element={<Recrutamento />} />
        </Routes>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignupSuccess={(user) => {
          setNewUser(user);
        }}
        onShowEmailConfirmation={(user) => {
          setNewUser(user);
          setAuthModalOpen(false);
          setEmailConfirmationModalOpen(true);
        }}
      />

      <EmailConfirmationModal
        isOpen={emailConfirmationModalOpen}
        onClose={() => {
          setEmailConfirmationModalOpen(false);
          setNewUser(null);
        }}
        usuario={newUser}
      />

      <AccountSettingsModal
        isOpen={accountSettingsModalOpen}
        onClose={() => setAccountSettingsModalOpen(false)}
      />

      <ProfileSettingsModal
        isOpen={profileSettingsModalOpen}
        onClose={() => setProfileSettingsModalOpen(false)}
        usuario={usuarioAtual}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
