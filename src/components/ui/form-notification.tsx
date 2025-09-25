import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface FormNotificationProps {
  type: NotificationType;
  message: string;
  className?: string;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-success text-success bg-success/5',
  },
  error: {
    icon: AlertCircle,
    className: 'border-destructive text-destructive bg-destructive/5',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-warning text-warning bg-warning/5',
  },
  info: {
    icon: Info,
    className: 'border-primary text-primary bg-primary/5',
  },
};

export function FormNotification({ type, message, className = '' }: FormNotificationProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="font-medium">
        {message}
      </AlertDescription>
    </Alert>
  );
}