import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  getDb().prepare('DELETE FROM skills WHERE id = ?').run(params.id);
  return NextResponse.json({ ok: true });
}
