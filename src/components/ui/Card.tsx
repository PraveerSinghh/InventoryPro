import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hoverable = false,
  interactive = false,
  onClick
}) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden";
  const hoverStyles = hoverable ? "transition-all duration-200 hover:shadow-md" : "";
  const interactiveStyles = interactive ? "cursor-pointer" : "";
  
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.01 } : {}}
      whileTap={interactive ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={cn(baseStyles, hoverStyles, interactiveStyles, className)}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-800", className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };