import { motion, MotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// 복잡한 굴곡을 위한 path 생성 함수
function generateSplashPath(t: number): string {
  const centerX = 50;
  const centerY = 50;
  const baseRadius = 40;

  // 더 많은 점들로 부드럽게
  const points = [];
  const numPoints = 32;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const wobble1 = Math.sin(t + angle * 2) * 8;
    const wobble2 = Math.sin(t * 0.7 + angle * 3) * 5;
    const wobble3 = Math.sin(t * 1.3 + angle * 1.5) * 3;

    const radius = baseRadius + wobble1 + wobble2 + wobble3;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    points.push(`${x},${y}`);
  }

  // 부드러운 곡선으로 path 문자열 생성
  let path = `M ${points[0]}`;
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const prev = points[(i - 1 + points.length) % points.length];

    const [cx, cy] = current.split(',').map(Number);
    const [nx, ny] = next.split(',').map(Number);
    const [px, py] = prev.split(',').map(Number);

    // 더 부드러운 제어점 계산
    const controlX = cx + (nx - px) * 0.15;
    const controlY = cy + (ny - py) * 0.15;

    path += ` Q ${controlX},${controlY} ${nx},${ny}`;
  }
  path += ' Z';

  return path;
}

interface LiquidButtonProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function LiquidButton({
  x,
  y,
  onClick,
  children,
}: LiquidButtonProps) {
  const t = useRef(0);
  const [path, setPath] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // 빠른 등장 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useAnimationFrame(() => {
    if (!isVisible) return;

    t.current += 0.012;
    setPath(generateSplashPath(t.current));
  });

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.15,
        ease: 'easeOut',
        scale: { type: 'spring', stiffness: 400, damping: 15 },
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x,
        y,
        pointerEvents: 'auto',
        zIndex: 100,
        clipPath: `path("${path}")`,
      }}
      onClick={onClick}
      className='w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold select-none'
    >
      <p className='text-black italic'>{children ?? 'Click!'}</p>
    </motion.button>
  );
}
