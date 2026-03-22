import { fetcher } from '@/lib/api';
export const usersApi = {
  getMe: () => fetcher('/api/users/me'),
  getUser: (username: string) => fetcher(`/api/users/${username}`),
};
