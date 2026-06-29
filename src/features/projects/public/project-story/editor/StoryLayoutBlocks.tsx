import Image from 'next/image';
import { STORY_BODY_CLASS } from '@/constants/story-typography';
import { sanitizeStoryHtml } from '@/lib/sanitize-html';
import { prepareStoryRichTextHtml } from '@/entities/project-detail-page/lib/story-inline-code-html';
import { isBlankStoryHtml } from '@/entities/project-detail-page/lib/paragraph-html';
import type {
  StoryMediaKind,
  StoryMediaTextLayout,
} from '@/entities/project-detail-page/lib/story-layout-types';

type StoryMediaAssetProps = {
  kind: StoryMediaKind;
  url: string;
  className?: string;
};

export function StoryMediaAsset({ kind, url, className }: StoryMediaAssetProps) {
  if (kind === 'video') {
    return (
      <video
        src={url}
        controls
        playsInline
        preload='metadata'
        className={className ?? 'block h-auto w-full rounded-xl bg-black'}
      />
    );
  }

  return (
    <Image
      src={url}
      alt=''
      width={1200}
      height={675}
      className={className ?? 'h-auto w-full rounded-xl object-contain'}
      unoptimized={url.startsWith('http://localhost')}
    />
  );
}

type StoryMediaTextBlockProps = {
  layout: StoryMediaTextLayout;
  mediaType: StoryMediaKind;
  mediaUrl?: string;
  html: string;
};

export function StoryMediaTextBlock({
  layout,
  mediaType,
  mediaUrl,
  html,
}: StoryMediaTextBlockProps) {
  const safeHtml = sanitizeStoryHtml(prepareStoryRichTextHtml(html));
  const hasText = !isBlankStoryHtml(safeHtml);

  if (!mediaUrl && !hasText) return null;

  return (
    <figure
      className={`story-media-text story-media-text--${layout}`}
      data-layout={layout}
    >
      {mediaUrl ? (
        <div className='story-media-text__media min-w-0'>
          <StoryMediaAsset
            kind={mediaType}
            url={mediaUrl}
            className={
              mediaType === 'video'
                ? 'story-media-text__video block h-auto w-full max-w-sm rounded-xl bg-black lg:max-w-none'
                : 'story-media-text__image block h-auto w-full rounded-xl object-contain'
            }
          />
        </div>
      ) : null}
      {hasText ? (
        <div
          className={`story-media-text__body min-w-0 ${STORY_BODY_CLASS}`}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : null}
    </figure>
  );
}

type StoryMediaRowSlot = {
  kind: StoryMediaKind;
  url?: string;
  caption?: string;
};

type StoryMediaRowBlockProps = {
  left: StoryMediaRowSlot;
  right: StoryMediaRowSlot;
};

function StoryMediaRowItem({ kind, url, caption }: StoryMediaRowSlot) {
  if (!url) return null;

  return (
    <figure className='story-media-row__item min-w-0 space-y-1'>
      <StoryMediaAsset
        kind={kind}
        url={url}
        className={
          kind === 'video'
            ? 'story-media-row__video block h-auto w-full rounded-xl bg-black'
            : 'story-media-row__image block h-auto w-full rounded-xl object-contain'
        }
      />
      {caption ? (
        <figcaption className='text-center text-sm text-zinc-500'>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function StoryMediaRowBlock({ left, right }: StoryMediaRowBlockProps) {
  if (!left.url && !right.url) return null;

  return (
    <div className='story-media-row'>
      <StoryMediaRowItem {...left} />
      <StoryMediaRowItem {...right} />
    </div>
  );
}
