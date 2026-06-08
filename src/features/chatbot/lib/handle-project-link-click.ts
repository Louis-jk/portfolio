import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type ProjectLinkClickArgs = {
  url: string;
  isMobile: boolean;
  router: AppRouterInstance;
  setIsNavigatingProject: (value: boolean) => void;
  setOpen: (value: boolean) => void;
};

export function handleProjectLinkClick({
  url,
  isMobile,
  router,
  setIsNavigatingProject,
  setOpen,
}: ProjectLinkClickArgs) {
  const isInternalProject = url.includes('?item=') || url.startsWith('?');
  const targetItemId = new URL(url, window.location.origin).searchParams.get(
    'item',
  );

  const closeAfterItemNavigation = () => {
    if (!targetItemId) {
      setIsNavigatingProject(false);
      setOpen(false);
      return;
    }

    const startedAt = Date.now();
    const waitForNavigation = () => {
      const currentItem = new URL(window.location.href).searchParams.get('item');
      if (currentItem === targetItemId) {
        setIsNavigatingProject(false);
        setOpen(false);
        return;
      }
      if (Date.now() - startedAt > 2000) {
        setIsNavigatingProject(false);
        setOpen(false);
        return;
      }
      requestAnimationFrame(waitForNavigation);
    };
    requestAnimationFrame(waitForNavigation);
  };

  if (!isInternalProject) {
    window.open(url, '_blank');
    return;
  }

  setIsNavigatingProject(true);
  if (isMobile) {
    router.push(url);
  } else {
    router.replace(url);
  }
  closeAfterItemNavigation();
}
