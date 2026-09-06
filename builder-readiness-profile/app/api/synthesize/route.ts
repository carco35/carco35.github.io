import { NextRequest, NextResponse } from 'next/server';
import { anthropic, CLAUDE_MODEL, extractJson } from '@/lib/anthropic';
import { getDb, newId, nowIso } from '@/lib/db';
import { getProfileBundle } from '@/lib/repo';
import type { ReadinessTier } from '@/lib/types';

interface SynthesisResult {
  summary: string;
  strengths: string[];
  still_developing: string[];
  readiness_tier: ReadinessTier;
}

const VALID_TIERS: ReadinessTier[] = [
  'Just Starting',
  'Building Momentum',
  'Ready to Pursue Funding',
  'Strong Track Record',
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id } = body;

  if (!profile_id) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 });
  }

  const bundle = getProfileBundle(profile_id);
  if (!bundle) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  if (bundle.projects.length === 0) {
    return NextResponse.json({ error: 'Add at least one project before generating a profile' }, { status: 400 });
  }

  const receivedVouches = bundle.vouches.filter((v) => v.submitted_at);

  const dataForModel = {
    name: bundle.profile.name,
    projects: bundle.projects.map((p) => ({
      title: p.title,
      description: p.description,
      worked_for: p.worked_for,
      outcome: p.outcome,
      timeframe: p.timeframe,
    })),
    skills: bundle.skills.map((s) => s.skill_name),
    bank_activity_summary: bundle.plaid.connected ? bundle.plaid.summary : 'Not connected',
    vouches: receivedVouches.map((v) => ({
      relationship: v.relationship,
      how_they_know_them: v.question_1_response,
      would_work_with_again: v.question_2_response,
      specific_example: v.question_3_response,
    })),
  };

  const prompt = `You are helping build a "Builder Readiness Profile" for a young entrepreneur who may not have traditional credit history. Based ONLY on the structured data below, write an honest, encouraging but realistic assessment.

Data:
${JSON.stringify(dataForModel, null, 2)}

Respond with ONLY a JSON object in this exact shape, no other text:
{
  "summary": "2-3 sentence narrative summary of this person as a builder",
  "strengths": ["3-5 bullet points, specific and grounded in the data given"],
  "still_developing": ["1-3 honest, non-harsh gaps or areas for growth"],
  "readiness_tier": "one of: Just Starting / Building Momentum / Ready to Pursue Funding / Strong Track Record"
}

Do not fabricate details not present in the data. Do not use the words "credit score" or "credit report" anywhere in your response.`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from model');
    }

    const result = extractJson<SynthesisResult>(textBlock.text);

    if (!VALID_TIERS.includes(result.readiness_tier)) {
      result.readiness_tier = 'Building Momentum';
    }

    const id = newId();
    const generated_at = nowIso();

    getDb()
      .prepare(
        `INSERT INTO synthesized_profiles (id, profile_id, summary, strengths, still_developing, readiness_tier, generated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        id,
        profile_id,
        result.summary,
        JSON.stringify(result.strengths),
        JSON.stringify(result.still_developing),
        result.readiness_tier,
        generated_at
      );

    return NextResponse.json({
      id,
      profile_id,
      summary: result.summary,
      strengths: result.strengths,
      still_developing: result.still_developing,
      readiness_tier: result.readiness_tier,
      generated_at,
    });
  } catch (err) {
    console.error('Synthesize error', err);
    return NextResponse.json({ error: 'Could not generate profile right now' }, { status: 500 });
  }
}
