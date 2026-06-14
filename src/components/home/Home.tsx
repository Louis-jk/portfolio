'use client';

import { useState, useEffect, Suspense } from 'react';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import Chatbot from '@/features/chatbot';
import LoadingScreen from '@/components/loading/Loading';
import type { ProjectView } from '@/modules/projects';

interface HomeProps {
  projects: ProjectView[];
}

export default function Home({ projects }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  const { isLayoutDesktop, isLayoutTablet } = useLayoutBreakpoints();
  const isViewportLocked = isLayoutDesktop || isLayoutTablet;

  useEffect(() => {
    const minLoadingTime = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(minLoadingTime);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '');
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const nextPlatform = searchParams.get('platform');
    const nextDomain = searchParams.get('domain');
    const nextFilterOpen = searchParams.get('filter') === 'open';

    setPlatformFilter((prev) => (prev === nextPlatform ? prev : nextPlatform));
    setDomainFilter((prev) => (prev === nextDomain ? prev : nextDomain));
    setIsFilterOpen((prev) =>
      prev === nextFilterOpen ? prev : nextFilterOpen,
    );
  }, [searchParams]);

  const updateFilterQuery = (next: {
    platform?: string | null;
    domain?: string | null;
    isFilterOpen?: boolean;
  }) => {
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
  };

  const handlePlatformFilter = (value: string | null) => {
    setPlatformFilter(value);
    updateFilterQuery({ platform: value });
  };

  const handleDomainFilter = (value: string | null) => {
    setDomainFilter(value);
    updateFilterQuery({ domain: value });
  };

  const handleFilterOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    updateFilterQuery({ isFilterOpen: open });
  };

  if (isLoading) {
    return (
      <LoadingScreen
        onComplete={() => setIsLoading(false)}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingScreen isLoading={true} />}>
      <div
        className={`${isViewportLocked ? 'flex flex-col h-screen' : 'block'} w-full`}
      >
        <Header
          platformFilter={platformFilter}
          domainFilter={domainFilter}
          onPlatformFilter={handlePlatformFilter}
          onDomainFilter={handleDomainFilter}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={handleFilterOpenChange}
        />
        <Main
          projects={projects}
          platformFilter={platformFilter}
          domainFilter={domainFilter}
          isFilterOpen={isFilterOpen}
          isDesktop={isLayoutDesktop}
        />
        <Footer />
        <Chatbot projects={projects} />
      </div>
    </Suspense>
  );
}
