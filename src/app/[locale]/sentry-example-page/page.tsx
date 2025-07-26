'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function SentryExamplePage() {
  useEffect(() => {
    Sentry.captureException(new Error('🔥 Sentry manual test error!'));
  }, []);

  return <div>Sending test error...</div>;
}
