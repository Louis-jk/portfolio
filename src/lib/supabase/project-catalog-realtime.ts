export const PROJECT_CATALOG_BROADCAST_CHANNEL = 'portfolio:project-catalog';
export const PROJECT_CATALOG_BROADCAST_EVENT = 'catalog_changed';

export type ProjectCatalogChangeEvent = 'upsert' | 'delete' | 'reorder';

export type ProjectCatalogBroadcastPayload = {
  projectId: number;
  event: ProjectCatalogChangeEvent;
};
