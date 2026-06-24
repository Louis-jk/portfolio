import { NextResponse } from 'next/server';
import { requireAuth } from '@/utils/supabase/auth';
import {
  deleteProjectDetailPage,
  getProjectDetailPage,
  patchProjectDetailPage,
  upsertProjectDetailPage,
} from '@/modules/project-detail-page/server';
import { toApiErrorResponse } from '@/lib/http/api-error';
import { parseProjectId } from '@/lib/http/parse-project-id';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = parseProjectId(id);
  if (projectId === null) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    const page = await getProjectDetailPage(projectId);
    if (!page) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = parseProjectId(id);
  if (projectId === null) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const page = await upsertProjectDetailPage(projectId, body);
    return NextResponse.json(page);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = parseProjectId(id);
  if (projectId === null) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const page = await patchProjectDetailPage(projectId, body);
    return NextResponse.json(page);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = parseProjectId(id);
  if (projectId === null) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    await deleteProjectDetailPage(projectId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
