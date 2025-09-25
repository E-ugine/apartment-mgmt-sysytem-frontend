import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter,
  Megaphone,
  Calendar,
  User,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { noticesApi, type Notice } from '@/api/notices';

export function NoticesFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  const { data: notices, isLoading, error } = useQuery({
    queryKey: ['notices'],
    queryFn: noticesApi.getNotices,
  });

  const markAsReadMutation = useMutation({
    mutationFn: noticesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
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

  const filteredNotices = (Array.isArray(notices) ? notices : []).filter(notice => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || notice.priority === priorityFilter;
    const matchesAudience = audienceFilter === 'all' || notice.audienceType === audienceFilter;
    const matchesRead = readFilter === 'all' || 
      (readFilter === 'read' && notice.isRead) || 
      (readFilter === 'unread' && !notice.isRead);

    return matchesSearch && matchesPriority && matchesAudience && matchesRead;
  });

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

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'landlords':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'caretakers':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'tenants':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'agents':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p>Error loading notices. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Notices Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Audiences</SelectItem>
                <SelectItem value="landlords">Landlords</SelectItem>
                <SelectItem value="caretakers">Caretakers</SelectItem>
                <SelectItem value="tenants">Tenants</SelectItem>
                <SelectItem value="agents">Agents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-32 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notices List */}
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
            ) : filteredNotices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || priorityFilter !== 'all' || audienceFilter !== 'all' || readFilter !== 'all' ? 
                  'No notices found matching your filters.' : 
                  'No notices published yet.'
                }
              </div>
            ) : (
              filteredNotices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className={`border transition-colors ${!notice.isRead ? 'bg-blue-50/50 border-blue-200' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${!notice.isRead ? 'text-blue-900' : ''}`}>
                            {notice.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getPriorityColor(notice.priority)}>
                              {getPriorityIcon(notice.priority)}
                              <span className="ml-1 capitalize">{notice.priority}</span>
                            </Badge>
                            <Badge variant="outline" className={getAudienceColor(notice.audienceType)}>
                              <User className="h-3 w-3 mr-1" />
                              {notice.audienceType === 'all' ? 'All Users' : notice.audienceType}
                            </Badge>
                            {!notice.isRead && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {notice.message}
                      </p>

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
                            variant="outline"
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(notice.id)}
                            disabled={markAsReadMutation.isPending}
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
        </div>
      </CardContent>
    </Card>
  );
}