import { listProjects } from '@/modules/projects/server';
import Home from '@/components/home/Home';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await listProjects(locale);

  return <Home projects={projects} />;
}
