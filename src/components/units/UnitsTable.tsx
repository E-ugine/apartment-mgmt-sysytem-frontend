import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserPlus, 
  Search,
  DollarSign,
  Bed,
  Bath
} from 'lucide-react';
import { unitsApi, type Unit } from '@/api/units';
import { propertiesApi } from '@/api/properties';
import { AddUnitModal } from './AddUnitModal';
import { AssignTenantModal } from './AssignTenantModal';

export function UnitsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [assigningUnit, setAssigningUnit] = useState<Unit | null>(null);

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getProperties,
  });

  const { data: units, isLoading, error } = useQuery({
    queryKey: ['units', selectedPropertyId],
    queryFn: () => unitsApi.getUnits(selectedPropertyId === 'all' ? undefined : selectedPropertyId),
  });

  const deleteMutation = useMutation({
    mutationFn: unitsApi.deleteUnit,
    onSuccess: () => {
      toast({
        title: 'Unit deleted',
        description: 'Unit has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Failed to delete unit.',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setShowAddModal(true);
  };

  const handleDelete = async (unit: Unit) => {
    if (window.confirm(`Are you sure you want to delete unit "${unit.unitNumber}"? This action cannot be undone.`)) {
      deleteMutation.mutate(unit.id);
    }
  };

  const handleAssignTenant = (unit: Unit) => {
    setAssigningUnit(unit);
    setShowAssignModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowAssignModal(false);
    setEditingUnit(null);
    setAssigningUnit(null);
  };

  const filteredUnits = (Array.isArray(units) ? units : []).filter(unit =>
    unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.property?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-success text-success';
      case 'occupied':
        return 'border-primary text-primary';
      case 'maintenance':
        return 'border-warning text-warning';
      case 'reserved':
        return 'border-muted-foreground text-muted-foreground';
      default:
        return 'border-muted text-muted-foreground';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-destructive">
            <p>Failed to load units. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Units
              </CardTitle>
              <CardDescription>
                Manage individual units across your properties
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-48 bg-background">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Properties</SelectItem>
                {(Array.isArray(properties) ? properties : []).map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || (selectedPropertyId !== 'all') ? 
                          'No units found matching your filters.' : 
                          'No units found. Add your first unit to get started.'
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">
                        {unit.unitNumber}
                      </TableCell>
                      <TableCell>
                        {unit.property?.name || 'Unknown Property'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {unit.bedrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {unit.bathrooms}
                          </div>
                          {unit.squareFootage && (
                            <span>{unit.squareFootage.toLocaleString()} sq ft</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          {unit.rent.toLocaleString()}/mo
                        </div>
                      </TableCell>
                      <TableCell>
                        {unit.tenant ? (
                          <div>
                            <div className="font-medium text-sm">
                              {unit.tenant.firstName} {unit.tenant.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {unit.tenant.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Vacant</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getStatusColor(unit.status)}`}
                        >
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="bg-background border shadow-lg z-50"
                          >
                            <DropdownMenuItem 
                              onClick={() => handleEdit(unit)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAssignTenant(unit)}
                              className="cursor-pointer"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              {unit.tenant ? 'Change Tenant' : 'Assign Tenant'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(unit)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Unit Modal */}
      <AddUnitModal
        open={showAddModal}
        onClose={handleCloseModals}
        unit={editingUnit}
      />

      {/* Assign Tenant Modal */}
      <AssignTenantModal
        open={showAssignModal}
        onClose={handleCloseModals}
        unit={assigningUnit}
      />
    </div>
  );
}