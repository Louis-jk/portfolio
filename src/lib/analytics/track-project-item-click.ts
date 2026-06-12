import type { ProjectView } from '@/modules/projects';

type ProjectClickPayload = {
  project_id: string;
  project_title: string;
  item_id: string;
  item_title: string;
  item_region: string;
};

function buildPayload(item: ProjectView): ProjectClickPayload {
  const id = item.id.toString();
  return {
    project_id: id,
    project_title: item.title,
    item_id: id,
    item_title: item.title,
    item_region: item.region,
  };
}

/** GTM dataLayer + GA4 gtag — single entry for project list clicks. */
export function trackProjectItemClick(item: ProjectView) {
  if (typeof window === 'undefined') return;

  const payload = buildPayload(item);

  window.dataLayer?.push({
    event: 'project_item_click',
    ...payload,
  });

  window.gtag?.('event', 'project_item_click', payload);
}
