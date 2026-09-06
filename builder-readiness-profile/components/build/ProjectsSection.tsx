'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';

interface Props {
  profileId: string;
  projects: Project[];
  onChange: () => Promise<void> | void;
}

const emptyForm = { title: '', description: '', worked_for: '', outcome: '', timeframe: '' };

export default function ProjectsSection({ profileId, projects, onChange }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, ...form }),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      await onChange();
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      worked_for: p.worked_for,
      outcome: p.outcome,
      timeframe: p.timeframe,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (editingId === id) cancelEdit();
    await onChange();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Projects</h2>
      <p className="mt-1 text-sm text-ink/60">
        Real things you&apos;ve built or done — for a client, a class, or yourself.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-lg border border-border bg-white p-5">
        <div>
          <label className="text-sm font-medium text-ink">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Market research project for a VC firm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What did you actually do?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-ink">Worked for</label>
            <input
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              value={form.worked_for}
              onChange={(e) => setForm({ ...form, worked_for: e.target.value })}
              placeholder="Who was it for?"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Outcome</label>
            <input
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              placeholder="What happened as a result?"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Timeframe</label>
            <input
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              value={form.timeframe}
              onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
              placeholder="e.g. Summer 2025"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {editingId ? 'Save changes' : 'Add project'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm font-medium text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {projects.length > 0 && (
        <ul className="mt-6 grid gap-3">
          {projects.map((p) => (
            <li key={p.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm text-ink/65">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                    {p.worked_for && <span>For: {p.worked_for}</span>}
                    {p.outcome && <span>Outcome: {p.outcome}</span>}
                    {p.timeframe && <span>{p.timeframe}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  <button onClick={() => startEdit(p)} className="text-accent hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-ink/40 hover:text-ink/70">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
