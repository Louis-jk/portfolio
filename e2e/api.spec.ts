import { expect, test } from '@playwright/test';

test.describe('Public API', () => {
  test('health returns ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  test('chat rejects empty message', async ({ request }) => {
    const res = await request.post('/api/chat', {
      data: { message: '  ', locale: 'en' },
    });
    expect(res.status()).toBe(400);
    await expect(res.json()).resolves.toMatchObject({
      error: 'message is required',
    });
  });

  test('chat rejects oversized message', async ({ request }) => {
    const res = await request.post('/api/chat', {
      data: { message: 'x'.repeat(2_001), locale: 'en' },
    });
    expect(res.status()).toBe(400);
  });
});
