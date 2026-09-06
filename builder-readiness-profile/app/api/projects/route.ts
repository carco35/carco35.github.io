import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId, nowIso } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id, title, description, worked_for, outcome, timeframe } = body;

  if (!profile_id || !title || !description) {
    return NextResponse.json(
      { error: 'profile_id, title, and description are required' },
      { status: 400 }
    );
  }

  const id = newId();
  const created_at = nowIso();
  getDb()
    .prepare(
      `INSERT INTO projects (id, profile_id, title, description, worked_for, outcome, timeframe, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, profile_id, title, description, worked_for ?? '', outcome ?? '', timeframe ?? '', created_at);

  return NextResponse.json({
    id,
    profile_id,
    title,
    description,
    worked_for: worked_for ?? '',
    outcome: outcome ?? '',
    timeframe: timeframe ?? '',
    created_at,
  });
}
