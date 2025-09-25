import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { tenantsApi, type Tenant } from '@/api/tenants';
import { tenantSchema, type TenantFormData } from '@/lib/property-validation';

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
  tenant?: Tenant | null;
}

export function CreateTenantModal({ open, onClose, tenant }: CreateTenantModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!tenant;

  // Only allow caretakers to access this modal
  if (user?.role !== 'caretaker') {
    return null;
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: tenantsApi.createTenant,
    onSuccess: () => {
      toast({
        title: 'Tenant created',
        description: 'Tenant has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'Failed to create tenant.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TenantFormData) => 
      tenantsApi.updateTenant(tenant!.id, data),
    onSuccess: () => {
      toast({
        title: 'Tenant updated',
        description: 'Tenant has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update tenant.',
        variant: 'destructive',
      });
    },
  });

  // Reset form when modal opens/closes or tenant changes
  useEffect(() => {
    if (open && tenant) {
      setValue('firstName', tenant.firstName);
      setValue('lastName', tenant.lastName);
      setValue('email', tenant.email);
      setValue('phoneNumber', tenant.phoneNumber || '');
      setValue('dateOfBirth', tenant.dateOfBirth || '');
    } else if (open) {
      reset();
    }
  }, [open, tenant, setValue, reset]);

  const onSubmit = (data: TenantFormData) => {
    // Type assertion since form validation ensures required fields
    const formattedData = {
      ...data,
      phoneNumber: data.phoneNumber || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
    } as Required<Pick<TenantFormData, 'firstName' | 'lastName' | 'email'>> & 
         Pick<TenantFormData, 'phoneNumber' | 'dateOfBirth'>;

    if (isEditing) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Tenant' : 'Create New Tenant'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the tenant information below.'
              : 'Fill in the details to create a new tenant profile.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="e.g., John"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Doe"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john.doe@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., +1 (555) 123-4567"
                {...register('phoneNumber')}
                className={errors.phoneNumber ? 'border-destructive' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className={errors.dateOfBirth ? 'border-destructive' : ''}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Tenant' : 'Create Tenant'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}