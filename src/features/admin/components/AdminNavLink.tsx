'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AdminNavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

export function AdminNavLink({
  href,
  children,
  className,
  exact = false,
}: AdminNavLinkProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
  const isPending = pendingHref === href;

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <Link
      href={href}
      aria-busy={isPending}
      onClick={() => setPendingHref(href)}
      className={cn(
        'block rounded p-2 transition',
        'hover:bg-slate-800 dark:hover:bg-slate-800/80',
        isActive && 'bg-slate-800 dark:bg-slate-800/80',
        isPending && 'opacity-70',
        className,
      )}
    >
      <span className='inline-flex items-center gap-2'>
        {children}
        {isPending ? (
          <span
            className='inline-block size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white'
            aria-hidden
          />
        ) : null}
      </span>
    </Link>
  );
}
