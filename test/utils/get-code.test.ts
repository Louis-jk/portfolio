import { beforeEach, describe, expect, it } from 'vitest';

import {
  getCookieValue,
  getEnglishLanguageCode,
} from '@/utils/get-code';

function clearCookies() {
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim();
    if (name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}

beforeEach(() => {
  clearCookies();
});

describe('getCookieValue', () => {
  it('returns null when countryCode cookie is absent', () => {
    document.cookie = '';
    expect(getCookieValue()).toBeNull();
  });

  it('reads countryCode from document.cookie', () => {
    document.cookie = 'countryCode=GB';
    expect(getCookieValue()).toBe('GB');
  });
});

describe('getEnglishLanguageCode', () => {
  it('maps GB cookie to 826', () => {
    document.cookie = 'countryCode=GB';
    expect(getEnglishLanguageCode()).toBe('826');
  });

  it('falls back to 840 when cookie is missing (defaults to US)', () => {
    document.cookie = '';
    expect(getEnglishLanguageCode()).toBe('840');
  });

  it('falls back to 840 for unknown country codes', () => {
    document.cookie = 'countryCode=ZZ';
    expect(getEnglishLanguageCode()).toBe('840');
  });
});
