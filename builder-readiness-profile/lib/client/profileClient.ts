'use client';

import type { ProfileBundle } from '@/lib/types';

const STORAGE_KEY = 'brp_profile_id';

export function getStoredProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredProfileId(id: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
}

export async function getOrCreateProfileId(): Promise<string> {
  const existing = getStoredProfileId();
  if (existing) return existing;

  const res = await fetch('/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'My Profile' }),
  });
  const data = await res.json();
  setStoredProfileId(data.id);
  return data.id;
}

export async function fetchBundle(profileId: string): Promise<ProfileBundle> {
  const res = await fetch(`/api/profiles/${profileId}`);
  if (!res.ok) throw new Error('Could not load profile');
  return res.json();
}
