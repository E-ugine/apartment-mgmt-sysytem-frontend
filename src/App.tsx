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
import LandlordDashboard from "./pages/dashboards/LandlordDashboard";
import CaretakerDashboard from "./pages/dashboards/CaretakerDashboard";
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import DashboardRedirect from "./pages/DashboardRedirect";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";

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
            
            {/* Role-specific protected dashboards */}
            <Route path="/dashboard/landlord" element={
              <ProtectedRoute allowedRoles={['landlord']}>
                <AppLayout>
                  <LandlordDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/caretaker" element={
              <ProtectedRoute allowedRoles={['caretaker']}>
                <AppLayout>
                  <CaretakerDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/tenant" element={
              <ProtectedRoute allowedRoles={['tenant']}>
                <AppLayout>
                  <TenantDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/agent" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AppLayout>
                  <AgentDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Generic dashboard redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Placeholder protected routes - to be implemented */}
            <Route path="/properties" element={
              <ProtectedRoute allowedRoles={['landlord', 'agent']}>
                <AppLayout>
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold">Properties</h1>
                    <p className="text-muted-foreground">Properties page coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/units" element={
              <ProtectedRoute allowedRoles={['landlord', 'caretaker', 'agent']}>
                <AppLayout>
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold">Units</h1>
                    <p className="text-muted-foreground">Units page coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tenants" element={
              <ProtectedRoute allowedRoles={['landlord', 'caretaker', 'agent']}>
                <AppLayout>
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold">Tenants</h1>
                    <p className="text-muted-foreground">Tenants page coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Settings page coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
