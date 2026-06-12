'use client';

import { motion } from 'framer-motion';
import Intro from '@/components/intro/Intro';
import ProjectList from '@/components/projects/ProjectList';
import type { ProjectView } from '@/modules/projects';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

type MainTabletLayoutProps = {
  projects: ProjectView[];
  selectedItem: ProjectView | null;
  onItemClick: (item: ProjectView) => void;
};

export default function MainTabletLayout({
  projects,
  selectedItem,
  onItemClick,
}: MainTabletLayoutProps) {
  return (
    <div className='h-full min-h-0'>
      <div className='grid h-full min-h-0 grid-cols-2 gap-6 w-full'>
        <motion.div {...fadeUp(0.3)} className='min-h-0 h-full overflow-hidden'>
          <Intro />
        </motion.div>

        <motion.div {...fadeUp(0.5)} className='min-h-0 overflow-y-auto'>
          <ProjectList
            items={projects}
            selectedItem={selectedItem}
            onItemClick={onItemClick}
          />
        </motion.div>
      </div>
    </div>
  );
}
