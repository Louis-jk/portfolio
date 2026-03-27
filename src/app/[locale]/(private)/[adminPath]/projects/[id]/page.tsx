import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectPreviewClient from './ProjectPreviewClient';
import { ADMIN_ROUTES } from '@/lib/constants';

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      platforms: true,
      tools: true,
      translations: true,
    },
  });

  if (!project) notFound();

  const basePath = `/${locale}${ADMIN_ROUTES.PROJECTS}`;

  // Serialize for client component (Date -> ISO string)
  const serializedProject = {
    id: project.id,
    imageUrl: project.imageUrl,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() ?? null,
    isPublic: project.isPublic,
    technologies: project.technologies,
    platformCategories: project.platformCategories ?? [],
    domainTags: project.domainTags ?? [],
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
    translations: project.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      company: t.company,
      region: t.region,
      role: t.role,
      overview: t.overview,
      description: t.description,
      challenges: t.challenges,
      achievements: t.achievements,
      detailImage: t.detailImage,
    })),
  };

  return (
    <ProjectPreviewClient
      project={serializedProject}
      basePath={basePath}
      locale={locale}
    />
  );
}
