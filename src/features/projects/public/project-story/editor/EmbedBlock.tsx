'use client';

import { getYouTubeEmbedUrl } from '@/entities/project-detail-page/lib';

type EmbedBlockProps = {
  service?: string;
  source?: string;
  embed?: string;
  caption?: string;
};

export function EmbedBlock({ service, source, embed, caption }: EmbedBlockProps) {
  const url =
    embed ||
    (service === 'youtube' && source ? getYouTubeEmbedUrl(source) : null) ||
    source ||
    null;

  if (!url) return null;

  return (
    <figure className='space-y-2'>
      <div className='aspect-video overflow-hidden rounded-xl bg-black'>
        <iframe
          src={url}
          title={caption || 'Embedded media'}
          className='h-full w-full'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>
      {caption ? (
        <figcaption className='text-center text-sm text-zinc-500'>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
