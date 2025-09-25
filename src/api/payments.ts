import { apiClient } from './client';

export interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalCollected: number;
  expectedRevenue: number;
  collectionRate: number;
  pendingPayments: number;
  monthlyRevenue: number;
  recentPayments: Payment[];
}

export interface PaymentRecord {
  tenantId: string;
  unitId: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  description?: string;
  referenceNumber?: string;
}

export const paymentsApi = {
  getPaymentsSummary: async (): Promise<PaymentSummary> => {
    const response = await apiClient.get<PaymentSummary>('/api/payments/payments/summary/');
    return response.data;
  },

  getPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/payments/payments/');
    return response.data;
  },

  getTenantPayments: async (tenantId: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/payments/payments/?tenant=${tenantId}`);
    return response.data;
  },

  recordPayment: async (data: PaymentRecord): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/api/payments/payments/', data);
    return response.data;
  },

  updatePayment: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await apiClient.patch<Payment>(`/api/payments/payments/${id}/`, data);
    return response.data;
  },
};