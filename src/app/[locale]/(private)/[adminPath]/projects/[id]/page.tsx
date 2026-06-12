import { getProjectById } from '@/modules/projects';
import { notFound } from 'next/navigation';
import ProjectPreviewClient from './ProjectPreviewClient';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) notFound();

  const project = await getProjectById(projectId);

  if (!project) notFound();

  const basePath = `/${locale}${ADMIN_ROUTES.PROJECTS}`;

  const serializedProject = {
    id: project.id,
    imageUrl: project.imageUrl,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() ?? null,
    isPublic: project.isPublic,
    technologies: project.technologies,
    platformCategories: project.platformCategories ?? [],
    domainTags: project.domainTags ?? [],
    title: project.title,
    company: project.company,
    region: project.region,
    role: project.role,
    overview: project.overview,
    description: project.description,
    challenges: project.challenges,
    achievements: project.achievements,
    platforms: project.platforms
      ? {
          webLink: project.platforms.webLink,
          iosLink: project.platforms.iosLink,
          androidLink: project.platforms.androidLink,
          desktopLink: project.platforms.desktopLink,
        }
      : null,
    tools: project.tools
      ? {
          development: project.tools.development,
          communication: project.tools.communication,
          design: project.tools.design,
          debugging: project.tools.debugging,
        }
      : null,
  };

  return (
    <ProjectPreviewClient
      project={serializedProject}
      basePath={basePath}
      locale={locale}
    />
  );
}
