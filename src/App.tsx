import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import DashboardRedirect from "./pages/DashboardRedirect";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Lazy load dashboard components
const LandlordDashboard = lazy(() => import("./pages/dashboards/LandlordDashboard"));
const CaretakerDashboard = lazy(() => import("./pages/dashboards/CaretakerDashboard"));
const TenantDashboard = lazy(() => import("./pages/dashboards/TenantDashboard"));
const AgentDashboard = lazy(() => import("./pages/dashboards/AgentDashboard"));

// Lazy load page components
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const UnitsPage = lazy(() => import("./pages/UnitsPage"));
const TenantsPage = lazy(() => import("./pages/TenantsPage"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            <Route path="/landlord/dashboard" element={
              <ProtectedRoute allowedRoles={['landlord']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <LandlordDashboard />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/caretaker/dashboard" element={
              <ProtectedRoute allowedRoles={['caretaker']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <CaretakerDashboard />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tenant/dashboard" element={
              <ProtectedRoute allowedRoles={['tenant']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <TenantDashboard />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/agent/dashboard" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <AgentDashboard />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Properties & Units Management */}
            <Route path="/properties" element={
              <ProtectedRoute allowedRoles={['landlord', 'agent']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <PropertiesPage />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/units" element={
              <ProtectedRoute allowedRoles={['landlord', 'caretaker', 'agent']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UnitsPage />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tenants" element={
              <ProtectedRoute allowedRoles={['landlord', 'caretaker', 'agent']}>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <TenantsPage />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Payments Management */}
            <Route path="/payments" element={
              <ProtectedRoute>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <PaymentsPage />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Notices Management */}
            <Route path="/notices" element={
              <ProtectedRoute>
                <AppLayout>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <NoticesPage />
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;