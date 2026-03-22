'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { TierBadge } from '@/components/ui/TierBadge';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

const CATEGORIES = ['all', 'timeline', 'geography', 'faction', 'character', 'world_rule', 'artifact'];
const TIERS = ['all', '0', '1', '2', '3'];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  timeline: 'Timeline',
  geography: 'Geography',
  faction: 'Factions',
  character: 'Characters',
  world_rule: 'World Rules',
  artifact: 'Artifacts',
};

export default function LorePage() {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [category, setCategory] = useState('all');

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (tier !== 'all') params.tier = tier;
  if (category !== 'all') params.category = category;

  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
  const { data, isLoading } = useSWR(`/api/lore${qs}`, fetcher);

  const entries = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient mb-3">Lore Explorer</h1>
        <p className="text-otr-silver">Browse the OTR Universe — from Core laws to community-written OTR stories.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-otr-silver" />
          <input
            type="text"
            placeholder="Search lore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-otr-surface border border-otr-border text-sm text-slate-200 placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                tier === t ? 'bg-otr-muted text-otr-gold border border-otr-gold/30' : 'border border-otr-border text-otr-silver hover:border-otr-gold/20'
              )}
            >
              {t === 'all' ? 'All Tiers' : `Tier ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all',
              category === cat ? 'bg-otr-muted text-otr-gold' : 'text-otr-silver hover:text-slate-200'
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Entries grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-otr-surface animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-24 text-otr-silver">
          <p className="text-4xl mb-4">◈</p>
          <p>No lore entries found. Be the first to add one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {entries.map((entry: any) => (
            <Link
              key={entry.id}
              href={`/lore/${entry.id}`}
              className="p-5 rounded-2xl glass hover:border-otr-gold/30 transition-all group flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <TierBadge tier={parseInt(entry.tier?.replace('TIER_', '') ?? '4')} />
                <span className="text-xs text-otr-silver capitalize">{entry.category?.toLowerCase().replace('_', ' ')}</span>
              </div>
              <h3 className="font-display font-semibold text-slate-100 group-hover:text-otr-gold transition-colors leading-snug">
                {entry.title}
              </h3>
              <p className="text-sm text-otr-silver leading-relaxed line-clamp-3">{entry.summary}</p>
              <div className="mt-auto pt-2 flex gap-1 flex-wrap">
                {entry.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-otr-muted text-otr-silver">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
