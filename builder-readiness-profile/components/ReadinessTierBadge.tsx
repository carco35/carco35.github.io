import type { ReadinessTier } from '@/lib/types';

const TIER_STYLES: Record<ReadinessTier, string> = {
  'Just Starting': 'bg-stone-100 text-stone-700 border-stone-300',
  'Building Momentum': 'bg-amber-50 text-amber-800 border-amber-300',
  'Ready to Pursue Funding': 'bg-emerald-50 text-emerald-800 border-emerald-300',
  'Strong Track Record': 'bg-accent/10 text-accent border-accent/30',
};

export default function ReadinessTierBadge({ tier }: { tier: ReadinessTier }) {
  return (
    <div>
      <span
        className={`inline-block rounded-full border px-4 py-1.5 text-sm font-medium ${TIER_STYLES[tier]}`}
      >
        {tier}
      </span>
      <p className="mt-2 text-xs text-ink/50 max-w-md">
        This is our own internal readiness assessment — not a credit score or credit report.
      </p>
    </div>
  );
}
