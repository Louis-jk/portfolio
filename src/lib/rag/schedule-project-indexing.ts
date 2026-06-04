import { after } from 'next/server';
import { upsertProjectDocuments } from '@/lib/rag/portfolio-documents';

type IndexingArgs = Parameters<typeof upsertProjectDocuments>[0];

export function scheduleProjectIndexing(args: IndexingArgs, context: string) {
  after(async () => {
    try {
      await upsertProjectDocuments(args);
    } catch (error) {
      console.error(`⚠️ ${context} background indexing failed:`, {
        projectId: args.projectId,
        error,
      });
    }
  });
}
