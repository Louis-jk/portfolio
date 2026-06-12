'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { ProjectView } from '@/modules/projects';
import { detailSectionMotion } from '@/lib/projects/detail-motion';
import ProjectDetailTagList from './ProjectDetailTagList';

const TOOL_GROUPS = [
  { key: 'development', labelKey: 'development' },
  { key: 'debugging', labelKey: 'debugging' },
  { key: 'communication', labelKey: 'communication' },
  { key: 'design', labelKey: 'design' },
] as const satisfies ReadonlyArray<{
  key: keyof NonNullable<ProjectView['tools']>;
  labelKey: string;
}>;

type ProjectDetailToolsSectionProps = {
  tools: NonNullable<ProjectView['tools']>;
  isVisible: boolean;
};

export default function ProjectDetailToolsSection({
  tools,
  isVisible,
}: ProjectDetailToolsSectionProps) {
  const tD = useTranslations('details');

  return (
    <motion.div {...detailSectionMotion(isVisible, 1.2)}>
      <h4 className='text-lg font-semibold mb-3'>{tD('toolsAndEnvironments')}</h4>
      {TOOL_GROUPS.map(({ key, labelKey }) => {
        const items = tools[key];
        if (!items?.length) return null;

        return (
          <div key={key} className='mb-5'>
            <h5 className='text-sm font-medium mb-2'>{tD(labelKey)}</h5>
            <ProjectDetailTagList tags={items} />
          </div>
        );
      })}
    </motion.div>
  );
}
