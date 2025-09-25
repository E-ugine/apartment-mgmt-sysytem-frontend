import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Megaphone,
  Bell,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { noticesApi } from '@/api/notices';

export function NoticeStatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['notice-stats'],
    queryFn: noticesApi.getStats,
  });

  const cards = [
    {
      title: 'Total Notices',
      value: stats?.totalNotices || 0,
      icon: Megaphone,
      format: 'number',
      description: 'All published notices',
    },
    {
      title: 'Unread Notices',
      value: stats?.unreadCount || 0,
      icon: Bell,
      format: 'number',
      description: 'Awaiting acknowledgment',
    },
    {
      title: 'Urgent Notices',
      value: stats?.urgentCount || 0,
      icon: AlertTriangle,
      format: 'number',
      description: 'High priority items',
    },
    {
      title: 'Acknowledged',
      value: stats?.acknowledgedCount || 0,
      icon: CheckCircle,
      format: 'number',
      description: 'Marked as read',
    },
    {
      title: 'Acknowledgment Rate',
      value: stats?.acknowledgmentRate || 0,
      icon: TrendingUp,
      format: 'percentage',
      description: 'Overall read rate',
    },
    {
      title: 'Engagement Score',
      value: stats ? Math.round((stats.acknowledgedCount / Math.max(stats.totalNotices, 1)) * 100) : 0,
      icon: Users,
      format: 'percentage',
      description: 'User interaction level',
    },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getValueColor = (title: string, value: number) => {
    switch (title) {
      case 'Acknowledgment Rate':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      case 'Engagement Score':
        if (value >= 75) return 'text-green-600';
        if (value >= 50) return 'text-yellow-600';
        return 'text-red-600';
      case 'Urgent Notices':
        if (value === 0) return 'text-green-600';
        if (value <= 3) return 'text-yellow-600';
        return 'text-red-600';
      case 'Unread Notices':
        if (value === 0) return 'text-green-600';
        if (value <= 5) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  const getCardBorder = (title: string, value: number) => {
    if (title === 'Urgent Notices' && value > 0) {
      return 'border-red-200 bg-red-50/50';
    }
    if (title === 'Unread Notices' && value > 10) {
      return 'border-yellow-200 bg-yellow-50/50';
    }
    if (title === 'Acknowledgment Rate' && value >= 80) {
      return 'border-green-200 bg-green-50/50';
    }
    return '';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const cardValue = card.value;
        return (
          <Card key={card.title} className={getCardBorder(card.title, cardValue)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${
                card.title === 'Urgent Notices' && cardValue > 0 
                  ? 'text-red-500' 
                  : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className={`text-2xl font-bold ${getValueColor(card.title, cardValue)}`}>
                    {formatValue(cardValue, card.format)}
                  </div>
                )}
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}