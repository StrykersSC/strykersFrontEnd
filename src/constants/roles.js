// Definição de roles do sistema
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
};

// Hierarquia de permissões (roles superiores herdam permissões dos inferiores)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.ADMIN]: 2,
  [ROLES.USER]: 1,
};

// Permissões específicas por role
export const PERMISSIONS = {
  // Permissões de Administração
  VIEW_ADMIN_PANEL: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  MANAGE_USERS: [ROLES.SUPER_ADMIN],
  MANAGE_ROLES: [ROLES.SUPER_ADMIN],
  APPROVE_ENLISTMENTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  MANAGE_MEMBERS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  MANAGE_EVENTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  AWARD_MEDALS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Permissões de Usuário
  VIEW_PROFILE: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  EDIT_OWN_PROFILE: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  VIEW_MEMBERS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  VIEW_EVENTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
};

// Labels amigáveis para exibição
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrador',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.USER]: 'Usuário',
};

// Badges coloridos para cada role
export const ROLE_BADGES = {
  [ROLES.SUPER_ADMIN]: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-700',
    icon: '👑',
  },
  [ROLES.ADMIN]: {
    bg: 'bg-cyan-600',
    text: 'text-white',
    border: 'border-cyan-700',
    icon: '⚜️',
  },
  [ROLES.USER]: {
    bg: 'bg-slate-600',
    text: 'text-white',
    border: 'border-slate-700',
    icon: '👤',
  },
};

/**
 * Verifica se um usuário tem uma permissão específica
 * @param {string} userRole - Role do usuário
 * @param {string} permission - Permissão a verificar
 * @returns {boolean}
 */
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
}

/**
 * Verifica se um role é superior a outro
 * @param {string} role1 - Primeiro role
 * @param {string} role2 - Segundo role
 * @returns {boolean}
 */
export function isRoleHigherThan(role1, role2) {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

/**
 * Retorna todos os roles disponíveis ordenados por hierarquia
 * @returns {Array}
 */
export function getAllRoles() {
  return Object.entries(ROLE_HIERARCHY)
    .sort(([, a], [, b]) => b - a)
    .map(([role]) => role);
}
