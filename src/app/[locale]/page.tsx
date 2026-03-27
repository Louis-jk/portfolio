'use server';

import { getProjectsByLocale } from '@/services/project-service';
import HomeClient from './HomeClient';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await getProjectsByLocale(locale);

  return <HomeClient projects={projects} />;
}
