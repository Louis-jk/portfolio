import { listProjects } from '@/entities/projects/server';
import Home from '@/widgets/home';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await listProjects(locale);

  return <Home projects={projects} />;
}
