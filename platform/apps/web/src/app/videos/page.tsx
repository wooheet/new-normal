'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Film, Play, Zap, Plus } from 'lucide-react';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'LORE', label: 'Lore' },
  { value: 'BATTLE', label: 'Battle' },
  { value: 'PERSONAL', label: 'Personal' },
];

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

export default function VideosPage() {
  const [type, setType] = useState('');

  const qs = type ? `?type=${type}` : '';
  const { data, isLoading } = useSWR(`/api/videos${qs}`, fetcher);
  const videos = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">AI Videos</h1>
          <p className="text-otr-silver">Community-funded AI-generated videos. Stake LORE → higher quality.</p>
        </div>
        <Link
          href="/videos/request"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-otr-void font-semibold text-sm hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Request Video
        </Link>
      </div>

      {/* Type filter */}
      <div className="flex gap-1 mb-8">
        {TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              type === value ? 'bg-otr-muted text-otr-gold' : 'text-otr-silver hover:text-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-otr-surface animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 text-otr-silver">
          <Film size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No videos yet.</p>
          <p className="text-sm">Submit a proposal or request a video to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {videos.map((v: any) => (
            <Link
              key={v.id}
              href={`/videos/${v.id}`}
              className="rounded-2xl glass overflow-hidden hover:border-otr-gold/30 transition-all group"
            >
              {/* Thumbnail / placeholder */}
              <div className="relative aspect-video bg-otr-surface overflow-hidden">
                {v.thumbnailUrl ? (
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={40} className="text-otr-border" />
                  </div>
                )}
                {v.status === 'COMPLETED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-otr-gold/90 flex items-center justify-center">
                      <Play size={24} className="text-otr-void ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
                {v.duration > 0 && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs bg-black/70 text-slate-200 font-mono">
                    {Math.floor(v.duration / 60)}:{String(v.duration % 60).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[v.status] ?? 'text-otr-silver')}>
                    {v.status}
                  </span>
                  <span className={clsx('text-xs font-bold', QUALITY_COLORS[v.quality] ?? 'text-otr-silver')}>
                    {v.quality}
                  </span>
                  <span className="text-xs text-otr-silver capitalize">{v.contentType}</span>
                </div>

                <h3 className="font-display font-semibold text-slate-100 group-hover:text-otr-gold transition-colors leading-snug line-clamp-2 mb-2">
                  {v.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-otr-silver">
                  <Zap size={11} className="text-otr-gold" />
                  {v.totalStake.toLocaleString()} LORE staked
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
