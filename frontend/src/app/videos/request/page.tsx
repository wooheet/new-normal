'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { Film, Zap } from 'lucide-react';
import { clsx } from 'clsx';

const QUALITY_TIERS = [
  { quality: 'SD', stake: 0, label: 'SD', desc: 'Standard Definition', color: 'text-otr-silver' },
  { quality: 'HD', stake: 10000, label: 'HD', desc: '10,000 LORE', color: 'text-blue-400' },
  { quality: '4K', stake: 50000, label: '4K', desc: '50,000 LORE', color: 'text-otr-gold' },
  { quality: '4K+', stake: 200000, label: '4K+', desc: '200,000 LORE', color: 'text-purple-400' },
];

export default function VideoRequestPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    prompt: '',
    contentType: 'LORE',
    stake: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedTier = QUALITY_TIERS.findLast((t) => form.stake >= t.stake) ?? QUALITY_TIERS[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetcher('/api/videos/request', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      router.push('/videos');
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient mb-3">Request a Video</h1>
        <p className="text-otr-silver">Describe your scenario. Stake LORE tokens to unlock higher production quality.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Video Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. 루피 vs 오공 — 크로스포인트 최종 결전"
            className="w-full px-4 py-3 rounded-xl bg-otr-surface border border-otr-border text-sm text-slate-200 placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50"
          />
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
          <div className="flex gap-2">
            {['LORE', 'BATTLE', 'PERSONAL'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, contentType: t })}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                  form.contentType === t
                    ? 'bg-otr-muted text-otr-gold border-otr-gold/30'
                    : 'text-otr-silver border-otr-border hover:border-otr-gold/20'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Generation Prompt</label>
          <textarea
            required
            rows={4}
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            placeholder="Describe the scene in detail — characters, setting, mood, camera style..."
            className="w-full px-4 py-3 rounded-xl bg-otr-surface border border-otr-border text-sm text-slate-200 placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50 resize-none"
          />
        </div>

        {/* Stake → Quality */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Stake Amount&nbsp;
            <span className="text-otr-silver font-normal">(determines video quality)</span>
          </label>
          <div className="relative mb-4">
            <input
              type="number"
              min={0}
              value={form.stake}
              onChange={(e) => setForm({ ...form, stake: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full px-4 py-3 pr-20 rounded-xl bg-otr-surface border border-otr-border text-sm text-slate-200 focus:outline-none focus:border-otr-gold/50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-otr-gold font-semibold">LORE</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {QUALITY_TIERS.map((tier) => (
              <button
                key={tier.quality}
                type="button"
                onClick={() => setForm({ ...form, stake: tier.stake })}
                className={clsx(
                  'p-3 rounded-xl text-center border transition-all',
                  selectedTier.quality === tier.quality
                    ? 'border-otr-gold/50 bg-otr-muted'
                    : 'border-otr-border hover:border-otr-gold/20'
                )}
              >
                <div className={clsx('font-bold text-base', tier.color)}>{tier.label}</div>
                <div className="text-xs text-otr-silver mt-0.5">{tier.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Zap size={14} className="text-otr-gold" />
            <span className="text-otr-silver">Selected quality:</span>
            <span className={clsx('font-bold', selectedTier.color)}>{selectedTier.quality}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-otr-void font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #e8b86d, #c8953a)' }}
        >
          <Film size={18} />
          {loading ? 'Submitting...' : 'Submit Video Request'}
        </button>
      </form>
    </div>
  );
}
