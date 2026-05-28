import { config } from 'dotenv';
import { prisma } from '../src/lib/prisma';
import { upsertProjectDocuments } from '../src/lib/rag/portfolio-documents';
import { upsertStaticPortfolioDocuments } from '../src/lib/rag/static-documents';

config({ path: '.env.local' });
config();

async function main() {
  const projects = await prisma.project.findMany({
    include: {
      translations: true,
    },
  });

  let processed = 0;
  for (const project of projects) {
    await upsertProjectDocuments({
      projectId: project.id,
      technologies: project.technologies,
      platformCategories: project.platformCategories,
      domainTags: project.domainTags,
      translations: project.translations.map((translation) => ({
        locale: translation.locale,
        title: translation.title,
        company: translation.company,
        region: translation.region,
        role: translation.role,
        overview: translation.overview,
        description: translation.description,
        challenges: translation.challenges,
        achievements: translation.achievements,
      })),
    });
    processed += 1;
    console.log(`Embedded project ${project.id} (${processed}/${projects.length})`);
  }

  console.log(`Done. Embedded ${processed} projects.`);
  await upsertStaticPortfolioDocuments();
  console.log('Done. Embedded static bio/about documents.');
}

main()
  .catch((error) => {
    console.error('Failed to embed existing projects:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
