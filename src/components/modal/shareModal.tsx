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
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  LineShareButton,
  LineIcon,
} from 'react-share';
import KakaoTalkShareButton from '@/components/button/share/KakaoTalkShareButton';
import ClipboardShareButton from '@/components/button/share/ClipboardShareButton';
import { useTranslations } from 'next-intl';

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
          <LineShareButton url={url} title={title}>
            <LineIcon size={32} round />
          </LineShareButton>
          <KakaoTalkShareButton
            url={url}
            title={title}
            description={text}
            size={32}
            round
          />
          <ClipboardShareButton url={url} size={32} round />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareModal;
