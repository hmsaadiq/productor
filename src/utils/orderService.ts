// FRONTEND ORDER SERVICE UTILITY FILE: This file provides functions for creating orders and fetching user orders in the React frontend.
// It interacts with Supabase PostgreSQL database to manage order data for the authenticated user.
//
// Design Patterns: Uses the Service pattern for encapsulating order logic, and Factory pattern for database record creation.
// Data Structures: Uses objects for order data, User type for authentication, and async functions for database queries.
// Security: Only fetches orders for the authenticated user, uses Supabase Row Level Security (RLS), and does not expose sensitive data.

// Import Supabase client instance from Supabase utility.
import { supabase } from './supabase';
// Import User type from Supabase Auth for type safety.
import { User } from '@supabase/supabase-js';
// Import Order and OrderConfig types for type safety.
import { Order, OrderConfig } from '../types/order';

// Utility to recursively remove undefined fields from an object (PostgreSQL handles null but undefined should be cleaned)
// function removeUndefined(obj: any): any {
//   if (Array.isArray(obj)) {
//     return obj.map(removeUndefined).filter(item => item !== undefined);
//   } else if (obj && typeof obj === 'object') {
//     const result: any = {};
//     for (const [key, value] of Object.entries(obj)) {
//       if (value !== undefined) {
//         result[key] = removeUndefined(value);
//       }
//     }
//     return result;
//   }
//   return obj;
// }

// Create a new order in Supabase for the authenticated user.
export const createOrder = async (user: User, config: OrderConfig) => {
  try {
    // Validate config before creating order
    if (!config.productType) {
      throw new Error('Product type is required');
    }
    
    if (config.productType === 'cake' && (!config.size || !config.flavor)) {
      throw new Error('Size and flavor are required for cakes');
    }
    
    if ((config.productType === 'cookies' || config.productType === 'muffins') && !config.boxSize) {
      throw new Error('Box size is required for cookies and muffins');
    }

    // Create order object directly without cleaning
    const order = {
      user_id: user.id,
      config: config, // Send as plain object, let Supabase handle JSON conversion
      status: 'pending',
    };
    
    console.log('Order to insert:', JSON.stringify(order, null, 2));

    // Insert order into Supabase 'orders' table.
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      throw new Error(`Database error: ${error.message} (${error.code})`);
    }

    // Send order confirmation email
    // try {
    //   await sendOrderConfirmation({
    //     customerEmail: user.email!,
    //     orderId: data.id,
    //     config: config,
    //   });
    //   console.log('Order confirmation email sent successfully');
    // } catch (emailError) {
    //   console.error('Failed to send confirmation email:', emailError);
    //   // Don't throw error - order was created successfully
    // }

    return data.id; // Return new order ID.
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Fetch all orders for the authenticated user, ordered by creation date (descending).
export const getUserOrders = async (user: User): Promise<Order[]> => {
  try {
    // Query Supabase for user's orders, ordered by createdAt descending.
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};
