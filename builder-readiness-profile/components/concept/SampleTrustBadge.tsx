import type { ReadinessTier } from '@/lib/types';

const TIER_STYLES: Record<ReadinessTier, string> = {
  'Just Starting': 'bg-stone-100 text-stone-700 border-stone-300',
  'Building Momentum': 'bg-amber-50 text-amber-800 border-amber-300',
  'Ready to Pursue Funding': 'bg-emerald-50 text-emerald-800 border-emerald-300',
  'Strong Track Record': 'bg-concept/10 text-concept border-concept/30',
};

export default function SampleTrustBadge({ tier }: { tier: ReadinessTier }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        Sample Trust Score
      </p>
      <span
        className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-medium ${TIER_STYLES[tier]}`}
      >
        {tier}
      </span>
    </div>
  );
}
