import React from 'react';
import { notFound } from 'next/navigation';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { AdminLogoutButton, AdminSidebarNav } from '@/features/admin';
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

  return (
    <div className='flex h-screen bg-slate-50 dark:bg-slate-950'>
      {/* 사이드바 */}
      <aside className='w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col border-r border-slate-800'>
        <div className='p-6 text-xl font-bold border-b border-slate-800'>
          {/* 🚀 Success Gate */}
          🚀 Dashboard
        </div>
        <AdminSidebarNav locale={locale} />
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

        <main className='flex-1 overflow-y-auto bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
