'use client';

import { motion } from 'framer-motion';
import { detailSectionMotion } from '@/entities/projects/lib/detail-motion';

type BulletVariant = 'challenge' | 'achievement';

const bulletStyles: Record<BulletVariant, string> = {
  challenge: 'text-red-500',
  achievement: 'text-green-500',
};

const bulletChars: Record<BulletVariant, string> = {
  challenge: '•',
  achievement: '✓',
};

type ProjectDetailBulletSectionProps = {
  title: string;
  items: string[];
  variant: BulletVariant;
  isVisible: boolean;
  delay: number;
};

export default function ProjectDetailBulletSection({
  title,
  items,
  variant,
  isVisible,
  delay,
}: ProjectDetailBulletSectionProps) {
  return (
    <motion.div {...detailSectionMotion(isVisible, delay)}>
      <h4 className='text-lg font-semibold mb-3'>{title}</h4>
      <ul className='space-y-2'>
        {items.map((item) => (
          <li key={item} className='flex items-start'>
            <span className={`${bulletStyles[variant]} mr-2 mt-1`}>
              {bulletChars[variant]}
            </span>
            <span className='text-gray-700 dark:text-gray-300'>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
