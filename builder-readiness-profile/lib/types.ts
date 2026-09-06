export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  worked_for: string;
  outcome: string;
  timeframe: string;
  created_at: string;
}

export interface Skill {
  id: string;
  profile_id: string;
  skill_name: string;
}

export interface Vouch {
  id: string;
  profile_id: string;
  vouch_link_token: string;
  submitter_name: string | null;
  relationship: string | null;
  question_1_response: string | null;
  question_2_response: string | null;
  question_3_response: string | null;
  created_at: string;
  submitted_at: string | null;
}

export interface PlaidItemSummary {
  connected: boolean;
  summary: string | null;
}

export interface SynthesizedProfile {
  id: string;
  profile_id: string;
  summary: string;
  strengths: string[];
  still_developing: string[];
  readiness_tier: ReadinessTier;
  generated_at: string;
}

export type ReadinessTier =
  | 'Just Starting'
  | 'Building Momentum'
  | 'Ready to Pursue Funding'
  | 'Strong Track Record';

export interface Profile {
  id: string;
  name: string;
  created_at: string;
}

export interface ProfileBundle {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  vouches: Vouch[];
  plaid: PlaidItemSummary;
  synthesized: SynthesizedProfile | null;
}

export interface Opportunity {
  slug: string;
  name: string;
  link: string;
  description: string;
  eligibility: string;
  checklist: string[];
  note?: string;
}
