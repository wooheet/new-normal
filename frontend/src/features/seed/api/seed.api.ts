import { fetcher } from '@/lib/api';
export const seedApi = {
  seed: () => fetcher('/api/seed', { method: 'POST' }),
};
