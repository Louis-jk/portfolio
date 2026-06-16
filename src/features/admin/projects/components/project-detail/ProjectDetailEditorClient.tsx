'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import type { EditorOutput } from '@/modules/project-detail-page';

const EditorJsAdmin = dynamic(
  () =>
    import('./EditorJsAdmin').then((mod) => mod.EditorJsAdmin),
  {
    ssr: false,
    loading: () => <EditorJsAdminLoading />,
  },
);

function EditorJsAdminLoading() {
  const t = useTranslations('admin.projects');
  return (
    <div className='mx-auto max-w-4xl p-6 text-sm text-zinc-500'>
      {t('detailEditorLoading')}
    </div>
  );
}

type ProjectDetailEditorClientProps = {
  projectId: number;
  locale: string;
  projectTitle: string;
  initialContent: EditorOutput;
  initialIsPublic: boolean;
};

export function ProjectDetailEditorClient(props: ProjectDetailEditorClientProps) {
  return <EditorJsAdmin {...props} />;
}
