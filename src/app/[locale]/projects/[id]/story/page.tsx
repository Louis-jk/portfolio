import { redirect } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { getPublicStoryUrl } from '@/entities/projects/lib/public-story-url';

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

  redirect(getPublicStoryUrl(locale, projectId));
}
