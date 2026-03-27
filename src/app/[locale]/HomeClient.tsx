'use client';

import { useState, useEffect, Suspense } from 'react';
import { useMediaQuery } from 'react-responsive';
import Header from '@/components/header/Header';
import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import Chatbot from '@/components/chatbot/Chatbot';
import LoadingScreen from '@/components/loading/Loading';
import type { ProjectWithTranslations } from '@/services/project-service';

interface HomeClientProps {
  projects: ProjectWithTranslations[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });

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
        className={`${isMobile ? 'block' : 'flex flex-col h-screen'} w-full`}
      >
        <Header
          platformFilter={platformFilter}
          domainFilter={domainFilter}
          onPlatformFilter={setPlatformFilter}
          onDomainFilter={setDomainFilter}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
        />
        <Main
          projects={projects}
          platformFilter={platformFilter}
          domainFilter={domainFilter}
          isFilterOpen={isFilterOpen}
          isDesktop={isDesktop}
        />
        <Footer />
        <Chatbot projects={projects} />
      </div>
    </Suspense>
  );
}
