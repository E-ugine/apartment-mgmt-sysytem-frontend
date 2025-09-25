import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  Target
} from 'lucide-react';
import { paymentsApi } from '@/api/payments';

export function PaymentSummaryCards() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['payment-summary', currentMonth, currentYear],
    queryFn: () => paymentsApi.getPaymentSummary(currentMonth, currentYear),
  });

  const cards = [
    {
      title: 'Total Payments',
      value: summary?.totalPayments || 0,
      icon: DollarSign,
      format: 'number',
      description: 'This month',
    },
    {
      title: 'Total Amount',
      value: summary?.totalAmount || 0,
      icon: TrendingUp,
      format: 'currency',
      description: 'Monthly revenue',
    },
    {
      title: 'Collection Rate',
      value: summary?.collectionRate || 0,
      icon: Target,
      format: 'percentage',
      description: 'Payment success rate',
    },
    {
      title: 'Pending Payments',
      value: summary?.pendingCount || 0,
      icon: AlertCircle,
      format: 'number',
      description: 'Awaiting processing',
    },
    {
      title: 'Completed Payments',
      value: summary?.completedCount || 0,
      icon: CreditCard,
      format: 'number',
      description: 'Successfully processed',
    },
    {
      title: 'Average Payment',
      value: summary?.averagePayment || 0,
      icon: DollarSign,
      format: 'currency',
      description: 'Per transaction',
    },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getValueColor = (title: string, value: number) => {
    switch (title) {
      case 'Collection Rate':
        if (value >= 95) return 'text-green-600';
        if (value >= 80) return 'text-yellow-600';
        return 'text-red-600';
      case 'Pending Payments':
        if (value === 0) return 'text-green-600';
        if (value <= 5) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className={`text-2xl font-bold ${getValueColor(card.title, card.value)}`}>
                    {formatValue(card.value, card.format)}
                  </div>
                )}
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
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