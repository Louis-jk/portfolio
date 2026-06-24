import { config } from 'dotenv';
import path from 'path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';
  const host = url.match(/@([^:/]+)/)?.[1] ?? 'unknown';

  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  const [projects, detailPages, publicStories] = await Promise.all([
    prisma.project.count(),
    prisma.projectDetailPage.count(),
    prisma.projectDetailPage.count({ where: { isPublic: true } }),
  ]);

  const latest = await prisma.project.findFirst({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true },
  });

  const detailSample = await prisma.projectDetailPage.findFirst({
    orderBy: { updatedAt: 'desc' },
    select: { projectId: true, isPublic: true, updatedAt: true, content: true },
  });

  const contentKeys =
    detailSample?.content && typeof detailSample.content === 'object'
      ? Object.keys(detailSample.content as Record<string, unknown>)
      : [];

  console.log(
    JSON.stringify(
      {
        host,
        projects,
        detailPages,
        publicStories,
        latestProject: latest,
        latestDetailPage: detailSample
          ? {
              projectId: detailSample.projectId,
              isPublic: detailSample.isPublic,
              updatedAt: detailSample.updatedAt,
              contentKeys,
            }
          : null,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
