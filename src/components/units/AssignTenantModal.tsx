import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { unitsApi, type Unit } from '@/api/units';
import { tenantsApi } from '@/api/tenants';

interface AssignTenantModalProps {
  open: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export function AssignTenantModal({ open, onClose, unit }: AssignTenantModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTenantId, setSelectedTenantId] = useState('');

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getTenants,
    enabled: open,
  });

  const assignMutation = useMutation({
    mutationFn: (tenantId: string) => 
      unitsApi.assignTenant(unit!.id, { tenantId }),
    onSuccess: () => {
      toast({
        title: 'Tenant assigned',
        description: 'Tenant has been successfully assigned to the unit.',
      });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      onClose();
      setSelectedTenantId('');
    },
    onError: (error: any) => {
      toast({
        title: 'Assignment failed',
        description: error.response?.data?.message || 'Failed to assign tenant.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedTenantId) {
      toast({
        title: 'No tenant selected',
        description: 'Please select a tenant to assign.',
        variant: 'destructive',
      });
      return;
    }

    assignMutation.mutate(selectedTenantId);
  };

  const handleClose = () => {
    if (!assignMutation.isPending) {
      onClose();
      setSelectedTenantId('');
    }
  };

  // Filter out tenants who are already assigned to units
  const availableTenants = tenants?.filter(tenant => 
    tenant.status === 'prospective' || !tenant.unitId
  ) || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {unit?.tenant ? 'Change Tenant' : 'Assign Tenant'}
          </DialogTitle>
          <DialogDescription>
            {unit?.tenant 
              ? `Replace the current tenant in unit ${unit.unitNumber}.`
              : `Select a tenant to assign to unit ${unit?.unitNumber}.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {unit?.tenant && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">Current Tenant:</p>
              <p className="text-sm text-muted-foreground">
                {unit.tenant.firstName} {unit.tenant.lastName} ({unit.tenant.email})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tenant">Select New Tenant</Label>
            <Select
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
              disabled={tenantsLoading}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={
                  tenantsLoading ? 'Loading tenants...' : 'Choose a tenant'
                } />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {availableTenants.length === 0 ? (
                  <SelectItem value="" disabled>
                    No available tenants found
                  </SelectItem>
                ) : (
                  availableTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      <div>
                        <p className="font-medium">
                          {tenant.firstName} {tenant.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tenant.email}
                        </p>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {availableTenants.length === 0 && !tenantsLoading && (
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
              No available tenants found. All tenants may already be assigned to units.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={assignMutation.isPending || !selectedTenantId}
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Tenant'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}