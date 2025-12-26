import { ROLES } from '../constants/roles';

/**
 * Cria um super admin inicial se não existir nenhum
 * Execute esta função uma vez no console do navegador
 */
export function createInitialSuperAdmin() {
  const usuarios = JSON.parse(
    localStorage.getItem('strykers_usuarios') || '[]'
  );

  // Verificar se já existe um super admin
  const hasSuperAdmin = usuarios.some((u) => u.role === ROLES.SUPER_ADMIN);

  if (hasSuperAdmin) {
    console.log('✅ Já existe um Super Admin no sistema');
    return;
  }

  // Criar super admin inicial
  const superAdmin = {
    id: 'user-superadmin-' + Date.now(),
    nome: 'Super Admin',
    email: 'admin@strykers.com',
    senha: 'admin123', // ⚠️ ALTERE ESTA SENHA!
    whatsapp: '',
    role: ROLES.SUPER_ADMIN,
    status: 'aprovado',
    emailConfirmado: true,
    dataSolicitacao: new Date().toISOString(),
    dataAprovacao: new Date().toISOString(),
  };

  usuarios.push(superAdmin);
  localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));

  console.log('✅ Super Admin criado com sucesso!');
  console.log('📧 Email: admin@strykers.com');
  console.log('🔑 Senha: admin123');
  console.log('⚠️ ALTERE A SENHA IMEDWIATAMENTE!');
}

// Para executar no console do navegador:
// import { createInitialSuperAdmin } from './utils/initSuperAdmin';
// createInitialSuperAdmin();
