import koMessages from '../../../messages/ko.json';
import enMessages from '../../../messages/en.json';
import jaMessages from '../../../messages/ja.json';
import { prisma } from '@/lib/prisma';
import { upsertRawPortfolioDocument } from '@/lib/rag/portfolio-documents';

const SOURCE_TYPE_BIO = 'bio';

type RootMessages = {
  homePage?: {
    intro?: {
      aboutMeTitle?: string;
      aboutMe?: string;
    };
  };
  meta?: {
    description?: string;
  };
};

const LOCALE_MESSAGES: Record<string, RootMessages> = {
  ko: koMessages as RootMessages,
  en: enMessages as RootMessages,
  ja: jaMessages as RootMessages,
};

function buildBioContent(messages: RootMessages) {
  const aboutTitle = messages.homePage?.intro?.aboutMeTitle ?? 'About Me';
  const aboutBody = messages.homePage?.intro?.aboutMe ?? '';
  const metaDescription = messages.meta?.description ?? '';

  return [
    `${aboutTitle}`,
    aboutBody,
    metaDescription ? `Meta Description:\n${metaDescription}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function upsertStaticPortfolioDocuments() {
  for (const [locale, messages] of Object.entries(LOCALE_MESSAGES)) {
    const content = buildBioContent(messages);
    if (!content.trim()) continue;

    await upsertRawPortfolioDocument({
      sourceType: SOURCE_TYPE_BIO,
      sourceId: 1,
      locale,
      title: messages.homePage?.intro?.aboutMeTitle ?? 'About Me',
      content,
      metadata: {
        sourceType: SOURCE_TYPE_BIO,
        sourceId: 1,
        locale,
        section: 'aboutMe',
        isPublic: true,
      },
    });
  }
}

export async function deleteStaticPortfolioDocuments() {
  await prisma.$executeRaw`
    DELETE FROM portfolio_documents
    WHERE source_type = ${SOURCE_TYPE_BIO}
      AND source_id = 1;
  `;
}
