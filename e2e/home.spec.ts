import { expect, test } from '@playwright/test';
import { gotoHome, hasDatabase, HOME_LOCALES } from './helpers';

test.describe('Localized home', () => {
  for (const locale of HOME_LOCALES) {
    test(`renders the hero on /${locale} when the database is available`, async ({
      page,
    }) => {
      test.skip(
        !hasDatabase,
        'Home uses Prisma on the server; set DATABASE_URL to run this test.',
      );

      await gotoHome(page, locale);
      await expect(page).toHaveURL(new RegExp(`/${locale}`));
    });
  }
});
