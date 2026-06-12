'use server';

import { listProjects } from '@/modules/projects';
import HomePage from '@/components/home/HomePage';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await listProjects(locale);

  return <HomePage projects={projects} />;
}
