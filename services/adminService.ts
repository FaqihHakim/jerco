import apiService from './api';
import { Product, Order, OrderStatus, AdminDashboardSummary, SalesDataPoint, PaginatedResponse, Brand } from '../types';
import { mockProducts } from './productService';
import { getMockOrders } from './orderService';

// --- Product Management ---
export const addProduct = async (token: string, productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'brand'>): Promise<Product> => {
  // MOCK: In a real app, this would hit an API endpoint
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
    image_url: productData.image_url || `https://picsum.photos/seed/new${Date.now()}/400/300`
  };
  console.log('Admin: Adding product', newProduct);
  return new Promise(resolve => setTimeout(() => resolve(newProduct), 500));
  // return apiService<Product>('/admin/products', { method: 'POST', data: productData, token });
};

export const editProduct = async (token: string, productId: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'brand'>>): Promise<Product> => {
  // MOCK
  console.log('Admin: Editing product', productId, productData);
  const updatedProduct: Product = {
    id: productId,
    name: productData.name || 'Existing Product',
    description: productData.description || 'Existing Description',
    price: productData.price || 0,
    stock_quantity: productData.stock_quantity || 0,
    image_url: productData.image_url || 'https://picsum.photos/seed/edited/400/300',
    brand_id: productData.brand_id || '1',
    sizes: productData.sizes || [],
    updated_at: new Date().toISOString(),
  };
  return new Promise(resolve => setTimeout(() => resolve(updatedProduct), 500));
  // return apiService<Product>(`/admin/products/${productId}`, { method: 'PUT', data: productData, token });
};

export const deleteProduct = async (token: string, productId: string): Promise<void> => {
  // MOCK
  console.log('Admin: Deleting product', productId);
  return new Promise(resolve => setTimeout(resolve, 500));
  // return apiService<void>(`/admin/products/${productId}`, { method: 'DELETE', token });
};

export const updateProductStock = async (token: string, productId: string, stock_quantity: number): Promise<Product> => {
  // MOCK
  console.log('Admin: Updating stock for product', productId, 'to', stock_quantity);
  const updatedProduct: Product = {
    id: productId, name: 'Some Product', description: 'Desc', price: 100, stock_quantity, image_url: '', brand_id: '1',
    updated_at: new Date().toISOString(),
  };
  return new Promise(resolve => setTimeout(() => resolve(updatedProduct), 500));
  // return apiService<Product>(`/admin/products/stock/${productId}`, { method: 'PUT', data: { stock_quantity }, token });
};


// --- Order Management ---
export const getAllAdminOrders = async (token: string, filters?: { status?: OrderStatus; dateFrom?: string; dateTo?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Order>> => {
  // MOCK
  console.log('Admin: Fetching all orders with filters', filters);
  const allMockOrders = getMockOrders();
  let filteredOrders = [...allMockOrders];

  if (filters?.status) {
    filteredOrders = filteredOrders.filter(o => o.order_status === filters.status);
  }

  // NOTE: date filtering not implemented in mock
  const total = filteredOrders.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);
  
  return new Promise(resolve => setTimeout(() => resolve({ items: paginatedOrders, total: total, page: page, limit: limit }), 500));
  // const queryParams = new URLSearchParams(filters as any).toString();
  // return apiService<PaginatedResponse<Order>>(`/admin/orders?${queryParams}`, { method: 'GET', token });
};

export const getAdminOrderById = async (token: string, orderId: string): Promise<Order> => {
  // MOCK
  console.log('Admin: Fetching order by ID', orderId);
  const allMockOrders = getMockOrders();
  const order = allMockOrders.find(o => o.id === orderId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (order) resolve(order);
    else reject(new Error('Order not found'));
  }, 300));
  // return apiService<Order>(`/admin/orders/${orderId}`, { method: 'GET', token });
};

export const updateOrderStatus = async (token: string, orderId: string, status: OrderStatus): Promise<Order> => {
  // MOCK
  console.log('Admin: Updating order status', orderId, status);
  const allMockOrders = getMockOrders();
  const orderToUpdate = allMockOrders.find(o => o.id === orderId);
  if (orderToUpdate) {
    orderToUpdate.order_status = status;
    orderToUpdate.updated_at = new Date().toISOString();
  }
  return new Promise(resolve => setTimeout(() => resolve(orderToUpdate!), 500));
  // return apiService<Order>(`/admin/orders/${orderId}/status`, { method: 'PUT', data: { status }, token });
};

// --- Reports ---
export const getSalesReports = async (token: string, period?: { dateFrom?: string; dateTo?: string }): Promise<SalesDataPoint[]> => {
    // MOCK
    console.log('Admin: Fetching sales reports for period', period);
    const allMockOrders = getMockOrders();
    const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
    allMockOrders.forEach(order => {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toISOString().slice(0, 7); // Format as 'YYYY-MM'
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, orders: 0 };
        }
        monthlyData[monthKey].revenue += order.total_amount;
        monthlyData[monthKey].orders += 1;
    });
    const reportData = Object.keys(monthlyData).map(key => ({
        date: key,
        revenue: monthlyData[key].revenue,
        orders: monthlyData[key].orders,
    })).sort((a, b) => a.date.localeCompare(b.date));
    return new Promise(resolve => setTimeout(() => resolve(reportData), 700));
    // const queryParams = new URLSearchParams(period as any).toString();
    // return apiService<SalesDataPoint[]>(`/admin/reports/sales?${queryParams}`, { method: 'GET', token });
};

export const getAdminDashboardSummary = async (token: string): Promise<AdminDashboardSummary> => {
    // MOCK
    console.log('Admin: Fetching dashboard summary');
    const allMockOrders = getMockOrders();
    const totalRevenue = allMockOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = allMockOrders.length;
    const totalProducts = mockProducts.length;
    const lowStockItemsCount = mockProducts.filter(p => p.stock_quantity === 0).length;

    const summary: AdminDashboardSummary = {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockItemsCount,
        bestSellingProducts: [
            { product_id: '1', name: 'Classic Red Home Jersey', total_sold: 80 },
            { product_id: '3', name: 'Champions Gold Edition Jersey', total_sold: 60 },
        ],
    };
    return new Promise(resolve => setTimeout(() => resolve(summary), 600));
    // return apiService<AdminDashboardSummary>('/admin/reports/dashboard-summary', { method: 'GET', token });
};


// --- Brand Management (Optional) ---
export const getAdminBrands = async (token: string): Promise<Brand[]> => {
  // MOCK
  return new Promise(resolve => setTimeout(() => resolve([
    { id: '1', name: 'Nike', description: 'Just Do It.' },
    { id: '2', name: 'Adidas', description: 'Impossible is Nothing.' },
  ]), 200));
  // return apiService<Brand[]>('/admin/brands', { method: 'GET', token });
};

export const addAdminBrand = async (token: string, brandData: Omit<Brand, 'id'>): Promise<Brand> => {
  // MOCK
  const newBrand: Brand = { ...brandData, id: `brand-${Date.now()}` };
  console.log('Admin: Adding brand', newBrand);
  return new Promise(resolve => setTimeout(() => resolve(newBrand), 300));
  // return apiService<Brand>('/admin/brands', { method: 'POST', data: brandData, token });
};
// PUT and DELETE for brands can be added similarly.