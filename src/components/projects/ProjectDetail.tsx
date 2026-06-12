'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useLenisPanelScroll } from '@/hooks/useLenisPanelScroll';
import ShareButton from '@/components/button/share/ShareButton';
import ShareModal from '@/components/modal/shareModal';
import type { ProjectView } from '@/modules/projects';
import ProjectDetailBulletSection from './project-detail/ProjectDetailBulletSection';
import ProjectDetailEmptyState from './project-detail/ProjectDetailEmptyState';
import ProjectDetailHeroImage from './project-detail/ProjectDetailHeroImage';
import ProjectDetailMetaHeader from './project-detail/ProjectDetailMetaHeader';
import ProjectDetailPanelTitle from './project-detail/ProjectDetailPanelTitle';
import ProjectDetailPlatformLinks from './project-detail/ProjectDetailPlatformLinks';
import ProjectDetailTagList from './project-detail/ProjectDetailTagList';
import ProjectDetailToolsSection from './project-detail/ProjectDetailToolsSection';
import { detailSectionMotion } from '@/lib/projects/detail-motion';

interface ProjectDetailProps {
  item: ProjectView | null;
  isVisible: boolean;
}

export default function ProjectDetail({
  item,
  isVisible,
}: ProjectDetailProps) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const tD = useTranslations('details');
  const { isDesktopOrLaptop, isMobile } = useBreakpoints();

  const { scrollRef, contentRef, notifyResize } = useLenisPanelScroll({
    enabled: isDesktopOrLaptop,
    resetKey: item,
    resizeKey: item?.imageUrl,
  });

  if (!item) {
    return <ProjectDetailEmptyState />;
  }

  const stickyHeader = !isDesktopOrLaptop;

  return (
    <article
      className='flex flex-col h-full'
      aria-labelledby='detail-project-title'
    >
      {isDesktopOrLaptop && <ProjectDetailPanelTitle />}

      <div
        ref={scrollRef}
        className={cn(
          'h-[calc(100vh-135px)] overflow-y-auto overflow-x-hidden',
          isDesktopOrLaptop && 'h-[calc(100vh-275px)] pt-5',
          isMobile && 'pb-36',
        )}
      >
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'flex flex-col gap-7 px-0 lg:px-4 overflow-hidden',
            isDesktopOrLaptop && 'mb-5 pb-8',
          )}
        >
          <div>
            <ProjectDetailMetaHeader
              item={item}
              isVisible={isVisible}
              sticky={stickyHeader}
              isDesktopOrLaptop={isDesktopOrLaptop}
            />
          </div>

          {item.imageUrl && (
            <ProjectDetailHeroImage
              imageUrl={item.imageUrl}
              title={item.title}
              isVisible={isVisible}
              onLoad={() => requestAnimationFrame(() => notifyResize())}
            />
          )}

          <motion.div {...detailSectionMotion(isVisible, 0.8)}>
            <ProjectDetailPlatformLinks item={item} />

            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-lg font-semibold'>{tD('overview')}</h4>
              <ShareButton onShareClick={() => setOpenShareModal(true)} />
            </div>
            <p className='text-gray-700 dark:text-gray-300 leading-[1.5] whitespace-pre-line'>
              {item.overview}
            </p>
          </motion.div>

          <motion.div {...detailSectionMotion(isVisible, 1)}>
            <h4 className='text-lg font-semibold mb-3'>{tD('technologies')}</h4>
            <ProjectDetailTagList tags={item.technologies} />
          </motion.div>

          {item.tools && Object.keys(item.tools).length > 0 && (
            <ProjectDetailToolsSection tools={item.tools} isVisible={isVisible} />
          )}

          <ProjectDetailBulletSection
            title={tD('challenges')}
            items={item.challenges}
            variant='challenge'
            isVisible={isVisible}
            delay={1.4}
          />

          <ProjectDetailBulletSection
            title={tD('achievements')}
            items={item.achievements}
            variant='achievement'
            isVisible={isVisible}
            delay={1.6}
          />
        </motion.div>
      </div>

      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        url={window.location.href}
        title='Joonho Kim Portfolio'
        text='Frontend Developer Joonho Kim'
      />
    </article>
  );
}
