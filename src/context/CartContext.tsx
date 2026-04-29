import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { useConfig } from './ConfigContext';

export interface CartItem {
  id?: string;
  productType: 'cake' | 'cookies' | 'muffins';
  customization: any; // The config object from ConfigContext
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useConfig();

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setLoading(false);
    }
    // Guest items are kept in local state — no clearing on mount
  }, [user]);

  // Fetches the authenticated user's cart from Supabase and syncs it into local state.
  const loadCart = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
      return;
    }

    // Map database fields to interface properties
    const mappedItems = (data || []).map(item => ({
      id: item.id,
      productType: item.product_type,
      customization: item.customization,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));

    setItems(mappedItems);
    setLoading(false);
  };

  // Persists a new item to Supabase for authenticated users; falls back to local state for guests.
  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (!user) {
      // Guest: add to local state only with a temporary ID
      const guestItem: CartItem = {
        id: `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...item,
      };
      setItems(prev => [...prev, guestItem]);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_type: item.productType,
        customization: item.customization,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return;
    }

    // Map database response to interface properties
    const mappedItem = {
      id: data.id,
      productType: data.product_type,
      customization: data.customization,
      quantity: data.quantity,
      unitPrice: data.unit_price,
    };

    setItems(prev => [...prev, mappedItem]);
  };

  // Deletes an item by ID from Supabase (authenticated) or local state (guest).
  const removeFromCart = async (id: string) => {
    if (!user) {
      // Guest: remove from local state only
      setItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from cart:', error);
      return;
    }

    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Updates the quantity of a cart item; rejects values below 1.
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (!user) {
      // Guest: update local state only
      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating quantity:', error);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Removes all items for the current user from Supabase (authenticated) or resets local state (guest).
  const clearCart = async () => {
    if (!user) {
      // Guest: clear local state only
      setItems([]);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      return;
    }

    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for consuming CartContext; throws if used outside CartProvider.
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}