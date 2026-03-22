'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { Globe, Users, Film, ScrollText, ChevronRight, Plus } from 'lucide-react';

const ACCENTS = [
  { color: '#f0c07a', glow: 'rgba(240,192,122,0.1)',  bar: 'linear-gradient(90deg,#f0c07a,#c8953a)', border: 'rgba(240,192,122,0.25)' },
  { color: '#22c55e', glow: 'rgba(34,197,94,0.09)',   bar: 'linear-gradient(90deg,#22c55e,#16a34a)', border: 'rgba(34,197,94,0.25)' },
  { color: '#22d3ee', glow: 'rgba(34,211,238,0.09)',  bar: 'linear-gradient(90deg,#22d3ee,#0891b2)', border: 'rgba(34,211,238,0.22)' },
  { color: '#8b5cf6', glow: 'rgba(139,92,246,0.1)',   bar: 'linear-gradient(90deg,#8b5cf6,#6d28d9)', border: 'rgba(139,92,246,0.25)' },
];

export default function UniversesPage() {
  const { data, isLoading } = useSWR('/api/universes', fetcher);
  const universes = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="flex items-start justify-between mb-12 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-mono mb-2" style={{ color: '#2a2a48' }}>
            Platform / Universes
          </p>
          <h1 className="font-display text-4xl font-bold mb-3 text-gradient">Universe Explorer</h1>
          <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#4a5568' }}>
            등록된 모든 IP Universe를 탐색하세요. 각 Universe는 독립적인 DAO와 AI 제작 파이프라인을 가집니다.
          </p>
        </div>
        <Link
          href="/universes/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e', boxShadow: '0 2px 12px rgba(240,192,122,0.2)' }}
        >
          <Plus size={15} /> Universe 등록
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl skeleton" />
          ))}
        </div>
      ) : universes.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)' }}>
            <Globe size={26} style={{ color: '#2a2a48' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: '#4a5568' }}>등록된 Universe가 없습니다.</p>
          <p className="text-xs" style={{ color: '#2a2a48' }}>첫 번째로 등록해보세요.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {universes.map((u: any, idx: number) => {
            const a = ACCENTS[idx % ACCENTS.length];
            const threshold = Math.round((u.governanceThreshold ?? 0.6) * 100);
            return (
              <Link
                key={u.id}
                href={`/universes/${u.slug}`}
                className="group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  background: `linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box`,
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `linear-gradient(#111128, #111128) padding-box, linear-gradient(135deg, ${a.border}, rgba(30,30,58,0.5) 60%) border-box`;
                  e.currentTarget.style.boxShadow = `0 12px 48px ${a.glow}, 0 0 0 0.5px ${a.border}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top accent bar */}
                <div className="h-[2px] w-full" style={{ background: a.bar }} />

                <div className="relative p-6 flex flex-col gap-4 flex-1">
                  {/* Logo + badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: a.glow, border: `1px solid ${a.border}` }}>
                      {u.logoUrl
                        ? <img src={u.logoUrl} alt={u.name} className="w-10 h-10 rounded-lg object-cover" />
                        : <Globe size={20} style={{ color: a.color }} />}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)', color: '#374155' }}>
                      {u.contentTypes}
                    </span>
                  </div>

                  {/* Name + desc */}
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-1.5 transition-colors"
                      style={{ color: '#dde4f0' }}
                      onMouseEnter={e => (e.currentTarget.style.color = a.color)}
                      onMouseLeave={e => (e.currentTarget.style.color = '#dde4f0')}>
                      {u.name}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#4a5568' }}>
                      {u.description}
                    </p>
                  </div>

                  {/* Governance bar */}
                  <div className="pt-4" style={{ borderTop: '1px solid rgba(30,30,58,0.5)' }}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1" style={{ color: '#374155' }}>
                        <ScrollText size={10} /> DAO Threshold
                      </span>
                      <span className="font-mono font-semibold" style={{ color: a.color }}>{threshold}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${threshold}%`, background: a.bar }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-end text-xs font-medium gap-0.5 transition-colors"
                    style={{ color: '#374155' }}>
                    탐색하기
                    <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" style={{ color: a.color }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Platform stats */}
      <PlatformStats />
    </div>
  );
}

function PlatformStats() {
  const { data } = useSWR('/api/stats', fetcher);
  const s = data as any;
  if (!s) return null;

  const items = [
    { label: 'Universes',    value: s.universes,   icon: Globe,       color: '#f0c07a' },
    { label: 'Lore Entries', value: s.loreEntries, icon: ScrollText,  color: '#22d3ee' },
    { label: 'Community',    value: s.proposals,   icon: Users,       color: '#a78bfa' },
    { label: 'Videos Made',  value: s.videos,      icon: Film,        color: '#22c55e' },
  ];

  return (
    <div className="mt-16 rounded-2xl p-8"
      style={{
        background: 'linear-gradient(#0e0e22, #0e0e22) padding-box, linear-gradient(135deg, #222244, #181830) border-box',
        border: '1px solid transparent',
      }}>
      <p className="font-display text-xs uppercase tracking-widest text-center mb-8" style={{ color: '#2a2a48' }}>
        Platform Overview
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="text-center group">
            <Icon size={18} className="mx-auto mb-2.5 transition-opacity opacity-40 group-hover:opacity-70" style={{ color }} />
            <div className="font-display text-3xl font-bold mb-1"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}88)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{value ?? '—'}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: '#2a2a48' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
