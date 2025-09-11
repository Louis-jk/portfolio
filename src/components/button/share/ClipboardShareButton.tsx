'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ClipboardShareButtonProps {
  url: string;
  size?: number;
  round?: boolean;
}

function ClipboardShareButton({
  url,
  size = 32,
  round = false,
}: ClipboardShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations('modal.shareModal');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 해제
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000); // 2초 후 에러 상태 해제
    }
  };

  return (
    <div className='flex flex-row items-center justify-start'>
      <Button
        onClick={handleCopy}
        size='icon'
        variant='outline'
        className={cn(
          round ? 'rounded-full' : 'rounded-md',
          copied && 'bg-gray-100 dark:bg-gray-900',
          'w-8 h-8 p-0 cursor-pointer'
        )}
        title={copied ? t('copied') : t('copyToClipboard')}
        disabled={error || copied}
      >
        {copied ? (
          <svg
            width={size + 14}
            height={size + 14}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='dark:text-purple-500! text-purple-700!'
            style={{
              strokeDasharray: '24',
              strokeDashoffset: '24',
              animation: 'drawCheck 0.3s ease-in-out forwards',
            }}
          >
            <path d='M4 12l4 4 8-8' />
          </svg>
        ) : (
          <Copy size={size} />
        )}
      </Button>
      {copied && (
        <p className='dark:text-purple-500 text-purple-700 pl-2 animate-success-message font-semibold'>
          {t('copied')}
        </p>
      )}
      {error && (
        <p className='text-red-600 pl-2 animate-error-message font-semibold'>
          {t('copyFailed')}
        </p>
      )}
    </div>
  );
}

export default ClipboardShareButton;
