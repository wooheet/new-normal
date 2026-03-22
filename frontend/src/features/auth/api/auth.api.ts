import { fetcher } from '@/lib/api';
export const authApi = {
  login: (email: string, password: string) =>
    fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username: string, email: string, password: string) =>
    fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
};
