import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';
import { propertiesApi } from '@/api/properties';
import { paymentsApi } from '@/api/payments';
import { noticesApi } from '@/api/notices';

export default function LandlordDashboard() {
  const { user } = useAuth();

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getProperties,
  });

  const { data: paymentsSummary, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments-summary'],
    queryFn: paymentsApi.getPaymentsSummary,
  });

  const { data: noticesStats, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices-stats'],
    queryFn: noticesApi.getNoticesStats,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalUnits = (Array.isArray(properties) ? properties : []).reduce((sum, prop) => sum + prop.totalUnits, 0);
  const occupiedUnits = (Array.isArray(properties) ? properties : []).reduce((sum, prop) => sum + prop.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your property portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Properties Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{properties?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {totalUnits} total units
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{occupancyRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {occupiedUnits} of {totalUnits} units occupied
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${paymentsSummary?.monthlyRevenue?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center ${
                    (paymentsSummary?.collectionRate || 0) >= 90 ? 'text-success' : 'text-warning'
                  }`}>
                    {(paymentsSummary?.collectionRate || 0) >= 90 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {paymentsSummary?.collectionRate || 0}% collection rate
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {noticesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{noticesStats?.activeNotices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {noticesStats?.urgentNotices || 0} urgent notices
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common landlord tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Create Notice
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Financial Report
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>Your property portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {propertiesLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (Array.isArray(properties) ? properties : []).slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{property.name}</p>
                  <p className="text-xs text-muted-foreground">{property.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {property.occupiedUnits}/{property.totalUnits}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      (property.occupiedUnits / property.totalUnits) >= 0.9 
                        ? 'border-success text-success' 
                        : 'border-warning text-warning'
                    }`}
                  >
                    {Math.round((property.occupiedUnits / property.totalUnits) * 100)}% occupied
                  </Badge>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                No properties found. Add your first property to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}