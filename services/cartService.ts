
import apiService from './api';
import { Cart, CartItem, Product } from '../types';

// This will act as our mock "database" for the cart
const mockUserCart: Cart = {
  id: 'cart-123',
  user_id: 'user-1',
  items: [],
  created_at: new Date().toISOString(),
};


export const getCart = async (token: string): Promise<Cart> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching cart with token:', token);
  return new Promise(resolve => setTimeout(() => resolve(mockUserCart), 300));
};

export const addToCart = async (token: string, product: Product, quantity: number, size: string): Promise<CartItem> => {
  // MOCK IMPLEMENTATION
  console.log('Adding to cart:', { product, quantity, size, token });
  const cartItemId = `${product.id}-${size}`;

  const existingItemIndex = mockUserCart.items.findIndex(item => item.id === cartItemId);

  if (existingItemIndex > -1) {
    mockUserCart.items[existingItemIndex].quantity += quantity;
    return new Promise(resolve => setTimeout(() => resolve(mockUserCart.items[existingItemIndex]), 300));
  } else {
    const newItem: CartItem = {
      id: cartItemId,
      product_id: product.id,
      quantity,
      size,
      product,
    };
    mockUserCart.items.push(newItem);
    return new Promise(resolve => setTimeout(() => resolve(newItem), 300));
  }
};

export const updateItem = async (token: string, cartItemId: string, quantity: number): Promise<CartItem> => {
  // MOCK IMPLEMENTATION
  console.log('Updating cart item:', { cartItemId, quantity, token });
  const itemIndex = mockUserCart.items.findIndex(item => item.id === cartItemId);
  if (itemIndex > -1) {
    if (quantity > 0) {
      mockUserCart.items[itemIndex].quantity = quantity;
    } else {
      // Remove if quantity is 0 or less
      mockUserCart.items.splice(itemIndex, 1);
    }
    return new Promise(resolve => setTimeout(() => resolve(mockUserCart.items[itemIndex]), 300));
  }
  return Promise.reject(new Error("Item not found"));
};

export const removeItem = async (token: string, cartItemId: string): Promise<void> => {
  // MOCK IMPLEMENTATION
  console.log('Removing item from cart:', { cartItemId, token });
  const initialLength = mockUserCart.items.length;
  mockUserCart.items = mockUserCart.items.filter(item => item.id !== cartItemId);
  if (mockUserCart.items.length < initialLength) {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
  return Promise.reject(new Error("Item not found"));
};

export const clearCart = async (token: string): Promise<void> => {
  // MOCK IMPLEMENTATION
  console.log('Clearing cart with token:', token);
  mockUserCart.items = [];
  return new Promise(resolve => setTimeout(resolve, 300));
};
