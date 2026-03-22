'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, Film, BookOpen, ScrollText, ChevronRight, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export default function UniverseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: u, isLoading } = useSWR(`/api/universes/${slug}`, fetcher);
  const universe = u as any;

  const { data: loreData } = useSWR(
    universe ? `/api/lore?universe=${universe.id}&pageSize=4` : null, fetcher
  );
  const { data: videoData } = useSWR(
    universe ? `/api/videos?universe=${universe.id}&pageSize=4` : null, fetcher
  );

  const loreEntries = (loreData as any)?.data ?? [];
  const videos = (videoData as any)?.data ?? [];

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="h-48 rounded-2xl bg-otr-surface animate-pulse" />
      <div className="h-32 rounded-2xl bg-otr-surface animate-pulse" />
    </div>
  );

  if (!universe) return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center text-otr-silver">
      <Globe size={48} className="mx-auto mb-4 opacity-30" />
      <p>Universe를 찾을 수 없습니다.</p>
      <Link href="/universes" className="mt-4 inline-block text-otr-gold hover:underline">← 목록으로</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/universes" className="inline-flex items-center gap-1.5 text-sm text-otr-silver hover:text-otr-gold transition-colors mb-8">
        <ArrowLeft size={15} /> 모든 Universe
      </Link>

      {/* Header */}
      <div className="p-8 rounded-2xl glass mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-otr-gold/5" />
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl border border-otr-gold/20 flex items-center justify-center shrink-0" style={{ background: 'rgba(232,184,109,0.08)' }}>
            {universe.logoUrl
              ? <img src={universe.logoUrl} alt={universe.name} className="w-14 h-14 rounded-xl object-cover" />
              : <Globe size={28} className="text-otr-gold" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="font-display text-3xl font-bold text-gradient">{universe.name}</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-otr-muted text-otr-silver font-mono">/{universe.slug}</span>
            </div>
            <p className="text-otr-silver mb-4">{universe.description}</p>
            <div className="flex gap-4 text-sm text-otr-silver flex-wrap">
              <span className="flex items-center gap-1.5"><ScrollText size={13} /> DAO 통과 기준 {Math.round(universe.governanceThreshold * 100)}%</span>
              <span className="flex items-center gap-1.5"><Film size={13} /> {universe.contentTypes}</span>
              {universe.isAdultAllowed && <span className="text-red-400 text-xs px-2 py-0.5 rounded bg-red-400/10">18+</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tier 0 Rules */}
      {universe.tier0Rules && (
        <div className="p-6 rounded-2xl glass mb-8 border-l-2 border-otr-gold/40">
          <div className="flex items-center gap-2 text-otr-gold mb-4">
            <Shield size={16} />
            <span className="font-display font-semibold">Tier 0 — 절대 불변 규칙 (IP 소유자 정의)</span>
          </div>
          <pre className="text-sm text-otr-silver whitespace-pre-wrap leading-relaxed font-sans">{universe.tier0Rules}</pre>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lore */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-slate-100 flex items-center gap-2">
              <BookOpen size={18} className="text-otr-gold" /> Lore
            </h2>
            <Link href={`/lore?universe=${universe.id}`} className="text-xs text-otr-gold hover:underline flex items-center gap-1">
              전체 보기 <ChevronRight size={12} />
            </Link>
          </div>
          {loreEntries.length === 0
            ? <p className="text-sm text-otr-silver p-4 rounded-xl bg-otr-surface">아직 Lore 항목이 없습니다.</p>
            : <div className="space-y-3">
                {loreEntries.map((e: any) => (
                  <div key={e.id} className="p-4 rounded-xl glass hover:border-otr-gold/20 transition-all">
                    <div className="text-xs text-otr-gold mb-1">Tier {e.tier} · {e.category}</div>
                    <h3 className="font-semibold text-slate-100 text-sm leading-snug">{e.title}</h3>
                    <p className="text-xs text-otr-silver mt-1 line-clamp-2">{e.summary}</p>
                  </div>
                ))}
              </div>}
        </section>

        {/* Videos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Film size={18} className="text-otr-gold" /> Videos
            </h2>
            <Link href={`/videos?universe=${universe.id}`} className="text-xs text-otr-gold hover:underline flex items-center gap-1">
              전체 보기 <ChevronRight size={12} />
            </Link>
          </div>
          {videos.length === 0
            ? <p className="text-sm text-otr-silver p-4 rounded-xl bg-otr-surface">아직 생성된 영상이 없습니다.</p>
            : <div className="space-y-3">
                {videos.map((v: any) => (
                  <Link key={v.id} href={`/videos/${v.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl glass hover:border-otr-gold/20 transition-all group">
                    {v.thumbnailUrl
                      ? <img src={v.thumbnailUrl} alt={v.title} className="w-16 h-10 rounded-lg object-cover shrink-0" />
                      : <div className="w-16 h-10 rounded-lg bg-otr-surface flex items-center justify-center shrink-0"><Film size={14} className="text-otr-border" /></div>}
                    <div className="flex-1 min-w-0">
                      <div className={clsx('text-xs font-bold mb-0.5', v.quality === '4K' ? 'text-otr-gold' : v.quality === 'HD' ? 'text-blue-400' : 'text-otr-silver')}>
                        {v.quality} · {v.status}
                      </div>
                      <p className="text-sm text-slate-200 group-hover:text-otr-gold transition-colors line-clamp-1">{v.title}</p>
                    </div>
                  </Link>
                ))}
              </div>}
        </section>
      </div>

      {/* CTA */}
      <div className="mt-10 flex gap-4 justify-center flex-wrap">
        <Link href="/proposals/new"
          className="px-6 py-3 rounded-xl text-otr-void font-semibold hover:opacity-90 transition-all flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #e8b86d, #c8953a)' }}>
          <ScrollText size={16} /> LIP 제안하기
        </Link>
        <Link href="/videos/request"
          className="px-6 py-3 rounded-xl glass text-otr-gold font-medium hover:bg-otr-muted transition-all flex items-center gap-2">
          <Film size={16} /> 영상 제작 요청
        </Link>
      </div>
    </div>
  );
}
