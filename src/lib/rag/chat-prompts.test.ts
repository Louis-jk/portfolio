import { describe, expect, it } from 'vitest';
import {
  buildSystemPrompt,
  getEmptyContextFallback,
  normalizeChatLocale,
} from './chat-prompts';

describe('normalizeChatLocale', () => {
  it('accepts supported locales', () => {
    expect(normalizeChatLocale('en')).toBe('en');
    expect(normalizeChatLocale('ja')).toBe('ja');
    expect(normalizeChatLocale('ko')).toBe('ko');
  });

  it('falls back to ko for unknown locales', () => {
    expect(normalizeChatLocale(undefined)).toBe('ko');
    expect(normalizeChatLocale('fr')).toBe('ko');
  });
});

describe('buildSystemPrompt', () => {
  it('returns Korean prompt for ko', () => {
    const prompt = buildSystemPrompt('ko');
    expect(prompt).toContain('김준호');
    expect(prompt).toContain('한국어');
    expect(prompt).not.toContain('Respond in natural English');
  });

  it('returns English prompt for en', () => {
    const prompt = buildSystemPrompt('en');
    expect(prompt).toContain('Kim Junho');
    expect(prompt).toContain('Respond in natural English only');
  });

  it('returns Japanese prompt for ja', () => {
    const prompt = buildSystemPrompt('ja');
    expect(prompt).toContain('金俊皓');
    expect(prompt).toContain('日本語');
    expect(prompt).not.toContain('한국어');
  });

  it('includes the current year in every locale', () => {
    const year = String(new Date().getFullYear());
    expect(buildSystemPrompt('ko')).toContain(year);
    expect(buildSystemPrompt('en')).toContain(year);
    expect(buildSystemPrompt('ja')).toContain(year);
  });
});

describe('getEmptyContextFallback', () => {
  it('returns locale-specific empty context messages', () => {
    expect(getEmptyContextFallback('ko')).toContain('관련 문서');
    expect(getEmptyContextFallback('en')).toContain('No relevant documents');
    expect(getEmptyContextFallback('ja')).toContain('関連するドキュメント');
  });
});
