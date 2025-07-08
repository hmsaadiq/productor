import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { createOrder } from '../utils/orderService';
import QRCodeModal from '../components/QRCodeModal';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { config, user, resetConfig } = useConfig();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const createNewOrder = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const id = await createOrder(user, config);
        setOrderId(id);
        setError(null);
      } catch (err) {
        setError('Failed to create order');
        console.error('Error creating order:', err);
      } finally {
        setLoading(false);
      }
    };

    createNewOrder();
  }, [user, config, navigate]);

  const handleContinueShopping = () => {
    resetConfig();
    navigate('/customize');
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your order number is #{orderId?.slice(-6)}
          </p>

          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Order Details
            </h2>
            <div className="space-y-4">
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
              {config.addons.length > 0 && (
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
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-lg font-medium text-primary-600">
                    ${config.price}
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

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </div>
  );
} 