'use client';

import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import LoadingScreen from '@/components/loading/Loading';
import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/header/Header';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 500);

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
      <div className='h-screen flex flex-col lg:overflow-hidden'>
        <Header isDrawerOpen={isDrawerOpen} />
        <div className='flex-1 lg:overflow-hidden'>
          <Main isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
        </div>
        <Footer />
      </div>
    </Suspense>
  );
}
