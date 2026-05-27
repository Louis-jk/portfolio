export function withThemeTransition(update: () => void) {
  if (typeof document === 'undefined') {
    update();
    return;
  }

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !document.startViewTransition
  ) {
    update();
    return;
  }

  document.startViewTransition(update);
}
