import { apiClient } from './client';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  leaseStartDate?: string;
  leaseEndDate?: string;
  unitId?: string;
  unit?: {
    id: string;
    unitNumber: string;
    property?: {
      id: string;
      name: string;
    };
  };
  status: 'active' | 'inactive' | 'prospective';
  createdAt: string;
  updatedAt: string;
}

export interface TenantCreate {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export const tenantsApi = {
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get<Tenant[]>('/api/tenants/');
    return response.data;
  },

  getTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`/api/tenants/${id}/`);
    return response.data;
  },

  createTenant: async (data: TenantCreate): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>('/api/tenants/', data);
    return response.data;
  },

  updateTenant: async (id: string, data: Partial<TenantCreate>): Promise<Tenant> => {
    const response = await apiClient.patch<Tenant>(`/api/tenants/${id}/`, data);
    return response.data;
  },

  deleteTenant: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/tenants/${id}/`);
  },
};