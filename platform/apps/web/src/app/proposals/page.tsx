'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { TierBadge, StatusBadge } from '@/components/ui/TierBadge';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Plus, MessageCircle, Vote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['all', 'voting', 'discussion', 'review', 'approved', 'rejected'];

export default function ProposalsPage() {
  const [status, setStatus] = useState('all');

  const params: Record<string, string> = {};
  if (status !== 'all') params.status = status.toUpperCase();
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';

  const { data, isLoading } = useSWR(`/api/proposals${qs}`, fetcher);
  const proposals = (data as any)?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">Proposals</h1>
          <p className="text-otr-silver">Community-submitted Lore Improvement Proposals. Vote to shape the canon.</p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-otr-void font-semibold text-sm hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Submit LIP
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-8 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm capitalize transition-all',
              status === s ? 'bg-otr-muted text-otr-gold' : 'text-otr-silver hover:text-slate-200'
            )}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-otr-surface animate-pulse" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-24 text-otr-silver">
          <p className="text-4xl mb-4">📜</p>
          <p>No proposals yet. Be the first to submit a LIP.</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {proposals.map((p: any) => {
            const totalVotes = (p.votes?.length ?? p._count?.votes ?? 0);
            return (
              <Link
                key={p.id}
                href={`/proposals/${p.id}`}
                className="block p-5 rounded-2xl glass hover:border-otr-gold/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-otr-gold-dim">LIP-{String(p.lipNumber).padStart(3, '0')}</span>
                      <StatusBadge status={p.status} />
                      <TierBadge tier={parseInt(p.targetTier?.replace('TIER_', '') ?? '3')} />
                      <span className="text-xs text-otr-silver capitalize">Type {p.type}</span>
                    </div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-otr-gold transition-colors truncate">
                      {p.title}
                    </h3>
                    <p className="text-sm text-otr-silver mt-1 line-clamp-1">{p.summary}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-3 text-xs text-otr-silver">
                      <span className="flex items-center gap-1"><Vote size={12} /> {totalVotes}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {p._count?.comments ?? 0}</span>
                    </div>
                    <div className="text-xs text-otr-silver">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {/* Vote progress bar (only if voting) */}
                {p.status === 'VOTING' && p.votes && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-otr-silver mb-1">
                      <span>찬성 {p.votes.filter((v: any) => v.choice === 'FOR').length}</span>
                      <span>반대 {p.votes.filter((v: any) => v.choice === 'AGAINST').length}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-otr-muted overflow-hidden">
                      {(() => {
                        const forVotes = p.votes.filter((v: any) => v.choice === 'FOR').length;
                        const total = p.votes.length || 1;
                        return (
                          <div
                            className="h-full rounded-full bg-green-500 transition-all"
                            style={{ width: `${(forVotes / total) * 100}%` }}
                          />
                        );
                      })()}
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
