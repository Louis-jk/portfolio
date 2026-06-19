const HEADER_LEVEL_CLASSES: Record<number, string> = {
  1: 'text-3xl font-black tracking-tight leading-tight sm:text-4xl',
  2: 'text-2xl font-black tracking-tight leading-tight sm:text-3xl',
  3: 'text-xl font-bold tracking-tight leading-snug sm:text-2xl',
  4: 'text-lg font-bold tracking-tight leading-snug sm:text-xl',
  5: 'text-base font-semibold leading-snug sm:text-lg',
  6: 'text-base font-semibold leading-snug',
};

export function getHeaderLevelClass(level: number): string {
  const clamped = Math.min(Math.max(level, 1), 6);
  return HEADER_LEVEL_CLASSES[clamped] ?? HEADER_LEVEL_CLASSES[2];
}
