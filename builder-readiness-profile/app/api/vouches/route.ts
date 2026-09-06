import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId, nowIso } from '@/lib/db';
import { getVouches } from '@/lib/repo';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id } = body;

  if (!profile_id) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 });
  }

  const id = newId();
  const token = newId();
  const created_at = nowIso();

  getDb()
    .prepare(
      `INSERT INTO vouches (id, profile_id, vouch_link_token, created_at)
       VALUES (?, ?, ?, ?)`
    )
    .run(id, profile_id, token, created_at);

  return NextResponse.json({ id, profile_id, vouch_link_token: token, created_at });
}

export async function GET(req: NextRequest) {
  const profileId = req.nextUrl.searchParams.get('profile_id');
  if (!profileId) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 });
  }
  return NextResponse.json(getVouches(profileId));
}
