import { OpenAIEmbeddings } from '@langchain/openai';
import { prisma } from '@/lib/prisma';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const SOURCE_TYPE_PROJECT = 'project';

type TranslationInput = {
  locale: string;
  title: string;
  company: string;
  region: string;
  role: string;
  overview: string;
  description: string[];
  challenges: string[];
  achievements: string[];
};

type RawDocumentInput = {
  sourceType: string;
  sourceId: number;
  locale: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
};

function getEmbeddingsClient() {
  return new OpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSION,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

function normalizeLines(lines: string[] | undefined) {
  return (lines ?? []).filter(Boolean).join('\n');
}

function buildDocumentContent(translation: TranslationInput) {
  const sections = [
    `Title: ${translation.title}`,
    `Company: ${translation.company}`,
    `Region: ${translation.region}`,
    `Role: ${translation.role}`,
    `Overview: ${translation.overview}`,
    `Description:\n${normalizeLines(translation.description)}`,
    `Challenges:\n${normalizeLines(translation.challenges)}`,
    `Achievements:\n${normalizeLines(translation.achievements)}`,
  ];

  return sections.filter((section) => section.trim().length > 0).join('\n\n');
}

function toVectorLiteral(vector: number[]) {
  return `[${vector.join(',')}]`;
}

export async function upsertProjectDocuments(args: {
  projectId: number;
  technologies?: string[];
  platformCategories?: string[];
  domainTags?: string[];
  translations: TranslationInput[];
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for embedding generation');
  }

  const embeddings = getEmbeddingsClient();

  for (const translation of args.translations) {
    const content = buildDocumentContent(translation);
    if (!content.trim()) continue;

    const [vector] = await embeddings.embedDocuments([content]);
    const vectorLiteral = toVectorLiteral(vector);

    const metadata = {
      sourceType: SOURCE_TYPE_PROJECT,
      sourceId: args.projectId,
      locale: translation.locale,
      title: translation.title,
      company: translation.company,
      role: translation.role,
      technologies: args.technologies ?? [],
      platformCategories: args.platformCategories ?? [],
      domainTags: args.domainTags ?? [],
    };

    await prisma.$executeRaw`
      INSERT INTO portfolio_documents
      (source_type, source_id, locale, title, content, metadata, embedding, updated_at)
      VALUES
      (${SOURCE_TYPE_PROJECT}, ${args.projectId}, ${translation.locale}, ${translation.title}, ${content}, ${JSON.stringify(metadata)}::jsonb, ${vectorLiteral}::vector, NOW())
      ON CONFLICT (source_type, source_id, locale)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        metadata = EXCLUDED.metadata,
        embedding = EXCLUDED.embedding,
        updated_at = NOW();
    `;
  }
}

export async function upsertRawPortfolioDocument(args: RawDocumentInput) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for embedding generation');
  }

  const embeddings = getEmbeddingsClient();
  const [vector] = await embeddings.embedDocuments([args.content]);
  const vectorLiteral = toVectorLiteral(vector);

  await prisma.$executeRaw`
    INSERT INTO portfolio_documents
    (source_type, source_id, locale, title, content, metadata, embedding, updated_at)
    VALUES
    (${args.sourceType}, ${args.sourceId}, ${args.locale}, ${args.title}, ${args.content}, ${JSON.stringify(args.metadata)}::jsonb, ${vectorLiteral}::vector, NOW())
    ON CONFLICT (source_type, source_id, locale)
    DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      metadata = EXCLUDED.metadata,
      embedding = EXCLUDED.embedding,
      updated_at = NOW();
  `;
}

export async function deleteProjectDocuments(projectId: number) {
  await prisma.$executeRaw`
    DELETE FROM portfolio_documents
    WHERE source_type = ${SOURCE_TYPE_PROJECT}
      AND source_id = ${projectId};
  `;
}
