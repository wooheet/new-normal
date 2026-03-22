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
