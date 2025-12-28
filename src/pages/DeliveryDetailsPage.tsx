// FRONTEND DELIVERY DETAILS PAGE: This file defines the DeliveryDetailsPage component for the React frontend.
// It collects delivery details (name, address, phone, state) and stores them in context before proceeding to payment/confirmation.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, controlled component pattern for form inputs, and validation.
// Data Structures: Uses context objects, local state for form, and arrays for state options.
// Security: Validates input, requires all fields, and does not expose sensitive data.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import PriceSummary from '../components/PriceSummary';
import PaymentForm from '../components/PaymentForm';

// List of Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const { config, setConfig, user } = useConfig();
  // Local state for form fields
  const [form, setForm] = useState({
    name: config.deliveryDetails.name || '',
    address: config.deliveryDetails.address || '',
    phone: config.deliveryDetails.phone || '',
    state: config.deliveryDetails.state || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validate = () => {
    if (!form.name || !form.address || !form.phone || !form.state) {
      setError('All fields are required.');
      return false;
    }
    if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) {
      setError('Enter a valid phone number (10-15 digits).');
      return false;
    }
    setError(null);
    return true;
  };

  // Handle "Proceed to Payment" button
  const handleProceed = () => {
    if (!validate()) return;
    setConfig({ ...config, deliveryDetails: { ...form } });
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPaymentError(null);
    navigate('/confirmation');
  };

  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

  // If not logged in, redirect to home
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Delivery Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Form */}
          <div>
            <form
              onSubmit={e => { e.preventDefault(); handleProceed(); }}
              className="space-y-4 bg-white p-6 rounded-lg shadow-sm"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="e.g. 08012345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              {!showPayment && (
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-4"
                >
                  Proceed to Payment
                </button>
              )}
            </form>
          </div>
          {/* Order Summary and Payment */}
          <div>
            <PriceSummary />
            {showPayment && user && (
              <div className="mt-6">
                <PaymentForm
                  amount={config.price}
                  userEmail={user.email || ''}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                {paymentError && (
                  <div className="text-red-600 text-sm mt-2">{paymentError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 