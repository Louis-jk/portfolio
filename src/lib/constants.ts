export const ADMIN_PATH =
  process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || '/admin-default-path';

export const ADMIN_ROUTES = {
  DASHBOARD: `${ADMIN_PATH}`,
  PROJECTS: `${ADMIN_PATH}/projects`,
  NEW_PROJECT: `${ADMIN_PATH}/projects/new`,
  ANALYTICS: `${ADMIN_PATH}/analytics`,
} as const;
