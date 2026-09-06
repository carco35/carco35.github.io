'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import type { PlaidItemSummary } from '@/lib/types';

interface Props {
  profileId: string;
  plaid: PlaidItemSummary;
  onChange: () => Promise<void> | void;
}

export default function PlaidSection({ profileId, plaid, onChange }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading-token' | 'connecting' | 'error'>('idle');

  const onSuccess = useCallback(
    async (public_token: string) => {
      setStatus('connecting');
      try {
        const res = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, public_token }),
        });
        if (!res.ok) throw new Error('exchange failed');
        await onChange();
        setStatus('idle');
      } catch {
        setStatus('error');
      }
    },
    [profileId, onChange]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkToken, ready]);

  async function handleConnectClick() {
    setStatus('loading-token');
    try {
      const res = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not start Plaid Link');
      setLinkToken(data.link_token);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Connect a bank account</h2>
      <p className="mt-1 text-sm text-ink/60">
        Optional. Adds a simple summary of recent account activity to your profile — no line
        items are ever shown.
      </p>

      <div className="mt-4 rounded-lg border border-border bg-white p-5">
        {plaid.connected ? (
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
              Connected via Plaid Sandbox — test data only
            </span>
            <p className="mt-3 text-sm text-ink/75">{plaid.summary}</p>
          </div>
        ) : (
          <div>
            <button
              onClick={handleConnectClick}
              disabled={status === 'loading-token' || status === 'connecting'}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-stone-50 disabled:opacity-50"
            >
              {status === 'loading-token' && 'Starting Plaid Link…'}
              {status === 'connecting' && 'Connecting…'}
              {(status === 'idle' || status === 'error') && 'Connect bank account (Plaid Sandbox)'}
            </button>
            <p className="mt-2 text-xs text-ink/40">
              This step is fully optional — you can skip it and continue below.
            </p>
            {status === 'error' && (
              <p className="mt-2 text-xs text-red-600">
                Something went wrong connecting your account. You can try again or skip this step.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
