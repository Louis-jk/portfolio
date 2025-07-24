import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
import { useTranslations } from 'next-intl';
import LineShareButton from '../button/share/LineShareButton';

interface ShareModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  title: string;
  text: string;
}

function ShareModal({ open, setOpen, url, title, text }: ShareModalProps) {
  const t = useTranslations('modal.shareModal');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='mb-5'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className='flex gap-2'>
          <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title}>
            <XIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={url} title={title} summary={text}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <EmailShareButton url={url} subject={title} body={text}>
            <EmailIcon size={32} round />
          </EmailShareButton>
          <LineShareButton url={url} size={32} round />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareModal;
