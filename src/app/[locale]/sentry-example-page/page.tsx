'use client';

export default function SentryExamplePage() {
  return (
    <div>
      <h1>Sentry Example Page</h1>
      <button
        onClick={() => {
          throw new Error('Sentry test error');
        }}
      >
        Trigger Error
      </button>
    </div>
  );
}
