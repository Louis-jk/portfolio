'use client';

import { motion } from 'framer-motion';
import Intro from '@/components/intro/Intro';
import ProjectList from '@/features/projects/public/ProjectList';
import type { ProjectView } from '@/entities/projects';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

type MainMobileLayoutProps = {
  projects: ProjectView[];
  selectedItem: ProjectView | null;
  onItemClick: (item: ProjectView) => void;
};

export default function MainMobileLayout({
  projects,
  selectedItem,
  onItemClick,
}: MainMobileLayoutProps) {
  return (
    <div className='space-y-8'>
      <motion.div data-intro-section {...fadeUp(0.3)}>
        <Intro />
      </motion.div>

      <motion.div {...fadeUp(0.5)} className='relative'>
        <ProjectList
          items={projects}
          selectedItem={selectedItem}
          onItemClick={onItemClick}
        />
      </motion.div>
    </div>
  );
}
