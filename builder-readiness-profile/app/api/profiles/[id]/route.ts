import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getProfileBundle } from '@/lib/repo';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const bundle = getProfileBundle(params.id);
  if (!bundle) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  return NextResponse.json(bundle);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.name === 'string' && body.name.trim()) {
    getDb().prepare('UPDATE profiles SET name = ? WHERE id = ?').run(body.name.trim(), params.id);
  }
  const bundle = getProfileBundle(params.id);
  if (!bundle) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  return NextResponse.json(bundle);
}
