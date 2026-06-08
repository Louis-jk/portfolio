import { NextResponse } from 'next/server';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const CHAT_RATE_LIMIT = { limit: 15, windowMs: 60_000 };
const MAX_MESSAGE_LENGTH = 2_000;

type ChatBody = {
  message?: string;
  locale?: string;
};

const STACK_ALIASES: Record<string, string[]> = {
  'Next.js': ['next.js', 'nextjs'],
  'React Native': ['react native', 'react-native', 'reactnative'],
  Electron: ['electron'],
};

function detectRequestedStacks(question: string) {
  const normalized = question.toLowerCase();
  return Object.entries(STACK_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => normalized.includes(alias)))
    .map(([stack]) => stack);
}

function normalizeStackToken(value: string) {
  return value.toLowerCase().replace(/[\s._-]/g, '');
}

function docMatchesStacks(
  doc: { metadata?: Record<string, unknown>; pageContent?: string },
  stacks: string[],
) {
  if (stacks.length === 0) return true;
  const tech = doc.metadata?.technologies;
  const normalizedTech = Array.isArray(tech)
    ? tech
        .filter((value): value is string => typeof value === 'string')
        .map((value) => normalizeStackToken(value))
    : [];
  const normalizedContent = normalizeStackToken(doc.pageContent ?? '');

  return stacks.every((stack) => {
    const aliases = STACK_ALIASES[stack] ?? [stack];
    return aliases.some((alias) => {
      const token = normalizeStackToken(alias);
      return normalizedTech.includes(token) || normalizedContent.includes(token);
    });
  });
}

function textMatchesRequestedStacks(texts: string[], stacks: string[]) {
  if (stacks.length === 0) return true;
  const normalizedTexts = texts.map((value) => normalizeStackToken(value));
  return stacks.every((stack) => {
    const aliases = STACK_ALIASES[stack] ?? [stack];
    return aliases.some((alias) => {
      const token = normalizeStackToken(alias);
      return normalizedTexts.some(
        (text) => text.includes(token) || token.includes(text),
      );
    });
  });
}

function buildSystemPrompt(locale: string) {
  const currentYear = new Date().getFullYear();
  const identity =
    locale === 'ja'
      ? 'フロントエンドエンジニア 金俊皓（キム・ジュノ）のAI'
      : locale === 'en'
        ? "frontend engineer Kim Junho's AI assistant"
        : '프론트엔드 엔지니어 김준호의 AI 비서';
  const languageInstruction =
    locale === 'ja'
      ? '응답은 반드시 자연스러운 일본어로 작성해라.'
      : locale === 'en'
        ? 'Respond in natural English only.'
        : '응답은 반드시 자연스러운 한국어로 작성해라.';

  return `너는 ${identity}다.
반드시 제공된 CONTEXT를 최우선으로 참고해서 사실 기반으로 답변해라.
CONTEXT에 없는 정보는 추측하지 말고, 모르면 모른다고 말한 뒤 사용자가 보고 싶은 항목을 구체적으로 물어봐라.
답변은 친절하고 간결하게 작성하고, 가능한 경우 프로젝트/경력의 근거를 짧게 덧붙여라.
${languageInstruction}

중요 규칙:
- 이름/자기소개 관련 질문에는 본인을 "AI"로 소개하고, 인물 이름은 locale 표기에 맞게 일관되게 사용해라.
- 오늘 기준 연도는 ${currentYear}년이다. 상대적인 기간(예: 경력 몇 년)은 반드시 ${currentYear}년 기준으로 계산해라.
- 김준호의 경력 정보는 "2011년부터 웹디자인/퍼블리싱 실무", "2020년부터 React 기반 프로젝트 다수 참여"를 기준으로 설명해라.
- 답변에서 "2023년 기준"처럼 과거 시점을 기본값으로 쓰지 마라.`;
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`chat:${clientIp}`, CHAT_RATE_LIMIT);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSec),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        },
      );
    }

    const body = (await req.json()) as ChatBody;
    const message = body.message?.trim();
    const locale = body.locale?.trim() || 'ko';

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `message must be at most ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      dimensions: 1536,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const requestedStacks = detectRequestedStacks(message);
    const metadataFilter: Record<string, unknown> = { locale, isPublic: true };
    if (requestedStacks.length > 0) {
      metadataFilter.sourceType = 'project';
    }

    const supabaseClient = createSupabaseAdminClient();
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: 'portfolio_documents',
      queryName: 'match_documents',
    });

    let docs = (
      await vectorStore.similaritySearch(message, 12, metadataFilter)
    ).filter((doc) => docMatchesStacks(doc, requestedStacks));

    // Fallback: if stack-specific filtering returned no docs, broaden retrieval
    // and apply stack matching in-memory for better recall.
    if (docs.length === 0 && requestedStacks.length > 0) {
      docs = (
        await vectorStore.similaritySearch(message, 20, { locale, isPublic: true })
      ).filter((doc) => docMatchesStacks(doc, requestedStacks));
    }

    let docsForLinks = docs;
    if (requestedStacks.length > 0) {
      // For stack-specific questions, fetch a wider candidate set so the UI can
      // show more matching project links (not just top semantic hits).
      docsForLinks = (
        await vectorStore.similaritySearch(message, 64, {
          locale,
          isPublic: true,
          sourceType: 'project',
        })
      ).filter((doc) => docMatchesStacks(doc, requestedStacks));
    }

    const relatedProjectIdsFromRag = Array.from(
      new Set(
        docsForLinks
          .filter(
            (doc) =>
              doc.metadata?.sourceType === 'project' &&
              typeof doc.metadata?.sourceId === 'number',
          )
          .map((doc) => Number(doc.metadata?.sourceId)),
      ),
    );

    let relatedProjectIds = relatedProjectIdsFromRag;
    if (relatedProjectIdsFromRag.length > 0) {
      // Show all matching projects for the current locale.
      // If a specific stack is requested, include all projects that match that stack only.
      // Otherwise, include all locale projects.
      const allLocaleProjects = await prisma.project.findMany({
        where: {
          isPublic: true,
          translations: {
            some: { locale },
          },
        },
        select: {
          id: true,
          technologies: true,
          tools: {
            select: {
              development: true,
            },
          },
        },
      });

      if (requestedStacks.length > 0) {
        relatedProjectIds = allLocaleProjects
          .filter((project) =>
            textMatchesRequestedStacks(
              [...project.technologies, ...(project.tools?.development ?? [])],
              requestedStacks,
            ),
          )
          .map((project) => project.id);
      } else {
        relatedProjectIds = allLocaleProjects.map((project) => project.id);
      }
    }
    const context = docs
      .slice(0, 8)
      .map((doc, index) => {
        const title = (doc.metadata?.title as string | undefined) ?? '';
        const similarity = doc.metadata?.similarity;
        const score =
          typeof similarity === 'number' ? ` (similarity: ${similarity})` : '';
        return `#${index + 1} ${title}${score}\n${doc.pageContent}`;
      })
      .join('\n\n---\n\n');

    const prompt = PromptTemplate.fromTemplate(
      `{systemPrompt}

CONTEXT:
{context}

USER QUESTION:
{question}

ANSWER:`,
    );

    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const stream = await chain.stream({
      systemPrompt: buildSystemPrompt(locale),
      context: context || '관련 문서를 찾지 못했습니다.',
      question: message,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'x-rag-project-ids': relatedProjectIds.join(','),
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
