import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, Warehouse, AlertTriangle, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { items, warehouses, movements, lowStockItems, expiringItems } = useApp();
  
  // Calculate metrics
  const totalItems = items.length;
  const totalStockValue = items.reduce(
    (sum, item) => sum + (item.quantity * item.cost), 
    0
  ).toFixed(2);
  
  const totalStockRetailValue = items.reduce(
    (sum, item) => sum + (item.quantity * item.price), 
    0
  ).toFixed(2);
  
  const potentialProfit = (
    parseFloat(totalStockRetailValue) - parseFloat(totalStockValue)
  ).toFixed(2);
  
  // Prepare chart data
  const stockByCategoryData = {
    labels: Array.from(new Set(items.map(item => item.category))),
    datasets: [
      {
        label: 'Items Count',
        data: Array.from(new Set(items.map(item => item.category))).map(
          category => items.filter(item => item.category === category).length
        ),
        backgroundColor: [
          'rgba(10, 132, 255, 0.6)', 
          'rgba(48, 209, 88, 0.6)',
          'rgba(255, 159, 10, 0.6)',
          'rgba(94, 92, 230, 0.6)',
          'rgba(255, 69, 58, 0.6)'
        ],
        borderColor: [
          'rgba(10, 132, 255, 1)', 
          'rgba(48, 209, 88, 1)',
          'rgba(255, 159, 10, 1)',
          'rgba(94, 92, 230, 1)',
          'rgba(255, 69, 58, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Movement history for the line chart (last 7 movements)
  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
  
  const movementHistoryData = {
    labels: recentMovements.map(m => format(new Date(m.date), 'MM/dd')),
    datasets: [
      {
        label: 'Stock Movement',
        data: recentMovements.map(m => 
          m.type === 'in' ? m.quantity : m.type === 'out' ? -m.quantity : 0
        ),
        borderColor: 'rgb(10, 132, 255)',
        backgroundColor: 'rgba(10, 132, 255, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  // Stock Distribution By Warehouse
  const stockByWarehouseData = {
    labels: warehouses.map(w => w.name),
    datasets: [
      {
        label: 'Stock Items',
        data: warehouses.map(warehouse => 
          items.filter(item => item.warehouseId === warehouse.id).length
        ),
        backgroundColor: [
          'rgba(10, 132, 255, 0.6)',
          'rgba(48, 209, 88, 0.6)',
          'rgba(255, 159, 10, 0.6)',
        ],
        borderColor: [
          'rgba(10, 132, 255, 1)',
          'rgba(48, 209, 88, 1)',
          'rgba(255, 159, 10, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <Button variant="outline" size="sm">
          Last 30 Days
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{totalItems}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="primary" className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>12% increase</span>
                </Badge>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock Value</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${totalStockValue}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="success" className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>8% increase</span>
                </Badge>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Potential Profit</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${potentialProfit}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="warning" className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>5% increase</span>
                </Badge>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Warehouses</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{warehouses.length}</p>
                </div>
                <div className="p-2 bg-sky-50 rounded-lg">
                  <Warehouse className="h-6 w-6 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="info" className="flex items-center">
                  <span>Active</span>
                </Badge>
                <span className="text-xs text-gray-500 ml-2">all warehouses operational</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line 
                  data={movementHistoryData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantity'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Date'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Items by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar 
                  data={stockByCategoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Items'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Warehouse Distribution and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={stockByWarehouseData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Alerts</CardTitle>
              <Badge variant="danger">
                {lowStockItems.length + expiringItems.length} Issues
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {lowStockItems.map((item) => (
                  <div key={`low-${item.id}`} className={cn(
                    "flex items-center p-3 rounded-lg",
                    "bg-red-50 border border-red-100"
                  )}>
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Low stock alert: {item.quantity} remaining (Reorder at: {item.reorderPoint})
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Reorder
                    </Button>
                  </div>
                ))}
                
                {expiringItems.map((item) => (
                  <div key={`exp-${item.id}`} className={cn(
                    "flex items-center p-3 rounded-lg",
                    "bg-amber-50 border border-amber-100"
                  )}>
                    <div className="p-2 bg-amber-100 rounded-full mr-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expiring soon: {item.expiryDate ? format(new Date(item.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
                
                {lowStockItems.length === 0 && expiringItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-3 bg-green-100 rounded-full mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">All inventory items are at healthy levels!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;