export const LOCALE_TO_NUMERIC_CODE: Record<string, string> = {
  ko: '410',
  ja: '392',
};

export const COUNTRY_CODE_TO_NUMERIC_CODE: Record<string, string> = {
  US: '840',
  GB: '826',
  CA: '124',
  NZ: '554',
  AU: '036',
  HK: '344',
  ZA: '710',
  SG: '702',
  MY: '458',
  PH: '608',
  IE: '372',
  IS: '352',
};

export function getCookieValue(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)countryCode=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getEnglishLanguageCode(): string {
  const countryCode = getCookieValue();
  return COUNTRY_CODE_TO_NUMERIC_CODE[countryCode ?? 'US'] ?? '840';
}
