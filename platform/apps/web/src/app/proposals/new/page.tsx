'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { clsx } from 'clsx';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const STAKING_BY_TYPE: Record<string, Record<number, number>> = {
  A: { 1: 5000, 2: 1000, 3: 500 },
  B: { 1: 10000, 2: 3000, 3: 3000 },
  C: { 1: 2000, 2: 20000, 3: 2000 },
  D: { 1: 50000, 2: 50000, 3: 50000 },
};

const TYPE_DESCRIPTIONS = {
  A: 'Lore Addition — Add new characters, places, events to canon',
  B: 'Canon Elevation — Promote a Tier 3 OTR to higher canon',
  C: 'Lore Amendment — Modify or correct existing canon',
  D: 'Governance Change — Modify voting parameters (requires 50,000 LORE)',
};

export default function NewProposalPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    type: 'A',
    targetTier: 3,
    category: 'character',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const staking = STAKING_BY_TYPE[form.type]?.[form.targetTier] ?? 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const result = await api.createProposal(form) as any;
      router.push(`/proposals/${result.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/proposals" className="flex items-center gap-2 text-otr-silver hover:text-otr-gold text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Proposals
      </Link>

      <h1 className="font-display text-3xl font-bold text-gradient mb-2">Submit a Proposal</h1>
      <p className="text-otr-silver mb-10">Write a Lore Improvement Proposal (LIP) and stake LORE points to submit.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type + Tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-otr-silver mb-2">Proposal Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm focus:outline-none focus:border-otr-gold/50"
            >
              {(['A', 'B', 'C', 'D'] as const).map((t) => (
                <option key={t} value={t}>Type {t}</option>
              ))}
            </select>
            <p className="text-xs text-otr-silver mt-1.5">{TYPE_DESCRIPTIONS[form.type as keyof typeof TYPE_DESCRIPTIONS]}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-otr-silver mb-2">Target Tier</label>
            <select
              value={form.targetTier}
              onChange={(e) => setForm(f => ({ ...f, targetTier: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm focus:outline-none focus:border-otr-gold/50"
            >
              <option value={1}>Tier 1 — Confirmed Canon</option>
              <option value={2}>Tier 2 — Extended Canon</option>
              <option value={3}>Tier 3 — OTR / Off The Record</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-otr-silver mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm focus:outline-none focus:border-otr-gold/50"
          >
            <option value="timeline">Timeline / History</option>
            <option value="geography">Geography / Places</option>
            <option value="faction">Factions / Organizations</option>
            <option value="character">Characters</option>
            <option value="world_rule">World Rules / Systems</option>
            <option value="artifact">Artifacts / Objects</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-otr-silver mb-2">Title</label>
          <input
            type="text"
            placeholder="LIP title..."
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            required
            className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-otr-silver mb-2">Summary <span className="text-xs opacity-60">(20–500 chars)</span></label>
          <textarea
            placeholder="One paragraph summary of what this proposal adds..."
            value={form.summary}
            onChange={(e) => setForm(f => ({ ...f, summary: e.target.value }))}
            required
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50 resize-none"
          />
        </div>

        {/* Full content */}
        <div>
          <label className="block text-sm font-medium text-otr-silver mb-2">Full Proposal <span className="text-xs opacity-60">(Markdown supported)</span></label>
          <textarea
            placeholder="## Background&#10;&#10;## Lore Content&#10;&#10;## Connection to Existing Canon&#10;&#10;## How This Becomes a Video"
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            required
            rows={12}
            className="w-full px-3 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50 resize-none font-mono"
          />
        </div>

        {/* Staking info */}
        <div className="p-4 rounded-xl bg-otr-muted/50 border border-otr-border flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Required Stake</div>
            <div className="text-xs text-otr-silver mt-0.5">Returned if approved or rejected. 50% burned if withdrawn during discussion.</div>
          </div>
          <div className="text-2xl font-display font-bold text-gradient">{staking.toLocaleString()} <span className="text-sm">LORE</span></div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-900/20 border border-red-800/30">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={clsx(
            'w-full py-3.5 rounded-xl font-semibold transition-all',
            submitting
              ? 'bg-otr-muted text-otr-silver cursor-not-allowed'
              : 'bg-gold-gradient text-otr-void hover:opacity-90 hover:scale-[1.01]'
          )}
        >
          {submitting ? 'Submitting...' : `Submit & Stake ${staking.toLocaleString()} LORE`}
        </button>
      </form>
    </div>
  );
}
