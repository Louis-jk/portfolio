import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { technologies } from '@/data/technologies';

function Technologies() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='flex flex-wrap gap-2'>
      {technologies.map((tech, index) => (
        <span
          key={index}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
            resolvedTheme === 'dark'
              ? 'bg-gray-700 text-gray-200'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          <tech.icon className='w-4 h-4' />
          {tech.name}
        </span>
      ))}
    </div>
  );
}

export default Technologies;
