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
