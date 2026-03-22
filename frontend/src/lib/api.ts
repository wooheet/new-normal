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
