'use client';

import { FaGooglePlay, FaDesktop } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { TbBrowserShare } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProjectView } from '@/modules/projects';

type PlatformLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export function getPlatformLinks(item: ProjectView): PlatformLink[] {
  if (!item.isPublic || !item.platforms) return [];

  const links: PlatformLink[] = [];

  if (item.platforms.webLink) {
    links.push({
      href: item.platforms.webLink,
      icon: <TbBrowserShare className='w-3 h-3' />,
      label: 'Website',
    });
  }
  if (item.platforms.iosLink) {
    links.push({
      href: item.platforms.iosLink,
      icon: <IoLogoAppleAppstore className='w-3 h-3' />,
      label: 'App Store',
    });
  }
  if (item.platforms.androidLink) {
    links.push({
      href: item.platforms.androidLink,
      icon: <FaGooglePlay className='w-3 h-3' />,
      label: 'Google Play',
    });
  }
  if (item.platforms.desktopLink) {
    links.push({
      href: item.platforms.desktopLink,
      icon: <FaDesktop className='w-3 h-3' />,
      label: 'Desktop',
    });
  }

  return links;
}

type ProjectDetailPlatformLinksProps = {
  item: ProjectView;
  className?: string;
};

export default function ProjectDetailPlatformLinks({
  item,
  className,
}: ProjectDetailPlatformLinksProps) {
  const links = getPlatformLinks(item);
  if (links.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {links.map((link) => (
        <Button
          key={link.label}
          variant='default'
          size='sm'
          className='cursor-pointer'
          onClick={() => window.open(link.href, '_blank')}
        >
          <div className='flex items-center gap-1'>
            {link.icon}
            <span>{link.label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
