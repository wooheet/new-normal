'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { TierBadge } from '@/components/ui/TierBadge';
import { Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['all', 'timeline', 'geography', 'faction', 'character', 'world_rule', 'artifact'];
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All', timeline: 'Timeline', geography: 'Geography',
  faction: 'Factions', character: 'Characters', world_rule: 'World Rules', artifact: 'Artifacts',
};

const TIERS = ['all', '0', '1', '2', '3'];
const TIER_META: Record<string, { color: string; label: string }> = {
  '0': { color: '#a78bfa', label: 'Core' },
  '1': { color: '#f0c07a', label: 'Canon' },
  '2': { color: '#22d3ee', label: 'Extended' },
  '3': { color: '#64748b', label: 'OTR' },
};

function getTierColor(tier: string): string {
  const k = tier?.replace('TIER_', '') ?? '3';
  return TIER_META[k]?.color ?? '#64748b';
}

export default function LorePage() {
  const [search, setSearch] = useState('');
  const [tier, setTier]     = useState('all');
  const [category, setCategory] = useState('all');

  const params: Record<string, string> = {};
  if (search)             params.search   = search;
  if (tier !== 'all')     params.tier     = tier;
  if (category !== 'all') params.category = category;

  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
  const { data, isLoading } = useSWR(`/api/lore${qs}`, fetcher);
  const entries = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.18em] font-mono mb-2" style={{ color: '#2a2a48' }}>
          Platform / Lore
        </p>
        <h1 className="font-display text-4xl font-bold text-gradient mb-3">Lore Explorer</h1>
        <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#4a5568' }}>
          Browse the OTR Universe — from Core laws to community-written OTR stories.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#374155' }} />
        <input
          type="text"
          placeholder="Search lore entries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'linear-gradient(#0d0d1e, #0d0d1e) padding-box, linear-gradient(145deg, #1e1e3c, #141430) border-box',
            border: '1px solid transparent',
            color: '#e2e8f0',
          }}
          onFocus={e => {
            e.currentTarget.style.background = 'linear-gradient(#0d0d1e, #0d0d1e) padding-box, linear-gradient(135deg, rgba(240,192,122,0.4), rgba(30,30,58,0.8)) border-box';
          }}
          onBlur={e => {
            e.currentTarget.style.background = 'linear-gradient(#0d0d1e, #0d0d1e) padding-box, linear-gradient(145deg, #1e1e3c, #141430) border-box';
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-10">
        {/* Tier pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-widest font-mono w-10 shrink-0" style={{ color: '#2a2a48' }}>Tier</span>
          {TIERS.map(t => {
            const active = tier === t;
            const meta   = TIER_META[t];
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                style={active ? {
                  background: t === 'all' ? 'rgba(240,192,122,0.1)' : `${meta.color}14`,
                  border: `1px solid ${t === 'all' ? 'rgba(240,192,122,0.3)' : `${meta.color}44`}`,
                  color: t === 'all' ? '#f0c07a' : meta.color,
                } : {
                  background: 'transparent',
                  border: '1px solid rgba(30,30,58,0.7)',
                  color: '#374155',
                }}
              >
                {t === 'all' ? 'All Tiers' : `Tier ${t} · ${meta.label}`}
              </button>
            );
          })}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] uppercase tracking-widest font-mono w-10 shrink-0" style={{ color: '#2a2a48' }}>Type</span>
          {CATEGORIES.map(cat => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0"
                style={active ? {
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  color: '#22d3ee',
                } : {
                  background: 'transparent',
                  border: '1px solid rgba(30,30,58,0.7)',
                  color: '#374155',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entries */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl skeleton" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center"
            style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)' }}>
            <BookOpen size={26} style={{ color: '#2a2a48' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>No lore found</p>
          <p className="text-sm" style={{ color: '#374155' }}>
            {search ? `"${search}"에 대한 결과가 없습니다.` : '필터 조건에 맞는 항목이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {entries.map((entry: any) => {
            const tierKey    = entry.tier?.replace('TIER_', '') ?? '3';
            const tierColor  = getTierColor(entry.tier);
            return (
              <Link
                key={entry.id}
                href={`/lore/${entry.id}`}
                className="group relative rounded-2xl flex flex-col gap-3 p-5 transition-all duration-300 overflow-hidden"
                style={{
                  background: 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box',
                  border: '1px solid transparent',
                  borderLeft: `2px solid ${tierColor}44`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `linear-gradient(#111128, #111128) padding-box, linear-gradient(135deg, ${tierColor}40, rgba(30,30,58,0.7)) border-box`;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), -2px 0 0 ${tierColor}`;
                  e.currentTarget.style.borderLeft = `2px solid ${tierColor}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderLeft = `2px solid ${tierColor}44`;
                }}
              >
                {/* Tier + category */}
                <div className="flex items-start justify-between gap-2">
                  <TierBadge tier={parseInt(tierKey)} />
                  <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: '#374155' }}>
                    {entry.category?.toLowerCase().replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold leading-snug transition-colors"
                  style={{ color: '#dde4f0' }}>
                  {entry.title}
                </h3>

                {/* Summary */}
                <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: '#4a5568' }}>
                  {entry.summary}
                </p>

                {/* Tags */}
                {entry.tags?.length > 0 && (
                  <div className="mt-auto pt-2 flex gap-1.5 flex-wrap">
                    {entry.tags.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.7)', color: '#374155' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
