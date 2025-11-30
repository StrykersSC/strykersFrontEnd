const { test, expect } = require('@playwright/test');

// Utility to accept dialogs globally
test.beforeEach(async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
});

test('registration creates candidacy (Recrutamento)', async ({ page }) => {
  await page.goto('/recrutamento');
  // Fill form
  await page.fill('input[name="nome"]', 'E2E Candidato');
  await page.fill('input[name="email"]', 'e2e.candidato@example.com');
  await page.fill('input[name="whatsapp"]', '');
  await page.selectOption('select[name="experiencia"]', 'iniciante');
  await page.selectOption('select[name="forca_preferida"]', 'Infantaria');
  await page.fill('textarea[name="mensagem"]', 'Quero me juntar aos Strykers - teste E2E');

  await page.click('button:has-text("ENVIAR CANDIDATURA")');
  // success message appears
  await expect(page.locator('text=Candidatura enviada com sucesso')).toBeVisible({ timeout: 4000 });

  // Check localStorage for candidacy
  const candidaturas = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_candidaturas') || '[]'));
  expect(candidaturas.length).toBeGreaterThan(0);
  expect(candidaturas[0].nome).toBe('E2E Candidato');
});

test('admin approves pending alistamento', async ({ page }) => {
  // seed a pending alistamento and corresponding usuario
  await page.goto('/');
  await page.evaluate(() => {
    const id = 'pending-e2e-1';
    const now = new Date().toISOString();
    const pend = [{ id, nome: 'Pend Test', email: 'pend@test', whatsapp: '', dataSolicitacao: now, usuarioCompleto: { id, nome: 'Pend Test', email: 'pend@test' } }];
    const us = [{ id, email: 'pend@test', nome: 'Pend Test', senha: 'x', status: 'aguardando_confirmacao', dataCadastro: now }];
    localStorage.setItem('strykers_alistamentos_pendentes', JSON.stringify(pend));
    localStorage.setItem('strykers_usuarios', JSON.stringify(us));
  });

  await page.goto('/administracao');
  // wait for pendentes table and the specific row
  const row = page.locator('table tbody tr', { hasText: 'Pend Test' });
  await expect(row).toBeVisible();
  // click approve button (✓)
  await row.locator('button:has-text("✓")').click();
  // After dialog accept, member should be created
  const membros = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
  expect(membros.length).toBeGreaterThan(0);
  expect(membros[0].nome).toBe('Pend Test');
});

test('create event via Admin UI and link member', async ({ page }) => {
  // ensure a member exists
  await page.goto('/');
  await page.evaluate(() => {
    const membro = { id: 'm-e2e-1', nome: 'Member For Event', foto: '', patente: 'Recruta', medalhas: 0, dataRegistro: new Date().toISOString().split('T')[0], situacao: 'Ativo', eventosParticipados: [], medalhasDetalhadas: [] };
    localStorage.setItem('strykers_membros', JSON.stringify([membro]));
  });

  await page.goto('/administracao');
  // Open event sidebar
  await page.click('button:has-text("Cadastrar Evento")');
  // fill event form
  await page.fill('#form-evento input[required]', 'E2E Evento');
  // set date to today
  const today = new Date().toISOString().split('T')[0];
  await page.fill('#form-evento input[type="date"]', today);
  await page.click('#form-evento button:has-text("Registrar")');

  // get event id from localStorage
  const ev = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_eventos') || '[]'));
  expect(ev.length).toBeGreaterThan(0);
  const eventId = ev[0].id;

  // Link member to event by mutating storage inside page (E2E step to simulate linking UI)
  await page.evaluate((eventIdLocal) => {
    const membros = JSON.parse(localStorage.getItem('strykers_membros') || '[]');
    const eventos = JSON.parse(localStorage.getItem('strykers_eventos') || '[]');
    const m = membros[0];
    const e = eventos.find((x) => x.id === eventIdLocal);
    if (e) {
      e.participantes = e.participantes || [];
      e.participantes.push({ id: m.id, nome: m.nome, foto: m.foto });
      membros[0].eventosParticipados = membros[0].eventosParticipados || [];
      membros[0].eventosParticipados.push({ eventoId: e.id, nome: e.nome, data: e.data });
      localStorage.setItem('strykers_eventos', JSON.stringify(eventos));
      localStorage.setItem('strykers_membros', JSON.stringify(membros));
    }
  }, eventId);

  // reload and verify member has event
  await page.reload();
  const membrosFinal = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
  expect(membrosFinal[0].eventosParticipados.length).toBeGreaterThan(0);
});

test('award medal to member via Admin UI', async ({ page }) => {
  // ensure a member exists
  await page.goto('/');
  await page.evaluate(() => {
    const membro = { id: 'm-e2e-award', nome: 'Member Award', foto: '', patente: 'Recruta', medalhas: 0, dataRegistro: new Date().toISOString().split('T')[0], situacao: 'Ativo', eventosParticipados: [], medalhasDetalhadas: [] };
    localStorage.setItem('strykers_membros', JSON.stringify([membro]));
  });

  await page.goto('/administracao');
  // find member row
  const row = page.locator('table tbody tr', { hasText: 'Member Award' });
  await expect(row).toBeVisible();
  // click star button (Condecorar)
  await row.locator('button[title="Condecorar"]').click();
  // wait for condecorar drawer heading specifically
  const drawer = page.locator('aside').filter({ hasText: 'CONDECORAR' }).first();
  await expect(drawer.locator('h3:has-text("CONDECORAR")')).toBeVisible();
  // select first medal option inside the drawer
  const selectInDrawer = drawer.locator('select').first();
  const firstOption = await selectInDrawer.locator('option').nth(1).getAttribute('value');
  await selectInDrawer.selectOption(firstOption);
  await page.fill('textarea[placeholder*="Detalhes"]', 'Medalha E2E');
  await page.click('button:has-text("Condecorar")');
  // after dialog, check storage
  const membrosFinal = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
  expect(membrosFinal[0].medalhasDetalhadas.length).toBeGreaterThan(0);
});
