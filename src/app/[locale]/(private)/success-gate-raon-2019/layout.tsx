// src/app/(private)/_success-gate-raon-2019/layout.tsx
import React from 'react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-slate-50'>
      {/* 사이드바 */}
      <aside className='w-64 bg-slate-900 text-white flex flex-col'>
        <div className='p-6 text-xl font-bold border-b border-slate-800'>
          🚀 Success Gate
        </div>
        <nav className='flex-1 p-4 space-y-2'>
          <Link
            href={ADMIN_ROUTES.DASHBOARD}
            className='block p-2 hover:bg-slate-800 rounded transition'
          >
            Dashboard
          </Link>
          <Link
            href={ADMIN_ROUTES.PROJECTS}
            className='block p-2 hover:bg-slate-800 rounded transition'
          >
            Manage Projects
          </Link>
          <Link
            href={ADMIN_ROUTES.NEW_PROJECT}
            className='block p-2 hover:bg-slate-800 rounded transition pl-6 text-sm text-slate-400'
          >
            + New Project
          </Link>
          <Link
            href={ADMIN_ROUTES.ANALYTICS}
            className='block p-2 hover:bg-slate-800 rounded transition'
          >
            GA4 Analytics
          </Link>
        </nav>
        <div className='p-4 border-t border-slate-800 text-xs text-slate-500'>
          Logined as: Joonho Kim
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='h-16 bg-white border-b flex items-center justify-between px-8'>
          <h1 className='text-lg font-medium text-slate-700'>
            Admin Control Center
          </h1>
          <button className='text-sm text-red-500 hover:underline'>
            Logout
          </button>
        </header>

        <main className='flex-1 overflow-y-auto p-8'>{children}</main>
      </div>
    </div>
  );
}
