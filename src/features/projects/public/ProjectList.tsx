'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';
import { useLenisWrapperScroll } from '@/hooks/useLenisWrapperScroll';
import { useTabletDevice } from '@/hooks/useTabletDevice';
import type { ProjectView } from '@/entities/projects';
import ProjectListEmptyState from './project-list/ProjectListEmptyState';
import ProjectListHoverPreview from './project-list/ProjectListHoverPreview';
import ProjectListItem, {
  ProjectListItemDivider,
} from './project-list/ProjectListItem';
import ProjectListTitle from './project-list/ProjectListTitle';
import {
  useLayoutTabletScrollReset,
  useProjectListHoverPreview,
  useProjectListKeyboardNav,
  useProjectListScroll,
} from '@/features/projects/public/hooks/useProjectListInteractions';

interface ProjectListProps {
  items: ProjectView[];
  selectedItem: ProjectView | null;
  onItemClick: (item: ProjectView) => void;
}

export default function ProjectList({
  items,
  selectedItem,
  onItemClick,
}: ProjectListProps) {
  const itemRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const [isKeyboardSelection, setIsKeyboardSelection] = useState(false);

  const { isMobile } = useBreakpoints();
  const { isLayoutTablet } = useLayoutBreakpoints();
  const isTabletDevice = useTabletDevice();

  const lenisEnabled = !isMobile && !isLayoutTablet;
  const { scrollRef, lenisRef } = useLenisWrapperScroll(lenisEnabled);

  useLayoutTabletScrollReset(isLayoutTablet, scrollRef);

  const selectedIndex = items.findIndex((item) =>
    item.id.toString() === selectedItem?.id.toString(),
  );

  const handleKeyboardSelect = useCallback(() => {
    setIsKeyboardSelection(true);
  }, []);

  const handleKeyboardScrollDone = useCallback(() => {
    setIsKeyboardSelection(false);
  }, []);

  useProjectListKeyboardNav(
    items,
    selectedIndex,
    onItemClick,
    handleKeyboardSelect,
  );

  useProjectListScroll({
    enabled: lenisEnabled,
    scrollRef,
    lenisRef,
    itemRefs,
    selectedItem,
    isKeyboardSelection,
    onKeyboardScrollDone: handleKeyboardScrollDone,
  });

  const hoverEnabled = lenisEnabled && !isTabletDevice;
  const {
    hoveredItem,
    showPreview,
    springX,
    springY,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  } = useProjectListHoverPreview(selectedItem, hoverEnabled);

  const registerItemRef = useCallback((id: string, el: HTMLElement | null) => {
    itemRefs.current.set(id, el);
  }, []);

  const handleItemClick = useCallback(
    (item: ProjectView) => {
      onItemClick(item);
    },
    [onItemClick],
  );

  if (items.length === 0) {
    return <ProjectListEmptyState compact={isLayoutTablet} />;
  }

  const listItems = items.map((item, index) => (
    <div key={item.id} role='listitem'>
      <ProjectListItem
        item={item}
        index={index}
        variant={isMobile ? 'mobile' : 'desktop'}
        selectedItem={selectedItem}
        showSelectionIcon={!isMobile && !isTabletDevice}
        onClick={handleItemClick}
        onMouseEnter={hoverEnabled ? handleMouseEnter : undefined}
        onMouseMove={hoverEnabled ? handleMouseMove : undefined}
        onMouseLeave={hoverEnabled ? handleMouseLeave : undefined}
        registerRef={registerItemRef}
      />
      {index < items.length - 1 && <ProjectListItemDivider />}
    </div>
  ));

  return (
    <section
      className='flex flex-col'
      data-project-list-section
      aria-labelledby='project-list-heading'
    >
      <ProjectListTitle sticky={isMobile} />

      {isMobile ? (
        <div role='list'>{listItems}</div>
      ) : (
        <div
          ref={scrollRef}
          data-project-list-container
          role='list'
          aria-labelledby='project-list-heading'
          className={cn(
            'pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent',
            isLayoutTablet
              ? 'h-auto overflow-visible pr-0'
              : 'h-[calc(100vh-275px)] overflow-y-auto will-change-scroll',
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'scroll-position',
          }}
        >
          {listItems}
        </div>
      )}

      <ProjectListHoverPreview
        visible={showPreview && !!hoveredItem && hoverEnabled}
        springX={springX}
        springY={springY}
      />
    </section>
  );
}
