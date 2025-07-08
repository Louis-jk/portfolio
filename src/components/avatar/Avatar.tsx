import { Suspense, useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Avatar({ isFacingUser = false }: { isFacingUser?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/avatar.glb');
  const { mouse } = useThree();
  const [isInAvatarArea, setIsInAvatarArea] = useState(false);

  // 아바타 영역 감지 (마우스가 아바타 근처에 있는지 확인)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (event: MouseEvent) => {
      // 화면 중앙 기준으로 아바타 영역 계산 (더 작은 영역)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const avatarArea = 150; // 아바타 주변 150px 반경으로 축소

      const distanceX = Math.abs(event.clientX - centerX);
      const distanceY = Math.abs(event.clientY - centerY);

      // 아바타 영역 내에 있는지 확인
      const isNearAvatar = distanceX < avatarArea && distanceY < avatarArea;

      // 디바운싱으로 버벅거림 방지
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsInAvatarArea(isNearAvatar);
      }, 50); // 50ms 지연으로 안정화
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (isFacingUser) {
      // 사용자를 바라볼 때는 정면으로 회전
      const targetRotationY = 0;
      const targetRotationX = 0;

      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotationY,
        0.1
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        targetRotationX,
        0.1
      );
    } else if (isInAvatarArea) {
      // 아바타 영역에 마우스가 있을 때만 마우스 커서를 바라봄 - 더 부드럽게
      const targetRotationY = THREE.MathUtils.clamp(
        mouse.x * 0.25,
        -0.15,
        0.15
      );
      const targetRotationX = THREE.MathUtils.clamp(
        -mouse.y * 0.12,
        -0.08,
        0.08
      );

      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotationY,
        0.03
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        targetRotationX,
        0.03
      );
    } else {
      // 평상시에는 자동으로 회전
      ref.current.rotation.y += delta * 0.3;
      // X축은 원위치로 부드럽게 복귀
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        0,
        0.05
      );
    }
  });

  return (
    <Suspense fallback={null}>
      <primitive object={scene} ref={ref} scale={3} position={[0, -4.9, 0]} />
    </Suspense>
  );
}

export default Avatar;
