'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import PlaidSection from './PlaidSection';
import VouchSection from './VouchSection';
import { fetchBundle, getOrCreateProfileId } from '@/lib/client/profileClient';
import { EXAMPLE_PROFILE } from '@/lib/exampleData';
import type { ProfileBundle } from '@/lib/types';

export default function BuildClient() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingExample, setLoadingExample] = useState(false);

  const refresh = useCallback(async (id?: string) => {
    const targetId = id ?? profileId;
    if (!targetId) return;
    const data = await fetchBundle(targetId);
    setBundle(data);
  }, [profileId]);

  useEffect(() => {
    (async () => {
      const id = await getOrCreateProfileId();
      setProfileId(id);
      await refresh(id);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadExampleProfile() {
    if (!profileId) return;
    setLoadingExample(true);
    try {
      await fetch(`/api/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: EXAMPLE_PROFILE.name }),
      });

      for (const project of EXAMPLE_PROFILE.projects) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, ...project }),
        });
      }

      for (const skill of EXAMPLE_PROFILE.skills) {
        await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, skill_name: skill }),
        });
      }

      await refresh(profileId);
    } finally {
      setLoadingExample(false);
    }
  }

  if (loading || !bundle || !profileId) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16 text-ink/50">Loading…</main>
      </>
    );
  }

  const canGenerate = bundle.projects.length > 0;

  return (
    <>
      <NavBar />
      <main className="container-narrow px-6 py-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">Build your profile</h1>
            <p className="mt-2 text-ink/60 max-w-xl">
              Add your real projects and skills, optionally connect a bank account, and request
              vouches from people who know your work.
            </p>
          </div>
          <button
            onClick={loadExampleProfile}
            disabled={loadingExample}
            className="shrink-0 rounded-md border border-dashed border-accent/40 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-50"
            title="Dev/demo helper — pre-fills a realistic example profile"
          >
            {loadingExample ? 'Loading example…' : 'Load example profile'}
          </button>
        </div>

        <div className="mt-12 grid gap-16">
          <ProjectsSection profileId={profileId} projects={bundle.projects} onChange={refresh} />
          <SkillsSection profileId={profileId} skills={bundle.skills} onChange={refresh} />
          <PlaidSection profileId={profileId} plaid={bundle.plaid} onChange={refresh} />
          <VouchSection profileId={profileId} vouches={bundle.vouches} onChange={refresh} />
        </div>

        <div className="mt-16 flex flex-col items-start gap-2 border-t border-border pt-8">
          {canGenerate ? (
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors"
            >
              Generate my profile
            </Link>
          ) : (
            <>
              <button
                disabled
                className="inline-flex items-center rounded-md bg-stone-200 px-6 py-3 text-stone-500 font-medium cursor-not-allowed"
              >
                Generate my profile
              </button>
              <p className="text-sm text-ink/40">Add at least one project to continue.</p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
