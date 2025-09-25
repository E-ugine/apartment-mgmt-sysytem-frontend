import React from 'react';
import { PropertiesTable } from '@/components/properties/PropertiesTable';

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">
          Manage your property portfolio, add new properties, and track occupancy rates.
        </p>
      </div>
      
      <PropertiesTable />
    </div>
  );
}