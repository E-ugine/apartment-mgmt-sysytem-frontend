import { apiClient } from './client';

export interface Payment {
  id: string;
  tenantId: string;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    unit?: {
      unitNumber: string;
      property: {
        name: string;
      };
    };
  };
  amount: number;
  paymentType: 'rent' | 'deposit' | 'utilities' | 'maintenance' | 'late_fee' | 'other';
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  paymentDate: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCreate {
  tenantId: string;
  amount: number;
  paymentType: 'rent' | 'deposit' | 'utilities' | 'maintenance' | 'late_fee' | 'other';
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online' | 'other';
  notes?: string;
  paymentDate: string;
  dueDate?: string;
}

export interface PaymentRecord {
  tenantId: string;
  amount: number;
  type: string;
  method: string;
  date: string;
  notes?: string;
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  pendingCount: number;
  completedCount: number;
  collectionRate: number;
  averagePayment: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalPayments: number;
  totalAmount: number;
  paymentCount: number;
}

export const paymentsApi = {
  getPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/payments/');
    return response.data;
  },

  createPayment: async (data: PaymentCreate): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/api/payments/', data);
    return response.data;
  },

  getPaymentSummary: async (month?: number, year?: number): Promise<PaymentSummary> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await apiClient.get<PaymentSummary>(`/api/payments/summary/?${params.toString()}`);
    return response.data;
  },

  getMyPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/payments/my_payments/');
    return response.data;
  },

  getMonthlyReport: async (months: number = 6): Promise<MonthlyReport[]> => {
    const response = await apiClient.get<MonthlyReport[]>(`/api/payments/monthly_report/?months=${months}`);
    return response.data;
  },

  // Legacy methods for backwards compatibility
  getPaymentsSummary: async (): Promise<PaymentSummary> => {
    const response = await apiClient.get<PaymentSummary>('/api/payments/summary/');
    return response.data;
  },

  getTenantPayments: async (tenantId: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/payments/?tenant=${tenantId}`);
    return response.data;
  },

  recordPayment: async (data: PaymentRecord): Promise<Payment> => {
    const formattedData: PaymentCreate = {
      tenantId: data.tenantId,
      amount: data.amount,
      paymentType: data.type as any,
      paymentMethod: data.method as any,
      paymentDate: data.date,
      notes: data.notes,
    };
    return paymentsApi.createPayment(formattedData);
  },

  updatePayment: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await apiClient.patch<Payment>(`/api/payments/${id}/`, data);
    return response.data;
  },
};