'use client';

import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: {
        botId: string;
        clientId: string;
        hostUrl: string;
        messagingUrl: string;
        locale: string;
        botName: string;
        composerPlaceholder: string;
        showCloseButton: boolean;
        theme: string;
      }) => void;
    };
  }
}

function BotPress() {
  const locale = useLocale();
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    script.onload = () => {
      window.botpressWebChat.init({
        botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '',
        clientId: process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID ?? '',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
        messagingUrl: 'https://messaging.botpress.cloud',
        locale: locale === 'ko' ? 'ko' : locale === 'ja' ? 'ja' : 'en',
        botName: 'JoonhoBot',
        composerPlaceholder: '메시지를 입력하세요...',
        showCloseButton: true,
        theme: 'light',
      });
    };
    document.body.appendChild(script);
  }, [locale]);

  return <div id='botpress-webchat' />;
}

export default BotPress;
