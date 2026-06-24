'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { isDetailMobileWidth } from '@/constants/breakpoints';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({
  url,
  rotationStage,
  setRotationStage,
  userInteracted,
  lastInteractionTime,
}: {
  url: string;
  rotationStage: string;
  setRotationStage: (v: 'idle' | 'toFront' | 'toDiagonal') => void;
  userInteracted: boolean;
  lastInteractionTime: number;
}) {
  const gltf = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const now = Date.now();
    let targetY = ref.current.rotation.y;

    if (
      rotationStage === 'idle' &&
      userInteracted &&
      now - lastInteractionTime > 5000
    ) {
      setRotationStage('toDiagonal');
    }

    if (rotationStage === 'toFront') targetY = 0;
    else if (rotationStage === 'toDiagonal') targetY = Math.PI / 4;

    const currentY = ref.current.rotation.y;
    ref.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.05);

    if (Math.abs(currentY - targetY) < 0.01) ref.current.rotation.y = targetY;
  });

  return (
    <primitive
      object={gltf.scene}
      ref={ref}
      position={[0, -2.65, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.65}
    />
  );
}

export default function Renderer() {
  const [isClient, setIsClient] = useState(false);
  const [rotationStage, setRotationStage] = useState<
    'idle' | 'toFront' | 'toDiagonal'
  >('idle');
  const [userInteracted, setUserInteracted] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [canvasSize, setCanvasSize] = useState({ width: 232, height: 232 });

  // 초기 애니메이션
  useEffect(() => {
    const toFrontTimer = setTimeout(() => setRotationStage('toFront'), 1000);
    const toDiagonalTimer = setTimeout(
      () => setRotationStage('toDiagonal'),
      4800
    );
    return () => {
      clearTimeout(toFrontTimer);
      clearTimeout(toDiagonalTimer);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 반응형 Canvas 사이즈
  useEffect(() => {
    const updateSize = () => {
      const w = isDetailMobileWidth(window.innerWidth)
        ? window.innerWidth * 0.6
        : 232;
      const h = w;
      setCanvasSize({ width: w, height: h });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // WebGL context lost / restore
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handleLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost');
    };
    const handleRestore = () => console.log('WebGL context restored');

    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestore);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestore);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ width: canvasSize.width, height: canvasSize.height }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 17 }}
        dpr={[1, 1.5]} // 모바일 고성능 GPU를 위해 dpr 제한
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        performance={{ min: 0.5, max: 1 }}
      >
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Model
            url='/models/new_profile.glb'
            rotationStage={rotationStage}
            setRotationStage={setRotationStage}
            userInteracted={userInteracted}
            lastInteractionTime={lastInteractionTime}
          />
          <Environment
            preset='warehouse'
            background={false}
            frames={1}
            near={1}
            far={1000}
            resolution={256}
          />
        </Suspense>
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableRotate={true}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          target={[0, 0, 0]}
          onStart={() => {
            setUserInteracted(true);
            setRotationStage('idle');
          }}
          onEnd={() => setLastInteractionTime(Date.now())}
        />
      </Canvas>
    </div>
  );
}
