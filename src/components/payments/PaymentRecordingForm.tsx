import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign } from 'lucide-react';
import { paymentsApi, type PaymentCreate } from '@/api/payments';
import { tenantsApi } from '@/api/tenants';

const paymentSchema = z.object({
  tenantId: z.string().min(1, 'Tenant selection is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentType: z.enum(['rent', 'deposit', 'utilities', 'maintenance', 'late_fee', 'other']),
  paymentMethod: z.enum(['cash', 'check', 'bank_transfer', 'credit_card', 'online', 'other']),
  notes: z.string().optional(),
  paymentDate: z.string().min(1, 'Payment date is required'),
  dueDate: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentRecordingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      tenantId: '',
      amount: 0,
      paymentType: 'rent',
      paymentMethod: 'bank_transfer',
      notes: '',
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: '',
    },
  });

  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getTenants,
  });

  const createMutation = useMutation({
    mutationFn: (data: PaymentCreate) => paymentsApi.createPayment(data),
    onSuccess: () => {
      toast({
        title: 'Payment recorded',
        description: 'Payment has been successfully recorded.',
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-summary'] });
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Recording failed',
        description: error.response?.data?.message || 'Failed to record payment.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    const formattedData: PaymentCreate = {
      tenantId: data.tenantId,
      amount: data.amount,
      paymentType: data.paymentType,
      paymentMethod: data.paymentMethod,
      notes: data.notes || undefined,
      paymentDate: data.paymentDate,
      dueDate: data.dueDate || undefined,
    };

    createMutation.mutate(formattedData);
  };

  const selectedTenant = tenants?.find(t => t.id === watch('tenantId'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Record Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantId">Tenant *</Label>
              <Select
                value={watch('tenantId') || ''}
                onValueChange={(value) => setValue('tenantId', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {(Array.isArray(tenants) ? tenants : []).map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName} 
                      {tenant.unit && ` (Unit ${tenant.unit.unitNumber})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tenantId && (
                <p className="text-sm text-destructive">{errors.tenantId.message}</p>
              )}
              {selectedTenant?.unit && (
                <p className="text-xs text-muted-foreground">
                  Unit {selectedTenant.unit.unitNumber} - {selectedTenant.unit.property?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select
                value={watch('paymentType')}
                onValueChange={(value) => setValue('paymentType', value as any)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="late_fee">Late Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={watch('paymentMethod')}
                onValueChange={(value) => setValue('paymentMethod', value as any)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                {...register('paymentDate')}
                className={errors.paymentDate ? 'border-destructive' : ''}
              />
              {errors.paymentDate && (
                <p className="text-sm text-destructive">{errors.paymentDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional payment notes..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}