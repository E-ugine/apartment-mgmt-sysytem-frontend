import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { unitsApi, type Unit } from '@/api/units';
import { propertiesApi } from '@/api/properties';
import { unitSchema, type UnitFormData } from '@/lib/property-validation';

interface AddUnitModalProps {
  open: boolean;
  onClose: () => void;
  unit?: Unit | null;
}

export function AddUnitModal({ open, onClose, unit }: AddUnitModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!unit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      propertyId: '',
      unitNumber: '',
      bedrooms: 1,
      bathrooms: 1,
      rent: 0,
      deposit: 0,
      squareFootage: undefined,
      description: '',
    },
  });

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getProperties,
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: unitsApi.createUnit,
    onSuccess: () => {
      toast({
        title: 'Unit created',
        description: 'Unit has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'Failed to create unit.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UnitFormData) => 
      unitsApi.updateUnit(unit!.id, data),
    onSuccess: () => {
      toast({
        title: 'Unit updated',
        description: 'Unit has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update unit.',
        variant: 'destructive',
      });
    },
  });

  // Reset form when modal opens/closes or unit changes
  useEffect(() => {
    if (open && unit) {
      setValue('propertyId', unit.propertyId);
      setValue('unitNumber', unit.unitNumber);
      setValue('bedrooms', unit.bedrooms);
      setValue('bathrooms', unit.bathrooms);
      setValue('rent', unit.rent);
      setValue('deposit', unit.deposit);
      setValue('squareFootage', unit.squareFootage);
      setValue('description', unit.description || '');
    } else if (open) {
      reset();
    }
  }, [open, unit, setValue, reset]);

  const onSubmit = (data: UnitFormData) => {
    // Type assertion since form validation ensures required fields
    const formattedData = {
      ...data,
      squareFootage: data.squareFootage || undefined,
    } as Required<Pick<UnitFormData, 'propertyId' | 'unitNumber' | 'bedrooms' | 'bathrooms' | 'rent' | 'deposit'>> & 
         Pick<UnitFormData, 'squareFootage' | 'description'>;

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
      <DialogContent className="sm:max-w-[500px] bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Unit' : 'Add New Unit'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the unit information below.'
              : 'Fill in the details to add a new unit to your property.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property *</Label>
              <Select
                value={watch('propertyId')}
                onValueChange={(value) => setValue('propertyId', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {properties?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyId && (
                <p className="text-sm text-destructive">{errors.propertyId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitNumber">Unit Number *</Label>
                <Input
                  id="unitNumber"
                  placeholder="e.g., 4B"
                  {...register('unitNumber')}
                  className={errors.unitNumber ? 'border-destructive' : ''}
                />
                {errors.unitNumber && (
                  <p className="text-sm text-destructive">{errors.unitNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  placeholder="e.g., 850"
                  {...register('squareFootage', { valueAsNumber: true })}
                  className={errors.squareFootage ? 'border-destructive' : ''}
                />
                {errors.squareFootage && (
                  <p className="text-sm text-destructive">{errors.squareFootage.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="e.g., 2"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className={errors.bedrooms ? 'border-destructive' : ''}
                />
                {errors.bedrooms && (
                  <p className="text-sm text-destructive">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 1.5"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className={errors.bathrooms ? 'border-destructive' : ''}
                />
                {errors.bathrooms && (
                  <p className="text-sm text-destructive">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rent">Monthly Rent *</Label>
                <Input
                  id="rent"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 1200"
                  {...register('rent', { valueAsNumber: true })}
                  className={errors.rent ? 'border-destructive' : ''}
                />
                {errors.rent && (
                  <p className="text-sm text-destructive">{errors.rent.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">Security Deposit *</Label>
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 1200"
                  {...register('deposit', { valueAsNumber: true })}
                  className={errors.deposit ? 'border-destructive' : ''}
                />
                {errors.deposit && (
                  <p className="text-sm text-destructive">{errors.deposit.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the unit (amenities, features, etc.)..."
                rows={3}
                {...register('description')}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
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
                isEditing ? 'Update Unit' : 'Create Unit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}