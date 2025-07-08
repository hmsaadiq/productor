import { Timestamp } from 'firebase/firestore';

export interface Order {
  id: string;
  userId: string;
  config: {
    size: string;
    layers: number;
    flavor: string;
    addons: string[];
    text: string;
    price: number;
  };
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: Timestamp;
}

export type OrderConfig = Order['config']; 