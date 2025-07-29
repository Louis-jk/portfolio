import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import CrispChat from '@/components/crisp/CrispChat';
import BotPress from '@/components/chatbot/BotPress';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider>
        {children}
        {/* <CrispChat /> */}
        <BotPress />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
