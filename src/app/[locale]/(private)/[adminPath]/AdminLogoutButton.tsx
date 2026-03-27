'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ADMIN_ROUTES } from '@/lib/constants';

export default function AdminLogoutButton({ locale }: { locale: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    const loginUrl = `/${locale}${ADMIN_ROUTES.DASHBOARD}/login`;
    router.push(loginUrl);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className='text-sm text-red-500 hover:underline'
    >
      Logout
    </button>
  );
}
