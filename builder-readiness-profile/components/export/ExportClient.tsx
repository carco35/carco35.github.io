'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ReadinessTierBadge from '@/components/ReadinessTierBadge';
import { fetchBundle, getOrCreateProfileId } from '@/lib/client/profileClient';
import type { ProfileBundle } from '@/lib/types';

export default function ExportClient() {
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = await getOrCreateProfileId();
      const data = await fetchBundle(id);
      setBundle(data);
      setLoading(false);
    })();
  }, []);

  if (loading || !bundle) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16 text-ink/50">Loading…</main>
      </>
    );
  }

  const received = bundle.vouches.filter((v) => v.submitted_at);

  if (!bundle.synthesized) {
    return (
      <>
        <NavBar />
        <main className="container-narrow px-6 py-16">
          <h1 className="text-2xl font-semibold text-ink">Generate your profile first</h1>
          <p className="mt-2 text-ink/60">You need a synthesized profile before you can export it.</p>
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
        <div className="no-print mb-8 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Export profile</h1>
          <button
            onClick={() => window.print()}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="print-page rounded-lg border border-border bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-ink">{bundle.profile.name}</h2>
            <p className="text-sm text-ink/40 mt-1">Builder Readiness Profile</p>

            <div className="mt-6">
              <ReadinessTierBadge tier={bundle.synthesized.readiness_tier} />
            </div>

            <section className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">Summary</h3>
              <p className="mt-2 text-ink/80 leading-relaxed">{bundle.synthesized.summary}</p>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">Strengths</h3>
              <ul className="mt-2 grid gap-1">
                {bundle.synthesized.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-ink/75">
                    • {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">Still developing</h3>
              <ul className="mt-2 grid gap-1">
                {bundle.synthesized.still_developing.map((s, i) => (
                  <li key={i} className="text-sm text-ink/75">
                    • {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">Projects</h3>
              <div className="mt-2 grid gap-4">
                {bundle.projects.map((p) => (
                  <div key={p.id}>
                    <p className="text-sm font-medium text-ink">{p.title}</p>
                    <p className="text-sm text-ink/65">{p.description}</p>
                    <p className="text-xs text-ink/40 mt-0.5">
                      {[p.worked_for, p.outcome, p.timeframe].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">Skills</h3>
              <p className="mt-2 text-sm text-ink/75">{bundle.skills.map((s) => s.skill_name).join(', ')}</p>
            </section>

            {received.length > 0 && (
              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Vouches received
                </h3>
                <div className="mt-2 grid gap-4">
                  {received.map((v) => (
                    <div key={v.id} className="text-sm text-ink/75">
                      <p className="font-medium text-ink">
                        {v.submitter_name} — {v.relationship}
                      </p>
                      <p className="mt-1">{v.question_1_response}</p>
                      <p className="mt-1">{v.question_2_response}</p>
                      <p className="mt-1 italic">&ldquo;{v.question_3_response}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="no-print rounded-lg border border-border bg-stone-50 p-6 h-fit">
            <h3 className="text-sm font-semibold text-ink">How to use this</h3>
            <ul className="mt-3 grid gap-3 text-sm text-ink/70">
              <li>
                Attach this alongside a Kiva, NFTE, or Diamond Challenge application as supporting
                material — it&apos;s not a substitute for their actual application form.
              </li>
              <li>
                Use it in an informal conversation — e.g. showing a parent or mentor a concrete
                case when asking for a small loan or support.
              </li>
              <li className="font-bold text-ink">
                Never present this as an official credit score or credit report — it&apos;s this
                tool&apos;s own assessment, meant to support a real conversation or application,
                not replace one.
              </li>
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
