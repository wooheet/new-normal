'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Film, Clock, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  QUEUED: 'text-otr-silver bg-otr-muted',
  PROCESSING: 'text-otr-cyan bg-otr-cyan/10',
  COMPLETED: 'text-green-400 bg-green-400/10',
  FAILED: 'text-red-400 bg-red-400/10',
};

const QUALITY_COLORS: Record<string, string> = {
  SD: 'text-otr-silver',
  HD: 'text-blue-400',
  '4K': 'text-otr-gold',
  '4K+': 'text-purple-400',
};

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: v, isLoading } = useSWR(`/api/videos/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-32 rounded bg-otr-surface animate-pulse mb-8" />
        <div className="aspect-video rounded-2xl bg-otr-surface animate-pulse mb-6" />
        <div className="h-8 w-2/3 rounded bg-otr-surface animate-pulse mb-4" />
        <div className="h-4 w-1/2 rounded bg-otr-surface animate-pulse" />
      </div>
    );
  }

  if (!v) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-otr-silver">
        <Film size={48} className="mx-auto mb-4 opacity-30" />
        <p>Video not found.</p>
        <Link href="/videos" className="mt-4 inline-block text-otr-gold hover:underline">← Back to Videos</Link>
      </div>
    );
  }

  const video = v as any;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/videos" className="inline-flex items-center gap-1.5 text-sm text-otr-silver hover:text-otr-gold transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Videos
      </Link>

      {/* Video Player */}
      <div className="rounded-2xl overflow-hidden bg-black mb-6 aspect-video">
        {video.status === 'COMPLETED' && video.videoUrl ? (
          <video
            controls
            autoPlay={false}
            className="w-full h-full"
            poster={video.thumbnailUrl || undefined}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-otr-silver">
            <Film size={56} className="opacity-30" />
            <span className={clsx('px-3 py-1.5 rounded-full text-sm font-medium', STATUS_COLORS[video.status])}>
              {video.status === 'QUEUED' ? '⏳ Queued for production' : video.status === 'PROCESSING' ? '⚙️ AI is generating...' : '❌ Generation failed'}
            </span>
          </div>
        )}
      </div>

      {/* Title & badges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLORS[video.status])}>
            {video.status}
          </span>
          <span className={clsx('text-sm font-bold', QUALITY_COLORS[video.quality])}>
            {video.quality}
          </span>
          <span className="text-xs text-otr-silver px-2 py-1 rounded bg-otr-muted capitalize">
            {video.contentType}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold text-slate-100 mb-3 leading-snug">
          {video.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-otr-silver flex-wrap">
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-otr-gold" />
            {video.totalStake.toLocaleString()} LORE staked
          </span>
          {video.duration > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {Math.floor(video.duration / 60)}m {video.duration % 60}s
            </span>
          )}
          <span>
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Prompt */}
      {video.prompt && (
        <div className="p-5 rounded-xl glass mb-6">
          <div className="flex items-center gap-2 mb-3 text-xs text-otr-gold uppercase tracking-widest">
            <Tag size={12} /> Generation Prompt
          </div>
          <p className="text-sm text-otr-silver leading-relaxed italic">&ldquo;{video.prompt}&rdquo;</p>
        </div>
      )}

      {/* Quality tier info */}
      <div className="p-5 rounded-xl glass">
        <h3 className="font-display font-semibold text-slate-100 mb-4">Quality Tiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
          {[
            { q: 'SD', stake: '0', color: 'text-otr-silver' },
            { q: 'HD', stake: '10K', color: 'text-blue-400' },
            { q: '4K', stake: '50K', color: 'text-otr-gold' },
            { q: '4K+', stake: '200K', color: 'text-purple-400' },
          ].map(({ q, stake, color }) => (
            <div
              key={q}
              className={clsx(
                'p-3 rounded-lg',
                video.quality === q ? 'bg-otr-muted border border-otr-gold/30' : 'bg-otr-surface'
              )}
            >
              <div className={clsx('font-bold text-lg', color)}>{q}</div>
              <div className="text-xs text-otr-silver">{stake} LORE</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
