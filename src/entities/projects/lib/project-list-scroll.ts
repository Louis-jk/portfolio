import type Lenis from 'lenis';

const VISIBILITY_MARGIN = 5;
const SCROLL_DELAY_MS = 20;

export function getScrollOffsetToRevealItem(
  scrollContainer: HTMLElement,
  itemEl: HTMLElement,
): number | null {
  const containerRect = scrollContainer.getBoundingClientRect();
  const itemRect = itemEl.getBoundingClientRect();

  const isFullyVisible =
    itemRect.top >= containerRect.top - VISIBILITY_MARGIN &&
    itemRect.bottom <= containerRect.bottom + VISIBILITY_MARGIN;

  if (isFullyVisible) return null;

  if (itemRect.top < containerRect.top - VISIBILITY_MARGIN) {
    return Math.max(0, itemEl.offsetTop);
  }

  if (itemRect.bottom > containerRect.bottom + VISIBILITY_MARGIN) {
    return (
      itemEl.offsetTop - scrollContainer.clientHeight + itemEl.offsetHeight
    );
  }

  return null;
}

export function getCenteredScrollOffset(
  scrollContainer: HTMLElement,
  itemEl: HTMLElement,
): number {
  const containerHeight = scrollContainer.clientHeight;
  const itemHeight = itemEl.offsetHeight;
  return itemEl.offsetTop - (containerHeight - itemHeight) / 2;
}

export function scrollLenisTo(
  lenis: Lenis,
  offset: number,
  delayMs = SCROLL_DELAY_MS,
) {
  setTimeout(() => {
    lenis.scrollTo(offset);
  }, delayMs);
}

export function isSameProjectId(
  a: string | number | undefined | null,
  b: string | number | undefined | null,
): boolean {
  if (a == null || b == null) return false;
  return a.toString() === b.toString();
}
