import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Role-based dashboard redirects
export const getRoleBasedDashboard = (role: UserRole): string => {
  switch (role) {
    case 'landlord':
      return '/dashboard'; // Full access dashboard
    case 'caretaker':
      return '/dashboard'; // Maintenance-focused dashboard  
    case 'tenant':
      return '/dashboard'; // Tenant portal dashboard
    case 'agent':
      return '/dashboard'; // Leasing-focused dashboard
    default:
      return '/dashboard';
  }
};

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallbackRedirect = redirectTo || getRoleBasedDashboard(user.role);
    return <Navigate to={fallbackRedirect} replace />;
  }

  return <>{children}</>;
}

// Higher-order component for role-specific redirects
export function withRoleRedirect<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function WrappedComponent(props: P) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}