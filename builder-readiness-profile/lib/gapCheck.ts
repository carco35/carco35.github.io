import type { Opportunity, ProfileBundle } from './types';

function corpus(bundle: ProfileBundle): string {
  const parts = [
    bundle.synthesized?.summary ?? '',
    ...(bundle.synthesized?.strengths ?? []),
    ...(bundle.synthesized?.still_developing ?? []),
    ...bundle.projects.map((p) => `${p.title} ${p.description} ${p.worked_for} ${p.outcome} ${p.timeframe}`),
    ...bundle.skills.map((s) => s.skill_name),
    ...bundle.vouches
      .filter((v) => v.submitted_at)
      .map((v) => `${v.relationship} ${v.question_1_response} ${v.question_2_response} ${v.question_3_response}`),
  ];
  return parts.join(' ').toLowerCase();
}

const AGE_TERMS = ['18', 'eighteen', 'age', 'years old', 'adult'];
const ADVISOR_TERMS = ['advisor', 'mentor', 'teacher', 'parent', 'guardian', 'adult'];
const TEAM_TERMS = ['team', 'co-founder', 'cofounder', 'partner', 'collaborat'];
const REPAYMENT_TERMS = ['repay', 'repayment', 'budget', 'financial plan', 'loan plan'];
const COURSE_TERMS = ['nfte', 'course', 'class', 'curriculum', 'program'];
const PITCH_TERMS = ['pitch', 'presentation', 'video'];
const BUSINESS_PLAN_TERMS = ['business plan', 'venture', 'concept', 'proposal'];
const SUPPORTER_TERMS = ['vouch', 'supporter', 'endorse', 'reference', 'recommend'];

function has(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

export function gapCheck(opportunity: Opportunity, bundle: ProfileBundle): string[] {
  const text = corpus(bundle);
  const gaps: string[] = [];
  const receivedVouches = bundle.vouches.filter((v) => v.submitted_at).length;

  switch (opportunity.slug) {
    case 'kiva-us':
      if (!has(text, AGE_TERMS)) {
        gaps.push('Profile does not mention age — Kiva requires applicants to be 18+.');
      }
      if (receivedVouches === 0 && !has(text, SUPPORTER_TERMS)) {
        gaps.push('No received vouches yet — Kiva leans on supporters/endorsements instead of a credit score.');
      }
      if (!has(text, REPAYMENT_TERMS)) {
        gaps.push('No repayment plan mentioned yet — Kiva applications ask how you plan to repay the loan.');
      }
      break;
    case 'nfte-youth-entrepreneurship-challenge':
      if (!has(text, COURSE_TERMS)) {
        gaps.push('No mention of an NFTE course or program — most tracks require current or completed enrollment.');
      }
      if (!has(text, BUSINESS_PLAN_TERMS)) {
        gaps.push('No business plan or venture concept described yet.');
      }
      if (!has(text, PITCH_TERMS)) {
        gaps.push('No pitch presentation mentioned yet.');
      }
      break;
    case 'diamond-challenge':
      if (!has(text, ADVISOR_TERMS)) {
        gaps.push('No adult advisor (21+) mentioned — Diamond Challenge requires one per team.');
      }
      if (!has(text, TEAM_TERMS)) {
        gaps.push('No teammates mentioned — Diamond Challenge requires teams of 2-4 students.');
      }
      if (!has(text, PITCH_TERMS)) {
        gaps.push('No video pitch mentioned yet.');
      }
      break;
    case 'score':
      // SCORE has essentially no eligibility bar — flag only if there's nothing to bring to a mentor.
      if (bundle.projects.length === 0) {
        gaps.push('No projects added yet — bring at least a short description of your idea to your mentor.');
      }
      break;
    default:
      break;
  }

  return gaps;
}
