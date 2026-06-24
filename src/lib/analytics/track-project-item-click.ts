import type { ProjectView } from '@/modules/projects';
import { trackGa4Event } from '@/lib/analytics/ga4';

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

/** GA4 custom event for project list clicks. */
export function trackProjectItemClick(item: ProjectView) {
  trackGa4Event('project_item_click', buildPayload(item));
}
