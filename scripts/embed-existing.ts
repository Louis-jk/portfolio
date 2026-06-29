import { config } from 'dotenv';
import { upsertProjectDocuments } from '../src/lib/rag/portfolio-documents';
import { upsertStaticPortfolioDocuments } from '../src/lib/rag/static-documents';
import { fetchAllProjects } from '../src/entities/projects/server/projects.repository';
import { toProjectAdminView } from '../src/entities/projects/lib/projects.mapper';
import { buildProjectIndexingInputFromAdmin } from '../src/entities/projects/server/projects.service';

config({ path: '.env.local' });
config();

async function main() {
  const projects = (await fetchAllProjects())
    .map(toProjectAdminView)
    .filter((project) => project.isPublic);

  let processed = 0;
  for (const project of projects) {
    await upsertProjectDocuments(buildProjectIndexingInputFromAdmin(project));
    processed += 1;
    console.log(`Embedded project ${project.id} (${processed}/${projects.length})`);
  }

  console.log(`Done. Embedded ${processed} projects.`);
  await upsertStaticPortfolioDocuments();
  console.log('Done. Embedded static bio/about documents.');
}

main().catch((error) => {
  console.error('Failed to embed existing projects:', error);
  process.exit(1);
});
