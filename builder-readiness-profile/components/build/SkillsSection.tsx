'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/types';

interface Props {
  profileId: string;
  skills: Skill[];
  onChange: () => Promise<void> | void;
}

export default function SkillsSection({ profileId, skills, onChange }: Props) {
  const [input, setInput] = useState('');

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput('');
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, skill_name: value }),
    });
    await onChange();
  }

  async function removeSkill(id: string) {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    await onChange();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Skills</h2>
      <p className="mt-1 text-sm text-ink/60">Add tags for the skills you&apos;ve actually used.</p>

      <form onSubmit={addSkill} className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Excel, pitching, web development"
        />
        <button
          type="submit"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-stone-50"
        >
          Add
        </button>
      </form>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm text-ink/80"
            >
              {s.skill_name}
              <button
                onClick={() => removeSkill(s.id)}
                aria-label={`Remove ${s.skill_name}`}
                className="text-ink/40 hover:text-ink/70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
