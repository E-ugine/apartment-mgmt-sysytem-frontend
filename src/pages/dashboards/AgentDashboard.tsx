import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Users, 
  Calendar, 
  Eye,
  UserPlus,
  ClipboardList,
  Phone,
  TrendingUp
} from 'lucide-react';
import { propertiesApi } from '@/api/properties';

export default function AgentDashboard() {
  const { user } = useAuth();

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getProperties,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const availableUnits = properties?.reduce((sum, prop) => sum + (prop.totalUnits - prop.occupiedUnits), 0) || 0;
  const totalProperties = properties?.length || 0;
  const totalUnits = properties?.reduce((sum, prop) => sum + prop.totalUnits, 0) || 0;
  const occupiedUnits = properties?.reduce((sum, prop) => sum + prop.occupiedUnits, 0) || 0;

  // Mock data for agent-specific metrics
  const scheduledTours = 5;
  const pendingApplications = 3;
  const monthlyLeases = 8;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Manage leasing activities, schedule tours, and process applications.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{availableUnits}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for leasing
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Tours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledTours}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Leases</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyLeases}</div>
            <p className="text-xs text-muted-foreground">
              Signed this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common leasing agent tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Show Available Units
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Process Application
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Tour
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Prospective Tenant
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Contact Prospects
            </Button>
          </CardContent>
        </Card>

        {/* Available Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Available Properties</CardTitle>
            <CardDescription>Properties with available units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {propertiesLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : properties?.filter(prop => prop.totalUnits > prop.occupiedUnits).slice(0, 4).map((property) => {
              const availableUnitsCount = property.totalUnits - property.occupiedUnits;
              return (
                <div key={property.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{property.name}</p>
                    <p className="text-xs text-muted-foreground">{property.address}</p>
                    <p className="text-xs text-success">
                      {availableUnitsCount} unit{availableUnitsCount !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-success border-success">
                      Available
                    </Badge>
                  </div>
                </div>
              );
            }) || (
              <p className="text-center text-muted-foreground py-8">
                No available units found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest leasing activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-success"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Tour scheduled for Unit 3A</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Application received for Unit 2B</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-warning"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Lease signed for Unit 1C</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Tour completed for Unit 4D</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Property tour - Unit 3A</p>
                <p className="text-xs text-muted-foreground">2:00 PM - 2:30 PM</p>
              </div>
              <Badge variant="outline">Today</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Follow up with prospect</p>
                <p className="text-xs text-muted-foreground">4:00 PM</p>
              </div>
              <Badge variant="outline">Today</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Review application - J. Smith</p>
                <p className="text-xs text-muted-foreground">Tomorrow</p>
              </div>
              <Badge variant="secondary">Tomorrow</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}