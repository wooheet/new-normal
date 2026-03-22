'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { Film, Play, Zap, Plus, Clapperboard } from 'lucide-react';

const TYPES = [
  { value: '',         label: 'All Videos' },
  { value: 'LORE',     label: 'Lore' },
  { value: 'BATTLE',   label: 'Battle' },
  { value: 'PERSONAL', label: 'Personal' },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  QUEUED:     { color: '#8892a4', bg: 'rgba(136,146,164,0.1)' },
  PROCESSING: { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)'  },
  COMPLETED:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  FAILED:     { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

const QUALITY_COLOR: Record<string, string> = {
  SD:   '#4a5568',
  HD:   '#60a5fa',
  '4K': '#f0c07a',
  '4K+':'#a78bfa',
};

export default function VideosPage() {
  const [type, setType] = useState('');

  const qs = type ? `?type=${type}` : '';
  const { data, isLoading } = useSWR(`/api/videos${qs}`, fetcher);
  const videos = (data as any)?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-mono mb-2" style={{ color: '#2a2a48' }}>
            Platform / Videos
          </p>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">AI Videos</h1>
          <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
            Community-funded AI-generated videos.&nbsp;
            <span style={{ color: '#f0c07a' }}>Stake LORE</span> → higher quality.
          </p>
        </div>
        <Link
          href="/videos/request"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e', boxShadow: '0 2px 12px rgba(240,192,122,0.2)' }}
        >
          <Plus size={15} /> Request Video
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={type === value ? {
              background: 'rgba(240,192,122,0.1)',
              border: '1px solid rgba(240,192,122,0.3)',
              color: '#f0c07a',
            } : {
              background: 'transparent',
              border: '1px solid rgba(30,30,58,0.7)',
              color: '#374155',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)' }}>
              <div className="aspect-video skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center"
            style={{ background: 'rgba(15,15,34,0.8)', border: '1px solid rgba(30,30,58,0.6)' }}>
            <Clapperboard size={30} style={{ color: '#2a2a48' }} />
          </div>
          <p className="font-semibold mb-1.5" style={{ color: '#e2e8f0' }}>No videos yet</p>
          <p className="text-sm max-w-xs mb-6" style={{ color: '#374155' }}>
            Submit a proposal or request a video to get the AI pipeline started.
          </p>
          <Link
            href="/videos/request"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e' }}
          >
            <Plus size={15} /> Request a Video
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {videos.map((v: any) => {
            const ss = STATUS_STYLE[v.status] ?? STATUS_STYLE.QUEUED;
            const qc = QUALITY_COLOR[v.quality] ?? '#4a5568';
            return (
              <Link
                key={v.id}
                href={`/videos/${v.id}`}
                className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  background: 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(#111128, #111128) padding-box, linear-gradient(135deg, rgba(240,192,122,0.3), rgba(30,30,58,0.7)) border-box';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #1e1e3c, #151530) border-box';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden" style={{ background: '#0a0a1a' }}>
                  {v.thumbnailUrl ? (
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film size={36} style={{ color: '#1e1e3a' }} />
                    </div>
                  )}

                  {v.status === 'COMPLETED' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', boxShadow: '0 4px 20px rgba(240,192,122,0.4)' }}>
                        <Play size={22} fill="currentColor" style={{ color: '#09090e', marginLeft: 2 }} />
                      </div>
                    </div>
                  )}

                  {/* Bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 pt-10"
                    style={{ background: 'linear-gradient(to top, rgba(7,7,18,0.95), transparent)' }}>
                    <p className="text-xs font-medium line-clamp-1 leading-snug mb-1" style={{ color: '#dde4f0' }}>
                      {v.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold" style={{ color: qc }}>{v.quality}</span>
                      {v.duration > 0 && (
                        <span className="text-[10px] font-mono" style={{ color: '#4a5568' }}>
                          {Math.floor(v.duration / 60)}:{String(v.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: ss.bg, color: ss.color }}>
                      {v.status}
                    </span>
                    <span className="text-xs capitalize" style={{ color: '#374155' }}>
                      {v.contentType?.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs shrink-0" style={{ color: '#374155' }}>
                    <Zap size={11} style={{ color: '#f0c07a' }} />
                    {v.totalStake?.toLocaleString() ?? 0}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
