import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Order, OrderConfig } from '../types/order';

export const createOrder = async (user: User, config: OrderConfig) => {
  try {
    // Create order in Firestore
    const order: Omit<Order, 'id'> = {
      userId: user.uid,
      config,
      status: 'pending',
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'orders'), order);

    // Send order confirmation email
    await fetch('/api/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: docRef.id,
        userEmail: user.email,
        config,
      }),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('Order not found');
    }

    return orderSnap.data() as Order;
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
}; 