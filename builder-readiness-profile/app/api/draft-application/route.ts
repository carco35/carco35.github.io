import { NextRequest, NextResponse } from 'next/server';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import { getDb, newId, nowIso } from '@/lib/db';
import { getProfileBundle } from '@/lib/repo';
import { getOpportunity } from '@/lib/opportunities';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id, opportunity_slug } = body;

  if (!profile_id || !opportunity_slug) {
    return NextResponse.json({ error: 'profile_id and opportunity_slug are required' }, { status: 400 });
  }

  const opportunity = getOpportunity(opportunity_slug);
  if (!opportunity) {
    return NextResponse.json({ error: 'Unknown opportunity' }, { status: 404 });
  }

  const bundle = getProfileBundle(profile_id);
  if (!bundle || !bundle.synthesized) {
    return NextResponse.json({ error: 'Generate a synthesized profile first' }, { status: 400 });
  }

  const receivedVouches = bundle.vouches.filter((v) => v.submitted_at);

  const dataForModel = {
    name: bundle.profile.name,
    summary: bundle.synthesized.summary,
    strengths: bundle.synthesized.strengths,
    still_developing: bundle.synthesized.still_developing,
    readiness_tier: bundle.synthesized.readiness_tier,
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

  const prompt = `You are helping a young entrepreneur draft a first-pass application to a real funding/support opportunity. Use ONLY the builder profile data below — do not invent facts.

Builder profile data:
${JSON.stringify(dataForModel, null, 2)}

Opportunity: ${opportunity.name}
Description: ${opportunity.description}
Eligibility: ${opportunity.eligibility}
Application checklist:
${opportunity.checklist.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Write a first-draft response that addresses each checklist item, in order, using the builder's real projects, skills, and vouches wherever relevant. Where the data doesn't cover a checklist item (e.g. no adult advisor mentioned, or age not stated), clearly write "[TO FILL IN: ...]" instead of making something up. Use a confident but honest tone — this is a draft the builder will personalize and submit themselves, not a finished application. Keep it focused and skimmable, using short paragraphs or a checklist-style format that mirrors the items above. Do not use the words "credit score" or "credit report". Respond with plain text only, no JSON, no markdown code fences.`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from model');
    }

    const draft_content = textBlock.text.trim();
    const id = newId();
    const generated_at = nowIso();

    getDb()
      .prepare(
        `INSERT INTO opportunity_drafts (id, profile_id, opportunity_slug, draft_content, generated_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(id, profile_id, opportunity_slug, draft_content, generated_at);

    return NextResponse.json({ id, profile_id, opportunity_slug, draft_content, generated_at });
  } catch (err) {
    console.error('Draft-application error', err);
    return NextResponse.json({ error: 'Could not generate a draft right now' }, { status: 500 });
  }
}
