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
import { canShowPublicStoryLink } from '@/lib/projects/story-access';
import ProjectDetailBulletSection from './project-detail/ProjectDetailBulletSection';
import ProjectDetailEmptyState from './project-detail/ProjectDetailEmptyState';
import ProjectDetailHeroImage from './project-detail/ProjectDetailHeroImage';
import ProjectDetailMetaHeader from './project-detail/ProjectDetailMetaHeader';
import ProjectDetailPanelTitle from './project-detail/ProjectDetailPanelTitle';
import ProjectDetailPlatformLinks, {
  getPlatformLinks,
} from './project-detail/ProjectDetailPlatformLinks';
import ProjectDetailTagList from './project-detail/ProjectDetailTagList';
import ProjectDetailToolsSection from './project-detail/ProjectDetailToolsSection';
import { ProjectStoryViewLink } from './project-story/ProjectStoryViewLink';
import { detailSectionMotion } from '@/lib/projects/detail-motion';

interface ProjectDetailProps {
  item: ProjectView | null;
  isVisible: boolean;
  showStoryLink?: boolean;
  /** When true, parent (drawer) owns scrolling — no inner overflow or extra bottom pad. */
  embeddedInDrawer?: boolean;
}

export default function ProjectDetail({
  item,
  isVisible,
  showStoryLink = true,
  embeddedInDrawer = false,
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
  const showStory = showStoryLink && canShowPublicStoryLink(item);
  const hasPlatformLinks = getPlatformLinks(item).length > 0;

  return (
    <article
      className={cn('flex flex-col', !embeddedInDrawer && 'h-full')}
      aria-labelledby='detail-project-title'
    >
      {isDesktopOrLaptop && !embeddedInDrawer && <ProjectDetailPanelTitle />}

      <div
        ref={scrollRef}
        className={cn(
          !embeddedInDrawer &&
            'h-[calc(100vh-135px)] overflow-y-auto overflow-x-hidden',
          !embeddedInDrawer && isDesktopOrLaptop && 'h-[calc(100vh-275px)] pt-5',
          !embeddedInDrawer && isMobile && 'pb-36',
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
            {isDesktopOrLaptop && (hasPlatformLinks || showStory) ? (
              <div className='mb-5 flex w-full flex-wrap items-center gap-2'>
                <ProjectDetailPlatformLinks item={item} />
                {showStory ? (
                  <ProjectStoryViewLink
                    projectId={item.id}
                    className='shrink-0'
                  />
                ) : null}
              </div>
            ) : (
              <ProjectDetailPlatformLinks item={item} className='mb-5' />
            )}

            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-lg font-semibold'>{tD('overview')}</h4>
              <ShareButton onShareClick={() => setOpenShareModal(true)} />
            </div>
            <p className='text-gray-700 dark:text-gray-300 leading-[1.5] whitespace-pre-line'>
              {item.overview}
            </p>
            {!isDesktopOrLaptop && showStory ? (
              <div className='mt-6'>
                <ProjectStoryViewLink projectId={item.id} />
              </div>
            ) : null}
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
