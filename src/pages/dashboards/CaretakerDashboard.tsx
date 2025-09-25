import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  DollarSign, 
  Bell, 
  UserPlus,
  Receipt,
  Send,
  Users,
  Wrench
} from 'lucide-react';
import { propertiesApi } from '@/api/properties';
import { paymentsApi, type PaymentRecord } from '@/api/payments';
import { noticesApi } from '@/api/notices';

export default function CaretakerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentForm, setPaymentForm] = useState<PaymentRecord>({
    tenantId: '',
    unitId: '',
    amount: 0,
    paymentMethod: 'cash',
    description: '',
    referenceNumber: '',
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getProperties,
  });

  const { data: notices, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: noticesApi.getNotices,
  });

  const recordPaymentMutation = useMutation({
    mutationFn: paymentsApi.recordPayment,
    onSuccess: () => {
      toast({
        title: 'Payment recorded',
        description: 'Payment has been successfully recorded.',
      });
      setPaymentForm({
        tenantId: '',
        unitId: '',
        amount: 0,
        paymentMethod: 'cash',
        description: '',
        referenceNumber: '',
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Payment recording failed',
        description: error.response?.data?.message || 'Failed to record payment.',
        variant: 'destructive',
      });
    },
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.tenantId || !paymentForm.unitId || paymentForm.amount <= 0) {
      toast({
        title: 'Invalid form',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    recordPaymentMutation.mutate(paymentForm);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalUnits = properties?.reduce((sum, prop) => sum + prop.totalUnits, 0) || 0;
  const totalProperties = properties?.length || 0;
  const urgentNotices = notices?.filter(notice => notice.priority === 'urgent').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Manage properties, record payments, and handle maintenance requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  {totalUnits} total units
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {noticesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-warning">{urgentNotices}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Pending requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Recording Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>Quickly record tenant payments</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID</Label>
                  <Input
                    id="tenantId"
                    placeholder="Enter tenant ID"
                    value={paymentForm.tenantId}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, tenantId: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitId">Unit ID</Label>
                  <Input
                    id="unitId"
                    placeholder="Enter unit ID"
                    value={paymentForm.unitId}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, unitId: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={paymentForm.amount || ''}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={paymentForm.paymentMethod} 
                    onValueChange={(value: any) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference Number (Optional)</Label>
                <Input
                  id="referenceNumber"
                  placeholder="Transaction reference"
                  value={paymentForm.referenceNumber}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={recordPaymentMutation.isPending}
              >
                {recordPaymentMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Record Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions & Notices */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common caretaker tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Create New Tenant
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send Notice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Tenants
              </Button>
            </CardContent>
          </Card>

          {/* Recent Notices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Latest property notices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {noticesLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : notices?.slice(0, 3).map((notice) => (
                <div key={notice.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Bell className={`h-4 w-4 mt-1 ${
                    notice.priority === 'urgent' ? 'text-destructive' :
                    notice.priority === 'high' ? 'text-warning' :
                    'text-muted-foreground'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{notice.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-4">
                  No notices found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}