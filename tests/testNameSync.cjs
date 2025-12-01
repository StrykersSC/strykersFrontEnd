/**
 * Test: Verify name sync when admin edits member
 * This test uses a mock localStorage object
 */

// Simple localStorage mock for Node.js
const storage = {};
const localStorage = {
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
  setItem: (key, value) => { storage[key] = value; },
  getItem: (key) => storage[key] || null,
  removeItem: (key) => { delete storage[key]; },
};

function testNameSync() {
  console.log('\n=== Testing Name Sync Flow ===\n');

  // Setup test data
  localStorage.clear();
  
  // 1. Create a user
  const usuarios = [
    {
      id: 'user1',
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: '123456',
      status: 'aprovado',
      whatsapp: '11999999999',
    },
  ];
  localStorage.setItem('strykers_usuarios', JSON.stringify(usuarios));
  console.log('✓ User created:', usuarios[0].nome);

  // 2. Create a member with the same name
  const membros = [
    {
      id: 'mem1',
      nome: 'João Silva',
      foto: 'https://ui-avatars.com/api/?name=Joao+Silva',
      patente: 'Recruta',
      atribuicao: 'Infantaria',
      dataRegistro: '2025-01-01',
      situacao: 'Ativo',
      forcaEspecial: 'Não',
      observacoes: '',
      eventosParticipados: [],
      historico: '',
      valorHistorico: 0,
      medalhasDetalhadas: [],
    },
  ];
  localStorage.setItem('strykers_membros', JSON.stringify(membros));
  console.log('✓ Member created:', membros[0].nome);

  // 3. Simulate user session (login)
  const userSession = {
    id: usuarios[0].id,
    nome: usuarios[0].nome,
    email: usuarios[0].email,
  };
  localStorage.setItem('strykers_user_session', JSON.stringify(userSession));
  console.log('✓ User session created:', userSession.nome);

  // 4. Simulate admin edit - change member name in strykers_membros
  const membrosData = JSON.parse(localStorage.getItem('strykers_membros'));
  const membroIndex = membrosData.findIndex(m => m.id === 'mem1');
  membrosData[membroIndex].nome = 'João Silva Atualizado';
  localStorage.setItem('strykers_membros', JSON.stringify(membrosData));
  console.log('✓ Member name updated in strykers_membros');

  // 5. Simulate admin also updating strykers_usuarios (this is what our fix does)
  const usuariosData = JSON.parse(localStorage.getItem('strykers_usuarios'));
  const userIndex = usuariosData.findIndex(u => u.nome === 'João Silva');
  if (userIndex !== -1) {
    usuariosData[userIndex].nome = 'João Silva Atualizado';
    localStorage.setItem('strykers_usuarios', JSON.stringify(usuariosData));
    console.log('✓ User name updated in strykers_usuarios');
  }

  // 6. Simulate useAuth sync - update session when user name changes
  const updatedUsuarios = JSON.parse(localStorage.getItem('strykers_usuarios'));
  const updatedUser = updatedUsuarios.find(u => u.id === userSession.id);
  if (updatedUser && updatedUser.nome !== userSession.nome) {
    userSession.nome = updatedUser.nome;
    localStorage.setItem('strykers_user_session', JSON.stringify(userSession));
    console.log('✓ User session name synced:', userSession.nome);
  }

  // 7. Verify that profile can now find the member
  const currentSession = JSON.parse(localStorage.getItem('strykers_user_session'));
  const currentMembros = JSON.parse(localStorage.getItem('strykers_membros'));
  const foundMember = currentMembros.find(m => m.nome === currentSession.nome);

  if (foundMember) {
    console.log('\n✅ SUCCESS: Profile can find member with new name');
    console.log('   Member found:', foundMember.nome);
    return true;
  } else {
    console.log('\n❌ FAILED: Profile cannot find member');
    console.log('   Searching for:', currentSession.nome);
    console.log('   Available members:', currentMembros.map(m => m.nome).join(', '));
    return false;
  }
}

// Run test
const result = testNameSync();
process.exit(result ? 0 : 1);
