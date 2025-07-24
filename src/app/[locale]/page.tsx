'use client';

import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import LoadingScreen from '@/components/loading/Loading';
import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/header/Header';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(minLoadingTime);
  }, []);

  useEffect(() => {
    // Kakao SDK 스크립트 로드
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
      <div className='flex flex-col h-screen w-full'>
        <Header />
        <Main />
        <Footer />
      </div>
    </Suspense>
  );
}
