'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function useProjectStory() {
  const searchParams = useSearchParams();
  const [storyProjectId, setStoryProjectId] = useState<number | null>(null);

  useEffect(() => {
    const story = searchParams.get('story');
    const itemId = searchParams.get('item');
    if (story !== '1' || !itemId) {
      setStoryProjectId(null);
      return;
    }

    const id = parseInt(itemId, 10);
    if (!Number.isNaN(id)) {
      setStoryProjectId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('story') !== '1') {
        setStoryProjectId(null);
        return;
      }

      const id = parseInt(params.get('item') ?? '', 10);
      if (!Number.isNaN(id)) {
        setStoryProjectId(id);
      }
    };

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const openStory = useCallback((projectId: number) => {
    setStoryProjectId(projectId);

    const url = new URL(window.location.href);
    url.searchParams.set('item', String(projectId));
    url.searchParams.set('story', '1');
    window.history.pushState({ storyProjectId: projectId }, '', url.toString());
  }, []);

  const closeStory = useCallback(() => {
    setStoryProjectId(null);

    const url = new URL(window.location.href);
    url.searchParams.delete('story');
    window.history.replaceState({}, '', url.toString());
  }, []);

  return { storyProjectId, openStory, closeStory };
}
