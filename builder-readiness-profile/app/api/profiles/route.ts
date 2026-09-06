import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId, nowIso } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'My Profile';

  const id = newId();
  const created_at = nowIso();
  getDb()
    .prepare('INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?)')
    .run(id, name, created_at);

  return NextResponse.json({ id, name, created_at });
}
