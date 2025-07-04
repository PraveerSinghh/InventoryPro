// Item related types
export interface Item {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  unit: string;
  warehouseId: string;
  location?: string;
  reorderPoint: number;
  expiryDate?: string;
  barcodes?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  groupIds?: string[];
  isAssembly?: boolean;
  components?: ItemComponent[];
}

export interface ItemComponent {
  itemId: string;
  quantity: number;
}

// Item grouping
export interface ItemGroup {
  id: string;
  name: string;
  description?: string;
  itemIds: string[];
}

// Warehouse types
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  manager?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

// Movement tracking
export interface Movement {
  id: string;
  type: 'in' | 'out' | 'transfer';
  itemId: string;
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  reference?: string;
  notes?: string;
  date: string;
  performedBy?: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalItems: number;
  totalStockValue: number;
  lowStockItems: number;
  itemsWithMovement: number;
  totalWarehouses: number;
  totalItemGroups: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
}

// Settings
export interface SystemSettings {
  company: {
    name: string;
    logo?: string;
    address?: string;
    currency: string;
  };
  notifications: {
    lowStockAlert: boolean;
    expiryAlert: boolean;
    moveAlert: boolean;
  };
}