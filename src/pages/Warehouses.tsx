import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { Warehouse } from '../types';
import { cn } from '../utils/cn';

const Warehouses: React.FC = () => {
  const { warehouses, items } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter warehouses
  const filteredWarehouses = warehouses.filter(warehouse => 
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get item count by warehouse
  const getItemCount = (warehouseId: string) => {
    return items.filter(item => item.warehouseId === warehouseId).length;
  };
  
  // Get stock value by warehouse
  const getStockValue = (warehouseId: string) => {
    return items
      .filter(item => item.warehouseId === warehouseId)
      .reduce((total, item) => total + (item.quantity * item.cost), 0)
      .toFixed(2);
  };
  
  // Get low stock count by warehouse
  const getLowStockCount = (warehouseId: string) => {
    return items.filter(
      item => item.warehouseId === warehouseId && item.quantity <= item.reorderPoint
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Warehouses</h2>
        <Button icon={<Plus size={16} />}>
          Add New Warehouse
        </Button>
      </div>
      
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search warehouses by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg",
                "border border-gray-300 focus:ring-2 focus:ring-blue-500",
                "focus:border-blue-500 outline-none"
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Warehouse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <WarehouseCard 
            key={warehouse.id} 
            warehouse={warehouse} 
            itemCount={getItemCount(warehouse.id)}
            stockValue={getStockValue(warehouse.id)}
            lowStockCount={getLowStockCount(warehouse.id)}
          />
        ))}
        
        {filteredWarehouses.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">No Warehouses Found</h3>
                <p className="text-gray-500 mt-1 mb-4">
                  We couldn't find any warehouses matching your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

interface WarehouseCardProps {
  warehouse: Warehouse;
  itemCount: number;
  stockValue: string;
  lowStockCount: number;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({ 
  warehouse, 
  itemCount,
  stockValue,
  lowStockCount
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{warehouse.name}</CardTitle>
            <Badge variant={warehouse.isActive ? 'success' : 'danger'}>
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>{warehouse.address}</p>
              <p>{warehouse.city}, {warehouse.state} {warehouse.zip}</p>
              <p>{warehouse.country}</p>
            </div>
          </div>
          
          {warehouse.manager && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Manager:</span> {warehouse.manager}
            </p>
          )}
          
          <div className="flex flex-col space-y-1">
            {warehouse.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{warehouse.phone}</span>
              </div>
            )}
            
            {warehouse.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{warehouse.email}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500">Items</p>
              <p className="font-semibold">{itemCount}</p>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500">Stock Value</p>
              <p className="font-semibold">${stockValue}</p>
            </div>
          </div>
          
          {lowStockCount > 0 && (
            <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-amber-700">
                {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'} low on stock
              </p>
            </div>
          )}
          
          <div className="pt-2 flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Warehouses;