'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import {
  ArrowRight, BookOpen, ScrollText, Sword, Users,
  Zap, Film, Globe, CheckCircle2, Circle, Sparkles, ArrowUpRight, ChevronRight, PlayCircle
} from 'lucide-react';

/* ── Feature cards ── */
const features = [
  {
    num: '01',
    icon: Globe,
    title: 'Multi-Universe Engine',
    desc: '넥슨, 토에이, 독립 창작자 — 어떤 IP든 Universe로 등록하고 동일한 DAO 인프라 위에서 구동됩니다.',
    gradient: 'from-[#f0c07a] to-[#c8953a]',
    glow: 'rgba(240,192,122,0.15)',
  },
  {
    num: '02',
    icon: BookOpen,
    title: 'Living Lore System',
    desc: 'Tier 0 절대 설정부터 Tier 3 팬픽까지. 모든 Canon은 온체인 거버넌스로 결정됩니다.',
    gradient: 'from-[#22d3ee] to-[#0891b2]',
    glow: 'rgba(34,211,238,0.15)',
  },
  {
    num: '03',
    icon: ScrollText,
    title: 'DAO Governance',
    desc: 'LIP 제출 → LORE 스테이킹 → DAO 투표 → Canon 편입. 이 세계는 오로지 커뮤니티에 의해 확장됩니다.',
    gradient: 'from-[#a78bfa] to-[#7c3aed]',
    glow: 'rgba(167,139,250,0.15)',
  },
  {
    num: '04',
    icon: Sword,
    title: 'Versus Arena',
    desc: '드래곤 vs 전투기 — 누가 이길까? 커뮤니티 투표가 승패를 결정하고, AI가 그 결말을 렌더링합니다.',
    gradient: 'from-[#f87171] to-[#dc2626]',
    glow: 'rgba(248,113,113,0.15)',
  },
  {
    num: '05',
    icon: Film,
    title: 'AI Production Pipeline',
    desc: '거버넌스를 통과한 시나리오는 파이프라인을 타고 고품질 영상으로 자동 변환됩니다.',
    gradient: 'from-[#818cf8] to-[#4f46e5]',
    glow: 'rgba(129,140,248,0.15)',
  },
  {
    num: '06',
    icon: Zap,
    title: 'Stake & Earn Economy',
    desc: 'LORE 토큰으로 투표 가중치 증폭. 가치 있는 설정을 제안하고 세계관의 주주가 되십시오.',
    gradient: 'from-[#22c55e] to-[#16a34a]',
    glow: 'rgba(34,197,94,0.15)',
  },
];

/* ── Roadmap ── */
const roadmap = [
  { phase: 'Phase 0', title: 'Genesis', desc: 'Core Canon 정의, 첫 영상 제작', status: 'done' },
  { phase: 'Phase 1', title: 'Community Platform', desc: 'LIP 제안/투표, Lore Explorer 런칭', status: 'active' },
  { phase: 'Phase 2', title: 'Token Launch', desc: 'LORE ERC-20 토큰 발행, Treasury', status: 'upcoming' },
  { phase: 'Phase 3', title: 'Full DAO', desc: '온체인 거버넌스, 멀티-IP IP 확장', status: 'upcoming' },
];

/* ── Live Stats Component ── */
function LiveStats() {
  const { data: stats } = useSWR('/api/stats', fetcher);
  const s = stats as any;

  const items = [
    { label: 'Universes',    value: s?.universes ?? '—',   color: '#f0c07a' },
    { label: 'Lore Entries', value: s?.loreEntries ?? '—', color: '#22d3ee' },
    { label: 'Proposals',    value: s?.proposals ?? '—',   color: '#a78bfa' },
    { label: 'Videos Made',  value: s?.videos ?? '—',      color: '#22c55e' },
  ];

  return (
    <section className="py-20 relative z-20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f0f22]/50 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="rounded-[32px] p-px bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-2xl">
          <div className="rounded-[32px] bg-[#070712]/80 px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {items.map(({ label, value, color }) => (
              <div key={label} className="text-center group">
                <div
                  className="font-display text-5xl md:text-6xl font-bold mb-3 tabular-nums transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${color}, white)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: `0 0 30px ${color}40`,
                  }}
                >
                  {value}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#8892a4] font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main page ── */
