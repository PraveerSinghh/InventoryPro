import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowLeft, ArrowRight, ArrowLeftRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const Movements: React.FC = () => {
  const { movements, items, warehouses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  
  // Filter movements
  const filteredMovements = movements.filter(movement => {
    // Get item name for searching
    const item = items.find(i => i.id === movement.itemId);
    const itemName = item ? item.name.toLowerCase() : '';
    
    const matchesSearch = 
      (item && itemName.includes(searchTerm.toLowerCase())) || 
      movement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      movement.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType ? movement.type === selectedType : true;
    
    const matchesWarehouse = selectedWarehouse ? 
      movement.fromWarehouseId === selectedWarehouse || 
      movement.toWarehouseId === selectedWarehouse : true;
    
    return matchesSearch && matchesType && matchesWarehouse;
  });
  
  // Sort movements by date (newest first)
  const sortedMovements = [...filteredMovements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get item name by id
  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };
  
  // Get warehouse name by id
  const getWarehouseName = (warehouseId?: string) => {
    if (!warehouseId) return 'N/A';
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown';
  };
  
  // Get movement icon based on type
  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowRight className="h-4 w-4" />;
      case 'out':
        return <ArrowLeft className="h-4 w-4" />;
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Get movement badge color based on type
  const getMovementBadgeVariant = (type: string): 'success' | 'danger' | 'info' => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'danger';
      case 'transfer':
        return 'info';
      default:
        return 'info';
    }
  };
  
  // Group movements by date
  const movementsByDate: Record<string, typeof movements> = {};
  
  sortedMovements.forEach(movement => {
    const dateKey = format(new Date(movement.date), 'yyyy-MM-dd');
    if (!movementsByDate[dateKey]) {
      movementsByDate[dateKey] = [];
    }
    movementsByDate[dateKey].push(movement);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Movements</h2>
        <div className="flex gap-2">
          <Button icon={<Plus size={16} />}>
            Record Movement
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by item name or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg",
                  "border border-gray-300 focus:ring-2 focus:ring-blue-500",
                  "focus:border-blue-500 outline-none"
                )}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className={cn(
                  "px-3 py-2 rounded-lg border border-gray-300",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "outline-none bg-white"
                )}
              >
                <option value="">All Types</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
                <option value="transfer">Transfer</option>
              </select>
              
              <select
                value={selectedWarehouse || ''}
                onChange={(e) => setSelectedWarehouse(e.target.value || null)}
                className={cn(
                  "px-3 py-2 rounded-lg border border-gray-300",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "outline-none bg-white"
                )}
              >
                <option value="">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                icon={<Filter size={16} />}
                className="whitespace-nowrap"
              >
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Movements List */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          {Object.keys(movementsByDate).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(movementsByDate).map(([dateKey, dateMovements]) => (
                <div key={dateKey}>
                  <div className="flex items-center mb-3">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">
                      {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="ml-auto">
                      <Badge variant="secondary">
                        {dateMovements.length} {dateMovements.length === 1 ? 'movement' : 'movements'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dateMovements.map((movement) => (
                      <div 
                        key={movement.id} 
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center">
                            <Badge 
                              variant={getMovementBadgeVariant(movement.type)}
                              className="flex items-center mr-3"
                            >
                              {getMovementIcon(movement.type)}
                              <span className="ml-1">
                                {movement.type === 'in' ? 'Stock In' : 
                                 movement.type === 'out' ? 'Stock Out' : 'Transfer'}
                              </span>
                            </Badge>
                            <div>
                              <p className="font-medium">{getItemName(movement.itemId)}</p>
                              <p className="text-sm text-gray-500">
                                Quantity: {movement.quantity}
                              </p>
                            </div>
                          </div>
                          
                          <div className="md:text-right">
                            <p className="text-sm text-gray-600">
                              {format(new Date(movement.date), 'h:mm a')}
                            </p>
                            {movement.reference && (
                              <p className="text-xs text-gray-500">
                                Ref: {movement.reference}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {movement.type === 'transfer' ? (
                            <div className="flex items-center text-sm text-gray-600">
                              <p>
                                <span className="font-medium">From:</span> {getWarehouseName(movement.fromWarehouseId)}
                                <span className="mx-2">→</span>
                                <span className="font-medium">To:</span> {getWarehouseName(movement.toWarehouseId)}
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p>
                                <span className="font-medium">
                                  {movement.type === 'in' ? 'To' : 'From'} Warehouse:
                                </span> {' '}
                                {getWarehouseName(movement.type === 'in' ? movement.toWarehouseId : movement.fromWarehouseId)}
                              </p>
                            </div>
                          )}
                          
                          {movement.notes && (
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {movement.notes}
                            </p>
                          )}
                          
                          {movement.performedBy && (
                            <p className="mt-1 text-xs text-gray-500">
                              Performed by: {movement.performedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Movements Found</h3>
              <p className="text-gray-500 mb-4">
                There are no inventory movements matching your search criteria.
              </p>
              {(searchTerm || selectedType || selectedWarehouse) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType(null);
                    setSelectedWarehouse(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Movements;