'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isBelowLayoutDesktopWidth } from '@/constants/breakpoints';
import { trackProjectItemClick } from '@/lib/analytics/track-project-item-click';
import type { ProjectView } from '@/entities/projects';

const HOME_PATHS = ['/', '/en', '/ko', '/ja'];

export function useProjectSelection(
  projects: ProjectView[],
  filteredProjects: ProjectView[],
) {
  const [selectedItem, setSelectedItem] = useState<ProjectView | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (!itemId) return;

    const item =
      filteredProjects.find((p) => p.id.toString() === itemId) ??
      projects.find((p) => p.id.toString() === itemId);

    if (item) {
      setSelectedItem(item);
      if (isBelowLayoutDesktopWidth(window.innerWidth)) {
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, projects, filteredProjects]);

  useEffect(() => {
    if (searchParams.get('item')) return;

    if (HOME_PATHS.includes(pathname)) {
      setSelectedItem(null);
      setIsDrawerOpen(false);
    }
  }, [pathname, searchParams]);

  const handleItemClick = useCallback((item: ProjectView) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id.toString());
    window.history.replaceState({}, '', url.toString());

    if (isBelowLayoutDesktopWidth(window.innerWidth)) {
      setIsDrawerOpen(true);
    }

    trackProjectItemClick(item);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('item');
    window.history.replaceState({}, '', url.toString());
  }, []);

  return { selectedItem, isDrawerOpen, handleItemClick, handleDrawerClose };
}
