import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { demoUsers } from '@/lib/demo-auth';
import { useToast } from '@/hooks/use-toast';

export function DemoCredentials() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const handleQuickLogin = async (username: string, password: string) => {
    setLoadingUser(username);
    try {
      await login({ username, password });
      toast({
        title: 'Login successful!',
        description: `Logged in as ${username}`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoadingUser(null);
    }
  };

  const copyCredentials = (username: string, password: string) => {
    navigator.clipboard.writeText(`${username} / ${password}`);
    toast({
      title: 'Copied!',
      description: 'Credentials copied to clipboard',
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Demo Credentials</CardTitle>
            <CardDescription>
              Test the system with different user roles
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {demoUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
            >
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    user.role === 'landlord' ? 'border-primary text-primary' :
                    user.role === 'caretaker' ? 'border-warning text-warning' :
                    user.role === 'tenant' ? 'border-success text-success' :
                    'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {user.role}
                </Badge>
                <div>
                  <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.username} / {showPasswords ? user.password : '••••••••'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCredentials(user.username, user.password)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(user.username, user.password)}
                  disabled={loadingUser !== null}
                >
                  {loadingUser === user.username ? (
                    <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          This component is for demonstration purposes only and should be removed in production.
        </p>
      </CardContent>
    </Card>
  );
}