export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden bg-[#070712]">
      
      {/* ── Background Master Elements ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] blur-[150px] opacity-10 rounded-full animate-pulse-slow mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#f0c07a] blur-[150px] opacity-[0.07] rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-[#22d3ee] blur-[180px] opacity-10 rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
      </div>

      {/* ── Hero Region ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-up">
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(240,192,122,0.15)] group hover:bg-white/10 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]" />
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#f8fafc] font-medium">
              V1.0 Early Access Live
            </span>
          </div>

          <h1 className="font-display text-[4rem] md:text-[6.5rem] leading-[1.05] tracking-tight font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
              The World Belongs
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#f0c07a] via-[#e8b86d] to-[#c8953a] drop-shadow-[0_0_40px_rgba(240,192,122,0.4)]">
              To Those Who Write It.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8892a4] max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            시나리오를 투표하고, 온체인 거버넌스로 IP를 성장시키세요.<br />
            세계관의 진화는 이제 커뮤니티의 손에 달렸습니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/universes"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#f0c07a] to-[#c8953a] rounded-2xl text-[#070712] font-semibold text-sm overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(240,192,122,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative flex items-center gap-2">
                Explore Universes <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/videos"
              className="group px-8 py-4 rounded-2xl text-white font-medium text-sm border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center gap-2"
            >
              Watch Episodes <PlayCircle size={18} className="text-[#a78bfa] group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-white/50">Discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      <LiveStats />

      {/* ── Features ── */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Forge The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]">Architecture</span>
            </h2>
            <p className="text-[#8892a4] max-w-xl mx-auto text-lg">
              단순한 위키가 아닙니다. IP를 온체인 자산으로 만들고 콘텐츠를 생산하는 거대한 엔진입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ num, icon: Icon, title, desc, gradient, glow }, i) => (
              <div
                key={title}
                className="group relative p-px rounded-3xl overflow-hidden animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Border gradient trick */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent flex" />
                <div className="relative h-full bg-[#0d0d1e]/80 backdrop-blur-xl rounded-[23px] p-8 transition-all duration-500 hover:bg-[#15152a]/80">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: glow.replace('0.15','1') }} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} p-px shadow-lg`}>
                        <div className="w-full h-full bg-[#070712] rounded-[15px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                          <Icon size={24} className="text-white" />
                        </div>
                      </div>
                      <span className="text-[#2d2d52] font-mono font-bold text-lg">{num}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-display tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">{title}</h3>
                    <p className="text-[#8892a4] leading-relaxed text-sm">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infinite Marquee Banner ── */}
      <div className="w-full py-10 overflow-hidden bg-[#0a0a1a] border-y border-white/5 relative z-10 flex whitespace-nowrap">
        <div className="animate-[shimmer_20s_linear_infinite] inline-block font-display text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] uppercase tracking-wider space-x-12 px-6">
          <span>Write Lore</span> <span>•</span> <span>Stake Token</span> <span>•</span> <span>Pass Governance</span> <span>•</span> <span>Render Canon</span> <span>•</span>
        </div>
        <div className="animate-[shimmer_20s_linear_infinite] inline-block font-display text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] uppercase tracking-wider space-x-12 px-6" aria-hidden="true">
          <span>Write Lore</span> <span>•</span> <span>Stake Token</span> <span>•</span> <span>Pass Governance</span> <span>•</span> <span>Render Canon</span> <span>•</span>
        </div>
      </div>

      {/* ── Ecosystem Roadmap ── */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Evolution Protocol</h2>
            <p className="text-sm uppercase tracking-widest text-[#f0c07a]">The Blueprint of OTR</p>
          </div>

          <div className="space-y-6">
            {roadmap.map(({ phase, title, desc, status }, i) => (
              <div
                key={phase}
                className={`p-px rounded-2xl bg-gradient-to-r relative ${status === 'active' ? 'from-[#f0c07a]/50 to-transparent' : 'from-white/10 to-transparent'}`}
              >
                <div className="bg-[#0f0f22] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-bold shadow-lg ${
                    status === 'active' ? 'bg-gradient-to-br from-[#f0c07a] to-[#c8953a] text-[#070712] animate-pulse-slow' :
                    status === 'done' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20' :
                    'bg-[#ffffff]/5 text-white/40 border border-white/10'
                  }`}>
                    {status === 'done' ? <CheckCircle2 size={24} /> : status === 'active' ? <Sparkles size={24} /> : <Circle size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-[#8892a4] uppercase tracking-wider">{phase}</span>
                      <h3 className="text-xl font-bold text-white font-display tracking-tight">{title}</h3>
                      {status === 'active' && <span className="px-2 py-0.5 rounded-full bg-[#f0c07a]/20 text-[#f0c07a] text-[10px] font-bold uppercase tracking-widest border border-[#f0c07a]/30">Current Phase</span>}
                    </div>
                    <p className="text-[#8892a4]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Futuristic CTA ── */}
      <section className="py-32 px-4 relative z-10 pb-40">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/20 via-[#f0c07a]/20 to-[#22d3ee]/20 rounded-[40px] blur-3xl group-hover:opacity-70 transition-opacity duration-700 opacity-30" />
          <div className="relative p-px rounded-[40px] bg-gradient-to-b from-white/20 to-transparent shadow-2xl">
            <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl rounded-[40px] p-12 md:p-24 text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(240,192,122,0.15)_0%,transparent_70%)] pointer-events-none" />
              
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight relative z-10">
                A Universe Awaits You.
              </h2>
              <p className="text-lg text-[#8892a4] mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-light">
                당신의 아이디어가 정식 세계관이 됩니다. 지금 OTR 생태계에 합류하여 위대한 연대기의 첫 페이지를 장식하십시오.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link
                  href="/universes/new"
                  className="px-10 py-5 bg-white text-[#070712] rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
                >
                  Create Universe <ArrowUpRight size={18} />
                </Link>
                <Link
                  href="/docs"
                  className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  Read Whitepaper
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
