import { describe, expect, it, vi } from 'vitest';

import { formatTime } from '@/utils/time';

describe('formatTime', () => {
  it('calls toLocaleTimeString with ko-KR for locale ko', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleTimeString');
    const date = new Date('2024-06-01T14:30:00Z');
    formatTime(date, 'ko');
    expect(spy).toHaveBeenCalledWith(
      'ko-KR',
      expect.objectContaining({
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    );
    spy.mockRestore();
  });

  it('calls toLocaleTimeString with ja-JP for locale ja', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleTimeString');
    const date = new Date('2024-06-01T14:30:00Z');
    formatTime(date, 'ja');
    expect(spy).toHaveBeenCalledWith(
      'ja-JP',
      expect.objectContaining({
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    );
    spy.mockRestore();
  });

  it('calls toLocaleTimeString with en-US for locale en', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleTimeString');
    const date = new Date('2024-06-01T14:30:00Z');
    formatTime(date, 'en');
    expect(spy).toHaveBeenCalledWith(
      'en-US',
      expect.objectContaining({
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    );
    spy.mockRestore();
  });

  it('defaults unknown locale to ko-KR', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleTimeString');
    const date = new Date('2024-06-01T14:30:00Z');
    formatTime(date, 'fr');
    expect(spy).toHaveBeenCalledWith('ko-KR', expect.any(Object));
    spy.mockRestore();
  });
});
