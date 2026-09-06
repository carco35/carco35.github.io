import { NextRequest, NextResponse } from 'next/server';
import { getDb, nowIso } from '@/lib/db';
import type { Vouch } from '@/lib/types';

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const vouch = getDb()
    .prepare('SELECT * FROM vouches WHERE vouch_link_token = ?')
    .get(params.token) as Vouch | undefined;

  if (!vouch) {
    return NextResponse.json({ error: 'Vouch link not found' }, { status: 404 });
  }

  const profile = getDb()
    .prepare('SELECT name FROM profiles WHERE id = ?')
    .get(vouch.profile_id) as { name: string } | undefined;

  return NextResponse.json({
    profileName: profile?.name ?? 'this builder',
    alreadySubmitted: Boolean(vouch.submitted_at),
  });
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const body = await req.json().catch(() => ({}));
  const { submitter_name, relationship, question_1_response, question_2_response, question_3_response } = body;

  const vouch = getDb()
    .prepare('SELECT * FROM vouches WHERE vouch_link_token = ?')
    .get(params.token) as Vouch | undefined;

  if (!vouch) {
    return NextResponse.json({ error: 'Vouch link not found' }, { status: 404 });
  }
  if (vouch.submitted_at) {
    return NextResponse.json({ error: 'This vouch has already been submitted' }, { status: 409 });
  }

  if (!submitter_name || !relationship || !question_1_response || !question_2_response || !question_3_response) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  getDb()
    .prepare(
      `UPDATE vouches SET submitter_name = ?, relationship = ?, question_1_response = ?,
       question_2_response = ?, question_3_response = ?, submitted_at = ?
       WHERE vouch_link_token = ?`
    )
    .run(
      submitter_name,
      relationship,
      question_1_response,
      question_2_response,
      question_3_response,
      nowIso(),
      params.token
    );

  return NextResponse.json({ ok: true });
}
