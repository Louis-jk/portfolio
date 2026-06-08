'use client';

import { useEffect, useState } from 'react';

/** Returns true after the component has mounted on the client (avoids hydration mismatch). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
