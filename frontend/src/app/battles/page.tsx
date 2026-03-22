'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Sword, Film, Zap, Lock } from 'lucide-react';

// Mock battles for MVP demo
const MOCK_BATTLES = [
  {
    id: 'b1',
    title: '카엘 vs. 망각의 첫 번째 아키비스트',
    type: 'battle',
    stakeA: 45200,
    stakeB: 38900,
    characterA: '카엘',
    characterB: '아르코스 (초대 아키비스트)',
    status: 'active',
    endsIn: '2d 14h',
    videoQuality: 'HD',
  },
  {
    id: 'b2',
    title: '이름 없는 학생 — 5년 후 귀환',
    type: 'story',
    stakeA: 21000,
    stakeB: 14500,
    characterA: '에스파라로 돌아옴',
    characterB: '완전히 사라짐',
    status: 'active',
    endsIn: '5d 3h',
    videoQuality: '4K',
  },
  {
    id: 'b3',
    title: '에스파라 vs. 질서의 수호자 — 대립의 시작',
    type: 'battle',
    stakeA: 89000,
    stakeB: 76000,
    characterA: '망각의 수집가 승리',
    characterB: '질서의 수호자 침략 성공',
    status: 'producing',
    endsIn: null,
    videoQuality: '4K+',
  },
];

const QUALITY_TIERS = [
  { min: 0, max: 10000, label: 'SD', desc: '720p · 30fps' },
  { min: 10000, max: 50000, label: 'HD', desc: '1080p · 60fps' },
  { min: 50000, max: 200000, label: '4K', desc: '4K · Cinematic' },
  { min: 200000, max: Infinity, label: '4K+', desc: '4K · Dolby · Extended' },
];

