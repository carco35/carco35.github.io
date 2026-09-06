'use client';

import NavBar from '@/components/NavBar';
import ConceptBanner from './ConceptBanner';
import BorrowerCard from './BorrowerCard';
import { FAKE_BORROWERS } from '@/lib/conceptData';

export default function PeerLendingClient() {
  return (
    <>
      <ConceptBanner />
      <NavBar sticky={false} />
      <main className="border-t-4 border-concept/20 bg-concept/[0.03] min-h-screen">
        <div className="container-narrow px-6 py-12">
          <span className="inline-block rounded-full bg-concept/10 border border-concept/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-concept">
            Concept · Vision Demo
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Peer Trust Lending
          </h1>
          <p className="mt-3 max-w-2xl text-ink/65 leading-relaxed">
            A look at where this could go: builders with a strong readiness profile requesting
            small, peer-funded loans from people who trust their track record — no bank, no
            credit check. Everything below is a fictional mockup so you can see how the
            experience would feel, not a working product.
          </p>

          <div className="mt-6 rounded-md border border-concept/25 bg-white px-4 py-3 text-sm text-ink/60">
            <span className="font-semibold text-concept">Not real:</span> the borrowers, loan
            requests, trust scores, and progress bars on this page are all sample data. Clicking
            &ldquo;Fund this request&rdquo; only updates a number on your screen — it never
            contacts Plaid, a bank, or any payment processor, and nothing here is saved.
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {FAKE_BORROWERS.map((borrower) => (
              <BorrowerCard key={borrower.id} borrower={borrower} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
