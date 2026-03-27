/** 플랫폼 카테고리 (web, mobile, desktop) */
export const PLATFORM_CATEGORIES = [
  'web',
  'web3',
  'mobile',
  'desktop',
] as const;
export type PlatformCategory = (typeof PLATFORM_CATEGORIES)[number];

/** 도메인/기술 태그 (blockchain, ai, ecommerce, booking, marketplace, delivery, b2b, conference, tourism, lifestyle 등) */
export const DOMAIN_TAGS = [
  'blockchain',
  'ai',
  'ecommerce',
  'booking',
  'marketplace',
  'delivery',
  'b2b',
  'conference',
  'tourism',
  'lifestyle',
] as const;
export type DomainTag = (typeof DOMAIN_TAGS)[number];
