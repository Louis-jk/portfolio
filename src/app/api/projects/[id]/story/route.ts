import { NextResponse } from 'next/server';
import { getProjectDetailPage } from '@/modules/project-detail-page';
import { toApiErrorResponse } from '@/lib/http/api-error';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const projectId = parseInt(id, 10);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    const page = await getProjectDetailPage(projectId);
    return NextResponse.json({ content: page?.content ?? null });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
