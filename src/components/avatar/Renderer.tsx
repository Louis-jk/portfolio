'use client';

import { Canvas } from '@react-three/fiber';
import Avatar from './Avatar';
import { Environment, OrbitControls } from '@react-three/drei';

function Renderer() {
  return (
    <div className='h-[17.5rem] '>
      <Canvas
        camera={{ position: [0.5, 0.5, 3], fov: 30 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1} />
        <Environment preset='sunset' />
        <Avatar />
        <OrbitControls
          minDistance={2}
          maxDistance={4}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

export default Renderer;
