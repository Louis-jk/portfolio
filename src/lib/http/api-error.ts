import { NextResponse } from 'next/server';
import { NestApiError } from '@/lib/http/nest-client';

export function toApiErrorResponse(error: unknown): NextResponse {
  if (error instanceof NestApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status >= 400 ? error.status : 502 },
    );
  }

  console.error('[api-error]', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
