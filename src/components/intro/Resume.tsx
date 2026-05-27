import { MdOpenInNew } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Resume = ({ locale }: { locale: string }) => {
  const tResume = useTranslations('homePage.intro.resume');
  const tResumeTitle = tResume('title');

  const resumePath =
    locale === 'ko'
      ? '/downloads/김준호_이력서.pdf'
      : locale === 'ja'
        ? '/downloads/金俊皓_履歴書.pdf'
        : '/downloads/JoonhoKim_Resume.pdf';

  return (
    <Link href={resumePath} target='_blank' rel='noopener noreferrer'>
      <div className='flex flex-row items-center justify-baseline gap-2 bg-purple-500 px-4 py-2 rounded-md hover:bg-purple-600 transition-all duration-300'>
        <span className='text-md font-bold text-white'>{tResumeTitle}</span>
        <MdOpenInNew className='w-4 h-4 text-white' />
      </div>
    </Link>
  );
};

export default Resume;
