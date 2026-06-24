import { NextResponse } from 'next/server';
import { getProjectDetailPage } from '@/modules/project-detail-page/server';
import { toApiErrorResponse } from '@/lib/http/api-error';
import { requireAuth } from '@/utils/supabase/auth';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const projectId = parseInt(id, 10);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    const page = await getProjectDetailPage(projectId);
    if (!page) {
      return NextResponse.json({ content: null }, { status: 404 });
    }

    if (!page.isPublic) {
      const auth = await requireAuth();
      if (!auth.authorized) {
        return NextResponse.json({ content: null }, { status: 404 });
      }
    }

    return NextResponse.json(
      { content: page.content ?? null },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
