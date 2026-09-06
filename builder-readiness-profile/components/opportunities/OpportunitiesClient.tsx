'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import OpportunityCard from './OpportunityCard';
import { fetchBundle, getOrCreateProfileId } from '@/lib/client/profileClient';
import { OPPORTUNITIES } from '@/lib/opportunities';
import type { ProfileBundle } from '@/lib/types';

export default function OpportunitiesClient() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = await getOrCreateProfileId();
      setProfileId(id);
      const data = await fetchBundle(id);
      setBundle(data);
      setLoading(false);
    })();
  }, []);

  if (loading || !bundle || !profileId) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16 text-ink/50">Loading…</main>
      </>
    );
  }

  if (!bundle.synthesized) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16">
          <h1 className="text-2xl font-semibold text-ink">Generate your profile first</h1>
          <p className="mt-2 text-ink/60">
            We use your synthesized profile to check what might still be missing for each
            opportunity.
          </p>
          <Link href="/profile" className="mt-6 inline-block text-accent hover:underline">
            Go to your profile
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="container-narrow px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Funding opportunities</h1>
        <p className="mt-2 text-ink/60 max-w-2xl">
          Four real programs built for young entrepreneurs. Drafts are a starting point only —
          you always review, personalize, and submit through the official site yourself.
        </p>

        <div className="mt-10 grid gap-8">
          {OPPORTUNITIES.map((opp) => (
            <OpportunityCard key={opp.slug} opportunity={opp} profileId={profileId} bundle={bundle} />
          ))}
        </div>
      </main>
    </>
  );
}
