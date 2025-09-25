import { useState } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  Bell,
  UserCheck,
  Wrench,
  BarChart3
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: Home, roles: ['landlord', 'caretaker', 'tenant', 'agent'] },
  { title: 'Properties', url: '/properties', icon: Building2, roles: ['landlord', 'agent'] },
  { title: 'Units', url: '/units', icon: Building2, roles: ['landlord', 'caretaker', 'agent'] },
  { title: 'Tenants', url: '/tenants', icon: Users, roles: ['landlord', 'caretaker', 'agent'] },
  { title: 'Leases', url: '/leases', icon: FileText, roles: ['landlord', 'caretaker', 'tenant', 'agent'] },
  { title: 'Payments', url: '/payments', icon: DollarSign, roles: ['landlord', 'caretaker', 'tenant', 'agent'] },
  { title: 'Maintenance', url: '/maintenance', icon: Wrench, roles: ['landlord', 'caretaker', 'tenant'] },
  { title: 'Notices', url: '/notices', icon: Bell, roles: ['landlord', 'caretaker', 'tenant'] },
  { title: 'Reports', url: '/reports', icon: BarChart3, roles: ['landlord', 'agent'] },
  { title: 'User Management', url: '/users', icon: UserCheck, roles: ['landlord'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">ApartmentPro</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive('/settings')}
                  tooltip="Settings"
                >
                  <NavLink to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg bg-muted p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={`${user.firstName || 'User'} ${user.lastName || 'Name'}`} />
                <AvatarFallback>
                  {(user.firstName?.[0] || 'U').toUpperCase()}{(user.lastName?.[0] || 'N').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">
                  {user.firstName || 'User'} {user.lastName || 'Name'}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user.role}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
            >
              <LogOut className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}