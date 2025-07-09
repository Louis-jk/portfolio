import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='h-screen flex flex-col overflow-hidden'>
        {/* 메인 콘텐츠 (헤더 포함) */}
        <div className='flex-1 overflow-hidden'>
          <Main />
        </div>

        {/* 항상 아래에 위치하는 Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}
