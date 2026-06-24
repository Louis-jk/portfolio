import { NextResponse } from 'next/server';
import { RecordNotFoundError } from '@/lib/prisma/errors';

export function toApiErrorResponse(error: unknown): NextResponse {
  if (error instanceof RecordNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  console.error('[api-error]', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
