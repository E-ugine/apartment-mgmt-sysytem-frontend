import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, DollarSign, Wrench, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Sample data - in a real app, this would come from API
  const stats = {
    totalProperties: 12,
    totalUnits: 156,
    occupiedUnits: 142,
    totalRevenue: 245600,
    pendingMaintenance: 8,
  };

  const occupancyRate = Math.round((stats.occupiedUnits / stats.totalUnits) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const roleSpecificCards = () => {
    switch (user?.role) {
      case 'landlord':
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  Active properties managed
                </p>
              </CardContent>
            </Card>
          </>
        );
      case 'caretaker':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingMaintenance}</div>
              <p className="text-xs text-muted-foreground">
                Requests awaiting action
              </p>
            </CardContent>
          </Card>
        );
      case 'tenant':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rent Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Paid</div>
              <p className="text-xs text-muted-foreground">
                Next payment due Dec 1st
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedUnits} of {stats.totalUnits} units occupied
            </p>
          </CardContent>
        </Card>

        {roleSpecificCards()}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-success"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Unit 4B payment received</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-warning"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Maintenance request submitted</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New lease signed for Unit 2A</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for {user?.role}s</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user?.role === 'landlord' && (
              <>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Add New Property
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Generate Financial Report
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Review Pending Applications
                </Badge>
              </>
            )}
            {user?.role === 'caretaker' && (
              <>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Schedule Maintenance
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Update Unit Status
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Send Notice to Tenants
                </Badge>
              </>
            )}
            {user?.role === 'tenant' && (
              <>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Submit Maintenance Request
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Pay Rent
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Contact Landlord
                </Badge>
              </>
            )}
            {user?.role === 'agent' && (
              <>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Show Available Units
                </Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Process Application</Badge>
                <Badge variant="outline" className="w-full justify-start p-3 cursor-pointer hover:bg-accent">
                  Schedule Tour
                </Badge>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}