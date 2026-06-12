import { Badge } from '@/components/ui/badge';

export function AdminVisibilityBadge({ isPublic }: { isPublic: boolean }) {
  if (isPublic) {
    return (
      <Badge className='bg-indigo-600 text-white border-none'>PUBLIC</Badge>
    );
  }

  return (
    <Badge variant='outline' className='bg-red-700 text-white border-none'>
      PRIVATE
    </Badge>
  );
}
