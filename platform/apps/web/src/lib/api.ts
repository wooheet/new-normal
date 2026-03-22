const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export const api = {
  // Lore
  getLore: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/lore${qs}`);
  },
  getLoreEntry: (id: string) => fetcher(`/api/lore/${id}`),

  // Proposals
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

  // Auth
  login: (email: string, password: string) =>
    fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username: string, email: string, password: string) =>
    fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

  // Users
  getMe: () => fetcher('/api/users/me'),
  getUser: (username: string) => fetcher(`/api/users/${username}`),

  // Videos
  getVideos: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/videos${qs}`);
  },
  getVideo: (id: string) => fetcher(`/api/videos/${id}`),
  requestVideo: (data: { title: string; prompt: string; contentType: string; stake: number; sourceId?: string }) =>
    fetcher('/api/videos/request', { method: 'POST', body: JSON.stringify(data) }),
  completeVideo: (id: string, data: { videoUrl: string; thumbnailUrl?: string; duration?: number }) =>
    fetcher(`/api/videos/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),

  // Seed (dev)
  seed: () => fetcher('/api/seed', { method: 'POST' }),
};
