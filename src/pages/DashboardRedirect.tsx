import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleBasedDashboard } from '@/routes/ProtectedRoute';

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // This will trigger a re-render with the Navigate component
      const roleBasedPath = getRoleBasedDashboard(user.role);
      console.log(`Redirecting ${user.role} to ${roleBasedPath}`);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    const dashboardPath = getRoleBasedDashboard(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <Navigate to="/login" replace />;
}