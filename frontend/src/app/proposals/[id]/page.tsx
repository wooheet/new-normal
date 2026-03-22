'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import { fetcher, api } from '@/lib/api';
import { TierBadge, StatusBadge } from '@/components/ui/TierBadge';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Minus, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: proposal, mutate } = useSWR(`/api/proposals/${id}`, fetcher) as any;
  const [voting, setVoting] = useState(false);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  if (!proposal) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="h-96 rounded-2xl bg-otr-surface animate-pulse" />
    </div>
  );

  const forVotes = proposal.votes?.filter((v: any) => v.choice === 'FOR').length ?? 0;
  const againstVotes = proposal.votes?.filter((v: any) => v.choice === 'AGAINST').length ?? 0;
  const abstainVotes = proposal.votes?.filter((v: any) => v.choice === 'ABSTAIN').length ?? 0;
  const totalVotes = proposal.votes?.length ?? 0;
  const forPct = totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0;

  const tier = parseInt(proposal.targetTier?.replace('TIER_', '') ?? '3');

  async function castVote(choice: string) {
    setVoting(true);
    try {
      await api.vote(id, choice);
      mutate();
    } catch (e) {
      console.error(e);
    } finally {
      setVoting(false);
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      await api.addComment(id, comment);
      setComment('');
      mutate();
    } catch (e) {
      console.error(e);
    } finally {
      setCommenting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <Link href="/proposals" className="flex items-center gap-2 text-otr-silver hover:text-otr-gold text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> All Proposals
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-sm font-mono text-otr-dim">LIP-{String(proposal.lipNumber).padStart(3, '0')}</span>
          <StatusBadge status={proposal.status} />
          <TierBadge tier={tier} />
          <span className="text-sm text-otr-silver">Type {proposal.type}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-100 mb-3">{proposal.title}</h1>
        <p className="text-otr-silver">{proposal.summary}</p>
        <div className="flex items-center gap-3 mt-4 text-sm text-otr-silver">
          <span>by <strong className="text-slate-200">{proposal.author?.username}</strong></span>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass">
            <h2 className="font-display font-semibold mb-4 text-otr-gold">Proposal Content</h2>
            <div className="prose prose-invert prose-sm max-w-none text-otr-silver leading-relaxed whitespace-pre-wrap">
              {proposal.content}
            </div>
          </div>

          {/* Comments */}
          <div className="p-6 rounded-2xl glass">
            <h2 className="font-display font-semibold mb-4 text-otr-gold flex items-center gap-2">
              <MessageCircle size={18} /> Discussion ({proposal.comments?.length ?? 0})
            </h2>

            <div className="space-y-4 mb-6">
              {proposal.comments?.map((c: any) => (
                <div key={c.id} className="border-l-2 border-otr-border pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-200">{c.author?.username}</span>
                    <span className="text-xs text-otr-silver">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm text-otr-silver">{c.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={submitComment} className="flex gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-otr-surface border border-otr-border text-sm text-slate-200 placeholder:text-otr-silver focus:outline-none focus:border-otr-gold/50"
              />
              <button
                type="submit"
                disabled={commenting}
                className="px-4 py-2 rounded-xl bg-otr-muted text-otr-gold text-sm font-medium hover:bg-otr-border transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Voting */}
          <div className="p-5 rounded-2xl glass">
            <h3 className="font-display font-semibold mb-4 text-otr-gold">Vote</h3>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-otr-silver mb-1.5">
                <span>For: {forVotes} ({forPct}%)</span>
                <span>Against: {againstVotes}</span>
              </div>
              <div className="h-2 rounded-full bg-otr-muted overflow-hidden flex">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${forPct}%` }} />
                <div className="h-full bg-red-500 transition-all" style={{ width: `${totalVotes > 0 ? Math.round((againstVotes / totalVotes) * 100) : 0}%` }} />
              </div>
              <div className="text-xs text-otr-silver mt-1.5">
                Threshold: {Math.round(proposal.thresholdRequired * 100)}% · Quorum: {Math.round(proposal.quorumRequired * 100)}%
              </div>
            </div>

            {proposal.status === 'VOTING' && (
              <div className="space-y-2">
                {[
                  { choice: 'for', icon: ThumbsUp, label: 'For', color: 'hover:border-green-500/50 hover:text-green-400' },
                  { choice: 'against', icon: ThumbsDown, label: 'Against', color: 'hover:border-red-500/50 hover:text-red-400' },
                  { choice: 'abstain', icon: Minus, label: 'Abstain', color: 'hover:border-gray-500/50 hover:text-gray-400' },
                ].map(({ choice, icon: Icon, label, color }) => (
                  <button
                    key={choice}
                    onClick={() => castVote(choice)}
                    disabled={voting}
                    className={clsx(
                      'w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-otr-border text-sm text-otr-silver transition-all disabled:opacity-50',
                      color
                    )}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
            )}

            {proposal.status !== 'VOTING' && (
              <p className="text-xs text-otr-silver text-center py-2">
                Voting {proposal.status === 'APPROVED' ? 'closed — Approved' : proposal.status === 'REJECTED' ? 'closed — Rejected' : 'not yet active'}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="p-5 rounded-2xl glass space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-otr-silver">Staked</span>
              <span className="font-mono text-otr-gold">{proposal.stakingAmount?.toLocaleString()} LORE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-otr-silver">Category</span>
              <span className="capitalize">{proposal.category?.toLowerCase().replace('_', ' ')}</span>
            </div>
            {proposal.votingEndsAt && (
              <div className="flex justify-between">
                <span className="text-otr-silver">Voting ends</span>
                <span>{formatDistanceToNow(new Date(proposal.votingEndsAt), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
