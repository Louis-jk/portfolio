import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import Flag from 'react-world-flags';

const LanguageSelector = ({
  open,
  setOpen,
  code,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  code: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='mb-5'>
          <DialogTitle>Language</DialogTitle>
        </DialogHeader>
        <ul className='flex flex-col gap-5 text-foreground'>
          <li>
            <Link
              href='/ko'
              className='flex flex-row items-center gap-2 hover:text-foreground/80 transition-colors hover:bg-foreground/10 p-2 rounded-md'
            >
              <Flag code='410' className='w-9 h-7' />
              <p className='text-lg'>한국어</p>
            </Link>
          </li>
          <li>
            <Link
              href='/ja'
              className='flex flex-row items-center gap-2 hover:text-foreground/80 transition-colors hover:bg-foreground/10 p-2 rounded-md'
            >
              <Flag code='392' className='w-9 h-7' />
              <p className='text-lg'>日本語</p>
            </Link>
          </li>
          <li>
            <Link
              href='/en'
              className='flex flex-row items-center gap-2 hover:text-foreground/80 transition-colors hover:bg-foreground/10 p-2 rounded-md'
            >
              <Flag code={code} className='w-9 h-7' />
              <p className='text-lg'>English</p>
            </Link>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
