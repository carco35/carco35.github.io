'use client';

import { useState } from 'react';
import type { Vouch } from '@/lib/types';

interface Props {
  profileId: string;
  vouches: Vouch[];
  onChange: () => Promise<void> | void;
}

export default function VouchSection({ profileId, vouches, onChange }: Props) {
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const pending = vouches.filter((v) => !v.submitted_at);
  const received = vouches.filter((v) => v.submitted_at);

  async function requestVouch() {
    setCreating(true);
    try {
      await fetch('/api/vouches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });
      await onChange();
    } finally {
      setCreating(false);
    }
  }

  function vouchUrl(token: string) {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/vouch/${token}`;
  }

  async function copyLink(token: string) {
    const url = vouchUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      // clipboard not available — the link is still shown on screen
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Request a vouch</h2>
      <p className="mt-1 text-sm text-ink/60">
        Ask someone who knows your work to answer three quick questions. No login required for
        them.
      </p>

      <button
        onClick={requestVouch}
        disabled={creating}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-stone-50 disabled:opacity-50"
      >
        {creating ? 'Creating link…' : 'Generate a vouch link'}
      </button>

      {pending.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-ink/70">Pending ({pending.length})</h3>
          <ul className="mt-2 grid gap-2">
            {pending.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm"
              >
                <span className="truncate text-ink/60">{vouchUrl(v.vouch_link_token)}</span>
                <button
                  onClick={() => copyLink(v.vouch_link_token)}
                  className="shrink-0 text-accent hover:underline"
                >
                  {copiedToken === v.vouch_link_token ? 'Copied!' : 'Copy link'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {received.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-ink/70">Received ({received.length})</h3>
          <ul className="mt-2 grid gap-3">
            {received.map((v) => (
              <li key={v.id} className="rounded-md border border-border bg-white p-4 text-sm">
                <div className="font-medium text-ink">
                  {v.submitter_name} <span className="text-ink/40 font-normal">— {v.relationship}</span>
                </div>
                <p className="mt-2 text-ink/70">
                  <span className="font-medium text-ink/50">Would work with them again: </span>
                  {v.question_2_response}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
