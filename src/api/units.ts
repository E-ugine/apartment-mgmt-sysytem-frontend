import { apiClient } from './client';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  squareFootage?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  tenantId?: string;
  description?: string;
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
  // Related data
  property?: {
    id: string;
    name: string;
    address: string;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface UnitCreate {
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  squareFootage?: number;
  description?: string;
  amenities?: string[];
}

export interface UnitUpdate extends Partial<UnitCreate> {}

export interface AssignTenant {
  tenantId: string;
}

export const unitsApi = {
  getUnits: async (propertyId?: string): Promise<Unit[]> => {
    const params = propertyId ? `?property=${propertyId}` : '';
    const response = await apiClient.get<Unit[]>(`/api/units/${params}`);
    return response.data;
  },

  getUnit: async (id: string): Promise<Unit> => {
    const response = await apiClient.get<Unit>(`/api/units/${id}/`);
    return response.data;
  },

  createUnit: async (data: UnitCreate): Promise<Unit> => {
    const response = await apiClient.post<Unit>('/api/units/', data);
    return response.data;
  },

  updateUnit: async (id: string, data: UnitUpdate): Promise<Unit> => {
    const response = await apiClient.patch<Unit>(`/api/units/${id}/`, data);
    return response.data;
  },

  deleteUnit: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/units/${id}/`);
  },

  assignTenant: async (id: string, data: AssignTenant): Promise<Unit> => {
    const response = await apiClient.post<Unit>(`/api/units/${id}/assign_tenant/`, data);
    return response.data;
  },
};