import { NextResponse } from 'next/server';

/** Lightweight readiness probe for CI / Playwright (no database). */
export function GET() {
  return NextResponse.json({ ok: true });
}
