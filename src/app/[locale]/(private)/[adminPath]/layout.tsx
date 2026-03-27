import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ADMIN_ROUTES } from '@/lib/constants';
import ThemeToggle from '@/components/theme/ThemeToggle';
import AdminLogoutButton from './AdminLogoutButton';
import { createClient } from '@/utils/supabase/server';

const EXPECTED_ADMIN_PATH = (
  process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ?? ''
).replace(/^\//, '');

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; adminPath: string }>;
}) {
  const { locale, adminPath } = await params;

  if (adminPath !== EXPECTED_ADMIN_PATH) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;
  const userEmail = data?.claims?.email ?? 'Not logged in';

  const base = `/${locale}${ADMIN_ROUTES.DASHBOARD}`;
  return (
    <div className='flex h-screen bg-slate-50 dark:bg-slate-950'>
      {/* 사이드바 */}
      <aside className='w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col border-r border-slate-800'>
        <div className='p-6 text-xl font-bold border-b border-slate-800'>
          🚀 Success Gate
        </div>
        <nav className='flex-1 p-4 space-y-2'>
          <Link
            href={base}
            className='block p-2 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded transition'
          >
            Dashboard
          </Link>
          <Link
            href={`/${locale}${ADMIN_ROUTES.PROJECTS}`}
            className='block p-2 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded transition'
          >
            Manage Projects
          </Link>
          <Link
            href={`/${locale}${ADMIN_ROUTES.NEW_PROJECT}`}
            className='block p-2 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded transition pl-6 text-sm text-slate-400'
          >
            + New Project
          </Link>
          <Link
            href={`${base}/analytics`}
            className='block p-2 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded transition'
          >
            GA4 Analytics
          </Link>
        </nav>
        <div className='p-4 border-t border-slate-800 text-xs text-slate-500'>
          Logined as: {userEmail}
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8'>
          <h1 className='text-lg font-medium text-slate-700 dark:text-slate-200'>
            Admin Control Center
          </h1>
          <div className='flex items-center gap-4'>
            <ThemeToggle />
            {isLoggedIn && <AdminLogoutButton locale={locale} />}
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'>
          {children}
        </main>
      </div>
    </div>
  );
}
