import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Building,
  Users,
  DollarSign,
  Bell,
  Settings,
  BarChart3,
  Key,
  Wrench,
  FileText,
  Calendar,
  MessageSquare,
} from 'lucide-react';

const roleMenus = {
  landlord: [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Properties', url: '/properties', icon: Building },
    { title: 'Units', url: '/units', icon: Key },
    { title: 'Tenants', url: '/tenants', icon: Users },
    { title: 'Payments', url: '/payments', icon: DollarSign },
    { title: 'Notices', url: '/notices', icon: Bell },
    { title: 'Reports', url: '/reports', icon: BarChart3 },
  ],
  caretaker: [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Properties', url: '/properties', icon: Building },
    { title: 'Units', url: '/units', icon: Key },
    { title: 'Tenants', url: '/tenants', icon: Users },
    { title: 'Payments', url: '/payments', icon: DollarSign },
    { title: 'Notices', url: '/notices', icon: Bell },
    { title: 'Maintenance', url: '/maintenance', icon: Wrench },
  ],
  tenant: [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'My Unit', url: '/unit', icon: Key },
    { title: 'Payments', url: '/payments', icon: DollarSign },
    { title: 'Notices', url: '/notices', icon: Bell },
    { title: 'Maintenance', url: '/maintenance', icon: Wrench },
    { title: 'Documents', url: '/documents', icon: FileText },
  ],
  agent: [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Properties', url: '/properties', icon: Building },
    { title: 'Prospects', url: '/prospects', icon: Users },
    { title: 'Tours', url: '/tours', icon: Calendar },
    { title: 'Applications', url: '/applications', icon: FileText },
    { title: 'Communications', url: '/communications', icon: MessageSquare },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = roleMenus[user?.role as keyof typeof roleMenus] || [];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center w-full text-left transition-colors";
    return isActive(path) 
      ? `${baseClass} bg-primary/10 text-primary font-medium border-r-2 border-primary` 
      : `${baseClass} hover:bg-muted/50`;
  };

  const getNotificationCount = (path: string) => {
    // Mock notification counts - in real app, these would come from API
    const notifications: Record<string, number> = {
      '/notices': 3,
      '/maintenance': 2,
      '/payments': 1,
    };
    return notifications[path] || 0;
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className={`px-4 py-2 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? user?.role?.charAt(0).toUpperCase() : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const notificationCount = getNotificationCount(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClass(item.url)}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} shrink-0`} />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{item.title}</span>
                            {notificationCount > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5"
                              >
                                {notificationCount > 99 ? '99+' : notificationCount}
                              </Badge>
                            )}
                          </div>
                        )}
                        {collapsed && notificationCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="mt-auto px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    className={getNavClass('/settings')}
                    title={collapsed ? 'Settings' : undefined}
                  >
                    <Settings className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} shrink-0`} />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}