/** Shared viewport breakpoints (px). */
export const BREAKPOINTS = {
  /** Project detail mobile upper bound (width < tabletMin). */
  mobileMax: 767,
  tabletMin: 768,
  desktopMin: 1224,
  /** Home shell stacked mobile layout: ≤768 */
  layoutMobileMax: 768,
  /** Home shell 2-column layout (Intro + list): 769–1279 (covers iPad portrait) */
  layoutShellTabletMin: 769,
  layoutShellTabletMax: 1279,
  /** Wide-layout behaviors (header scroll off, etc.): ≥1024 */
  layoutWideMin: 1024,
  layoutDesktopMin: 1280,
} as const;

/** Media query strings for `react-responsive` / `matchMedia`. */
export const mediaQueries = {
  /** Project detail phone: ≤767px */
  mobile: `(max-width: ${BREAKPOINTS.mobileMax}px)`,
  /** Project detail tablet panel: 768–1223px */
  tablet: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.desktopMin - 1}px)`,
  /** Project detail desktop: ≥1224px */
  desktopOrLaptop: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
  /** Home shell stacked mobile: ≤768px */
  layoutMobile: `(max-width: ${BREAKPOINTS.layoutMobileMax}px)`,
  /** Home shell 2-column: 769–1279px */
  layoutTablet: `(min-width: ${BREAKPOINTS.layoutShellTabletMin}px) and (max-width: ${BREAKPOINTS.layoutShellTabletMax}px)`,
  /** Home desktop shell + header inline filter: ≥1280px */
  layoutDesktop: `(min-width: ${BREAKPOINTS.layoutDesktopMin}px)`,
} as const;

/** Width < 768 — project detail / list mobile layout. */
export function isDetailMobileWidth(width: number): boolean {
  return width < BREAKPOINTS.tabletMin;
}

/** Width ≤ 768 — home shell stacked mobile. */
export function isLayoutMobileWidth(width: number): boolean {
  return width <= BREAKPOINTS.layoutMobileMax;
}

/** Home shell 2-column layout: 769–1279px. */
export function isLayoutShellTabletWidth(width: number): boolean {
  return (
    width >= BREAKPOINTS.layoutShellTabletMin &&
    width <= BREAKPOINTS.layoutShellTabletMax
  );
}

/** Home layout desktop: ≥1280px. */
export function isLayoutDesktopWidth(width: number): boolean {
  return width >= BREAKPOINTS.layoutDesktopMin;
}

/** Width ≥ 1024px — wide shell behaviors (header scroll, list item count). */
export function isAtLeastLayoutWideWidth(width: number): boolean {
  return width >= BREAKPOINTS.layoutWideMin;
}

/** Width < 1280px — drawer / compact shell. */
export function isBelowLayoutDesktopWidth(width: number): boolean {
  return width < BREAKPOINTS.layoutDesktopMin;
}

/** Project detail tablet panel: 768–1223px. */
export function isDetailTabletWidth(width: number): boolean {
  return width >= BREAKPOINTS.tabletMin && width < BREAKPOINTS.desktopMin;
}

/** Project detail desktop: ≥1224px. */
export function isDesktopOrLaptopWidth(width: number): boolean {
  return width >= BREAKPOINTS.desktopMin;
}
