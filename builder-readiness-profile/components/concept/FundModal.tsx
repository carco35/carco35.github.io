'use client';

interface Props {
  sampleName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function FundModal({ sampleName, onCancel, onConfirm }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border border-concept/30 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-block rounded-full bg-concept/10 border border-concept/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-concept">
          Vision Demo
        </span>
        <h2 className="mt-3 text-lg font-semibold text-ink">Simulate funding {sampleName}?</h2>
        <p className="mt-3 text-sm text-ink/70 leading-relaxed">
          In a real version of this product, this would connect you with this borrower through a
          licensed lending partner. For this demo, nothing real happens — this just adds to the
          sample progress bar so you can see how the flow would feel.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink/70 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-concept px-4 py-2 text-sm font-medium text-white hover:bg-concept-light transition-colors"
          >
            Simulate this pledge
          </button>
        </div>
      </div>
    </div>
  );
}
