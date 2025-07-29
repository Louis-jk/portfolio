'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
    CRISP_RUNTIME_CONFIG: {
      locale: string;
    };
  }
}

function CrispChat() {
  const locale = useLocale();

  const crispLocale = locale === 'ko' ? 'ko' : locale === 'ja' ? 'ja' : 'en';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? '';

    window.CRISP_RUNTIME_CONFIG = {
      locale: crispLocale,
    };

    /*
        <script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="220bc5c1-6bb4-4f0f-ba22-a53f2c732857";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
        */
  }, [crispLocale]);

  return null;
}

export default CrispChat;
