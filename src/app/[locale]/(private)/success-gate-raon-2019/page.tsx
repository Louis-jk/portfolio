// src/app/(private)/_success-gate-raon-2019/page.tsx
import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-bold'>Welcome back, Joonho!</h2>
          <p className='text-slate-500'>현재 포트폴리오의 실시간 현황입니다.</p>
        </div>
        <div className='text-sm text-slate-400'>Last updated: 2026.03.13</div>
      </div>

      {/* 통계 카드 섹션 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard
          title='Active Projects'
          value='12'
          sub='KR: 5 | JP: 4 | EN: 3'
        />
        <StatCard
          title="Today's Visitors"
          value='+128'
          sub='South Korea (45%)'
        />
        <StatCard
          title='Storage Usage'
          value='84%'
          sub='Images & GIFs in Supabase'
        />
      </div>

      {/* 최근 활동 섹션 (임시) */}
      <div className='bg-white border rounded-xl p-6 shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Recent Projects</h3>
        <div className='divide-y text-sm'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='py-3 flex justify-between items-center'>
              <span>Next.js 15 Portfolio Project {i}</span>
              <span className='px-2 py-1 bg-green-100 text-green-700 rounded text-xs'>
                Public
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 간단한 통계 카드 컴포넌트
function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className='bg-white p-6 border rounded-xl shadow-sm'>
      <p className='text-sm text-slate-500 mb-1'>{title}</p>
      <h4 className='text-3xl font-bold mb-1'>{value}</h4>
      <p className='text-xs text-slate-400'>{sub}</p>
    </div>
  );
}
