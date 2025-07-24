import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function LineShareButton({
  url,
  size,
  round = false,
}: {
  url: string;
  size: number;
  round: boolean;
}) {
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div>
      <a href={lineShareUrl} target='_blank' rel='noopener noreferrer'>
        <Image
          src='/images/LINE_Brand_icon.png'
          alt='Line'
          width={size}
          height={size}
          className={cn(round && 'rounded-full')}
        />
      </a>
    </div>
  );
}

export default LineShareButton;
