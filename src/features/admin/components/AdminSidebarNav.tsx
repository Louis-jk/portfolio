'use client';

import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { AdminNavLink } from './AdminNavLink';

type AdminSidebarNavProps = {
  locale: string;
};

export function AdminSidebarNav({ locale }: AdminSidebarNavProps) {
  const base = `/${locale}${ADMIN_ROUTES.DASHBOARD}`;

  return (
    <nav className='flex-1 space-y-2 p-4'>
      <AdminNavLink href={base} exact>
        Dashboard
      </AdminNavLink>
      <AdminNavLink href={`/${locale}${ADMIN_ROUTES.PROJECTS}`}>
        Manage Projects
      </AdminNavLink>
      <AdminNavLink
        href={`/${locale}${ADMIN_ROUTES.NEW_PROJECT}`}
        className='pl-6 text-sm text-slate-400'
      >
        + New Project
      </AdminNavLink>
      <AdminNavLink href={`${base}/analytics`}>GA4 Analytics</AdminNavLink>
    </nav>
  );
}
