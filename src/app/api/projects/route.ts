// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { listProjects } from '@/modules/projects/server';
import { toApiErrorResponse } from '@/lib/http/api-error';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale');

  if (!locale) {
    return NextResponse.json({ error: 'locale is required' }, { status: 400 });
  }

  try {
    const projects = await listProjects(locale);
    return NextResponse.json(projects);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
