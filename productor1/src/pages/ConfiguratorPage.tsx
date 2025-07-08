import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import CakeCustomizer from '../components/CakeCustomizer';
import PriceSummary from '../components/PriceSummary';
import LoginModal from '../components/LoginModal';
import QRCodeModal from '../components/QRCodeModal';
import PaymentForm from '../components/PaymentForm';

export default function ConfiguratorPage() {
  const navigate = useNavigate();
  const { config, user } = useConfig();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const canProceed = config.size && config.flavor;

  const handlePlaceOrder = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPaymentError(null);
    navigate('/confirmation');
  };

  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

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
                {!showPayment && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!canProceed}
                    className={`btn btn-primary w-full ${
                      !canProceed ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {user ? 'Place Order' : 'Login to Order'}
                  </button>
                )}
                {showPayment && user && (
                  <PaymentForm
                    amount={config.price}
                    userEmail={user.email || ''}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
                {paymentError && (
                  <div className="text-red-600 text-sm mt-2">{paymentError}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </div>
  );
} 