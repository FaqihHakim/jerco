import { Order, OrderStatus, Product } from '../types';
import { DEFAULT_CURRENCY } from '../constants';
import { mockProducts, mockBrands } from './productService';

export interface CheckoutData {
  shipping_address: string;
  payment_method: string;
}

let memoizedOrders: Order[] | null = null;

// This function creates the mock data on first run and memoizes it.
// This avoids top-level execution during module loading.
export const getMockOrders = (): Order[] => {
    if (memoizedOrders) {
        return memoizedOrders;
    }

    const findProd = (id: string): Product | undefined => {
        const product = mockProducts.find(p => p.id === id);
        if (!product) return undefined;
        return {
            ...product,
            brand: mockBrands.find(b => b.id === product.brand_id)
        };
    };

    const orders: Order[] = [
        // User 1 (TestUser) - Generalist
        { 
            id: 'order123', user_id: '1', total_amount: 1828475, order_status: OrderStatus.SHIPPED, 
            shipping_address: '123 Main St, Jakarta', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR', 
            created_at: new Date(Date.now() - 86400000 * 32).toISOString(),
            items: [
                { id: 'oi1', order_id: 'order123', product_id: 'p-5', quantity: 1, price_at_purchase: 629475, size: 'M', product: findProd('p-5') },
                { id: 'oi2', order_id: 'order123', product_id: 'a-2', quantity: 1, price_at_purchase: 1200000, size: 'L', product: findProd('a-2') }
            ]
        },
        { 
            id: 'order456', user_id: '1', total_amount: 527560, order_status: OrderStatus.PENDING, 
            shipping_address: '456 Oak Ave, Bandung', payment_method: 'Internal Courier COD', transaction_currency: 'IDR', 
            created_at: new Date(Date.now() - 86400000).toISOString(),
            items: [{ id: 'oi3', order_id: 'order456', product_id: 'p-4', quantity: 1, price_at_purchase: 527560, size: 'XL', product: findProd('p-4') }]
        },

        // User 2 (PumaFan) - Loves Puma products
        {
            id: 'order-puma-fan-1', user_id: '2', total_amount: 1199000, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Puma Fan Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
            items: [{ id: 'oi-pf1', order_id: 'order-puma-fan-1', product_id: 'p-2', quantity: 1, price_at_purchase: 1199000, size: 'L', product: findProd('p-2') }] // Puma
        },
        {
            id: 'order-puma-fan-2', user_id: '2', total_amount: 599250, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Puma Fan Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            items: [{ id: 'oi-pf2', order_id: 'order-puma-fan-2', product_id: 'p-9', quantity: 1, price_at_purchase: 599250, size: 'L', product: findProd('p-9') }] // Puma
        },

        // User 3 (AdidasLover) - Loves Adidas products
        {
            id: 'order-adidas1', user_id: '3', total_amount: 1200000, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Adidas Lover Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
            items: [{ id: 'oi-a1', order_id: 'order-adidas1', product_id: 'a-4', quantity: 1, price_at_purchase: 1200000, size: 'M', product: findProd('a-4') }] // Adidas
        },
        {
            id: 'order-adidas2', user_id: '3', total_amount: 2000000, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Adidas Lover Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            items: [{ id: 'oi-a2', order_id: 'order-adidas2', product_id: 'a-7', quantity: 1, price_at_purchase: 2000000, size: 'M', product: findProd('a-7') }] // Adidas
        },
         // Add a small Puma purchase to make it more realistic
        {
            id: 'order-adidas3', user_id: '3', total_amount: 539550, order_status: OrderStatus.SHIPPED,
            shipping_address: 'Adidas Lover Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            items: [{ id: 'oi-a3', order_id: 'order-adidas3', product_id: 'p-7', quantity: 1, price_at_purchase: 539550, size: 'M', product: findProd('p-7') }] // Puma
        },

        // User 4 (PumaSupporter) - Buys Puma
        {
            id: 'order-puma1', user_id: '4', total_amount: 1999000, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Puma Supporter Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
            items: [{ id: 'oi-p1', order_id: 'order-puma1', product_id: 'p-1', quantity: 1, price_at_purchase: 1999000, size: 'XL', product: findProd('p-1') }] // Puma
        },
         // User 5 (LocalBrandHero) - Buys Ortuseight and some Adidas
        {
            id: 'order-local1', user_id: '5', total_amount: 359100, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Local Hero Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
            items: [{ id: 'oi-l1', order_id: 'order-local1', product_id: 'o-1', quantity: 1, price_at_purchase: 359100, size: 'S', product: findProd('o-1') }] // Ortuseight
        },
        {
            id: 'order-local2', user_id: '5', total_amount: 1200000, order_status: OrderStatus.DELIVERED,
            shipping_address: 'Local Hero Address', payment_method: 'Manual Bank Transfer', transaction_currency: 'IDR',
            created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
            items: [{ id: 'oi-l2', order_id: 'order-local2', product_id: 'a-6', quantity: 1, price_at_purchase: 1200000, size: 'S', product: findProd('a-6') }] // Adidas
        },
    ];

    memoizedOrders = orders;
    return memoizedOrders;
}


export const getAllOrders = async (token: string): Promise<Order[]> => {
    // MOCK: returns all orders, for use in recommendation engine
    console.log("DEV: Fetching all orders for recommendation engine");
    const allOrders = getMockOrders();
    return new Promise(resolve => setTimeout(() => resolve(allOrders), 200));
}


export const checkout = async (token: string, orderDetails: CheckoutData): Promise<Order> => {
  // MOCK IMPLEMENTATION
  console.log('Processing checkout:', { orderDetails, token });
  const allOrders = getMockOrders();
  const newOrder: Order = {
    id: `order-${Math.random().toString(36).substring(2, 9)}`,
    user_id: 'user-1', // Get from token ideally
    total_amount: Math.floor(Math.random() * 1000000) + 500000, // Random total
    order_status: OrderStatus.PENDING,
    shipping_address: orderDetails.shipping_address,
    payment_method: orderDetails.payment_method,
    transaction_currency: DEFAULT_CURRENCY,
    created_at: new Date().toISOString(),
    items: [ /* Should be populated based on cart */ ]
  };
  allOrders.unshift(newOrder); // Add to mock data
  return new Promise(resolve => setTimeout(() => resolve(newOrder), 700));
};

export const getMyOrders = async (token: string): Promise<Order[]> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching my orders with token:', token);
  // This logic should extract user ID from token
  const tokenParts = token.split('-for-');
  const userId = tokenParts.length > 1 ? tokenParts[1] : null;

  const allOrders = getMockOrders();
  return new Promise(resolve => setTimeout(() => {
    if (userId) {
        resolve(allOrders.filter(o => o.user_id === userId));
    } else {
        resolve([]);
    }
  }, 500));
};

export const getOrderById = async (token: string, orderId: string): Promise<Order> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching order by ID:', { orderId, token });
  const allOrders = getMockOrders();
  const order = allOrders.find(o => o.id === orderId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (order) resolve(order);
    else reject(new Error('Order not found'));
  }, 300));
};