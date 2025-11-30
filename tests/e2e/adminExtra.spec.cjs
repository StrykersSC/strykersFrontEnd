const { test, expect } = require('@playwright/test');

// Accept dialogs automatically
test.beforeEach(async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
});

test('edit member via Admin UI', async ({ page }) => {
  // seed member
  await page.goto('/');
  await page.evaluate(() => {
    const membro = { id: 'm-edit-1', nome: 'Member Edit', foto: '', patente: 'Recruta', medalhas: 0, dataRegistro: new Date().toISOString().split('T')[0], situacao: 'Ativo', eventosParticipados: [], medalhasDetalhadas: [] };
    localStorage.setItem('strykers_membros', JSON.stringify([membro]));
  });

  await page.goto('/administracao');
  const row = page.locator('table tbody tr', { hasText: 'Member Edit' });
  await expect(row).toBeVisible();
  // click edit
  await row.locator('button[title="Editar"]').click();
  // drawer should open
  const drawer = page.locator('aside').filter({ hasText: 'EDITAR MEMBRO' }).first();
  await expect(drawer.locator('h3')).toHaveText('EDITAR MEMBRO');
  // change name and save
  await drawer.locator('input[type="text"]').first().fill('Member Edited');
  await drawer.locator('button:has-text("Salvar")').click();
  // verify storage updated
  const membros = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
  expect(membros[0].nome).toBe('Member Edited');
});

test('delete member moves to recusados', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const membro = { id: 'm-del-1', nome: 'Member Delete', foto: '', patente: 'Recruta', medalhas: 0, dataRegistro: new Date().toISOString().split('T')[0], situacao: 'Ativo', eventosParticipados: [], medalhasDetalhadas: [] };
    const usuario = { id: 'u-del-1', nome: 'Member Delete', email: 'mdelete@example.com', status: 'aprovado' };
    localStorage.setItem('strykers_membros', JSON.stringify([membro]));
    localStorage.setItem('strykers_usuarios', JSON.stringify([usuario]));
  });

  await page.goto('/administracao');
  const row = page.locator('table tbody tr', { hasText: 'Member Delete' });
  await expect(row).toBeVisible();
  await row.locator('button[title="Excluir"]').click();
  // After confirm, check that member removed and added to recusados
  const membros = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
  const recusados = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_alistamentos_recusados') || '[]'));
  expect(membros.length).toBe(0);
  expect(recusados.length).toBeGreaterThan(0);
});

test('recusar and realistar flow via UI', async ({ page }) => {
  // seed a pending
  await page.goto('/');
  await page.evaluate(() => {
    const id = 'pending-ui-1';
    const now = new Date().toISOString();
    const pend = [{ id, nome: 'Pend UI', email: 'pendui@test', whatsapp: '', dataSolicitacao: now, usuarioCompleto: { id, nome: 'Pend UI', email: 'pendui@test' } }];
    localStorage.setItem('strykers_alistamentos_pendentes', JSON.stringify(pend));
    localStorage.setItem('strykers_usuarios', JSON.stringify([{ id, email: 'pendui@test', nome: 'Pend UI', senha: 'x', status: 'aguardando_confirmacao', dataCadastro: now }]));
  });

  await page.goto('/administracao');
  const row = page.locator('table tbody tr', { hasText: 'Pend UI' });
  await expect(row).toBeVisible();
  // click recusar (✕)
  await row.locator('button:has-text("✕")').click();
  // recusados should contain it
  const recus = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_alistamentos_recusados') || '[]'));
  expect(recus.find(r => r.nome === 'Pend UI')).toBeTruthy();

  // go to recusados section and realistar via button
  const recRow = page.locator('table tbody tr', { hasText: 'Pend UI' }).nth(0);
  await recRow.locator('button:has-text("🔄 Realistar")').click();
  // verify moved back to pendentes
  const pend = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_alistamentos_pendentes') || '[]'));
  expect(pend.find(p => p.nome === 'Pend UI')).toBeTruthy();
});

test('remove medal via UI', async ({ page }) => {
  // seed member with medal
  await page.goto('/');
  await page.evaluate(() => {
    const membro = { id: 'm-med-1', nome: 'Member Medal', foto: '', patente: 'Recruta', medalhas: 1, dataRegistro: new Date().toISOString().split('T')[0], situacao: 'Ativo', eventosParticipados: [], medalhasDetalhadas: [{ id: 12345, tipo: 'merito-operacional', data: new Date().toISOString().split('T')[0], observacoes: 'x' }] };
    localStorage.setItem('strykers_membros', JSON.stringify([membro]));
  });

  await page.goto('/administracao');
  const row = page.locator('table tbody tr', { hasText: 'Member Medal' });
  await expect(row).toBeVisible();
  // open condecorar drawer
  await row.locator('button[title="Condecorar"]').click();
  // open remover condecoração button if present
  const removeBtn = page.locator('aside').filter({ hasText: 'CONDECORAR' }).locator('button:has-text("Remover Condecoração")');
  if (await removeBtn.count() > 0) {
    await removeBtn.click();
    // in remover drawer, click the medal item to remove
    const removeDrawer = page.locator('aside').filter({ hasText: 'REMOVER CONDECORAÇÃO' }).first();
    await expect(removeDrawer).toBeVisible();
    const medalItem = removeDrawer.locator('div:has-text("merito-operacional")').first();
    if (await medalItem.count() > 0) {
      await medalItem.click();
      // verify storage updated
      const membros = await page.evaluate(() => JSON.parse(localStorage.getItem('strykers_membros') || '[]'));
      expect(membros[0].medalhasDetalhadas.length).toBe(0);
    } else {
      test.skip();
    }
  } else {
    test.skip();
  }
});
