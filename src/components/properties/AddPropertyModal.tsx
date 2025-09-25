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
import { propertiesApi, type Property, type PropertyCreate } from '@/api/properties';
import { authApi } from '@/api/auth';
import { propertySchema, type PropertyFormData } from '@/lib/property-validation';

interface AddPropertyModalProps {
  open: boolean;
  onClose: () => void;
  property?: Property | null;
}

export function AddPropertyModal({ open, onClose, property }: AddPropertyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!property;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      totalUnits: 1,
      caretakerId: '',
    },
  });

  // Query for caretakers (users with caretaker role)
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // This would need to be implemented based on your user management API
      // For now, returning empty array as placeholder
      return [];
    },
    enabled: open,
  });

  const caretakers = users?.filter((user: any) => user.role === 'caretaker') || [];

  const createMutation = useMutation({
    mutationFn: (data: PropertyCreate) => propertiesApi.createProperty(data),
    onSuccess: () => {
      toast({
        title: 'Property created',
        description: 'Property has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'Failed to create property.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PropertyFormData) => 
      propertiesApi.updateProperty(property!.id, data),
    onSuccess: () => {
      toast({
        title: 'Property updated',
        description: 'Property has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update property.',
        variant: 'destructive',
      });
    },
  });

  // Reset form when modal opens/closes or property changes
  useEffect(() => {
    if (open && property) {
      setValue('name', property.name);
      setValue('address', property.address);
      setValue('description', property.description || '');
      setValue('totalUnits', property.totalUnits);
      setValue('caretakerId', property.caretakerId || '');
    } else if (open) {
      reset();
    }
  }, [open, property, setValue, reset]);

  const onSubmit = (data: PropertyFormData) => {
    const formattedData: PropertyCreate = {
      name: data.name,
      address: data.address,
      description: data.description || undefined,
      totalUnits: data.totalUnits,
      caretakerId: data.caretakerId || undefined,
    };

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
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the property information below.'
              : 'Fill in the details to add a new property to your portfolio.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Sunset Apartments"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Main Street, City, State 12345"
                {...register('address')}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalUnits">Total Units *</Label>
              <Input
                id="totalUnits"
                type="number"
                min="1"
                placeholder="e.g., 24"
                {...register('totalUnits', { valueAsNumber: true })}
                className={errors.totalUnits ? 'border-destructive' : ''}
              />
              {errors.totalUnits && (
                <p className="text-sm text-destructive">{errors.totalUnits.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caretakerId">Assigned Caretaker</Label>
              <Select
                value={watch('caretakerId') || ''}
                onValueChange={(value) => setValue('caretakerId', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a caretaker (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="">No caretaker assigned</SelectItem>
                  {caretakers.map((caretaker: any) => (
                    <SelectItem key={caretaker.id} value={caretaker.id}>
                      {caretaker.firstName} {caretaker.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the property..."
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
                isEditing ? 'Update Property' : 'Create Property'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}