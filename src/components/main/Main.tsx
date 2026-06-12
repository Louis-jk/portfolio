'use client';

import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';
import TimelineDetail from '@/components/timeline/TimelineDetail';
import TimelineDrawer from '@/components/timeline/TimelineDrawer';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from 'react-responsive';
import type { ProjectView } from '@/modules/projects';

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
  const [selectedItem, setSelectedItem] = useState<ProjectView | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const platforms = p.platformCategories ?? [];
      const domains = p.domainTags ?? [];
      if (platformFilter && !platforms.includes(platformFilter)) return false;
      if (domainFilter && !domains.includes(domainFilter)) return false;
      return true;
    });
  }, [projects, platformFilter, domainFilter]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tTimeline = useTranslations('timeline');

  const isTablet = useMediaQuery({
    query: '(min-width: 1024px) and (max-width: 1279px)',
  });

  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  });

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item =
        filteredProjects.find((item) => item.id.toString() === itemId) ??
        projects.find((item) => item.id.toString() === itemId);
      if (item) {
        setSelectedItem(item);
        // 모바일과 태블릿에서는 drawer 열기
        if (window.innerWidth < 1280) {
          setIsDrawerOpen(true);
        }
      }
    }
  }, [searchParams, setIsDrawerOpen, projects, filteredProjects]);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) return;

    if (
      pathname === '/' ||
      pathname === '/en' ||
      pathname === '/ko' ||
      pathname === '/ja'
    ) {
      setSelectedItem(null);
      setIsDrawerOpen(false);
    }
  }, [pathname, searchParams, setIsDrawerOpen, projects]);

  const handleItemClick = (item: ProjectView) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id.toString());
    window.history.replaceState({}, '', url.toString());

    // 모바일과 태블릿에서는 drawer 열기
    if (window.innerWidth < 1280) {
      setIsDrawerOpen(true);
    }

    // GTM 이벤트 전송
    const dataLayer = (
      window as {
        dataLayer?: {
          push: (data: {
            event: string;
            item_id: string;
            item_title: string;
            item_region: string;
          }) => void;
        };
      }
    )?.dataLayer;
    if (typeof window !== 'undefined' && dataLayer) {
      dataLayer.push({
        event: 'timeline_item_click',
        item_id: item.id.toString(),
        item_title: item.title,
        item_region: item.region,
      });
    }

    // GA4 이벤트 전송
    const gtag = (
      window as {
        gtag?: (
          command: string,
          event: string,
          params: { item_id: string; item_title: string; item_region: string },
        ) => void;
      }
    )?.gtag;
    if (gtag) {
      gtag('event', 'timeline_item_click', {
        item_id: item.id.toString(),
        item_title: item.title,
        item_region: item.region,
      });
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('item');
    window.history.replaceState({}, '', url.toString());
  };

  const headerPadding =
    !isDesktopLayout && isFilterOpen ? 'pt-[140px]' : 'pt-[55px]';

  return (
    <>
      <main
        className={`flex flex-col ${headerPadding} ${isMobile ? '' : 'flex-1'}`}
      >
        <section className={isMobile ? '' : 'h-full'}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={isMobile ? '' : 'h-full'}
          >
            {/* Desktop Layout (1280px+) */}
            {isDesktopLayout && (
              <div className='flex justify-center items-start h-full'>
                <div className='grid grid-cols-12 gap-6 h-full'>
                  {/* Intro */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className='col-span-3'
                  >
                    <Intro />
                  </motion.div>

                  {/* Timeline with scroll */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className='col-span-4 h-full overflow-hidden'
                  >
                    <Timeline
                      items={filteredProjects}
                      selectedItem={selectedItem}
                      onItemClick={handleItemClick}
                    />
                  </motion.div>

                  {/* Timeline Detail with scroll - Desktop only */}
                  <motion.aside
                    data-timeline-detail-container
                    aria-label={tTimeline('details.title')}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                    className='col-span-5 h-full overflow-hidden'
                    style={{ overflowX: 'hidden' }}
                  >
                    <TimelineDetail
                      key={selectedItem?.id || 'empty'}
                      item={selectedItem}
                      isVisible={!!selectedItem}
                    />
                  </motion.aside>
                </div>
              </div>
            )}

            {/* Tablet Layout (1024px - 1279px) */}
            {isTablet && (
              <div className='block h-full'>
                <div className='grid grid-cols-2 gap-6 h-full w-full'>
                  {/* Intro */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  >
                    <Intro />
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className='flex flex-col h-full'
                  >
                    <Timeline
                      items={filteredProjects}
                      selectedItem={selectedItem}
                      onItemClick={handleItemClick}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Mobile Layout (768px 미만) */}
            {isMobile && (
              <div className='space-y-8'>
                {/* Intro */}
                <motion.div
                  data-intro-section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                  <Intro />
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  className='relative'
                >
                  <Timeline
                    items={filteredProjects}
                    selectedItem={selectedItem}
                    onItemClick={handleItemClick}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </section>
      </main>

      {/* Mobile/Tablet Drawer */}
      <TimelineDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
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
