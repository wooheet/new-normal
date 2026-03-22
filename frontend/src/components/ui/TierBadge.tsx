import { clsx } from 'clsx';

const TIER_LABELS: Record<number, string> = {
  0: 'CORE',
  1: 'CONFIRMED',
  2: 'EXTENDED',
  3: 'OTR',
  4: 'FAN THEORY',
};

export function TierBadge({ tier, className }: { tier: number; className?: string }) {
  return (
    <span
      className={clsx(
        `tier-badge-${tier}`,
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono tracking-wider uppercase',
        className
      )}
    >
      Tier {tier} · {TIER_LABELS[tier] ?? 'UNKNOWN'}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-800 text-gray-400 border-gray-700',
  review: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/40',
  discussion: 'bg-blue-900/30 text-blue-400 border-blue-700/40',
  voting: 'bg-purple-900/30 text-purple-400 border-purple-700/40',
  approved: 'bg-green-900/30 text-green-400 border-green-700/40',
  rejected: 'bg-red-900/30 text-red-400 border-red-700/40',
  archived: 'bg-gray-900/30 text-gray-500 border-gray-800',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={clsx(
        STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.draft,
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase border',
        className
      )}
    >
      {status}
    </span>
  );
}
