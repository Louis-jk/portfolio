'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type HomeFilters = {
  platformFilter: string | null;
  domainFilter: string | null;
  isFilterOpen: boolean;
};

function readFiltersFromSearchParams(searchParams: URLSearchParams): HomeFilters {
  return {
    platformFilter: searchParams.get('platform'),
    domainFilter: searchParams.get('domain'),
    isFilterOpen: searchParams.get('filter') === 'open',
  };
}

function writeFiltersToUrl(next: {
  platform?: string | null;
  domain?: string | null;
  isFilterOpen?: boolean;
}) {
  const url = new URL(window.location.href);
  const currentPlatform = url.searchParams.get('platform');
  const currentDomain = url.searchParams.get('domain');
  const currentOpen = url.searchParams.get('filter') === 'open';

  const nextPlatform =
    next.platform === undefined ? currentPlatform : next.platform;
  const nextDomain = next.domain === undefined ? currentDomain : next.domain;
  const nextOpen =
    next.isFilterOpen === undefined ? currentOpen : next.isFilterOpen;

  if (nextPlatform) url.searchParams.set('platform', nextPlatform);
  else url.searchParams.delete('platform');

  if (nextDomain) url.searchParams.set('domain', nextDomain);
  else url.searchParams.delete('domain');

  if (nextOpen) url.searchParams.set('filter', 'open');
  else url.searchParams.delete('filter');

  window.history.replaceState({}, '', url.toString());
}

export function useHomeFilters() {
  const searchParams = useSearchParams();
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const next = readFiltersFromSearchParams(searchParams);
    setPlatformFilter((prev) => (prev === next.platformFilter ? prev : next.platformFilter));
    setDomainFilter((prev) => (prev === next.domainFilter ? prev : next.domainFilter));
    setIsFilterOpen((prev) =>
      prev === next.isFilterOpen ? prev : next.isFilterOpen,
    );
  }, [searchParams]);

  const handlePlatformFilter = (value: string | null) => {
    setPlatformFilter(value);
    writeFiltersToUrl({ platform: value });
  };

  const handleDomainFilter = (value: string | null) => {
    setDomainFilter(value);
    writeFiltersToUrl({ domain: value });
  };

  const handleFilterOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    writeFiltersToUrl({ isFilterOpen: open });
  };

  return {
    platformFilter,
    domainFilter,
    isFilterOpen,
    handlePlatformFilter,
    handleDomainFilter,
    handleFilterOpenChange,
  };
}
