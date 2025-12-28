// FRONTEND ORDER CONFIRMATION PAGE: This file defines the ConfirmationPage component for the React frontend.
// It displays the order confirmation, order details, and options to view QR code, order another cake, or view order history.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and modal/dialog pattern for QR code.
// Data Structures: Uses React state (useState), context objects, and props for component communication.
// Security: Redirects unauthenticated users, handles errors securely, and does not expose sensitive data.

// Import React, useEffect, useState, and useRef for component logic, side effects, state management, and refs.
import React, { useEffect, useState, useRef } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import useConfig hook to access global state (user, config, resetConfig).
import { useConfig } from '../context/ConfigContext';
// Import createOrder utility to create a new order in the backend.
import { createOrder } from '../utils/orderService';
// Import QRCodeModal for displaying the order as a QR code.
import QRCodeModal from '../components/QRCodeModal';

// ConfirmationPage component displays order confirmation and details.
export default function ConfirmationPage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Get config, user, and resetConfig from context.
  const { config, user, resetConfig } = useConfig();
  // Local state for order ID after creation.
  const [orderId, setOrderId] = useState<number | null>(null);
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);
  // Local state for loading indicator.
  const [loading, setLoading] = useState(true);
  // Local state for QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  // Ref to prevent duplicate order creation
  const orderCreated = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (orderId !== null || orderCreated.current) return;
    
    const createNewOrder = async () => {
      if (orderCreated.current) return;
      orderCreated.current = true;
      try {
        setLoading(true);
        const id = await createOrder(user, config);
        setOrderId(id);
        setError(null);
        
        // Email notification disabled for now
        // try {
        //   await fetch('https://fcnxfgvbemgdrrcbmeie.supabase.co/functions/v1/send-order-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ record: { id, config, status: 'pending', created_at: new Date().toISOString() } })
        //   });
        //   console.log('Email notification sent successfully');
        // } catch (emailError) {
        //   console.log('Email notification failed:', emailError);
        //   // Don't fail the order if email fails
        // }
      } catch (err) {
        orderCreated.current = false; // Reset on error
        console.error('Full error object:', err);
        setError(`Failed to create order: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error creating order:', err);
      } finally {
        setLoading(false);
      }
    };
    createNewOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle "Order Another Cake" button click.
  const handleContinueShopping = () => {
    resetConfig(); // Reset config to defaults.
    navigate('/customize'); // Go to configurator page.
  };

  // Show loading UI while order is being created.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Processing your order...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error UI if order creation failed.
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => navigate('/customize')}
              className="mt-4 btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the confirmation UI.
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your order number is #{orderId?.toString().slice(-6)}
          </p>

          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Order Details
            </h2>
            <div className="space-y-4">
              {/* Product Type */}
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="text-gray-900 capitalize">{config.productType}</p>
              </div>
              {/* Cake Options */}
              {config.productType === 'cake' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Shape</p>
                    <p className="text-gray-900 capitalize">{config.shape}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="text-gray-900">{config.size}"</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Layers</p>
                    <p className="text-gray-900">{config.layers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flavor</p>
                    <p className="text-gray-900 capitalize">{config.flavor}</p>
                  </div>
                  {config.addons && config.addons.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Add-ons</p>
                      <p className="text-gray-900">
                        {config.addons.map(addon =>
                          addon.charAt(0).toUpperCase() + addon.slice(1)
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                  {config.text && (
                    <div>
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="text-gray-900">{config.text}</p>
                    </div>
                  )}
                </>
              )}
              {/* Cookies/Muffins Options */}
              {(config.productType === 'cookies' || config.productType === 'muffins') && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Box Size</p>
                    <p className="text-gray-900">{config.boxSize ? `Box of ${config.boxSize}` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flavors</p>
                    <p className="text-gray-900 capitalize">
                      {config.boxFlavors && config.boxFlavors.length > 0
                        ? config.boxFlavors.join(', ')
                        : '-'}
                    </p>
                  </div>
                </>
              )}
              {/* Delivery Details */}
              {config.deliveryDetails && config.deliveryDetails.name && (
                <>
                  <div className="border-t pt-4">
                    <span className="text-gray-600 font-bold">Delivery Details</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900">{config.deliveryDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{config.deliveryDetails.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{config.deliveryDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-gray-900">{config.deliveryDetails.state}</p>
                  </div>
                </>
              )}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-lg font-medium text-primary-600">
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'narrowSymbol' }).format(config.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-x-4">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="btn btn-secondary"
            >
              View QR Code
            </button>
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary"
            >
              Order Another Cake
            </button>
            <button
              onClick={() => navigate('/history')}
              className="btn btn-secondary"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>

      {/* QR code modal for displaying order as QR */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </div>
  );
} 