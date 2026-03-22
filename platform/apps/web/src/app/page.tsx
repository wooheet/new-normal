import Link from 'next/link';
import { ArrowRight, BookOpen, ScrollText, Sword, Users, Zap, Film } from 'lucide-react';

const stats = [
  { label: 'Lore Entries', value: '124', suffix: '' },
  { label: 'Active Proposals', value: '12', suffix: '' },
  { label: 'Community Votes', value: '3.4K', suffix: '+' },
  { label: 'LORE Staked', value: '2.1M', suffix: '' },
];

const features = [
  {
    icon: BookOpen,
    title: 'Living World',
    desc: 'Explore a rich universe built layer by layer. Tier 0 core laws through Tier 3 fan-driven OTR stories — every piece connected.',
  },
  {
    icon: ScrollText,
    title: 'Governance DAO',
    desc: 'Submit a LIP (Lore Improvement Proposal), stake LORE tokens, survive community review, and earn Canon status.',
  },
  {
    icon: Sword,
    title: 'Battle Votes',
    desc: 'Who wins in a fight? Kael vs. The Unnamed? Vote with tokens, and AI renders the battle as a cinematic video.',
  },
  {
    icon: Film,
    title: 'AI-Generated Content',
    desc: 'Approved scenarios become real videos. More DAO staking = higher production quality. The community funds the story.',
  },
  {
    icon: Zap,
    title: 'Stake & Earn',
    desc: 'Stake LORE to amplify your vote, back winning proposals, and earn rewards when your Canon additions get produced.',
  },
  {
    icon: Users,
    title: 'Lorekeepers',
    desc: 'Elected guardians of consistency. Review proposals for Canon conflicts before they go to public vote.',
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4">
        {/* Background glow */}
        <div className="absolute inset-0 bg-void-gradient" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-otr-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-otr-gold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-otr-cyan animate-pulse" />
            Community-Governed Universe
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-gradient">The World</span>
            <br />
            <span className="text-slate-200">Belongs to Those</span>
            <br />
            <span className="text-gradient">Who Write It</span>
          </h1>

          <p className="text-lg md:text-xl text-otr-silver max-w-2xl mx-auto mb-10 leading-relaxed">
            OTR Universe is a DAO-governed world where community proposals become AI-generated videos.
            Vote on who wins, what gets built, and what becomes Canon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/proposals"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-otr-void font-semibold hover:opacity-90 transition-all hover:scale-105"
            >
              Browse Proposals <ArrowRight size={18} />
            </Link>
            <Link
              href="/lore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-otr-gold font-medium hover:bg-otr-muted transition-all"
            >
              Explore the Lore <BookOpen size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-otr-border">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ label, value, suffix }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl font-bold text-gradient">
                {value}{suffix}
              </div>
              <div className="text-sm text-otr-silver mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-gradient mb-4">
              How It Works
            </h2>
            <p className="text-otr-silver max-w-xl mx-auto">
              Write a scenario. Stake tokens. Get community approval. Watch it become a video.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl glass hover:border-otr-gold/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-otr-muted flex items-center justify-center mb-4 group-hover:bg-otr-gold/10 transition-colors">
                  <Icon size={20} className="text-otr-gold" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-slate-100">{title}</h3>
                <p className="text-sm text-otr-silver leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl glass relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-otr-gold/5" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-gradient mb-4">
                Ready to Shape the Universe?
              </h2>
              <p className="text-otr-silver mb-8">
                Submit your first Lore Improvement Proposal and leave a permanent mark on the canon.
              </p>
              <Link
                href="/proposals/new"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-gradient text-otr-void font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                Submit a Proposal <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
