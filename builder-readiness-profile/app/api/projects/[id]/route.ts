import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const { title, description, worked_for, outcome, timeframe } = body;

  getDb()
    .prepare(
      `UPDATE projects SET title = ?, description = ?, worked_for = ?, outcome = ?, timeframe = ?
       WHERE id = ?`
    )
    .run(title ?? '', description ?? '', worked_for ?? '', outcome ?? '', timeframe ?? '', params.id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(params.id);
  return NextResponse.json({ ok: true });
}
