'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProjectStoryContext } from './ProjectStoryContext';
import { usePrefetchProjectStoryCallback } from '@/hooks/usePrefetchProjectStory';

type ProjectStoryViewLinkProps = {
  projectId: number;
  className?: string;
};

export function ProjectStoryViewLink({
  projectId,
  className = '',
}: ProjectStoryViewLinkProps) {
  const t = useTranslations('projectStory');
  const { openStory } = useProjectStoryContext();
  const prefetchStory = usePrefetchProjectStoryCallback();
  const bulbFade = cn(
    'transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-0',
    'motion-reduce:duration-300',
  );

  return (
    <Button
      type='button'
      variant='point'
      className={cn('rounded-full px-4 py-2 cursor-pointer', className)}
      onMouseEnter={() => prefetchStory(projectId)}
      onFocus={() => prefetchStory(projectId)}
      onClick={() => openStory(projectId)}
    >
      <span
        className={cn(
          'relative inline-flex size-4 shrink-0 items-center justify-center',
          'motion-reduce:group-hover/button:animate-none',
          'group-hover/button:animate-story-bulb-hop-once motion-reduce:group-hover/button:animate-none',
        )}
        aria-hidden
      >
        <FaLightbulb
          size={16}
          className={cn(
            'absolute opacity-100',
            bulbFade,
            'group-hover/button:opacity-0 group-hover/button:delay-500',
            'motion-reduce:group-hover/button:delay-0',
          )}
        />
        <FaRegLightbulb
          size={16}
          className={cn(
            'absolute opacity-0',
            bulbFade,
            'group-hover/button:opacity-100 group-hover/button:delay-500',
            'motion-reduce:group-hover/button:delay-0',
          )}
        />
      </span>
      <span className='text-sm font-bold'>{t('viewStory')}</span>
      <ArrowRight
        size={16}
        aria-hidden
        className='motion-reduce:group-hover/button:animate-none group-hover/button:animate-story-arrow-nudge'
      />
    </Button>
  );
}
