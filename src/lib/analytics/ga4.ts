/** GA4 measurement ID (`G-XXXXXXXX`). Universal Analytics (UA-*) is not supported. */
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? '';

/** Load GA4 only in production builds when a measurement ID is configured. */
export const GA4_ENABLED =
  process.env.NODE_ENV === 'production' && GA4_MEASUREMENT_ID.length > 0;

type Ga4EventParams = Record<string, string | number | boolean>;

export function trackGa4Event(eventName: string, params?: Ga4EventParams) {
  if (typeof window === 'undefined' || !GA4_ENABLED) return;
  window.gtag?.('event', eventName, params);
}

export function trackGa4PageView(pagePath: string, pageTitle?: string) {
  trackGa4Event('page_view', {
    page_path: pagePath,
    ...(pageTitle ? { page_title: pageTitle } : {}),
  });
}
