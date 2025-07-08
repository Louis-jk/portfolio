'use client';

import { useEffect, useState } from 'react';
import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';

function Main() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <main
      className={`max-w-screen-sm w-full flex flex-col mx-auto transition-all duration-700
    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <Intro />
      <Timeline />
    </main>
  );
}

export default Main;
