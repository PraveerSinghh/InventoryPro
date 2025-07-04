import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, DollarSign, Package, Warehouse } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ReportType = 'inventory' | 'movement' | 'value' | 'categories';

const Reports: React.FC = () => {
  const { items, warehouses, movements, itemGroups } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportType>('inventory');
  const [timeRange, setTimeRange] = useState('30days');
  
  // Prepare data for inventory by warehouse report
  const inventoryByWarehouseData = {
    labels: warehouses.map(w => w.name),
    datasets: [
      {
        label: 'Number of Items',
        data: warehouses.map(warehouse => 
          items.filter(item => item.warehouseId === warehouse.id).length
        ),
        backgroundColor: [
          'rgba(10, 132, 255, 0.6)',
          'rgba(48, 209, 88, 0.6)',
          'rgba(255, 159, 10, 0.6)',
          'rgba(94, 92, 230, 0.6)',
        ],
        borderColor: [
          'rgba(10, 132, 255, 1)',
          'rgba(48, 209, 88, 1)',
          'rgba(255, 159, 10, 1)',
          'rgba(94, 92, 230, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for inventory value by warehouse report
  const inventoryValueData = {
    labels: warehouses.map(w => w.name),
    datasets: [
      {
        label: 'Total Value ($)',
        data: warehouses.map(warehouse => {
          const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
          return warehouseItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
        }),
        backgroundColor: 'rgba(10, 132, 255, 0.6)',
        borderColor: 'rgba(10, 132, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for items by category
  const itemsByCategoryData = {
    labels: Array.from(new Set(items.map(item => item.category))),
    datasets: [
      {
        label: 'Number of Items',
        data: Array.from(new Set(items.map(item => item.category))).map(
          category => items.filter(item => item.category === category).length
        ),
        backgroundColor: [
          'rgba(10, 132, 255, 0.6)',
          'rgba(48, 209, 88, 0.6)',
          'rgba(255, 159, 10, 0.6)',
          'rgba(94, 92, 230, 0.6)',
          'rgba(255, 69, 58, 0.6)',
        ],
        borderColor: [
          'rgba(10, 132, 255, 1)',
          'rgba(48, 209, 88, 1)',
          'rgba(255, 159, 10, 1)',
          'rgba(94, 92, 230, 1)',
          'rgba(255, 69, 58, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for movement history (last 7 days)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  const movementHistoryData = {
    labels: last7Days.map(date => {
      const [year, month, day] = date.split('-');
      return `${month}/${day}`;
    }),
    datasets: [
      {
        label: 'Stock In',
        data: last7Days.map(date => {
          return movements
            .filter(m => 
              m.type === 'in' && 
              m.date.split('T')[0] === date
            )
            .reduce((sum, m) => sum + m.quantity, 0);
        }),
        borderColor: 'rgb(48, 209, 88)',
        backgroundColor: 'rgba(48, 209, 88, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Stock Out',
        data: last7Days.map(date => {
          return movements
            .filter(m => 
              m.type === 'out' && 
              m.date.split('T')[0] === date
            )
            .reduce((sum, m) => sum + m.quantity, 0);
        }),
        borderColor: 'rgb(255, 69, 58)',
        backgroundColor: 'rgba(255, 69, 58, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  // Render different report based on selection
  const renderReport = () => {
    switch (selectedReport) {
      case 'inventory':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Warehouse className="h-5 w-5 mr-2 text-blue-500" />
                  Inventory by Warehouse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut 
                    data={inventoryByWarehouseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        title: {
                          display: true,
                          text: 'Item Distribution Across Warehouses'
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {warehouses.map(warehouse => {
                const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
                const totalItems = warehouseItems.length;
                const totalUnits = warehouseItems.reduce((sum, item) => sum + item.quantity, 0);
                const lowStockItems = warehouseItems.filter(item => item.quantity <= item.reorderPoint).length;
                
                return (
                  <Card key={warehouse.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium">Items</p>
                          <p className="text-2xl font-bold text-blue-700">{totalItems}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">Units</p>
                          <p className="text-2xl font-bold text-green-700">{totalUnits}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-xs text-amber-600 font-medium">Low Stock</p>
                          <p className="text-2xl font-bold text-amber-700">{lowStockItems}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
                        <div className="space-y-2">
                          {Array.from(new Set(warehouseItems.map(item => item.category)))
                            .slice(0, 3)
                            .map(category => {
                              const count = warehouseItems.filter(item => item.category === category).length;
                              const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
                              
                              return (
                                <div key={category} className="flex items-center">
                                  <span className="text-sm w-1/3">{category}</span>
                                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 ml-2 w-12 text-right">
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
        
      case 'value':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Inventory Value by Warehouse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar 
                    data={inventoryValueData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: 'Total Inventory Value by Warehouse ($)'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Value ($)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Inventory Value by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Number of Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost Value
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Retail Value
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Potential Profit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from(new Set(items.map(item => item.category))).map(category => {
                        const categoryItems = items.filter(item => item.category === category);
                        const itemCount = categoryItems.length;
                        const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
                        const costValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
                        const retailValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                        const potentialProfit = retailValue - costValue;
                        
                        return (
                          <tr key={category} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {itemCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {totalQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              ${costValue.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              ${retailValue.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                              <span className={potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ${potentialProfit.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {items.length}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {items.reduce((sum, item) => sum + item.quantity, 0)}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ${items.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ${items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ${(
                            items.reduce((sum, item) => sum + (item.quantity * item.price), 0) - 
                            items.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
                          ).toFixed(2)}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'categories':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-purple-500" />
                  Items by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut 
                    data={itemsByCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        title: {
                          display: true,
                          text: 'Item Distribution by Category'
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(items.map(item => item.category))).map(category => {
                    const categoryItems = items.filter(item => item.category === category);
                    const totalItems = categoryItems.length;
                    const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
                    const averagePrice = totalItems > 0 
                      ? categoryItems.reduce((sum, item) => sum + item.price, 0) / totalItems 
                      : 0;
                    
                    return (
                      <div 
                        key={category} 
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Items</p>
                            <p className="font-medium">{totalItems}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="font-medium">{totalQuantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Avg. Price</p>
                            <p className="font-medium">${averagePrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Low Stock</p>
                            <p className="font-medium">
                              {categoryItems.filter(item => item.quantity <= item.reorderPoint).length}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'movement':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Stock Movement History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line 
                    data={movementHistoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Stock Movement Trends (Last 7 Days)'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Quantity'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Movement Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-green-100 rounded-full mr-3">
                        <ArrowLeft className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-green-800">Stock In</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-800">
                      {movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {movements.filter(m => m.type === 'in').length} transactions
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-red-100 rounded-full mr-3">
                        <ArrowLeft className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-red-800">Stock Out</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-800">
                      {movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0)}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {movements.filter(m => m.type === 'out').length} transactions
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-blue-800">Transfers</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-800">
                      {movements.filter(m => m.type === 'transfer').reduce((sum, m) => sum + m.quantity, 0)}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {movements.filter(m => m.type === 'transfer').length} transactions
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3">Top Moving Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock In
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock Out
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transfers
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Movements
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items
                        .map(item => {
                          const itemMovements = movements.filter(m => m.itemId === item.id);
                          const stockIn = itemMovements
                            .filter(m => m.type === 'in')
                            .reduce((sum, m) => sum + m.quantity, 0);
                          const stockOut = itemMovements
                            .filter(m => m.type === 'out')
                            .reduce((sum, m) => sum + m.quantity, 0);
                          const transfers = itemMovements
                            .filter(m => m.type === 'transfer')
                            .reduce((sum, m) => sum + m.quantity, 0);
                          const totalMovements = itemMovements.length;
                          
                          return {
                            item,
                            stockIn,
                            stockOut,
                            transfers,
                            totalMovements
                          };
                        })
                        .sort((a, b) => b.totalMovements - a.totalMovements)
                        .slice(0, 5)
                        .map(({ item, stockIn, stockOut, transfers, totalMovements }) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {item.imageUrl ? (
                                    <img 
                                      className="h-10 w-10 rounded-md object-cover" 
                                      src={item.imageUrl} 
                                      alt={item.name} 
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                      <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.sku}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-medium">
                              {stockIn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-medium">
                              {stockOut}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-medium">
                              {transfers}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">
                              {totalMovements}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <Button variant="outline" icon={<Download size={16} />}>
          Export Report
        </Button>
      </div>
      
      {/* Report Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex space-x-2 flex-wrap">
              <Button
                variant={selectedReport === 'inventory' ? 'primary' : 'outline'}
                onClick={() => setSelectedReport('inventory')}
                icon={<Warehouse size={16} />}
              >
                Inventory Status
              </Button>
              <Button
                variant={selectedReport === 'value' ? 'primary' : 'outline'}
                onClick={() => setSelectedReport('value')}
                icon={<DollarSign size={16} />}
              >
                Value Analysis
              </Button>
              <Button
                variant={selectedReport === 'categories' ? 'primary' : 'outline'}
                onClick={() => setSelectedReport('categories')}
                icon={<Package size={16} />}
              >
                Category Analysis
              </Button>
              <Button
                variant={selectedReport === 'movement' ? 'primary' : 'outline'}
                onClick={() => setSelectedReport('movement')}
                icon={<TrendingUp size={16} />}
              >
                Movement History
              </Button>
            </div>
            
            <div className="ml-auto">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={cn(
                  "px-3 py-2 rounded-lg border border-gray-300",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "outline-none bg-white"
                )}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="alltime">All time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Content */}
      {renderReport()}
    </div>
  );
};

export default Reports;