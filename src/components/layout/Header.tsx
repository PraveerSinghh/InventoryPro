import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200 z-30 sticky top-0",
      "flex h-16 items-center justify-between px-4 md:px-6"
    )}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 rounded-md text-gray-600 hover:text-gray-900",
            "hover:bg-gray-100 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-blue-500 md:hidden"
          )}
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-2 md:ml-0 text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100",
              "border border-transparent focus:bg-white",
              "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              "transition-all duration-200 outline-none"
            )}
          />
          <Search size={18} className="absolute left-3 text-gray-400" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative p-2 rounded-full text-gray-600",
            "hover:text-gray-900 hover:bg-gray-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
        >
          <Bell size={20} />
          <span className={cn(
            "absolute top-1 right-1 w-2 h-2 rounded-full",
            "bg-red-500 border-2 border-white"
          )} />
        </motion.button>

        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer"
          >
            US
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;