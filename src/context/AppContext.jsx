import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSampleData } from '../utils/sampleData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [data, setData] = useState(() => generateSampleData());

  // Calculate derived data
  const lowStockItems = data.items.filter(
    item => item.quantity <= item.reorderPoint
  );

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringItems = data.items.filter(
    item => item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow
  );

  // Item operations
  const addItem = (item) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
  };

  const deleteItem = (id) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  // ... Rest of the context implementation remains the same, just remove TypeScript types

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(data));
  }, [data]);

  return (
    <AppContext.Provider value={{
      ...data,
      lowStockItems,
      expiringItems,
      addItem,
      updateItem,
      deleteItem,
      // ... include all other methods
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}