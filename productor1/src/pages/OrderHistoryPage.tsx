import React, { useEffect, useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { getUserOrders } from '../utils/orderService';
import { Order } from '../types/order';

export default function OrderHistoryPage() {
  const { user } = useConfig();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userOrders = await getUserOrders(user);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Failed to load order history');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Loading order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-sm rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {order.config.size}" {order.config.flavor} Cake
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.createdAt && typeof order.createdAt === 'object' && typeof order.createdAt.toDate === 'function'
                        ? order.createdAt.toDate().toLocaleDateString()
                        : new Date(order.createdAt as any).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Layers</p>
                    <p className="text-gray-900">{order.config.layers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Add-ons</p>
                    <p className="text-gray-900">
                      {order.config.addons.length > 0
                        ? order.config.addons.join(', ')
                        : 'None'}
                    </p>
                  </div>
                  {order.config.text && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="text-gray-900">{order.config.text}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-lg font-medium text-primary-600">
                      ${order.config.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 