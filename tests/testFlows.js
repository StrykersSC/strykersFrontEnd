const fs = require('fs');
const path = require('path');

// Simple JSON-backed storage to emulate localStorage used by the app
const DATA_FILE = path.resolve(__dirname, 'localstorage.json');

function readStorage() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeStorage(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

function getItem(key) {
  const s = readStorage();
  return s[key] === undefined ? null : JSON.stringify(s[key]);
}

function setItem(key, valueStr) {
  const s = readStorage();
  try {
    s[key] = JSON.parse(valueStr);
  } catch {
    s[key] = valueStr;
  }
  writeStorage(s);
}

function clear() {
  writeStorage({});
}

function logState(keys) {
  const s = readStorage();
  keys.forEach((k) => {
    console.log('---', k, '---');
    console.log(JSON.stringify(s[k] || [], null, 2));
  });
}

// Helpers used in tests
function generateUser(email, nome) {
  return {
    id: Date.now().toString() + Math.floor(Math.random() * 1000),
    email,
    senha: 'senha123',
    nome,
    whatsapp: '',
    status: 'aguardando_confirmacao',
    dataCadastro: new Date().toISOString(),
    codigoConfirmacao: Math.floor(100000 + Math.random() * 900000).toString(),
  };
}

function createEvent(
  nome,
  categoria = 'treinamento',
  data = new Date().toISOString().split('T')[0]
) {
  return {
    id: Date.now().toString() + Math.floor(Math.random() * 1000),
    nome,
    categoria,
    data,
    horario: '20:00',
    descricao: 'Descrição de teste',
    participantes: [],
    finalizado: false,
  };
}

// Using the original medal keys present in src/constants/medalhas.js
const TEST_MEDAL_KEY = 'merito-operacional';

function assert(condition, msg) {
  if (!condition) throw new Error('Assertion failed: ' + msg);
}

async function run() {
  console.log('Starting integration-style flows tests (storage-backed)');
  clear();

  // 1) Register a user
  const u1 = generateUser('test1@example.com', 'Test User One');
  const usuarios = [u1];
  setItem('strykers_usuarios', JSON.stringify(usuarios));
  console.log('Created user', u1.email, 'with code', u1.codigoConfirmacao);

  // 2) Confirm email (user enters code)
  let us = JSON.parse(getItem('strykers_usuarios'));
  const idx = us.findIndex((x) => x.id === u1.id);
  assert(idx !== -1, 'user should exist');
  if (us[idx].codigoConfirmacao === u1.codigoConfirmacao) {
    us[idx].status = 'aguardando_aprovacao';
    us[idx].dataConfirmacao = new Date().toISOString();
    setItem('strykers_usuarios', JSON.stringify(us));
    // add to pendentes
    const pend = JSON.parse(getItem('strykers_alistamentos_pendentes') || '[]');
    pend.push({
      id: us[idx].id,
      nome: us[idx].nome,
      email: us[idx].email,
      whatsapp: us[idx].whatsapp,
      dataSolicitacao: us[idx].dataConfirmacao,
      usuarioCompleto: us[idx],
    });
    setItem('strykers_alistamentos_pendentes', JSON.stringify(pend));
    console.log('Confirmed email and added to pendentes');
  } else {
    throw new Error('Confirmation code mismatch');
  }

  // 3) Admin approves the user -> becomes membro
  let pendentes = JSON.parse(
    getItem('strykers_alistamentos_pendentes') || '[]'
  );
  const pIdx = pendentes.findIndex((p) => p.id === u1.id);
  assert(pIdx !== -1, 'pendente should exist');
  const alist = pendentes[pIdx];
  const novoMembro = {
    id: alist.id + '-' + Date.now(),
    nome: alist.nome,
    foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      alist.nome
    )}&background=0f172a&color=22d3ee&size=150`,
    patente: 'Recruta',
    atribuicao: 'Infantaria',
    medalhas: 0,
    dataRegistro: new Date().toISOString().split('T')[0],
    situacao: 'Ativo',
    missoes: 0,
    forcaEspecial: 'Não',
    observacoes: '',
    eventosParticipados: [],
    historico: '',
    valorHistorico: 0,
    medalhasDetalhadas: [],
  };
  setItem('strykers_membros', JSON.stringify([novoMembro]));
  // update usuarios status approved
  us = JSON.parse(getItem('strykers_usuarios'));
  us = us.map((x) =>
    x.id === u1.id
      ? { ...x, status: 'aprovado', dataAprovacao: new Date().toISOString() }
      : x
  );
  setItem('strykers_usuarios', JSON.stringify(us));
  // remove from pendentes
  pendentes = pendentes.filter((p) => p.id !== u1.id);
  setItem('strykers_alistamentos_pendentes', JSON.stringify(pendentes));
  console.log('Approved alistamento and created membro', novoMembro.id);

  // 4) Create another user and reject it
  const u2 = generateUser('test2@example.com', 'Reject User');
  const allUsers = JSON.parse(getItem('strykers_usuarios') || '[]');
  allUsers.push(u2);
  setItem('strykers_usuarios', JSON.stringify(allUsers));
  // simulate confirmation and then rejection
  // mark confirmado -> pendente
  u2.status = 'aguardando_confirmacao';
  setItem('strykers_usuarios', JSON.stringify(allUsers));
  // push to recusados directly as admin rejects
  const recusados = JSON.parse(
    getItem('strykers_alistamentos_recusados') || '[]'
  );
  recusados.push({
    id: u2.id,
    nome: u2.nome,
    email: u2.email,
    whatsapp: u2.whatsapp,
    dataSolicitacao: new Date().toISOString(),
    usuarioCompleto: u2,
  });
  setItem('strykers_alistamentos_recusados', JSON.stringify(recusados));
  // update user status
  let us2 = JSON.parse(getItem('strykers_usuarios'));
  us2 = us2.map((x) =>
    x.id === u2.id
      ? { ...x, status: 'recusado', dataRecusa: new Date().toISOString() }
      : x
  );
  setItem('strykers_usuarios', JSON.stringify(us2));
  console.log('Created and rejected user', u2.email);

  // 5) Realistar u2 (move from recusados to pendentes and mark status)
  let rec = JSON.parse(getItem('strykers_alistamentos_recusados') || '[]');
  const rIdx = rec.findIndex((r) => r.id === u2.id);
  assert(rIdx !== -1, 'recusado should exist');
  const reEntry = { ...rec[rIdx], dataSolicitacao: new Date().toISOString() };
  let pend = JSON.parse(getItem('strykers_alistamentos_pendentes') || '[]');
  pend.push(reEntry);
  setItem('strykers_alistamentos_pendentes', JSON.stringify(pend));
  rec = rec.filter((x) => x.id !== u2.id);
  setItem('strykers_alistamentos_recusados', JSON.stringify(rec));
  us2 = JSON.parse(getItem('strykers_usuarios'));
  us2 = us2.map((x) =>
    x.id === u2.id ? { ...x, status: 'aguardando_aprovacao' } : x
  );
  setItem('strykers_usuarios', JSON.stringify(us2));
  console.log('Realistado usuário', u2.email);

  // 6) Excluir u2 permanently (simulate admin delete from recusados)
  // first mark in recusados again
  const recus = JSON.parse(getItem('strykers_alistamentos_recusados') || '[]');
  // add and then delete
  const newRec = [
    ...recus,
    {
      id: 'temp-del',
      nome: 'Temp',
      email: 't@t',
      whatsapp: '',
      dataSolicitacao: new Date().toISOString(),
    },
  ];
  setItem('strykers_alistamentos_recusados', JSON.stringify(newRec));
  // delete that temp
  const filteredRec = newRec.filter((r) => r.id !== 'temp-del');
  setItem('strykers_alistamentos_recusados', JSON.stringify(filteredRec));
  console.log('Simulated exclusion flow (temp entry)');

  // 7) Create event and link member
  const ev = createEvent('Evento Teste');
  setItem('strykers_eventos', JSON.stringify([ev]));
  console.log('Created event', ev.id);

  // link membro to event
  let membros = JSON.parse(getItem('strykers_membros') || '[]');
  assert(membros.length > 0, 'membros should exist');
  const membro = membros[0];
  // add participant to event
  let eventos = JSON.parse(getItem('strykers_eventos') || '[]');
  eventos = eventos.map((e) =>
    e.id === ev.id
      ? {
          ...e,
          participantes: [
            ...(e.participantes || []),
            { id: membro.id, nome: membro.nome, foto: membro.foto },
          ],
        }
      : e
  );
  setItem('strykers_eventos', JSON.stringify(eventos));
  // add event to membro.eventosParticipados
  membros = membros.map((m) =>
    m.id === membro.id
      ? {
          ...m,
          eventosParticipados: [
            ...(m.eventosParticipados || []),
            { eventoId: ev.id, nome: ev.nome, data: ev.data },
          ],
        }
      : m
  );
  setItem('strykers_membros', JSON.stringify(membros));
  console.log('Linked membro to event');

  // 8) Give medal to member
  membros = JSON.parse(getItem('strykers_membros') || '[]');
  const target = membros[0];
  const medal = {
    id: Date.now(),
    tipo: TEST_MEDAL_KEY,
    data: new Date().toISOString().split('T')[0],
    observacoes: 'Condecorado por testes',
  };
  target.medalhasDetalhadas = target.medalhasDetalhadas || [];
  target.medalhasDetalhadas.push(medal);
  target.medalhas = target.medalhasDetalhadas.length;
  membros = membros.map((m) => (m.id === target.id ? target : m));
  setItem('strykers_membros', JSON.stringify(membros));
  console.log('Added medal to member', medal.id);

  // 9) Modify medal observation
  membros = JSON.parse(getItem('strykers_membros') || '[]');
  const t = membros[0];
  t.medalhasDetalhadas = t.medalhasDetalhadas.map((md) =>
    md.id === medal.id ? { ...md, observacoes: 'Observacao modificada' } : md
  );
  setItem('strykers_membros', JSON.stringify(membros));
  console.log('Modified medal observation');

  // 10) Remove medal
  membros = JSON.parse(getItem('strykers_membros') || '[]');
  const removed = membros[0];
  removed.medalhasDetalhadas = removed.medalhasDetalhadas.filter(
    (md) => md.id !== medal.id
  );
  removed.medalhas = removed.medalhasDetalhadas.length;
  setItem('strykers_membros', JSON.stringify(membros));
  console.log('Removed medal');

  // Final assertions
  const finalMembros = JSON.parse(getItem('strykers_membros') || '[]');
  assert(
    finalMembros[0].medalhas === 0,
    'member should have 0 medals after removal'
  );

  console.log('\nAll simulated flows completed successfully.');
  console.log('Final storage state:');
  logState([
    'strykers_usuarios',
    'strykers_membros',
    'strykers_eventos',
    'strykers_alistamentos_pendentes',
    'strykers_alistamentos_recusados',
  ]);
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
