import { redirect } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default async function PublicProjectStoryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    redirect('/');
  }

  const projectId = parseInt(id, 10);
  if (Number.isNaN(projectId)) {
    redirect(`/${locale}`);
  }

  redirect(`/${locale}?item=${projectId}&story=1`);
}
