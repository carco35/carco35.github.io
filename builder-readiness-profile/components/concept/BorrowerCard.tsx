'use client';

import { useState } from 'react';
import type { FakeBorrower } from '@/lib/conceptData';
import SampleTrustBadge from './SampleTrustBadge';
import FundModal from './FundModal';

interface Props {
  borrower: FakeBorrower;
}

export default function BorrowerCard({ borrower }: Props) {
  const [fundedAmount, setFundedAmount] = useState(borrower.initialFundedAmount);
  const [showModal, setShowModal] = useState(false);
  const [lastPledge, setLastPledge] = useState<number | null>(null);

  const percentFunded = Math.min(100, Math.round((fundedAmount / borrower.requestedAmount) * 100));
  const isFullyFunded = fundedAmount >= borrower.requestedAmount;

  function handleConfirm() {
    const remaining = borrower.requestedAmount - fundedAmount;
    const pledge = Math.min(remaining, Math.max(25, Math.round(borrower.requestedAmount * 0.18)));
    setFundedAmount((prev) => Math.min(borrower.requestedAmount, prev + pledge));
    setLastPledge(pledge);
    setShowModal(false);
    setTimeout(() => setLastPledge(null), 4000);
  }

  return (
    <div className="rounded-lg border border-concept/20 bg-white p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-concept/15" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-ink">{borrower.sampleName}</h3>
          <p className="mt-0.5 text-sm text-ink/50">{borrower.loanPurpose}</p>
        </div>
        <SampleTrustBadge tier={borrower.trustTier} />
      </div>

      <p className="mt-4 text-sm text-ink/70 leading-relaxed">{borrower.story}</p>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Requested</p>
          <p className="mt-0.5 font-medium text-ink">${borrower.requestedAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Suggested terms</p>
          <p className="mt-0.5 font-medium text-ink">{borrower.suggestedTerms}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-ink/50 mb-1.5">
          <span>Sample progress — ${fundedAmount.toLocaleString()} of ${borrower.requestedAmount.toLocaleString()} funded (fictional)</span>
          <span>{percentFunded}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-concept transition-all duration-700 ease-out"
            style={{ width: `${percentFunded}%` }}
          />
        </div>
        {lastPledge !== null && (
          <p className="mt-2 text-xs text-concept">
            Simulated: a sample lender just pledged ${lastPledge.toLocaleString()} (not real).
          </p>
        )}
      </div>

      <div className="mt-5">
        <button
          onClick={() => setShowModal(true)}
          disabled={isFullyFunded}
          className="rounded-md bg-concept px-4 py-2 text-sm font-medium text-white hover:bg-concept-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFullyFunded ? 'Fully funded (sample)' : 'Fund this request'}
        </button>
      </div>

      {showModal && (
        <FundModal
          sampleName={borrower.sampleName}
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
