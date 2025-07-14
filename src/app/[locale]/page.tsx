'use client';

import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import LoadingScreen from '@/components/loading/Loading';
import { Suspense, useState } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className='h-screen flex flex-col lg:overflow-hidden'>
        {/* 메인 콘텐츠 (헤더 포함) */}
        <div className='flex-1 lg:overflow-hidden'>
          <Main />
        </div>

        {/* 항상 아래에 위치하는 Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}
