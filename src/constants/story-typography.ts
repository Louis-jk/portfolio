/** Shared typography for public story + admin Editor.js blocks */

export const STORY_HEADER_LEVEL_CLASSES: Record<number, string> = {
  1: 'text-3xl font-black tracking-tight leading-tight sm:text-4xl',
  2: 'text-2xl font-black tracking-tight leading-tight sm:text-3xl',
  3: 'text-xl font-bold tracking-tight leading-snug sm:text-2xl',
  4: 'text-lg font-bold tracking-tight leading-snug sm:text-xl',
  5: 'text-base font-semibold leading-snug sm:text-lg',
  6: 'text-base font-semibold leading-snug',
};

export function getStoryHeaderLevelClass(level: number): string {
  const clamped = Math.min(Math.max(level, 1), 6);
  return STORY_HEADER_LEVEL_CLASSES[clamped] ?? STORY_HEADER_LEVEL_CLASSES[2];
}

/** Public story body — matches admin Editor.js contenteditable */
export const STORY_BODY_CLASS =
  'story-paragraph text-base leading-[1.7] text-slate-700 dark:text-slate-300';

/** Admin editor body */
export const STORY_EDITOR_BODY_CLASS = 'text-base leading-[1.7]';

/** Matches admin quote block */
export const STORY_QUOTE_CLASS =
  'border-l-4 border-purple-500 pl-4 italic text-zinc-600 dark:text-zinc-400';

/** Public story + admin code blocks — CJK-safe monospace (not Geist Mono). */
export const STORY_CODE_BLOCK_CLASS =
  'story-code-block overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100 p-4 text-base text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300';

export const STORY_CODE_SURFACE_CLASS =
  'rounded-xl border border-zinc-200 bg-zinc-100 dark:border-slate-800 dark:bg-slate-900';
