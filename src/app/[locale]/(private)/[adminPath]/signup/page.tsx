'use client';

import { useState } from 'react';
import { useMounted } from '@/hooks/useMounted';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ADMIN_ROUTES } from '@/lib/constants';

function SignupFormSkeleton() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
          Admin 회원가입
        </h2>
        <div className='space-y-4' aria-hidden='true'>
          <div className='h-[68px] rounded-lg bg-slate-100 dark:bg-slate-800/80 animate-pulse' />
          <div className='h-[68px] rounded-lg bg-slate-100 dark:bg-slate-800/80 animate-pulse' />
          <div className='h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse' />
        </div>
      </div>
    </div>
  );
}

export default function AdminSignupPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const mounted = useMounted();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!mounted) {
    return <SignupFormSkeleton />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/${locale}${ADMIN_ROUTES.DASHBOARD}` },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Supabase가 이메일 확인을 요구하면 success 메시지, 아니면 바로 로그인됨
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push(`/${locale}${ADMIN_ROUTES.DASHBOARD}`);
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='w-full max-w-md text-center space-y-4'>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
            이메일을 확인해주세요
          </h2>
          <p className='text-slate-600 dark:text-slate-400'>
            {email}로 인증 링크를 보냈습니다. 링크를 클릭한 후 로그인해주세요.
          </p>
          <Link
            href={`/${locale}${ADMIN_ROUTES.LOGIN}`}
            className='inline-block text-slate-600 dark:text-slate-400 hover:underline'
          >
            로그인 페이지로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
          Admin 회원가입
        </h2>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
          data-lpignore='true'
          data-1p-ignore
          data-bwignore
        >
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
              비밀번호 (6자 이상)
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete='new-password'
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
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className='mt-4 text-center text-sm text-slate-500 dark:text-slate-400'>
          이미 계정이 있으신가요?{' '}
          <Link
            href={`/${locale}${ADMIN_ROUTES.LOGIN}`}
            className='text-slate-700 dark:text-slate-300 hover:underline'
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
