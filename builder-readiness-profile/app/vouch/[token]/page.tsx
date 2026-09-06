import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import type { Vouch } from '@/lib/types';
import VouchForm from './VouchForm';

export const dynamic = 'force-dynamic';

export default function VouchPage({ params }: { params: { token: string } }) {
  const vouch = getDb()
    .prepare('SELECT * FROM vouches WHERE vouch_link_token = ?')
    .get(params.token) as Vouch | undefined;

  if (!vouch) {
    notFound();
  }

  const profile = getDb()
    .prepare('SELECT name FROM profiles WHERE id = ?')
    .get(vouch!.profile_id) as { name: string } | undefined;

  const profileName = profile?.name ?? 'this builder';

  return (
    <main className="min-h-screen bg-paper">
      <div className="container-narrow px-6 py-16 max-w-2xl">
        <p className="text-sm font-medium text-accent uppercase tracking-wide mb-3">
          Builder Readiness Profile
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
          You&apos;re being asked to vouch for {profileName}.
        </h1>
        <p className="mt-3 text-ink/60">
          Your answers help {profileName} show a real track record when applying for funding.
          This takes about two minutes.
        </p>

        <div className="mt-8">
          {vouch!.submitted_at ? (
            <div className="rounded-lg border border-border bg-white p-8 text-center">
              <h2 className="text-xl font-semibold text-ink">Already submitted</h2>
              <p className="mt-2 text-ink/60">This vouch link has already been used. Thank you!</p>
            </div>
          ) : (
            <VouchForm token={params.token} profileName={profileName} />
          )}
        </div>
      </div>
    </main>
  );
}
