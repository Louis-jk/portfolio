'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import type { EditorOutput, StoryContentDocument } from '@/entities/project-detail-page';
import { STORY_CONTENT_SHELL_CLASS } from '@/constants/story-layout';

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
    <div className={`${STORY_CONTENT_SHELL_CLASS} py-4 text-sm text-zinc-500`}>
      {t('detailEditorLoading')}
    </div>
  );
}

type ProjectDetailEditorClientProps = {
  projectId: number;
  locale: string;
  projectTitle: string;
  initialContent: EditorOutput | StoryContentDocument;
  initialIsPublic: boolean;
};

export function ProjectDetailEditorClient(props: ProjectDetailEditorClientProps) {
  return <EditorJsAdmin {...props} />;
}
