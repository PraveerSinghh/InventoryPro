import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Database, Lock, Building, Info } from 'lucide-react';
import { motion } from 'framer-motion';

import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../utils/cn';

type SettingsTab = 'general' | 'notifications' | 'users' | 'data' | 'security' | 'system';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'users':
        return <UserSettings />;
      case 'data':
        return <DataSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Tabs */}
        <Card className="md:w-64 shrink-0">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <TabButton 
                icon={<Building size={18} />}
                label="Company" 
                isActive={activeTab === 'general'} 
                onClick={() => setActiveTab('general')}
              />
              <TabButton 
                icon={<Bell size={18} />}
                label="Notifications" 
                isActive={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')}
              />
              <TabButton 
                icon={<User size={18} />}
                label="Users & Permissions" 
                isActive={activeTab === 'users'} 
                onClick={() => setActiveTab('users')}
              />
              <TabButton 
                icon={<Database size={18} />}
                label="Data Management" 
                isActive={activeTab === 'data'} 
                onClick={() => setActiveTab('data')}
              />
              <TabButton 
                icon={<Lock size={18} />}
                label="Security" 
                isActive={activeTab === 'security'} 
                onClick={() => setActiveTab('security')}
              />
              <TabButton 
                icon={<Info size={18} />}
                label="System Info" 
                isActive={activeTab === 'system'} 
                onClick={() => setActiveTab('system')}
              />
            </nav>
          </CardContent>
        </Card>
        
        {/* Settings Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg",
        "transition-colors duration-150 ease-in-out",
        isActive 
          ? "text-blue-600 bg-blue-50" 
          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

const GeneralSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input 
              type="text" 
              defaultValue="Your Company"
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              defaultValue="retail"
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "bg-white"
              )}
            >
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="wholesale">Wholesale</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Address
            </label>
            <input 
              type="text" 
              defaultValue="123 Business St, Suite 101"
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "mb-2"
              )}
            />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <input 
                type="text" 
                placeholder="City"
                defaultValue="San Francisco"
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                )}
              />
              <input 
                type="text" 
                placeholder="State/Province"
                defaultValue="CA"
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                )}
              />
              <input 
                type="text" 
                placeholder="Postal Code"
                defaultValue="94103"
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "md:col-span-1"
                )}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            defaultValue="usd"
            className={cn(
              "w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "bg-white"
            )}
          >
            <option value="usd">US Dollar ($)</option>
            <option value="eur">Euro (€)</option>
            <option value="gbp">British Pound (£)</option>
            <option value="jpy">Japanese Yen (¥)</option>
            <option value="cad">Canadian Dollar (C$)</option>
            <option value="aud">Australian Dollar (A$)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <Button variant="outline" size="sm">
              Upload New Logo
            </Button>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Inventory Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-gray-500">Get notified when items reach their reorder point</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="low-stock" 
                  defaultChecked 
                />
                <label 
                  htmlFor="low-stock" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expiry Alerts</p>
                <p className="text-sm text-gray-500">Get notified when items are about to expire</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="expiry-alerts" 
                  defaultChecked 
                />
                <label 
                  htmlFor="expiry-alerts" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Price Change Alerts</p>
                <p className="text-sm text-gray-500">Get notified when item prices are updated</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="price-alerts" 
                />
                <label 
                  htmlFor="price-alerts" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-gray-300"
                >
                  <span className="absolute inset-y-0 left-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Movement Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stock Receipt</p>
                <p className="text-sm text-gray-500">Get notified when new stock is received</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="stock-receipt" 
                  defaultChecked 
                />
                <label 
                  htmlFor="stock-receipt" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stock Transfer</p>
                <p className="text-sm text-gray-500">Get notified when stock is transferred between warehouses</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="stock-transfer" 
                />
                <label 
                  htmlFor="stock-transfer" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-gray-300"
                >
                  <span className="absolute inset-y-0 left-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Large Stock Movements</p>
                <p className="text-sm text-gray-500">Get notified for unusually large stock movements</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="large-movements" 
                  defaultChecked 
                />
                <label 
                  htmlFor="large-movements" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="email-notif" 
                  defaultChecked 
                />
                <label 
                  htmlFor="email-notif" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications in your browser</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="push-notif" 
                  defaultChecked 
                />
                <label 
                  htmlFor="push-notif" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="sms-notif" 
                />
                <label 
                  htmlFor="sms-notif" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-gray-300"
                >
                  <span className="absolute inset-y-0 left-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UserSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users & Permissions</CardTitle>
        <Button size="sm" icon={<Plus size={16} />}>
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      JS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Smith</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  john@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="primary">Admin</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      SJ
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  sarah@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="secondary">Manager</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                      MW
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Michael Wong</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  michael@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="secondary">Manager</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                      LP
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Lisa Peterson</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  lisa@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="info">Staff</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant="danger">Inactive</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Role Permissions</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">Admin</h4>
                <Button variant="outline" size="sm">Edit Role</Button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Full access to all features and settings</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Manage Users</Badge>
                <Badge variant="primary">Manage Items</Badge>
                <Badge variant="primary">Manage Warehouses</Badge>
                <Badge variant="primary">View Reports</Badge>
                <Badge variant="primary">Modify Settings</Badge>
                <Badge variant="primary">Import/Export Data</Badge>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">Manager</h4>
                <Button variant="outline" size="sm">Edit Role</Button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Limited administrative access</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Manage Items</Badge>
                <Badge variant="secondary">Manage Warehouses</Badge>
                <Badge variant="secondary">View Reports</Badge>
                <Badge variant="secondary">Limited Settings</Badge>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">Staff</h4>
                <Button variant="outline" size="sm">Edit Role</Button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Basic inventory management access</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">View Items</Badge>
                <Badge variant="info">Record Movements</Badge>
                <Badge variant="info">View Basic Reports</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DataSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Import/Export</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Import Data</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Import inventory data from CSV, Excel or JSON files
                </p>
                <div className="space-y-2">
                  <Button fullWidth variant="outline">Import Items</Button>
                  <Button fullWidth variant="outline">Import Warehouses</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Export Data</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Export your inventory data to various formats
                </p>
                <div className="space-y-2">
                  <Button fullWidth variant="outline">Export as CSV</Button>
                  <Button fullWidth variant="outline">Export as Excel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Backup & Restore</h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <p className="text-sm text-blue-700">
                Regular backups help protect your inventory data. We recommend creating a backup before making significant changes.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button icon={<Download size={16} />}>
              Create Backup
            </Button>
            <Button variant="outline">
              Restore from Backup
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium">Backup History</h4>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Full Backup</p>
                  <p className="text-sm text-gray-500">June 15, 2025 10:30 AM</p>
                </div>
                <Button variant="ghost" size="sm">
                  Restore
                </Button>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Full Backup</p>
                  <p className="text-sm text-gray-500">May 28, 2025 09:15 AM</p>
                </div>
                <Button variant="ghost" size="sm">
                  Restore
                </Button>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Full Backup</p>
                  <p className="text-sm text-gray-500">May 14, 2025 11:45 AM</p>
                </div>
                <Button variant="ghost" size="sm">
                  Restore
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Data Cleanup</h3>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <p className="text-sm text-amber-700">
                Warning: Data cleanup operations are permanent and cannot be undone. Make sure to create a backup before proceeding.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" fullWidth className="justify-start">
              Archive Old Movement Records
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              Remove Duplicate Items
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              Clear Demo Data
            </Button>
            <Button variant="danger" fullWidth className="justify-start">
              Reset All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SecuritySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Password Policy</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Strong Passwords</p>
                <p className="text-sm text-gray-500">Minimum 8 characters with mixed case, numbers, and symbols</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="strong-password" 
                  defaultChecked 
                />
                <label 
                  htmlFor="strong-password" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password Expiration</p>
                <p className="text-sm text-gray-500">Require password changes every 90 days</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="password-expiration" 
                />
                <label 
                  htmlFor="password-expiration" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-gray-300"
                >
                  <span className="absolute inset-y-0 left-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account Lockout</p>
                <p className="text-sm text-gray-500">Lock account after 5 failed login attempts</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="account-lockout" 
                  defaultChecked 
                />
                <label 
                  htmlFor="account-lockout" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <p className="text-sm text-blue-700">
                Two-factor authentication adds an extra layer of security to your account by requiring a second verification step during login.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require 2FA for Admin Users</p>
              <p className="text-sm text-gray-500">All admin users must set up two-factor authentication</p>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
              <input 
                type="checkbox" 
                className="sr-only" 
                id="admin-2fa" 
                defaultChecked 
              />
              <label 
                htmlFor="admin-2fa" 
                className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
              >
                <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Session Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automatic Logout After Inactivity
              </label>
              <select
                defaultValue="30"
                className={cn(
                  "w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "bg-white"
                )}
              >
                <option value="never">Never</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Remember Login</p>
                <p className="text-sm text-gray-500">Allow users to stay logged in between sessions</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="remember-login" 
                  defaultChecked 
                />
                <label 
                  htmlFor="remember-login" 
                  className="absolute cursor-pointer inset-0 rounded-full bg-blue-600"
                >
                  <span className="absolute inset-y-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform transform translate-x-0"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Activity Logs</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-medium">Recent Security Events</h4>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
              <div className="px-4 py-3">
                <p className="font-medium">User Login</p>
                <p className="text-sm text-gray-500">John Smith - Today at 9:45 AM</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-medium">Password Changed</p>
                <p className="text-sm text-gray-500">Sarah Johnson - Yesterday at 3:20 PM</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-medium">Failed Login Attempt</p>
                <p className="text-sm text-gray-500">Unknown User - Yesterday at 1:15 PM</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-medium">Security Settings Updated</p>
                <p className="text-sm text-gray-500">Admin - June 14, 2025 at 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Software Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium">InventoryPro</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">June 15, 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License</p>
                <p className="font-medium">Commercial</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Database Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">Items</p>
              <p className="text-2xl font-bold text-blue-700">8</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-green-600 font-medium">Warehouses</p>
              <p className="text-2xl font-bold text-green-700">3</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-purple-600 font-medium">Movements</p>
              <p className="text-2xl font-bold text-purple-700">5</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">System Maintenance</h3>
          <div className="space-y-3">
            <Button fullWidth variant="outline" className="justify-start">
              Check for Updates
            </Button>
            <Button fullWidth variant="outline" className="justify-start">
              Optimize Database
            </Button>
            <Button fullWidth variant="outline" className="justify-start">
              Clear Cache
            </Button>
            <Button fullWidth variant="outline" className="justify-start">
              System Diagnostics
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Support & Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Documentation</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Access user guides and documentation
                </p>
                <Button fullWidth variant="outline">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Contact Support</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get help from our support team
                </p>
                <Button fullWidth variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © 2025 Your Company. All rights reserved.
            <br />
            InventoryPro is a product of Your Company, Inc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Settings;