'use client';

import { useState } from 'react';

interface Props {
  token: string;
  profileName: string;
}

const emptyForm = {
  submitter_name: '',
  relationship: '',
  question_1_response: '',
  question_2_response: '',
  question_3_response: '',
};

export default function VouchForm({ token, profileName }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/vouch/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not submit');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-ink">Thank you!</h2>
        <p className="mt-2 text-ink/60">
          Your vouch for {profileName} has been recorded. You can close this page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-lg border border-border bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink">Your name</label>
          <input
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            value={form.submitter_name}
            onChange={(e) => setForm({ ...form, submitter_name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Your relationship to {profileName}</label>
          <input
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
            placeholder="e.g. Manager, teacher, teammate"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">
          What did you work on together, or how do you know them?
        </label>
        <textarea
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          value={form.question_1_response}
          onChange={(e) => setForm({ ...form, question_1_response: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Would you work with them again? Why?</label>
        <textarea
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          value={form.question_2_response}
          onChange={(e) => setForm({ ...form, question_2_response: e.target.value })}
          placeholder="Yes/No, and why"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">
          Give one specific example of them following through on something.
        </label>
        <textarea
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          value={form.question_3_response}
          onChange={(e) => setForm({ ...form, question_3_response: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit vouch'}
      </button>
    </form>
  );
}
