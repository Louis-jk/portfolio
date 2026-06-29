'use client';

import ProjectDrawer from '@/features/projects/public/ProjectDrawer';
import MainDesktopLayout from './MainDesktopLayout';
import MainMobileLayout from './MainMobileLayout';
import MainTabletLayout from './MainTabletLayout';
import { MainMobileScrollToTopFab } from './MainMobileScrollToTopFab';
import { useProjectSelection } from '@/features/projects/public/hooks/useProjectSelection';
import { usePrefetchProjectStory } from '@/features/projects/public/hooks/usePrefetchProjectStory';
import { motion } from 'framer-motion';
import { useMemo, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';
import type { ProjectView } from '@/entities/projects';

function MainContent({
  projects,
  platformFilter = null,
  domainFilter = null,
  isFilterOpen = false,
  isDesktopLayout = true,
}: {
  projects: ProjectView[];
  platformFilter?: string | null;
  domainFilter?: string | null;
  isFilterOpen?: boolean;
  isDesktopLayout?: boolean;
}) {
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const platforms = p.platformCategories ?? [];
      const domains = p.domainTags ?? [];
      if (platformFilter && !platforms.includes(platformFilter)) return false;
      if (domainFilter && !domains.includes(domainFilter)) return false;
      return true;
    });
  }, [projects, platformFilter, domainFilter]);

  const tProjects = useTranslations('projects');
  const searchParams = useSearchParams();
  const isStoryOpen = searchParams.get('story') === '1';
  const { isLayoutMobile, isLayoutTablet } = useLayoutBreakpoints();
  const { selectedItem, isDrawerOpen, handleItemClick, handleDrawerClose } =
    useProjectSelection(projects, filteredProjects);

  usePrefetchProjectStory(
    selectedItem?.storyIsPublic ? selectedItem.id : null,
  );

  const headerPadding =
    !isDesktopLayout && isFilterOpen ? 'pt-[140px]' : 'pt-[55px]';
  const isViewportLocked = isDesktopLayout || isLayoutTablet;
  const showMainScrollToTopFab =
    isLayoutMobile && !isDrawerOpen && !isStoryOpen;

  const shellProps = {
    projects: filteredProjects,
    selectedItem,
    onItemClick: handleItemClick,
  };

  return (
    <>
      <main
        className={`flex flex-col ${headerPadding} ${isViewportLocked ? 'min-h-0 flex-1' : ''}`}
      >
        <section className={isViewportLocked ? 'min-h-0 flex-1' : ''}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={isViewportLocked ? 'h-full min-h-0' : ''}
          >
            {isDesktopLayout && (
              <MainDesktopLayout
                {...shellProps}
                detailPanelLabel={tProjects('details.title')}
              />
            )}
            {isLayoutTablet && <MainTabletLayout {...shellProps} />}
            {isLayoutMobile && <MainMobileLayout {...shellProps} />}
          </motion.div>
        </section>
      </main>

      <ProjectDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
      <MainMobileScrollToTopFab enabled={showMainScrollToTopFab} />
    </>
  );
}

function Main({
  projects,
  platformFilter = null,
  domainFilter = null,
  isFilterOpen = false,
  isDesktop = true,
}: {
  projects: ProjectView[];
  platformFilter?: string | null;
  domainFilter?: string | null;
  isFilterOpen?: boolean;
  isDesktop?: boolean;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent
        projects={projects}
        platformFilter={platformFilter}
        domainFilter={domainFilter}
        isFilterOpen={isFilterOpen}
        isDesktopLayout={isDesktop}
      />
    </Suspense>
  );
}

export default Main;
