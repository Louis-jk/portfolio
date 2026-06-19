import { ChatOpenAI } from '@langchain/openai';
import type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  PartialI18n,
} from '@/modules/project-detail-page/types';
import {
  getBlockI18n,
  isI18nTextBlock,
} from '@/lib/project-detail-page/block-utils';

const TARGET_LOCALE_LABEL: Record<'ja' | 'en', string> = {
  ja: 'Japanese',
  en: 'English',
};

type TranslationItem = {
  index: number;
  html: string;
};

function parseTranslationResponse(
  raw: string,
  items: TranslationItem[],
): Map<number, string> {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Translation response was not valid JSON.');
  }

  const parsed = JSON.parse(jsonMatch[0]) as Array<{
    index?: number;
    html?: string;
  }>;

  const map = new Map<number, string>();
  for (const entry of parsed) {
    if (typeof entry.index !== 'number' || typeof entry.html !== 'string') {
      continue;
    }
    map.set(entry.index, entry.html);
  }

  if (map.size === 0) {
    throw new Error('Translation response contained no items.');
  }

  for (const item of items) {
    if (!map.has(item.index)) {
      throw new Error(`Missing translation for block index ${item.index}.`);
    }
  }

  return map;
}

async function translateHtmlBatch(
  items: TranslationItem[],
  targetLocale: 'ja' | 'en',
): Promise<Map<number, string>> {
  if (items.length === 0) return new Map();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.2,
    openAIApiKey: apiKey,
  });

  const language = TARGET_LOCALE_LABEL[targetLocale];
  const payload = JSON.stringify(
    items.map((item) => ({ index: item.index, html: item.html })),
  );

  const response = await model.invoke([
    {
      role: 'system',
      content: `You translate portfolio project story HTML from Korean to ${language}.
Preserve every HTML tag, attribute, and structure exactly.
Translate only human-readable text nodes.
Return ONLY a JSON array: [{"index":number,"html":"..."}] in the same order as input.
Do not wrap the JSON in markdown fences.`,
    },
    {
      role: 'user',
      content: payload,
    },
  ]);

  const content =
    typeof response.content === 'string'
      ? response.content
      : response.content
          .map((part) => ('text' in part ? part.text : ''))
          .join('');

  return parseTranslationResponse(content, items);
}

function mergeTranslatedI18n(
  i18n: PartialI18n,
  targetLocale: I18nLocale,
  translatedHtml: string,
  overwrite: boolean,
): PartialI18n {
  if (!overwrite && i18n[targetLocale]?.trim()) {
    return i18n;
  }
  return { ...i18n, [targetLocale]: translatedHtml };
}

export async function translateStoryContent(
  content: EditorOutput,
  targetLocale: 'ja' | 'en',
  options?: { overwrite?: boolean },
): Promise<EditorOutput> {
  const overwrite = options?.overwrite ?? false;
  const items: TranslationItem[] = [];

  content.blocks.forEach((block, index) => {
    if (!isI18nTextBlock(block.type)) return;
    const i18n = getBlockI18n(block);
    const source = i18n?.ko?.trim();
    if (!source) return;
    if (!overwrite && i18n?.[targetLocale]?.trim()) return;
    items.push({ index, html: source });
  });

  const translations = await translateHtmlBatch(items, targetLocale);

  const blocks: EditorBlock[] = content.blocks.map((block, index) => {
    const translated = translations.get(index);
    if (!translated) return block;

    const i18n = getBlockI18n(block) ?? {};
    return {
      ...block,
      data: {
        ...block.data,
        i18n: mergeTranslatedI18n(i18n, targetLocale, translated, overwrite),
      },
    };
  });

  return {
    ...content,
    blocks,
    time: Date.now(),
  };
}
