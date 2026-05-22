'use client';

import { useTranslations } from 'next-intl';
import { PLATFORM_CATEGORIES, DOMAIN_TAGS } from '@/lib/project-categories';

interface FilterPanelProps {
  platformFilter: string | null;
  domainFilter: string | null;
  onPlatformFilter: (cat: string | null) => void;
  onDomainFilter: (tag: string | null) => void;
  onReset: () => void;
  className?: string;
  /** PC 헤더 인라인: 한 줄로 표시, 넘치면 가로 스크롤 */
  inline?: boolean;
}

export default function FilterPanel({
  platformFilter,
  domainFilter,
  onPlatformFilter,
  onDomainFilter,
  onReset,
  className = '',
  inline = false,
}: FilterPanelProps) {
  const t = useTranslations('timeline.categories');

  return (
    <div
      className={`flex ${inline ? 'flex-row items-center' : 'flex-col'} gap-2 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`flex gap-1.5 items-center ${inline ? 'flex-nowrap' : 'flex-wrap'}`}
      >
        {PLATFORM_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type='button'
            onClick={() =>
              onPlatformFilter(platformFilter === cat ? null : cat)
            }
            className={`px-2.5 py-1 rounded text-xs font-medium transition shrink-0 cursor-pointer ${
              platformFilter === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {t(`platform.${cat}`)}
          </button>
        ))}
        {DOMAIN_TAGS.map((tag) => (
          <button
            key={tag}
            type='button'
            onClick={() => onDomainFilter(domainFilter === tag ? null : tag)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition shrink-0 cursor-pointer ${
              domainFilter === tag
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {t(`domain.${tag}`)}
          </button>
        ))}
        {(platformFilter || domainFilter) && (
          <button
            type='button'
            onClick={onReset}
            className='px-2.5 py-1 rounded text-xs text-gray-700 dark:text-gray-300 shrink-0 cursor-pointer'
          >
            ✕ {t('resetFilter')}
          </button>
        )}
      </div>
    </div>
  );
}
