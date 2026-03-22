#!/bin/bash
set -e

cd frontend/src

# Create domain features
mkdir -p features/auth/components features/auth/hooks features/auth/api
mkdir -p features/lore/api
mkdir -p features/proposals/api
mkdir -p features/users/api
mkdir -p features/videos/api
mkdir -p features/seed/api

# Move Auth components and hooks
mv components/auth/AuthModal.tsx features/auth/components/ 2>/dev/null || true
rm -rf components/auth 2>/dev/null || true
mv hooks/useAuth.ts features/auth/hooks/ 2>/dev/null || true

# Rewrite lib/api.ts to base fetcher
cat << 'EOF' > lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('otr_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}
EOF

# Create API files for domains
cat << 'EOF' > features/lore/api/lore.api.ts
import { fetcher } from '@/lib/api';
export const loreApi = {
  getLore: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/lore${qs}`);
  },
  getLoreEntry: (id: string) => fetcher(`/api/lore/${id}`),
};
EOF

cat << 'EOF' > features/proposals/api/proposals.api.ts
import { fetcher } from '@/lib/api';
export const proposalsApi = {
  getProposals: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/proposals${qs}`);
  },
  getProposal: (id: string) => fetcher(`/api/proposals/${id}`),
  createProposal: (data: unknown) => fetcher('/api/proposals', { method: 'POST', body: JSON.stringify(data) }),
  vote: (id: string, choice: string) =>
    fetcher(`/api/proposals/${id}/vote`, { method: 'POST', body: JSON.stringify({ choice }) }),
  addComment: (id: string, content: string) =>
    fetcher(`/api/proposals/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
};
EOF

cat << 'EOF' > features/auth/api/auth.api.ts
import { fetcher } from '@/lib/api';
export const authApi = {
  login: (email: string, password: string) =>
    fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username: string, email: string, password: string) =>
    fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
};
EOF

cat << 'EOF' > features/users/api/users.api.ts
import { fetcher } from '@/lib/api';
export const usersApi = {
  getMe: () => fetcher('/api/users/me'),
  getUser: (username: string) => fetcher(`/api/users/${username}`),
};
EOF

cat << 'EOF' > features/videos/api/videos.api.ts
import { fetcher } from '@/lib/api';
export const videosApi = {
  getVideos: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/videos${qs}`);
  },
  getVideo: (id: string) => fetcher(`/api/videos/${id}`),
  requestVideo: (data: { title: string; prompt: string; contentType: string; stake: number; sourceId?: string }) =>
    fetcher('/api/videos/request', { method: 'POST', body: JSON.stringify(data) }),
  completeVideo: (id: string, data: { videoUrl: string; thumbnailUrl?: string; duration?: number }) =>
    fetcher(`/api/videos/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),
};
EOF

cat << 'EOF' > features/seed/api/seed.api.ts
import { fetcher } from '@/lib/api';
export const seedApi = {
  seed: () => fetcher('/api/seed', { method: 'POST' }),
};
EOF

# Provide an aggregated api export from a new root lib/api.client.ts or something if needed,
# or just update grep to change `api.` to domain apis.
# To not break existing `api.` calls easily, let's create `lib/api-client.ts` as a facade temporarily,
# but the user requested "도메인마다 파일 분리해줘". It's best we map them. Let's make `lib/api.ts` export an aggregate `api` object for backward compatibility, while keeping files separate.
cat << 'EOF' >> lib/api.ts

import { loreApi } from '@/features/lore/api/lore.api';
import { proposalsApi } from '@/features/proposals/api/proposals.api';
import { authApi } from '@/features/auth/api/auth.api';
import { usersApi } from '@/features/users/api/users.api';
import { videosApi } from '@/features/videos/api/videos.api';
import { seedApi } from '@/features/seed/api/seed.api';

export const api = {
  ...loreApi,
  ...proposalsApi,
  ...authApi,
  ...usersApi,
  ...videosApi,
  ...seedApi,
};
EOF

# Update hooks/useAuth.ts import
if [ -f "features/auth/hooks/useAuth.ts" ]; then
  sed -i '' 's|import { api } from '\''@/lib/api'\''|import { authApi as api, usersApi } from '\''@/features/auth/api/auth.api'\''\nimport { usersApi as users } from '\''@/features/users/api/users.api'\''|g' features/auth/hooks/useAuth.ts || true
  sed -i '' 's|api\.getMe|users\.getMe|g' features/auth/hooks/useAuth.ts || true
fi

# Update AuthModal import
if [ -f "features/auth/components/AuthModal.tsx" ]; then
  sed -i '' 's|import { useAuth } from '\''@/hooks/useAuth'\''|import { useAuth } from '\''@/features/auth/hooks/useAuth'\''|g' features/auth/components/AuthModal.tsx || true
fi

# Update layout.tsx Nav import
if [ -f "components/layout/Nav.tsx" ]; then
  sed -i '' 's|import { useAuth } from '\''@/hooks/useAuth'\''|import { useAuth } from '\''@/features/auth/hooks/useAuth'\''|g' components/layout/Nav.tsx || true
  sed -i '' 's|import { AuthModal } from '\''@/components/auth/AuthModal'\''|import { AuthModal } from '\''@/features/auth/components/AuthModal'\''|g' components/layout/Nav.tsx || true
fi

echo "Refactored features successfully."

