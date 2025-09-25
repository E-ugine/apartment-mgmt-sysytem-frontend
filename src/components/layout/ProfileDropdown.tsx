import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell,
  ChevronDown,
  Mail,
  Phone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileDropdownProps {
  notificationCount?: number;
}

export function ProfileDropdown({ notificationCount = 0 }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
    setShowLogoutDialog(false);
  };

  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName) return 'U';
    return `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'landlord':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'caretaker':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'tenant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agent':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <Badge variant="outline" className={`text-xs ${getRoleColor(user?.role || '')}`}>
                  {user?.role}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <Badge variant="outline" className={`text-xs mt-1 ${getRoleColor(user?.role || '')}`}>
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  {user?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto bg-red-500 text-white text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}