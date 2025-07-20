// FRONTEND ORDER SERVICE UTILITY FILE: This file provides functions for creating orders and fetching user orders in the React frontend.
// It interacts with Firestore to manage order data for the authenticated user.
//
// Design Patterns: Uses the Service pattern for encapsulating order logic, and Factory pattern for Firestore document creation.
// Data Structures: Uses objects for order data, User type for authentication, and async functions for Firestore queries.
// Security: Only fetches orders for the authenticated user, uses Firestore security rules, and does not expose sensitive data.

// Import Firestore database instance from Firebase utility.
import { db } from './firebase';
// Import Firestore functions for document and collection management.
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
// Import User type from Firebase Auth for type safety.
import { User } from 'firebase/auth';
// Import Order and OrderConfig types for type safety.
import { Order, OrderConfig } from '../types/order';

// Utility to recursively remove undefined fields from an object (Firestore does not allow undefined values)
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

// Create a new order in Firestore for the authenticated user.
export const createOrder = async (user: User, config: OrderConfig) => {
  try {
    // Clean config to remove undefined fields (Firestore does not allow undefined values)
    const cleanedConfig = removeUndefined(config);
    // Create order object (excluding Firestore document ID).
    const order: Omit<Order, 'id'> = {
      userId: user.uid,
      config: cleanedConfig,
      status: 'pending',
      createdAt: Timestamp.now(),
    };

    // Add order to Firestore 'orders' collection.
    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id; // Return new order ID.
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Fetch all orders for the authenticated user, ordered by creation date (descending).
export const getUserOrders = async (user: User): Promise<Order[]> => {
  try {
    // Create Firestore query for user's orders, ordered by createdAt.
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Execute query and map results to Order objects.
    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}; 