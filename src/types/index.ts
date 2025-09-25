export * from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  totalUnits: number;
  landlordId: string;
  caretakerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'available' | 'occupied' | 'maintenance';
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}