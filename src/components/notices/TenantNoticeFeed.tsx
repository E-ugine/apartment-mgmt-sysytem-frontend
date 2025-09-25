import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Calendar, 
  User, 
  Eye, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { noticesApi, type Notice } from '@/api/notices';

export function TenantNoticeFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notices, isLoading, error } = useQuery({
    queryKey: ['my-feed'],
    queryFn: noticesApi.getMyFeed,
  });

  const markAsReadMutation = useMutation({
    mutationFn: noticesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feed'] });
      queryClient.invalidateQueries({ queryKey: ['notice-stats'] });
      toast({
        title: 'Notice marked as read',
        description: 'Notice has been marked as read.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Action failed',
        description: error.response?.data?.message || 'Failed to mark notice as read.',
        variant: 'destructive',
      });
    },
  });

  const sortedNotices = (Array.isArray(notices) ? notices : []).sort((a, b) => {
    // Unread notices first
    if (!a.isRead && b.isRead) return -1;
    if (a.isRead && !b.isRead) return 1;
    
    // Then by priority (urgent first)
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // Finally by publish date (newest first)
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  const unreadNotices = sortedNotices.filter(notice => !notice.isRead);
  const urgentNotices = sortedNotices.filter(notice => notice.priority === 'urgent');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent') {
      return <AlertTriangle className="h-3 w-3" />;
    }
    return null;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p>Error loading your notices. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {unreadNotices.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Notices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className={`text-2xl font-bold ${urgentNotices.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {urgentNotices.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              High priority items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="text-2xl font-bold">
                {sortedNotices.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              All time notices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notices Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your Notices
            {unreadNotices.length > 0 && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {unreadNotices.length} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-48" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : sortedNotices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notices available at the moment.</p>
                <p className="text-sm">New notices will appear here when published.</p>
              </div>
            ) : (
              sortedNotices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className={`border transition-all ${
                    !notice.isRead 
                      ? 'bg-blue-50/50 border-blue-200 shadow-md' 
                      : notice.priority === 'urgent' 
                        ? 'border-red-200 bg-red-50/30'
                        : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!notice.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                            <h3 className={`font-semibold text-lg ${
                              !notice.isRead ? 'text-blue-900' : ''
                            } ${notice.priority === 'urgent' ? 'text-red-900' : ''}`}>
                              {notice.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`${getPriorityColor(notice.priority)} ${
                                notice.priority === 'urgent' ? 'animate-pulse' : ''
                              }`}
                            >
                              {getPriorityIcon(notice.priority)}
                              <span className="ml-1 capitalize">{notice.priority}</span>
                            </Badge>
                            {!notice.isRead && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                <Bell className="h-3 w-3 mr-1" />
                                New
                              </Badge>
                            )}
                            {notice.isRead && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Read
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg ${
                        notice.priority === 'urgent' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                      }`}>
                        <p className="text-gray-800 leading-relaxed">
                          {notice.message}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(notice.publishDate), 'MMM dd, yyyy')}
                          </div>
                          {notice.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {notice.author.firstName} {notice.author.lastName}
                            </div>
                          )}
                        </div>

                        {!notice.isRead && (
                          <Button
                            variant={notice.priority === 'urgent' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(notice.id)}
                            disabled={markAsReadMutation.isPending}
                            className={notice.priority === 'urgent' ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}