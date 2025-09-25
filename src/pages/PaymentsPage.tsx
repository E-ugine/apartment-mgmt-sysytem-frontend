import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { PaymentRecordingForm } from '@/components/payments/PaymentRecordingForm';
import { PaymentHistoryTable } from '@/components/payments/PaymentHistoryTable';
import { PaymentSummaryCards } from '@/components/payments/PaymentSummaryCards';
import { TenantPaymentHistory } from '@/components/payments/TenantPaymentHistory';

export function PaymentsPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            {user?.role === 'tenant' 
              ? 'View your payment history and manage your account'
              : 'Record payments, track payment history, and monitor collection rates'
            }
          </p>
        </div>

        {user?.role === 'tenant' ? (
          <TenantPaymentHistory />
        ) : (
          <>
            {/* Summary Cards */}
            <PaymentSummaryCards />

            {/* Recording Form for Landlords and Caretakers */}
            {(user?.role === 'landlord' || user?.role === 'caretaker') && (
              <PaymentRecordingForm />
            )}

            {/* Payment History Table */}
            <PaymentHistoryTable />
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default PaymentsPage;