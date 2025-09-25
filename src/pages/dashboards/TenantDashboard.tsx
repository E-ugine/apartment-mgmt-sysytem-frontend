import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Home, 
  DollarSign, 
  Bell, 
  MessageCircle,
  History,
  CreditCard,
  Calendar
} from 'lucide-react';
import { noticesApi } from '@/api/notices';
import { paymentsApi } from '@/api/payments';

export default function TenantDashboard() {
  const { user } = useAuth();

  const { data: notices, isLoading: noticesLoading } = useQuery({
    queryKey: ['tenant-notices'],
    queryFn: noticesApi.getMyFeed,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => paymentsApi.getTenantPayments(user?.id || ''),
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextPaymentDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const recentPayments = payments?.slice(0, 5) || [];
  const lastPayment = payments?.[0];
  const unreadNotices = notices?.filter(notice => notice.priority === 'high' || notice.priority === 'urgent').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Your tenant portal - manage payments, view notices, and contact your property manager.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rent Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Paid</div>
            <p className="text-xs text-muted-foreground">
              Next payment due {getNextPaymentDate()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unit Info</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4B</div>
            <p className="text-xs text-muted-foreground">
              Sunrise Apartments, Main St
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notices?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {unreadNotices} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notices Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Important updates from your property manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {noticesLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : notices?.slice(0, 4).map((notice) => (
              <div key={notice.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{notice.title}</h4>
                  <Badge 
                    variant={
                      notice.priority === 'urgent' ? 'destructive' :
                      notice.priority === 'high' ? 'default' :
                      'outline'
                    }
                    className="text-xs"
                  >
                    {notice.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notice.message.substring(0, 120)}
                  {notice.message.length > 120 ? '...' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notice.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                No notices available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment History & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tenant tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <History className="mr-2 h-4 w-4" />
                View Payment History
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Property Manager
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentsLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        payment.status === 'completed' ? 'default' :
                        payment.status === 'pending' ? 'outline' :
                        'destructive'
                      }
                      className="capitalize"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No payment history found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}