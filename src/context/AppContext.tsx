import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Warehouse, Movement, ItemGroup } from '../types';
import { generateSampleData } from '../utils/sampleData';

interface AppContextType {
  items: Item[];
  itemGroups: ItemGroup[];
  warehouses: Warehouse[];
  movements: Movement[];
  lowStockItems: Item[];
  expiringItems: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id' | 'date'>) => void;
  addItemGroup: (group: Omit<ItemGroup, 'id'>) => void;
  updateItemGroup: (id: string, group: Partial<ItemGroup>) => void;
  deleteItemGroup: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, updatedFields: Partial<Item>) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
  };

  const deleteItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  // Warehouse operations
  const addWarehouse = (warehouse: Omit<Warehouse, 'id'>) => {
    const newWarehouse = {
      ...warehouse,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      warehouses: [...prev.warehouses, newWarehouse]
    }));
  };

  const updateWarehouse = (id: string, updatedFields: Partial<Warehouse>) => {
    setData(prev => ({
      ...prev,
      warehouses: prev.warehouses.map(warehouse => 
        warehouse.id === id ? { ...warehouse, ...updatedFields } : warehouse
      )
    }));
  };

  const deleteWarehouse = (id: string) => {
    setData(prev => ({
      ...prev,
      warehouses: prev.warehouses.filter(warehouse => warehouse.id !== id)
    }));
  };

  // Movement operations
  const addMovement = (movement: Omit<Movement, 'id' | 'date'>) => {
    const newMovement = {
      ...movement,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setData(prev => {
      // Update the item quantity based on the movement
      const updatedItems = prev.items.map(item => {
        if (item.id === movement.itemId) {
          const quantityChange = movement.type === 'in' 
            ? movement.quantity 
            : -movement.quantity;
          
          return {
            ...item,
            quantity: item.quantity + quantityChange,
            warehouseId: movement.toWarehouseId || item.warehouseId
          };
        }
        return item;
      });
      
      return {
        ...prev,
        items: updatedItems,
        movements: [...prev.movements, newMovement]
      };
    });
  };

  // Item Group operations
  const addItemGroup = (group: Omit<ItemGroup, 'id'>) => {
    const newGroup = {
      ...group,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      itemGroups: [...prev.itemGroups, newGroup]
    }));
  };

  const updateItemGroup = (id: string, updatedFields: Partial<ItemGroup>) => {
    setData(prev => ({
      ...prev,
      itemGroups: prev.itemGroups.map(group => 
        group.id === id ? { ...group, ...updatedFields } : group
      )
    }));
  };

  const deleteItemGroup = (id: string) => {
    setData(prev => ({
      ...prev,
      itemGroups: prev.itemGroups.filter(group => group.id !== id)
    }));
  };

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
      addWarehouse,
      updateWarehouse,
      deleteWarehouse,
      addMovement,
      addItemGroup,
      updateItemGroup,
      deleteItemGroup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};