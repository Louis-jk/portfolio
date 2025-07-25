'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
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

    // 자동 회전 조건
    if (
      rotationStage === 'idle' &&
      userInteracted &&
      now - lastInteractionTime > 5000
    ) {
      setRotationStage('toDiagonal');
    }

    if (rotationStage === 'toFront') {
      targetY = 0;
    } else if (rotationStage === 'toDiagonal') {
      targetY = Math.PI / 4;
    }

    const currentY = ref.current.rotation.y;
    ref.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.05);

    if (Math.abs(currentY - targetY) < 0.01) {
      ref.current.rotation.y = targetY;
    }
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

  // 초기 애니메이션 실행
  useEffect(() => {
    const toFrontTimer = setTimeout(() => {
      setRotationStage('toFront');
    }, 1000);

    const toDiagonalTimer = setTimeout(() => {
      setRotationStage('toDiagonal');
    }, 4800);

    return () => {
      clearTimeout(toFrontTimer);
      clearTimeout(toDiagonalTimer);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className='h-[14.5rem] w-[14.5rem] 2xl:h-[17.5rem] 2xl:w-[17.5rem]'>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 17 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.5 }}
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
          onEnd={() => {
            setLastInteractionTime(Date.now());
          }}
        />
      </Canvas>
    </div>
  );
}
