'use client';

import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';
import { motion } from 'framer-motion';

function Main() {
  return (
    <main className='w-4/6 flex flex-col mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Intro />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      >
        <Timeline />
      </motion.div>
    </main>
  );
}

export default Main;
