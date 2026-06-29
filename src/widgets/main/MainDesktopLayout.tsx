'use client';

import { motion } from 'framer-motion';
import Intro from '@/components/intro/Intro';
import ProjectDetail from '@/features/projects/public/ProjectDetail';
import ProjectList from '@/features/projects/public/ProjectList';
import type { ProjectView } from '@/entities/projects';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

type MainDesktopLayoutProps = {
  projects: ProjectView[];
  selectedItem: ProjectView | null;
  onItemClick: (item: ProjectView) => void;
  detailPanelLabel: string;
};

export default function MainDesktopLayout({
  projects,
  selectedItem,
  onItemClick,
  detailPanelLabel,
}: MainDesktopLayoutProps) {
  return (
    <div className='flex justify-center items-start h-full'>
      <div className='grid grid-cols-12 gap-6 h-full'>
        <motion.div {...fadeUp(0.3)} className='col-span-3 h-full overflow-hidden'>
          <Intro />
        </motion.div>

        <motion.div {...fadeUp(0.5)} className='col-span-4 h-full overflow-hidden'>
          <ProjectList
            items={projects}
            selectedItem={selectedItem}
            onItemClick={onItemClick}
          />
        </motion.div>

        <motion.aside
          data-project-detail-container
          aria-label={detailPanelLabel}
          {...fadeUp(0.7)}
          className='col-span-5 h-full overflow-hidden'
          style={{ overflowX: 'hidden' }}
        >
          <ProjectDetail
            key={selectedItem?.id || 'empty'}
            item={selectedItem}
            isVisible={!!selectedItem}
          />
        </motion.aside>
      </div>
    </div>
  );
}
