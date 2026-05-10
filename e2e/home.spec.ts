import { expect, test } from '@playwright/test';

test.describe('Localized home', () => {
  test('renders the main heading on /en when the database is available', async ({
    page,
  }) => {
    test.skip(
      !process.env.DATABASE_URL,
      'Home uses Prisma on the server; set DATABASE_URL to run this test.',
    );

    await page.goto('/en');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Joonho Kim' }),
    ).toBeVisible({ timeout: 30_000 });
  });
});
