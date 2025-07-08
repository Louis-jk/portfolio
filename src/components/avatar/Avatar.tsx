import { Suspense, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Avatar() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/avatar.glb');
  const [isHovered, setIsHovered] = useState(false);

  // 자동 회전 애니메이션
  useFrame((_, delta) => {
    if (!isHovered && ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Suspense fallback={null}>
      <primitive
        object={scene}
        ref={ref}
        scale={3}
        position={[0, -4.9, 0]}
        rotation={[0, Math.PI / 8, 0]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      />
    </Suspense>
  );
}

export default Avatar;
