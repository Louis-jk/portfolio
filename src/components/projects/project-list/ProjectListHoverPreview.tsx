'use client';

import { motion, type MotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';
import LiquidButton from '@/components/button/LiquidButton';

type ProjectListHoverPreviewProps = {
  visible: boolean;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
};

export default function ProjectListHoverPreview({
  visible,
  springX,
  springY,
}: ProjectListHoverPreviewProps) {
  if (!visible) return null;

  return createPortal(
    <LiquidButton x={springX} y={springY}>
      Click!
    </LiquidButton>,
    document.body,
  );
}
