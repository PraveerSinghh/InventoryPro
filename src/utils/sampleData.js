export function generateSampleData() {
  // Sample warehouses
  const warehouses = [
    {
      id: '1',
      name: 'Main Warehouse',
      address: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      country: 'India',
      manager: 'Rajesh Kumar',
      phone: '080-12345678',
      email: 'rajesh@example.com',
      isActive: true,
    },
    {
      id: '2',
      name: 'North Warehouse',
      address: '456 Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      zip: '110006',
      country: 'India',
      manager: 'Priya Singh',
      phone: '011-98765432',
      email: 'priya@example.com',
      isActive: true,
    },
    {
      id: '3',
      name: 'West Coast Warehouse',
      address: '789 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400002',
      country: 'India',
      manager: 'Amit Shah',
      phone: '022-45678901',
      email: 'amit@example.com',
      isActive: true,
    }
  ];

  // Sample items with prices in INR
  const items = [
    {
      id: '1',
      name: 'Laptop - Pro Model',
      sku: 'TECH-LP-001',
      description: 'High-performance laptop for professionals',
      category: 'Electronics',
      price: 95999.99,
      cost: 75000.00,
      quantity: 24,
      unit: 'pc',
      warehouseId: '1',
      location: 'Aisle A, Shelf 3',
      reorderPoint: 10,
      barcodes: ['LP00123456'],
      imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      createdAt: '2023-06-01T10:00:00Z',
      updatedAt: '2023-06-01T10:00:00Z',
      groupIds: ['1'],
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'TECH-WM-002',
      description: 'Bluetooth wireless mouse',
      category: 'Electronics',
      price: 2999.99,
      cost: 1500.00,
      quantity: 75,
      unit: 'pc',
      warehouseId: '1',
      location: 'Aisle A, Shelf 2',
      reorderPoint: 25,
      barcodes: ['WM00234567'],
      imageUrl: 'https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      createdAt: '2023-06-01T10:30:00Z',
      updatedAt: '2023-06-01T10:30:00Z',
      groupIds: ['1'],
    },
    // ... continue with the rest of the items with INR prices
  ];

  // Sample item groups
  const itemGroups = [
    {
      id: '1',
      name: 'Computer Accessories',
      description: 'All computer and tech accessories',
      itemIds: ['1', '2', '3']
    },
    {
      id: '2',
      name: 'Health Products',
      description: 'Supplements and health items',
      itemIds: ['4', '5']
    },
    {
      id: '3',
      name: 'Office Furniture',
      description: 'Desks, chairs, and office furniture',
      itemIds: ['6', '7', '8']
    }
  ];

  // Sample movements
  const movements = [
    {
      id: '1',
      type: 'in',
      itemId: '1',
      quantity: 10,
      toWarehouseId: '1',
      reference: 'PO-2023-001',
      notes: 'Initial stock',
      date: '2023-06-01T10:00:00Z',
      performedBy: 'Rajesh Kumar'
    },
    {
      id: '2',
      type: 'in',
      itemId: '2',
      quantity: 25,
      toWarehouseId: '1',
      reference: 'PO-2023-001',
      notes: 'Initial stock',
      date: '2023-06-01T10:30:00Z',
      performedBy: 'Rajesh Kumar'
    }
    // ... continue with the rest of the movements
  ];

  return {
    items,
    warehouses,
    movements,
    itemGroups
  };
}