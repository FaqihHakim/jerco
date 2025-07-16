
import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product } from '../types';
import * as cartService from '../services/cartService'; // Assuming service methods
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  selectedCartItemIds: string[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number, size: string) => Promise<void>;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  removeSelectedItems: () => Promise<void>;
  getSelectedSubtotal: () => number;
  totalItemCount: number;
  selectedItemCount: number;
  fetchCart: () => Promise<void>;
  toggleCartItemSelection: (cartItemId: string) => void;
  toggleSelectAll: () => void;
  areAllSelected: boolean;
  getSelectedCartItems: () => CartItem[];
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token || !user) {
      setCartItems([]);
      setSelectedCartItemIds([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const cart = await cartService.getCart(token);
      setCartItems(cart.items);
      // Select all items by default when cart is fetched, unless the cart is empty
      if (cart.items.length > 0) {
        setSelectedCartItemIds(cart.items.map(item => item.id));
      } else {
        setSelectedCartItemIds([]);
      }
    } catch (err: any)      {
      setError(err.message || 'Failed to fetch cart');
      setCartItems([]);
      setSelectedCartItemIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity: number, size: string) => {
    if (!token) {
      setError("Please login to add items to cart.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await cartService.addToCart(token, product, quantity, size);
      await fetchCart();
      
      // Also add the new item to the selected list after fetching
      const cartItemId = `${product.id}-${size}`;
      setSelectedCartItemIds(prev => [...new Set([...prev, cartItemId])]);
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await cartService.updateItem(token, cartItemId, quantity);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await cartService.removeItem(token, cartItemId);
      await fetchCart();
      // Also remove from selection
      setSelectedCartItemIds(prev => prev.filter(id => id !== cartItemId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await cartService.clearCart(token);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeSelectedItems = async () => {
    if(!token) return;
    setIsLoading(true);
    setError(null);
    try {
        const promises = selectedCartItemIds.map(id => cartService.removeItem(token, id));
        await Promise.all(promises);
        await fetchCart();
    } catch(err: any) {
        setError(err.message || 'Failed to remove purchased items');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleCartItemSelection = (cartItemId: string) => {
    setSelectedCartItemIds(prev =>
        prev.includes(cartItemId)
            ? prev.filter(id => id !== cartItemId)
            : [...prev, cartItemId]
    );
  };

  const areAllSelected = useMemo(() => cartItems.length > 0 && selectedCartItemIds.length === cartItems.length, [cartItems, selectedCartItemIds]);

  const toggleSelectAll = () => {
    if (areAllSelected) {
        setSelectedCartItemIds([]);
    } else {
        setSelectedCartItemIds(cartItems.map(item => item.id));
    }
  };

  const getSelectedCartItems = () => {
    return cartItems.filter(item => selectedCartItemIds.includes(item.id));
  };
  
  const getSelectedSubtotal = () => {
    return cartItems
      .filter(item => selectedCartItemIds.includes(item.id))
      .reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + price * item.quantity;
      }, 0);
  };

  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const selectedItemCount = useMemo(() => {
    return cartItems
      .filter(item => selectedCartItemIds.includes(item.id))
      .reduce((count, item) => count + item.quantity, 0);
  }, [cartItems, selectedCartItemIds]);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedCartItemIds,
        isLoading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        removeSelectedItems,
        getSelectedSubtotal,
        totalItemCount,
        selectedItemCount,
        fetchCart,
        toggleCartItemSelection,
        toggleSelectAll,
        areAllSelected,
        getSelectedCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