export default function BattlesPage() {
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeSide, setStakeSide] = useState<'A' | 'B' | null>(null);

  const selected = MOCK_BATTLES.find(b => b.id === selectedBattle);
  const totalStake = selected ? selected.stakeA + selected.stakeB : 0;
  const quality = QUALITY_TIERS.find(q => totalStake >= q.min && totalStake < q.max);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-otr-cyan tracking-widest uppercase mb-4">
          <Film size={12} /> AI-Generated Video · Community-Powered
        </div>
        <h1 className="font-display text-4xl font-bold text-gradient mb-3">Battle Arena</h1>
        <p className="text-otr-silver max-w-xl">
          Vote on who wins, stake LORE tokens to amplify your side. When the vote ends, AI renders the battle as a real video.
          More total stake = higher production quality.
        </p>
      </div>

      {/* Quality scale */}
      <div className="p-4 rounded-2xl glass mb-8">
        <div className="text-xs text-otr-silver uppercase tracking-widest mb-3 font-medium">Production Quality Scale</div>
        <div className="grid grid-cols-4 gap-2">
          {QUALITY_TIERS.map((tier) => (
            <div key={tier.label} className={clsx(
              'p-3 rounded-xl text-center border transition-all',
              totalStake >= tier.min && totalStake < tier.max && selectedBattle
                ? 'border-otr-gold/50 bg-otr-gold/10'
                : 'border-otr-border'
            )}>
              <div className={clsx('font-display font-bold text-lg', totalStake >= tier.min && totalStake < tier.max && selectedBattle ? 'text-otr-gold' : 'text-otr-silver')}>
                {tier.label}
              </div>
              <div className="text-xs text-otr-silver mt-0.5">{tier.desc}</div>
              <div className="text-xs text-otr-muted mt-1">
                {tier.max === Infinity ? `${(tier.min/1000).toFixed(0)}K+` : `${(tier.min/1000).toFixed(0)}K–${(tier.max/1000).toFixed(0)}K`} LORE
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Battle list */}
        <div className="space-y-4">
          {MOCK_BATTLES.map((battle) => {
            const total = battle.stakeA + battle.stakeB;
            const pctA = Math.round((battle.stakeA / total) * 100);
            return (
              <button
                key={battle.id}
                onClick={() => setSelectedBattle(battle.id === selectedBattle ? null : battle.id)}
                className={clsx(
                  'w-full text-left p-5 rounded-2xl glass transition-all',
                  selectedBattle === battle.id ? 'border-otr-gold/50' : 'hover:border-otr-gold/20'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {battle.type === 'battle' ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/30">BATTLE</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/30">STORY</span>
                      )}
                      {battle.status === 'producing' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-800/30 flex items-center gap-1">
                          <Film size={10} /> Producing
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm">{battle.title}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-xs font-mono text-otr-gold">{battle.videoQuality}</div>
                    <div className="text-xs text-otr-silver">{(total/1000).toFixed(1)}K staked</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="text-green-400 font-medium truncate max-w-[120px]">{battle.characterA}</span>
                  <Sword size={10} className="text-otr-silver shrink-0" />
                  <span className="text-red-400 font-medium truncate max-w-[120px]">{battle.characterB}</span>
                </div>

                <div className="h-1.5 rounded-full bg-otr-muted overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: `${pctA}%` }} />
                  <div className="h-full bg-red-500" style={{ width: `${100 - pctA}%` }} />
                </div>
                <div className="flex justify-between text-xs text-otr-silver mt-1">
                  <span>{pctA}%</span>
                  <span>{100 - pctA}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stake panel */}
        {selected ? (
          <div className="p-6 rounded-2xl glass h-fit">
            <h3 className="font-display font-semibold text-otr-gold mb-4">{selected.title}</h3>

            {selected.status === 'producing' ? (
              <div className="text-center py-8">
                <Film size={40} className="text-otr-violet mx-auto mb-3 animate-pulse" />
                <p className="font-semibold text-slate-100">AI is rendering this video</p>
                <p className="text-sm text-otr-silver mt-1">Quality: <strong className="text-otr-gold">{selected.videoQuality}</strong></p>
                <p className="text-sm text-otr-silver mt-0.5">Estimated: 24–48h</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-otr-silver mb-4">
                  Total staked: <strong className="text-otr-gold font-mono">{((selected.stakeA + selected.stakeB)/1000).toFixed(1)}K LORE</strong>
                  <span className="mx-2">·</span>
                  Current quality: <strong className="text-otr-cyan">{quality?.label} ({quality?.desc})</strong>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(['A', 'B'] as const).map((side) => (
                    <button
                      key={side}
                      onClick={() => setStakeSide(side)}
                      className={clsx(
                        'p-3 rounded-xl border text-sm font-medium transition-all',
                        stakeSide === side
                          ? side === 'A' ? 'border-green-500/60 bg-green-900/20 text-green-400' : 'border-red-500/60 bg-red-900/20 text-red-400'
                          : 'border-otr-border text-otr-silver hover:border-otr-gold/30'
                      )}
                    >
                      <div className="truncate">{side === 'A' ? selected.characterA : selected.characterB}</div>
                      <div className="font-mono mt-1">{((side === 'A' ? selected.stakeA : selected.stakeB)/1000).toFixed(1)}K</div>
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-otr-silver mb-2">Stake Amount (LORE)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-otr-surface border border-otr-border text-slate-200 text-sm focus:outline-none focus:border-otr-gold/50"
                  />
                </div>

                <div className="mb-4 p-3 rounded-xl bg-otr-muted/30 text-xs text-otr-silver">
                  <Zap size={12} className="inline mr-1 text-otr-gold" />
                  Adding <strong className="text-slate-200">{stakeAmount || '0'} LORE</strong> pushes total to{' '}
                  <strong className="text-otr-cyan">
                    {(((selected.stakeA + selected.stakeB) + (parseInt(stakeAmount) || 0))/1000).toFixed(1)}K
                  </strong>
                  {' '}— may unlock higher video quality
                </div>

                <button
                  disabled={!stakeSide || !stakeAmount}
                  className="w-full py-3 rounded-xl text-otr-void font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #e8b86d, #c8953a)' }}
                >
                  Stake {stakeAmount || '—'} LORE on "{stakeSide === 'A' ? selected.characterA : stakeSide === 'B' ? selected.characterB : '...'}"
                </button>

                <p className="text-xs text-otr-silver text-center mt-2">
                  Stakers on the winning side earn proportional rewards from losing side's stake.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass flex items-center justify-center text-center">
            <div>
              <Sword size={32} className="text-otr-muted mx-auto mb-3" />
              <p className="text-otr-silver text-sm">Select a battle to stake LORE and vote on the outcome</p>
            </div>
          </div>
        )}
      </div>

      {/* Adult content note */}
      <div className="mt-10 p-5 rounded-2xl border border-otr-border bg-otr-surface/50 flex items-start gap-3">
        <Lock size={18} className="text-otr-silver shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-sm">Extended Content (Coming Soon)</div>
          <div className="text-xs text-otr-silver mt-1">
            Age-verified members can access personalized story scenarios — romantic arcs, character relationship paths, and custom narratives.
            All content is DAO-governed and AI-generated. Requires identity verification + LORE token holding.
          </div>
        </div>
      </div>
    </div>
  );
}
