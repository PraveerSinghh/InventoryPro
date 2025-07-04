import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/items':
        return 'Items';
      case '/warehouses':
        return 'Warehouses';
      case '/movements':
        return 'Inventory Movements';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      default:
        if (path.startsWith('/items/')) {
          return 'Item Details';
        }
        return 'Inventory Management';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          title={getPageTitle()}
        />
        
        <main className={cn(
          "flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6",
          "transition-all duration-200 ease-in-out"
        )}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;