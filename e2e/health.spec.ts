import { expect, test } from '@playwright/test';

test('health API returns JSON', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  await expect(res.json()).resolves.toEqual({ ok: true });
});
