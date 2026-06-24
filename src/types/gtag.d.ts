export {};

declare global {
  interface Window {
    gtag?: (
      command: 'js' | 'config' | 'event',
      targetIdOrEventName: string,
      params?: Record<string, string | number | boolean>,
    ) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}
