'use client';

import { useState } from 'react';
import type { Opportunity, ProfileBundle } from '@/lib/types';
import { gapCheck } from '@/lib/gapCheck';

interface Props {
  opportunity: Opportunity;
  profileId: string;
  bundle: ProfileBundle;
}

export default function OpportunityCard({ opportunity, profileId, bundle }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gaps = gapCheck(opportunity, bundle);

  async function handleDraft() {
    setDrafting(true);
    setError(null);
    try {
      const res = await fetch('/api/draft-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId, opportunity_slug: opportunity.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not generate a draft');
      setDraft(data.draft_content);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setDrafting(false);
    }
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      // ignore — text is already visible on screen to copy manually
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold text-ink">{opportunity.name}</h2>
        <a
          href={opportunity.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent hover:underline shrink-0"
        >
          Visit official site ↗
        </a>
      </div>

      <p className="mt-3 text-ink/70 leading-relaxed">{opportunity.description}</p>
      {opportunity.note && (
        <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {opportunity.note}
        </p>
      )}

      <div className="mt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink/40">Eligibility</h3>
        <p className="mt-1 text-sm text-ink/65">{opportunity.eligibility}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink/40">Application checklist</h3>
        <ul className="mt-2 grid gap-1">
          {opportunity.checklist.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink/70">
              <span className="text-ink/30">□</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink/40">Gap check</h3>
        {gaps.length === 0 ? (
          <p className="mt-1 text-sm text-emerald-700">
            Nothing obvious missing based on your current profile — worth a closer look yourself before applying.
          </p>
        ) : (
          <ul className="mt-2 grid gap-1">
            {gaps.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800">
                <span>⚠</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        {!draft ? (
          <button
            onClick={handleDraft}
            disabled={drafting}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {drafting ? 'Drafting…' : 'Draft my application'}
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                DRAFT — review, personalize, and submit yourself at {opportunity.link}
              </span>
              <button onClick={copyDraft} className="text-sm font-medium text-accent hover:underline">
                Copy
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-md bg-stone-50 border border-border p-4 text-sm text-ink/80 font-sans">
              {draft}
            </pre>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
