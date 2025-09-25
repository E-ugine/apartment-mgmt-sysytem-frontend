import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateNoticeModal } from '@/components/notices/CreateNoticeModal';
import { NoticesFeed } from '@/components/notices/NoticesFeed';
import { TenantNoticeFeed } from '@/components/notices/TenantNoticeFeed';
import { NoticeStatsCards } from '@/components/notices/NoticeStatsCards';

export function NoticesPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canCreateNotices = user?.role === 'landlord' || user?.role === 'caretaker';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.role === 'tenant' ? 'Your Notices' : 'Notice Management'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'tenant' 
                ? 'Stay updated with important announcements and notices'
                : 'Create, manage, and track notices for your community'
              }
            </p>
          </div>

          {canCreateNotices && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          )}
        </div>

        {user?.role === 'tenant' ? (
          <TenantNoticeFeed />
        ) : (
          <>
            {/* Stats Cards for Landlords and Caretakers */}
            <NoticeStatsCards />

            {/* Notices Feed */}
            <NoticesFeed />
          </>
        )}

        {/* Create Notice Modal */}
        <CreateNoticeModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </AppLayout>
  );
}

export default NoticesPage;