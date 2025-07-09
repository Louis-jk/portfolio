import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  isFacingUser?: boolean;
};

export default function Model({ isFacingUser = false }: Props) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/profile_upper.glb');

  useEffect(() => {
    // 혹시 남아있을 수 있는 하체 오브젝트 강제 숨기기
    scene.traverse((obj) => {
      if (obj.name.match(/leg|foot|hip|pelvis/i)) {
        obj.visible = false;
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (isFacingUser) {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        0,
        0.1
      );
    } else {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={ref} scale={3} position={[0, -4.9, 0]}>
      <primitive object={scene} />
    </group>
  );
}
