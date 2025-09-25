import { apiClient } from './client';

export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  totalUnits: number;
  occupiedUnits: number;
  landlordId: string;
  caretakerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySummary {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
}

export const propertiesApi = {
  getProperties: async (): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>('/api/properties/properties/');
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await apiClient.get<Property>(`/api/properties/properties/${id}/`);
    return response.data;
  },

  createProperty: async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await apiClient.post<Property>('/api/properties/properties/', data);
    return response.data;
  },

  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    const response = await apiClient.patch<Property>(`/api/properties/properties/${id}/`, data);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/properties/properties/${id}/`);
  },
};