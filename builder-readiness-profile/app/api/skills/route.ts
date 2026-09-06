import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id, skill_name } = body;

  if (!profile_id || !skill_name || !String(skill_name).trim()) {
    return NextResponse.json({ error: 'profile_id and skill_name are required' }, { status: 400 });
  }

  const id = newId();
  getDb()
    .prepare('INSERT INTO skills (id, profile_id, skill_name) VALUES (?, ?, ?)')
    .run(id, profile_id, String(skill_name).trim());

  return NextResponse.json({ id, profile_id, skill_name: String(skill_name).trim() });
}
