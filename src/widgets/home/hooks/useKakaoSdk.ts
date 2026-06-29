'use client';

import { useEffect } from 'react';

export function useKakaoSdk() {
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
}
