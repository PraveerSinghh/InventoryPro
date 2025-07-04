import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  X 
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Items', path: '/items', icon: <Package size={20} /> },
    { name: 'Warehouses', path: '/warehouses', icon: <Warehouse size={20} /> },
    { name: 'Movements', path: '/movements', icon: <ArrowLeftRight size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    open: { opacity: 0.5, display: 'block' },
    closed: { opacity: 0, display: 'none', transition: { delay: 0.2 } }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar for mobile */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-40",
          "shadow-lg flex flex-col md:hidden"
        )}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <SidebarContent closeSidebar={closeSidebar} navItems={navItems} />
      </motion.div>

      {/* Sidebar for desktop */}
      <div className={cn(
        "hidden md:flex md:flex-col",
        "w-64 bg-white border-r border-gray-200"
      )}>
        <SidebarContent closeSidebar={() => {}} navItems={navItems} />
      </div>
    </>
  );
};

interface SidebarContentProps {
  closeSidebar: () => void;
  navItems: Array<{ name: string; path: string; icon: React.ReactNode }>;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ closeSidebar, navItems }) => {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-600">InventoryPro</h2>
        <button 
          onClick={closeSidebar}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2.5 rounded-lg",
              "transition-colors duration-200",
              isActive 
                ? "text-blue-600 bg-blue-50 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => closeSidebar()}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">InventoryPro v1.0</p>
          <p className="text-xs text-gray-500 mt-1">© 2025 Your Company</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;