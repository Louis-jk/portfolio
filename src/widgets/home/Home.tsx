'use client';

import { useState, useEffect, Suspense } from 'react';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';
import Header from '@/components/header/Header';
import Main from '@/widgets/main';
import Footer from '@/components/footer/Footer';
import Chatbot from '@/features/chatbot';
import LoadingScreen from '@/components/loading/Loading';
import type { ProjectView } from '@/entities/projects';
import { ProjectStoryProvider } from '@/features/projects/public';
import { useLiveProjects } from '@/features/projects/public/hooks';
import { useHomeFilters } from './hooks/useHomeFilters';
import { useKakaoSdk } from './hooks/useKakaoSdk';

interface HomeProps {
  projects: ProjectView[];
}

export default function Home({ projects: initialProjects }: HomeProps) {
  const projects = useLiveProjects(initialProjects);
  const [isLoading, setIsLoading] = useState(true);
  const {
    platformFilter,
    domainFilter,
    isFilterOpen,
    handlePlatformFilter,
    handleDomainFilter,
    handleFilterOpenChange,
  } = useHomeFilters();

  const { isLayoutDesktop, isLayoutTablet } = useLayoutBreakpoints();
  const isViewportLocked = isLayoutDesktop || isLayoutTablet;

  useKakaoSdk();

  useEffect(() => {
    const minLoadingTime = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(minLoadingTime);
  }, []);

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
      <ProjectStoryProvider projects={projects}>
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
      </ProjectStoryProvider>
    </Suspense>
  );
}
