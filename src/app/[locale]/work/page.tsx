'use client';

import Timeline from '@/components/timeline/Timeline';
import { useSearchParams } from 'next/navigation';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const selectedItemId = searchParams.get('item');

  return (
    <div className='w-4/6 mx-auto px-10 py-10'>
      <Timeline initialSelectedItemId={selectedItemId} />
    </div>
  );
}
