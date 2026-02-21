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
  const { user } = useConfig();

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading cart:', error);
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
  };

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (!user) return;
    
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

  const removeFromCart = async (id: string) => {
    if (!user) return;
    
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

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user || quantity < 1) return;
    
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

  const clearCart = async () => {
    if (!user) return;
    
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

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}