'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { TierBadge, StatusBadge } from '@/components/ui/TierBadge';
import Link from 'next/link';
import { Plus, MessageCircle, Vote, ScrollText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['all', 'voting', 'discussion', 'review', 'approved', 'rejected'];

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  all:        { color: '#8892a4', bg: 'rgba(136,146,164,0.08)', border: 'rgba(136,146,164,0.2)' },
  voting:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  discussion: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.22)' },
  review:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.22)' },
  approved:   { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.22)' },
  rejected:   { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
};

export default function ProposalsPage() {
  const [status, setStatus] = useState('all');

  const params: Record<string, string> = {};
  if (status !== 'all') params.status = status.toUpperCase();
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';

  const { data, isLoading } = useSWR(`/api/proposals${qs}`, fetcher);
  const proposals = (data as any)?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-mono mb-2" style={{ color: '#2a2a48' }}>
            Platform / Proposals
          </p>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">Proposals</h1>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: '#4a5568' }}>
            Community-submitted Lore Improvement Proposals. Vote to shape the canon.
          </p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e', boxShadow: '0 2px 12px rgba(240,192,122,0.2)' }}
        >
          <Plus size={15} /> Submit LIP
        </Link>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-1">
        {STATUSES.map(s => {
          const active = status === s;
          const st = STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0"
              style={active ? {
                background: st.bg,
                border: `1px solid ${st.border}`,
                color: st.color,
              } : {
                background: 'transparent',
                border: '1px solid rgba(30,30,58,0.7)',
                color: '#374155',
              }}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center"
            style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)' }}>
            <ScrollText size={26} style={{ color: '#2a2a48' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>No proposals yet</p>
          <p className="text-sm mb-6" style={{ color: '#374155' }}>Be the first to submit a Lore Improvement Proposal.</p>
          <Link
            href="/proposals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e' }}
          >
            <Plus size={15} /> Submit LIP
          </Link>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {proposals.map((p: any) => {
            const totalVotes  = p.votes?.length ?? p._count?.votes ?? 0;
            const forVotes    = p.votes?.filter((v: any) => v.choice === 'FOR').length ?? 0;
            const againstVotes = totalVotes - forVotes;
            const forPct      = totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0;
            const isVoting    = p.status === 'VOTING';

            return (
              <Link
                key={p.id}
                href={`/proposals/${p.id}`}
                className="block p-5 rounded-2xl transition-all duration-200 group"
                style={{
                  background: 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(#111128, #111128) padding-box, linear-gradient(135deg, rgba(240,192,122,0.3), rgba(30,30,58,0.7)) border-box';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box';
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: '#374155' }}>
                        LIP-{String(p.lipNumber).padStart(3, '0')}
                      </span>
                      <StatusBadge status={p.status} />
                      <TierBadge tier={parseInt(p.targetTier?.replace('TIER_', '') ?? '3')} />
                    </div>
                    <h3 className="font-semibold mb-1.5 truncate transition-colors"
                      style={{ color: '#dde4f0' }}>
                      {p.title}
                    </h3>
                    <p className="text-sm line-clamp-1 leading-relaxed" style={{ color: '#4a5568' }}>{p.summary}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 text-xs" style={{ color: '#374155' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Vote size={11} style={{ color: '#a78bfa' }} /> {totalVotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={11} /> {p._count?.comments ?? 0}
                      </span>
                    </div>
                    <span>{formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {isVoting && p.votes && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#22c55e' }}>찬성 {forVotes} ({forPct}%)</span>
                      <span style={{ color: '#f87171' }}>반대 {againstVotes}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${forPct}%`, background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}
                      />
                    </div>
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
