'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';
import { buildProjectServerPayload } from '@/schemas/projectSchema';
import { withTimeout } from '@/lib/with-timeout';
import { uploadProjectImage } from '@/app/[locale]/(private)/[adminPath]/projects/upload-image';
import { saveProject } from '@/app/[locale]/(private)/[adminPath]/projects/new/action';
import { updateProject } from '@/app/[locale]/(private)/[adminPath]/projects/[id]/edit/action';
import type { ProjectFormValues } from '@/types/project-form.type';
import {
  MAX_DATA_URL_LENGTH,
  SAVE_TIMEOUT_MS,
  UPLOAD_TIMEOUT_MS,
} from '@/features/admin/projects/lib/constants';

type SubmitPhase = 'idle' | 'uploading' | 'saving';

type UseProjectFormSubmitArgs = {
  projectId?: number;
  initialData?: ProjectFormValues;
  selectedFile: File | null;
  previewUrl: string;
  imageRemoved: boolean;
  reset: UseFormReset<ProjectFormValues>;
  setSelectedFile: (file: File | null) => void;
  setPreviewUrl: (url: string) => void;
  clearDraftAfterSave: () => void;
};

async function dataUrlToFile(dataUrl: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type.split('/')[1] || 'jpg';
  return new File([blob], `draft-${Date.now()}.${extension}`, {
    type: blob.type || 'image/jpeg',
  });
}

function getSubmitValidationError(
  data: ProjectFormValues,
  args: Pick<
    UseProjectFormSubmitArgs,
    'selectedFile' | 'previewUrl' | 'projectId' | 'initialData' | 'imageRemoved'
  >,
): string | null {
  if (!data.startDate?.trim()) {
    return '시작일(Start Date)을 선택해 주세요.';
  }
  const hasImage =
    Boolean(args.selectedFile) ||
    Boolean(args.previewUrl) ||
    Boolean(
      args.projectId && args.initialData?.imageUrl && !args.imageRemoved,
    );
  if (!hasImage) {
    return '프로젝트 이미지를 업로드해 주세요.';
  }
  return null;
}

export function useProjectFormSubmit({
  projectId,
  initialData,
  selectedFile,
  previewUrl,
  imageRemoved,
  reset,
  setSelectedFile,
  setPreviewUrl,
  clearDraftAfterSave,
}: UseProjectFormSubmitArgs) {
  const router = useRouter();
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const isProcessing = submitPhase !== 'idle';

  const onSubmit = useCallback(
    async (data: ProjectFormValues) => {
      const validationError = getSubmitValidationError(data, {
        selectedFile,
        previewUrl,
        projectId,
        initialData,
        imageRemoved,
      });
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        let finalImageUrl = '';
        let fileToUpload = selectedFile;

        if (
          previewUrl.startsWith('http://') ||
          previewUrl.startsWith('https://')
        ) {
          finalImageUrl = previewUrl;
        }

        if (!finalImageUrl) {
          if (!fileToUpload && previewUrl.startsWith('data:')) {
            if (previewUrl.length > MAX_DATA_URL_LENGTH) {
              toast.error(
                '복구된 이미지가 너무 큽니다. 5MB 이하 이미지를 다시 선택해 주세요.',
              );
              return;
            }
            setSubmitPhase('uploading');
            fileToUpload = await withTimeout(
              dataUrlToFile(previewUrl),
              15_000,
              '이미지 준비',
            );
          }

          if (fileToUpload) {
            setSubmitPhase('uploading');
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const uploadResult = await withTimeout(
              uploadProjectImage(formData),
              UPLOAD_TIMEOUT_MS,
              '이미지 업로드',
            );
            if (!uploadResult.success) {
              toast.error(uploadResult.error ?? '이미지 업로드에 실패했습니다.');
              return;
            }

            finalImageUrl = uploadResult.url;
          } else if (projectId && initialData?.imageUrl && !imageRemoved) {
            finalImageUrl = initialData.imageUrl;
          }
        }

        if (!finalImageUrl) {
          toast.error('프로젝트 이미지를 업로드해 주세요.');
          return;
        }

        const payload = buildProjectServerPayload(data, finalImageUrl);

        setSubmitPhase('saving');
        const res = await withTimeout(
          projectId
            ? updateProject(projectId, payload)
            : saveProject(payload),
          SAVE_TIMEOUT_MS,
          '프로젝트 저장',
        );

        if (res.success) {
          clearDraftAfterSave();
          if (projectId) {
            toast.success('프로젝트가 수정되었습니다.');
            router.back();
          } else {
            toast.success(
              '프로젝트가 저장되었습니다. AI 검색 인덱스는 백그라운드에서 반영됩니다.',
            );
            setSelectedFile(null);
            setPreviewUrl('');
            reset();
          }
        } else {
          toast.error(res.error ?? '저장에 실패했습니다.');
        }
      } catch (error) {
        console.error('Submit error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : '저장 중 오류가 발생했습니다.',
        );
      } finally {
        setSubmitPhase('idle');
      }
    },
    [
      selectedFile,
      previewUrl,
      projectId,
      initialData,
      imageRemoved,
      reset,
      setSelectedFile,
      setPreviewUrl,
      clearDraftAfterSave,
      router,
    ],
  );

  return { onSubmit, submitPhase, isProcessing };
}
