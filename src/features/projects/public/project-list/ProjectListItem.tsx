'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FaUserAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import type { ProjectView } from '@/entities/projects';
import ProjectCategoryBadges from '../ProjectCategoryBadges';
import { isSameProjectId } from '@/entities/projects/lib/project-list-scroll';

export type ProjectListItemVariant = 'mobile' | 'desktop';

type ProjectListItemProps = {
  item: ProjectView;
  index: number;
  variant: ProjectListItemVariant;
  selectedItem: ProjectView | null;
  showSelectionIcon: boolean;
  onClick: (item: ProjectView) => void;
  onMouseEnter?: (e: React.MouseEvent, item: ProjectView) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  registerRef?: (id: string, el: HTMLElement | null) => void;
};

function listItemTransition(index: number) {
  return {
    duration: 0.2,
    delay: Math.min(index * 0.01, 0.1),
    ease: 'easeOut' as const,
  };
}

export default function ProjectListItem({
  item,
  index,
  variant,
  selectedItem,
  showSelectionIcon,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  registerRef,
}: ProjectListItemProps) {
  const isSelected = isSameProjectId(item.id, selectedItem?.id);
  const isMobile = variant === 'mobile';

  return (
    <motion.article
      ref={(el) => registerRef?.(item.id.toString(), el)}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={listItemTransition(index)}
      className={cn(
        'relative cursor-pointer rounded-lg p-4',
        isMobile
          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
        isSelected &&
          (isMobile
            ? 'bg-gray-100 dark:bg-gray-800/70'
            : 'bg-gray-200 dark:bg-gray-800/70'),
      )}
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => onClick(item)}
      onMouseEnter={onMouseEnter ? (e) => onMouseEnter(e, item) : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex items-start gap-3'>
        {showSelectionIcon && (
          <div className='shrink-0 mt-1'>
            {isSelected ? (
              <Check className='w-4 h-4 text-point' />
            ) : (
              <div className='w-4 h-4' />
            )}
          </div>
        )}
        <div className='flex-1 min-w-0'>
          <ProjectCategoryBadges project={item} className='mb-1.5' />
          <div className='flex items-center gap-2 justify-between'>
            <h3
              className={cn(
                'font-bold text-lg transition-colors duration-200 flex-8',
                isSelected
                  ? 'text-point font-bold'
                  : 'text-gray-900 dark:text-gray-100',
              )}
            >
              {item.title}
            </h3>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex justify-start items-center gap-1 flex-7'>
              <FaUserAlt className='size-3 text-gray-400 dark:text-gray-100 mt-1' />
              <p className='text-sm font-medium text-gray-500 dark:text-gray-100 mt-1 whitespace-pre-line'>
                {item.role}
              </p>
            </div>
          </div>
          <ul className='list-disc ml-5 mt-3 text-sm space-y-1 text-gray-600 dark:text-gray-300'>
            {item.description.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectListItemDivider() {
  return (
    <div className='h-px border-t border-dashed border-gray-200 dark:border-gray-700 mx-4' />
  );
}
