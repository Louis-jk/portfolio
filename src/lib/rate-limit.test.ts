import { describe, expect, it } from 'vitest';
import { checkRateLimit } from './rate-limit';

describe('checkRateLimit', () => {
  it('allows requests within the limit', () => {
    const config = { limit: 3, windowMs: 60_000 };
    const now = 1_000_000;

    expect(checkRateLimit('ip-a', config, now)).toMatchObject({ ok: true, remaining: 2 });
    expect(checkRateLimit('ip-a', config, now + 1)).toMatchObject({ ok: true, remaining: 1 });
    expect(checkRateLimit('ip-a', config, now + 2)).toMatchObject({ ok: true, remaining: 0 });
  });

  it('blocks requests over the limit until the window resets', () => {
    const config = { limit: 2, windowMs: 1_000 };
    const now = 2_000_000;

    checkRateLimit('ip-b', config, now);
    checkRateLimit('ip-b', config, now + 10);

    const blocked = checkRateLimit('ip-b', config, now + 20);
    expect(blocked).toMatchObject({ ok: false, retryAfterSec: 1 });

    const afterReset = checkRateLimit('ip-b', config, now + 1_001);
    expect(afterReset).toMatchObject({ ok: true, remaining: 1 });
  });

  it('tracks limits per key independently', () => {
    const config = { limit: 1, windowMs: 60_000 };
    const now = 3_000_000;

    expect(checkRateLimit('ip-1', config, now)).toMatchObject({ ok: true });
    expect(checkRateLimit('ip-1', config, now + 1)).toMatchObject({ ok: false });
    expect(checkRateLimit('ip-2', config, now + 1)).toMatchObject({ ok: true });
  });
});
