'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type ProjectDetailTagListProps = {
  tags: string[];
};

export default function ProjectDetailTagList({ tags }: ProjectDetailTagListProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            resolvedTheme === 'dark'
              ? 'bg-gray-700 text-gray-200'
              : 'bg-gray-200 text-gray-800',
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
