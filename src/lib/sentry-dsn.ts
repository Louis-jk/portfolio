/** Sentry DSN — server prefers SENTRY_DSN; client uses NEXT_PUBLIC_SENTRY_DSN. */
export function getSentryDsn() {
  return process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? '';
}
