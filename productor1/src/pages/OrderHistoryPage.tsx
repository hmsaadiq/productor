// FRONTEND ORDER HISTORY PAGE: This file defines the OrderHistoryPage component for the React frontend.
// It displays a list of the user's past orders, including details and status.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and presentational component pattern for order cards.
// Data Structures: Uses React state (useState), context objects, arrays for orders, and custom types for order data.
// Security: Only fetches orders for the authenticated user, handles errors securely, and does not expose sensitive data.

// Import React, useEffect, and useState for component logic, side effects, and state management.
import React, { useEffect, useState } from 'react';
// Import useConfig hook to access global user state from context.
import { useConfig } from '../context/ConfigContext';
// Import getUserOrders utility to fetch user's orders from backend.
import { getUserOrders } from '../utils/orderService';
// Import Order type for type safety.
import { Order } from '../types/order';

// OrderHistoryPage component displays the user's order history.
export default function OrderHistoryPage() {
  // Get user from context.
  const { user } = useConfig();
  // Local state for list of orders.
  const [orders, setOrders] = useState<Order[]>([]);
  // Local state for loading indicator.
  const [loading, setLoading] = useState(true);
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);

  // useEffect: Fetch user's orders when component mounts or user changes.
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userOrders = await getUserOrders(user); // Fetch orders from backend.
        setOrders(userOrders); // Store orders in state.
        setError(null);
      } catch (err) {
        setError('Failed to load order history'); // Show error if fetch fails.
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Show loading UI while fetching orders.
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

  // Show error UI if fetch failed.
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

  // Render the order history UI.
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
                      {/* Product type and main info */}
                      {order.config.productType === 'cake'
                        ? `${order.config.size}" ${order.config.flavor} Cake`
                        : order.config.productType === 'cookies'
                        ? `Cookies Box of ${order.config.boxSize}`
                        : order.config.productType === 'muffins'
                        ? `Muffins Box of ${order.config.boxSize}`
                        : ''}
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
                  {/* Cake Options */}
                  {order.config.productType === 'cake' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Shape</p>
                        <p className="text-gray-900 capitalize">{order.config.shape}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Layers</p>
                        <p className="text-gray-900">{order.config.layers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Add-ons</p>
                        <p className="text-gray-900">
                          {order.config.addons && order.config.addons.length > 0
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
                    </>
                  )}
                  {/* Cookies/Muffins Options */}
                  {(order.config.productType === 'cookies' || order.config.productType === 'muffins') && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Box Size</p>
                        <p className="text-gray-900">{order.config.boxSize ? `Box of ${order.config.boxSize}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Flavors</p>
                        <p className="text-gray-900 capitalize">
                          {order.config.boxFlavors && order.config.boxFlavors.length > 0
                            ? order.config.boxFlavors.join(', ')
                            : '-'}</p>
                      </div>
                    </>
                  )}
                  {/* Delivery Details */}
                  {order.config.deliveryDetails && order.config.deliveryDetails.name && (
                    <>
                      <div className="col-span-2 border-t pt-2">
                        <span className="text-gray-600 font-bold">Delivery Details</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-900">{order.config.deliveryDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{order.config.deliveryDetails.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{order.config.deliveryDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="text-gray-900">{order.config.deliveryDetails.state}</p>
                      </div>
                    </>
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