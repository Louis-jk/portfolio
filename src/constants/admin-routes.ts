const rawPath = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ?? '';
export const ADMIN_PATH = rawPath ? (rawPath.startsWith('/') ? rawPath : `/${rawPath}`) : '';

const newProjectSlug =
  process.env.ADMIN_PROJECT_NEW_SLUG || process.env.NEXT_PUBLIC_ADMIN_PROJECT_NEW_SLUG || 'new';

export const ADMIN_PROJECT_NEW_SLUG = newProjectSlug;

export const ADMIN_ROUTES = {
  DASHBOARD: `${ADMIN_PATH}`,
  LOGIN: `${ADMIN_PATH}/login`,
  SIGNUP: `${ADMIN_PATH}/signup`,
  PROJECTS: `${ADMIN_PATH}/projects`,
  NEW_PROJECT: `${ADMIN_PATH}/projects/${newProjectSlug}`,
  ANALYTICS: `${ADMIN_PATH}/analytics`,
} as const;
