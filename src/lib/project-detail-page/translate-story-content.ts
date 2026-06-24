import { ChatOpenAI } from '@langchain/openai';
import type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
} from '@/modules/project-detail-page/types';
import {
  getBlockI18n,
  getBlockText,
  isI18nCodeBlock,
  isI18nTextBlock,
} from '@/lib/project-detail-page/block-utils';
import {
  protectNonTranslatableHtml,
  restoreNonTranslatableHtml,
} from '@/lib/project-detail-page/protect-translatable-html';
import {
  mapEditorBlocksWithPaths,
  walkEditorBlocksWithPaths,
} from '@/lib/project-detail-page/story-blocks';

const TARGET_LOCALE_LABEL: Record<'ja' | 'en', string> = {
  ja: 'Japanese',
  en: 'English',
};

type HtmlTranslationItem = {
  path: string;
  index: number;
  html: string;
  segments: string[];
  placeholderPrefix: string;
};

type CodeTranslationItem = {
  path: string;
  index: number;
  source: string;
};

function parseTranslationResponse(
  raw: string,
  items: Array<{ index: number }>,
): Map<number, string> {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Translation response was not valid JSON.');
  }

  const parsed = JSON.parse(jsonMatch[0]) as Array<{
    index?: number;
    html?: string;
    source?: string;
  }>;

  const map = new Map<number, string>();
  for (const entry of parsed) {
    const value =
      typeof entry.html === 'string'
        ? entry.html
        : typeof entry.source === 'string'
          ? entry.source
          : null;
    if (typeof entry.index !== 'number' || value === null) continue;
    map.set(entry.index, value);
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
  items: HtmlTranslationItem[],
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
Never translate placeholder tokens like ___NT_<id>_0___.
Never translate content inside code fences or pre/code blocks.
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

async function translateCodeBatch(
  items: CodeTranslationItem[],
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
    items.map((item) => ({ index: item.index, source: item.source })),
  );

  const response = await model.invoke([
    {
      role: 'system',
      content: `You translate portfolio project story code blocks from Korean to ${language}.
The input may contain Mermaid diagrams, ASCII art, or plain code.
Preserve diagram syntax, indentation, arrows, node IDs, and structure exactly.
Translate only human-readable labels inside node text, comments, and quoted strings.
Return ONLY a JSON array: [{"index":number,"source":"..."}] in the same order as input.
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

function getKoreanSourceText(block: EditorBlock): string {
  return getBlockText(block, 'ko').trim();
}

function targetAlreadyHasContent(
  block: EditorBlock,
  targetLocale: I18nLocale,
): boolean {
  const i18n = getBlockI18n(block);
  return Boolean(i18n?.[targetLocale]?.trim());
}

function applyTranslatedText(
  block: EditorBlock,
  translated: string,
): EditorBlock {
  if (isI18nCodeBlock(block.type)) {
    return {
      ...block,
      data: { code: translated },
    };
  }

  const nextData = { ...block.data };
  delete nextData.i18n;
  nextData.html = translated;

  return {
    ...block,
    data: nextData,
  };
}

export async function translateStoryContent(
  content: EditorOutput,
  targetLocale: 'ja' | 'en',
  options?: { overwrite?: boolean },
): Promise<EditorOutput> {
  const overwrite = options?.overwrite ?? false;
  const htmlItems: HtmlTranslationItem[] = [];
  const codeItems: CodeTranslationItem[] = [];

  walkEditorBlocksWithPaths(content.blocks, (block, path) => {
    const source = getKoreanSourceText(block);
    if (!source) return;
    if (!overwrite && targetAlreadyHasContent(block, targetLocale)) return;

    if (isI18nCodeBlock(block.type)) {
      codeItems.push({
        path,
        index: codeItems.length,
        source,
      });
      return;
    }

    if (!isI18nTextBlock(block.type)) return;

    const protectedSource = protectNonTranslatableHtml(source);
    htmlItems.push({
      path,
      index: htmlItems.length,
      html: protectedSource.html,
      segments: protectedSource.segments,
      placeholderPrefix: protectedSource.placeholderPrefix,
    });
  });

  const [htmlTranslations, codeTranslations] = await Promise.all([
    translateHtmlBatch(htmlItems, targetLocale),
    translateCodeBatch(codeItems, targetLocale),
  ]);

  const translatedByPath = new Map<string, string>();

  for (const item of htmlItems) {
    const translated = htmlTranslations.get(item.index);
    if (!translated) continue;
    translatedByPath.set(
      item.path,
      restoreNonTranslatableHtml(
        translated,
        item.segments,
        item.placeholderPrefix,
      ),
    );
  }

  for (const item of codeItems) {
    const translated = codeTranslations.get(item.index);
    if (!translated) continue;
    translatedByPath.set(item.path, translated);
  }

  const blocks: EditorBlock[] = mapEditorBlocksWithPaths(
    content.blocks,
    (block, path) => {
      const translated = translatedByPath.get(path);
      if (!translated) return block;
      return applyTranslatedText(block, translated);
    },
  );

  return {
    ...content,
    blocks,
    time: Date.now(),
  };
}
