import { fetcher } from '@/lib/api';
export const loreApi = {
  getLore: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher(`/api/lore${qs}`);
  },
  getLoreEntry: (id: string) => fetcher(`/api/lore/${id}`),
};
