'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ADMIN_ROUTES } from '@/lib/constants';

export default function AdminLoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const base = locale ? `/${locale}${ADMIN_ROUTES.DASHBOARD}` : ADMIN_ROUTES.DASHBOARD;
      router.push(base);
      router.refresh();
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
          Admin 로그인
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'
            >
              이메일
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
              className='w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'
            >
              비밀번호
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
              className='w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent'
            />
          </div>
          {error && (
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          )}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 transition'
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className='mt-4 text-center text-sm text-slate-500 dark:text-slate-400'>
          계정이 없으신가요?{' '}
          <Link
            href={`/${locale}${ADMIN_ROUTES.SIGNUP}`}
            className='text-slate-700 dark:text-slate-300 hover:underline'
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
