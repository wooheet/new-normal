'use client';

import { useState, useEffect } from 'react';
import { fetcher } from '@/lib/api';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  points: number;
  isAdultVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('otr_token');
    if (!token) { setLoading(false); return; }
    fetcher<{ data: AuthUser }>('/api/users/me')
      .then((res) => setUser((res as any).data ?? res))
      .catch(() => localStorage.removeItem('otr_token'))
      .finally(() => setLoading(false));
  }, []);

  function login(token: string, u: AuthUser) {
    localStorage.setItem('otr_token', token);
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('otr_token');
    setUser(null);
  }

  return { user, loading, login, logout };
}
