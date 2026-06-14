'use client';

import { useState } from 'react';
import type { UseFormGetValues } from 'react-hook-form';
import { saveProjectFormDraft } from '@/lib/project-form-draft';
import type { ProjectFormValues } from '@/types/project-form.type';

export function useProjectImageUpload({
  projectId,
  initialImageUrl,
  getValues,
}: {
  projectId?: number;
  initialImageUrl?: string;
  getValues: UseFormGetValues<ProjectFormValues>;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl ?? '');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setSelectedFile(file);
    setImageRemoved(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      saveProjectFormDraft(projectId, getValues(), result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageRemoved(true);
  };

  return {
    selectedFile,
    setSelectedFile,
    imageRemoved,
    setImageRemoved,
    previewUrl,
    setPreviewUrl,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
  };
}
