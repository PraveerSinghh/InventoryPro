import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, AlertTriangle, Package, 
  Warehouse, Tag, Barcode, Calendar, DollarSign, Info
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, warehouses, movements, itemGroups } = useApp();
  
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
        <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/items')}>
          Back to Items
        </Button>
      </div>
    );
  }
  
  const warehouse = warehouses.find(w => w.id === item.warehouseId);
  
  // Get item's movements
  const itemMovements = movements
    .filter(m => m.itemId === item.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get item's groups
  const itemGroupsList = itemGroups.filter(group => 
    item.groupIds?.includes(group.id)
  );
  
  // Get components if this is an assembly
  const components = item.components?.map(component => {
    const componentItem = items.find(i => i.id === component.itemId);
    return {
      ...component,
      item: componentItem
    };
  });
  
  // Calculate some metrics
  const totalValue = item.quantity * item.price;
  const totalCost = item.quantity * item.cost;
  const profit = totalValue - totalCost;
  const profitMargin = totalValue > 0 ? (profit / totalValue) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/items')}
          className="mr-2"
        >
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Item details */}
        <div className="flex-1 space-y-6">
          {/* Item overview card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Item image */}
                <div className="w-full md:w-1/3">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* Item details */}
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="flex justify-between">
                    <Badge variant="primary" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {item.category}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">SKU</p>
                      <p className="font-medium">{item.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock Level</p>
                      <div className="flex items-center">
                        {item.quantity <= item.reorderPoint && (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                        )}
                        <p className="font-medium">
                          {item.quantity} {item.unit}
                          {item.quantity <= item.reorderPoint && (
                            <span className="text-amber-600 text-sm ml-1">
                              (Low stock)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cost</p>
                      <p className="font-medium">${item.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Warehouse</p>
                      <p className="font-medium">{warehouse?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{item.location || 'Not specified'}</p>
                    </div>
                    {item.expiryDate && (
                      <div>
                        <p className="text-sm text-gray-500">Expiry Date</p>
                        <p className="font-medium">
                          {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Reorder Point</p>
                      <p className="font-medium">{item.reorderPoint} {item.unit}</p>
                    </div>
                  </div>
                  
                  {item.barcodes && item.barcodes.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Barcodes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.barcodes.map((barcode, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            <Barcode className="h-3 w-3 mr-1" />
                            {barcode}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Item metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ y: -5 }} className="hover:shadow-md transition-all">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                  </div>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="hover:shadow-md transition-all">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                    <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  </div>
                  <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="hover:shadow-md transition-all">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-purple-600 mr-1" />
                    <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  </div>
                  <p className="text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Item groups and components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Item Groups</CardTitle>
              </CardHeader>
              <CardContent>
                {itemGroupsList.length > 0 ? (
                  <ul className="space-y-2">
                    {itemGroupsList.map(group => (
                      <li key={group.id} className="flex items-center p-2 rounded-lg bg-gray-50">
                        <Tag className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">{group.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Info className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">This item is not part of any group</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add to Group
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Components (if assembly) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {item.isAssembly ? 'Assembly Components' : 'Component Of'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.isAssembly && components && components.length > 0 ? (
                  <ul className="space-y-2">
                    {components.map((component, index) => (
                      <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium">{component.item?.name || 'Unknown Item'}</span>
                        </div>
                        <Badge>{component.quantity} units</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Info className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      {item.isAssembly 
                        ? 'No components defined for this assembly' 
                        : 'This item is not used in any assemblies'}
                    </p>
                    {item.isAssembly && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Components
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right column - Item history */}
        <div className="w-full lg:w-96 space-y-6">
          {/* Stock movement history */}
          <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 bg-gray-50">
              <CardTitle className="text-lg">Stock Movement History</CardTitle>
            </CardHeader>
            <div className="max-h-[600px] overflow-y-auto">
              {itemMovements.length > 0 ? (
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gray-200"></div>
                  
                  {itemMovements.map((movement, index) => (
                    <div key={movement.id} className="relative pl-10 pr-4 py-3 hover:bg-gray-50">
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute left-4 top-4 w-3 h-3 rounded-full border-2 border-white",
                        movement.type === 'in' ? 'bg-green-500' : 
                        movement.type === 'out' ? 'bg-red-500' : 'bg-blue-500'
                      )}></div>
                      
                      <p className="text-xs text-gray-500 mb-1">
                        {format(new Date(movement.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                      
                      <div className="flex items-center mb-1">
                        <Badge 
                          variant={
                            movement.type === 'in' ? 'success' : 
                            movement.type === 'out' ? 'danger' : 'info'
                          } 
                          className="mr-2"
                        >
                          {movement.type === 'in' ? 'Stock In' : 
                           movement.type === 'out' ? 'Stock Out' : 'Transfer'}
                        </Badge>
                        <span className="text-sm font-medium">
                          {movement.quantity} {item.unit}
                        </span>
                      </div>
                      
                      {movement.reference && (
                        <p className="text-xs text-gray-600">
                          Reference: {movement.reference}
                        </p>
                      )}
                      
                      {movement.type === 'transfer' && (
                        <p className="text-xs text-gray-600">
                          From: {warehouses.find(w => w.id === movement.fromWarehouseId)?.name || 'Unknown'} 
                          {' → '} 
                          To: {warehouses.find(w => w.id === movement.toWarehouseId)?.name || 'Unknown'}
                        </p>
                      )}
                      
                      {movement.notes && (
                        <p className="text-xs text-gray-600 mt-1">
                          Note: {movement.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Calendar className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No movement history found for this item</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button fullWidth>Add Stock</Button>
              <Button variant="outline" fullWidth>Remove Stock</Button>
              <Button variant="outline" fullWidth>Transfer Stock</Button>
              <Button variant="ghost" fullWidth>Print Barcode</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;