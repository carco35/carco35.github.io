import { getDb } from './db';
import type {
  Profile,
  Project,
  Skill,
  Vouch,
  PlaidItemSummary,
  SynthesizedProfile,
  ProfileBundle,
} from './types';

export function getProfile(profileId: string): Profile | undefined {
  return getDb()
    .prepare('SELECT * FROM profiles WHERE id = ?')
    .get(profileId) as Profile | undefined;
}

export function getProjects(profileId: string): Project[] {
  return getDb()
    .prepare('SELECT * FROM projects WHERE profile_id = ? ORDER BY created_at ASC')
    .all(profileId) as Project[];
}

export function getSkills(profileId: string): Skill[] {
  return getDb()
    .prepare('SELECT * FROM skills WHERE profile_id = ? ORDER BY rowid ASC')
    .all(profileId) as Skill[];
}

export function getVouches(profileId: string): Vouch[] {
  return getDb()
    .prepare('SELECT * FROM vouches WHERE profile_id = ? ORDER BY created_at ASC')
    .all(profileId) as Vouch[];
}

export function getPlaidSummary(profileId: string): PlaidItemSummary {
  const row = getDb()
    .prepare(
      'SELECT transactions_summary FROM plaid_items WHERE profile_id = ? ORDER BY created_at DESC LIMIT 1'
    )
    .get(profileId) as { transactions_summary: string | null } | undefined;
  if (!row) {
    return { connected: false, summary: null };
  }
  return { connected: true, summary: row.transactions_summary };
}

export function getLatestSynthesized(profileId: string): SynthesizedProfile | null {
  const row = getDb()
    .prepare(
      'SELECT * FROM synthesized_profiles WHERE profile_id = ? ORDER BY generated_at DESC LIMIT 1'
    )
    .get(profileId) as
    | (Omit<SynthesizedProfile, 'strengths' | 'still_developing'> & {
        strengths: string;
        still_developing: string;
      })
    | undefined;
  if (!row) return null;
  return {
    ...row,
    strengths: JSON.parse(row.strengths),
    still_developing: JSON.parse(row.still_developing),
  } as SynthesizedProfile;
}

export function getProfileBundle(profileId: string): ProfileBundle | null {
  const profile = getProfile(profileId);
  if (!profile) return null;
  return {
    profile,
    projects: getProjects(profileId),
    skills: getSkills(profileId),
    vouches: getVouches(profileId),
    plaid: getPlaidSummary(profileId),
    synthesized: getLatestSynthesized(profileId),
  };
}
