import React from 'react';
import { UnitsTable } from '@/components/units/UnitsTable';

export default function UnitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Units</h1>
        <p className="text-muted-foreground">
          Manage individual units, assign tenants, and track unit details across all properties.
        </p>
      </div>
      
      <UnitsTable />
    </div>
  );
}