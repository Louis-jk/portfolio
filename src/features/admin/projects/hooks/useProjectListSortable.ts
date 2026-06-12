'use client';

import { useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  updateProjectOrder,
  deleteProject,
} from '@/app/[locale]/(private)/[adminPath]/projects/actions';
import type { AdminProjectListItem } from '@/features/admin/projects/types';

export function useProjectListSortable(projects: AdminProjectListItem[]) {
  const t = useTranslations('admin.projects');
  const [items, setItems] = useState(projects);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previousItems = items;
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);

    const res = await updateProjectOrder(newOrder.map((p) => p.id));
    if (!res?.success) {
      setItems(previousItems);
      toast.error(res?.error ?? t('orderChangeFailed'));
    } else {
      toast.success(t('orderChanged'));
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return;
    const res = await deleteProject(projectId);
    if (res?.success) {
      setItems((prev) => prev.filter((p) => p.id !== projectId));
    } else {
      alert(res?.error ?? '삭제에 실패했습니다.');
    }
  };

  return { items, isMounted, handleDragEnd, handleDelete };
}
