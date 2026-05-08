import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Link: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}

function KakaoTalkShareButton({
  url,
  title,
  description,
  size,
  round = false,
}: {
  url: string;
  title: string;
  description?: string;
  size: number;
  round: boolean;
}) {
  const t = useTranslations('modal.shareButton');

  const handleClick = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description,
          imageUrl:
            'https://storage.googleapis.com/jk-static-assets/og_image.png',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: t('buttonTitle.kakaoTalk'),
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className='cursor-pointer'
      aria-label='Share via KakaoTalk'
    >
      <Image
        src='/images/kakaotalk_brand_logo.png'
        alt='KakaoTalk'
        width={size}
        height={size}
        className={cn(round && 'rounded-full')}
      />
    </button>
  );
}

export default KakaoTalkShareButton;
