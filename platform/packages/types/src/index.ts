// ─── Lore ───────────────────────────────────────────────────────────────────

export type LoreTier = 0 | 1 | 2 | 3 | 4;

export type LoreCategory =
  | 'timeline'
  | 'geography'
  | 'faction'
  | 'character'
  | 'world_rule'
  | 'artifact';

export interface LoreEntry {
  id: string;
  title: string;
  summary: string;
  content: string;
  tier: LoreTier;
  category: LoreCategory;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  proposalId?: string;
}

// ─── Proposals (LIP) ────────────────────────────────────────────────────────

export type ProposalType = 'A' | 'B' | 'C' | 'D';
export type ProposalStatus =
  | 'draft'
  | 'review'
  | 'discussion'
  | 'voting'
  | 'approved'
  | 'rejected'
  | 'archived';

export interface Proposal {
  id: string;
  lipNumber: number;
  title: string;
  summary: string;
  content: string;
  type: ProposalType;
  targetTier: LoreTier;
  category: LoreCategory;
  status: ProposalStatus;
  authorId: string;
  author: User;
  stakingAmount: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorumRequired: number;
  thresholdRequired: number;
  discussionEndsAt: string;
  votingEndsAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Voting ──────────────────────────────────────────────────────────────────

export type VoteChoice = 'for' | 'against' | 'abstain';

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  choice: VoteChoice;
  weight: number;
  createdAt: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export type MembershipTier = 'observer' | 'contributor' | 'lorekeeper';

export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  membershipTier: MembershipTier;
  lorePoints: number;
  proposalsSubmitted: number;
  votescast: number;
  createdAt: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
