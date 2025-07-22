'use client';

import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import LoadingScreen from '@/components/loading/Loading';
import { Suspense, useState } from 'react';
import Header from '@/components/header/Header';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className='h-screen flex flex-col lg:overflow-hidden'>
        {/* 메인 콘텐츠 (헤더 포함) */}
        <Header isDrawerOpen={isDrawerOpen} />
        <div className='flex-1 lg:overflow-hidden'>
          <Main isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
        </div>

        {/* 항상 아래에 위치하는 Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}
