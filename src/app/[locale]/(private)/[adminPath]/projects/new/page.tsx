import { ProjectForm } from '@/features/projects/admin';

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const defaultLocale =
    locale === 'ko' || locale === 'ja' || locale === 'en' ? locale : 'ko';

  return (
    <div className='py-10 bg-zinc-50 dark:bg-slate-950 min-h-screen'>
      <ProjectForm defaultLocale={defaultLocale} />
    </div>
  );
}
