// FRONTEND CAKE CONFIGURATOR PAGE: This file defines the ConfiguratorPage component for the React frontend.
// It provides the main UI for customizing a cake, showing a summary, and handling payment and authentication.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, modal/dialog pattern, and conditional rendering for payment/auth.
// Data Structures: Uses React state (useState), context objects, and props for component communication.
// Security: Requires authentication for payment, disables payment if config is incomplete, and handles errors securely.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import useConfig hook to access global state (user, config).
import { useConfig } from '../context/ConfigContext';
// Import CakeCustomizer for cake options UI.
import CakeCustomizer from '../components/CakeCustomizer';
// Import PriceSummary for displaying current config and price.
import PriceSummary from '../components/PriceSummary';
// Import LoginModal for authentication.
import LoginModal from '../components/LoginModal';
// Import QRCodeModal for displaying QR code of config.
import QRCodeModal from '../components/QRCodeModal';
// Import PaymentForm for handling payment.
import PaymentForm from '../components/PaymentForm';
// Import DeliveryDetailsPage (to be created) and add navigation to it

// ConfiguratorPage component provides the main cake customization and order flow.
export default function ConfiguratorPage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Get config and user from context.
  const { config, user } = useConfig();
  // Local state for login modal visibility.
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Local state for QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  // Local state for showing payment form.
  const [showPayment, setShowPayment] = useState(false);
  // Local state for payment error messages.
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Boolean for whether the user can proceed (must select required fields based on product)
  const canProceed = (() => {
    if (config.productType === 'cake') {
      return config.size && config.flavor && config.shape;
    } else if (config.productType === 'cookies' || config.productType === 'muffins') {
      return config.boxSize && config.boxFlavors && config.boxFlavors.length > 0;
    }
    return false;
  })();

  // Handle "Next" button click (go to delivery details page)
  const handleNext = () => {
    if (!user) {
      setIsLoginModalOpen(true); // Require login if not authenticated.
      return;
    }
    navigate('/delivery'); // Go to delivery details page
  };

  // Handle successful payment.
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPaymentError(null);
    navigate('/confirmation'); // Go to confirmation page.
  };

  // Handle payment error.
  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

  // Render the configurator UI.
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customizer */}
          <div className="lg:col-span-2">
            <CakeCustomizer />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PriceSummary />
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="btn btn-secondary w-full"
                >
                  Generate QR Code
                </button>
                {/* Proceed to delivery details instead of payment */}
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`btn btn-primary w-full ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {user ? 'Next: Delivery Details' : 'Login to Continue'}
                </button>
                {/* Payment and error handling moved to delivery page */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login modal for authentication */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* QR code modal for displaying config as QR */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </div>
  );
} 