import { expect, test } from '@playwright/test';
import {
  CHATBOT_LABELS,
  gotoHome,
  hasDatabase,
  HOME_LOCALES,
} from './helpers';

test.describe('Chatbot', () => {
  for (const locale of HOME_LOCALES) {
    test(`opens and closes on /${locale}`, async ({ page }) => {
      test.skip(
        !hasDatabase,
        'Chatbot lives on the home page; set DATABASE_URL to run this test.',
      );

      const labels = CHATBOT_LABELS[locale];
      await gotoHome(page, locale);

      await page.getByRole('button', { name: labels.open }).click();
      await expect(page.getByText(labels.title)).toBeVisible();
      await expect(page.getByPlaceholder(labels.placeholder)).toBeVisible();

      await page.getByRole('button', { name: labels.close }).click();
      await expect(page.getByText(labels.title)).not.toBeVisible();
    });
  }
});
