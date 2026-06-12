import { expect, type Page } from '@playwright/test';

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const HOME_LOCALES = ['en', 'ko', 'ja'] as const;
export type HomeLocale = (typeof HOME_LOCALES)[number];

/** Waits for the intro hero after the loading screen. Requires DATABASE_URL. */
export async function gotoHome(page: Page, locale: HomeLocale) {
  await page.goto(`/${locale}`);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Joonho Kim' }),
  ).toBeVisible({ timeout: 30_000 });
}

export const CHATBOT_LABELS: Record<
  HomeLocale,
  { open: string; close: string; title: string; placeholder: string }
> = {
  en: {
    open: 'Open Chatbot',
    close: 'Close Chatbot',
    title: 'Portfolio Chatbot',
    placeholder: 'Type your question.',
  },
  ko: {
    open: '챗봇 열기',
    close: '챗봇 닫기',
    title: '포트폴리오 챗봇',
    placeholder: '질문을 입력해주세요.',
  },
  ja: {
    open: 'チャットボットを開く',
    close: 'チャットボットを閉じる',
    title: 'ポートフォリオ チャットボット',
    placeholder: '質問を入力してください。',
  },
};
