import { apiClient } from './client';

export interface Notice {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  audienceType: 'all' | 'landlords' | 'caretakers' | 'tenants' | 'agents';
  publishDate: string;
  expiryDate?: string;
  isRead?: boolean;
  readAt?: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCreate {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  audienceType: 'all' | 'landlords' | 'caretakers' | 'tenants' | 'agents';
  publishDate: string;
  expiryDate?: string;
}

export interface NoticeStats {
  totalNotices: number;
  unreadCount: number;
  urgentCount: number;
  acknowledgedCount: number;
  acknowledgmentRate: number;
}

export const noticesApi = {
  getNotices: async (): Promise<Notice[]> => {
    const response = await apiClient.get<Notice[]>('/api/notices/notices/');
    return response.data;
  },

  createNotice: async (data: NoticeCreate): Promise<Notice> => {
    const response = await apiClient.post<Notice>('/api/notices/notices/', data);
    return response.data;
  },

  getMyFeed: async (): Promise<Notice[]> => {
    const response = await apiClient.get<Notice[]>('/api/notices/notices/my_feed/');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.post(`/api/notices/notices/${id}/mark_as_read/`);
  },

  getStats: async (): Promise<NoticeStats> => {
    const response = await apiClient.get<NoticeStats>('/api/notices/notices/stats/');
    return response.data;
  },

  // Legacy methods for backwards compatibility
  getNoticesStats: async (): Promise<NoticeStats> => {
    return noticesApi.getStats();
  },

  updateNotice: async (id: string, data: Partial<Notice>): Promise<Notice> => {
    const response = await apiClient.patch<Notice>(`/api/notices/notices/${id}/`, data);
    return response.data;
  },

  deleteNotice: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notices/notices/${id}/`);
  },
};