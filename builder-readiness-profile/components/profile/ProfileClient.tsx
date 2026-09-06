'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ReadinessTierBadge from '@/components/ReadinessTierBadge';
import { fetchBundle, getOrCreateProfileId } from '@/lib/client/profileClient';
import type { ProfileBundle } from '@/lib/types';

export default function ProfileClient() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const generate = useCallback(async (id: string) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not generate profile');
      const refreshed = await fetchBundle(id);
      setBundle(refreshed);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const id = await getOrCreateProfileId();
      setProfileId(id);
      const data = await fetchBundle(id);
      setBundle(data);
      setLoading(false);
      if (!data.synthesized && data.projects.length > 0) {
        await generate(id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !bundle) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16 text-ink/50">Loading…</main>
      </>
    );
  }

  if (bundle.projects.length === 0) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16">
          <h1 className="text-2xl font-semibold text-ink">Add a project first</h1>
          <p className="mt-2 text-ink/60">You need at least one project before we can generate a profile.</p>
          <Link href="/build" className="mt-6 inline-block text-accent hover:underline">
            Go back to Build
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="container-narrow px-6 py-12 max-w-3xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{bundle.profile.name}&apos;s Profile</h1>
          <button
            onClick={() => profileId && generate(profileId)}
            disabled={generating}
            className="text-sm font-medium text-accent hover:underline disabled:opacity-50"
          >
            {generating ? 'Regenerating…' : 'Regenerate'}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {generating && !bundle.synthesized && (
          <p className="mt-8 text-ink/50">Generating your profile with AI…</p>
        )}

        {bundle.synthesized && (
          <div className="mt-8 grid gap-10">
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink/40">Readiness tier</h2>
              <div className="mt-2">
                <ReadinessTierBadge tier={bundle.synthesized.readiness_tier} />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink/40">Summary</h2>
              <p className="mt-2 text-lg text-ink/80 leading-relaxed">{bundle.synthesized.summary}</p>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink/40">Strengths</h2>
              <ul className="mt-2 grid gap-2">
                {bundle.synthesized.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-ink/75">
                    <span className="text-accent">—</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink/40">Still developing</h2>
              <ul className="mt-2 grid gap-2">
                {bundle.synthesized.still_developing.map((s, i) => (
                  <li key={i} className="flex gap-2 text-ink/75">
                    <span className="text-ink/30">—</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="border-t border-border pt-8">
              <Link
                href="/opportunities"
                className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors"
              >
                See funding opportunities
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
