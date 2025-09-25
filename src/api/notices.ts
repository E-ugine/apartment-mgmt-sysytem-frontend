import { apiClient } from './client';

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'general' | 'maintenance' | 'payment' | 'lease' | 'emergency';
  targetAudience: 'all' | 'tenants' | 'caretakers' | 'specific';
  propertyId?: string;
  unitId?: string;
  tenantId?: string;
  expiryDate?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeStats {
  totalNotices: number;
  activeNotices: number;
  urgentNotices: number;
  recentNotices: Notice[];
}

export interface NoticeCreate {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'general' | 'maintenance' | 'payment' | 'lease' | 'emergency';
  targetAudience: 'all' | 'tenants' | 'caretakers' | 'specific';
  propertyId?: string;
  unitId?: string;
  tenantId?: string;
  expiryDate?: string;
}

export const noticesApi = {
  getNoticesStats: async (): Promise<NoticeStats> => {
    const response = await apiClient.get<NoticeStats>('/api/notices/notices/stats/');
    return response.data;
  },

  getMyFeed: async (): Promise<Notice[]> => {
    const response = await apiClient.get<Notice[]>('/api/notices/notices/my_feed/');
    return response.data;
  },

  getNotices: async (): Promise<Notice[]> => {
    const response = await apiClient.get<Notice[]>('/api/notices/notices/');
    return response.data;
  },

  createNotice: async (data: NoticeCreate): Promise<Notice> => {
    const response = await apiClient.post<Notice>('/api/notices/notices/', data);
    return response.data;
  },

  updateNotice: async (id: string, data: Partial<Notice>): Promise<Notice> => {
    const response = await apiClient.patch<Notice>(`/api/notices/notices/${id}/`, data);
    return response.data;
  },

  deleteNotice: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notices/notices/${id}/`);
  },
};